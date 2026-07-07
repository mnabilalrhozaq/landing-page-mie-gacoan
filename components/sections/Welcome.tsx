"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Eye, Target, Award } from "lucide-react";
import { TypewriterEffect, TypewriterEffectSmooth } from "../ui/typewriter-effect";

interface WelcomeProps {
  quote?: string;
  desc?: string;
  visi?: string;
  misi1?: string;
  misi2?: string;
  misi3?: string;
  nilais?: string[];
}

export function Welcome({
  quote = "Selamat Datang di Mie Gacoan!",
  desc = "Mie Gacoan hadir dengan semangat memberi pengalaman bersantap modern, terjangkau, dan selalu bikin ketagihan.",
  visi = "Menjadi jaringan restoran mie pedas terbesar dan terpercaya di Indonesia.",
  misi1 = "Menyajikan mie pedas berkualitas dengan harga terjangkau",
  misi2 = "Menghadirkan pengalaman bersantap modern",
  misi3 = "Terus berinovasi dalam menu dan layanan",
  nilais = ["Pedas", "Murah", "Nagih", "Modern", "Untuk Semua"],
}: WelcomeProps) {
  // Main heading words
  const welcomeWords = [
    { text: "Selamat" },
    { text: "Datang" },
    { text: "di" },
    { text: "Mie", className: "text-primary font-bold" },
    { text: "Gacoan!", className: "text-primary font-bold" },
  ];

  // Subheading words
  const visiWords = [{ text: "Visi" }];
  const misiWords = [{ text: "Misi" }];
  const nilaiWords = [{ text: "Nilai", className: "text-secondary font-bold" }, { text: "Resto" }];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const textRevealVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section id="welcome" className="relative py-20 px-4 md:px-8 bg-white overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center">
        {/* Section Header with TypewriterEffectSmooth */}
        <TypewriterEffectSmooth words={welcomeWords} />

        {/* Brand Divider */}
        <div className="flex items-center justify-center mb-6 space-x-3 select-none">
          <div className="w-16 h-[2px] bg-secondary/60 rounded-full" />
          <div className="flex space-x-1 text-accent text-sm font-bold">
            <span>◇</span>
            <span>◇</span>
          </div>
          <div className="w-16 h-[2px] bg-secondary/60 rounded-full" />
        </div>

        {/* Brand Welcome Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-body text-gray-500 max-w-2xl text-center text-base md:text-lg leading-relaxed mb-16 px-4"
        >
          {desc}
        </motion.p>

        {/* Visi, Misi & Nilai Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
        >
          {/* Visi Card */}
          <motion.div
            variants={cardVariants}
            className="flex flex-col items-center text-center p-8 bg-white rounded-[32px] border border-gray-100/80 shadow-xs relative overflow-hidden group hover:shadow-xl hover:scale-[1.01] transition-all duration-300"
          >
            <div className="p-4 bg-primary/10 text-primary rounded-2xl mb-6 transition-transform group-hover:scale-110 duration-300">
              <Eye className="w-8 h-8" />
            </div>
            <div className="mb-4">
              <TypewriterEffect words={visiWords} className="text-2xl font-bold" />
            </div>
            <motion.p variants={textRevealVariants} className="font-body text-gray-600 text-sm leading-relaxed mt-2">
              {visi}
            </motion.p>
          </motion.div>

          {/* Misi Card */}
          <motion.div
            variants={cardVariants}
            className="flex flex-col items-center text-center p-8 bg-white rounded-[32px] border border-gray-100/80 shadow-xs relative overflow-hidden group hover:shadow-xl hover:scale-[1.01] transition-all duration-300"
          >
            <div className="p-4 bg-secondary/15 text-secondary rounded-2xl mb-6 transition-transform group-hover:scale-110 duration-300">
              <Target className="w-8 h-8" />
            </div>
            <div className="mb-4">
              <TypewriterEffect words={misiWords} className="text-2xl font-bold" />
            </div>
            <ul className="flex flex-col gap-3 font-body text-gray-600 text-sm leading-relaxed text-left list-disc list-inside mt-2">
              <motion.li variants={textRevealVariants}>{misi1}</motion.li>
              <motion.li variants={textRevealVariants}>{misi2}</motion.li>
              <motion.li variants={textRevealVariants}>{misi3}</motion.li>
            </ul>
          </motion.div>

          {/* Nilai Resto Card */}
          <motion.div
            variants={cardVariants}
            className="flex flex-col items-center text-center p-8 bg-white rounded-[32px] border border-gray-100/80 shadow-xs relative overflow-hidden group hover:shadow-xl hover:scale-[1.01] transition-all duration-300"
          >
            <div className="p-4 bg-accent/20 text-amber-600 rounded-2xl mb-6 transition-transform group-hover:scale-110 duration-300">
              <Award className="w-8 h-8" />
            </div>
            <div className="mb-4">
              <TypewriterEffect words={nilaiWords} className="text-2xl font-bold" />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2.5 mt-4">
              {nilais.map((nilai, index) => (
                <motion.span
                  key={index}
                  variants={textRevealVariants}
                  className="font-body text-xs font-bold px-3 py-1.5 bg-white border border-gray-200/50 rounded-full text-dark shadow-sm hover:border-primary/45 transition-colors cursor-default"
                >
                  {nilai}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
