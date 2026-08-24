import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';

// Parse user-agent to determine device type
function getDeviceType(userAgent: string): string {
  if (/mobile/i.test(userAgent)) return 'Mobile';
  if (/tablet/i.test(userAgent)) return 'Tablet';
  return 'Desktop';
}

// Extract the first real IP from x-forwarded-for (may be comma-separated)
function extractIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0].trim();
    if (first && first !== '::1' && first !== '127.0.0.1') return first;
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp && realIp !== '::1' && realIp !== '127.0.0.1') return realIp;
  return 'Unknown';
}

// Resolve country from CDN headers or IP geolocation fallback
async function resolveGeo(req: Request, ip: string): Promise<{ country: string; country_code: string | null; city: string | null }> {
  // 1. Try CDN headers first (Vercel / Cloudflare)
  const cdnCountry = req.headers.get('x-vercel-ip-country') || req.headers.get('cf-ipcountry');
  if (cdnCountry && cdnCountry !== 'XX') {
    return {
      country: cdnCountry,
      country_code: cdnCountry,
      city: req.headers.get('x-vercel-ip-city') || req.headers.get('cf-ipcity') || null,
    };
  }

  // 2. Fallback: ip-api.com (free, 45 req/min, no key)
  if (ip !== 'Unknown') {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2000); // 2s timeout
      const res = await fetch(
        `http://ip-api.com/json/${ip}?fields=status,country,countryCode,city`,
        { signal: controller.signal }
      );
      clearTimeout(timeout);
      if (res.ok) {
        const geo = await res.json();
        if (geo.status === 'success') {
          return {
            country: geo.country || 'Unknown',
            country_code: geo.countryCode || null,
            city: geo.city || null,
          };
        }
      }
    } catch {
      // Geolocation failed — continue with Unknown
    }
  }

  return { country: 'Unknown', country_code: null, city: null };
}

export async function POST(req: Request) {
  try {
    const { path, referrer } = await req.json();

    const userAgent = req.headers.get('user-agent') || 'Unknown';
    const ip = extractIp(req);
    const deviceType = getDeviceType(userAgent);
    const geo = await resolveGeo(req, ip);

    const { error } = await supabase
      .from('page_views')
      .insert([
        {
          path,
          referrer,
          user_agent: userAgent,
          ip_address: ip,
          device_type: deviceType,
          country: geo.country,
          country_code: geo.country_code,
          city: geo.city,
        }
      ]);

    if (error) {
      console.error('Failed to insert page view:', error);
      return NextResponse.json({ error: 'Failed to record view' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
