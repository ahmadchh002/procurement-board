import { memo, useState, useMemo, useCallback } from 'react';
import ActivityItem from './ActivityItem';
import Spinner from '../common/Spinner/Spinner';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { generatePastActivity } from '../../data/activity';
import './ActivityLog.css';

const PAGE_SIZE = 20;

function ActivityLog({ orderId }) {
    const allLogs = useMemo(() => generatePastActivity(orderId, 2500), [orderId]);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [loadingMore, setLoadingMore] = useState(false);

    const loadMore = useCallback(() => {
        if (visibleCount >= allLogs.length || loadingMore) return;
        setLoadingMore(true);
        setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, allLogs.length));
            setLoadingMore(false);
        }, 200);
    }, [visibleCount, allLogs.length, loadingMore]);

    const hasMore = visibleCount < allLogs.length;
    const sentinelRef = useInfiniteScroll(loadMore, hasMore, loadingMore);

    const displayedLogs = allLogs.slice(0, visibleCount);

    return (
        <div className="activity-log-wrap">
            <div className="activity-log-head">
                <div className="activity-log-heading">
                    <span className="activity-log-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M12 8v4l2.5 1.5M20 12a8 8 0 1 1-2.34-5.66M20 4v5h-5" />
                        </svg>
                    </span>
                    <div>
                        <h2>Recent activity</h2>
                        <p>A chronological record of procurement updates and decisions.</p>
                    </div>
                </div>
                <span className="activity-log-count">
                    <span aria-hidden="true" />
                    {allLogs.length.toLocaleString()} entries
                </span>
            </div>
            <div className="activity-log-list" aria-label="Activity log entries">
                {displayedLogs.map((log) => (
                    <ActivityItem key={log.id} item={log} />
                ))}
                {hasMore && (
                    <div ref={sentinelRef} className="activity-sentinel">
                        <Spinner /> Loading older audit entries…
                    </div>
                )}
            </div>
        </div>
    );
}

export default memo(ActivityLog);