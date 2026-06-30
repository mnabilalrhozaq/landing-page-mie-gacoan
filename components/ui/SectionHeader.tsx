import React from "react";
import { cn } from "@/lib/utils";
import { SectionDivider } from "./SectionDivider";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeader({ title, subtitle, className }: SectionHeaderProps) {
  return (
    <div className={cn("text-center mb-10 flex flex-col items-center justify-center", className)}>
      <h2 className="font-heading text-5xl md:text-6xl text-dark tracking-wide font-bold">
        {title}
      </h2>
      <SectionDivider />
      {subtitle && (
        <p className="font-body text-gray-500 max-w-xl text-sm md:text-base mt-1 px-4 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
