import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await verifyAuth(request);
  if (!auth) return unauthorizedResponse();

  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { name, city, address, openTime, mapsUrl, isOpen } = body;

    if (!name || !city || !address) {
      return NextResponse.json({ error: "Nama, kota, dan alamat wajib diisi!" }, { status: 400 });
    }

    const outlet = await prisma.outlet.update({
      where: { id },
      data: {
        name,
        city,
        address,
        openTime: openTime || null,
        mapsUrl: mapsUrl || null,
        isOpen: isOpen !== undefined ? !!isOpen : undefined,
      },
    });

    revalidatePath("/");

    return NextResponse.json(outlet);
  } catch (err) {
    return NextResponse.json({ error: "Gagal memperbarui outlet" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await verifyAuth(request);
  if (!auth) return unauthorizedResponse();

  try {
    const id = parseInt(params.id);
    await prisma.outlet.delete({ where: { id } });

    revalidatePath("/");

    return NextResponse.json({ message: "Outlet berhasil dihapus!" });
  } catch (err) {
    return NextResponse.json({ error: "Gagal menghapus outlet" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await verifyAuth(request);
  if (!auth) return unauthorizedResponse();

  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { isOpen } = body;

    if (isOpen === undefined) {
      return NextResponse.json({ error: "Parameter isOpen wajib dikirim!" }, { status: 400 });
    }

    const outlet = await prisma.outlet.update({
      where: { id },
      data: {
        isOpen: !!isOpen,
      },
    });

    revalidatePath("/");

    return NextResponse.json(outlet);
  } catch (err) {
    return NextResponse.json({ error: "Gagal memperbarui status buka/tutup outlet" }, { status: 500 });
  }
}
