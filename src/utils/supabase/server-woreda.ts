import { isValidWoreda } from '@/config/woredas';
import { extractWoredaFromHost, extractWoredaFromUrl } from './woreda-fetch';

/**
 * Returns true when the current server request is served from a dedicated
 * woreda subdomain (e.g., woreda1.akkinspection.com.et).
 */
export async function isServerSubdomainRequest(): Promise<boolean> {
  try {
    const { headers } = await import('next/headers');
    const headerStore = await headers();
    if (headerStore.get('x-woreda-subdomain') === '1') {
      return true;
    }
    return Boolean(
      extractWoredaFromHost(headerStore.get('x-forwarded-host') || headerStore.get('host'))
    );
  } catch {
    return false;
  }
}

/**
 * Resolves the active woreda ID on the server (Server Components, Server Actions, Route Handlers)
 * by inspecting request headers (`host`, `x-forwarded-host`, `x-woreda-id`, `referer`) and cookies (`active_woreda`).
 */
export async function getServerActiveWoreda(): Promise<string> {
  try {
    const { headers, cookies } = await import('next/headers');
    const headerStore = await headers();

    const hostWoreda = extractWoredaFromHost(
      headerStore.get('x-forwarded-host') || headerStore.get('host')
    );
    if (hostWoreda) {
      return hostWoreda;
    }

    const headerWoreda = headerStore.get('x-woreda-id')?.toLowerCase();
    if (headerWoreda && isValidWoreda(headerWoreda)) {
      return headerWoreda;
    }

    const referer = headerStore.get('referer');
    const fromReferer = extractWoredaFromUrl(referer);
    if (fromReferer) {
      return fromReferer;
    }

    const cookieStore = await cookies();
    const cookieWoreda = cookieStore.get('active_woreda')?.value?.toLowerCase();
    if (cookieWoreda && isValidWoreda(cookieWoreda)) {
      return cookieWoreda;
    }
  } catch {
    // Fallback if called outside Next.js request context
  }
  return 'woreda1';
}
