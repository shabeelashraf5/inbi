import type { ApiResponse, PaginatedResponse } from '@/types/common.types';

// Central API client - currently returns mock data
// When backend is ready, swap the internals to real HTTP calls
// Zero changes needed in services or components

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

type RequestOptions = {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
};

function buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
  const url = new URL(`${BASE_URL}${endpoint}`, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
}

function getAuthHeaders(): Record<string, string> {
  // When backend is ready, add JWT token here
  return {
    'Content-Type': 'application/json',
  };
}

// For now, these methods are thin wrappers.
// When the NestJS backend is ready:
// 1. Uncomment the fetch calls below
// 2. Remove mock imports from services
// 3. Done — no other changes needed

export const apiClient = {
  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    // FUTURE: Uncomment for real API
    // const url = buildUrl(endpoint, options?.params);
    // const res = await fetch(url, {
    //   method: 'GET',
    //   headers: { ...getAuthHeaders(), ...options?.headers },
    // });
    // if (!res.ok) throw new Error(`GET ${endpoint} failed: ${res.status}`);
    // return res.json();

    // Mock: services will handle their own mock data
    throw new Error(`API GET ${endpoint} - use service mock instead`);
  },

  async post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    // FUTURE: Uncomment for real API
    // const url = buildUrl(endpoint, options?.params);
    // const res = await fetch(url, {
    //   method: 'POST',
    //   headers: { ...getAuthHeaders(), ...options?.headers },
    //   body: body ? JSON.stringify(body) : undefined,
    // });
    // if (!res.ok) throw new Error(`POST ${endpoint} failed: ${res.status}`);
    // return res.json();

    throw new Error(`API POST ${endpoint} - use service mock instead`);
  },

  async put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    // FUTURE: Uncomment for real API
    // const url = buildUrl(endpoint, options?.params);
    // const res = await fetch(url, {
    //   method: 'PUT',
    //   headers: { ...getAuthHeaders(), ...options?.headers },
    //   body: body ? JSON.stringify(body) : undefined,
    // });
    // if (!res.ok) throw new Error(`PUT ${endpoint} failed: ${res.status}`);
    // return res.json();

    throw new Error(`API PUT ${endpoint} - use service mock instead`);
  },

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    // FUTURE: Uncomment for real API
    // const url = buildUrl(endpoint, options?.params);
    // const res = await fetch(url, {
    //   method: 'DELETE',
    //   headers: { ...getAuthHeaders(), ...options?.headers },
    // });
    // if (!res.ok) throw new Error(`DELETE ${endpoint} failed: ${res.status}`);
    // return res.json();

    throw new Error(`API DELETE ${endpoint} - use service mock instead`);
  },
};

export type { ApiResponse, PaginatedResponse };
