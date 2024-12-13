import * as React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { NavProjects } from './nav-projects';
import { getQueryClient } from '@/lib/query-client';
import { getProjectsByUserId } from '@/lib/api';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const session = await auth();
  if (!session) redirect('/login');

  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: ['projects'],
    queryFn: () => {
      return getProjectsByUserId(session.user.id);
    },
  });

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="text-2xl font-bold text-red-500">Taskman</div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <HydrationBoundary state={dehydrate(queryClient)}>
              <NavProjects />
            </HydrationBoundary>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
