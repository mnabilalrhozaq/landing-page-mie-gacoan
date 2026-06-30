import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const slides = await prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(slides);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch slides" }, { status: 500 });
  }
}
