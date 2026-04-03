'use client';

import { Package, Users, UserCog, DollarSign, ChevronDown, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/app.store';
import { useAuth } from '@/lib/auth/use-auth';
import { getEnabledPortals } from '@/lib/constants/portals';
import { Portal, type PortalConfig } from '@/types/common.types';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const PORTAL_ICONS: Record<string, LucideIcon> = {
  Package,
  Users,
  UserCog,
  DollarSign,
};

export function PortalSwitcher({ collapsed }: { collapsed: boolean }) {
  const router = useRouter();
  const { activePortal, setActivePortal } = useAppStore();
  const { canAccess } = useAuth();
  const enabledPortals = getEnabledPortals().filter((p) => canAccess(p.id));

  const currentPortal = enabledPortals.find((p) => p.id === activePortal) || enabledPortals[0];
  const CurrentIcon = currentPortal ? PORTAL_ICONS[currentPortal.icon] || Package : Package;

  const handleSwitch = (portal: PortalConfig) => {
    setActivePortal(portal.id);
    router.push(portal.basePath);
  };

  if (collapsed) {
    return (
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger render={
            <DropdownMenuTrigger render={
              <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-accent-foreground transition-colors hover:bg-sidebar-accent/80 mx-auto">
                <CurrentIcon size={18} />
              </button>
            } />
          } />
          <TooltipContent side="right">{currentPortal?.name || 'Select Portal'}</TooltipContent>
        </Tooltip>
        <DropdownMenuContent side="right" align="start" className="w-56">
          {enabledPortals.map((portal) => {
            const Icon = PORTAL_ICONS[portal.icon] || Package;
            return (
              <DropdownMenuItem
                key={portal.id}
                onClick={() => handleSwitch(portal)}
                className={cn(portal.id === activePortal && 'bg-accent')}
              >
                <Icon size={16} className="mr-2" />
                {portal.name}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={
        <button className="flex w-full items-center gap-3 rounded-lg bg-sidebar-accent/50 px-3 py-2.5 text-left transition-colors hover:bg-sidebar-accent">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ backgroundColor: currentPortal?.color + '20', color: currentPortal?.color }}
          >
            <CurrentIcon size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {currentPortal?.name || 'Select Portal'}
            </p>
            <p className="text-[11px] text-sidebar-foreground/50 truncate">
              {currentPortal?.description}
            </p>
          </div>
          <ChevronDown size={14} className="text-sidebar-foreground/40" />
        </button>
      } />
      <DropdownMenuContent align="start" className="w-[232px]">
        {enabledPortals.map((portal) => {
          const Icon = PORTAL_ICONS[portal.icon] || Package;
          return (
            <DropdownMenuItem
              key={portal.id}
              onClick={() => handleSwitch(portal)}
              className={cn('gap-3 py-2.5', portal.id === activePortal && 'bg-accent')}
            >
              <div
                className="flex h-7 w-7 items-center justify-center rounded-md"
                style={{ backgroundColor: portal.color + '20', color: portal.color }}
              >
                <Icon size={14} />
              </div>
              <div>
                <p className="text-sm font-medium">{portal.name}</p>
                <p className="text-[11px] text-muted-foreground">{portal.description}</p>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
