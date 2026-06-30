"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Sparkles, ShoppingBag, Flame } from "lucide-react";
import { CursorFollow } from "../ui/cursor-follow";
import { TypewriterEffectSmooth } from "../ui/typewriter-effect";
import { Package as PackageType } from "@/types";

interface PaketSectionProps {
  packages?: PackageType[];
}

export function Paket({ packages = [] }: PaketSectionProps) {
  const activePackages = packages.filter((p) => p.isActive);

  const titleWords = [
    { text: "Menu" },
    { text: "Paket", className: "text-primary" },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section id="paket" className="relative py-20 px-4 md:px-8 bg-light scroll-mt-20">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Section Header */}
        <TypewriterEffectSmooth words={titleWords} />

        <div className="flex items-center justify-center mb-12 space-x-3 select-none">
          <div className="w-16 h-[2px] bg-secondary/60 rounded-full" />
          <div className="flex space-x-1 text-accent text-sm font-bold">
            <span>◇</span>
            <span>◇</span>
          </div>
          <div className="w-16 h-[2px] bg-secondary/60 rounded-full" />
        </div>

        <CursorFollow className="w-full">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full"
          >
            {activePackages.map((pkg) => (
              <motion.div
                variants={cardVariants}
                key={pkg.id}
                className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative aspect-[4/3] min-h-[250px] group"
                data-cursor-text={pkg.name}
              >
                {/* Package Image / Fallback */}
                <div className="relative w-full h-full">
                  {pkg.image ? (
                    <Image
                      src={pkg.image}
                      alt={pkg.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-secondary/5 flex flex-col items-center justify-center gap-2">
                      <ShoppingBag className="w-10 h-10 text-secondary/30" />
                      <span className="font-heading text-secondary/40 text-xl font-bold">Combo Gacoan</span>
                    </div>
                  )}

                  {/* Promo Badge */}
                  {pkg.badge && (
                    <span className="absolute top-4 left-4 bg-primary text-white text-[10px] font-extrabold uppercase px-2.5 py-1.5 rounded-lg shadow-md z-10 tracking-wider">
                      {pkg.badge}
                    </span>
                  )}
                </div>

                {/* Default Bottom Bar */}
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-dark/95 via-dark/70 to-transparent text-white flex justify-between items-end z-10 group-hover:opacity-0 transition-opacity duration-300">
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] uppercase font-bold text-accent tracking-widest">Hemat & Kenyang</span>
                    <h4 className="font-body font-bold text-base leading-tight mt-0.5">{pkg.name}</h4>
                  </div>
                  <span className="font-heading text-2xl font-bold text-secondary">Rp {pkg.price.toLocaleString("id-ID")}</span>
                </div>

                {/* Hover slide-up overlay */}
                <motion.div
                  className="absolute inset-0 bg-dark/95 p-6 flex flex-col justify-between text-left text-white z-20 pointer-events-none"
                  initial={{ y: "100%" }}
                  whileHover={{ y: 0 }}
                  transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
                >
                  <div className="flex flex-col gap-2">
                    <span className="text-xs uppercase font-extrabold text-secondary tracking-widest">Spesial Paket Combo</span>
                    <h4 className="font-heading text-3xl font-bold text-accent leading-none mt-1">{pkg.name}</h4>
                    <p className="font-body text-gray-300 text-xs leading-relaxed mt-2.5 line-clamp-4">
                      {pkg.description || "Paket lengkap hemat pilihan! Kombinasi mie pedas favorit, dimsum renyah, dan minuman segar untuk kepuasan bersantap maksimal."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-700/50 pt-4 mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Status</span>
                      <span className="text-[11px] font-bold text-secondary flex items-center gap-1 mt-1">
                        <Sparkles className="w-3.5 h-3.5 fill-secondary" />
                        Tersedia Semua Outlet
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Harga Paket</span>
                      <span className="font-heading text-3xl font-bold text-accent">Rp {pkg.price.toLocaleString("id-ID")}</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </CursorFollow>

        {activePackages.length === 0 && (
          <div className="text-center py-12">
            <p className="font-body text-gray-400 text-sm">Belum ada paket menu hemat yang tersedia saat ini.</p>
          </div>
        )}
      </div>
    </section>
  );
}
