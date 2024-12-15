'use server';
import { deleteProject } from '@/lib/api';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export const deleteProjectAction = async (projectId: string) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!session) throw new Error('NotAuthorized');
    if (!userId) throw new Error('NoUserId');

    // Not allowed to update default project
    if (session?.user?.defaultProjectId === projectId) return;

    const deletedProject = await deleteProject(projectId);

    // revalidate projects data subscribers
    revalidatePath('/app');

    return deletedProject;
  } catch (error) {
    console.log(error);
    return error;
  }
};
