import { MOCK_QUOTES } from '@/lib/mock/quotes.mock';
import { randomDelay } from '@/lib/mock/delay';
import type { Quote, QuoteFilters } from '@/modules/supply-chain/quotes/types/quotes.types';
import { QuoteStatus } from '@/modules/supply-chain/quotes/types/quotes.types';

export const quotesService = {
  async getQuotes(filters?: QuoteFilters): Promise<Quote[]> {
    await randomDelay();
    let results = [...MOCK_QUOTES];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (r) =>
          r.vendor.toLowerCase().includes(q) ||
          r.quoteNumber.toLowerCase().includes(q) ||
          r.rfqNumber.toLowerCase().includes(q)
      );
    }

    if (filters?.status) {
      results = results.filter((r) => r.status === filters.status);
    }

    if (filters?.rfqNumber) {
      results = results.filter((r) => r.rfqNumber === filters.rfqNumber);
    }

    return results;
  },

  async getQuoteById(id: string): Promise<Quote | undefined> {
    await randomDelay();
    return MOCK_QUOTES.find((r) => r.id === id);
  },

  async updateQuoteStatus(id: string, status: QuoteStatus): Promise<Quote | undefined> {
    await randomDelay();
    const quote = MOCK_QUOTES.find((r) => r.id === id);
    if (quote) {
      quote.status = status;
      quote.updatedAt = new Date().toISOString();
    }
    return quote;
  },
};
