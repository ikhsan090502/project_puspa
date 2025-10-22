import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;
  const { pathname } = request.nextUrl;

  console.log("🧩 Middleware check:", { pathname, hasToken: !!token, role });

  const protectedPaths = ["/admin", "/terapis", "/orangtua"];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  // Redirect kalau belum login
  if (isProtected && !token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Kalau sudah login dan ke /auth/login, lempar ke dashboard
  if (pathname.startsWith("/auth/login") && token) {
    const dashboard =
      role === "admin"
        ? "/admin/dashboard"
        : role === "terapis"
        ? "/terapis/dashboard"
        : role === "orangtua"
        ? "/orangtua/dashboard"
        : "/";
    return NextResponse.redirect(new URL(dashboard, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/terapis/:path*", "/orangtua/:path*", "/auth/login"],
};
