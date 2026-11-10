import React, { useState } from 'react';
import Column from '../../components/board/Column/Column';
import Drawer from '../../components/common/Drawer/Drawer';
import OrderDetails from '../../components/board/OrderDetails/OrderDetails';
import Toast from '../../components/common/Toast/Toast';
import Button from '../../components/button/Button';
import { STAGES } from '../../utils/constants';
import { INITIAL_ORDERS } from '../../data/orders';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import './ProcurementBoard.css';

export default function ProcurementBoard() {
    const [orders, setOrders] = useState(INITIAL_ORDERS);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [toastMessage, setToastMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeMobileStage, setActiveMobileStage] = useState(STAGES[0].id);

    const triggerToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 3500);
    };

    const {
        draggedOrderId,
        activeDropColumn,
        handleDragStart,
        handleDragOver,
        handleDragLeave,
        handleDrop
    } = useDragAndDrop(orders, setOrders, triggerToast);

    const filteredOrders = orders.filter((o) =>
        o.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.vendor.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    <Button variant="primary">+ New Request</Button>
                </div>
            </header>

            <nav className="mobile-stage-tabs" aria-label="Order stages">
                {STAGES.map((stage) => {
                    const count = filteredOrders.filter((order) => order.stage === stage.id).length;

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
                        isMobileActive={activeMobileStage === stage.id}
                        orders={filteredOrders.filter((o) => o.stage === stage.id)}
                        isDragOver={activeDropColumn === stage.id}
                        selectedOrderId={selectedOrder?.id}
                        draggedOrderId={draggedOrderId}
                        onOrderClick={setSelectedOrder}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    />
                ))}
            </main>

            <Toast message={toastMessage} />

            <Drawer isOpen={Boolean(selectedOrder)} onClose={() => setSelectedOrder(null)}>
                <OrderDetails
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            </Drawer>
        </div>
    );
}