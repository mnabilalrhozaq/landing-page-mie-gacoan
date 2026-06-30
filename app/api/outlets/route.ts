import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");

    const outlets = await prisma.outlet.findMany({
      where: {
        ...(city && city !== "Semua Kota" ? { city } : {}),
      },
      orderBy: { id: "asc" },
    });
    return NextResponse.json(outlets);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch outlets" }, { status: 500 });
  }
}
