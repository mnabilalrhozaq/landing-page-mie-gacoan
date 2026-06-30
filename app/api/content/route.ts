import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const contents = await prisma.siteContent.findMany();
    const data = contents.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}
