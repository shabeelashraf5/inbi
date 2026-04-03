export enum InvoiceStatus {
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  PARTIALLY_PAID = 'partially_paid',
  PAID = 'paid',
  OVERDUE = 'overdue',
  VOIDED = 'voided',
}

export enum PaymentMethod {
  BANK_TRANSFER = 'bank_transfer',
  CREDIT_CARD = 'credit_card',
  CASH = 'cash',
  CHECK = 'check',
}

export interface PaymentRecord {
  id: string;
  invoiceId: string;
  amount: number;
  date: string;
  method: PaymentMethod;
  reference: string;
  notes?: string;
  handledBy: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  taxRate?: number;
  taxAmount?: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  poId: string;
  poNumber: string;
  vendor: string;
  vendorAddress: string;
  vendorTaxId?: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  subtotal: number;
  taxTotal: number;
  totalAmount: number;
  amountPaid: number;
  amountRemaining: number;
  currency: string;
  notes?: string;
  paymentHistory: PaymentRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceFilters {
  search?: string;
  status?: InvoiceStatus;
  vendor?: string;
}
