// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;
  const url = req.nextUrl.pathname;

  // Jika tidak ada token → arahkan ke login umum
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // 🔹 Proteksi untuk ADMIN
  if (url.startsWith("/admin")) {
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  // 🔹 Proteksi untuk TERAPIS
  if (url.startsWith("/terapis")) {
    if (role !== "terapis") {
      return NextResponse.redirect(new URL("/auth/login_terapis", req.url));
    }
  }

  // 🔹 Proteksi untuk ORANGTUA
  if (url.startsWith("/orangtua")) {
    if (role !== "orangtua") {
      return NextResponse.redirect(new URL("/auth/login_orangtua", req.url));
    }
  }

  // Jika semua lolos
  return NextResponse.next();
}

// Jalankan middleware di semua area yang butuh login
export const config = {
  matcher: [
    "/admin/:path*",
    "/terapis/:path*",
    "/orangtua/:path*",
  ],
};
