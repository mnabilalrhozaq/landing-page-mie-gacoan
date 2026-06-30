import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), "public", "uploads", "hero");
    await mkdir(uploadDir, { recursive: true });

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const filePath = join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const imageUrl = `/uploads/hero/${filename}`;

    const latestSlide = await prisma.heroSlide.findFirst({
      orderBy: { order: "desc" },
    });
    const order = latestSlide ? latestSlide.order + 1 : 0;

    const slide = await prisma.heroSlide.create({
      data: {
        image: imageUrl,
        order,
        isActive: true,
      },
    });

    revalidatePath("/");

    return NextResponse.json(slide, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Gagal mengunggah gambar hero slide" }, { status: 500 });
  }
}
