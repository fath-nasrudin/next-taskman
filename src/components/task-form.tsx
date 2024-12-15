'use client';

import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { getTask } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskFormSchema, TaskFormValues } from '@/lib/schemas';
import { SaveIcon } from 'lucide-react';
import { SubmitButton } from './submit-button';
import { Button } from './ui/button';
import { Select, SelectTrigger, SelectValue } from './ui/select';
import { TaskFormSelectProject } from './task-form-select';
import { Card, CardContent } from './ui/card';

export type Props = {
  task?: NonNullable<Awaited<ReturnType<typeof getTask>>>;
  projectId?: string;
  onSubmit: (taskFormValues: TaskFormValues) => Promise<void>;
  onCancel?: () => void;
};

export function TaskForm({ task, projectId, onSubmit, onCancel }: Props) {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: task
      ? {
          name: task.name,
          isDone: task.isDone || false,
          projectId: task.projectId,
        }
      : {
          name: '',
          isDone: false,
          projectId,
        },
  });
  return (
    <Card className="pt-6">
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async (values) => {
              await onSubmit(values);
              form.reset();
            })}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="text-base"
                      placeholder="Task name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex mt-4 gap-2">
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem className="mr-auto">
                    <FormLabel hidden>Project</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                      </FormControl>
                      <TaskFormSelectProject />
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <SubmitButton loadingContent={task ? 'Saving' : 'task'}>
                <SaveIcon className="w-4 h-4 mr-2" />
                {task ? 'Save' : 'Create'}
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
      </CardContent>
    </Card>
  );
}
