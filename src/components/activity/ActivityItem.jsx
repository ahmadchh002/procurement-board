import React from 'react';

export default function ActivityItem({ item }) {
    return (
        <div className={`activity-item ${item.isSystem ? 'system' : ''}`}>
            <div
                className="activity-avatar"
                style={{ background: item.avatarColor || 'var(--blue)' }}
            >
                {item.avatar}
            </div>
            <div>
                <span className="activity-who">{item.author}</span>
                <span className="activity-when">{item.time}</span>
                <p>{item.message}</p>
            </div>
        </div>
    );
}