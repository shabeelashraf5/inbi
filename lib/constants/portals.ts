import { Portal, type PortalConfig } from '@/types/common.types';

export const PORTALS: PortalConfig[] = [
  {
    id: Portal.SUPPLY_CHAIN,
    name: 'Supply Chain',
    description: 'Manage procurement, inventory, and logistics',
    icon: 'Package',
    basePath: '/supply-chain',
    color: '#c4956a',
    enabled: true,
  },
  {
    id: Portal.CRM,
    name: 'CRM',
    description: 'Customer relationship management',
    icon: 'Users',
    basePath: '/crm',
    color: '#6aa8c4',
    enabled: false,
  },
  {
    id: Portal.HR,
    name: 'Human Resources',
    description: 'Employee management and payroll',
    icon: 'UserCog',
    basePath: '/hr',
    color: '#8bc46a',
    enabled: false,
  },
  {
    id: Portal.FINANCE,
    name: 'Finance',
    description: 'Accounting, invoicing, and reports',
    icon: 'DollarSign',
    basePath: '/finance',
    color: '#c4b86a',
    enabled: true,
  },
];

export function getPortalConfig(portalId: Portal): PortalConfig | undefined {
  return PORTALS.find((p) => p.id === portalId);
}

export function getEnabledPortals(): PortalConfig[] {
  return PORTALS.filter((p) => p.enabled);
}
