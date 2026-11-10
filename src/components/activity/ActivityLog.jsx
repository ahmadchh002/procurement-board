import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ActivityItem from './ActivityItem';
import Spinner from '../common/Spinner/Spinner';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { generatePastActivity } from '../../data/activity';
import './ActivityLog.css';

const PAGE_SIZE = 20;

export default function ActivityLog({ orderId }) {
    const allLogs = useMemo(() => generatePastActivity(orderId, 2500), [orderId]);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        setVisibleCount(PAGE_SIZE);
    }, [orderId]);

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
                <span>Activity Log</span>
                <span>{allLogs.length.toLocaleString()} entries</span>
            </div>
            <div className="activity-log-list">
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