import { getTasksByProjectId } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export type Props = {
  projectId: string;
};

export default function Tasklist({ projectId }: Props) {
  const query = useQuery<
    NonNullable<Awaited<ReturnType<typeof getTasksByProjectId>>>
  >({
    queryKey: ['tasks', projectId],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:3000/api/tasks?projectid=${projectId}`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });
  const tasks: Awaited<ReturnType<typeof getTasksByProjectId>> | undefined =
    query.data;

  if (!tasks) {
    return <>tasks with given projectid not found</>;
  }

  return (
    <div>
      {tasks.map((t) => (
        <div key={t.id}>{t.name}</div>
      ))}
    </div>
  );
}
