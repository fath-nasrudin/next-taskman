'use client';

import type { getProjectsByUserId } from '@/lib/api';
import { useSuspenseQuery } from '@tanstack/react-query';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from './ui/sidebar';
import { createSlug } from '@/lib/utils';
import Link from 'next/link';
import { HashIcon } from 'lucide-react';
import { useParams, usePathname } from 'next/navigation';

export function NavProjectsSkeleton({ length = 5 }) {
  return (
    <SidebarMenu>
      {Array.from({ length }).map((_, i) => (
        <SidebarMenuItem key={i}>
          <SidebarMenuSkeleton showIcon />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

export function NavProjects() {
  const path = usePathname();
  const { data: projects, isLoading } = useSuspenseQuery<
    NonNullable<Awaited<ReturnType<typeof getProjectsByUserId>>>
  >({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3000/api/projects');

      if (!response.ok) {
        throw new Error('Network error occured');
      }

      return response.json();
    },
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!projects) {
    return <p>No Projects</p>;
  }

  const navItems = projects.map((p) => ({
    title: p.name,
    url: `/app/project/${createSlug(p)}`,
    icon: HashIcon,
  }));

  return (
    <SidebarMenu>
      {navItems.map((i) => (
        <SidebarMenuItem key={i.url}>
          <SidebarMenuButton
            asChild
            isActive={path === i.url}
            // className={path === i.url ? 'bg-red-500' : ''}
          >
            <Link href={i.url}>
              <i.icon strokeWidth={1} />
              <span> {i.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
