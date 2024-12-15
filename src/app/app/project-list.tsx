import { getProjectsByUserId } from '@/lib/api';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { EditProject } from './project-edit';
import { DeleteProject } from './project-delete';
import Link from 'next/link';

const createSlug = ({ name, id }: { name: string; id: string }) => {
  return `${name.toLowerCase().split(' ').join('-')}-${id}`;
};

export default async function ProjectList() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  let projects = await getProjectsByUserId(session?.user.id);
  projects = projects.filter((p) => p.id !== session.user.defaultProjectId);

  return (
    <div className="mt-8">
      {projects.map((p) => (
        <div
          key={p.id}
          className="border-b-[1px] hover:bg-muted flex items-center"
        >
          <Link href={`/app/project/${createSlug(p)}`} className="p-4 flex-1">
            <div>{p.name}</div>
          </Link>
          <div>
            <EditProject projectId={p.id} projectData={p} />
            <DeleteProject projectId={p.id} />
          </div>
        </div>
      ))}
    </div>
  );
}
