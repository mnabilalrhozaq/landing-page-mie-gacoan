"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Clock, ExternalLink, Compass } from "lucide-react";
import { TypewriterEffectSmooth } from "../ui/typewriter-effect";
import { Outlet as OutletType } from "@/types";

interface OutletsSectionProps {
  outlets?: OutletType[];
}

export function Outlets({ outlets = [] }: OutletsSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Semua Kota");

  const titleWords = [
    { text: "Outlets" },
    { text: "Kami", className: "text-primary" },
  ];

  // Extract unique cities list for dropdown filter
  const uniqueCities = useMemo(() => {
    const list = outlets.map((o) => o.city);
    return ["Semua Kota", ...Array.from(new Set(list))];
  }, [outlets]);

  // Filter outlets list based on queries
  const filteredOutlets = useMemo(() => {
    return outlets.filter((item) => {
      const matchesCity =
        selectedCity === "Semua Kota" ||
        item.city.toLowerCase() === selectedCity.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.city.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCity && matchesSearch;
    });
  }, [outlets, searchQuery, selectedCity]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.45, ease: "easeOut" },
    },
  };

  return (
    <section id="outlets" className="relative py-20 px-4 md:px-8 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Section Header */}
        <TypewriterEffectSmooth words={titleWords} />

        <div className="flex items-center justify-center mb-10 space-x-3 select-none">
          <div className="w-16 h-[2px] bg-secondary/60 rounded-full" />
          <div className="flex space-x-1 text-accent text-sm font-bold">
            <span>◇</span>
            <span>◇</span>
          </div>
          <div className="w-16 h-[2px] bg-secondary/60 rounded-full" />
        </div>

        {/* Filter Toolbar */}
        <div className="w-full flex flex-col sm:flex-row items-center gap-4 mb-12 max-w-2xl justify-center">
          {/* Search bar */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari outlet terdekat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary shadow-sm"
            />
          </div>

          {/* City dropdown */}
          <div className="relative w-full sm:w-48">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full pl-3 pr-8 py-2 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary shadow-sm appearance-none cursor-pointer"
            >
              {uniqueCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Grid outlets display */}
        <motion.div
          layout
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full min-h-[150px]"
        >
          <AnimatePresence mode="popLayout">
            {filteredOutlets.map((outlet) => (
              <motion.div
                layout
                key={outlet.id}
                variants={cardVariants}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-light border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group text-left"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 left-0 w-2 h-full bg-secondary group-hover:bg-primary transition-colors" />

                <div className="flex flex-col gap-4 pl-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-secondary tracking-widest">{outlet.city}</span>
                      <h4 className="font-body font-bold text-lg text-dark leading-tight mt-1">
                        {outlet.name}
                      </h4>
                    </div>

                    {/* Status Badge */}
                    {outlet.isOpen ? (
                      <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-inner select-none whitespace-nowrap">
                        Buka
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-inner select-none whitespace-nowrap">
                        Tutup
                      </span>
                    )}
                  </div>

                  <div className="flex items-start gap-2.5 mt-2">
                    <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <p className="font-body text-gray-500 text-xs leading-relaxed">
                      {outlet.address}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 mt-1">
                    <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                    <p className="font-body text-gray-500 text-xs font-medium">
                      Jam Buka: {outlet.openTime || "10.00 – 22.00"}
                    </p>
                  </div>
                </div>

                {/* Card Action Link */}
                {outlet.mapsUrl && (
                  <div className="pl-2 mt-6 pt-4 border-t border-gray-200/50 flex justify-end">
                    <a
                      href={outlet.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-primary transition-colors uppercase tracking-wider"
                    >
                      <Compass className="w-4 h-4" />
                      Petunjuk Arah
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredOutlets.length === 0 && (
          <div className="text-center py-12">
            <p className="font-body text-gray-400 text-sm">Tidak ada outlet yang sesuai dengan kriteria pencarian.</p>
          </div>
        )}
      </div>
    </section>
  );
}
