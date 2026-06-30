import { NextRequest, NextResponse } from "next/server";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth) return unauthorizedResponse();

  try {
    const [totalMenus, totalPackages, totalOutlets, totalGalleries, totalTestimonials] = await Promise.all([
      prisma.menu.count(),
      prisma.package.count(),
      prisma.outlet.count(),
      prisma.gallery.count(),
      prisma.testimonial.count(),
    ]);

    return NextResponse.json({
      totalMenus,
      totalPackages,
      totalOutlets,
      totalGalleries,
      totalTestimonials,
    });
  } catch (err) {
    return NextResponse.json({ error: "Gagal memuat statistik dashboard" }, { status: 500 });
  }
}
