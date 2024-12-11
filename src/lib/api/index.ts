import { prisma } from '@/lib/prisma';
import { ProjectFormValues } from '@/lib/schemas';

export const createProject = async (projectFormValues: ProjectFormValues) => {
  return prisma.project.create({
    data: {
      name: projectFormValues.name,
      userId: projectFormValues.userId,
    },
  });
};

export const getProject = async (projectId: string) => {
  return prisma.project.findUnique({ where: { id: projectId } });
};
