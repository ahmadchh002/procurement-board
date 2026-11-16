import { memo } from 'react';

function ActivityItem({ item }) {
    return (
        <div className={`activity-item ${item.isSystem ? 'system' : ''}`}>
            <div
                className="activity-avatar"
                style={{ background: item.avatarColor || 'var(--blue)' }}
            >
                {item.avatar}
            </div>
            <div className="activity-content">
                <div className="activity-meta">
                    <span className="activity-who">{item.author}</span>
                    <span className="activity-when">{item.time}</span>
                </div>
                <p>{item.message}</p>
            </div>
        </div>
    );
}

export default memo(ActivityItem);