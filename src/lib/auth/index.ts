import NextAuth from 'next-auth';
import authConfig from './auth.config';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '../prisma';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  events: {
    createUser: async ({ user }) => {
      // Add user initial project and tasks
      const defaultProject = await prisma.project.create({
        data: {
          name: 'Inbox',
          userId: user.id!,
          tasks: {
            create: [
              {
                name: 'Add a task by using the form.',
                userId: user.id!,
                createdAt: new Date(Date.now() + 1000).toISOString(),
              },
              {
                name: 'Edit a task by clicking the Edit button on the right.',
                userId: user.id!,
                createdAt: new Date(Date.now() + 2000).toISOString(),
              },
              {
                name: 'Mark a task as complete by checking the task',
                userId: user.id!,
                createdAt: new Date(Date.now() + 3000).toISOString(),
              },
              {
                name: 'Create a project by clicking the Plus button in the sidebar.',
                userId: user.id!,
                createdAt: new Date(Date.now() + 4000).toISOString(),
              },
              {
                name: 'Create a project by clicking the Plus button in the sidebar.',
                userId: user.id!,
                createdAt: new Date(Date.now() + 5000).toISOString(),
              },
            ],
          },
        },
      });

      await prisma.user.update({
        where: { id: user.id! },
        data: { defaultProjectId: defaultProject.id },
      });
    },
  },
  session: { strategy: 'jwt' },
  ...authConfig,
});
