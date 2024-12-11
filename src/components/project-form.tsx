'use client';
import { getProject } from '@/lib/api';
import { projectFormSchema, ProjectFormValues } from '@/lib/schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from './ui/input';
import { SubmitButton } from './submit-button';
import { SaveIcon } from 'lucide-react';

export type Props = {
  project?: NonNullable<Awaited<ReturnType<typeof getProject>>>;
  onSubmit: (projectFormValues: ProjectFormValues) => Promise<void>;
};

export function ProjectForm({ project, onSubmit }: Props) {
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          await onSubmit(values);
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
            </FormItem>
          )}
        />

        <div className="flex mt-4 gap-2">
          <SubmitButton loadingContent={project ? 'Saving' : 'Creating'}>
            <SaveIcon className="w-4 h-4 mr-2" />
            {project ? 'Save' : 'Create'}
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}