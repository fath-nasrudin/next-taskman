import React from 'react';
import { PageClient } from './page.client';
import { getQueryClient } from '@/lib/query-client';
import { getProject, getTasksByProjectId } from '@/lib/api';
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
      <PageClient projectId={projectId} />
    </HydrationBoundary>
  );
}
