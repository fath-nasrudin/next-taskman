'use client';

import { createProjectAction } from '@/actions/project/create.action';
import { ProjectForm } from '@/components/project-form';
import { Card, CardContent } from '@/components/ui/card';
import type { ProjectFormValues } from '@/lib/schemas';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function PageClient() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationKey: ['addProject'],
    mutationFn: async (projectFormValues: ProjectFormValues) => {
      const { error, data } = await createProjectAction(projectFormValues);

      if (error) {
        toast.error(error.message, { position: 'top-center' });
      }
      if (data) {
        toast.success('Project Successfully created', {
          position: 'top-center',
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
  return (
    <Card>
      <CardContent className="pt-4">
        <ProjectForm
          onSubmit={async (projectFormValues) => {
            mutate(projectFormValues);
          }}
        />
      </CardContent>
    </Card>
  );
}
