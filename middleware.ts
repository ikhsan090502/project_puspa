import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const protectedRoutes = ["/admin", "/terapis", "/orangtua"];

  // Jika tidak ada token dan mencoba masuk ke route yang dilindungi
  if (protectedRoutes.some((p) => pathname.startsWith(p)) && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/terapis/:path*", "/orangtua/:path*"],
};
