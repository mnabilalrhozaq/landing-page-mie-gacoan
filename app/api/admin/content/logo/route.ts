import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth) return unauthorizedResponse();

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "File logo tidak ditemukan!" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), "public", "uploads", "logo");
    await mkdir(uploadDir, { recursive: true });

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const filePath = join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const logoUrl = `/uploads/logo/${filename}`;

    // Clean up old logo file if present
    const oldLogo = await prisma.siteContent.findUnique({ where: { key: "site_logo" } });
    if (oldLogo && oldLogo.value.startsWith("/uploads/logo/")) {
      try {
        const oldPath = join(process.cwd(), "public", oldLogo.value);
        await unlink(oldPath);
      } catch (err) {
        // ignore file delete failures
      }
    }

    // Save key
    await prisma.siteContent.upsert({
      where: { key: "site_logo" },
      update: { value: logoUrl },
      create: { key: "site_logo", value: logoUrl },
    });

    revalidatePath("/");

    return NextResponse.json({ logoUrl });
  } catch (err) {
    return NextResponse.json({ error: "Gagal mengunggah file logo" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth) return unauthorizedResponse();

  try {
    const oldLogo = await prisma.siteContent.findUnique({ where: { key: "site_logo" } });
    if (oldLogo && oldLogo.value.startsWith("/uploads/logo/")) {
      try {
        const oldPath = join(process.cwd(), "public", oldLogo.value);
        await unlink(oldPath);
      } catch (err) {
        // ignore
      }
    }

    await prisma.siteContent.delete({ where: { key: "site_logo" } });

    revalidatePath("/");

    return NextResponse.json({ message: "Logo berhasil dihapus" });
  } catch (err) {
    return NextResponse.json({ error: "Gagal menghapus logo" }, { status: 500 });
  }
}
