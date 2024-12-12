'use client';
import React from 'react';
import { createTaskAction } from '@/actions/task';
import { TaskForm } from '@/components/task-form';
import Link from 'next/link';

export type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const extractIdFromSlug = (slug: string) => {
  return slug.split('-').pop();
};

export default function ProjectPage({ params }: Props) {
  const { slug } = React.use(params);
  const projectId = extractIdFromSlug(slug);

  return (
    <div>
      <p>Project: {slug}</p>
      <p>Id: {projectId}</p>
      <Link href="/app">Back home</Link>
      <TaskForm
        projectId={projectId}
        onSubmit={async (taskFormValues) => {
          await createTaskAction(taskFormValues);
        }}
      />
    </div>
  );
}
