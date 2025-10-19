import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const role = request.cookies.get('role')?.value
  const { pathname } = request.nextUrl

  // Helper function to create response that clears invalid cookies
  const clearCookiesAndRedirect = (redirectUrl: string) => {
    const response = NextResponse.redirect(new URL(redirectUrl, request.url))

    // Clear invalid cookies
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    })

    response.cookies.set('role', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    })

    return response
  }

  // Helper function to validate token
  const isValidToken = (token: string): boolean => {
    try {
      jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
      return true
    } catch (error) {
      return false
    }
  }

  // Protected paths that require authentication
  const protectedPaths = ['/admin', '/terapis', '/orangtua']
  const isProtected = protectedPaths.some(path => pathname.startsWith(path))

  // If accessing protected route without token, redirect to login
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // If token exists but is invalid, clear cookies and redirect to login
  if (token && !isValidToken(token)) {
    return clearCookiesAndRedirect('/auth/login')
  }

  // If accessing /admin (root) while logged in, redirect to /admin/dashboard
  if (token && pathname === '/admin' && role) {
    const dashboardUrl = `/${role}/dashboard`
    return NextResponse.redirect(new URL(dashboardUrl, request.url))
  }

  // If accessing /auth/login while already logged in, redirect to appropriate dashboard
  if (token && pathname.startsWith('/auth/login') && role) {
    const dashboardUrl = `/${role}/dashboard`
    return NextResponse.redirect(new URL(dashboardUrl, request.url))
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
