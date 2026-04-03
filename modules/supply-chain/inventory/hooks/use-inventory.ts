'use client';

import { useState, useEffect, useCallback } from 'react';
import { inventoryService } from '@/modules/supply-chain/inventory/services/inventory.service';
import type { InventoryItem, InventoryFilters } from '@/modules/supply-chain/inventory/types/inventory.types';

export function useInventory(initialFilters?: InventoryFilters) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<InventoryFilters>(initialFilters || {});

  const fetchItems = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await inventoryService.getInventory(filters);
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch inventory');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return { items, isLoading, error, setFilters, refetch: fetchItems };
}

export function useInventoryDetail(id: string) {
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      try {
        setIsLoading(true);
        const data = await inventoryService.getInventoryById(id);
        if (data) setItem({ ...data });
        else setError('Inventory item not found');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch item details');
      } finally {
        setIsLoading(false);
      }
    }
    fetch();
  }, [id]);

  const adjustStock = async (adjustment: number, reason: string) => {
    try {
      const updated = await inventoryService.adjustStock(id, adjustment, reason);
      if (updated) setItem({ ...updated });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to adjust stock');
    }
  };

  return { item, isLoading, error, adjustStock };
}
