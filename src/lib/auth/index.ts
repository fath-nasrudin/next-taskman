import NextAuth from 'next-auth';
import authConfig from './auth.config';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '../prisma';
import { redirect } from 'next/navigation';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  events: {
    createUser: async ({ user }) => {
      const defaultProject = await prisma.project.create({
        data: {
          name: 'Inbox',
          userId: user.id!,
          tasks: {
            create: [
              { name: 'Add a task by using the form.', userId: user.id! },
              {
                name: 'Edit a task by clicking the Edit button on the right.',
                userId: user.id!,
              },
              {
                name: 'Mark a task as complete by checking the task',
                userId: user.id!,
              },
              {
                name: 'Create a project by clicking the Plus button in the sidebar.',
                userId: user.id!,
              },
              {
                name: 'Create a project by clicking the Plus button in the sidebar.',
                userId: user.id!,
              },
            ],
          },
        },
      });

      await prisma.user.update({
        where: { id: user.id! },
        data: { defaultProjectId: defaultProject.id },
      });
      redirect('/app/inbox');
    },
  },
  session: { strategy: 'jwt' },
  ...authConfig,
});
