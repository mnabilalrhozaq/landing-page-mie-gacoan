import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out successfully" });
  // Delete both cookie values
  response.cookies.delete("admin_token");
  response.cookies.delete("admin_refresh_token");
  return response;
}
