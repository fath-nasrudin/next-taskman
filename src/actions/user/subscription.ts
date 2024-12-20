'use server';

import {
  addSubscription,
  resetUserSubscriptionPlan,
} from '@/lib/api/subscription';
import { getCurrentUser } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export const addSubscriptionAction = async () => {
  const oneMonth = 30 * 24 * 60 * 60 * 1000;
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return {
        error: {
          message: 'NotAuthorized',
        },
      };
    }

    await addSubscription(currentUser.id, oneMonth);

    return { data: 'success' };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'NotAuthorized') {
        return { error: { message: 'Not Authorized', status: 401 } };
      }
    }
    return { error: { message: 'Internal Server Error', status: 500 } };
  }
};

export const addOneMonthSubscriptionAction = async () => {
  revalidatePath('/app/subscription');
  return addSubscriptionAction();
};

export const resetSubscriptionAction = async () => {
  revalidatePath('/app/subscription');
  return resetUserSubscriptionPlan();
};
