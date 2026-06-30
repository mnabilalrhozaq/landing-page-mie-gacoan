"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Clock, MapPin, BadgeDollarSign, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

// Import Three.js Particle Background dynamically with SSR disabled
const ParticleBackground = dynamic(() => import("../three/ParticleBackground"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-light" />,
});

interface HeroSlideData {
  id: number;
  image: string;
}

interface HeroProps {
  slides?: HeroSlideData[];
  infoJam?: string;
  infoCabang?: string;
  infoHarga?: string;
  card1Title?: string;
  card1Desc?: string;
  card2Title?: string;
  card2Desc?: string;
  card3Title?: string;
  card3Desc?: string;
  card4Title?: string;
  card4Desc?: string;
}

export function Hero({
  slides = [],
  infoJam = "10.00 – 22.00",
  infoCabang = "500+",
  infoHarga = "14rb",
  card1Title = "Pedasnya Juara",
  card1Desc = "Level pedas 0-6 yang menantang nyali.",
  card2Title = "Harga Sahabat",
  card2Desc = "Sangat bersahabat untuk semua kantong.",
  card3Title = "Tempat Asik",
  card3Desc = "Desain outlet luas, nyaman & modern.",
  card4Title = "Kualitas Terjaga",
  card4Desc = "Bahan segar pilihan diolah higienis.",
}: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const totalSlides = 3;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isHovered, nextSlide]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 220, damping: 26 },
        opacity: { duration: 0.3 },
        scale: { duration: 0.4 },
      },
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: "spring", stiffness: 220, damping: 26 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
    setCurrentSlide((prev) => {
      let next = prev + newDirection;
      if (next < 0) next = totalSlides - 1;
      if (next >= totalSlides) next = 0;
      return next;
    });
  };

  // Stagger variants for list item animations
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemFadeInUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <section
      id="home"
      className="relative w-full h-[90vh] md:h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-light via-white to-orange-50/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Particle Background */}
      <ParticleBackground />

      {/* Background radial gradient decoration */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Slides Content */}
      <div className="relative w-full h-full max-w-7xl mx-auto flex items-center px-4 md:px-8 z-10">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          {currentSlide === 0 && (
            <motion.div
              key="slide-1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
            >
              <div className="flex flex-col gap-6 text-left">
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full w-fit shadow-xs uppercase tracking-wider"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-primary text-primary animate-pulse" />
                  MIE PEDAS NO. 1 DI INDONESIA
                </motion.span>
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, type: "spring", stiffness: 80 }}
                  className="font-heading text-6xl md:text-8xl text-dark leading-none font-bold tracking-wide"
                >
                  MIE GACOAN
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="font-body text-gray-600 text-base md:text-lg leading-relaxed max-w-lg"
                >
                  Sajian mie pedas legendaris dengan bumbu gurih melimpah, dimsum lezat, dan es buah segar. Nikmati kebersamaan seru di outlet kami.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="flex items-center gap-4 mt-2"
                >
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/95 text-white shadow-md hover:shadow-lg transition-all rounded-xl"
                    onClick={() => {
                      document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Lihat Menu Kami
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-secondary text-secondary hover:bg-secondary/10 rounded-xl"
                    onClick={() => {
                      document.getElementById("outlets")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Temukan Outlet
                  </Button>
                </motion.div>
              </div>
              
              {/* Premium Floating Hero Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 100, damping: 15 }}
                className="relative w-full h-64 md:h-[400px] flex items-center justify-center cursor-pointer"
              >
                <motion.div
                  animate={{
                    y: [0, -16, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 5,
                    ease: "easeInOut",
                  }}
                  whileHover={{ scale: 1.05, rotate: 1.5 }}
                  className="relative w-full h-full"
                >
                  {slides.length > 0 ? (
                    <Image
                      src={slides[0].image}
                      alt="Mie Gacoan Hero"
                      fill
                      className="object-contain drop-shadow-[0_20px_40px_rgba(238,43,116,0.25)]"
                      priority
                    />
                  ) : (
                    <div className="w-72 h-72 md:w-[350px] md:h-[350px] bg-primary/5 rounded-full flex items-center justify-center border-4 border-dashed border-primary/20">
                      <span className="font-heading text-primary text-4xl animate-bounce">Mie Gacoan Promo</span>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {currentSlide === 1 && (
            <motion.div
              key="slide-2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full flex flex-col items-center justify-center text-center gap-6"
            >
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="font-heading text-5xl md:text-7xl text-dark font-bold tracking-wide"
              >
                MENGAPA PILIH MIE GACOAN?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="font-body text-gray-500 max-w-xl text-sm md:text-base leading-relaxed"
              >
                Kami berkomitmen memberikan kualitas hidangan terbaik dengan pengalaman bersantap yang tak terlupakan.
              </motion.p>
              
              {/* Staggered Cards Animation */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-6 w-full"
              >
                {[
                  { icon: "🌶️", title: card1Title, desc: card1Desc, color: "hover:border-red-400" },
                  { icon: "💰", title: card2Title, desc: card2Desc, color: "hover:border-amber-400" },
                  { icon: "🏠", title: card3Title, desc: card3Desc, color: "hover:border-blue-400" },
                  { icon: "✨", title: card4Title, desc: card4Desc, color: "hover:border-yellow-400" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    variants={itemFadeInUp}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className={cn(
                      "p-6 bg-white/85 backdrop-blur-sm border border-gray-150 rounded-[28px] flex flex-col items-center gap-3 shadow-sm hover:shadow-lg transition-all duration-300",
                      item.color
                    )}
                  >
                    <span className="text-4xl filter drop-shadow-md select-none">{item.icon}</span>
                    <h3 className="font-body font-bold text-dark text-sm md:text-base">{item.title}</h3>
                    <p className="font-body text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {currentSlide === 2 && (
            <motion.div
              key="slide-3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full flex flex-col items-center justify-center text-center gap-6"
            >
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="font-heading text-5xl md:text-7xl text-dark font-bold tracking-wide"
              >
                INFORMASI OUTLET UTAMA
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="font-body text-gray-500 max-w-xl text-sm md:text-base leading-relaxed"
              >
                Mie Gacoan melayani jutaan pelanggan setiap hari di ratusan cabang di seluruh penjuru Indonesia.
              </motion.p>
              
              {/* Staggered Bounce Info Cards */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 w-full max-w-4xl"
              >
                {[
                  { icon: <Clock className="w-8 h-8" />, title: "Jam Buka", val: infoJam, bg: "bg-secondary/10 text-secondary border-secondary/20" },
                  { icon: <MapPin className="w-8 h-8" />, title: "Total Cabang", val: `${infoCabang} Outlet`, bg: "bg-primary/10 text-primary border-primary/20" },
                  { icon: <BadgeDollarSign className="w-8 h-8" />, title: "Harga Mulai", val: `Rp ${infoHarga}`, bg: "bg-accent/15 text-amber-600 border-accent/25" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    variants={itemFadeInUp}
                    whileHover={{ y: -8, scale: 1.03 }}
                    className="p-8 bg-white/85 backdrop-blur-sm border border-gray-155 rounded-[32px] flex flex-col items-center gap-4 shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <div className={cn("p-4 rounded-2xl border", item.bg)}>
                      {item.icon}
                    </div>
                    <h3 className="font-body text-gray-400 text-xs font-bold uppercase tracking-widest">{item.title}</h3>
                    <p className="font-heading text-4xl text-dark font-black tracking-wide">{item.val}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Controls */}
      <button
        onClick={() => paginate(-1)}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-2.5 md:p-3.5 bg-white/60 backdrop-blur-md hover:bg-white/90 rounded-full text-dark border border-gray-200/50 shadow-md hover:shadow-lg transition-all cursor-pointer"
        title="Slide Sebelumnya"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 h-6" />
      </button>
      <button
        onClick={() => paginate(1)}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-2.5 md:p-3.5 bg-white/60 backdrop-blur-md hover:bg-white/90 rounded-full text-dark border border-gray-200/50 shadow-md hover:shadow-lg transition-all cursor-pointer"
        title="Slide Berikutnya"
      >
        <ChevronRight className="w-5 h-5 md:w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 flex gap-2.5 z-20 select-none">
        {[...Array(totalSlides)].map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              const diff = idx - currentSlide;
              if (diff !== 0) paginate(diff);
            }}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer",
              currentSlide === idx ? "bg-primary w-6" : "bg-gray-300 hover:bg-gray-400"
            )}
            title={`Buka Slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
