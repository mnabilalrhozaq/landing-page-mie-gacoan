import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
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
    const { name, category, price, spicyLevel, description, isActive } = body;

    const baseSlug = slugify(name, { lower: true, strict: true });
    const current = await prisma.menu.findUnique({ where: { id } });
    
    let slug = current?.slug;
    if (current && current.name !== name) {
      const checkDuplicate = await prisma.menu.findUnique({ where: { slug: baseSlug } });
      slug = checkDuplicate ? `${baseSlug}-${Date.now().toString().slice(-4)}` : baseSlug;
    }

    const menu = await prisma.menu.update({
      where: { id },
      data: {
        name,
        slug,
        category,
        price: price !== undefined ? (typeof price === "string" ? parseInt(price.replace(/[\.,]/g, "")) || 0 : (parseInt(price as any) || 0)) : undefined,
        spicyLevel: spicyLevel !== undefined ? parseInt(spicyLevel) || 0 : undefined,
        description: description || null,
        isActive: isActive !== undefined ? !!isActive : undefined,
      },
    });

    revalidatePath("/");
    revalidatePath("/menu");

    return NextResponse.json(menu);
  } catch (err) {
    return NextResponse.json({ error: "Gagal memperbarui menu" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await verifyAuth(request);
  if (!auth) return unauthorizedResponse();

  try {
    const id = parseInt(params.id);
    const current = await prisma.menu.findUnique({ where: { id } });

    if (current && current.image && current.image.startsWith("/uploads/menus/")) {
      try {
        const filePath = join(process.cwd(), "public", current.image);
        await unlink(filePath);
      } catch (err) {
        // ignore disk file failures
      }
    }

    await prisma.menu.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath("/menu");

    return NextResponse.json({ message: "Menu berhasil dihapus!" });
  } catch (err) {
    return NextResponse.json({ error: "Gagal menghapus menu" }, { status: 500 });
  }
}
