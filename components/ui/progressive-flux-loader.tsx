"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ProgressiveFluxLoaderProps {
  value: number; // 0 to 100
}

export function ProgressiveFluxLoader({ value }: ProgressiveFluxLoaderProps) {
  const [label, setLabel] = useState("Menyiapkan halaman...");

  useEffect(() => {
    if (value >= 100) {
      setLabel("Selamat datang!");
    } else if (value >= 80) {
      setLabel("Hampir siap...");
    } else if (value >= 55) {
      setLabel("Menyiapkan konten...");
    } else if (value >= 25) {
      setLabel("Memuat menu...");
    } else {
      setLabel("Menyiapkan halaman...");
    }
  }, [value]);

  const percentage = Math.min(Math.max(value, 0), 100);

  return (
    <div className="w-64 flex flex-col items-center select-none font-body">
      <div className="w-full h-[6px] bg-gray-200 rounded-full overflow-hidden relative shadow-inner">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(to right, var(--flux-from, #C2547A), var(--flux-to, #4DC8D0))",
            width: `${percentage}%`,
          }}
          transition={{ ease: "easeInOut", duration: 0.2 }}
          layout
        />
      </div>
      <div className="flex justify-between w-full mt-2 text-xs font-semibold text-gray-500">
        <span className="animate-pulse">{label}</span>
        <span>{Math.round(percentage)}%</span>
      </div>
    </div>
  );
}
