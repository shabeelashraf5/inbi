'use client';

import { useState, useEffect, useCallback } from 'react';
import { financeService } from '@/modules/finance/services/finance.service';
import type { Invoice, InvoiceFilters, PaymentMethod } from '@/modules/finance/types/finance.types';

export function useInvoices(initialFilters?: InvoiceFilters) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<InvoiceFilters>(initialFilters || {});

  const fetchInvoices = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await financeService.getInvoices(filters);
      setInvoices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch invoices');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  return { invoices, isLoading, error, setFilters, refetch: fetchInvoices };
}

export function useInvoiceDetail(id: string) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      try {
        setIsLoading(true);
        const data = await financeService.getInvoiceById(id);
        if (data) setInvoice({ ...data });
        else setError('Invoice not found');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch invoice detail');
      } finally {
        setIsLoading(false);
      }
    }
    fetch();
  }, [id]);

  const approveInvoice = async () => {
    try {
      const updated = await financeService.approveInvoice(id);
      if (updated) setInvoice({ ...updated });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve invoice');
    }
  };

  const recordPayment = async (amount: number, method: PaymentMethod, reference: string) => {
    try {
      const updated = await financeService.recordPayment(id, amount, method, reference);
      if (updated) setInvoice({ ...updated });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record payment');
    }
  };

  return { invoice, isLoading, error, approveInvoice, recordPayment };
}
