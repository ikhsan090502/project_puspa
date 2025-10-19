import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // Jika belum login dan mencoba akses halaman admin/terapis/orangtua
  if (
    !token &&
    (pathname.startsWith('/admin') ||
     pathname.startsWith('/terapis') ||
     pathname.startsWith('/orangtua'))
  ) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Jika sudah login dan mencoba buka /auth/login, arahkan ke dashboard
  if (token && pathname.startsWith('/auth/login')) {
    // Misalnya token disimpan di payload JWT (role)
    const role = request.cookies.get('role')?.value || ''
    if (role === 'admin') return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    if (role === 'terapis') return NextResponse.redirect(new URL('/terapis/dashboard', request.url))
    if (role === 'orangtua') return NextResponse.redirect(new URL('/orangtua/dashboard', request.url))
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