'use server';
import { createTask, updateTask } from '@/lib/api';
import { auth } from '@/lib/auth';
import { TaskFormValues } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';

export const createTaskAction = async (taskFormValues: TaskFormValues) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!session) throw new Error('NotAuthorized');
    if (!userId) throw new Error('NoUserId');

    const task = await createTask(taskFormValues, userId);

    // revalidate tasks data subscribers
    revalidatePath('/app');

    return task;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const updateTaskUserAction = async (
  taskFormValues: Partial<TaskFormValues>,
  taskId: string
) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!session) throw new Error('NotAuthorized');
    if (!userId) throw new Error('NoUserId');

    const task = await updateTask(taskFormValues, taskId);

    return task;
  } catch (error) {
    console.log(error);
    return error;
    return;
  }
};
