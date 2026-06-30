import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password wajib diisi!" }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return NextResponse.json({ error: "Email atau password salah!" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return NextResponse.json({ error: "Email atau password salah!" }, { status: 401 });
    }

    const accessToken = signAccessToken({ id: admin.id, email: admin.email });
    const refreshToken = signRefreshToken({ id: admin.id, email: admin.email });

    const response = NextResponse.json({
      message: "Login berhasil",
      admin: { id: admin.id, name: admin.name, email: admin.email },
    });

    // Set Access Token cookie (15 minutes)
    response.cookies.set("admin_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60, // 15 mins
      path: "/",
    });

    // Set Refresh Token cookie (7 days)
    response.cookies.set("admin_refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: "Terjadi kesalahan internal" }, { status: 500 });
  }
}
