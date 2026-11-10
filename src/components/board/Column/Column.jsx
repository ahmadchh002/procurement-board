import { memo, useState } from 'react';
import OrderCard from '../../cards/OrderCard/OrderCard';
import './Column.css';

function Column({
    stage,
    filterKey,
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
    const [pagination, setPagination] = useState({
        filterKey,
        visibleCount: 40,
    });
    const total = orders.reduce((sum, o) => sum + o.amount, 0);
    const visibleCount = pagination.filterKey === filterKey ? pagination.visibleCount : 40;
    const visibleOrders = orders.slice(0, visibleCount);

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
                {visibleOrders.map((order) => (
                    <OrderCard
                        key={order.id}
                        order={order}
                        isSelected={selectedOrderId === order.id}
                        isDragging={draggedOrderId === order.id}
                        onClick={onOrderClick}
                        onDragStart={onDragStart}
                    />
                ))}
                {visibleCount < orders.length && (
                    <button
                        className="order-list-more"
                        type="button"
                        onClick={() => setPagination((current) => ({
                            filterKey,
                            visibleCount: Math.min(
                                (current.filterKey === filterKey ? current.visibleCount : 40) + 40,
                                orders.length,
                            ),
                        }))}
                    >
                        Show more · {orders.length - visibleCount} remaining
                    </button>
                )}
            </div>
        </section>
    );
}

function sameOrderReferences(previousOrders, nextOrders) {
    if (previousOrders === nextOrders) return true;
    if (previousOrders.length !== nextOrders.length) return false;
    return previousOrders.every((order, index) => order === nextOrders[index]);
}

function containsOrder(orders, orderId) {
    return orderId !== null && orders.some((order) => order.id === orderId);
}

function areColumnPropsEqual(previous, next) {
    const selectedIdsAreIrrelevant = previous.selectedOrderId === next.selectedOrderId
        || (
            !containsOrder(previous.orders, previous.selectedOrderId)
            && !containsOrder(next.orders, next.selectedOrderId)
        );
    const draggedIdsAreIrrelevant = previous.draggedOrderId === next.draggedOrderId
        || (
            !containsOrder(previous.orders, previous.draggedOrderId)
            && !containsOrder(next.orders, next.draggedOrderId)
        );

    return previous.stage === next.stage
        && previous.filterKey === next.filterKey
        && previous.isMobileActive === next.isMobileActive
        && previous.isDragOver === next.isDragOver
        && previous.onOrderClick === next.onOrderClick
        && previous.onDragStart === next.onDragStart
        && previous.onDragOver === next.onDragOver
        && previous.onDragLeave === next.onDragLeave
        && previous.onDrop === next.onDrop
        && selectedIdsAreIrrelevant
        && draggedIdsAreIrrelevant
        && sameOrderReferences(previous.orders, next.orders);
}

export default memo(Column, areColumnPropsEqual);