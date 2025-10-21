import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;
  const { pathname } = request.nextUrl;

  const protectedPaths = ["/admin", "/terapis", "/orangtua"];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  // 🔒 Belum login tapi mau akses halaman dilindungi
  if (isProtected && !token) {
    console.log("🔒 Belum login, redirect ke /auth/login");
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ✅ Kalau sudah login, jangan redirect apa pun di middleware
  // biar tidak balik ke /auth/login lagi
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/terapis/:path*",
    "/orangtua/:path*",
  ],
};
