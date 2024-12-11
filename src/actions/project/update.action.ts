'use server';
import { updateProject } from '@/lib/api';
import { auth } from '@/lib/auth';
import { ProjectFormValues } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';

export const updateProjectAction = async (
  projectFormValues: ProjectFormValues,
  projectId: string
) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!session) throw new Error('NotAuthorized');
    if (!userId) throw new Error('NoUserId');

    const updatedProject = await updateProject(projectFormValues, projectId);

    // revalidate projects data subscribers
    revalidatePath('/app');

    return updatedProject;
  } catch (error) {
    console.log(error);
    return error;
  }
};
