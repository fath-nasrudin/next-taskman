'use client';

import { createProjectAction } from '@/actions/project/create.action';
import { ProjectForm } from '@/components/project-form';
import type { ProjectFormValues } from '@/lib/schemas';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function PageClient() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationKey: ['addProject'],
    mutationFn: async (projectFormValues: ProjectFormValues) => {
      await createProjectAction(projectFormValues);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
  return (
    <>
      <ProjectForm
        onSubmit={async (projectFormValues) => {
          mutate(projectFormValues);
        }}
      />
    </>
  );
}
