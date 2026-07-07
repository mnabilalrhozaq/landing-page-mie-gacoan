"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, Sparkles, Info, UtensilsCrossed, Package, MapPin, Image as ImageIcon, Star, Navigation } from "lucide-react";
import { ExpandableTabs, TabItem } from "../ui/expandable-tabs";
import { cn } from "@/lib/utils";

const tabsList: TabItem[] = [
  { id: "home", title: "Home", icon: "Home", href: "#home" },
  { id: "welcome", title: "Welcome", icon: "Sparkles", href: "#welcome" },
  { id: "about", title: "About", icon: "Info", href: "#about" },
  { id: "menu", title: "Menu", icon: "UtensilsCrossed", href: "#menu" },
  { id: "paket", title: "Paket", icon: "Package", href: "#paket" },
  { id: "outlets", title: "Outlets", icon: "MapPin", href: "#outlets" },
  { id: "galeri", title: "Galeri", icon: "Image", href: "#galeri" },
  { id: "testimoni", title: "Testimoni", icon: "Star", href: "#testimoni" },
  { id: "lokasi", title: "Lokasi", icon: "Navigation", href: "#lokasi" },
];

interface NavbarProps {
  logoUrl?: string | null;
}

export function Navbar({ logoUrl }: NavbarProps) {
  const [activeTab, setActiveTab] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Check current section in viewport to set active tab
      const scrollPosition = window.scrollY + 120;
      for (const tab of tabsList) {
        const element = document.getElementById(tab.id);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveTab(tab.id);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const topOffset = element.offsetTop - 80;
      window.scrollTo({
        top: topOffset,
        behavior: "smooth",
      });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 w-full z-50 transition-all duration-300 px-4 md:px-8 py-3",
          isScrolled
            ? "bg-white/85 backdrop-blur-md shadow-sm border-b border-gray-200/40"
            : "bg-transparent backdrop-blur-sm"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo Area */}
          <Link href="#home" onClick={() => handleTabChange("home")} className="flex items-center gap-2">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt="Mie Gacoan"
                width={120}
                height={40}
                className="h-10 w-auto object-contain"
                priority
              />
            ) : (
              <span className="font-heading text-3xl font-bold text-secondary select-none tracking-wide">
                Mie Gacoan
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <ExpandableTabs tabs={tabsList} activeTab={activeTab} onChange={handleTabChange} />
          </div>

          {/* Mobile Hamburger Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-full text-gray-600 hover:text-dark hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-[64px] bg-white z-40 lg:hidden flex flex-col px-6 py-8 shadow-inner overflow-y-auto"
          >
            <div className="flex flex-col gap-4">
              {tabsList.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={cn(
                      "flex items-center gap-4 py-3 px-4 rounded-xl text-lg font-semibold transition-colors text-left",
                      isActive
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-50 hover:text-dark"
                    )}
                  >
                    {tab.id === "home" && <Home className="w-5 h-5" />}
                    {tab.id === "welcome" && <Sparkles className="w-5 h-5" />}
                    {tab.id === "about" && <Info className="w-5 h-5" />}
                    {tab.id === "menu" && <UtensilsCrossed className="w-5 h-5" />}
                    {tab.id === "paket" && <Package className="w-5 h-5" />}
                    {tab.id === "outlets" && <MapPin className="w-5 h-5" />}
                    {tab.id === "galeri" && <ImageIcon className="w-5 h-5" />}
                    {tab.id === "testimoni" && <Star className="w-5 h-5" />}
                    {tab.id === "lokasi" && <Navigation className="w-5 h-5" />}
                    <span>{tab.title}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
