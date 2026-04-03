'use client';

import { useState, useEffect } from 'react';
import { rfqService } from '@/modules/supply-chain/rfq/services/rfq.service';
import type { RFQ } from '@/modules/supply-chain/rfq/types/rfq.types';
import { RFQStatus } from '@/modules/supply-chain/rfq/types/rfq.types';

export function useRFQDetail(id: string) {
  const [rfq, setRFQ] = useState<RFQ | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      try {
        setIsLoading(true);
        const data = await rfqService.getRFQById(id);
        if (data) {
          setRFQ(data);
        } else {
          setError('RFQ not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch RFQ');
      } finally {
        setIsLoading(false);
      }
    }
    fetch();
  }, [id]);

  const updateStatus = async (status: RFQStatus) => {
    try {
      const updated = await rfqService.updateRFQStatus(id, status);
      if (updated) setRFQ(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  return { rfq, isLoading, error, updateStatus };
}
