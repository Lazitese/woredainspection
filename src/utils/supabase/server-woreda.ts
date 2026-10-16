import { isValidWoreda } from '@/config/woredas';
import { extractWoredaFromUrl } from './woreda-fetch';

/**
 * Resolves the active woreda ID on the server (Server Components, Server Actions, Route Handlers)
 * by inspecting request headers (`x-woreda-id`, `referer`, `x-url`) and cookies (`active_woreda`).
 */
export async function getServerActiveWoreda(): Promise<string> {
  try {
    const { headers, cookies } = await import('next/headers');
    const headerStore = await headers();

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
