import React from 'react';
import { Link } from 'react-router-dom';
import ActivityLog from '../../components/activity/ActivityLog';

export default function ActivityLogPage() {
    return (
        <div style={{ padding: '16px', height: '100vh', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--line)', paddingBottom: '12px' }}>
                <h2>System-Wide Activity Log</h2>
                <Link
                    to="/"
                    style={{ color: 'var(--blue)', textDecoration: 'none', fontWeight: 600 }}
                >
                    ← Back to Board
                </Link>
            </header>
            <div style={{ flex: 1, minHeight: 0, background: 'var(--panel)', borderRadius: '8px', border: '1px solid var(--line)' }}>
                <ActivityLog orderId="ALL-ORDERS" />
            </div>
        </div>
    );
}