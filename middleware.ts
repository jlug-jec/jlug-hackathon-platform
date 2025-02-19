import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const isAuth = !!req.nextauth.token;
    const isLoginPage = req.nextUrl.pathname.startsWith('/login');
    const isRegisterPage = req.nextUrl.pathname.startsWith('/register');
    const isApiAuthRoute = req.nextUrl.pathname.startsWith('/api/auth');

    console.log('--- Middleware Debug Logs ---');
    console.log('Current Path:', req.nextUrl.pathname);
    console.log('Is Authenticated:', isAuth);
    console.log('Token:', req.nextauth.token);
    console.log('Is Login Page:', isLoginPage);

    console.log('Is API Auth Route:', isApiAuthRoute);

    // Allow authentication API endpoints
    if (isApiAuthRoute) {
      return NextResponse.next();
    }

    // Redirect authenticated users from login or register to hackathon page
    if (isAuth && (isLoginPage || isRegisterPage)) {
      return NextResponse.redirect(new URL('/hackathon', req.url));
    }

    // Redirect unauthenticated users to login
    if (!isAuth && !isLoginPage) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/login',
    '/register',
    '/api/:path*'
  ]
};