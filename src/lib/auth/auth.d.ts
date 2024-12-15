// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth, { type DefaultSession } from 'next-auth';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT, DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id?: string;
    defaultProjectId: string;
  }
}

declare module 'next-auth' {
  interface User {
    defaultProjectId?: string;
  }

  interface Session {
    user: {
      id: string;
      defaultProjectId: string;
    } & DefaultSession['user'];
  }
}
