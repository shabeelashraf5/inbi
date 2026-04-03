import { Role } from '@/types/auth.types';
import { Portal } from '@/types/common.types';

export interface Permission {
  portal: Portal;
  actions: ('view' | 'create' | 'edit' | 'delete' | 'approve')[];
}

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.CEO]: [
    { portal: Portal.OVERVIEW, actions: ['view'] },
    { portal: Portal.SUPPLY_CHAIN, actions: ['view', 'create', 'edit', 'delete', 'approve'] },
    { portal: Portal.CRM, actions: ['view', 'create', 'edit', 'delete', 'approve'] },
    { portal: Portal.HR, actions: ['view', 'create', 'edit', 'delete', 'approve'] },
    { portal: Portal.FINANCE, actions: ['view', 'create', 'edit', 'delete', 'approve'] },
  ],
  [Role.SALES_ENGINEER]: [
    { portal: Portal.OVERVIEW, actions: ['view'] },
    { portal: Portal.SUPPLY_CHAIN, actions: ['view', 'create', 'edit'] },
    { portal: Portal.CRM, actions: ['view', 'create', 'edit'] },
  ],
  [Role.SALES_MANAGER]: [
    { portal: Portal.OVERVIEW, actions: ['view'] },
    { portal: Portal.SUPPLY_CHAIN, actions: ['view', 'create', 'edit', 'approve'] },
    { portal: Portal.CRM, actions: ['view', 'create', 'edit', 'approve'] },
  ],
  [Role.PROCUREMENT_OFFICER]: [
    { portal: Portal.OVERVIEW, actions: ['view'] },
    { portal: Portal.SUPPLY_CHAIN, actions: ['view', 'create', 'edit'] },
  ],
  [Role.LOGISTICS_OFFICER]: [
    { portal: Portal.OVERVIEW, actions: ['view'] },
    { portal: Portal.SUPPLY_CHAIN, actions: ['view', 'create', 'edit'] },
  ],
  [Role.ACCOUNTS]: [
    { portal: Portal.OVERVIEW, actions: ['view'] },
    { portal: Portal.SUPPLY_CHAIN, actions: ['view'] },
    { portal: Portal.FINANCE, actions: ['view', 'create', 'edit'] },
  ],
};

export function hasPermission(role: Role, portal: Portal, action: string): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  const portalPermission = permissions.find((p) => p.portal === portal);
  if (!portalPermission) return false;
  return portalPermission.actions.includes(action as Permission['actions'][number]);
}

export function getAccessiblePortals(role: Role): Portal[] {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return [];
  return permissions.map((p) => p.portal);
}

export const PATH_TO_PORTAL: Record<string, Portal> = {
  '/supply-chain': Portal.SUPPLY_CHAIN,
  '/finance': Portal.FINANCE,
  '/crm': Portal.CRM,
  '/hr': Portal.HR,
  '/dashboard': Portal.OVERVIEW,
};

export function getPortalFromPath(path: string): Portal | null {
  for (const [route, portal] of Object.entries(PATH_TO_PORTAL)) {
    if (path.startsWith(route)) return portal;
  }
  return null;
}
