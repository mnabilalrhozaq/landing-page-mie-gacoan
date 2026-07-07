"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [transitionCooldown, setTransitionCooldown] = useState(false);
  // Blocks scroll-to-next-section until last slide's content animations finish
  const [lastSlideReady, setLastSlideReady] = useState(false);
  const lastSlideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const paginate = useCallback((newDirection: number) => {
    setPage((prev) => [prev[0] + newDirection, newDirection]);
    setCurrentSlide((prev) => {
      let next = prev + newDirection;
      if (next < 0) next = totalSlides - 1;
      if (next >= totalSlides) next = 0;

      // If landing on the last slide, block scroll until content is fully rendered
      if (next === totalSlides - 1) {
        setLastSlideReady(false);
        if (lastSlideTimerRef.current) clearTimeout(lastSlideTimerRef.current);
        // 1400ms ≈ slide transition (600ms) + stagger cards (3 × ~200ms) + buffer
        lastSlideTimerRef.current = setTimeout(() => setLastSlideReady(true), 1400);
      }

      return next;
    });
  }, [totalSlides]);

  // Scroll Interception & Navigation Locking Logic
  const handleWheel = useCallback((e: WheelEvent) => {
    if (window.scrollY > 50) return;

    const atLastSlide = currentSlide === totalSlides - 1;
    const atFirstSlide = currentSlide === 0;

    // At last slide: only release scroll when content animations are done
    if (e.deltaY > 0 && atLastSlide) {
      if (!lastSlideReady) {
        e.preventDefault(); // still block until animations finish
      }
      return;
    }

    // At first slide scrolling up → let page scroll naturally
    if (e.deltaY < 0 && atFirstSlide) return;

    // Still have slides to navigate → block page scroll
    e.preventDefault();

    if (transitionCooldown) return;

    if (e.deltaY > 0 && !atLastSlide) {
      setTransitionCooldown(true);
      paginate(1);
      setTimeout(() => setTransitionCooldown(false), 900);
    } else if (e.deltaY < 0 && !atFirstSlide) {
      setTransitionCooldown(true);
      paginate(-1);
      setTimeout(() => setTransitionCooldown(false), 900);
    }
  }, [currentSlide, transitionCooldown, paginate, totalSlides, lastSlideReady]);

  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  // null = not yet determined, 'vertical' = locked as vertical swipe, 'horizontal' = locked as horizontal
  const touchLocked = useRef<'vertical' | 'horizontal' | null>(null);
  const touchPaginated = useRef(false);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
    touchLocked.current = null;
    touchPaginated.current = false;
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    // Only intercept when hero is in view (user hasn't scrolled past it)
    if (window.scrollY > 50) return;

    const deltaY = touchStartY.current - e.touches[0].clientY;
    const deltaX = touchStartX.current - e.touches[0].clientX;

    // Lock swipe direction early (after just 8px of movement)
    if (!touchLocked.current && (Math.abs(deltaY) > 8 || Math.abs(deltaX) > 8)) {
      touchLocked.current = Math.abs(deltaY) >= Math.abs(deltaX) ? 'vertical' : 'horizontal';
    }

    if (touchLocked.current === 'vertical') {
      const swipingDown = deltaY > 0; // finger moved up = swipe down = next slide
      const swipingUp = deltaY < 0;   // finger moved down = swipe up = prev slide

      const atLastSlide = currentSlide === totalSlides - 1;
      const atFirstSlide = currentSlide === 0;

      if (swipingDown && atLastSlide) {
        // Only release to page scroll once last-slide content is fully shown
        if (!lastSlideReady) {
          if (e.cancelable) e.preventDefault();
        }
        return;
      }

      if (swipingUp && atFirstSlide) {
        // Let page scroll up naturally
        return;
      }

      // Still have slides to show → block page scroll
      if (e.cancelable) e.preventDefault();

      // Only paginate once per gesture
      if (touchPaginated.current || transitionCooldown) return;

      if (deltaY > 40 && !atLastSlide) {
        touchPaginated.current = true;
        setTransitionCooldown(true);
        paginate(1);
        setTimeout(() => setTransitionCooldown(false), 900);
      } else if (deltaY < -40 && !atFirstSlide) {
        touchPaginated.current = true;
        setTransitionCooldown(true);
        paginate(-1);
        setTimeout(() => setTransitionCooldown(false), 900);
      }
    }
  }, [currentSlide, transitionCooldown, paginate, totalSlides, lastSlideReady]);

  const handleTouchEnd = useCallback(() => {
    touchLocked.current = null;
    touchPaginated.current = false;
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    element.addEventListener("wheel", handleWheel, { passive: false });
    element.addEventListener("touchstart", handleTouchStart, { passive: true });
    element.addEventListener("touchmove", handleTouchMove, { passive: false });
    element.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      element.removeEventListener("wheel", handleWheel);
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleWheel, handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Cleanup last-slide timer on unmount
  useEffect(() => {
    return () => {
      if (lastSlideTimerRef.current) clearTimeout(lastSlideTimerRef.current);
    };
  }, []);

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
  };  return (
    <section
      id="home"
      ref={containerRef}
      className="relative w-full h-[90vh] md:h-screen flex items-center justify-center overflow-hidden bg-dark"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Particle Background — sits above slide images but below text content */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <ParticleBackground />
      </div>

      <AnimatePresence initial={false} custom={direction} mode="wait">
        {currentSlide === 0 && (
          <motion.div
            key="slide-1"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full flex items-center justify-center"
          >
            {/* Slide 1 Background Image */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              {slides[0]?.image ? (
                <Image
                  src={slides[0].image}
                  alt="Background Slide 1"
                  fill
                  className="object-cover opacity-95"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-rose-950 via-red-900 to-orange-900" />
              )}
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-dark/60 md:bg-dark/50" />
            </div>

            {/* Content inside standard grid */}
            <div className="relative w-full h-full max-w-7xl mx-auto flex items-center px-6 md:px-12 z-30">
              <div className="flex flex-col gap-6 text-left max-w-2xl px-4 md:px-0">
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full w-fit shadow-xs uppercase tracking-wider"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-white text-white animate-pulse" />
                  MIE PEDAS NO. 1 DI INDONESIA
                </motion.span>
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, type: "spring", stiffness: 80 }}
                  className="font-heading text-5xl sm:text-7xl md:text-8xl text-white leading-none font-bold tracking-wide"
                >
                  MIE GACOAN
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="font-body text-gray-200 text-base md:text-lg leading-relaxed"
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
                    className="border-white text-white hover:bg-white/10 hover:text-white rounded-xl"
                    onClick={() => {
                      document.getElementById("outlets")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Temukan Outlet
                  </Button>
                </motion.div>
              </div>
            </div>
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
            className="absolute inset-0 w-full h-full flex items-center justify-center"
          >
            {/* Slide 2 Background Image */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              {slides[1]?.image ? (
                <Image
                  src={slides[1].image}
                  alt="Background Slide 2"
                  fill
                  className="object-cover opacity-95"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-red-950 via-rose-900 to-pink-900" />
              )}
              <div className="absolute inset-0 bg-dark/65" />
            </div>

            <div className="relative w-full h-full max-w-7xl mx-auto flex flex-col items-center justify-center text-center gap-6 px-6 md:px-12 z-30">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="font-heading text-4xl md:text-7xl text-white font-bold tracking-wide"
              >
                MENGAPA PILIH MIE GACOAN?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="font-body text-gray-200 max-w-xl text-sm md:text-base leading-relaxed"
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
                      "p-4 md:p-6 bg-white/90 backdrop-blur-sm border border-gray-155 rounded-[28px] flex flex-col items-center gap-3 shadow-sm hover:shadow-lg transition-all duration-300",
                      item.color
                    )}
                  >
                    <span className="text-4xl filter drop-shadow-md select-none">{item.icon}</span>
                    <h3 className="font-body font-bold text-dark text-sm md:text-base">{item.title}</h3>
                    <p className="font-body text-gray-600 text-xs leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
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
            className="absolute inset-0 w-full h-full flex items-center justify-center"
          >
            {/* Slide 3 Background Image */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              {slides[2]?.image ? (
                <Image
                  src={slides[2].image}
                  alt="Background Slide 3"
                  fill
                  className="object-cover opacity-95"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-950 via-red-900 to-rose-950" />
              )}
              <div className="absolute inset-0 bg-dark/65" />
            </div>

            <div className="relative w-full h-full max-w-7xl mx-auto flex flex-col items-center justify-center text-center gap-6 px-6 md:px-12 z-30">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="font-heading text-4xl md:text-7xl text-white font-bold tracking-wide"
              >
                INFORMASI OUTLET UTAMA
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="font-body text-gray-200 max-w-xl text-sm md:text-base leading-relaxed"
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
                    className="p-6 md:p-8 bg-white/90 backdrop-blur-sm border border-gray-155 rounded-[32px] flex flex-col items-center gap-4 shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <div className={cn("p-4 rounded-2xl border", item.bg)}>
                      {item.icon}
                    </div>
                    <h3 className="font-body text-gray-450 text-xs font-bold uppercase tracking-widest">{item.title}</h3>
                    <p className="font-heading text-3xl md:text-4xl text-dark font-black tracking-wide">{item.val}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 flex gap-2.5 z-30 select-none">
        {[...Array(totalSlides)].map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              const diff = idx - currentSlide;
              if (diff !== 0) paginate(diff);
            }}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer",
              currentSlide === idx ? "bg-primary w-6" : "bg-white/40 hover:bg-white/70"
            )}
            title={`Buka Slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
