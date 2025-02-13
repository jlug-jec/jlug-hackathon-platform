import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const isAuth = !!req.nextauth.token;
    const isLoginPage = req.nextUrl.pathname.startsWith('/login');
    const isApiAuthRoute = req.nextUrl.pathname.startsWith('/api/auth');

    console.log('--- Middleware Debug Logs ---');
    console.log('Current Path:', req.nextUrl.pathname);
    console.log('Is Authenticated:', isAuth);
    console.log('Token:', req.nextauth.token);
    console.log('Is Login Page:', isLoginPage);

    console.log('Is API Auth Route:', isApiAuthRoute);

    // Allow authentication API endpoints
    if (isApiAuthRoute) {
      console.log('→ Allowing API auth route');
      return NextResponse.next();
    }

    // Redirect authenticated users to hackathon page
    if (isAuth && (isLoginPage)) {
      console.log('→ Authenticated user trying to access auth pages, redirecting to hackathon');
      return NextResponse.redirect(new URL('/hackathon', req.url));
    }

    // Redirect unauthenticated users to login
    if (!isAuth && !isLoginPage) {
      console.log('→ Unauthenticated user, redirecting to login');
      return NextResponse.redirect(new URL('/login', req.url));
    }

    console.log('→ Allowing request to proceed');
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        console.log('Auth Callback - Token:', token);
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/login',
    '/api/:path*'
  ]
};