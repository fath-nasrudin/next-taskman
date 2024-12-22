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

const extractNameFromSlug = (slug: string) => {
  const splittedSlug = slug.split('-');
  splittedSlug.pop();
  return splittedSlug.join(' ');
};

export async function generateMetadata({ params }: Props) {
  const slug: string = (await params).slug;

  return {
    title: extractNameFromSlug(slug),
    description: 'Your tasks based on project',
  };
}

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
