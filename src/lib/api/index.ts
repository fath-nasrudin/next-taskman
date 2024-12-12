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
  return prisma.project.findMany({ where: { userId: userId } });
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

export const getTask = async (taskId: string) => {
  return prisma.task.findUnique({ where: { id: taskId } });
};

export const getTasksByProjectId = async (projectId: string) => {
  return prisma.task.findMany({ where: { projectId } });
};

export const getTasksByUserId = async (userId: string) => {
  return prisma.task.findMany({ where: { userId } });
};
