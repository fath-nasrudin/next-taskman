import { Button } from '@/components/ui/button';
import { signIn } from '@/lib/auth';
import { providerMap } from '@/lib/auth/auth.config';
import React from 'react';

export default async function LoginPage(props: {
  searchParams: { callbackUrl: string | undefined };
}) {
  const { callbackUrl } = await props.searchParams;
  return (
    <div className="mt-32 flex flex-col items-center">
      <div className="min-w-96 max-w-[300px] flex flex-col gap-4">
        {Object.values(providerMap).map((provider) => (
          <form
            key={provider.id}
            action={async () => {
              'use server';
              try {
                await signIn(provider.id, {
                  redirectTo: callbackUrl ?? '',
                });
              } catch (error) {
                // Signin can fail for a number of reasons, such as the user
                // not existing, or the user not having the correct role.
                // In some cases, you may want to redirect to a custom error
                // if (error instanceof AuthError) {
                //   return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`);
                // }

                // Otherwise if a redirects happens Next.js can handle it
                // so you can just re-thrown the error and let Next.js handle it.
                // Docs:
                // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
                throw error;
              }
            }}
          >
            <Button className="w-full" variant="secondary" type="submit">
              <span>Sign in with {provider.name}</span>
            </Button>
          </form>
        ))}
      </div>
    </div>
  );
}
