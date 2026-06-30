import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await verifyAuth(request);
  if (!auth) return unauthorizedResponse();

  try {
    const id = parseInt(params.id);
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "File gambar tidak ditemukan!" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), "public", "uploads", "menus");
    await mkdir(uploadDir, { recursive: true });

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const filePath = join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const imageUrl = `/uploads/menus/${filename}`;

    // Clean up old image if present
    const current = await prisma.menu.findUnique({ where: { id } });
    if (current && current.image && current.image.startsWith("/uploads/menus/")) {
      try {
        const oldPath = join(process.cwd(), "public", current.image);
        await unlink(oldPath);
      } catch (err) {
        // ignore
      }
    }

    await prisma.menu.update({
      where: { id },
      data: { image: imageUrl },
    });

    revalidatePath("/");
    revalidatePath("/menu");

    return NextResponse.json({ imageUrl });
  } catch (err) {
    return NextResponse.json({ error: "Gagal mengunggah gambar menu" }, { status: 500 });
  }
}
