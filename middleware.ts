import { auth } from "@/lib/auth";
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAppRoute = req.nextUrl.pathname
    .startsWith('/app');
  const isAuthRoute =
    req.nextUrl.pathname.startsWith('/login') ||
    req.nextUrl.pathname.startsWith('/signup');

  if (isAppRoute && !isLoggedIn) {
    return NextResponse.redirect(
      new URL('/login', req.nextUrl)
    );
  }
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(
      new URL('/', req.nextUrl)
    );
  }
  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};