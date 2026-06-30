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
    const { name, icon, url, isActive, order } = body;

    const social = await prisma.socialMedia.update({
      where: { id },
      data: {
        name,
        icon,
        url,
        isActive: isActive !== undefined ? !!isActive : undefined,
        order: order !== undefined ? parseInt(order) || 0 : undefined,
      },
    });

    revalidatePath("/");

    return NextResponse.json(social);
  } catch (err) {
    return NextResponse.json({ error: "Gagal memperbarui data sosial media" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await verifyAuth(request);
  if (!auth) return unauthorizedResponse();

  try {
    const id = parseInt(params.id);
    await prisma.socialMedia.delete({ where: { id } });

    revalidatePath("/");

    return NextResponse.json({ message: "Sosial media berhasil dihapus" });
  } catch (err) {
    return NextResponse.json({ error: "Gagal menghapus sosial media" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await verifyAuth(request);
  if (!auth) return unauthorizedResponse();

  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { isActive } = body;

    const social = await prisma.socialMedia.update({
      where: { id },
      data: { isActive: !!isActive },
    });

    revalidatePath("/");

    return NextResponse.json(social);
  } catch (err) {
    return NextResponse.json({ error: "Gagal merubah status aktif" }, { status: 500 });
  }
}
