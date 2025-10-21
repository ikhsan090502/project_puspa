import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  console.log("🧩 Middleware check — path:", pathname, "| token:", token ? "✅ ADA" : "❌ TIDAK ADA");

  const protectedPaths = ["/admin", "/terapis", "/orangtua"];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !token) {
    console.log("🔒 Belum login, redirect ke /auth/login");
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/terapis/:path*", "/orangtua/:path*"],
};
