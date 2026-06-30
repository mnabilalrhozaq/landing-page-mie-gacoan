import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await verifyAuth(request);
  if (!auth) return unauthorizedResponse();

  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Nama dan email wajib diisi!" }, { status: 400 });
    }

    // Check if email already used by another admin
    const existingEmail = await prisma.admin.findFirst({
      where: {
        email,
        NOT: { id },
      },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "Email sudah digunakan oleh admin lain!" },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = { name, email };
    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedAdmin);
  } catch (err) {
    return NextResponse.json({ error: "Gagal memperbarui data admin" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await verifyAuth(request);
  if (!auth) return unauthorizedResponse();

  try {
    const id = parseInt(params.id);

    // Prevent lockout: check if there is more than 1 admin
    const adminCount = await prisma.admin.count();
    if (adminCount <= 1) {
      return NextResponse.json(
        { error: "Tidak dapat menghapus admin terakhir! Harus menyisakan minimal 1 admin." },
        { status: 400 }
      );
    }

    await prisma.admin.delete({ where: { id } });

    return NextResponse.json({ message: "Admin berhasil dihapus!" });
  } catch (err) {
    return NextResponse.json({ error: "Gagal menghapus admin" }, { status: 500 });
  }
}
