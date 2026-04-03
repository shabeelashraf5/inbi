import { MOCK_INVOICES } from '@/lib/mock/finance.mock';
import { randomDelay } from '@/lib/mock/delay';
import type { Invoice, InvoiceFilters, PaymentRecord } from '@/modules/finance/types/finance.types';
import { InvoiceStatus, PaymentMethod } from '@/modules/finance/types/finance.types';

export const financeService = {
  async getInvoices(filters?: InvoiceFilters): Promise<Invoice[]> {
    await randomDelay();
    let results = [...MOCK_INVOICES];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (r) =>
          r.vendor.toLowerCase().includes(q) ||
          r.invoiceNumber.toLowerCase().includes(q) ||
          r.poNumber.toLowerCase().includes(q)
      );
    }

    if (filters?.status) {
      results = results.filter((r) => r.status === filters.status);
    }

    if (filters?.vendor) {
      results = results.filter((r) => r.vendor === filters.vendor);
    }

    return results;
  },

  async getInvoiceById(id: string): Promise<Invoice | undefined> {
    await randomDelay();
    return MOCK_INVOICES.find((r) => r.id === id);
  },

  async approveInvoice(id: string): Promise<Invoice | undefined> {
    await randomDelay();
    const invoice = MOCK_INVOICES.find((r) => r.id === id);
    if (invoice && invoice.status === InvoiceStatus.PENDING_APPROVAL) {
      invoice.status = InvoiceStatus.APPROVED;
      invoice.updatedAt = new Date().toISOString();
    }
    return invoice;
  },

  async recordPayment(id: string, amount: number, method: PaymentMethod, reference: string): Promise<Invoice | undefined> {
    await randomDelay();
    const invoice = MOCK_INVOICES.find((r) => r.id === id);
    if (invoice) {
       const newPayment: PaymentRecord = {
          id: `pay-${Date.now()}`,
          invoiceId: id,
          amount,
          date: new Date().toISOString().split('T')[0],
          method,
          reference,
          handledBy: 'Accounting Portal',
       };
       invoice.paymentHistory.push(newPayment);
       invoice.amountPaid += amount;
       invoice.amountRemaining = invoice.totalAmount - invoice.amountPaid;
       
       if (invoice.amountRemaining <= 0) {
          invoice.status = InvoiceStatus.PAID;
       } else {
          invoice.status = InvoiceStatus.PARTIALLY_PAID;
       }
       invoice.updatedAt = new Date().toISOString();
    }
    return invoice;
  },
};
