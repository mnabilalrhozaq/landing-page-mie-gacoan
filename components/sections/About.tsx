"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award, Store, Users, Calendar } from "lucide-react";
import { TypewriterEffectSmooth } from "../ui/typewriter-effect";
import { useCounter } from "@/hooks/useCounter";

interface AboutProps {
  desc?: string;
  cabangVal?: string;
  tahunVal?: string;
  pelangganVal?: string;
}

export function About({
  desc = "Mie Gacoan adalah jaringan restoran mie pedas No. 1 di Indonesia. Berdiri sejak tahun 2016, kami terus menyajikan kelezatan mie berkualitas tinggi dengan cita rasa pedas yang khas dan harga yang sangat bersahabat untuk semua kalangan.",
  cabangVal = "500",
  tahunVal = "2016",
  pelangganVal = "1",
}: AboutProps) {
  const aboutWords = [
    { text: "Tentang" },
    { text: "Kami", className: "text-primary" },
  ];

  // Parse numeric values for animation
  const maxCabang = parseInt(cabangVal) || 500;
  const maxTahun = parseInt(tahunVal) || 2016;
  const maxPelanggan = parseFloat(pelangganVal) || 1;

  // Hooks for counting
  const c1 = useCounter(maxCabang, 0, 2);
  const c2 = useCounter(maxTahun, 1980, 2);
  const c3 = useCounter(maxPelanggan * 10, 0, 2); // scale by 10 for smooth count

  return (
    <section id="about" className="relative py-20 px-4 md:px-8 bg-light scroll-mt-20">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Section Header */}
        <TypewriterEffectSmooth words={aboutWords} />
        
        <div className="flex items-center justify-center mb-10 space-x-3 select-none">
          <div className="w-16 h-[2px] bg-secondary/60 rounded-full" />
          <div className="flex space-x-1 text-accent text-sm font-bold">
            <span>◇</span>
            <span>◇</span>
          </div>
          <div className="w-16 h-[2px] bg-secondary/60 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full mt-4">
          {/* Left: Brand History Description */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6 text-left"
          >
            <h3 className="font-heading text-4xl text-dark font-bold leading-tight">
              Kisah Sukses Menghadirkan Kebahagiaan Lewat Setiap Piring
            </h3>
            <p className="font-body text-gray-600 text-base leading-relaxed">
              {desc}
            </p>
            <p className="font-body text-gray-500 text-sm leading-relaxed">
              Nama &ldquo;Gacoan&rdquo; diambil dari kata &ldquo;Gaco&rdquo; yang berarti jagoan atau andalan dalam bahasa Jawa. Kami berkomitmen untuk selalu menjadi pilihan utama bagi para pencinta mie pedas di seluruh Nusantara.
            </p>
          </motion.div>

          {/* Right: Counter Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
            {/* Stat Card 1 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center gap-3 hover:shadow-md transition-shadow"
            >
              <div className="p-3.5 bg-secondary/15 text-secondary rounded-2xl">
                <Store className="w-6 h-6" />
              </div>
              <div ref={c1.ref} className="font-heading text-5xl font-bold text-dark mt-2">
                {c1.count}+
              </div>
              <span className="font-body text-gray-500 text-xs font-semibold uppercase tracking-wider">Cabang</span>
            </motion.div>

            {/* Stat Card 2 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center gap-3 hover:shadow-md transition-shadow"
            >
              <div className="p-3.5 bg-primary/10 text-primary rounded-2xl">
                <Calendar className="w-6 h-6" />
              </div>
              <div ref={c2.ref} className="font-heading text-5xl font-bold text-dark mt-2">
                {c2.count}
              </div>
              <span className="font-body text-gray-500 text-xs font-semibold uppercase tracking-wider">Tahun Berdiri</span>
            </motion.div>

            {/* Stat Card 3 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center gap-3 hover:shadow-md transition-shadow"
            >
              <div className="p-3.5 bg-accent/20 text-amber-600 rounded-2xl">
                <Users className="w-6 h-6" />
              </div>
              <div ref={c3.ref} className="font-heading text-5xl font-bold text-dark mt-2">
                {c3.count / 10} Juta+
              </div>
              <span className="font-body text-gray-500 text-xs font-semibold uppercase tracking-wider">Pelanggan</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
