import { auth } from '@/lib/auth';
import PageClient from './page.client';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import ProjectList from './project-list';

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="w-full max-w-screen-lg mx-auto">
      <PageClient />
      <Suspense fallback={<p>Loading...</p>}>
        <ProjectList />
      </Suspense>
    </div>
  );
}
