import { MOCK_RFQS } from '@/lib/mock/rfq.mock';
import { randomDelay } from '@/lib/mock/delay';
import type { RFQ, CreateRFQInput, RFQFilters } from '@/modules/supply-chain/rfq/types/rfq.types';
import { RFQStatus } from '@/modules/supply-chain/rfq/types/rfq.types';

// All service functions go through mock data for now.
// When backend is ready: replace internals with apiClient calls.
// Consumer code (hooks/components) needs ZERO changes.

export const rfqService = {
  async getRFQs(filters?: RFQFilters): Promise<RFQ[]> {
    await randomDelay();
    let results = [...MOCK_RFQS];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.rfqNumber.toLowerCase().includes(q) ||
          r.client.toLowerCase().includes(q)
      );
    }

    if (filters?.status) {
      results = results.filter((r) => r.status === filters.status);
    }

    if (filters?.priority) {
      results = results.filter((r) => r.priority === filters.priority);
    }

    return results;
  },

  async getRFQById(id: string): Promise<RFQ | undefined> {
    await randomDelay();
    return MOCK_RFQS.find((r) => r.id === id);
  },

  async createRFQ(input: CreateRFQInput): Promise<RFQ> {
    await randomDelay(500, 1000);
    const newRFQ: RFQ = {
      id: `rfq-${Date.now()}`,
      rfqNumber: `RFQ-${1025 + MOCK_RFQS.length}`,
      ...input,
      status: RFQStatus.DRAFT,
      totalEstimate: input.items.reduce((sum, item) => sum + (item.estimatedPrice || 0) * item.quantity, 0),
      submittedBy: 'Current User',
      submittedDate: new Date().toISOString().split('T')[0],
      items: input.items.map((item, i) => ({ ...item, id: `item-new-${item.description.replace(/\s+/g, '-').toLowerCase()}-${i}` })),
      termsAndConditions: input.termsAndConditions?.map((tc, i) => ({ ...tc, id: `tc-new-${i}` })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    MOCK_RFQS.unshift(newRFQ);
    return newRFQ;
  },

  async updateRFQStatus(id: string, status: RFQStatus): Promise<RFQ | undefined> {
    await randomDelay();
    const rfq = MOCK_RFQS.find((r) => r.id === id);
    if (rfq) {
      rfq.status = status;
      rfq.updatedAt = new Date().toISOString();
    }
    return rfq;
  },
};
