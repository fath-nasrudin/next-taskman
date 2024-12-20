'use client';
import { deleteProjectAction } from '@/actions/project/delete.action';
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
import type { getProjectsByUserId } from '@/lib/api';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2Icon } from 'lucide-react';
import React, { useState } from 'react';

export const DeleteProject = ({
  projectId,
  children,
}: {
  projectId: string;
  children?: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ['deleteProject'],
    mutationFn: async (projectId: string) => {
      await deleteProjectAction(projectId);
    },

    onMutate: async (projectId) => {
      await queryClient.cancelQueries({ queryKey: ['projects'] });

      const prevProjects = queryClient.getQueryData(['projects']);

      queryClient.setQueriesData(
        { queryKey: ['projects'] },
        (old: NonNullable<Awaited<ReturnType<typeof getProjectsByUserId>>>) => {
          return old.filter((p) => p.id !== projectId);
        }
      );

      return { prevProjects };
    },
    onError: (error, projectFormValues, context) => {
      queryClient.setQueryData(['projects'], context?.prevProjects);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: 'projects' });
    },
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="border-transparent hover:border-muted-foreground border-[1px] rounded-md"
          >
            <Trash2Icon />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            Are you sure want to delete this project? This action is
            irreversible
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row gap-4 justify-center sm:justify-end">
          <AsyncButton
            type="button"
            loadingContent={'Deleting...'}
            action={async () => {
              mutate(projectId);
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
