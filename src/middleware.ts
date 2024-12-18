import NextAuth from 'next-auth';
import authConfig from '@/lib/auth/auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isAuth = req.auth;
  const isAuthPage =
    req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register';
  if (!isAuth && !isAuthPage) {
    const newUrl = new URL('/login', req.nextUrl.origin);
    return NextResponse.redirect(newUrl);
  }

  if (isAuth && isAuthPage) {
    return NextResponse.redirect(new URL('/app', req.nextUrl.origin));
  }
});

export const config = {
  matcher: ['/app', '/protected', '/login', '/register'],
};
