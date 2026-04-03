'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, FileText, FileCheck, ShoppingCart, Warehouse,
  Package, Users, UserCog, DollarSign, ChevronLeft, ChevronRight,
  LogOut, Settings, type LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/app.store';
import { useAuth } from '@/lib/auth/use-auth';
import { getNavigationForPortal } from '@/lib/constants/navigation';
import { getEnabledPortals } from '@/lib/constants/portals';
import { Portal } from '@/types/common.types';
import { PortalSwitcher } from './portal-switcher';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  FileText,
  FileCheck,
  ShoppingCart,
  Warehouse,
  Package,
  Users,
  UserCog,
  DollarSign,
  Settings,
};

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { sidebarCollapsed, toggleSidebar, activePortal } = useAppStore();
  const sections = getNavigationForPortal(activePortal, user?.role);

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || '?';

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out',
        sidebarCollapsed ? 'w-[68px]' : 'w-[260px]'
      )}
    >
      {/* Header */}
      <div className={cn(
        'flex items-center h-16 px-4 border-b border-sidebar-border',
        sidebarCollapsed ? 'justify-center' : 'justify-between'
      )}>
        {!sidebarCollapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              IN
            </div>
            <span className="text-lg font-semibold text-sidebar-foreground tracking-tight">
              INBI
            </span>
          </Link>
        )}
        <button
          onClick={toggleSidebar}
          className="flex h-7 w-7 items-center justify-center rounded-md text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Portal Switcher */}
      <div className={cn('px-3 py-3', sidebarCollapsed && 'px-2')}>
        <PortalSwitcher collapsed={sidebarCollapsed} />
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-2">
        <nav className="flex flex-col gap-1">
          {/* Overview link */}
          <NavLink
            href="/dashboard"
            icon={LayoutDashboard}
            label="Overview"
            active={pathname === '/dashboard'}
            collapsed={sidebarCollapsed}
          />

          <Separator className="my-2 bg-sidebar-border" />

          {sections.map((section, sIdx) => (
            <div key={sIdx} className="mb-1">
              {section.title && !sidebarCollapsed && (
                <p className="px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-sidebar-foreground/40">
                  {section.title}
                </p>
              )}
              {section.items.map((item) => {
                const Icon = ICON_MAP[item.icon] || FileText;
                const isActive = pathname === item.href || (item.href !== '/supply-chain' && pathname.startsWith(item.href + '/'));
                const isExactActive = pathname === item.href;
                const active = item.href.endsWith(activePortal) ? isExactActive : isActive;
                return (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    icon={Icon}
                    label={item.label}
                    active={active}
                    collapsed={sidebarCollapsed}
                    badge={item.badge}
                  />
                );
              })}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="mt-auto border-t border-sidebar-border p-3">
        {sidebarCollapsed ? (
          <Tooltip>
            <TooltipTrigger render={
              <button
                onClick={logout}
                className="flex h-9 w-9 items-center justify-center rounded-md text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors mx-auto"
              >
                <LogOut size={18} />
              </button>
            } />
            <TooltipContent side="right">Sign out</TooltipContent>
          </Tooltip>
        ) : (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name}</p>
              <p className="text-xs text-sidebar-foreground/50 truncate">{user?.role}</p>
            </div>
            <button
              onClick={logout}
              className="flex h-8 w-8 items-center justify-center rounded-md text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

function NavLink({
  href,
  icon: Icon,
  label,
  active,
  collapsed,
  badge,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  active: boolean;
  collapsed: boolean;
  badge?: string;
}) {
  const link = (
    <Link
      href={href}
      className={cn(
        'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
        collapsed && 'justify-center px-2',
        active
          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
          : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
      )}
    >
      <Icon size={18} className={cn(active && 'text-primary')} />
      {!collapsed && (
        <>
          <span className="flex-1">{label}</span>
          {badge && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/10 px-1.5 text-[11px] font-medium text-primary">
              {badge}
            </span>
          )}
        </>
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger render={link} />
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    );
  }

  return link;
}
