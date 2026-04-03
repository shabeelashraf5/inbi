'use client';

import { useState, useEffect, useCallback } from 'react';
import { rfqService } from '@/modules/supply-chain/rfq/services/rfq.service';
import type { RFQ, RFQFilters } from '@/modules/supply-chain/rfq/types/rfq.types';

export function useRFQs(initialFilters?: RFQFilters) {
  const [rfqs, setRFQs] = useState<RFQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<RFQFilters>(initialFilters || {});

  const fetchRFQs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await rfqService.getRFQs(filters);
      setRFQs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch RFQs');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchRFQs();
  }, [fetchRFQs]);

  return {
    rfqs,
    isLoading,
    error,
    filters,
    setFilters,
    refetch: fetchRFQs,
  };
}
