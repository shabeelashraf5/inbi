import { MOCK_POS } from '@/lib/mock/purchase-orders.mock';
import { randomDelay } from '@/lib/mock/delay';
import type { PurchaseOrder, POFilters } from '@/modules/supply-chain/purchase-orders/types/purchase-orders.types';
import { POStatus } from '@/modules/supply-chain/purchase-orders/types/purchase-orders.types';

export const poService = {
  async getPurchaseOrders(filters?: POFilters): Promise<PurchaseOrder[]> {
    await randomDelay();
    let results = [...MOCK_POS];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (r) =>
          r.vendor.toLowerCase().includes(q) ||
          r.poNumber.toLowerCase().includes(q) ||
          r.rfqNumber.toLowerCase().includes(q) ||
          r.quoteNumber.toLowerCase().includes(q)
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

  async getPOById(id: string): Promise<PurchaseOrder | undefined> {
    await randomDelay();
    return MOCK_POS.find((r) => r.id === id);
  },

  async updatePOStatus(id: string, status: POStatus): Promise<PurchaseOrder | undefined> {
    await randomDelay();
    const po = MOCK_POS.find((r) => r.id === id);
    if (po) {
      po.status = status;
      po.updatedAt = new Date().toISOString();
      if (status === POStatus.RECEIVED) {
        po.actualDeliveryDate = new Date().toISOString().split('T')[0];
        // Fully receive items for now in mock
        po.items = po.items.map(item => ({ ...item, receivedQuantity: item.quantity }));
      }
    }
    return po;
  },
};
