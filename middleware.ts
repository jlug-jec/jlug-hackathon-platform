import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const isAuth = !!req.nextauth.token;
    const isLoginPage = req.nextUrl.pathname.startsWith('/login');
    const isRegisterPage = req.nextUrl.pathname.startsWith('/register');
    const isApiAuthRoute = req.nextUrl.pathname.startsWith('/api/auth');

    // Allow authentication API endpoints
    if (isApiAuthRoute) {
      return NextResponse.next();
    }

    // Redirect authenticated users from login to register
    if (isAuth && isLoginPage) {
      return NextResponse.redirect(new URL('/register', req.url));
    }

    // Allow authenticated users to access register page
    if (isAuth && isRegisterPage) {
      return NextResponse.next();
    }

    // Redirect unauthenticated users to login
    if (!isAuth && !isLoginPage) {
      return NextResponse.redirect(new URL('/login', req.url));
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