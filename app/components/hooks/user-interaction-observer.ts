"use client";

import { useEffect, useRef, useState } from "react";

interface IntersectionObserverInitExtended extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
  /**
   * If true, skip intersection observation on mobile devices (<= 768px).
   */
  skipOnMobile?: boolean;
}

/**
 * A reusable hook that returns an IntersectionObserverEntry
 * so you can detect if your ref is in view.
 */
export function useIntersectionObserver(
  targetRef: React.RefObject<HTMLElement>,
  options: IntersectionObserverInitExtended = {}
) {
  const {
    threshold = 0,
    root = null,
    rootMargin = "0%",
    freezeOnceVisible = false,
    skipOnMobile = false,
  } = options;

  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Grab the DOM node we want to observe
    const node = targetRef.current;
    if (!node) return;

    // Simple check for mobile
    const isMobile =
      typeof window !== "undefined" && window.innerWidth <= 768;

    // If skipOnMobile is true and it's mobile, do nothing
    if (skipOnMobile && isMobile) {
      return;
    }

    // Create a new observer
    observer.current = new IntersectionObserver(
      (entries) => {
        const [currentEntry] = entries;
        setEntry(currentEntry);
        // If freezeOnceVisible is true and the node is intersecting, stop observing
        if (freezeOnceVisible && currentEntry.isIntersecting && observer.current) {
          observer.current.unobserve(node);
        }
      },
      { threshold, root, rootMargin }
    );

    // Observe the node
    observer.current.observe(node);

    // Cleanup
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [targetRef, threshold, root, rootMargin, freezeOnceVisible, skipOnMobile]);

  return entry;
}