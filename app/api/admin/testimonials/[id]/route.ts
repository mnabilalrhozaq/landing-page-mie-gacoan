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
    const { name, rating, content } = body;

    if (!name || rating === undefined || !content) {
      return NextResponse.json({ error: "Nama, rating, dan isi ulasan wajib diisi!" }, { status: 400 });
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        name,
        rating: Math.min(Math.max(parseInt(rating) || 5, 1), 5),
        content,
      },
    });

    // Revalidate public landing page
    revalidatePath("/");

    return NextResponse.json(testimonial);
  } catch (err) {
    return NextResponse.json({ error: "Gagal memperbarui testimoni" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await verifyAuth(request);
  if (!auth) return unauthorizedResponse();

  try {
    const id = parseInt(params.id);
    await prisma.testimonial.delete({ where: { id } });

    // Revalidate public landing page
    revalidatePath("/");

    return NextResponse.json({ message: "Testimoni berhasil dihapus!" });
  } catch (err) {
    return NextResponse.json({ error: "Gagal menghapus testimoni" }, { status: 500 });
  }
}
