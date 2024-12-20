'use client';

import {
  addOneMonthSubscriptionAction,
  resetSubscriptionAction,
} from '@/actions/user/subscription';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const SubscriptionFooter = ({ isPremium }: { isPremium: boolean }) => {
  const queryClient = useQueryClient();

  return (
    <CardFooter className="flex gap-4 justify-end">
      <Button
        disabled={isPremium}
        onClick={async () => {
          const { data, error } = await addOneMonthSubscriptionAction();
          if (data) {
            toast.success('Subscription success', {
              duration: 5000,
              position: 'top-center',
            });
          }
          if (error) {
            toast.error('Subscription failed', {
              duration: 5000,
              position: 'top-center',
            });
          }
          queryClient.invalidateQueries({ queryKey: ['subscription'] });
        }}
      >
        Subscribe
      </Button>
      <Button
        variant="destructive"
        disabled={!isPremium}
        onClick={async () => {
          const { data, error } = await resetSubscriptionAction();
          if (data) {
            toast.success('Reset success', {
              duration: 5000,
              position: 'top-center',
            });
          }
          if (error) {
            toast.error('Reset failed', {
              duration: 5000,
              position: 'top-center',
            });
          }
          queryClient.invalidateQueries({ queryKey: ['subscription'] });
        }}
      >
        Reset
      </Button>
    </CardFooter>
  );
};
