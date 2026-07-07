import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Menu } from "@/components/sections/Menu";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Menu as MenuType } from "@/types";

export const dynamic = 'force-dynamic';

async function getMenuData() {
  const [menus, siteLogo, tagline, socials] = await Promise.all([
    prisma.menu.findMany({
      where: { isActive: true },
      orderBy: { id: "asc" },
    }),
    prisma.siteContent.findUnique({ where: { key: "site_logo" } }),
    prisma.siteContent.findUnique({ where: { key: "footer_tagline" } }),
    prisma.socialMedia.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
  ]);

  return {
    menus: JSON.parse(JSON.stringify(menus)) as MenuType[],
    logoUrl: siteLogo?.value || null,
    tagline: tagline?.value || "Pedas, Murah, Bikin Nagih",
    socials: JSON.parse(JSON.stringify(socials)),
  };
}

export default async function MenuPage() {
  const { menus, logoUrl, tagline, socials } = await getMenuData();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky Navbar */}
      <Navbar logoUrl={logoUrl} />

      {/* Main Content Area */}
      <main className="flex-grow pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8 mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-primary transition-colors uppercase tracking-wider select-none"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </div>

        {/* Reusing catalog card container component */}
        <Menu menus={menus} />
      </main>

      {/* Dynamic Footer */}
      <Footer logoUrl={logoUrl} tagline={tagline} socials={socials} />
    </div>
  );
}
