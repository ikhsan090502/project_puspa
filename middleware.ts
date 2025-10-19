// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;
  const { pathname } = request.nextUrl;

  // Semua halaman yang butuh login
  const protectedRoutes = ["/admin", "/terapis", "/orangtua", "/owner"];
  const authRoute = "/auth/login";

  // 1️⃣ Kalau belum login dan mau masuk halaman proteksi
  if (protectedRoutes.some((path) => pathname.startsWith(path)) && !token) {
    const url = new URL(authRoute, request.url);
    console.log("🔒 Belum login, redirect ke:", url.toString());
    return NextResponse.redirect(url);
  }

  // 2️⃣ Kalau SUDAH login tapi masih di halaman login → arahkan ke dashboard role-nya
  if (token && pathname.startsWith(authRoute)) {
    let redirectURL = null;

    switch (role) {
      case "admin":
        redirectURL = "/admin/dashboard";
        break;
      case "terapis":
        redirectURL = "/terapis/dashboard";
        break;
      case "orangtua":
        redirectURL = "/orangtua/dashboard";
        break;
      case "owner":
        redirectURL = "/owner/dashboard";
        break;
      default:
        redirectURL = "/";
    }

    const url = new URL(redirectURL, request.url);
    console.log("✅ Sudah login, langsung redirect ke:", url.toString());
    return NextResponse.redirect(url);
  }

  // 3️⃣ Kalau role login tapi coba akses route yang bukan miliknya → redirect sesuai role
  if (token && role) {
    const rolePaths: Record<string, string> = {
      admin: "/admin",
      terapis: "/terapis",
      orangtua: "/orangtua",
      owner: "/owner",
    };

    const expectedPath = rolePaths[role];
    if (expectedPath && !pathname.startsWith(expectedPath)) {
      console.log("🚫 Role tidak sesuai route, redirect:", expectedPath);
      return NextResponse.redirect(new URL(expectedPath, request.url));
    }
  }

  // 4️⃣ Kalau semua oke, lanjut ke halaman
  return NextResponse.next();
}

// Middleware aktif hanya di route tertentu
export const config = {
  matcher: [
    "/admin/:path*",
    "/terapis/:path*",
    "/orangtua/:path*",
    "/owner/:path*",
    "/auth/login",
  ],
};
