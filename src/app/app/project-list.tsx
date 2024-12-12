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

  const projects = await getProjectsByUserId(session?.user.id);
  return (
    <div>
      {projects.map((p) => (
        <Link
          href={`/app/project/${createSlug(p)}`}
          key={p.id}
          className="flex justify-between"
        >
          <div>{p.name}</div>
          <div>
            <EditProject projectId={p.id} projectData={p} />
            <DeleteProject projectId={p.id} />
          </div>
        </Link>
      ))}
    </div>
  );
}
