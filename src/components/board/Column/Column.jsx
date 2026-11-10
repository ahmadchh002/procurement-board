import React from 'react';
import OrderCard from '../../cards/OrderCard/OrderCard';
import './Column.css';

export default function Column({
    stage,
    isMobileActive,
    orders,
    isDragOver,
    selectedOrderId,
    draggedOrderId,
    onOrderClick,
    onDragStart,
    onDragOver,
    onDragLeave,
    onDrop
}) {
    const total = orders.reduce((sum, o) => sum + o.amount, 0);

    return (
        <section
            className={`board-column ${isDragOver ? 'drag-over' : ''} ${isMobileActive ? 'mobile-active' : ''}`}
            id={`stage-${stage.id}`}
            onDragOver={(e) => onDragOver(e, stage.id)}
            onDragLeave={onDragLeave}
            onDrop={(e) => onDrop(e, stage.id)}
            style={{ '--accent': stage.accent }}
        >
            <div className="col-head" style={{ borderTop: `3px solid ${stage.accent}` }}>
                <h2>{stage.title}</h2>
                <span className="count">{orders.length}</span>
            </div>
            <div className="col-total">
                Total: ${total.toLocaleString()}
            </div>
            <div className="col-body">
                {orders.map((order) => (
                    <OrderCard
                        key={order.id}
                        order={order}
                        isSelected={selectedOrderId === order.id}
                        isDragging={draggedOrderId === order.id}
                        onClick={onOrderClick}
                        onDragStart={onDragStart}
                    />
                ))}
            </div>
        </section>
    );
}