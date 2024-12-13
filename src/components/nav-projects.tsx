import { auth } from '@/lib/auth';
import { NavProjectsClient } from './nav-projects.client';
import { redirect } from 'next/navigation';
import { getQueryClient } from '@/lib/query-client';
import { getProjectsByUserId } from '@/lib/api';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export async function NavProjects() {
  const session = await auth();
  if (!session) redirect('/login');

  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return getProjectsByUserId(session.user.id);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NavProjectsClient />
    </HydrationBoundary>
  );
}
