"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface InlineFormProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function InlineForm({ isOpen, onClose, title, children }: InlineFormProps) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden border border-gray-200/60 rounded-[28px] bg-white shadow-inner mb-8"
        >
          <div className="p-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3.5 mb-6">
              <h3 className="font-body font-bold text-base text-dark">{title}</h3>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-dark transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
