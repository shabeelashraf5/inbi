'use client';

import { useAuthStore } from '@/store/auth.store';
import { hasPermission, getAccessiblePortals } from '@/lib/constants/roles';
import { Portal } from '@/types/common.types';
import type { Role } from '@/types/auth.types';

export function useAuth() {
  const { user, isAuthenticated, login, logout } = useAuthStore();

  const checkPermission = (portal: Portal, action: string): boolean => {
    if (!user) return false;
    return hasPermission(user.role, portal, action);
  };

  const accessiblePortals = user ? getAccessiblePortals(user.role) : [];

  const canAccess = (portal: Portal): boolean => {
    return accessiblePortals.includes(portal);
  };

  return {
    user,
    role: user?.role as Role | undefined,
    isAuthenticated,
    login,
    logout,
    checkPermission,
    accessiblePortals,
    canAccess,
  };
}
