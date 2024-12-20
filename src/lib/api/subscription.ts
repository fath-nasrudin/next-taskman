import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '../session';

export async function addSubscription(userId: string, duration: number) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      subscription: {
        upsert: {
          update: {
            exp: new Date(Date.now() + duration),
          },
          create: {
            exp: new Date(Date.now() + duration),
          },
        },
      },
    },
  });
}

export const getUserSubscriptionByUserId = async (userId: string) => {
  const userWithSubscription = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      subscription: {
        select: {
          exp: true,
        },
      },
    },
  });

  if (!userWithSubscription) {
    return {
      error: {
        message: 'NotFound',
      },
    };
  }

  const isPremium = userWithSubscription?.subscription?.exp;
  const name = isPremium ? 'Premium' : 'Free';
  return {
    data: {
      id: userWithSubscription?.id,
      subscription: {
        isPremium,
        exp: userWithSubscription?.subscription?.exp?.getTime(),
        name,
      },
    },
  };
};

export async function getUserSubscriptionPlan() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return {
      error: {
        message: 'NotAuthorized',
      },
    };
  }

  return getUserSubscriptionByUserId(currentUser.id);
}

export async function resetUserSubscriptionPlan() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return {
      error: {
        message: 'NotAuthorized',
      },
    };
  }

  await prisma.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      subscription: {
        update: {
          exp: null,
        },
      },
    },
  });

  return { data: 'success' };
}
