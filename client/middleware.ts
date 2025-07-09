import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isTwitterRoute = req.nextUrl.pathname.startsWith('/twitter');
    const isLoginOrRoot = req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/';

    // If user is authenticated and visits / or /login, redirect to /twitter
    if (isLoginOrRoot && token) {
      return NextResponse.redirect(new URL('/twitter', req.url));
    }

    // For Twitter routes, just check if user is logged in
    // The actual Twitter token check happens in the API calls
    if (isTwitterRoute && !token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/', '/login', '/dashboard/:path*', '/twitter/:path*'],
};