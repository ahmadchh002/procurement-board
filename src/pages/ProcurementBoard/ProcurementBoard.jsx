import { useCallback, useMemo, useState } from 'react';
import Column from '../../components/board/Column/Column';
import Drawer from '../../components/common/Drawer/Drawer';
import OrderDetails from '../../components/board/OrderDetails/OrderDetails';
import RequestForm from '../../components/board/RequestForm/RequestForm';
import Toast from '../../components/common/Toast/Toast';
import Button from '../../components/button/Button';
import { DIRECTOR_LIMIT, STAGES } from '../../utils/constants';
import { loadPersistedOrders, savePersistedOrders } from '../../data/orderStorage';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import './ProcurementBoard.css';

export default function ProcurementBoard() {
    const [initialState] = useState(loadPersistedOrders);
    const [orders, setOrders] = useState(initialState.orders);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [toastMessage, setToastMessage] = useState(initialState.error ?? '');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeMobileStage, setActiveMobileStage] = useState(STAGES[0].id);
    const [drawerMode, setDrawerMode] = useState(null);

    const triggerToast = useCallback((msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 3500);
    }, []);

    const commitOrders = useCallback((nextOrders) => {
        setOrders(nextOrders);
        const error = savePersistedOrders(nextOrders);
        if (error) triggerToast(error);
    }, [triggerToast]);

    const {
        draggedOrderId,
        activeDropColumn,
        handleDragStart,
        handleDragOver,
        handleDragLeave,
        handleDrop
    } = useDragAndDrop(orders, commitOrders, triggerToast);

    const searchKey = searchTerm.trim().toLowerCase();
    const stageOrders = useMemo(() => {
        const grouped = Object.fromEntries(STAGES.map((stage) => [stage.id, []]));

        for (const order of orders) {
            if (
                searchKey
                && !order.title.toLowerCase().includes(searchKey)
                && !order.id.toLowerCase().includes(searchKey)
                && !order.vendor.toLowerCase().includes(searchKey)
            ) {
                continue;
            }

            grouped[order.stage]?.push(order);
        }

        return grouped;
    }, [orders, searchKey]);

    const closeDrawer = useCallback(() => {
        setDrawerMode(null);
        setSelectedOrder(null);
    }, []);

    const openNewRequest = useCallback(() => {
        setSelectedOrder(null);
        setDrawerMode('create');
    }, []);

    const openOrderDetails = useCallback((order) => {
        setSelectedOrder(order);
        setDrawerMode('details');
    }, []);

    const saveRequest = useCallback((request) => {
        if (drawerMode === 'create') {
            const nextNumber = orders.reduce((highest, order) => (
                Math.max(highest, Number(order.id.replace(/\D/g, '')) || 0)
            ), 0) + 1;
            const newOrder = {
                ...request,
                id: `PR-${String(nextNumber).padStart(4, '0')}`,
                stage: 'pending',
            };

            commitOrders([...orders, newOrder]);
            setActiveMobileStage('pending');
            triggerToast(`${newOrder.id} created and added to Pending Review.`);
            closeDrawer();
            return;
        }

        commitOrders(orders.map((order) => (
            order.id === request.id ? { ...order, ...request } : order
        )));
        setSelectedOrder(request);
        setDrawerMode('details');
        triggerToast(`${request.id} updated.`);
    }, [closeDrawer, commitOrders, drawerMode, orders, triggerToast]);

    const toggleDirectorSignoff = useCallback(() => {
        if (!selectedOrder || selectedOrder.amount <= DIRECTOR_LIMIT) return;

        const isRevoking = selectedOrder.directorSigned;
        const nextOrder = {
            ...selectedOrder,
            directorSigned: !isRevoking,
            ...(isRevoking && ['po', 'delivered'].includes(selectedOrder.stage)
                ? { stage: 'director' }
                : {}),
        };

        commitOrders(orders.map((order) => (
            order.id === nextOrder.id ? nextOrder : order
        )));
        setSelectedOrder(nextOrder);

        if (isRevoking && nextOrder.stage === 'director') {
            setActiveMobileStage('director');
            triggerToast(`${nextOrder.id} returned to Director Approval for sign-off.`);
            return;
        }

        triggerToast(
            isRevoking
                ? `${nextOrder.id} director sign-off revoked.`
                : `${nextOrder.id} marked as director signed.`,
        );
    }, [commitOrders, orders, selectedOrder, triggerToast]);

    const returnToDetails = useCallback(() => setDrawerMode('details'), []);
    const openEditRequest = useCallback(() => setDrawerMode('edit'), []);

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
                    <Button variant="primary" onClick={openNewRequest}>+ New Request</Button>
                </div>
            </header>

            <nav className="mobile-stage-tabs" aria-label="Order stages">
                {STAGES.map((stage) => {
                    const count = stageOrders[stage.id].length;

                    return (
                        <button
                            key={stage.id}
                            className="mobile-stage-tab"
                            type="button"
                            aria-pressed={activeMobileStage === stage.id}
                            onClick={() => setActiveMobileStage(stage.id)}
                            style={{ '--accent': stage.accent }}
                        >
                            <span>{stage.title}</span>
                            <span className="mobile-stage-count">{count}</span>
                        </button>
                    );
                })}
            </nav>

            <main className="procurement-board-grid">
                {STAGES.map((stage) => (
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

            <Toast message={toastMessage} />

            <Drawer isOpen={Boolean(drawerMode)} onClose={closeDrawer}>
                {drawerMode === 'create' && (
                    <RequestForm onCancel={closeDrawer} onSave={saveRequest} />
                )}
                {drawerMode === 'edit' && selectedOrder && (
                    <RequestForm order={selectedOrder} onCancel={returnToDetails} onSave={saveRequest} />
                )}
                {drawerMode === 'details' && selectedOrder && (
                    <OrderDetails
                        order={selectedOrder}
                        onClose={closeDrawer}
                        onEdit={openEditRequest}
                        onToggleDirectorSignoff={toggleDirectorSignoff}
                    />
                )}
            </Drawer>
        </div>
    );
}