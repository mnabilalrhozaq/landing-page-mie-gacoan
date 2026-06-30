"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface CursorFollowProps {
  children: React.ReactNode;
  className?: string;
}

export function CursorFollow({ children, className }: CursorFollowProps) {
  const [cursorText, setCursorText] = useState("");
  const [isDesktop, setIsDesktop] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 300, mass: 0.6 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: fine)");
    setIsDesktop(mediaQuery.matches);
    
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
    };

    mediaQuery.addEventListener("change", handleMediaChange);
    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDesktop || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseOver = (e: React.MouseEvent) => {
    if (!isDesktop) return;
    
    const target = (e.target as HTMLElement).closest("[data-cursor-text]");
    if (target) {
      const text = target.getAttribute("data-cursor-text");
      if (text) {
        setCursorText(text);
        setIsVisible(true);
        return;
      }
    }
    setCursorText("");
  };

  const handleMouseLeave = () => {
    if (!isDesktop) return;
    setIsVisible(false);
    setCursorText("");
  };

  const handleMouseEnter = () => {
    if (!isDesktop) return;
    setIsVisible(true);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseOver={handleMouseOver}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn("relative overflow-hidden", isDesktop && "no-cursor", className)}
    >
      {children}

      {isDesktop && isVisible && (
        <motion.div
          style={{
            x: cursorX,
            y: cursorY,
            translateX: "-50%",
            translateY: "-50%",
            zIndex: 9999,
          }}
          className="absolute pointer-events-none flex items-center justify-center bg-primary text-white text-[10px] font-bold text-center px-3 py-1 shadow-lg shadow-primary/20 border border-white/10"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            borderRadius: cursorText ? "20px" : "50%",
            width: cursorText ? "auto" : "16px",
            height: cursorText ? "auto" : "16px",
            minWidth: cursorText ? "80px" : "16px",
            minHeight: cursorText ? "34px" : "16px",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
        >
          {cursorText && (
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="whitespace-nowrap px-1 leading-tight select-none"
            >
              {cursorText}
            </motion.span>
          )}
        </motion.div>
      )}
    </div>
  );
}
