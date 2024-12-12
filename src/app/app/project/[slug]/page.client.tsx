'use client';
import { TaskForm } from '@/components/task-form';
import Tasklist from '../../task-list';
import { createTaskAction } from '@/actions/task';
import { Suspense } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export function PageClient({ projectId }: { projectId: string }) {
  const queryClient = useQueryClient();
  return (
    <>
      <TaskForm
        projectId={projectId}
        onSubmit={async (taskFormValues) => {
          await createTaskAction(taskFormValues);

          queryClient.invalidateQueries({
            queryKey: ['tasks', projectId],
          });
        }}
      />
      <Suspense fallback={<p>Loading...</p>}>
        <Tasklist projectId={projectId} />
      </Suspense>
    </>
  );
}
