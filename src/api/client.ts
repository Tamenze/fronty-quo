import type { 
  CsrfResponse, 
  ApiMethod, 
  ApiInit, 
  Json, 
 } from "../types";
const API = import.meta.env.VITE_API_URL as string;
let csrfToken = '';

export async function getCsrf():Promise<string> {
  const response = await fetch(`${API}/api/v1/auth/csrf`, { credentials: 'include' });
  if (!response.ok) throw new Error(`CSRF ${response.status}`)
  const data = (await response.json()) as CsrfResponse;
  csrfToken = data.csrfToken;
  return csrfToken;
  
}

function isWrite(method: ApiMethod) {
  const m = (method ?? 'GET').toUpperCase();
  return !['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(m);
}

export async function api<T = Json>(path: string, init: ApiInit = {}): Promise<T> {
  const method = (init.method ?? 'GET').toUpperCase() as ApiMethod;
  const headers = new Headers(init.headers);

   if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (isWrite(method)) {
    if (!csrfToken) await getCsrf();
    headers.set('X-CSRF-Token', csrfToken);
  }

  const doFetch = () =>
    fetch(`${API}${path}`, { ...init, method, headers, credentials: 'include', signal: init.signal ?? undefined });

  let res = await doFetch();

  if (!res.ok && (res.status === 422 || res.status === 403)) {
    await getCsrf();
    headers.set('X-CSRF-Token', csrfToken);
    res = await doFetch();
  }

  if (res.status === 204) return undefined as T; //No Response Body 

  if (!res.ok) { //warning this might return json below, change later if so 
    const msg = await res.text().catch(() => ''); //fallback: return empty string if res.text() throws Error 
    throw new Error(`${res.status} ${res.statusText}${msg ? ` — ${msg}` : ''}`);
  }

  return (await res.json()) as T;
}
