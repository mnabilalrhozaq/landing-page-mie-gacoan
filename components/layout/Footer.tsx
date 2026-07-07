"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import * as Icons from "lucide-react";
import { SocialMedia } from "@/types";

interface FooterProps {
  logoUrl?: string | null;
  tagline?: string;
  socials?: SocialMedia[];
}

export function Footer({
  logoUrl,
  tagline = "Pedas, Murah, Bikin Nagih",
  socials = [],
}: FooterProps) {
  // Sort and filter active social media links
  const activeSocials = socials
    .filter((s) => s.isActive)
    .sort((a, b) => a.order - b.order);

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const topOffset = element.offsetTop - 80;
      window.scrollTo({
        top: topOffset,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className="bg-dark text-white pt-16 pb-8 px-4 md:px-8 border-t border-gray-800 select-none">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Tagline */}
          <div className="flex flex-col gap-4 text-left items-start md:col-span-2">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt="Mie Gacoan"
                width={120}
                height={40}
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            ) : (
              <span className="font-heading text-4xl font-bold text-secondary tracking-wide">
                Mie Gacoan
              </span>
            )}
            <p className="font-body text-gray-400 text-sm leading-relaxed max-w-sm mt-1">
              {tagline}
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 mt-4">
              {activeSocials.map((social) => {
                const IconComponent = Icons[social.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
                
                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gray-800 hover:bg-primary rounded-full text-gray-300 hover:text-white transition-all duration-300 hover:shadow-[0_0_15px_rgba(238,43,116,0.45)] hover:scale-105 shadow-sm"
                    title={social.name}
                  >
                    {IconComponent ? (
                      <IconComponent className="w-4.5 h-4.5" />
                    ) : (
                      <Icons.Globe className="w-4.5 h-4.5" />
                    )}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="flex flex-col gap-4 text-left items-start">
            <h4 className="font-body font-bold text-base uppercase tracking-wider text-secondary">
              Navigasi
            </h4>
            <div className="flex flex-col gap-2.5 font-body text-gray-400 text-sm">
              {[
                { label: "Home", target: "home" },
                { label: "Welcome", target: "welcome" },
                { label: "About Us", target: "about" },
                { label: "Menu Kami", target: "menu" },
                { label: "Promo Paket", target: "paket" },
              ].map((link, i) => (
                <button
                  key={i}
                  onClick={() => handleScrollTo(link.target)}
                  className="hover:text-primary transition-colors text-left focus:outline-none"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Information Links */}
          <div className="flex flex-col gap-4 text-left items-start">
            <h4 className="font-body font-bold text-base uppercase tracking-wider text-secondary">
              Layanan
            </h4>
            <div className="flex flex-col gap-2.5 font-body text-gray-400 text-sm">
              {[
                { label: "Outlets Cabang", target: "outlets" },
                { label: "Galeri Foto", target: "galeri" },
                { label: "Testimoni", target: "testimoni" },
                { label: "Lokasi Outlet", target: "lokasi" },
              ].map((link, i) => (
                <button
                  key={i}
                  onClick={() => handleScrollTo(link.target)}
                  className="hover:text-primary transition-colors text-left focus:outline-none"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright divider block */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-500 text-xs font-medium">
          <span>&copy; {new Date().getFullYear()} Mie Gacoan. All Rights Reserved.</span>
          <div className="flex gap-4">
            <span className="cursor-default hover:text-white transition-colors">Privacy Policy</span>
            <span className="cursor-default hover:text-white transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
