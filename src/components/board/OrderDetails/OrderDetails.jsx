import { memo } from 'react';
import CostBreakdown from '../../cards/CostBreakdown/CostBreakdown';
import QuoteCard from '../../cards/QuoteCard/QuoteCard';
import Badge from '../../common/Badge/Badge';
import Button from '../../button/Button';
import { DIRECTOR_LIMIT } from '../../../utils/constants';
import './OrderDetails.css';

function OrderDetails({ order, onClose, onEdit, onToggleDirectorSignoff }) {
    if (!order) return null;
    const requiresSignoff = order.amount > DIRECTOR_LIMIT;

    return (
        <>
            <div className="order-details-head">
                <h2>{order.title}</h2>
                <div className="order-details-actions">
                    <Button onClick={onEdit}>Edit</Button>
                    <Button variant="close" onClick={onClose} ariaLabel="Close Details">×</Button>
                </div>
                <div className="order-details-sub">
                    <span className="order-card-id">{order.id}</span>
                    {requiresSignoff && (
                        <Badge type="director" variant={order.directorSigned ? 'signed' : 'pending'} />
                    )}
                    {order.tags.map((tag) => (
                        <Badge key={tag} variant={tag}>{tag}</Badge>
                    ))}
                </div>
                {requiresSignoff && (
                    <div className="order-director-controls">
                        <span>
                            {order.directorSigned
                                ? 'Director approval is recorded.'
                                : 'Director approval is required before issuing a PO.'}
                        </span>
                        <button
                            className="director-signoff-action"
                            type="button"
                            onClick={onToggleDirectorSignoff}
                        >
                            {order.directorSigned ? 'Revoke sign-off' : 'Mark as signed'}
                        </button>
                    </div>
                )}
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
            </div>
        </>
    );
}

export default memo(OrderDetails);