import type { KPIData } from '@/types/common.types';

export const OVERVIEW_KPIS: KPIData[] = [
  {
    label: 'Total Revenue',
    value: '$2.4M',
    change: 12.5,
    changeLabel: 'vs last month',
    icon: 'DollarSign',
    trend: 'up',
  },
  {
    label: 'Active RFQs',
    value: 24,
    change: -3.2,
    changeLabel: 'vs last month',
    icon: 'FileText',
    trend: 'down',
  },
  {
    label: 'Pending Orders',
    value: 18,
    change: 8.1,
    changeLabel: 'vs last month',
    icon: 'ShoppingCart',
    trend: 'up',
  },
  {
    label: 'Fulfillment Rate',
    value: '94.2%',
    change: 2.3,
    changeLabel: 'vs last month',
    icon: 'CheckCircle',
    trend: 'up',
  },
];

export const REVENUE_CHART_DATA = [
  { month: 'Jul', revenue: 186000, target: 200000 },
  { month: 'Aug', revenue: 205000, target: 200000 },
  { month: 'Sep', revenue: 237000, target: 220000 },
  { month: 'Oct', revenue: 198000, target: 220000 },
  { month: 'Nov', revenue: 256000, target: 240000 },
  { month: 'Dec', revenue: 289000, target: 250000 },
  { month: 'Jan', revenue: 312000, target: 280000 },
  { month: 'Feb', revenue: 278000, target: 290000 },
  { month: 'Mar', revenue: 345000, target: 310000 },
];

export const ORDER_STATUS_DATA = [
  { name: 'Completed', value: 42, color: '#10b981' },
  { name: 'In Progress', value: 28, color: '#c4956a' },
  { name: 'Pending', value: 18, color: '#f59e0b' },
  { name: 'Cancelled', value: 6, color: '#ef4444' },
];

export const RECENT_ACTIVITY = [
  {
    id: '1',
    action: 'RFQ #1024 submitted',
    user: 'Sara Mahmoud',
    time: '2 min ago',
    type: 'rfq' as const,
  },
  {
    id: '2',
    action: 'PO #5678 approved',
    user: 'Omar Farooq',
    time: '15 min ago',
    type: 'po' as const,
  },
  {
    id: '3',
    action: 'Quote #3344 received',
    user: 'Fatima Hassan',
    time: '1 hour ago',
    type: 'quote' as const,
  },
  {
    id: '4',
    action: 'Inventory updated for SKU-2201',
    user: 'Khalid Ibrahim',
    time: '2 hours ago',
    type: 'inventory' as const,
  },
  {
    id: '5',
    action: 'Invoice #9901 generated',
    user: 'Nadia Youssef',
    time: '3 hours ago',
    type: 'invoice' as const,
  },
];
