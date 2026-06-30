import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth) return unauthorizedResponse();

  try {
    const body = await request.json();

    const upsertPromises = Object.entries(body).map(([key, val]) => {
      return prisma.siteContent.upsert({
        where: { key },
        update: { value: String(val) },
        create: { key, value: String(val) },
      });
    });

    await Promise.all(upsertPromises);

    // Revalidate paths
    revalidatePath("/");
    revalidatePath("/menu");

    return NextResponse.json({ message: "Konten berhasil diperbarui!" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update content keys" }, { status: 500 });
  }
}
