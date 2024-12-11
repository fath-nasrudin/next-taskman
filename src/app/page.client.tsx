'use client';

import { createProjectAction } from '@/actions/project/create.action';
import { ProjectForm } from '@/components/project-form';

export default function PageClient() {
  return (
    <>
      <ProjectForm
        onSubmit={async (projectFormValues) => {
          await createProjectAction(projectFormValues);
        }}
      />
    </>
  );
}
