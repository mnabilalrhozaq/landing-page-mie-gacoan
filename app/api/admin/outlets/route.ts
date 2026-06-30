import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth) return unauthorizedResponse();

  try {
    const outlets = await prisma.outlet.findMany({
      orderBy: { id: "asc" },
    });
    return NextResponse.json(outlets);
  } catch (err) {
    return NextResponse.json({ error: "Gagal memuat daftar outlet" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth) return unauthorizedResponse();

  try {
    const body = await request.json();
    const { name, city, address, openTime, mapsUrl, isOpen } = body;

    if (!name || !city || !address) {
      return NextResponse.json({ error: "Nama, kota, dan alamat wajib diisi!" }, { status: 400 });
    }

    const outlet = await prisma.outlet.create({
      data: {
        name,
        city,
        address,
        openTime: openTime || null,
        mapsUrl: mapsUrl || null,
        isOpen: isOpen !== undefined ? !!isOpen : true,
      },
    });

    revalidatePath("/");

    return NextResponse.json(outlet, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Gagal menambahkan outlet baru" }, { status: 500 });
  }
}
