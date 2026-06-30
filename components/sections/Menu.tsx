"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Search, Flame, Sparkles } from "lucide-react";
import { CursorFollow } from "../ui/cursor-follow";
import { TypewriterEffectSmooth } from "../ui/typewriter-effect";
import { Menu as MenuType } from "@/types";

interface MenuSectionProps {
  menus?: MenuType[];
}

export function Menu({ menus = [] }: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState<"semua" | "mie" | "dimsum" | "minuman">("semua");
  const [searchQuery, setSearchQuery] = useState("");

  const menuWords = [
    { text: "Menu" },
    { text: "Kami", className: "text-primary" },
  ];

  // Filtering list
  const filteredMenus = useMemo(() => {
    return menus.filter((item) => {
      const matchesCategory =
        activeCategory === "semua" || item.category === activeCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch && item.isActive;
    });
  }, [menus, activeCategory, searchQuery]);

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
    <section id="menu" className="relative py-20 px-4 md:px-8 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Section Header */}
        <TypewriterEffectSmooth words={menuWords} />
        
        <div className="flex items-center justify-center mb-10 space-x-3 select-none">
          <div className="w-16 h-[2px] bg-secondary/60 rounded-full" />
          <div className="flex space-x-1 text-accent text-sm font-bold">
            <span>◇</span>
            <span>◇</span>
          </div>
          <div className="w-16 h-[2px] bg-secondary/60 rounded-full" />
        </div>

        {/* Filter Controls Bar */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2.5 p-1 bg-light rounded-full border border-gray-200/50 shadow-inner">
            {(["semua", "mie", "dimsum", "minuman"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-secondary text-white shadow-sm"
                    : "text-gray-500 hover:text-dark"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari hidangan favorit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-full border border-gray-200 focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary shadow-sm"
            />
          </div>
        </div>

        <CursorFollow className="w-full">
          <motion.div
            layout
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full min-h-[200px]"
          >
            <AnimatePresence mode="popLayout">
              {filteredMenus.map((menu) => (
                <motion.div
                  layout
                  key={menu.id}
                  variants={cardVariants}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-light border border-gray-100 rounded-3xl overflow-hidden shadow-sm relative group aspect-[4/3] min-h-[250px]"
                  data-cursor-text={menu.name}
                >
                  {/* Food Image */}
                  <div className="relative w-full h-full">
                    {menu.image ? (
                      <Image
                        src={menu.image}
                        alt={menu.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/5 flex flex-col items-center justify-center gap-2">
                        <Flame className="w-10 h-10 text-primary/30" />
                        <span className="font-heading text-primary/40 text-xl font-bold">Mie Gacoan Fresh</span>
                      </div>
                    )}

                    {/* Spicy Tag for instant view */}
                    {menu.spicyLevel > 0 && (
                      <div className="absolute top-4 right-4 bg-red-600/90 text-white text-[10px] font-extrabold uppercase px-2 py-1.5 rounded-lg flex items-center gap-1 shadow-md z-10">
                        <Flame className="w-3.5 h-3.5 fill-white" />
                        Lvl {menu.spicyLevel}
                      </div>
                    )}
                  </div>

                  {/* Standard Static Footer */}
                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-dark/95 via-dark/70 to-transparent text-white flex justify-between items-end z-10 group-hover:opacity-0 transition-opacity duration-300">
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] uppercase font-bold text-secondary tracking-widest">{menu.category}</span>
                      <h4 className="font-body font-bold text-base leading-tight mt-0.5">{menu.name}</h4>
                    </div>
                    <span className="font-heading text-2xl font-bold text-accent">Rp {menu.price.toLocaleString("id-ID")}</span>
                  </div>

                  {/* Hover Slide-up Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-dark/95 p-6 flex flex-col justify-between text-left text-white z-20 pointer-events-none"
                    initial={{ y: "100%" }}
                    whileHover={{ y: 0 }}
                    transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
                  >
                    <div className="flex flex-col gap-2">
                      <span className="text-xs uppercase font-extrabold text-secondary tracking-widest">{menu.category}</span>
                      <h4 className="font-heading text-3xl font-bold text-accent leading-none mt-1">{menu.name}</h4>
                      <p className="font-body text-gray-300 text-xs leading-relaxed mt-2 line-clamp-4">
                        {menu.description || "Sajian spesial dari jagoannya mie pedas. Diolah dengan racikan bumbu khas pilihan untuk cita rasa yang selalu nagih."}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-700/50 pt-4 mt-auto">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Level Pedas</span>
                        <div className="flex gap-1.5 mt-1 items-center">
                          {menu.spicyLevel > 0 ? (
                            [...Array(menu.spicyLevel)].map((_, i) => (
                              <Flame key={i} className="w-3.5 h-3.5 text-primary fill-primary" />
                            ))
                          ) : (
                            <span className="text-[11px] font-bold text-secondary">Tidak Pedas</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Harga</span>
                        <span className="font-heading text-3xl font-bold text-accent">Rp {menu.price.toLocaleString("id-ID")}</span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </CursorFollow>

        {filteredMenus.length === 0 && (
          <div className="text-center py-12">
            <p className="font-body text-gray-400 text-sm">Tidak ada menu yang sesuai dengan pencarian Anda.</p>
          </div>
        )}
      </div>
    </section>
  );
}
