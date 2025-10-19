import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;
  const { pathname } = request.nextUrl;

  const isProtected =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/terapis") ||
    pathname.startsWith("/orangtua");

  // 🔒 Belum login tapi coba akses halaman proteksi
  if (isProtected && !token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname); // supaya setelah login bisa kembali ke halaman semula
    return NextResponse.redirect(loginUrl);
  }

  // ✅ Sudah login tapi masih di halaman /auth/login → redirect sesuai role
  if (token && pathname.startsWith("/auth/login")) {
    if (role === "admin")
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    if (role === "terapis")
      return NextResponse.redirect(
        new URL("/terapis/observasi", request.url)
      );
    if (role === "orangtua")
      return NextResponse.redirect(
        new URL("/orangtua/dashboard", request.url)
      );
  }

  return NextResponse.next();
}

// Pastikan semua route dilindungi
export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/terapis",
    "/terapis/:path*",
    "/orangtua",
    "/orangtua/:path*",
    "/auth/login",
  ],
};
