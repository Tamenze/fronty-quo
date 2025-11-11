import type { 
  CsrfResponse, 
  ApiMethod, 
  ApiInit, 
  Json, 
 } from "../types";
 import { ApiError } from "@/lib/ApiError";

const API = import.meta.env.VITE_API_URL as string;
let csrfToken = '';
let inflightCsrf: Promise<string> | null = null;

export function setCsrfToken(t: string) { csrfToken = t; }


const isJson = (res: Response) =>
  (res.headers.get("content-type") || "").toLowerCase().includes("application/json");


const isWrite = (method: ApiMethod) => {
  const m = (method ?? 'GET').toUpperCase();
  return !['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(m);
}

async function doSafeFetch(input: RequestInfo | URL, init?: RequestInit) {
  try {
    return await fetch(input, init);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    throw new ApiError({
      status: 0,
      code: (err?.name === "AbortError") ? "aborted" : "network_error",
      title: (err?.name === "AbortError") ? "Request cancelled" : "Network error",
      detail: (err?.name === "AbortError") ? "The request was aborted." : "Unable to reach the server.",
      message: err?.message || "Network error",
      raw: err,
    });
  }
}

export async function getCsrf(): Promise<string> {
  if (inflightCsrf) return inflightCsrf;
  inflightCsrf = (async () => {
    const res = await doSafeFetch(`${API}/api/v1/auth/csrf`, { credentials: "include" });
    if (!res.ok) throw new Error(`CSRF ${res.status}`);
    const data = (await res.json()) as CsrfResponse;
    csrfToken = data.csrfToken;
    inflightCsrf = null;
    return csrfToken;
  })().catch((e) => {
    inflightCsrf = null;
    throw e;
  });
  return inflightCsrf;
}

export async function api<T = Json>(path: string, init: ApiInit = {}): Promise<T> {
  const method = (init.method ?? 'GET').toUpperCase() as ApiMethod;
  const headers = new Headers(init.headers);

  // Strongly request JSON back
  if (!headers.has("Accept")) headers.set("Accept", "application/json");
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (isWrite(method)) {
    if (!csrfToken) await getCsrf();
    headers.set('X-CSRF-Token', csrfToken);
  }

  const request = () =>
    doSafeFetch(`${API}${path}`, {
      ...init,
      method,
      headers,
      credentials: "include",
      signal: init.signal ?? undefined,
    });

  let res = await request();

  if (res.status === 204) return undefined as T; //No Response Body 

  if (!res.ok){
    // Try to parse a single time
    const parseErrorBody = async (r: Response) => (isJson(r) ? await r.json().catch(() => null) : null);
    let body = await parseErrorBody(res);

    // CSRF-only retry
    if (res.status === 403 && body?.code === "csrf_invalid") {
      await getCsrf();
      headers.set("X-CSRF-Token", csrfToken);
      res = await request();

      if (res.ok) {
        if (res.status === 204) return undefined as T;
        if (isJson(res)) {
          try {
            return (await res.json()) as T;
          } catch {
            return undefined as T;
          }
        }

        throw new ApiError({
          status: res.status,
          code: "unexpected_content_type",
          title: "Unexpected response",
          detail: "Received a non-JSON response from the server.",
          message: "Unexpected non-JSON response",
        });
      };

      body = await parseErrorBody(res);
    }
    // Build structured error (don't include raw HTML in message)
    const status = res.status;
    const title = body?.title;
    const detail = body?.detail ?? body?.error ?? body?.message;
    const code = body?.code;
    const fields = body?.fields;
    const message = title || detail || `${status} ${res.statusText}`;

    // Detect redirects to login pages / HTML surprises
    if (!body && (res.redirected || !isJson(res))) {
      throw new ApiError({
        status,
        code: code || "unexpected_content_type",
        title: title || "Unexpected response",
        detail: detail || "The server returned a non-JSON error response.",
        message: message || "Unexpected error",
      });
    }

    throw new ApiError({ status, code, title, detail, fields, message, raw: body });
  }

   if (isJson(res)) {
    try {
      return (await res.json()) as T;
    } catch {
      return undefined as T;
    }
  }

  //if res is ok but not in JSON, treat as unexpected and throw ApiError
  throw new ApiError({
    status: res.status,
    code: "unexpected_content_type",
    title: "Unexpected response",
    detail: "Received a non-JSON response from the server.",
    message: "Unexpected non-JSON response",
  });

}

