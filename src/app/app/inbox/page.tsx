import React from 'react';
import { InboxPageClient } from './page.client';
import { getQueryClient } from '@/lib/query-client';
import { getProject, getTasksByProjectId } from '@/lib/api';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inbox',
  description: 'Your default inbox project',
};

export default async function InboxPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const projectId: string = session?.user.defaultProjectId;
  const queryClient = getQueryClient();

  // prefetch the data
  queryClient.prefetchQuery({
    queryKey: ['tasks', projectId],
    queryFn: async () => {
      return getTasksByProjectId(projectId);
    },
  });

  // prefetch the data
  queryClient.prefetchQuery({
    queryKey: ['projects', projectId],
    queryFn: async () => {
      return getProject(projectId);
    },
    staleTime: 10 * 60 * 1000,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <InboxPageClient projectId={projectId} />
    </HydrationBoundary>
  );
}
