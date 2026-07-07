import { NextRequest, NextResponse } from "next/server";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadToStorage, deleteFromStorage } from "@/lib/supabase-storage";
import { revalidatePath } from "next/cache";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await verifyAuth(request);
  if (!auth) return unauthorizedResponse();

  try {
    const id = parseInt(params.id);
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "File gambar tidak ditemukan!" }, { status: 400 });
    }

    // Hapus gambar lama dari Supabase Storage jika ada
    const current = await prisma.menu.findUnique({ where: { id } });
    if (current?.image?.startsWith("https://")) {
      await deleteFromStorage("menus", current.image).catch(() => {});
    }

    const imageUrl = await uploadToStorage("menus", file);

    await prisma.menu.update({
      where: { id },
      data: { image: imageUrl },
    });

    revalidatePath("/");
    revalidatePath("/menu");

    return NextResponse.json({ imageUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal mengunggah gambar menu" }, { status: 500 });
  }
}
