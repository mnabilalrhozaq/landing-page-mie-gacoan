"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Camera, ArrowRight } from "lucide-react";
import Link from "next/link";
import { TypewriterEffectSmooth } from "../ui/typewriter-effect";
import { Gallery as GalleryType } from "@/types";

interface GaleriSectionProps {
  galleries?: GalleryType[];
}

export function Galeri({ galleries = [] }: GaleriSectionProps) {
  const sortedGalleries = [...galleries].sort((a, b) => a.order - b.order);
  const displayGalleries = sortedGalleries.slice(0, 6);

  const titleWords = [
    { text: "Galeri" },
    { text: "Foto", className: "text-primary" },
  ];

  return (
    <section id="galeri" className="relative py-20 px-4 md:px-8 bg-light overflow-hidden scroll-mt-20">
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

        {/* Gallery Grid (Shows up to 6 pictures) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
          {displayGalleries.map((item, index) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              key={item.id}
              className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-sm aspect-square relative group hover:shadow-md transition-shadow"
            >
              <Image
                src={item.image}
                alt={item.caption || "Mie Gacoan Moment"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 33vw"
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
        </div>

        {/* View All Button */}
        {sortedGalleries.length > 6 && (
          <div className="mt-12 flex justify-center">
            <Link href="/galeri">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-secondary hover:bg-secondary/95 text-white font-bold rounded-2xl px-8 py-3.5 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 group text-xs uppercase tracking-wider"
              >
                Lihat Seluruh Galeri
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </div>
        )}

        {sortedGalleries.length === 0 && (
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[1, 2, 3].map((placeholder) => (
              <div
                key={placeholder}
                className="bg-gray-200 border border-gray-350/30 rounded-3xl aspect-square flex flex-col items-center justify-center text-gray-400 gap-2 border-dashed border-2"
              >
                <Camera className="w-8 h-8 opacity-40 animate-pulse" />
                <span className="font-body text-xs font-medium">Foto Galeri</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
