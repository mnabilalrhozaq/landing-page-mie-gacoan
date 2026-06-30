"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Camera, X, ChevronLeft, ChevronRight, Sparkles, Image as ImageIcon } from "lucide-react";
import { Gallery } from "@/types";

export default function GaleriPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const res = await fetch("/api/galleries");
        if (res.ok) {
          const data = await res.json();
          // Sort by order ascending
          setGalleries(data.sort((a: Gallery, b: Gallery) => a.order - b.order));
        }
      } catch (err) {
        console.error("Gagal memuat galeri:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGalleries();
  }, []);

  // Compute unique categories
  const categories = useMemo(() => {
    const cats = new Set(galleries.map((g) => g.category).filter(Boolean));
    return ["Semua", ...Array.from(cats)];
  }, [galleries]);

  // Filtered list
  const filteredGalleries = useMemo(() => {
    if (selectedCategory === "Semua") return galleries;
    return galleries.filter((g) => g.category === selectedCategory);
  }, [galleries, selectedCategory]);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredGalleries.length - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null && prev < filteredGalleries.length - 1 ? prev + 1 : 0));
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredGalleries.length - 1));
      }
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev !== null && prev < filteredGalleries.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, filteredGalleries]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-light py-16 px-4 md:px-8 font-body">
      {/* Top Navigation */}
      <div className="max-w-7xl mx-auto flex items-center justify-between mb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-extrabold text-secondary hover:text-primary transition-colors uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
        <span className="text-gray-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 select-none">
          <Sparkles className="w-4 h-4 text-primary fill-primary" />
          Mie Gacoan Moments
        </span>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Title */}
        <div className="text-center mb-8 flex flex-col items-center">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-secondary/15 text-secondary text-xs font-bold rounded-full w-fit uppercase tracking-widest shadow-inner mb-3">
            <Camera className="w-3.5 h-3.5" />
            Galeri Foto Restoran
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-dark font-extrabold tracking-wide uppercase leading-none">
            MOMEN SERU KAMI
          </h1>
          <div className="flex items-center justify-center my-4 space-x-3 select-none">
            <div className="w-16 h-[2px] bg-secondary/60 rounded-full" />
            <div className="flex space-x-1 text-accent text-sm font-bold">
              <span>◇</span>
              <span>◇</span>
            </div>
            <div className="w-16 h-[2px] bg-secondary/60 rounded-full" />
          </div>
          <p className="font-body text-gray-550 text-sm max-w-lg leading-relaxed">
            Jelajahi keseruan, suasana hangat outlet, dan kebersamaan para pecinta Mie Gacoan di seluruh Indonesia.
          </p>
        </div>

        {/* Category Tabs */}
        {!isLoading && categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2.5 p-1 bg-white/70 backdrop-blur-xs rounded-full border border-gray-200/50 shadow-inner mb-12 select-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setLightboxIndex(null); // Reset lightbox to prevent overflow
                }}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  selectedCategory === cat
                    ? "bg-secondary text-white shadow-sm"
                    : "text-gray-500 hover:text-dark"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 font-semibold text-xs animate-pulse">Memuat keseruan...</p>
          </div>
        )}

        {/* Gallery Grid */}
        {!isLoading && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full"
          >
            <AnimatePresence mode="popLayout">
              {filteredGalleries.map((item, idx) => (
                <motion.div
                  layout
                  variants={cardVariants}
                  key={item.id}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => setLightboxIndex(idx)}
                  className="bg-white border border-gray-150 rounded-[32px] overflow-hidden shadow-sm aspect-square relative group hover:shadow-md transition-shadow cursor-zoom-in"
                >
                  <Image
                    src={item.image}
                    alt={item.caption || "Mie Gacoan Moment"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
                  />

                  {/* Hover Caption Overlay */}
                  <div className="absolute inset-0 bg-dark/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-left">
                    <div className="p-3 bg-secondary/20 rounded-full text-secondary w-fit mb-3">
                      <Camera className="w-5 h-5" />
                    </div>
                    {item.category && (
                      <span className="text-[9px] text-white bg-secondary/80 font-bold px-2 py-0.5 rounded-full uppercase w-fit mb-2 tracking-wider">
                        {item.category}
                      </span>
                    )}
                    <p className="font-body text-white font-bold text-sm leading-snug">
                      {item.caption || "Momen seru makan Mie Gacoan!"}
                    </p>
                    <span className="text-[10px] text-accent font-semibold uppercase tracking-wider mt-1.5">
                      #MieGacoan #PedasMurahNagih
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && filteredGalleries.length === 0 && (
          <div className="py-24 text-center flex flex-col items-center gap-3">
            <div className="p-4 bg-gray-100 rounded-full text-gray-400">
              <ImageIcon className="w-10 h-10" />
            </div>
            <h3 className="font-bold text-dark text-lg">Galeri Kosong</h3>
            <p className="text-gray-400 text-xs font-semibold max-w-xs">
              Belum ada foto dalam kategori "{selectedCategory}".
            </p>
          </div>
        )}
      </div>

      {/* Lightbox / Slideshow Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && filteredGalleries[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
            className="fixed inset-0 bg-dark/95 backdrop-blur-md z-50 flex flex-col items-center justify-between p-4 md:p-6"
          >
            {/* Top Bar inside Lightbox */}
            <div className="w-full flex justify-between items-center text-white px-4">
              <div className="flex flex-col text-left">
                {filteredGalleries[lightboxIndex].category && (
                  <span className="text-[10px] text-accent font-extrabold uppercase tracking-widest">
                    Kategori: {filteredGalleries[lightboxIndex].category}
                  </span>
                )}
                <h4 className="font-bold text-sm text-gray-250 truncate max-w-[240px] md:max-w-md">
                  {filteredGalleries[lightboxIndex].caption || "Mie Gacoan Moment"}
                </h4>
              </div>
              <button
                onClick={() => setLightboxIndex(null)}
                className="bg-white/10 hover:bg-white/20 p-2.5 rounded-full border border-white/10 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Middle Main Content */}
            <div className="flex-grow w-full flex items-center justify-between gap-2 max-w-6xl select-none">
              {/* Prev Button */}
              <button
                onClick={handlePrevImage}
                className="bg-white/10 hover:bg-white/20 border border-white/10 text-white p-3 rounded-full shrink-0 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Main Image Container */}
              <div
                className="relative w-full h-[60vh] md:h-[75vh] max-w-4xl rounded-[28px] overflow-hidden border border-white/5 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={filteredGalleries[lightboxIndex].image}
                  alt={filteredGalleries[lightboxIndex].caption || "Lightbox View"}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Next Button */}
              <button
                onClick={handleNextImage}
                className="bg-white/10 hover:bg-white/20 border border-white/10 text-white p-3 rounded-full shrink-0 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom info inside Lightbox */}
            <div className="text-gray-400 text-xs font-bold mb-2">
              Foto {lightboxIndex + 1} dari {filteredGalleries.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
