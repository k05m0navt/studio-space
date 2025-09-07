"use client";

/**
 * Client-side helper for attaching admin Authorization header from localStorage.
 * Keep this file minimal and client-only.
 */
export function getAuthHeaders(): HeadersInit {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Wrapper around fetch that injects Authorization header when available and uses no-store by default.
 */
export async function authorizedFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const mergedHeaders: HeadersInit = { ...(init.headers || {}), ...getAuthHeaders() };
  return fetch(input, { ...init, headers: mergedHeaders, cache: (init.cache as RequestCache) ?? 'no-store' });
}
