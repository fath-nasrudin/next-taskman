import Google from 'next-auth/providers/google';
import type { NextAuthConfig } from 'next-auth';
import { Provider } from 'next-auth/providers';
import { env } from '../env';

const providers: Provider[] = [Google];

export const providerMap: { id: string; name: string }[] = providers
  .map((provider) => {
    if (typeof provider === 'function') {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  })
  .filter((provider) => provider.id !== 'credentials');

export default {
  providers,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        const response = await fetch(
          `${env.NEXT_PUBLIC_BASE_URL}/api/user/${user.id!}/defaultprojectid`
        );
        const defaultProjectId = await response.json();
        token.id = user.id;
        token.defaultProjectId = defaultProjectId;
      }

      return token;
    },
    session: async ({ session, token }) => {
      session.user.id = token.id as string;
      session.user.defaultProjectId = token.defaultProjectId;
      return session;
    },
  },
} satisfies NextAuthConfig;
