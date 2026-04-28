const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api/v1';

// Resolve tenant from URL param FIRST (overrides localStorage), then localStorage, then env
(() => {
  const params = new URLSearchParams(window.location.search);
  const tenantParam = params.get('tenant');
  if (tenantParam) {
    const current = localStorage.getItem('illizeo_tenant_id');
    if (current && current !== tenantParam) {
      // Switching tenant — clear token from previous tenant
      localStorage.removeItem('illizeo_token');
      localStorage.removeItem('illizeo_trial_start');
      localStorage.removeItem('illizeo_needs_plan');
    }
    localStorage.setItem('illizeo_tenant_id', tenantParam);
  }
})();

const getTenantId = () => localStorage.getItem('illizeo_tenant_id') || import.meta.env.VITE_TENANT_ID || 'illizeo';
const TIMEOUT_MS = 60000;
const TOKEN_KEY = 'illizeo_token';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

// ─── Token management ───────────────────────────────────────
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// ─── API fetch wrapper ──────────────────────────────────────
export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const token = getToken();

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Tenant': getTenantId(),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    });

    if (res.status === 401) {
      clearToken();
    }

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new ApiError(res.status, body || `HTTP ${res.status}`);
    }

    if (res.status === 204) return undefined as T;
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}
