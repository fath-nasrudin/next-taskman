'use client';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from './ui/sidebar';
import Link from 'next/link';
import { InboxIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function NavDefaultSkeleton({ length = 5 }) {
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

export function NavDefault() {
  const path = usePathname();

  const navItems = [{ title: 'Inbox', url: '/app/inbox', icon: InboxIcon }];

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
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
