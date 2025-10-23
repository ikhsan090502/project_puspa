import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;

  console.log("🧁 Middleware cookies:", { token, role, path: req.nextUrl.pathname });

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  const url = req.nextUrl.pathname;

  // Admin
  if (url.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Terapis
  if (url.startsWith("/terapis") && role !== "terapis") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Orangtua
  if (url.startsWith("/orangtua") && role !== "orangtua") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/terapis/:path*", "/orangtua/:path*"],
};
