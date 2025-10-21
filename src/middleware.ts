import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;
  const { pathname } = request.nextUrl;

  console.log("🧩 Middleware check:", {
    pathname,
    token: token ? "✅ found" : "❌ missing",
    role,
  });

  const protectedPaths = ["/admin", "/terapis", "/orangtua"];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  // 🔒 Belum login — redirect ke login
  if (isProtected && !token) {
    console.log("🔒 Belum login, redirect ke /auth/login");
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 🚫 Sudah login tapi mencoba ke halaman login lagi
  if (token && pathname.startsWith("/auth/login")) {
    console.log("✅ Sudah login, redirect sesuai role:", role);
    if (role === "admin")
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    if (role === "terapis")
      return NextResponse.redirect(new URL("/terapis/dashboard", request.url));
    if (role === "orangtua")
      return NextResponse.redirect(new URL("/orangtua/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/terapis/:path*",
    "/orangtua/:path*",
    "/auth/login",
  ],
};