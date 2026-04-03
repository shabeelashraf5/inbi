import type { KPIData } from '@/types/common.types';

export const SC_KPIS: KPIData[] = [
  {
    label: 'Open RFQs',
    value: 24,
    change: 6,
    changeLabel: 'new this week',
    icon: 'FileText',
    trend: 'up',
  },
  {
    label: 'Pending Procurement',
    value: 8,
    change: 2,
    changeLabel: 'awaiting quote',
    icon: 'ShoppingCart',
    trend: 'up',
  },
  {
    label: 'Active Orders',
    value: 38,
    change: 15.4,
    changeLabel: 'vs last month',
    icon: 'Package',
    trend: 'up',
  },
  {
    label: 'Revenue (Mock)',
    value: '$2.4M',
    change: 12.5,
    changeLabel: 'vs last month',
    icon: 'DollarSign',
    trend: 'up',
  },
];

export const SC_PIPELINE_DATA = [
  { stage: 'RFQ', count: 24, value: 480000 },
  { stage: 'Parsing', count: 12, value: 240000 },
  { stage: 'Procurement', count: 18, value: 360000 },
  { stage: 'Quoted', count: 15, value: 320000 },
  { stage: 'PO', count: 12, value: 290000 },
  { stage: 'Logistics', count: 8, value: 195000 },
  { stage: 'Delivered', count: 42, value: 890000 },
];

export const SC_RECENT_RFQS = [
  {
    id: 'RFQ-1024',
    title: 'Steel Plates - Grade A',
    client: 'Al Ghurair Construction',
    status: 'pending' as const,
    value: '$45,200',
    date: '2026-03-28',
  },
  {
    id: 'RFQ-1023',
    title: 'Copper Wiring Bundle',
    client: 'Emirates Electrical',
    status: 'approved' as const,
    value: '$23,800',
    date: '2026-03-27',
  },
  {
    id: 'RFQ-1022',
    title: 'Industrial Valves Set',
    client: 'ADNOC Services',
    status: 'draft' as const,
    value: '$67,500',
    date: '2026-03-26',
  },
  {
    id: 'RFQ-1021',
    title: 'HVAC Components',
    client: 'Dubai Cooling Co.',
    status: 'completed' as const,
    value: '$31,400',
    date: '2026-03-25',
  },
  {
    id: 'RFQ-1020',
    title: 'PVC Pipe Fittings',
    client: 'Sharjah Builders',
    status: 'rejected' as const,
    value: '$12,100',
    date: '2026-03-24',
  },
];

export const SC_REVENUE_TREND = [
  { month: 'Oct', procurement: 120000, sales: 185000 },
  { month: 'Nov', procurement: 135000, sales: 210000 },
  { month: 'Dec', procurement: 145000, sales: 245000 },
  { month: 'Jan', procurement: 160000, sales: 275000 },
  { month: 'Feb', procurement: 142000, sales: 230000 },
  { month: 'Mar', procurement: 178000, sales: 310000 },
];
