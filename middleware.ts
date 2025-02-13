import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // If user is authenticated and tries to access login/register, redirect to hackathon
    if (req.nextauth.token && (req.nextUrl.pathname.startsWith('/login'))) {
      return NextResponse.redirect(new URL('/hackathon', req.url));
    }

    // Allow authentication endpoints
    if (req.nextUrl.pathname.startsWith('/api/auth')) {
      return NextResponse.next();
    }

    // Protect API routes and register page
    if (req.nextUrl.pathname.startsWith('/api') || req.nextUrl.pathname.startsWith('/register') || req.nextUrl.pathname.startsWith('/login')) {
      if (!req.nextauth.token) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
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
  matcher: ['/api/:path*', '/register/:path*', '/login/:path*', '/hackathon/:path*']
};