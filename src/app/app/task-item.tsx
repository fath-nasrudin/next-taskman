'use client';

import { updateTaskUserAction } from '@/actions/task';
import { Checkbox } from '@/components/ui/checkbox';
import type { getTasksByProjectId } from '@/lib/api';
import { TaskFormValues } from '@/lib/schemas';
import { createSlug } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HashIcon } from 'lucide-react';
import Link from 'next/link';
import { DeleteTask } from './task-delete';
import { EditTask } from './task-edit';

export type Props = {
  task: NonNullable<Awaited<ReturnType<typeof getTasksByProjectId>>>[number];
  showProject?: boolean;
};

export function TaskItem({ task, showProject = false }: Props) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ['updateCheckTask'],
    mutationFn: async ({
      taskFormValues,
      taskId,
    }: {
      taskFormValues: Partial<TaskFormValues>;
      taskId: string;
    }): Promise<Awaited<ReturnType<typeof updateTaskUserAction>>> => {
      const updatedTask = await updateTaskUserAction(taskFormValues, taskId);
      return updatedTask;
    },
    onMutate: async ({ taskFormValues, taskId }) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)

      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      const previousTasks = queryClient.getQueryData(['tasks']);

      queryClient.setQueriesData(
        { queryKey: ['tasks'] },
        (old: NonNullable<Awaited<ReturnType<typeof getTasksByProjectId>>>) => {
          return old.map((task) => {
            if (task.id === taskId) {
              return { ...task, ...taskFormValues };
            }
            return task;
          });
        }
      );

      return { previousTasks };
    },

    onError: (err, data, context) => {
      queryClient.setQueryData(['tasks'], context?.previousTasks);
    },
  });

  return (
    <div className="border-b-[1px] p-0.5 flex gap-2 items-start">
      <Checkbox
        className="mt-[7px]"
        checked={!!task.isDone}
        onClick={() => {
          mutate({ taskFormValues: { isDone: !task.isDone }, taskId: task.id });
        }}
      />
      <div className="flex-1">
        <div className="flex">
          <div className={`flex-1 ${task.isDone && 'line-through'}`}>
            {task.name}
          </div>
          {/* actions */}
          <div>
            <EditTask taskData={task} taskId={task.id} />
            <DeleteTask taskId={task.id} />
          </div>
        </div>

        {/* footer */}
        <div className="flex">
          {showProject && (
            <Link
              className="ml-auto flex items-center gap-1 text-foreground/80"
              href={`/app/project/${createSlug(task.project)}`}
            >
              <span>{task.project.name}</span>
              <HashIcon strokeWidth={1} size={14} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
