'use client';
import { deleteTaskUserAction } from '@/actions/task';
import { AsyncButton } from '@/components/async-button';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { getTasksByProjectId } from '@/lib/api';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2Icon } from 'lucide-react';
import { useState } from 'react';

export const DeleteTask = ({ taskId }: { taskId: string }) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ['deleteTask'],
    mutationFn: async (taskId: string) => {
      await deleteTaskUserAction(taskId);
    },
    onMutate: async (taskId: string) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)

      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      const previousTasks = queryClient.getQueryData(['tasks']);

      queryClient.setQueriesData(
        { queryKey: ['tasks'] },
        (old: NonNullable<Awaited<ReturnType<typeof getTasksByProjectId>>>) => {
          return old.filter((task) => task.id !== taskId);
        }
      );

      return { previousTasks };
    },

    onError: (err, data, context) => {
      queryClient.setQueryData(['tasks'], context?.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash2Icon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Task</DialogTitle>
          <DialogDescription>
            Are you sure want to delete this task?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row gap-4 justify-center sm:justify-end">
          <AsyncButton
            type="button"
            loadingContent={'Deleting...'}
            action={async () => {
              mutate(taskId);
            }}
          >
            Delete
          </AsyncButton>
          <Button
            variant="secondary"
            type="button"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
