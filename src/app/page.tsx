import { auth, signIn, signOut } from '@/lib/auth';
import Link from 'next/link';
import PageClient from './page.client';

export default async function Home() {
  const session = await auth();
  return (
    <div>
      <div>{session?.user?.name}</div>
      <form
        action={async () => {
          'use server';
          await signIn('google');
        }}
      >
        <button type="submit">Signin with Google</button>
      </form>

      <form
        action={async () => {
          'use server';
          await signOut();
        }}
      >
        <button type="submit">Signout</button>
      </form>
      <Link href="/protected">Go To Protected Route</Link>

      <PageClient />
    </div>
  );
}
