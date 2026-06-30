"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Star, MessageSquare, ChevronLeft, ChevronRight, Quote, Sparkles } from "lucide-react";
import { TypewriterEffectSmooth } from "../ui/typewriter-effect";
import { Button } from "../ui/button";
import { Testimonial as TestimonialType } from "@/types";

interface TestimoniSectionProps {
  testimonials?: TestimonialType[];
}

export function Testimoni({ testimonials = [] }: TestimoniSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const titleWords = [
    { text: "Testimoni" },
    { text: "Pelanggan", className: "text-primary" },
  ];

  const averageRating = useMemo(() => {
    if (testimonials.length === 0) return "4.9";
    const sum = testimonials.reduce((acc, t) => acc + t.rating, 0);
    return (sum / testimonials.length).toFixed(1);
  }, [testimonials]);

      const activeTestimonials = testimonials.length > 0
    ? testimonials
    : [
        {
          id: 1,
          name: "Rian",
          rating: 5,
          content: "Mie Iblis level 3-nya mantap sekali, pedas gurihnya pas! Ditambah es genderuwo yang manis segar, bikin pengen balik terus tiap minggu.",
          createdAt: "2026-06-19",
        },
        {
          id: 2,
          name: "Siti Rahma",
          rating: 5,
          content: "Harganya sangat murah untuk porsi mie yang kenyang. Tempatnya juga luas dan asik buat kumpul bareng teman-teman kuliah.",
          createdAt: "2026-06-18",
        },
        {
          id: 3,
          name: "Andi Wijaya",
          rating: 4,
          content: "Dimsum udang keju adalah menu wajib saya selain Mie Setan. Pelayanannya cepat meskipun antriannya selalu ramai.",
          createdAt: "2026-06-17",
        },
      ];

  const nextTesti = () => {
    setActiveIndex((prev) => (prev + 1) % activeTestimonials.length);
  };

  const prevTesti = () => {
    setActiveIndex((prev) => (prev - 1 + activeTestimonials.length) % activeTestimonials.length);
  };

  return (
    <section id="testimoni" className="relative py-20 px-4 md:px-8 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Section Header */}
        <TypewriterEffectSmooth words={titleWords} />

        <div className="flex items-center justify-center mb-16 space-x-3 select-none">
          <div className="w-16 h-[2px] bg-secondary/60 rounded-full" />
          <div className="flex space-x-1 text-accent text-sm font-bold">
            <span>◇</span>
            <span>◇</span>
          </div>
          <div className="w-16 h-[2px] bg-secondary/60 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full items-center">
          {/* Left: Summary Metrics and CTA */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4 flex flex-col gap-6 text-left items-start"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              RATING TERBAIK
            </span>
            <h3 className="font-heading text-4xl text-dark font-bold leading-tight">
              Apa Kata Para Pencinta Pedas Gacoan?
            </h3>
            <p className="font-body text-gray-500 text-sm leading-relaxed">
              Kepuasan pelanggan adalah prioritas utama kami. Ribuan ulasan positif masuk setiap harinya dari penikmat mie pedas di seluruh Indonesia.
            </p>

            <div className="flex items-center gap-6 mt-2">
              <div className="flex flex-col">
                <span className="font-heading text-6xl font-bold text-dark">{averageRating}</span>
                <div className="flex gap-0.5 text-amber-500 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <span className="font-body text-gray-400 text-xs mt-1">Skor Rata-Rata</span>
              </div>
              <div className="h-16 w-[1px] bg-gray-200" />
              <div className="flex flex-col">
                <span className="font-heading text-5xl font-bold text-dark">
                  {testimonials.length > 0 ? testimonials.length : "10k+"}
                </span>
                <span className="font-body text-gray-400 text-xs mt-1">Ulasan Masuk</span>
              </div>
            </div>

            <Link href="/testimoni">
              <Button size="lg" className="bg-primary hover:bg-primary/95 text-white flex items-center gap-2 mt-4 rounded-xl">
                <MessageSquare className="w-4 h-4" />
                Tulis Ulasan Anda
              </Button>
            </Link>
          </motion.div>

          {/* Right: Dynamic Slider Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-8 bg-light border border-gray-100 rounded-[36px] p-8 md:p-12 shadow-sm relative min-h-[300px] flex flex-col justify-between"
          >
            {/* Quote watermark */}
            <Quote className="absolute right-8 top-8 w-20 h-20 text-gray-200/50 pointer-events-none" />

            <div className="relative overflow-hidden w-full h-full flex flex-col gap-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-6 text-left"
                >
                  <div className="flex gap-1 text-amber-500">
                    {[...Array(activeTestimonials[activeIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-500" />
                    ))}
                  </div>

                  <p className="font-body text-gray-600 text-base md:text-lg leading-relaxed italic pr-8">
                    &ldquo;{activeTestimonials[activeIndex].content}&rdquo;
                  </p>

                  <div className="flex flex-col mt-4">
                    <span className="font-body font-bold text-dark text-base">
                      {activeTestimonials[activeIndex].name || "Pelanggan Setia"}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slider navigations */}
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={prevTesti}
                className="p-2.5 bg-white border border-gray-200/50 hover:bg-gray-100 rounded-full text-dark transition-colors shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextTesti}
                className="p-2.5 bg-white border border-gray-200/50 hover:bg-gray-100 rounded-full text-dark transition-colors shadow-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
