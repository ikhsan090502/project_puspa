import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;
  const path = request.nextUrl.pathname;

  const isLoginPage = path.startsWith("/auth/login");
  const isProtectedAdmin = path.startsWith("/admin");
  const isProtectedTerapis = path.startsWith("/terapis");
  const isProtectedOrangtua = path.startsWith("/orangtua");

  // 1️⃣ Belum login → redirect ke /auth/login
  if (!token && (isProtectedAdmin || isProtectedTerapis || isProtectedOrangtua)) {
    const redirectUrl = new URL("/auth/login", request.url);
    redirectUrl.searchParams.set("next", path);
    console.log("🔒 Belum login, redirect ke:", redirectUrl.toString());
    return NextResponse.redirect(redirectUrl);
  }

  // 2️⃣ Sudah login tapi buka /auth/login → arahkan ke dashboard role
  if (token && isLoginPage) {
    let dashboard = "/";
    switch (role) {
      case "admin":
        dashboard = "/admin/dashboard";
        break;
      case "terapis":
        dashboard = "/terapis/dashboard";
        break;
      case "orangtua":
      case "user":
        dashboard = "/orangtua/dashboard";
        break;
    }
    console.log("✅ Sudah login, redirect ke:", dashboard);
    return NextResponse.redirect(new URL(dashboard, request.url));
  }

  // 3️⃣ Kalau token valid → lanjut tanpa redirect
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
