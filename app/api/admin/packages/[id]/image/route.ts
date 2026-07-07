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
    const current = await prisma.package.findUnique({ where: { id } });
    if (current?.image?.startsWith("https://")) {
      await deleteFromStorage("packages", current.image).catch(() => {});
    }

    const imageUrl = await uploadToStorage("packages", file);

    await prisma.package.update({
      where: { id },
      data: { image: imageUrl },
    });

    revalidatePath("/");

    return NextResponse.json({ imageUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal mengunggah gambar paket" }, { status: 500 });
  }
}
