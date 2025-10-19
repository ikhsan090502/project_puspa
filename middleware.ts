import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const role = request.cookies.get('role')?.value
  const { pathname } = request.nextUrl

  // Halaman yang butuh login
  const protectedPaths = ['/admin', '/terapis', '/orangtua']

  const isProtected = protectedPaths.some(path => pathname.startsWith(path))

  // Jika akses halaman proteksi tapi belum login
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Jika sudah login, jangan bisa ke /auth/login lagi
  if (token && pathname.startsWith('/auth/login')) {
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
    '/auth/login'
  ]
}