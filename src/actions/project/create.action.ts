'use server';
import { createProject } from '@/lib/api';
import { ProjectFormValues } from '@/lib/schemas';

export const createProjectAction = async (
  projectFormValues: ProjectFormValues
) => {
  const project = await createProject(projectFormValues);
  return project;
};
