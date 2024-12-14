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
    onSuccess: () => {
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
