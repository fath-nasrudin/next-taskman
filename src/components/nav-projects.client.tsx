'use client';

import type { getProjectsByUserId } from '@/lib/api';
import { useSession } from 'next-auth/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import {
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from './ui/sidebar';
import { createSlug } from '@/lib/utils';
import Link from 'next/link';
import { HashIcon, MoreHorizontal } from 'lucide-react';
import { usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { EditProject } from '@/app/app/project-edit';
import { DeleteProject } from '@/app/app/project-delete';
import { env } from '@/lib/env';

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

export function NavProjectsClient() {
  const path = usePathname();
  const { data: session } = useSession();
  const { data: projects, isLoading } = useSuspenseQuery<
    NonNullable<Awaited<ReturnType<typeof getProjectsByUserId>>>
  >({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await fetch(`${env.NEXT_PUBLIC_BASE_URL}/api/projects`);

      if (!response.ok) {
        throw new Error('Failed to fetch tasktasks');
      }

      return response.json();
    },

    staleTime: 1000 * 60 * 5, // Cache duration: 5 minutes
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!projects) {
    return <p>No Projects</p>;
  }

  const navItems = projects
    .filter((p) => p.id !== session?.user.defaultProjectId)
    .map((p) => ({
      id: p.id,
      title: p.name,
      url: `/app/project/${createSlug(p)}`,
      icon: HashIcon,
    }));

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.url}>
          <SidebarMenuButton
            asChild
            isActive={path === item.url}
            // className={path === i.url ? 'bg-red-500' : ''}
          >
            <Link href={item.url} className="flex">
              <item.icon strokeWidth={1} />
              <span> {item.title}</span>
            </Link>
          </SidebarMenuButton>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuAction>
                <MoreHorizontal />
              </SidebarMenuAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  // this prevent default made the menu item unaccessible by keyboard,
                  // find the solution later
                }}
              >
                <EditProject
                  projectData={projects.find((p) => p.id === item.id)!}
                  projectId={item.id}
                >
                  <span>Edit Project</span>
                </EditProject>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <DeleteProject projectId={item.id}>
                  <span>Delete Project</span>
                </DeleteProject>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
