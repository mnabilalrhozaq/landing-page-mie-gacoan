import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "./jwt";

export async function verifyAuth(request: NextRequest): Promise<{ id: number; email: string } | null> {
  try {
    const token = request.cookies.get("admin_token")?.value;
    if (!token) return null;
    return verifyAccessToken(token);
  } catch (err) {
    return null;
  }
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized", code: "TOKEN_EXPIRED" }, { status: 401 });
}
