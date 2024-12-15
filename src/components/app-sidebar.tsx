import * as React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuAction,
  SidebarRail,
} from '@/components/ui/sidebar';
import { NavProjectsSkeleton } from './nav-projects.client';
import { NavProjects } from './nav-projects';
import { SidebarProfile } from './sidebar-profile';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { PlusIcon } from 'lucide-react';
import { Button } from './ui/button';
import { CreateProject } from '@/app/app/project-create';

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const session = await auth();
  if (!session) redirect('/login');

  const user = session.user;

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarProfile
          user={{
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          }}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupAction>
            <CreateProject>
              <PlusIcon />
            </CreateProject>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <React.Suspense fallback={<NavProjectsSkeleton />}>
              <NavProjects />
            </React.Suspense>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
