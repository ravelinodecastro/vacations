import { auth } from '@/app/auth/auth';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8081';

// Typed error that wraps backend ApiError responses
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly detail: string,
  ) {
    super(detail);
    this.name = 'ApiError';
  }
}

async function getAccessToken(): Promise<string> {
  const session = await auth();
  const token = (session as unknown as { accessToken?: string })?.accessToken;
  if (!token) throw new ApiError(401, 'Sessão sem token de acesso. Faça login novamente.');
  return token;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getAccessToken();

  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...init?.headers,
    },
    // Always request fresh data — backend is the source of truth
    cache: 'no-store',
  });

  if (!res.ok) {
    let message = `${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      if (body?.message) message = body.message;
    } catch {
      // ignore parse failure; use status text
    }
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const httpClient = {
  get:    <T>(path: string)                 => request<T>(path),
  post:   <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST',   body: JSON.stringify(body) }),
  put:    <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT',    body: JSON.stringify(body) }),
  patch:  <T>(path: string)                 => request<T>(path, { method: 'PATCH'  }),
  delete: (path: string)                    => request<void>(path, { method: 'DELETE' }),
};
