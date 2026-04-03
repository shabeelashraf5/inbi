'use client';

import { create } from 'zustand';
import { Portal } from '@/types/common.types';
import type { BreadcrumbItem } from '@/types/common.types';

interface AppState {
  sidebarCollapsed: boolean;
  sidebarMobileOpen: boolean;
  activePortal: Portal;
  breadcrumbs: BreadcrumbItem[];
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSidebarMobileOpen: (open: boolean) => void;
  setActivePortal: (portal: Portal) => void;
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: true,
  sidebarMobileOpen: false,
  activePortal: Portal.SUPPLY_CHAIN,
  breadcrumbs: [],

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setSidebarMobileOpen: (open) => set({ sidebarMobileOpen: open }),
  setActivePortal: (portal) => set({ activePortal: portal }),
  setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
}));
