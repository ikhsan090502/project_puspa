import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // 🔒 Path yang butuh login
  const protectedPaths = ["/admin", "/terapis", "/orangtua"];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  console.log("🧩 Middleware check:", pathname, "| Token:", token ? "✅ ADA" : "❌ KOSONG");

  // Redirect ke login kalau akses halaman protected tanpa token
  if (isProtected && !token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ✅ Jangan cache hasil middleware (biar token baru langsung dibaca)
  const res = NextResponse.next();
  res.headers.set("Cache-Control", "no-store, must-revalidate");
  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/terapis/:path*", "/orangtua/:path*"],
};
