import { getProject } from '@/lib/api';
import { auth } from '@/lib/auth';
import { AuthError } from 'next-auth';
import { NextResponse } from 'next/server';

export type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET({ params }: Props) {
  const id = (await params).id;
  try {
    const session = await auth();

    if (!session) {
      throw new AuthError('NotAuthorized');
    }

    const userId = session.user.id;

    const data = await getProject(id);
    if (data?.userId !== userId) {
      throw new AuthError('Forbidden');
    }

    return NextResponse.json(data, {
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
