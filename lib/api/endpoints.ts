// Centralized endpoint map
// When backend is ready, just update these URLs

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },

  DASHBOARD: {
    OVERVIEW: '/dashboard/overview',
    KPIS: '/dashboard/kpis',
  },

  SUPPLY_CHAIN: {
    DASHBOARD: '/supply-chain/dashboard',

    RFQ: {
      LIST: '/supply-chain/rfq',
      DETAIL: (id: string) => `/supply-chain/rfq/${id}`,
      CREATE: '/supply-chain/rfq',
      UPDATE: (id: string) => `/supply-chain/rfq/${id}`,
      UPDATE_STATUS: (id: string) => `/supply-chain/rfq/${id}/status`,
    },

    QUOTES: {
      LIST: '/supply-chain/quotes',
      DETAIL: (id: string) => `/supply-chain/quotes/${id}`,
    },

    PURCHASE_ORDERS: {
      LIST: '/supply-chain/purchase-orders',
      DETAIL: (id: string) => `/supply-chain/purchase-orders/${id}`,
    },

    INVENTORY: {
      LIST: '/supply-chain/inventory',
      DETAIL: (id: string) => `/supply-chain/inventory/${id}`,
    },
  },
} as const;
