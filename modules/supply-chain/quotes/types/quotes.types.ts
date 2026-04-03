import { RFQStatus } from '@/modules/supply-chain/rfq/types/rfq.types';

export enum QuoteStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  quotedPrice: number;
  rfqEstimatedPrice?: number;
  notes?: string;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  rfqId: string;
  rfqNumber: string;
  vendor: string;
  vendorEmail: string;
  status: QuoteStatus;
  items: QuoteItem[];
  totalAmount: number;
  validUntil: string;
  submittedAt: string;
  terms: string;
  deliveryTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteFilters {
  search?: string;
  status?: QuoteStatus;
  rfqNumber?: string;
}
