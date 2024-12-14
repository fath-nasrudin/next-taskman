'use client';

import { updateTaskUserAction } from '@/actions/task';
import { Checkbox } from '@/components/ui/checkbox';
import type { getTasksByProjectId } from '@/lib/api';
import { TaskFormValues } from '@/lib/schemas';
import { createSlug } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HashIcon } from 'lucide-react';
import Link from 'next/link';

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
    }) => {
      const updatedTask = await updateTaskUserAction(taskFormValues, taskId);
      return { updatedTask };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
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
        <div className={`${task.isDone && 'line-through'}`}>{task.name}</div>

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