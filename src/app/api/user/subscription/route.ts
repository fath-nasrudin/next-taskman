import { getUserSubscriptionByUserId } from '@/lib/api/subscription';
import { getCurrentUser } from '@/lib/session';
import { AuthError } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new AuthError('NotAuthenticated');
    }

    const { error, data } = await getUserSubscriptionByUserId(currentUser.id);
    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(data.subscription, {
      status: 200,
    });
  } catch (error: unknown) {
    let status = 500;
    // Handling spesifik AuthError
    if (error instanceof AuthError) {
      let status = 401;
      if (error.message === 'Forbidden') {
        status = 403;
      }
      return NextResponse.json(
        {
          message: error.message || 'Authentication Failed',
          type: error.name,
        },
        {
          status: status,
        }
      );
    }

    // Handling spesifik AuthError
    if (error instanceof Error) {
      if (error.message === 'NotFound') status = 404;
    }

    // Handling error umum
    return NextResponse.json(
      {
        message: 'Server Error',
        error:
          process.env.NODE_ENV === 'development'
            ? error instanceof Error
              ? error.message
              : 'Unknown error'
            : 'Internal Server Error',
      },
      {
        status: status,
      }
    );
  }
}
