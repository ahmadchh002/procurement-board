import React from 'react';
import './QuoteCard.css';

export default function QuoteCard({ quote }) {
    return (
        <div className={`quote-box ${quote.best ? 'best' : ''}`}>
            <span className="quote-pill">{quote.best ? 'Best price' : ''}</span>
            <span className="quote-price">${quote.amount.toLocaleString()}</span>
            <small className="quote-meta">{quote.vendor} · {quote.lead}</small>
        </div>
    );
}