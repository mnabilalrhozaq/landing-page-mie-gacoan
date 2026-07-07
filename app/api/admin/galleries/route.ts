import { NextRequest, NextResponse } from "next/server";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadToStorage, deleteFromStorage } from "@/lib/supabase-storage";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth) return unauthorizedResponse();

  try {
    const galleries = await prisma.gallery.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(galleries);
  } catch (err) {
    return NextResponse.json({ error: "Gagal memuat galeri foto" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth) return unauthorizedResponse();

  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "File gambar tidak ditemukan!" }, { status: 400 });
    }

    const category = (formData.get("category") as string) || "Umum";

    const latestGallery = await prisma.gallery.findFirst({
      orderBy: { order: "desc" },
    });
    let currentOrder = latestGallery ? latestGallery.order + 1 : 0;

    const createdItems = [];

    for (const file of files) {
      const imageUrl = await uploadToStorage("galleries", file);

      const gallery = await prisma.gallery.create({
        data: {
          image: imageUrl,
          caption: file.name.substring(0, file.name.lastIndexOf(".")),
          category,
          order: currentOrder++,
        },
      });
      createdItems.push(gallery);
    }

    revalidatePath("/");
    return NextResponse.json(createdItems, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal mengunggah foto galeri" }, { status: 500 });
  }
}
