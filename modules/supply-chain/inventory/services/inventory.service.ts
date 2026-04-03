import { MOCK_INVENTORY } from '@/lib/mock/inventory.mock';
import { randomDelay } from '@/lib/mock/delay';
import type { InventoryItem, InventoryFilters } from '@/modules/supply-chain/inventory/types/inventory.types';
import { InventoryStatus } from '@/modules/supply-chain/inventory/types/inventory.types';

export const inventoryService = {
  async getInventory(filters?: InventoryFilters): Promise<InventoryItem[]> {
    await randomDelay();
    let results = [...MOCK_INVENTORY];

    // Dynamic status check in mock
    results = results.map(item => {
      let status = InventoryStatus.IN_STOCK;
      if (item.quantityOnHand === 0) status = InventoryStatus.OUT_OF_STOCK;
      else if (item.quantityOnHand < item.minStockLevel) status = InventoryStatus.LOW_STOCK;
      return { ...item, status };
    });

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.sku.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q)
      );
    }

    if (filters?.status) {
      results = results.filter((r) => r.status === filters.status);
    }

    if (filters?.category && filters.category !== 'all') {
      results = results.filter((r) => r.category === filters.category);
    }

    return results;
  },

  async getInventoryById(id: string): Promise<InventoryItem | undefined> {
    await randomDelay();
    const item = MOCK_INVENTORY.find((r) => r.id === id);
    if (item) {
      // Dynamic status
      let status = InventoryStatus.IN_STOCK;
      if (item.quantityOnHand === 0) status = InventoryStatus.OUT_OF_STOCK;
      else if (item.quantityOnHand < item.minStockLevel) status = InventoryStatus.LOW_STOCK;
      return { ...item, status };
    }
    return undefined;
  },

  async adjustStock(id: string, adjustment: number, reason: string): Promise<InventoryItem | undefined> {
    await randomDelay();
    const item = MOCK_INVENTORY.find((r) => r.id === id);
    if (item) {
      item.quantityOnHand += adjustment;
      item.availableQuantity = item.quantityOnHand - item.reservedQuantity;
      item.totalValuation = item.quantityOnHand * item.unitPrice;
      item.movements.unshift({
        id: `m-${Date.now()}`,
        type: 'adjustment',
        quantity: Math.abs(adjustment),
        date: new Date().toISOString().split('T')[0],
        referenceId: 'ADJ',
        referenceNumber: reason,
        handledBy: 'System Admin',
      });
      item.updatedAt = new Date().toISOString();
    }
    return item;
  },
};
