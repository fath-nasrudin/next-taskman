import { getProjectsByUserId } from '@/lib/api';
import { auth } from '@/lib/auth';
import { AuthError } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      throw new AuthError('NotAuthorized');
    }
    const userId = session.user.id;

    const data = await getProjectsByUserId(userId);
    return NextResponse.json(data, {
      status: 200,
    });
  } catch (error: unknown) {
    console.error('Authentication error:', error);
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
