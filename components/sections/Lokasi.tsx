"use client";

import React from "react";
import { motion } from "framer-motion";
import { Navigation, Map, Compass } from "lucide-react";
import { TypewriterEffectSmooth } from "../ui/typewriter-effect";
import { Button } from "../ui/button";

interface LokasiProps {
  embedUrl?: string;
  directionsUrl?: string;
}

export function Lokasi({
  embedUrl,
  directionsUrl,
}: LokasiProps) {
  const finalEmbedUrl = embedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15865.312933939626!2d106.8271528!3d-6.2297465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e449a562ef%3A0x973a98cc78fb3c6d!2sMie%20Gacoan%20Kuningan!5e0!3m2!1sid!2sid!4v1718876400000!5m2!1sid!2sid";
  const finalDirectionsUrl = directionsUrl || "https://maps.app.goo.gl/y5f6XNuHn3sVqDkPA";
  const titleWords = [
    { text: "Lokasi" },
    { text: "Kami", className: "text-primary" },
  ];

  return (
    <section id="lokasi" className="relative py-20 px-4 md:px-8 bg-light scroll-mt-20">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Section Header */}
        <TypewriterEffectSmooth words={titleWords} />

        <div className="flex items-center justify-center mb-10 space-x-3 select-none">
          <div className="w-16 h-[2px] bg-secondary/60 rounded-full" />
          <div className="flex space-x-1 text-accent text-sm font-bold">
            <span>◇</span>
            <span>◇</span>
          </div>
          <div className="w-16 h-[2px] bg-secondary/60 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full mt-4">
          {/* Details & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-4 flex flex-col gap-6 text-left items-start"
          >
            <h3 className="font-heading text-4xl text-dark font-bold leading-tight">
              Kunjungi Outlet Jagoan Terdekat Anda!
            </h3>
            <p className="font-body text-gray-500 text-sm leading-relaxed">
              Makan langsung di tempat (*dine-in*) untuk merasakan suasana ramai, seru, dan asik khas Mie Gacoan. Kami juga melayani pesan antar (*delivery*) atau dibawa pulang (*take-away*).
            </p>
            <div className="flex flex-col gap-3 font-body text-xs text-gray-500 font-semibold mt-2">
              <span className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-secondary" />
                Sistem Peta Terintegrasi
              </span>
              <span className="flex items-center gap-2">
                <Map className="w-5 h-5 text-primary" />
                Semua Kota Tercover
              </span>
            </div>

            <a href={finalDirectionsUrl} target="_blank" rel="noopener noreferrer" className="mt-4">
              <Button size="lg" className="bg-secondary hover:bg-secondary/95 text-white flex items-center gap-2 rounded-xl">
                <Navigation className="w-4 h-4 fill-white" />
                Buka di Google Maps
              </Button>
            </a>
          </motion.div>

          {/* Embedded Map Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-8 w-full h-[350px] md:h-[450px] rounded-[36px] overflow-hidden border border-gray-200/50 shadow-md relative"
          >
            <iframe
              src={finalEmbedUrl}
              className="w-full h-full border-0 absolute inset-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps Location"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
