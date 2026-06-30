"use client";

import { useEffect, useState, useRef } from "react";
import { animate, useInView } from "framer-motion";

export function useCounter(to: number, from: number = 0, duration: number = 2) {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(from, to, {
      duration,
      ease: "easeOut",
      onUpdate: (value) => {
        setCount(Math.round(value));
      },
    });

    return () => controls.stop();
  }, [isInView, from, to, duration]);

  return { count, ref };
}
