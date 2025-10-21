import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;
  const { pathname } = request.nextUrl;

  // 🔒 Halaman yang dilindungi
  const protectedPaths = ["/admin", "/terapis", "/orangtua"];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  // 🚫 Belum login tapi coba akses halaman dilindungi
  if (isProtected && !token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    console.log("🔒 Redirect ke login:", loginUrl.toString());
    return NextResponse.redirect(loginUrl);
  }

  // ✅ Sudah login tapi buka halaman login lagi
  if (pathname.startsWith("/auth/login") && token) {
    console.log("✅ Sudah login, redirect ke dashboard:", role);

    if (role === "admin")
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    if (role === "terapis")
      return NextResponse.redirect(new URL("/terapis/dashboard", request.url));
    if (role === "orangtua")
      return NextResponse.redirect(new URL("/orangtua/dashboard", request.url));
  }

  // ✅ Jika tidak ada kondisi di atas, lanjutkan request
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
