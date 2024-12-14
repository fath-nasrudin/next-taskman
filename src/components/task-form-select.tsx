import { useSuspenseQuery } from '@tanstack/react-query';
import { SelectContent, SelectItem } from './ui/select';
import { getProjectsByUserId } from '@/lib/api';

export function TaskFormSelectProject() {
  const { data: projects } = useSuspenseQuery<
    NonNullable<Awaited<ReturnType<typeof getProjectsByUserId>>>
  >({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3000/api/projects`);
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
