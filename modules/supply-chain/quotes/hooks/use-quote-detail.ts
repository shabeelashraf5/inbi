'use client';

import { useState, useEffect } from 'react';
import { quotesService } from '@/modules/supply-chain/quotes/services/quotes.service';
import type { Quote, QuoteStatus } from '@/modules/supply-chain/quotes/types/quotes.types';

export function useQuoteDetail(id: string) {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      try {
        setIsLoading(true);
        const data = await quotesService.getQuoteById(id);
        if (data) {
          setQuote(data);
        } else {
          setError('Quote not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch quote');
      } finally {
        setIsLoading(false);
      }
    }
    fetch();
  }, [id]);

  const updateStatus = async (status: QuoteStatus) => {
    try {
      const updated = await quotesService.updateQuoteStatus(id, status);
      if (updated) setQuote(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  return { quote, isLoading, error, updateStatus };
}
