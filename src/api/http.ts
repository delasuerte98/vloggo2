import { AppError, codeFromStatus, defaultMessage } from './errors';

const BASE_URL = 'https://api.tuodominio.com'; // <--- imposta il tuo base URL

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type RequestOptions = {
  method?: HttpMethod;
  headers?: Record<string, string>;
  // body: oggetto (serializzato a JSON) o FormData (per upload)
  body?: any;
  timeoutMs?: number;         // default 15000
  retries?: number;           // default 2 (solo per GET/HEAD e idempotenti)
  retryOn?: number[];         // codici che triggerano retry (default: 429,502,503,504)
  signal?: AbortSignal | null;
  authToken?: string | null;  // se usi bearer token
};

const DEFAULT_TIMEOUT = 15000;
const RETRYABLE = [429, 502, 503, 504];

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

function isIdempotent(method?: HttpMethod) {
  return !method || method === 'GET' || method === 'HEAD' || method === 'PUT';
}

function buildHeaders(opts: RequestOptions) {
  const h: Record<string, string> = {
    Accept: 'application/json',
    ...(opts.headers || {}),
  };
  // Se body è FormData, NON impostare Content-Type (ci pensa il browser/Expo)
  if (!(opts.body instanceof FormData)) {
    h['Content-Type'] = h['Content-Type'] ?? 'application/json';
  }
  if (opts.authToken) {
    h['Authorization'] = `Bearer ${opts.authToken}`;
  }
  return h;
}

function createAbortSignal(timeoutMs: number, external?: AbortSignal | null) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  const clear = () => clearTimeout(t);

  if (external) {
    // se l'esterno cancella, cancella anche qui
    if (external.aborted) controller.abort();
    else external.addEventListener('abort', () => controller.abort(), { once: true });
  }
  return { signal: controller.signal, clear };
}

async function parseResponse(res: Response) {
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }
  // fallback: testo
  try {
    return await res.text();
  } catch {
    return null;
  }
}

function retryDelay(attempt: number, retryAfterHeader?: string | null) {
  if (retryAfterHeader) {
    const seconds = Number(retryAfterHeader);
    if (!Number.isNaN(seconds) && seconds > 0) return seconds * 1000;
  }
  // exponential backoff + jitter
  const base = Math.min(1000 * 2 ** attempt, 8000);
  const jitter = Math.floor(Math.random() * 400);
  return base + jitter;
}

export async function request<T = any>(path: string, opts: RequestOptions = {}): Promise<T> {
  const method: HttpMethod = opts.method ?? 'GET';
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT;
  const retries = opts.retries ?? 2;
  const retryOn = opts.retryOn ?? RETRYABLE;

  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  const headers = buildHeaders(opts);

  let attempt = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { signal, clear } = createAbortSignal(timeoutMs, opts.signal);
    try {
      const init: RequestInit = {
        method,
        headers,
        signal,
      };

      if (opts.body !== undefined) {
        init.body = opts.body instanceof FormData ? opts.body : JSON.stringify(opts.body);
      }

      const res = await fetch(url, init);

      const data = await parseResponse(res);

      if (!res.ok) {
        const code = codeFromStatus(res.status);
        const msg =
          (data && (data.message || data.error)) ||
          defaultMessage(code);
        const err = new AppError(code, msg, res.status, data);

        // retry solo idempotenti + codici retryable
        if (isIdempotent(method) && retryOn.includes(res.status) && attempt < retries) {
          const delay = retryDelay(attempt, res.headers.get('Retry-After'));
          attempt += 1;
          clear();
          await sleep(delay);
          continue;
        }

        throw err;
      }

      clear();
      return data as T;
    } catch (e: any) {
      clear();
      // Abort / Timeout
      if (e?.name === 'AbortError') {
        // Se è perché abbiamo superato il timeout, mappa a TIMEOUT
        const code = opts.signal?.aborted ? 'CANCELLED' : 'TIMEOUT';
        // retry per TIMEOUT se idempotente
        if (code === 'TIMEOUT' && isIdempotent(method) && attempt < retries) {
          const delay = retryDelay(attempt, null);
          attempt += 1;
          await sleep(delay);
          continue;
        }
        throw new AppError(code, defaultMessage(code));
      }

      // Errori di rete (offline, DNS, ecc.)
      if (e instanceof TypeError || e?.message === 'Network request failed') {
        if (isIdempotent(method) && attempt < retries) {
          const delay = retryDelay(attempt, null);
          attempt += 1;
          await sleep(delay);
          continue;
        }
        throw new AppError('NETWORK', defaultMessage('NETWORK'));
      }

      // Se ci arriva un AppError già mappato, ritiralo su
      if (e instanceof AppError) throw e;

      // Fallback
      throw new AppError('UNKNOWN', defaultMessage('UNKNOWN'), undefined, e);
    }
  }
}

// Helper comodi tipizzati
export const http = {
  get: <T = any>(path: string, opts: Omit<RequestOptions, 'method'> = {}) =>
    request<T>(path, { ...opts, method: 'GET' }),

  post: <T = any>(path: string, body?: any, opts: Omit<RequestOptions, 'method' | 'body'> = {}) =>
    request<T>(path, { ...opts, method: 'POST', body }),

  put: <T = any>(path: string, body?: any, opts: Omit<RequestOptions, 'method' | 'body'> = {}) =>
    request<T>(path, { ...opts, method: 'PUT', body }),

  patch: <T = any>(path: string, body?: any, opts: Omit<RequestOptions, 'method' | 'body'> = {}) =>
    request<T>(path, { ...opts, method: 'PATCH', body }),

  delete: <T = any>(path: string, opts: Omit<RequestOptions, 'method'> = {}) =>
    request<T>(path, { ...opts, method: 'DELETE' }),
};
