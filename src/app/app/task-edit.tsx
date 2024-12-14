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
import type { getTask } from '@/lib/api';
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
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
