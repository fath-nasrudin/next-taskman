import { prisma } from '@/lib/prisma';
import { ProjectFormValues, TaskFormValues } from '@/lib/schemas';
import { getUserSubscriptionByUserId } from './subscription';

const canCreateProject = async (creatorId: string) => {
  const FREE_MAX_PROJECT = 5;

  // check if the user is pro
  // check if the user has reached the limit
  const [subscriptionPlan, projectCount] = await Promise.all([
    getUserSubscriptionByUserId(creatorId),
    prisma.project.count({ where: { userId: creatorId } }),
  ]);

  console.log({ projectCount });

  if (subscriptionPlan.error) {
    return { error: subscriptionPlan.error };
  }

  if (!subscriptionPlan.data.subscription.isPremium) {
    // -1 for defaultproject
    const totalProjects = projectCount - 1;
    if (totalProjects >= FREE_MAX_PROJECT) {
      return { status: false };
    }
  }

  return { status: true };
};

export const getUserDefaultProjectId = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user?.defaultProjectId;
};

export const createProject = async (
  projectFormValues: ProjectFormValues,
  userId: string
) => {
  const { error, status } = await canCreateProject(userId);
  if (error) {
    return { error };
  }
  if (!status) {
    return {
      error: {
        message: 'FreeMaxLimitReached',
        status: 402,
      },
    };
  }

  const createdProject = await prisma.project.create({
    data: {
      name: projectFormValues.name,
      userId: userId,
    },
  });

  return { data: createdProject };
};

export const getProject = async (projectId: string) => {
  return prisma.project.findUnique({ where: { id: projectId } });
};

export const getProjectsByUserId = async (userId: string) => {
  return prisma.project.findMany({
    where: { userId: userId },
    orderBy: {
      createdAt: 'asc',
    },
  });
};

export const updateProject = async (
  projectFormValues: ProjectFormValues,
  projectId: string
) => {
  return prisma.project.update({
    where: { id: projectId },
    data: projectFormValues,
  });
};

export const deleteProject = async (projectId: string) => {
  return prisma.project.delete({ where: { id: projectId } });
};

export const createTask = async (
  taskFormValues: TaskFormValues,
  userId: string
) => {
  return prisma.task.create({
    data: {
      name: taskFormValues.name,
      projectId: taskFormValues.projectId,
      userId: userId,
    },
  });
};

export const updateTask = async (
  taskFormValues: Partial<TaskFormValues>,
  taskId: string
) => {
  // apakah perlu memastikan kalo task ini belong ke user tertentu?
  return prisma.task.update({ where: { id: taskId }, data: taskFormValues });
};

export const deleteTask = async (taskId: string) => {
  // apakah perlu memastikan kalo task ini belong ke user tertentu?
  return prisma.task.delete({ where: { id: taskId } });
};

export const getTask = async (taskId: string) => {
  return prisma.task.findUnique({
    where: { id: taskId },
    include: {
      project: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });
};

export const getTasksByProjectId = async (projectId: string) => {
  return prisma.task.findMany({
    where: { projectId },
    include: {
      project: {
        select: {
          name: true,
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getTasksByUserId = async (userId: string) => {
  return prisma.task.findMany({
    where: { userId },
    include: {
      project: {
        select: {
          name: true,
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};
