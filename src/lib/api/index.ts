import { prisma } from '@/lib/prisma';
import { ProjectFormValues, TaskFormValues } from '@/lib/schemas';

export const createProject = async (
  projectFormValues: ProjectFormValues,
  userId: string
) => {
  return prisma.project.create({
    data: {
      name: projectFormValues.name,
      userId: userId,
    },
  });
};

export const getProject = async (projectId: string) => {
  return prisma.project.findUnique({ where: { id: projectId } });
};

export const getProjectsByUserId = async (userId: string) => {
  return prisma.project.findMany({
    where: { userId: userId },
    orderBy: {
      createdAt: 'desc',
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
