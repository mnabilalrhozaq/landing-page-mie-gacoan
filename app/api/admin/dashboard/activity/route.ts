import { NextRequest, NextResponse } from "next/server";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth) return unauthorizedResponse();

  try {
    const [menus, packages, outlets, galleries, testimonials] = await Promise.all([
      prisma.menu.findMany({ take: 5, orderBy: { updatedAt: "desc" } }),
      prisma.package.findMany({ take: 5, orderBy: { updatedAt: "desc" } }),
      prisma.outlet.findMany({ take: 5, orderBy: { updatedAt: "desc" } }),
      prisma.gallery.findMany({ take: 5, orderBy: { updatedAt: "desc" } }),
      prisma.testimonial.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
    ]);

    const activities: { id: string; text: string; date: string; href: string }[] = [];

    menus.forEach((item) => {
      activities.push({
        id: `menu-${item.id}-${item.updatedAt.getTime()}`,
        text: `Menu "${item.name}" ditambahkan atau diperbarui`,
        date: item.updatedAt.toISOString(),
        href: "/admin/menu",
      });
    });

    packages.forEach((item) => {
      activities.push({
        id: `pkg-${item.id}-${item.updatedAt.getTime()}`,
        text: `Paket "${item.name}" ditambahkan atau diperbarui`,
        date: item.updatedAt.toISOString(),
        href: "/admin/paket",
      });
    });

    outlets.forEach((item) => {
      activities.push({
        id: `outlet-${item.id}-${item.updatedAt.getTime()}`,
        text: `Status outlet "${item.name}" (${item.city}) dimodifikasi`,
        date: item.updatedAt.toISOString(),
        href: "/admin/outlets",
      });
    });

    galleries.forEach((item) => {
      activities.push({
        id: `gallery-${item.id}-${item.updatedAt.getTime()}`,
        text: `Unggah foto galeri baru`,
        date: item.updatedAt.toISOString(),
        href: "/admin/galeri",
      });
    });

    testimonials.forEach((item) => {
      activities.push({
        id: `testi-${item.id}-${item.createdAt.getTime()}`,
        text: `Testimoni baru masuk dari pelanggan "${item.name || "Anonim"}"`,
        date: item.createdAt.toISOString(),
        href: "/admin/testimoni",
      });
    });

    // Sort by timestamp descending
    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const finalActivities = activities.slice(0, 5);

    return NextResponse.json(finalActivities);
  } catch (err) {
    return NextResponse.json({ error: "Gagal memuat log aktivitas" }, { status: 500 });
  }
}
