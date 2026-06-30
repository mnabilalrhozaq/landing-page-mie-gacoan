import React from "react";
import { cn } from "@/lib/utils";

interface SectionDividerProps {
  className?: string;
}

export function SectionDivider({ className }: SectionDividerProps) {
  return (
    <div className={cn("flex items-center justify-center my-4 space-x-3 select-none", className)}>
      <div className="w-16 h-[2px] bg-secondary/60 rounded-full" />
      <div className="flex space-x-1 text-accent text-sm font-bold">
        <span>◇</span>
        <span>◇</span>
      </div>
      <div className="w-16 h-[2px] bg-secondary/60 rounded-full" />
    </div>
  );
}
