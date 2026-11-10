import React from 'react';
import Badge from '../../common/Badge/Badge';
import { DIRECTOR_LIMIT } from '../../../utils/constants';
import './OrderCard.css';

export default function OrderCard({ order, isSelected, isDragging, onClick, onDragStart }) {
    const requiresSignoff = order.amount > DIRECTOR_LIMIT;

    return (
        <article
            className={`order-card ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}
            draggable
            onDragStart={(e) => onDragStart(e, order.id)}
            onClick={() => onClick(order)}
            style={{ borderLeft: `3px solid var(--accent, var(--blue))` }}
        >
            <div className="order-card-top">
                <span className="order-card-id">{order.id}</span>
                {requiresSignoff && (
                    <Badge type="director" variant={order.directorSigned ? 'signed' : 'pending'} />
                )}
            </div>

            <h3 className="order-card-title">{order.title}</h3>

            <div className="order-card-meta">
                <span className="order-card-amount">${order.amount.toLocaleString()}</span>
                <span>{order.vendor} · {order.date}</span>
            </div>

            <div className="order-card-tags">
                {order.tags.map((tag) => (
                    <Badge key={tag} variant={tag}>
                        {tag}
                    </Badge>
                ))}
            </div>
        </article>
    );
}