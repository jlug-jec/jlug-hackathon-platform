import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const isAuth = !!req.nextauth.token;
    const isLoginPage = req.nextUrl.pathname.startsWith('/login');
    const isRegisterPage = req.nextUrl.pathname.startsWith('/register');
    const isProblemPage= req.nextUrl.pathname.startsWith('/problems');
    const isHackathonPage= req.nextUrl.pathname.startsWith('/hackathon');
    const isApiAuthRoute = req.nextUrl.pathname.startsWith('/api/auth');


    // Allow authentication API endpoints
    if (isApiAuthRoute) {
      return NextResponse.next();
    }
    if( isLoginPage || isRegisterPage || isProblemPage || isHackathonPage){
      return NextResponse.redirect(new URL('/', req.url))
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
    '/problems',
    '/hackathon',
    '/api/:path*'
  ]
};