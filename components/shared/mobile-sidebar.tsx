'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, FileText, FileCheck, ShoppingCart, Warehouse,
  Package, Users, UserCog, DollarSign, LogOut, type LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/app.store';
import { useAuth } from '@/lib/auth/use-auth';
import { getNavigationForPortal } from '@/lib/constants/navigation';
import { PortalSwitcher } from './portal-switcher';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard, FileText, FileCheck, ShoppingCart, Warehouse,
  Package, Users, UserCog, DollarSign,
};

export function MobileSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { activePortal, setSidebarMobileOpen } = useAppStore();
  const sections = getNavigationForPortal(activePortal, user?.role);

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase() || '?';

  const handleNavClick = () => {
    setSidebarMobileOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-sidebar">
      {/* Header */}
      <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-2" onClick={handleNavClick}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            IN
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground tracking-tight">INBI</span>
        </Link>
      </div>

      {/* Portal Switcher */}
      <div className="px-3 py-3">
        <PortalSwitcher collapsed={false} />
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Nav */}
      <ScrollArea className="flex-1 px-3 py-2">
        <nav className="flex flex-col gap-1">
          <Link
            href="/dashboard"
            onClick={handleNavClick}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              pathname === '/dashboard'
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/50'
            )}
          >
            <LayoutDashboard size={18} />
            <span>Overview</span>
          </Link>

          <Separator className="my-2 bg-sidebar-border" />

          {sections.map((section, sIdx) => (
            <div key={sIdx} className="mb-1">
              {section.title && (
                <p className="px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-sidebar-foreground/40">
                  {section.title}
                </p>
              )}
              {section.items.map((item) => {
                const Icon = ICON_MAP[item.icon] || FileText;
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleNavClick}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/50'
                    )}
                  >
                    <Icon size={18} className={cn(isActive && 'text-primary')} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3">
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
      </div>
    </div>
  );
}
