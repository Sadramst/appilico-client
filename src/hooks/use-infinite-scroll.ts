"use client";

import { useEffect, useRef, useCallback, useState } from "react";

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  hasNextPage: boolean;
  isFetching: boolean;
  fetchNextPage: () => void;
}

export function useInfiniteScroll({
  threshold = 0.1,
  rootMargin = "100px",
  hasNextPage,
  isFetching,
  fetchNextPage,
}: UseInfiniteScrollOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [triggerElement, setTriggerElement] = useState<HTMLElement | null>(null);

  const triggerRef = useCallback((node: HTMLElement | null) => {
    setTriggerElement(node);
  }, []);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (!hasNextPage || isFetching || !triggerElement) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      },
      { threshold, rootMargin }
    );

    observerRef.current.observe(triggerElement);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [triggerElement, hasNextPage, isFetching, fetchNextPage, threshold, rootMargin]);

  return { triggerRef };
}
