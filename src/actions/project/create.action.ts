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

    const response = await createProject(projectFormValues, userId);
    revalidatePath('/app');

    return response;
  } catch (error) {
    let message = 'Internal Server Error';
    if (error instanceof Error) {
      message = error.message;
    }
    return {
      error: {
        message,
        status: 500,
      },
    };
  }
};
