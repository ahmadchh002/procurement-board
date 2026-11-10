import React from 'react';
import './CostBreakdown.css';

export default function CostBreakdown({ breakdown, total }) {
    return (
        <div className="cost-breakdown-section">
            <h4>Cost Breakdown</h4>
            <div className="cost-table">
                <span className="cost-label">Base Cost</span>
                <span className="cost-val">${breakdown.base.toLocaleString()}.00</span>

                <span className="cost-label">Shipping &amp; Logistics</span>
                <span className="cost-val">${breakdown.shipping.toLocaleString()}.00</span>

                <span className="cost-label">Estimated Taxes</span>
                <span className="cost-val">${breakdown.tax.toLocaleString()}.00</span>

                <div className="cost-total-row">
                    <span>Total</span>
                    <span>${total.toLocaleString()}.00</span>
                </div>
            </div>
        </div>
    );
}