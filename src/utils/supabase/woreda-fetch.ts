import { isValidWoreda } from '@/config/woredas';

/**
 * Tables that are strictly isolated per Woreda tenant (woreda1 .. woreda13, skipping woreda12).
 * Every SELECT/HEAD/PATCH/DELETE and INSERT on these tables is automatically scoped to the active woreda.
 */
export const STRICT_WOREDA_TABLES = new Set([
  'news_articles',
  'personnel',
  'complaints',
  'feedbacks',
  'documents',
  'document_access_logs',
  'public_files',
  'qr_codes',
  'scan_requests',
  'sletena_categories',
  'sletena_submissions',
  'sletena_satisfaction_submissions',
  'assessment_periods',
  'period_members',
  'self_assessments',
  'evaluations',
  'approver_evaluations',
  'final_scores',
  'reports',
  'reporting_profiles',
  'report_feedbacks',
  'page_views',
  'admin_profiles',
  'users',
  'user_profiles',
]);

export function extractWoredaFromPathname(pathname?: string | null): string | null {
  if (!pathname) return null;
  const match = pathname.match(/^\/(woreda\d+)(?:\/|$)/i);
  if (match && isValidWoreda(match[1].toLowerCase())) {
    return match[1].toLowerCase();
  }
  return null;
}

export function extractWoredaFromUrl(urlStr?: string | null): string | null {
  if (!urlStr) return null;
  try {
    const parsed = new URL(urlStr, 'http://localhost:3000');
    const fromPath = extractWoredaFromPathname(parsed.pathname);
    if (fromPath) return fromPath;
    const fromQuery = parsed.searchParams.get('woreda')?.toLowerCase();
    if (fromQuery && isValidWoreda(fromQuery)) return fromQuery;
  } catch {
    // ignore malformed URL
  }
  return null;
}

/**
 * Resolves the active woreda ID in the browser from the URL pathname, query param, or cookie.
 */
export function getBrowserActiveWoreda(): string {
  if (typeof window !== 'undefined') {
    const fromPath = extractWoredaFromPathname(window.location.pathname);
    if (fromPath) {
      document.cookie = `active_woreda=${fromPath}; path=/; max-age=31536000; SameSite=Lax`;
      return fromPath;
    }

    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get('woreda')?.toLowerCase();
    if (fromQuery && isValidWoreda(fromQuery)) {
      document.cookie = `active_woreda=${fromQuery}; path=/; max-age=31536000; SameSite=Lax`;
      return fromQuery;
    }

    const cookieMatch = document.cookie.match(/(?:^|;\s*)active_woreda=(woreda\d+)/i);
    if (cookieMatch && isValidWoreda(cookieMatch[1].toLowerCase())) {
      return cookieMatch[1].toLowerCase();
    }
  }
  return 'woreda1';
}

/**
 * Universal active woreda resolver that works seamlessly in both browser and server runtime.
 */
export async function resolveActiveWoreda(): Promise<string> {
  if (typeof window !== 'undefined') {
    return getBrowserActiveWoreda();
  }

  try {
    const { headers, cookies } = await import('next/headers');
    const headerStore = await headers();

    const hWoreda = headerStore.get('x-woreda-id')?.toLowerCase();
    if (hWoreda && isValidWoreda(hWoreda)) {
      return hWoreda;
    }

    const referer = headerStore.get('referer');
    const fromReferer = extractWoredaFromUrl(referer);
    if (fromReferer) {
      return fromReferer;
    }

    const cookieStore = await cookies();
    const cWoreda = cookieStore.get('active_woreda')?.value?.toLowerCase();
    if (cWoreda && isValidWoreda(cWoreda)) {
      return cWoreda;
    }
  } catch {
    // Fallback if called outside Next.js request context (e.g. build step or background task)
  }

  return 'woreda1';
}

/**
 * Wraps global fetch for Supabase clients so every PostgREST call:
 * 1. Sends `x-woreda-id: <activeWoreda>` header (used by Postgres triggers & RLS)
 * 2. Appends `woreda_id=eq.<activeWoreda>` to GET/HEAD/PATCH/DELETE queries on strict woreda tables
 */
export function createWoredaFetch(getActiveWoreda: () => Promise<string> | string): typeof fetch {
  return async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    let woredaId = 'woreda1';
    try {
      const resolved = await getActiveWoreda();
      if (resolved && isValidWoreda(resolved)) {
        woredaId = resolved;
      }
    } catch {
      woredaId = 'woreda1';
    }

    const rawUrl =
      typeof input === 'string'
        ? input
        : input instanceof URL
        ? input.toString()
        : input.url;

    const method = (init?.method || (typeof input === 'object' && 'method' in input ? input.method : 'GET')).toUpperCase();

    let finalUrl = rawUrl;
    try {
      const urlObj = new URL(rawUrl);
      const restMatch = urlObj.pathname.match(/\/rest\/v1\/([a-zA-Z0-9_]+)$/);
      if (restMatch) {
        const tableName = restMatch[1];
        if (
          STRICT_WOREDA_TABLES.has(tableName) &&
          (method === 'GET' || method === 'HEAD' || method === 'PATCH' || method === 'DELETE')
        ) {
          if (!urlObj.searchParams.has('woreda_id')) {
            urlObj.searchParams.set('woreda_id', `eq.${woredaId}`);
            finalUrl = urlObj.toString();
          }
        }
      }
    } catch {
      // Keep original URL if parsing fails
    }

    const headers = new Headers(
      init?.headers || (typeof input === 'object' && 'headers' in input ? input.headers : undefined)
    );
    if (!headers.has('x-woreda-id')) {
      headers.set('x-woreda-id', woredaId);
    }

    if (typeof input === 'object' && !(input instanceof URL) && 'url' in input) {
      const clonedRequest = new Request(finalUrl, {
        method: input.method,
        headers,
        body: init?.body ?? input.body,
        cache: init?.cache ?? input.cache,
        credentials: init?.credentials ?? input.credentials,
        integrity: init?.integrity ?? input.integrity,
        keepalive: init?.keepalive ?? input.keepalive,
        mode: init?.mode ?? input.mode,
        redirect: init?.redirect ?? input.redirect,
        referrer: init?.referrer ?? input.referrer,
        referrerPolicy: init?.referrerPolicy ?? input.referrerPolicy,
        signal: init?.signal ?? input.signal,
        // @ts-ignore
        duplex: init?.body || input.body ? 'half' : undefined,
      });
      return fetch(clonedRequest);
    }

    return fetch(finalUrl, {
      ...init,
      headers,
    });
  };
}
