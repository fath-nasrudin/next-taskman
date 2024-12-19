'use client';
import type { getProject } from '@/lib/api';
import { projectFormSchema, ProjectFormValues } from '@/lib/schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from './ui/input';
import { SubmitButton } from './submit-button';
import { SaveIcon } from 'lucide-react';
import { Button } from './ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const createTemporaryProject = (
  projectFormValues: ProjectFormValues
): Awaited<ReturnType<typeof getProject>> => {
  const id = Math.floor(Math.random() * 1000000).toString();
  return {
    id,
    name: projectFormValues.name,
    userId: 'currentUser',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now()),
  };
};

export type Props = {
  project?: NonNullable<Awaited<ReturnType<typeof getProject>>>;
  onSubmit: (projectFormValues: ProjectFormValues) => Promise<void>;
  onCancel?: () => void;
};

export function ProjectForm({ project, onSubmit, onCancel }: Props) {
  const queryClient = useQueryClient();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: project
      ? {
          name: project.name,
          userId: project.userId,
        }
      : {
          name: '',
          userId: 'cm4ifsyi50000tyteeo1wv8a2',
        },
  });

  const { mutate } = useMutation({
    mutationKey: ['addProject'],

    mutationFn: async (projectFormValues: ProjectFormValues) => {
      await onSubmit(projectFormValues);
    },

    onMutate: async (projectFormValues: ProjectFormValues) => {
      await queryClient.cancelQueries({ queryKey: ['projects'] });

      const newProject = createTemporaryProject(projectFormValues);

      const prevProjects = queryClient.getQueryData(['projects']);

      queryClient.setQueryData(['projects'], (old: []) => [
        ...(old as []),
        newProject,
      ]);

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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          mutate(values);
          form.reset();
        })}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  className="text-base"
                  placeholder="Project Name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex mt-4 gap-2">
          <SubmitButton loadingContent={project ? 'Saving' : 'Creating'}>
            <SaveIcon className="w-4 h-4 mr-2" />
            {project ? 'Save' : 'Create'}
          </SubmitButton>
          {onCancel && (
            <Button
              onClick={() => {
                onCancel();
              }}
              type="button"
              variant="secondary"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
