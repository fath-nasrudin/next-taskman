import NextAuth from 'next-auth';
import authConfig from '@/lib/auth/auth.config';

const { auth } = NextAuth(authConfig);
export const middleware = auth;

export const config = {
  matcher: ['/protected'],
};
