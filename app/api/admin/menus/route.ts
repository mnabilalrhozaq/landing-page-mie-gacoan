import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth) return unauthorizedResponse();

  try {
    const menus = await prisma.menu.findMany({
      orderBy: { id: "asc" },
    });
    return NextResponse.json(menus);
  } catch (err) {
    return NextResponse.json({ error: "Gagal memuat menu" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth) return unauthorizedResponse();

  try {
    const body = await request.json();
    const { name, category, price, spicyLevel, description, isActive } = body;

    if (!name || !category || price === undefined) {
      return NextResponse.json({ error: "Nama, kategori, dan harga wajib diisi!" }, { status: 400 });
    }

    const baseSlug = slugify(name, { lower: true, strict: true });
    
    // Check slug duplicates
    const checkDuplicate = await prisma.menu.findUnique({ where: { slug: baseSlug } });
    const slug = checkDuplicate ? `${baseSlug}-${Date.now().toString().slice(-4)}` : baseSlug;

    const menu = await prisma.menu.create({
      data: {
        name,
        slug,
        category,
        price: typeof price === "string" ? parseInt(price.replace(/[\.,]/g, "")) || 0 : (parseInt(price as any) || 0),
        spicyLevel: parseInt(spicyLevel) || 0,
        description: description || null,
        isActive: isActive !== undefined ? !!isActive : true,
      },
    });

    revalidatePath("/");
    revalidatePath("/menu");

    return NextResponse.json(menu, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Gagal menambahkan menu baru" }, { status: 500 });
  }
}
