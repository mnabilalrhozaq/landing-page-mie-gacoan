import { NextRequest, NextResponse } from "next/server";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadToStorage, deleteFromStorage } from "@/lib/supabase-storage";
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

    // Hapus logo lama dari Supabase Storage jika ada
    const oldLogo = await prisma.siteContent.findUnique({ where: { key: "site_logo" } });
    if (oldLogo?.value?.startsWith("https://")) {
      await deleteFromStorage("logo", oldLogo.value).catch(() => {});
    }

    const logoUrl = await uploadToStorage("logo", file);

    await prisma.siteContent.upsert({
      where: { key: "site_logo" },
      update: { value: logoUrl },
      create: { key: "site_logo", value: logoUrl },
    });

    revalidatePath("/");
    return NextResponse.json({ logoUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal mengunggah file logo" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth) return unauthorizedResponse();

  try {
    const oldLogo = await prisma.siteContent.findUnique({ where: { key: "site_logo" } });
    if (oldLogo?.value?.startsWith("https://")) {
      await deleteFromStorage("logo", oldLogo.value).catch(() => {});
    }

    await prisma.siteContent.delete({ where: { key: "site_logo" } });

    revalidatePath("/");
    return NextResponse.json({ message: "Logo berhasil dihapus" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal menghapus logo" }, { status: 500 });
  }
}
