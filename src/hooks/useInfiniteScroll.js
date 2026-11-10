import { useEffect, useRef } from "react";

export function useInfiniteScroll(onIntersect, hasMore, isLoading) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!sentinelRef.current || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onIntersect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [onIntersect, hasMore, isLoading]);

  return sentinelRef;
}
