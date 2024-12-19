'use client';
import { updateTaskUserAction } from '@/actions/task';
import { TaskForm } from '@/components/task-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { getTask, getTasksByProjectId } from '@/lib/api';
import { TaskFormValues } from '@/lib/schemas';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit2Icon } from 'lucide-react';
import { useState } from 'react';

export const EditTask = ({
  taskId,
  taskData,
}: {
  taskId: string;
  taskData: NonNullable<Awaited<ReturnType<typeof getTask>>>;
}) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ['updateTask'],
    mutationFn: async ({
      taskFormValues,
      taskId,
    }: {
      taskFormValues: TaskFormValues;
      taskId: string;
    }) => {
      await updateTaskUserAction(taskFormValues, taskId);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit2Icon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription className="invisible">
            Edit the task
          </DialogDescription>
        </DialogHeader>
        <TaskForm
          task={taskData}
          onSubmit={async (taskFormValues) => {
            mutate({ taskFormValues, taskId });
            setOpen(false);
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
