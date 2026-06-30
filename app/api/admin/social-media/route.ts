import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth) return unauthorizedResponse();

  try {
    const socials = await prisma.socialMedia.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(socials);
  } catch (err) {
    return NextResponse.json({ error: "Gagal memuat daftar sosial media" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth) return unauthorizedResponse();

  try {
    const body = await request.json();
    const { name, icon, url, isActive, order } = body;

    if (!name || !icon || !url) {
      return NextResponse.json({ error: "Nama, ikon, dan tautan wajib diisi!" }, { status: 400 });
    }

    const social = await prisma.socialMedia.create({
      data: {
        name,
        icon,
        url,
        isActive: isActive !== undefined ? !!isActive : true,
        order: order !== undefined ? parseInt(order) || 0 : 0,
      },
    });

    revalidatePath("/");

    return NextResponse.json(social, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Gagal membuat data sosial media baru" }, { status: 500 });
  }
}
