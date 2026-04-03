'use client';

import { useState, useEffect, useCallback } from 'react';
import { quotesService } from '@/modules/supply-chain/quotes/services/quotes.service';
import type { Quote, QuoteFilters } from '@/modules/supply-chain/quotes/types/quotes.types';

export function useQuotes(initialFilters?: QuoteFilters) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<QuoteFilters>(initialFilters || {});

  const fetchQuotes = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await quotesService.getQuotes(filters);
      setQuotes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch quotes');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  return { quotes, isLoading, error, setFilters, refetch: fetchQuotes };
}
