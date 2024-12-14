'use client';
import { getTasksByProjectId } from '@/lib/api';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Loader2Icon } from 'lucide-react';
import { TaskItem } from './task-item';

export type Props = {
  projectId: string;
};

export default function Tasklist({ projectId }: Props) {
  const {
    data: tasks,
    isLoading,
    isError,
  } = useSuspenseQuery<Awaited<ReturnType<typeof getTasksByProjectId>>>({
    queryKey: ['tasks', projectId],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:3000/api/tasks?projectid=${projectId}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      return data;
    },
    staleTime: 1000 * 60 * 5, // Cache duration: 5 minutes
  });

  if (isLoading) {
    return <Loader2Icon className="w-8 h-8 animate-spin" />;
  }

  if (isError || !tasks) {
    return (
      <p>Tasks with the given project ID not found or an error occurred.</p>
    );
  }

  return (
    <div className="mt-8">
      {tasks.map((t) => (
        <TaskItem key={t.id} task={t} />
      ))}
    </div>
  );
}
