import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const token = request.cookies.get('token')?.value || ''

  // Define public paths
  const isPublicPath = ['/login', '/signup', '/verifyemail'].includes(path)

  if (path === '/') {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  // Handle public paths
  if (isPublicPath) {
    if (token) {
      // Logged-in users shouldn't access public paths
      return NextResponse.redirect(new URL('/profile', request.url))
    }
    // Allow access to public paths for non-logged-in users
    return NextResponse.next()
  }

  // Handle protected paths
  if (!isPublicPath) {
    if (!token) {
      // Redirect non-logged-in users to login
      return NextResponse.redirect(new URL('/login', request.url))
    }
    // Allow access to protected paths for logged-in users
    return NextResponse.next()
  }

  // Fallback for unhandled cases
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/profile',
    '/verifyemail'
  ]
}