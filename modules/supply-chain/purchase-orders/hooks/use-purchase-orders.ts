'use client';

import { useState, useEffect, useCallback } from 'react';
import { poService } from '@/modules/supply-chain/purchase-orders/services/purchase-orders.service';
import type { PurchaseOrder, POFilters } from '@/modules/supply-chain/purchase-orders/types/purchase-orders.types';

export function usePurchaseOrders(initialFilters?: POFilters) {
  const [pos, setPOs] = useState<PurchaseOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<POFilters>(initialFilters || {});

  const fetchPOs = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await poService.getPurchaseOrders(filters);
      setPOs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch purchase orders');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchPOs();
  }, [fetchPOs]);

  return { pos, isLoading, error, setFilters, refetch: fetchPOs };
}

export function usePODetail(id: string) {
  const [po, setPO] = useState<PurchaseOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      try {
        setIsLoading(true);
        const data = await poService.getPOById(id);
        if (data) setPO({ ...data });
        else setError('Purchase Order not found');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch PO');
      } finally {
        setIsLoading(false);
      }
    }
    fetch();
  }, [id]);

  const updateStatus = async (status: any) => {
    try {
      const updated = await poService.updatePOStatus(id, status);
      if (updated) setPO({ ...updated });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  return { po, isLoading, error, updateStatus };
}
