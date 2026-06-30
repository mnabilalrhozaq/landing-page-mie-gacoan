export async function adminFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const res = await fetch(url, { ...options, credentials: "include" });

  if (res.status === 401) {
    try {
      // Catch expired access token and run background rotation
      const refreshRes = await fetch("/api/admin/auth/refresh", { method: "POST" });
      if (refreshRes.ok) {
        // Retry original call with fresh credentials cookie
        return fetch(url, { ...options, credentials: "include" });
      } else {
        if (typeof window !== "undefined") {
          window.location.href = "/admin/login";
        }
        throw new Error("Session expired");
      }
    } catch (err) {
      if (typeof window !== "undefined") {
        window.location.href = "/admin/login";
      }
      throw new Error("Session expired");
    }
  }

  return res;
}
