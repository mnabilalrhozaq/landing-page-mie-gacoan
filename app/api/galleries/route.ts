import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const galleries = await prisma.gallery.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(galleries);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch galleries" }, { status: 500 });
  }
}
