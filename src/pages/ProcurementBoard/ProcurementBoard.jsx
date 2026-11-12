import { useCallback, useMemo, useState } from 'react';
import Column from '../../components/board/Column/Column';
import OrderTable from '../../components/board/OrderTable/OrderTable';
import Modal from '../../components/common/modal/Modal';
import OrderDetails from '../../components/board/OrderDetails/OrderDetails';
import RequestForm from '../../components/board/RequestForm/RequestForm';
import Toast from '../../components/common/Toast/Toast';
import Button from '../../components/button/Button';
import { DIRECTOR_LIMIT, STAGES } from '../../utils/constants';
import { canMoveOrder } from '../../utils/rules';
import { getOrders, saveOrders } from '../../data/orderStorage';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import './ProcurementBoard.css';
import ActivityLog from '../../components/activity/ActivityLog';

export default function ProcurementBoard() {
    const [orders, setOrders] = useState(getOrders);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [toastMessage, setToastMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeMobileStage, setActiveMobileStage] = useState(STAGES[0].id);
    const [activeStageFilter, setActiveStageFilter] = useState('all');
    const [modalMode, setModalMode] = useState(null);
    const [viewMode, setViewMode] = useState('board');

    const triggerToast = useCallback((msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 3500);
    }, []);

    const commitOrders = useCallback((nextOrders) => {
        setOrders(nextOrders);
        saveOrders(nextOrders);
    }, []);

    const handleTableStageChange = useCallback((orderId, targetStage) => {
        const order = orders.find((item) => item.id === orderId);
        if (!order) return;

        const validation = canMoveOrder(order, targetStage);
        if (!validation.allowed) {
            triggerToast(validation.reason);
            return;
        }

        commitOrders(
            orders.map((item) => (item.id === orderId ? { ...item, stage: targetStage } : item))
        );
    }, [commitOrders, orders, triggerToast]);

    const {
        draggedOrderId,
        activeDropColumn,
        handleDragStart,
        handleDragOver,
        handleDragLeave,
        handleDrop
    } = useDragAndDrop(orders, commitOrders, triggerToast);

    const searchKey = searchTerm.trim().toLowerCase();
    const filteredOrders = useMemo(() => orders.filter((order) => (
        !searchKey
        || order.title.toLowerCase().includes(searchKey)
        || order.id.toLowerCase().includes(searchKey)
        || order.vendor.toLowerCase().includes(searchKey)
    )), [orders, searchKey]);

    const stageOrders = useMemo(() => {
        const grouped = Object.fromEntries(STAGES.map((stage) => [stage.id, []]));

        for (const order of filteredOrders) {
            grouped[order.stage]?.push(order);
        }

        return grouped;
    }, [filteredOrders]);

    const stageFilteredOrders = useMemo(() => (
        activeStageFilter === 'all'
            ? filteredOrders
            : filteredOrders.filter((order) => order.stage === activeStageFilter)
    ), [activeStageFilter, filteredOrders]);

    const closeModal = useCallback(() => {
        setModalMode(null);
        setSelectedOrder(null);
    }, []);

    const openNewRequest = useCallback(() => {
        setSelectedOrder(null);
        setModalMode('create');
    }, []);

    const openOrderDetails = useCallback((order) => {
        setSelectedOrder(order);
        setModalMode('details');
    }, []);

    const openActivityLog = useCallback(() => {
        setModalMode('activity');
    }, []);

    const saveRequest = useCallback((request) => {
        if (modalMode === 'create') {
            const highestNumber = orders.reduce((highest, order) => {
                const number = Number(order.id.replace(/\D/g, '')) || 0;
                return Math.max(highest, number);
            }, 0);
            const nextNumber = highestNumber + 1;
            const newOrder = {
                ...request,
                id: `PR-${String(nextNumber).padStart(4, '0')}`,
                stage: 'pending',
            };

            commitOrders([...orders, newOrder]);
            setActiveMobileStage('pending');
            setActiveStageFilter('all');
            triggerToast(`${newOrder.id} created and added to Pending Review.`);
            closeModal();
            return;
        }

        const updatedOrders = orders.map((order) => (
            order.id === request.id ? { ...order, ...request } : order
        ));
        commitOrders(updatedOrders);
        setSelectedOrder(request);
        setModalMode('details');
        triggerToast(`${request.id} updated.`);
    }, [closeModal, commitOrders, modalMode, orders, triggerToast]);

    const toggleDirectorSignoff = useCallback(() => {
        if (!selectedOrder || selectedOrder.amount <= DIRECTOR_LIMIT) return;

        const isRevoking = selectedOrder.directorSigned;
        const needsReturnToApproval = isRevoking
            && ['po', 'delivered'].includes(selectedOrder.stage);
        const nextOrder = {
            ...selectedOrder,
            directorSigned: !isRevoking,
            stage: needsReturnToApproval ? 'director' : selectedOrder.stage,
        };

        const updatedOrders = orders.map((order) => (
            order.id === nextOrder.id ? nextOrder : order
        ));
        commitOrders(updatedOrders);
        setSelectedOrder(nextOrder);

        if (needsReturnToApproval) {
            setActiveMobileStage('director');
            triggerToast(`${nextOrder.id} returned to Director Approval for sign-off.`);
            return;
        }

        const message = isRevoking
            ? 'director sign-off revoked.'
            : 'marked as director signed.';
        triggerToast(`${nextOrder.id} ${message}`);
    }, [commitOrders, orders, selectedOrder, triggerToast]);

    const returnToDetails = useCallback(() => setModalMode('details'), []);
    const openEditRequest = useCallback(() => setModalMode('edit'), []);

    return (
        <div className="procurement-layout">
            <header className="procurement-topbar">
                <h1>📦 Purchasing &amp; Approval Board</h1>
                <div className="procurement-tools">
                    <input
                        className="procurement-search"
                        placeholder="Search orders, vendors…"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="view-mode-toggle" role="group" aria-label="View mode">
                        <button
                            type="button"
                            aria-pressed={viewMode === 'board'}
                            onClick={() => setViewMode('board')}
                        >
                            Board
                        </button>
                        <button
                            type="button"
                            aria-pressed={viewMode === 'table'}
                            onClick={() => setViewMode('table')}
                        >
                            Table
                        </button>
                    </div>
                    <Button variant="primary" onClick={openNewRequest}>+ New Request</Button>
                    <Button variant="primary" onClick={openActivityLog}>View Activity Log</Button>
                </div>
            </header>

            {viewMode === 'board' && (
                <nav className="mobile-stage-tabs" aria-label="Order stages">
                    {STAGES.map((stage) => {
                        const count = stageOrders[stage.id].length;

                        return (
                            <button
                                key={stage.id}
                                className="mobile-stage-tab"
                                type="button"
                                aria-pressed={activeMobileStage === stage.id}
                                onClick={() => {
                                    setActiveMobileStage(stage.id);
                                    setActiveStageFilter('all');
                                }}
                                style={{ '--accent': stage.accent }}
                            >
                                <span>{stage.title}</span>
                                <span className="mobile-stage-count">{count}</span>
                            </button>
                        );
                    })}
                </nav>
            )}

            <nav
                className={`stage-filter-tabs ${viewMode === 'table' ? 'stage-filter-tabs-table' : ''}`}
                aria-label="Filter orders by stage"
            >
                    <button
                        className="stage-filter-tab"
                        type="button"
                        aria-pressed={activeStageFilter === 'all'}
                        onClick={() => {
                            setActiveStageFilter('all');
                            setActiveMobileStage(STAGES[0].id);
                        }}
                    >
                        All <span>{filteredOrders.length}</span>
                    </button>
                    {STAGES.map((stage) => (
                        <button
                            key={stage.id}
                            className="stage-filter-tab"
                            type="button"
                            aria-pressed={activeStageFilter === stage.id}
                            onClick={() => {
                                setActiveStageFilter(stage.id);
                                setActiveMobileStage(stage.id);
                            }}
                            style={{ '--accent': stage.accent }}
                        >
                            {stage.title} <span>{stageOrders[stage.id].length}</span>
                        </button>
                    ))}
            </nav>

            {viewMode === 'board' ? (
                <main className="procurement-board-grid">
                    {STAGES
                        .filter((stage) => activeStageFilter === 'all' || stage.id === activeStageFilter)
                        .map((stage) => (
                            <Column
                                key={stage.id}
                                stage={stage}
                                filterKey={searchKey}
                                isMobileActive={activeMobileStage === stage.id}
                                orders={stageOrders[stage.id]}
                                isDragOver={activeDropColumn === stage.id}
                                selectedOrderId={selectedOrder?.id}
                                draggedOrderId={draggedOrderId}
                                onOrderClick={openOrderDetails}
                                onDragStart={handleDragStart}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            />
                        ))}
                </main>
            ) : (
                <main className="procurement-table-view">
                    <OrderTable
                        orders={stageFilteredOrders}
                        selectedOrderId={selectedOrder?.id}
                        onOrderClick={openOrderDetails}
                        onStageChange={handleTableStageChange}
                    />
                </main>

            )}

            <Toast message={toastMessage} />

            <Modal isOpen={Boolean(modalMode)} onClose={closeModal}>
                {modalMode === 'create' && (
                    <RequestForm onCancel={closeModal} onSave={saveRequest} />
                )}
                {modalMode === 'edit' && selectedOrder && (
                    <RequestForm order={selectedOrder} onCancel={returnToDetails} onSave={saveRequest} />
                )}
                {modalMode === 'details' && selectedOrder && (
                    <OrderDetails
                        order={selectedOrder}
                        onClose={closeModal}
                        onEdit={openEditRequest}
                        onToggleDirectorSignoff={toggleDirectorSignoff}
                    />
                )}
                {modalMode === 'activity' && (
                    <div className="activity-modal-content">
                        <Button variant="close" onClick={closeModal} ariaLabel="Close Activity Log">×</Button>
                        <ActivityLog />
                    </div>
                )}
            </Modal>
        </div>
    );
}