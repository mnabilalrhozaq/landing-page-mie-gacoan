import { NextRequest, NextResponse } from "next/server";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth) return unauthorizedResponse();

  try {
    const admin = await prisma.admin.findUnique({
      where: { id: auth.id },
      select: { id: true, name: true, email: true },
    });
    
    if (!admin) {
      return unauthorizedResponse();
    }
    
    return NextResponse.json(admin);
  } catch (err) {
    return NextResponse.json({ error: "Terjadi kesalahan internal" }, { status: 500 });
  }
}
