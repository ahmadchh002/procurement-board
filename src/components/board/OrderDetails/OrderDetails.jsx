import React from 'react';
import CostBreakdown from '../../cards/CostBreakdown/CostBreakdown';
import QuoteCard from '../../cards/QuoteCard/QuoteCard';
import ActivityLog from '../../activity/ActivityLog';
import Badge from '../../common/Badge/Badge';
import Button from '../../button/Button';
import { DIRECTOR_LIMIT } from '../../../utils/constants';
import './OrderDetails.css';

export default function OrderDetails({ order, onClose }) {
    if (!order) return null;
    const requiresSignoff = order.amount > DIRECTOR_LIMIT;

    return (
        <>
            <div className="order-details-head">
                <h2>{order.title}</h2>
                <Button variant="close" onClick={onClose} ariaLabel="Close Details">×</Button>
                <div className="order-details-sub">
                    <span className="order-card-id">{order.id}</span>
                    {requiresSignoff && (
                        <Badge type="director" variant={order.directorSigned ? 'signed' : 'pending'} />
                    )}
                    {order.tags.map((tag) => (
                        <Badge key={tag} variant={tag}>{tag}</Badge>
                    ))}
                </div>
            </div>

            <div className="order-details-body">
                <CostBreakdown breakdown={order.breakdown} total={order.amount} />

                <div className="quotes-section">
                    <h4>Vendor Quotes</h4>
                    <div className="quotes-grid">
                        {order.quotes.map((q, idx) => (
                            <QuoteCard key={idx} quote={q} />
                        ))}
                    </div>
                </div>

                <ActivityLog orderId={order.id} />
            </div>
        </>
    );
}