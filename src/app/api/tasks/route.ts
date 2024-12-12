import { getProject, getTasksByProjectId } from '@/lib/api';
import { auth } from '@/lib/auth';
import { AuthError } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const projectid = searchParams.get('projectid');

  if (!projectid) {
    throw new Error('projectid not provided');
  }

  try {
    const session = await auth();

    if (!session) {
      throw new AuthError('NotAuthorized');
    }

    const project = await getProject(projectid);

    if (!project) {
      throw new AuthError('NotFound');
    }

    if (project?.userId !== session.user.id) {
      throw new AuthError('Forbidden');
    }

    const data = await getTasksByProjectId(projectid);
    return NextResponse.json(
      {
        data: data,
      },
      {
        status: 200,
      }
    );
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
