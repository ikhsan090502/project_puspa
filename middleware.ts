import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;
  const { pathname } = request.nextUrl;

  console.log("🧠 Middleware check:", { pathname, tokenExists: !!token, role });

  const protectedPaths = ["/admin", "/terapis", "/orangtua"];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  // Jika belum login → redirect ke login
  if (isProtected && !token) {
    console.log("🚫 Tidak ada token, redirect login");
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Jika sudah login tapi buka /auth/login → arahkan sesuai role
  if (pathname.startsWith("/auth/login") && token) {
    let redirectUrl = "/";
    if (role === "admin") redirectUrl = "/admin/dashboard";
    else if (role === "terapis") redirectUrl = "/terapis/dashboard";
    else if (role === "orangtua") redirectUrl = "/orangtua/dashboard";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
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
