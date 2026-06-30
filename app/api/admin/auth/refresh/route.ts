import { NextRequest, NextResponse } from "next/server";
import { verifyRefreshToken, signAccessToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get("admin_refresh_token")?.value;
  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    const newAccessToken = signAccessToken({ id: payload.id, email: payload.email });

    const response = NextResponse.json({ message: "Token refreshed" });
    response.cookies.set("admin_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60, // 15 mins
      path: "/",
    });
    return response;
  } catch (err) {
    return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
  }
}
