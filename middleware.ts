import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;

  console.log("🧁 Middleware cookies:", { token: token ? "present" : "missing", role, path: req.nextUrl.pathname });

  const url = req.nextUrl.pathname;

  // Allow access to auth pages and API routes
  if (url.startsWith("/auth") || url.startsWith("/api") || url === "/") {
    return NextResponse.next();
  }

  // Require authentication for protected routes
  if (!token) {
    console.log("❌ No token, redirecting to login");
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Role-based access control
  if (url.startsWith("/admin") && role !== "admin") {
    console.log("❌ Admin access denied for role:", role);
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (url.startsWith("/terapis") && role !== "terapis") {
    console.log("❌ Terapis access denied for role:", role);
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (url.startsWith("/orangtua") && role !== "orangtua") {
    console.log("❌ Orangtua access denied for role:", role);
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/terapis/:path*", "/orangtua/:path*"],
};
