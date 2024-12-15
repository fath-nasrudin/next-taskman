'use client';
import { TaskForm } from '@/components/task-form';
import { createTaskAction } from '@/actions/task';
import { Suspense } from 'react';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { TaskFormValues } from '@/lib/schemas';
import type { getProject } from '@/lib/api';
import { env } from '@/lib/env';
import Tasklist from '../task-list';

export function InboxPageClient({ projectId }: { projectId: string }) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationKey: ['addTask'],
    mutationFn: (taskFormValues: TaskFormValues) => {
      return createTaskAction(taskFormValues);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tasks', projectId],
      });
    },
  });

  const { data } = useSuspenseQuery<
    NonNullable<Awaited<ReturnType<typeof getProject>>>
  >({
    queryKey: ['projects', projectId],
    queryFn: async () => {
      const response = await fetch(
        `${env.NEXT_PUBLIC_BASE_URL}/api/projects/${projectId}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="w-full max-w-screen-lg mx-auto">
      <h2 className="text-3xl font-bold ">
        {data?.name ? data.name : 'Loading...'}
      </h2>
      <TaskForm
        projectId={projectId}
        onSubmit={async (taskFormValues) => {
          mutate(taskFormValues);
        }}
      />
      <Suspense fallback={<p>Loading...</p>}>
        <Tasklist projectId={projectId} />
      </Suspense>
    </div>
  );
}
