import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  console.log("🧩 Middleware aktif:", pathname, "Token:", !!token);

  // Daftar halaman yang butuh login
  const protectedPaths = ["/admin", "/terapis", "/orangtua"];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  // Jika halaman butuh login tapi tidak ada token → redirect
  if (isProtected && !token) {
    console.log("🚫 Tidak ada token. Redirect ke login.");
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Jika sudah login dan mengakses /auth/login → redirect ke dashboard
  if (pathname.startsWith("/auth/login") && token) {
    const role = request.cookies.get("role")?.value;
    console.log("✅ Sudah login, redirect sesuai role:", role);

    let redirectPath = "/";
    if (role === "admin") redirectPath = "/admin/dashboard";
    else if (role === "terapis") redirectPath = "/terapis/dashboard";
    else if (role === "orangtua") redirectPath = "/orangtua/dashboard";

    return NextResponse.redirect(new URL(redirectPath, request.url));
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
