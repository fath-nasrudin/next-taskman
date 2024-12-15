import { useSuspenseQuery } from '@tanstack/react-query';
import { SelectContent, SelectItem } from './ui/select';
import { getProjectsByUserId } from '@/lib/api';
import { env } from '@/lib/env';

export function TaskFormSelectProject() {
  const { data: projects } = useSuspenseQuery<
    NonNullable<Awaited<ReturnType<typeof getProjectsByUserId>>>
  >({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await fetch(`${env.NEXT_PUBLIC_BASE_URL}/api/projects`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });

  return (
    <SelectContent>
      {projects.map((p) => (
        <SelectItem key={p.id} value={p.id}>
          {p.name}
        </SelectItem>
      ))}
    </SelectContent>
  );
}
