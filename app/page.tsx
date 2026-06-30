import React from "react";
import { prisma } from "@/lib/prisma";
import LandingPageClient from "./LandingPageClient";
import { Menu, Package, Outlet, Gallery, Testimonial, HeroSlide, SocialMedia } from "@/types";

export const revalidate = 60; // Revalidate every 60 seconds (ISR)

async function getLandingPageData() {
  const [contents, heroSlides, menus, packages, outlets, galleries, testimonials, socials] = await Promise.all([
    prisma.siteContent.findMany(),
    prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
    prisma.menu.findMany({
      where: { isActive: true },
      orderBy: { id: "asc" },
    }),
    prisma.package.findMany({
      where: { isActive: true },
      orderBy: { id: "asc" },
    }),
    prisma.outlet.findMany({
      orderBy: { id: "asc" },
    }),
    prisma.gallery.findMany({
      orderBy: { order: "asc" },
    }),
    prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.socialMedia.findMany({
      orderBy: { order: "asc" },
    }),
  ]);

  // Convert key-value array into a single dictionary
  const contentMap = contents.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  return {
    content: contentMap,
    // JSON-serialize dates to prevent hydration mismatch warnings
    heroSlides: JSON.parse(JSON.stringify(heroSlides)) as HeroSlide[],
    menus: JSON.parse(JSON.stringify(menus)) as Menu[],
    packages: JSON.parse(JSON.stringify(packages)) as Package[],
    outlets: JSON.parse(JSON.stringify(outlets)) as Outlet[],
    galleries: JSON.parse(JSON.stringify(galleries)) as Gallery[],
    testimonials: JSON.parse(JSON.stringify(testimonials)) as Testimonial[],
    socials: JSON.parse(JSON.stringify(socials)) as SocialMedia[],
  };
}

export default async function Home() {
  const data = await getLandingPageData();

  return <LandingPageClient data={data} />;
}
