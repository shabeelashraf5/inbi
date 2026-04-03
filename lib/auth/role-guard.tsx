'use client';

import { useAuth } from '@/lib/auth/use-auth';
import type { Role } from '@/types/auth.types';
import type { Portal } from '@/types/common.types';

interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
  portal?: Portal;
  action?: string;
  fallback?: React.ReactNode;
}

export function RoleGate({
  children,
  allowedRoles,
  portal,
  action = 'view',
  fallback = null,
}: RoleGateProps) {
  const { role, checkPermission } = useAuth();

  if (!role) return fallback;

  // Check by roles list
  if (allowedRoles && !allowedRoles.includes(role)) {
    return fallback;
  }

  // Check by portal permission
  if (portal && !checkPermission(portal, action)) {
    return fallback;
  }

  return <>{children}</>;
}
