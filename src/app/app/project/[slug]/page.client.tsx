'use client';
import { TaskForm } from '@/components/task-form';
import Tasklist from '../../task-list';
import { createTaskAction } from '@/actions/task';
import { Suspense } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TaskFormValues } from '@/lib/schemas';

export function PageClient({ projectId }: { projectId: string }) {
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
  return (
    <div className="w-full max-w-screen-lg mx-auto">
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
