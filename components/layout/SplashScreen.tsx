"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ProgressiveFluxLoader } from "../ui/progressive-flux-loader";
import { useLoadingProgress } from "@/hooks/useLoadingProgress";

interface SplashScreenProps {
  logoUrl?: string | null;
  onComplete: () => void;
}

export function SplashScreen({ logoUrl, onComplete }: SplashScreenProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const shown = sessionStorage.getItem("splash_shown");
    if (shown === "true") {
      onComplete();
    } else {
      setShow(true);
    }
  }, [onComplete]);

  const handleLoadingComplete = () => {
    sessionStorage.setItem("splash_shown", "true");
    setTimeout(() => {
      setShow(false);
      onComplete();
    }, 450); // Small buffer for visual transition
  };

  const progress = useLoadingProgress(show, handleLoadingComplete);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] bg-[#fafafa] flex flex-col items-center justify-center select-none"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <div className="flex flex-col items-center justify-center max-w-sm px-6">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-8 flex justify-center"
          >
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt="Mie Gacoan Logo"
                width={120}
                height={120}
                className="h-20 w-auto object-contain"
                priority
              />
            ) : (
              <h1 className="font-heading text-primary text-5xl md:text-6xl font-bold tracking-wide">
                Mie Gacoan
              </h1>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <ProgressiveFluxLoader value={progress} />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
