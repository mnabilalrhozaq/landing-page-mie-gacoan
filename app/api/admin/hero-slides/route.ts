import { NextRequest, NextResponse } from "next/server";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadToStorage } from "@/lib/supabase-storage";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth) return unauthorizedResponse();

  try {
    const slides = await prisma.heroSlide.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(slides);
  } catch (err) {
    return NextResponse.json({ error: "Gagal memuat hero slides" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth) return unauthorizedResponse();

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "File gambar tidak ditemukan!" }, { status: 400 });
    }

    const imageUrl = await uploadToStorage("hero", file);

    const latestSlide = await prisma.heroSlide.findFirst({
      orderBy: { order: "desc" },
    });
    const order = latestSlide ? latestSlide.order + 1 : 0;

    const slide = await prisma.heroSlide.create({
      data: { image: imageUrl, order, isActive: true },
    });

    revalidatePath("/");
    return NextResponse.json(slide, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal mengunggah gambar hero slide" }, { status: 500 });
  }
}
