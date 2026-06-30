import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth) return unauthorizedResponse();

  try {
    const packages = await prisma.package.findMany({
      orderBy: { id: "asc" },
    });
    return NextResponse.json(packages);
  } catch (err) {
    return NextResponse.json({ error: "Gagal memuat paket menu" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth) return unauthorizedResponse();

  try {
    const body = await request.json();
    const { name, price, badge, description, isActive } = body;

    if (!name || price === undefined) {
      return NextResponse.json({ error: "Nama dan harga paket wajib diisi!" }, { status: 400 });
    }

    const pkg = await prisma.package.create({
      data: {
        name,
        price: typeof price === "string" ? parseInt(price.replace(/[\.,]/g, "")) || 0 : (parseInt(price as any) || 0),
        badge: badge || null,
        description: description || null,
        isActive: isActive !== undefined ? !!isActive : true,
      },
    });

    revalidatePath("/");

    return NextResponse.json(pkg, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Gagal menambahkan paket baru" }, { status: 500 });
  }
}
