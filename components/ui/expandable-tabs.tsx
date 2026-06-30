"use client";

import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import { useOnClickOutside } from "usehooks-ts";

export interface TabItem {
  id: string;
  title: string;
  icon: keyof typeof Icons;
  href: string;
}

interface ExpandableTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function ExpandableTabs({ tabs, activeTab, onChange, className }: ExpandableTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Automatically collapses labels by notifying state container when click outside happens
  useOnClickOutside(containerRef as React.RefObject<HTMLElement>, () => {
    // Optionally trigger a reset or collapse
  });

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex items-center gap-1 p-1 bg-white/70 backdrop-blur-md border border-gray-200/50 rounded-full shadow-sm max-w-full",
        className
      )}
    >
      {tabs.map((tab) => {
        const IconComponent = Icons[tab.icon] as React.ComponentType<{ className?: string }>;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors duration-200 relative text-gray-600 hover:text-dark select-none text-xs md:text-sm font-medium focus:outline-none",
              isActive && "text-white"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="active-pill-bg"
                className="absolute inset-0 bg-primary rounded-full -z-10 shadow-sm"
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
              />
            )}
            {IconComponent && (
              <IconComponent
                className={cn(
                  "w-4 h-4 transition-transform duration-200",
                  isActive ? "text-white scale-110" : "text-gray-500"
                )}
              />
            )}
            <AnimatePresence initial={false}>
              {isActive && (
                <motion.span
                  initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                  animate={{ width: "auto", opacity: 1, marginLeft: 4 }}
                  exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  className="overflow-hidden whitespace-nowrap text-xs font-semibold"
                >
                  {tab.title}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        );
      })}
    </div>
  );
}
