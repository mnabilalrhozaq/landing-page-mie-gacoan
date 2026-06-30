import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAdminApi = pathname.startsWith("/api/admin/") && !pathname.startsWith("/api/admin/auth");

  if (isAdminPage || isAdminApi) {
    const token = request.cookies.get("admin_token")?.value;

    if (!token) {
      if (isAdminPage) return NextResponse.redirect(new URL("/admin/login", request.url));
      return NextResponse.json({ error: "Unauthorized", code: "NO_TOKEN" }, { status: 401 });
    }

    const payload = parseJwt(token);
    if (!payload || !payload.exp || Date.now() >= payload.exp * 1000) {
      if (isAdminPage) {
        const response = NextResponse.redirect(new URL("/admin/login", request.url));
        response.cookies.delete("admin_token");
        return response;
      }
      return NextResponse.json({ error: "Unauthorized", code: "TOKEN_EXPIRED" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
