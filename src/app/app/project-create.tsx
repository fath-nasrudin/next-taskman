'use client';
import { createProjectAction } from '@/actions/project/create.action';
import { ProjectForm } from '@/components/project-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { ProjectFormValues } from '@/lib/schemas';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit2Icon } from 'lucide-react';
import React, { useState } from 'react';

export const CreateProject = ({ children }: { children?: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ['updateProject'],
    mutationFn: async ({
      projectFormValues,
    }: {
      projectFormValues: ProjectFormValues;
    }) => {
      await createProjectAction(projectFormValues);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button variant="ghost" size="icon">
            <Edit2Icon />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription className="invisible">
            Create the project
          </DialogDescription>
        </DialogHeader>
        <ProjectForm
          onSubmit={async (projectFormValues) => {
            mutate({ projectFormValues });
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
