export enum POStatus {
  DRAFT = 'draft',
  ISSUED = 'issued',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  PARTIALLY_RECEIVED = 'partially_received',
  RECEIVED = 'received',
  CLOSED = 'closed',
  CANCELLED = 'cancelled',
}

export interface POItem {
  id: string;
  description: string;
  quantity: number;
  receivedQuantity: number;
  unit: string;
  unitPrice: number;
  totalAmount: number;
  notes?: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  quoteId: string;
  quoteNumber: string;
  rfqId: string;
  rfqNumber: string;
  vendor: string;
  vendorEmail: string;
  status: POStatus;
  items: POItem[];
  totalAmount: number;
  currency: string;
  issueDate: string;
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;
  paymentTerms: string;
  shippingAddress: string;
  billingAddress: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface POFilters {
  search?: string;
  status?: POStatus;
  vendor?: string;
}
