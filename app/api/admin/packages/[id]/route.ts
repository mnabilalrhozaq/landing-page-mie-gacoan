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
    const { name, price, badge, description, isActive } = body;

    const pkg = await prisma.package.update({
      where: { id },
      data: {
        name,
        price: price !== undefined ? (typeof price === "string" ? parseInt(price.replace(/[\.,]/g, "")) || 0 : (parseInt(price as any) || 0)) : undefined,
        badge: badge || null,
        description: description || null,
        isActive: isActive !== undefined ? !!isActive : undefined,
      },
    });

    revalidatePath("/");

    return NextResponse.json(pkg);
  } catch (err) {
    return NextResponse.json({ error: "Gagal memperbarui paket" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await verifyAuth(request);
  if (!auth) return unauthorizedResponse();

  try {
    const id = parseInt(params.id);
    const current = await prisma.package.findUnique({ where: { id } });

    if (current && current.image && current.image.startsWith("/uploads/packages/")) {
      try {
        const filePath = join(process.cwd(), "public", current.image);
        await unlink(filePath);
      } catch (err) {
        // ignore disk file failures
      }
    }

    await prisma.package.delete({ where: { id } });

    revalidatePath("/");

    return NextResponse.json({ message: "Paket berhasil dihapus!" });
  } catch (err) {
    return NextResponse.json({ error: "Gagal menghapus paket" }, { status: 500 });
  }
}
