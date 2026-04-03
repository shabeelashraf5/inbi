import { Role } from '@/types/auth.types';
import { Portal } from '@/types/common.types';

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles?: Role[];
  badge?: string;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export const PORTAL_NAVIGATION: Record<string, NavSection[]> = {
  [Portal.SUPPLY_CHAIN]: [
    {
      items: [
        {
          label: 'Dashboard',
          href: '/supply-chain',
          icon: 'LayoutDashboard',
        },
      ],
    },
    {
      title: 'Procurement',
      items: [
        {
          label: 'RFQ',
          href: '/supply-chain/rfq',
          icon: 'FileText',
          roles: [Role.CEO, Role.SALES_ENGINEER, Role.SALES_MANAGER, Role.PROCUREMENT_OFFICER],
        },
        {
          label: 'Quotes',
          href: '/supply-chain/quotes',
          icon: 'FileCheck',
          roles: [Role.CEO, Role.SALES_ENGINEER, Role.SALES_MANAGER, Role.PROCUREMENT_OFFICER],
        },
        {
          label: 'Purchase Orders',
          href: '/supply-chain/purchase-orders',
          icon: 'ShoppingCart',
          roles: [Role.CEO, Role.SALES_MANAGER, Role.PROCUREMENT_OFFICER],
        },
      ],
    },
    {
      title: 'Operations',
      items: [
        {
          label: 'Inventory',
          href: '/supply-chain/inventory',
          icon: 'Warehouse',
          roles: [Role.CEO, Role.PROCUREMENT_OFFICER, Role.LOGISTICS_OFFICER],
        },
      ],
    },
  ],
  [Portal.CRM]: [
    {
      items: [
        {
          label: 'Dashboard',
          href: '/crm',
          icon: 'LayoutDashboard',
        },
      ],
    },
  ],
  [Portal.HR]: [
    {
      items: [
        {
          label: 'Dashboard',
          href: '/hr',
          icon: 'LayoutDashboard',
        },
      ],
    },
  ],
  [Portal.FINANCE]: [
    {
      items: [
        {
          label: 'Dashboard',
          href: '/finance',
          icon: 'LayoutDashboard',
        },
      ],
    },
    {
      title: 'Accounts Payable',
      items: [
        {
          label: 'Invoices',
          href: '/finance/invoices',
          icon: 'FileText',
        },
        {
          label: 'Payments',
          href: '/finance/payments',
          icon: 'DollarSign',
        },
      ],
    },
  ],
};

export function getNavigationForPortal(portal: Portal, role?: Role): NavSection[] {
  const sections = PORTAL_NAVIGATION[portal] || [];
  if (!role) return sections;

  return sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => !item.roles || item.roles.includes(role)),
    }))
    .filter((section) => section.items.length > 0);
}
