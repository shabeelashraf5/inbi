export enum RFQStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  QUOTED = 'quoted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

export interface RFQItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  estimatedPrice?: number;
  notes?: string;
}

export interface TermsAndConditions {
  id: string;
  label: string;
  value: string;
}

export interface RFQ {
  id: string;
  rfqNumber: string;
  title: string;
  client: string;
  clientEmail: string;
  status: RFQStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  items: RFQItem[];
  totalEstimate: number;
  submittedBy: string;
  submittedDate: string;
  dueDate: string;
  notes?: string;
  termsAndConditions?: TermsAndConditions[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateRFQInput {
  title: string;
  client: string;
  clientEmail: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  items: Omit<RFQItem, 'id'>[];
  dueDate: string;
  notes?: string;
  termsAndConditions?: Omit<TermsAndConditions, 'id'>[];
}

export interface RFQFilters {
  search?: string;
  status?: RFQStatus;
  priority?: string;
  dateFrom?: string;
  dateTo?: string;
}
