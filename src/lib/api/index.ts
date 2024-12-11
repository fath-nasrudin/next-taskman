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
