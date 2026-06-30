import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { join } from "path";
import { unlink } from "fs/promises";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await verifyAuth(request);
  if (!auth) return unauthorizedResponse();

  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { category, caption } = body;

    const gallery = await prisma.gallery.update({
      where: { id },
      data: {
        category: category !== undefined ? category : undefined,
        caption: caption !== undefined ? caption : undefined,
      },
    });

    revalidatePath("/");

    return NextResponse.json(gallery);
  } catch (err) {
    return NextResponse.json({ error: "Gagal memperbarui foto galeri" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await verifyAuth(request);
  if (!auth) return unauthorizedResponse();

  try {
    const id = parseInt(params.id);
    const current = await prisma.gallery.findUnique({ where: { id } });

    if (current && current.image && current.image.startsWith("/uploads/galleries/")) {
      try {
        const filePath = join(process.cwd(), "public", current.image);
        await unlink(filePath);
      } catch (err) {
        // ignore disk file failures
      }
    }

    await prisma.gallery.delete({ where: { id } });

    revalidatePath("/");

    return NextResponse.json({ message: "Foto galeri berhasil dihapus!" });
  } catch (err) {
    return NextResponse.json({ error: "Gagal menghapus foto galeri" }, { status: 500 });
  }
}
