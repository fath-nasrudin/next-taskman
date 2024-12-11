import { prisma } from '@/lib/prisma';
import { ProjectFormValues } from '@/lib/schemas';

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
