'use client';

import * as React from 'react';
import { ChevronsUpDown, CrownIcon, LogOutIcon } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { logoutAction } from '@/actions/auth';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { absoluteUrl } from '@/lib/utils';
import { toast } from 'sonner';

type Subscription = {
  name: string;
  exp?: number;
  isPremium?: boolean;
};

export function SidebarProfile({
  user,
}: {
  user: {
    name?: string | null;
    image?: string | null;
    id?: string | null;
    email?: string | null;
  };
}) {
  const {
    data: subscription,
    isLoading,
    isError,
    error,
  } = useQuery<Subscription>({
    queryKey: ['subscription'],
    queryFn: async () => {
      const response = await fetch(absoluteUrl(`/api/user/subscription`));
      return await response.json();
    },
  });

  if (isError) {
    toast(error.message);
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {user.image ? (
                <Image
                  src={user.image}
                  alt="user profile image"
                  width="128"
                  height="128"
                  className="w-8 h-8 rounded-full"
                />
              ) : user.name ? (
                <div className="w-8 h-8 font-medium rounded-full bg-green-500 grid place-content-center">
                  {user.name?.[0]}
                </div>
              ) : (
                <Image
                  src="/avatars/me.svg"
                  alt="user profile image"
                  width="128"
                  height="128"
                  className="w-8 h-8 rounded-full"
                />
              )}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
                <span className="text-xs">
                  {isLoading ? 'Loading...' : subscription?.name}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={'bottom'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Menu
            </DropdownMenuLabel>

            <DropdownMenuItem className="gap-2 p-2 text-muted-foreground">
              <div className="flex size-6 items-center justify-center">
                <CrownIcon className="size-4" />
              </div>
              <Link href={'/app/subscription'}>Subscription</Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="gap-2 p-2 text-muted-foreground"
              onSelect={async () => {
                await logoutAction();
              }}
            >
              <div className="flex size-6 items-center justify-center">
                <LogOutIcon className="size-4" />
              </div>
              <div className="font-medium">Logout</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
