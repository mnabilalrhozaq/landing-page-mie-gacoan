import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(testimonials);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, rating, content } = body;

    if (!name || rating === undefined || !content) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        rating: Math.min(Math.max(parseInt(rating) || 5, 1), 5),
        content,
      },
    });

    // Revalidate landing page so the testimonial shows up immediately
    revalidatePath("/");
    revalidatePath("/testimoni");

    return NextResponse.json(testimonial, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
  }
}
