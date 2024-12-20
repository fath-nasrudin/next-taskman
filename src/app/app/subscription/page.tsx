import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, formatDate } from '@/lib/utils';
import { TriangleAlertIcon } from 'lucide-react';
import React from 'react';
import { SubscriptionFooter } from './footer';
import { getUserSubscriptionPlan } from '@/lib/api/subscription';
import { notFound, redirect } from 'next/navigation';

export const metadata = {
  title: 'Subscription',
  description: 'Manage your subscription plan.',
};

export default async function SubscriptionPage() {
  const { error, data } = await getUserSubscriptionPlan();

  if (error) {
    if (error.message === 'NotAuthorized') {
      return redirect('/login');
    }
    if (error.message === 'NotFound') {
      return notFound();
    }
  }

  return (
    <div className={cn('grid items-start gap-8')}>
      <div className="flex flex-col  gap-8 items-center justify-between px-2">
        <div className="grid gap-1">
          <h1 className="font-heading text-3xl md:text-4xl">
            Subscription Plan
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your subscription plan
          </p>
        </div>
        <div className="grid gap-8">
          <Alert className="!pl-14">
            <TriangleAlertIcon />
            <AlertTitle>This app is still in beta.</AlertTitle>
            <AlertDescription>
              This app is still in beta, sou if you in a free plan you can make
              a subscription with free by click the subscribe button.
            </AlertDescription>
          </Alert>
          <Card>
            <CardHeader>
              <CardTitle>Subscription Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                Currently you are in a{' '}
                <strong>{data?.subscription.name}</strong> plan
              </div>
              {data?.subscription.exp && (
                <div>
                  Your subscription will end at{' '}
                  <strong>{formatDate(data.subscription.exp)}</strong>
                </div>
              )}
            </CardContent>
            <SubscriptionFooter isPremium={!!data?.subscription.isPremium} />
          </Card>
        </div>
      </div>
    </div>
  );
}
