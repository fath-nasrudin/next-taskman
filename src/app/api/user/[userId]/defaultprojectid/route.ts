import { getUserDefaultProjectId } from '@/lib/api';
import { AuthError } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export type Props = {
  params: Promise<{
    userId: string;
  }>;
};

export async function GET(request: NextRequest, { params }: Props) {
  const paramId = (await params)?.userId;
  try {
    const data = await getUserDefaultProjectId(paramId);

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
