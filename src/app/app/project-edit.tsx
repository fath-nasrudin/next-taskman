'use client';
import { updateProjectAction } from '@/actions/project/update.action';
import { ProjectForm } from '@/components/project-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { getProject } from '@/lib/api';
import { ProjectFormValues } from '@/lib/schemas';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit2Icon } from 'lucide-react';
import { useState } from 'react';

export const EditProject = ({
  projectId,
  projectData,
}: {
  projectId: string;
  projectData: NonNullable<Awaited<ReturnType<typeof getProject>>>;
}) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ['updateProject'],
    mutationFn: async ({
      projectFormValues,
      projectId,
    }: {
      projectFormValues: ProjectFormValues;
      projectId: string;
    }) => {
      await updateProjectAction(projectFormValues, projectId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Edit2Icon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>Edit the project</DialogDescription>
        </DialogHeader>
        <ProjectForm
          project={projectData}
          onSubmit={async (projectFormValues) => {
            mutate({ projectFormValues, projectId });
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
