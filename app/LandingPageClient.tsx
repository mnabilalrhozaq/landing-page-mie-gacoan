"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SplashScreen } from "@/components/layout/SplashScreen";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Welcome } from "@/components/sections/Welcome";
import { About } from "@/components/sections/About";
import { Menu } from "@/components/sections/Menu";
import { Paket } from "@/components/sections/Paket";
import { Outlets } from "@/components/sections/Outlets";
import { Galeri } from "@/components/sections/Galeri";
import { Testimoni } from "@/components/sections/Testimoni";
import { Lokasi } from "@/components/sections/Lokasi";
import { Footer } from "@/components/layout/Footer";
import { Menu as MenuType, Package as PackageType, Outlet as OutletType, Gallery as GalleryType, Testimonial as TestimonialType, HeroSlide as HeroSlideType, SocialMedia } from "@/types";

interface LandingPageClientProps {
  data: {
    content: Record<string, string>;
    heroSlides: HeroSlideType[];
    menus: MenuType[];
    packages: PackageType[];
    outlets: OutletType[];
    galleries: GalleryType[];
    testimonials: TestimonialType[];
    socials: SocialMedia[];
  };
}

export default function LandingPageClient({ data }: LandingPageClientProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const { content, heroSlides, menus, packages, outlets, galleries, testimonials, socials } = data;

  return (
    <>
      {/* Intro Page Transition Screen */}
      <SplashScreen
        logoUrl={content.site_logo}
        onComplete={() => setIsLoaded(true)}
      />

      <AnimatePresence>
        {isLoaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col min-h-screen overflow-x-hidden"
          >
            {/* 1. Navbar */}
            <Navbar logoUrl={content.site_logo} />

            {/* Main Sections */}
            <main className="flex-grow">
              {/* 2. Hero Section */}
              <Hero
                slides={heroSlides}
                infoJam={content.hero_info_jam}
                infoCabang={content.hero_info_cabang}
                infoHarga={content.hero_info_harga}
                card1Title={content.hero_card1_title}
                card1Desc={content.hero_card1_desc}
                card2Title={content.hero_card2_title}
                card2Desc={content.hero_card2_desc}
                card3Title={content.hero_card3_title}
                card3Desc={content.hero_card3_desc}
                card4Title={content.hero_card4_title}
                card4Desc={content.hero_card4_desc}
              />

              {/* 3. Welcome Section */}
              <Welcome
                quote={content.welcome_quote}
                desc={content.welcome_desc}
                visi={content.visi}
                misi1={content.misi_1}
                misi2={content.misi_2}
                misi3={content.misi_3}
                nilais={[
                  content.nilai_1 || "Pedas",
                  content.nilai_2 || "Murah",
                  content.nilai_3 || "Nagih",
                  content.nilai_4 || "Modern",
                  content.nilai_5 || "Untuk Semua",
                ]}
              />

              {/* 4. About Us Section */}
              <About
                desc={content.about_desc}
                cabangVal={content.about_cabang}
                tahunVal={content.about_tahun}
                pelangganVal={content.about_pelanggan}
              />

              {/* 5. Menu Catalog */}
              <Menu menus={menus} />

              {/* 6. Paket Combos */}
              <Paket packages={packages} />

              {/* 7. Outlets Listing */}
              <Outlets outlets={outlets} />

              {/* 8. Galeri Masonry */}
              <Galeri galleries={galleries} />

              {/* 9. Testimoni Reviews */}
              <Testimoni testimonials={testimonials} />

              {/* 10. Lokasi Map */}
              <Lokasi
                embedUrl={content.lokasi_embed_url}
                directionsUrl={content.lokasi_directions_url}
                title={content.lokasi_title}
                desc={content.lokasi_desc}
                buttonText={content.lokasi_button_text}
              />
            </main>

            {/* 11. Footer */}
            <Footer
              logoUrl={content.site_logo}
              tagline={content.footer_tagline}
              socials={socials}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
