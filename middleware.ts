import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;

  // Jika tidak ada token, arahkan ke login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Jika role bukan admin tapi ke /admin
  if (req.nextUrl.pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"], // hanya jalankan di halaman admin
};
