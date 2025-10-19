// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const role = request.cookies.get('role')?.value
  const { pathname } = request.nextUrl

  const protectedRoutes = ['/admin', '/terapis', '/orangtua']

  // Cek jika akses halaman yang butuh login
  const isProtected = protectedRoutes.some(path => pathname.startsWith(path))

  // Kalau belum login dan masuk ke halaman proteksi
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Kalau sudah login tapi masih di /auth/login, redirect sesuai role
  if (token && pathname.startsWith('/auth/login')) {
    if (role === 'admin')
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    if (role === 'terapis')
      return NextResponse.redirect(new URL('/terapis/dashboard', request.url))
    if (role === 'orangtua')
      return NextResponse.redirect(new URL('/orangtua/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/terapis/:path*',
    '/orangtua/:path*',
    '/auth/login',
  ],
}
