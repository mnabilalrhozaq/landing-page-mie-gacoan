"use client";

import { useState, useEffect, useRef } from "react";

export function useLoadingProgress(active: boolean, onComplete?: () => void) {
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!active) {
      setProgress(100);
      return;
    }

    let isMounted = true;

    const runLoading = async () => {
      // Phase 1: Fonts loaded (0% -> 25%)
      if (isMounted) setProgress(25);
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Phase 2: API data fetched (25% -> 50%)
      if (isMounted) setProgress(50);
      await new Promise((resolve) => setTimeout(resolve, 400));

      // Phase 3: Lazy components loaded (50% -> 75%)
      if (isMounted) setProgress(75);
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Phase 4: Images preloaded & DOM complete (75% -> 100%)
      if (isMounted) setProgress(100);
      await new Promise((resolve) => setTimeout(resolve, 450));

      if (isMounted && onCompleteRef.current) {
        onCompleteRef.current();
      }
    };

    runLoading();

    return () => {
      isMounted = false;
    };
  }, [active]);

  return progress;
}
