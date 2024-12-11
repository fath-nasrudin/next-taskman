import { getProjectsByUserId } from '@/lib/api';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { EditProject } from './project-edit';

export default async function ProjectList() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const projects = await getProjectsByUserId(session?.user.id);
  return (
    <div>
      {projects.map((p) => (
        <div key={p.id} className="flex justify-between">
          <div>{p.name}</div>
          <EditProject projectId={p.id} projectData={p} />
        </div>
      ))}
    </div>
  );
}
