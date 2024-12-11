import Google from 'next-auth/providers/google';
import type { NextAuthConfig } from 'next-auth';

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [Google],
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user.id = token.id as string;
      return session;
    },
  },
} satisfies NextAuthConfig;
