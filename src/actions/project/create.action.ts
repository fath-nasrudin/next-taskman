'use server';
import { createProject } from '@/lib/api';
import { auth } from '@/lib/auth';
import { ProjectFormValues } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';

export const createProjectAction = async (
  projectFormValues: ProjectFormValues
) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!session) throw new Error('NotAuthorized');
    if (!userId) throw new Error('NoUserId');

    const project = await createProject(projectFormValues, userId);

    // revalidate projects data subscribers
    revalidatePath('/app');

    return project;
  } catch (error) {
    console.log(error);
    return error;
  }
};
