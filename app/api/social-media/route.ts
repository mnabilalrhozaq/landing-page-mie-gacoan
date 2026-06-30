import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const socials = await prisma.socialMedia.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(socials);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch social media" }, { status: 500 });
  }
}
