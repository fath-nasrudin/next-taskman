import { auth, signIn, signOut } from '@/lib/auth';
import Link from 'next/link';
import PageClient from './page.client';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import ProjectList from '../project-list';

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

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
      <Suspense fallback={<p>Loading...</p>}>
        <ProjectList />
      </Suspense>
    </div>
  );
}
