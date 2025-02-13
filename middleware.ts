import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const isAuth = !!req.nextauth.token;
    const isLoginPage = req.nextUrl.pathname.startsWith('/login');
    const isApiAuthRoute = req.nextUrl.pathname.startsWith('/api/auth');

    // Allow authentication API endpoints
    if (isApiAuthRoute) {
      return NextResponse.next();
    }

    // Redirect authenticated users away from auth pages
    if (isAuth && (isLoginPage || req.nextUrl.pathname.startsWith('/register'))) {
      return NextResponse.redirect(new URL('/hackathon', req.url));
    }

    // Redirect unauthenticated users to login, including register page
    if (!isAuth) {
      if (!isLoginPage) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => true,
    },
  }
);

export const config = {
  matcher: [
    '/login',
    '/register',
    '/hackathon',
    '/api/:path*'
  ]
};