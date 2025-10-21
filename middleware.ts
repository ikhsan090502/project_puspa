import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Halaman yang dilindungi
  const protectedPaths = ["/admin", "/terapis", "/orangtua"];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  // 🔒 Belum login
  if (isProtected && !token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", pathname); // Simpan tujuan semula
    console.log("🔒 Redirect ke login:", loginUrl.toString());
    return NextResponse.redirect(loginUrl);
  }

  // 🚫 Sudah login tapi di halaman login — middleware tidak usah redirect di sini
  // Biarkan client-side handle redirect agar tidak looping
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
