export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

export enum Portal {
  OVERVIEW = 'overview',
  SUPPLY_CHAIN = 'supply-chain',
  CRM = 'crm',
  HR = 'hr',
  FINANCE = 'finance',
}

export interface PortalConfig {
  id: Portal;
  name: string;
  description: string;
  icon: string;
  basePath: string;
  color: string;
  enabled: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export type Status = 'draft' | 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';

export interface KPIData {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
}
