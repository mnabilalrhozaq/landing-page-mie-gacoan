import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth) return unauthorizedResponse();

  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(testimonials);
  } catch (err) {
    return NextResponse.json({ error: "Gagal memuat testimoni pelanggan" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth) return unauthorizedResponse();

  try {
    const body = await request.json();
    const { name, rating, content } = body;

    if (!name || rating === undefined || !content) {
      return NextResponse.json({ error: "Nama, rating, dan isi ulasan wajib diisi!" }, { status: 400 });
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        rating: Math.min(Math.max(parseInt(rating) || 5, 1), 5),
        content,
      },
    });

    // Revalidate public landing page
    revalidatePath("/");

    return NextResponse.json(testimonial, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Gagal membuat testimoni" }, { status: 500 });
  }
}
