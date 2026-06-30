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
    const { order, isActive } = body;

    const slide = await prisma.heroSlide.update({
      where: { id },
      data: {
        order: order !== undefined ? parseInt(order) || 0 : undefined,
        isActive: isActive !== undefined ? !!isActive : undefined,
      },
    });

    revalidatePath("/");

    return NextResponse.json(slide);
  } catch (err) {
    return NextResponse.json({ error: "Gagal memperbarui hero slide" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await verifyAuth(request);
  if (!auth) return unauthorizedResponse();

  try {
    const id = parseInt(params.id);
    const current = await prisma.heroSlide.findUnique({ where: { id } });

    if (current && current.image && current.image.startsWith("/uploads/hero/")) {
      try {
        const filePath = join(process.cwd(), "public", current.image);
        await unlink(filePath);
      } catch (err) {
        // ignore disk file failures
      }
    }

    await prisma.heroSlide.delete({ where: { id } });

    revalidatePath("/");

    return NextResponse.json({ message: "Hero slide berhasil dihapus!" });
  } catch (err) {
    return NextResponse.json({ error: "Gagal menghapus hero slide" }, { status: 500 });
  }
}
