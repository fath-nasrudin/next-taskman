import React from 'react';
import Link from 'next/link';
import { PageClient } from './page.client';
import { getQueryClient } from '@/lib/query-client';
import { getTasksByProjectId } from '@/lib/api';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const extractIdFromSlug = (slug: string): string => {
  return slug.split('-').pop() || '';
};

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const projectId: string = extractIdFromSlug(slug);
  const queryClient = getQueryClient();

  // prefetch the data
  queryClient.prefetchQuery({
    queryKey: ['tasks', projectId],
    queryFn: async () => {
      return getTasksByProjectId(projectId);
    },
  });

  return (
    <div>
      <p>Project: {slug}</p>
      <p>Id: {projectId}</p>
      <Link href="/app">Back home</Link>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PageClient projectId={projectId} />
      </HydrationBoundary>
    </div>
  );
}
