import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const role = request.cookies.get('role')?.value
  const { pathname } = request.nextUrl

  const protectedRoutes = ['/admin', '/terapis', '/orangtua']
  const isProtected = protectedRoutes.some((path) =>
    pathname === path || pathname.startsWith(`${path}/`)
  )

  // 🚫 Belum login tapi masuk halaman proteksi
  if (isProtected && !token) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // ✅ Sudah login tapi masih di /auth/login
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
    '/admin',
    '/admin/:path*',
    '/terapis',
    '/terapis/:path*',
    '/orangtua',
    '/orangtua/:path*',
    '/auth/login',
  ],
}
