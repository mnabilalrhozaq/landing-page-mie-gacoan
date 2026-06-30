import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const menus = await prisma.menu.findMany({
      where: {
        isActive: true,
        ...(category && category !== "semua" ? { category: category as any } : {}),
      },
      orderBy: { id: "asc" },
    });
    return NextResponse.json(menus);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch menus" }, { status: 500 });
  }
}
