import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isValidWoreda } from '@/config/woredas'
import { extractWoredaFromUrl } from './woreda-fetch'

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const woredaMatch = pathname.match(/^\/(woreda\d+)(\/.*)?$/i);
  const woredaSlug = woredaMatch ? woredaMatch[1].toLowerCase() : null;
  const effectivePath = woredaMatch ? (woredaMatch[2] || '/') : pathname;

  // Block/redirect woreda 12 as requested (1-13, pass woreda 12)
  if (woredaSlug === 'woreda12' || (woredaSlug && !isValidWoreda(woredaSlug))) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // Determine the active woreda from URL path, Referer header, or cookie
  const refererWoreda = extractWoredaFromUrl(request.headers.get('referer'));
  const cookieWoreda = request.cookies.get('active_woreda')?.value?.toLowerCase();
  const activeWoreda =
    (woredaSlug && isValidWoreda(woredaSlug) ? woredaSlug : null) ||
    (refererWoreda && isValidWoreda(refererWoreda) ? refererWoreda : null) ||
    (cookieWoreda && isValidWoreda(cookieWoreda) ? cookieWoreda : null) ||
    'woreda1';

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-woreda-id', activeWoreda);

  let supabaseResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request: {
              headers: requestHeaders,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isProtectedRoute = effectivePath.startsWith('/dashboard') || 
                           (effectivePath.startsWith('/assessment') && !effectivePath.includes('/login') && !effectivePath.includes('/reset-password')) ||
                           (effectivePath.startsWith('/representative') && !effectivePath.includes('/login') && !effectivePath.includes('/reset-password')) ||
                           (effectivePath.startsWith('/complaint') && !effectivePath.includes('/login') && !effectivePath.includes('/reset-password'));

  const isAuthRoute = effectivePath.startsWith('/auth/login');

  const prefix = `/${activeWoreda}`;

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    if (effectivePath.startsWith('/representative')) {
      url.pathname = `${prefix}/representative/login`;
    } else if (effectivePath.startsWith('/assessment')) {
      url.pathname = `${prefix}/assessment/login`;
    } else if (effectivePath.startsWith('/complaint')) {
      url.pathname = `${prefix}/complaint/login`;
    } else {
      url.pathname = `${prefix}/auth/login`;
    }
    return NextResponse.redirect(url);
  }

  if (isProtectedRoute && user) {
    const needsPasswordChange = user.user_metadata?.force_password_change || user.user_metadata?.requires_password_change;
    const isChangePasswordRoute = effectivePath.includes('/change-password');

    if (needsPasswordChange && !isChangePasswordRoute) {
      const url = request.nextUrl.clone();
      
      if (effectivePath.startsWith('/representative')) {
        url.pathname = `${prefix}/representative/change-password`;
      } else if (effectivePath.startsWith('/assessment')) {
        url.pathname = `${prefix}/assessment/change-password`;
      } else {
        url.pathname = `${prefix}/auth/change-password`;
      }
      return NextResponse.redirect(url);
    }
  }

  if (isAuthRoute && user && !request.nextUrl.searchParams.has('error')) {
    const url = request.nextUrl.clone();
    url.pathname = `${prefix}/dashboard`;
    return NextResponse.redirect(url);
  }

  // 1. If inside a woreda subpath (e.g. /woreda2/abetuta or /woreda2/dashboard/news), rewrite internally
  if (woredaSlug && effectivePath !== '/') {
    const url = request.nextUrl.clone();
    url.pathname = effectivePath;
    url.searchParams.set('woreda', woredaSlug);
    const rewriteResponse = NextResponse.rewrite(url, {
      request: {
        headers: requestHeaders,
      },
    });
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      rewriteResponse.cookies.set(cookie);
    });
    rewriteResponse.cookies.set('active_woreda', woredaSlug, { path: '/' });
    return rewriteResponse;
  }

  // If on root woreda page (e.g. /woreda2), ensure active_woreda cookie is saved
  if (woredaSlug && effectivePath === '/') {
    supabaseResponse.cookies.set('active_woreda', woredaSlug, { path: '/' });
    return supabaseResponse;
  }

  // 2. If an un-prefixed route is accessed directly (e.g. /dashboard/news or /abetuta),
  // redirect to the currently active woreda (from Referer or cookie) so navigation never jumps back to woreda1!
  const legacyDirectRoutes = [
    '/abetuta',
    '/tikoma',
    '/asteyayet',
    '/track',
    '/about',
    '/statistics',
    '/files',
    '/contact',
    '/dashboard',
    '/representative',
    '/assessment',
    '/sletena',
    '/news',
    '/messages',
    '/auth/login',
    '/auth/change-password',
    '/complaint',
    '/request-access',
    '/public',
  ];

  if (!woredaSlug && legacyDirectRoutes.some(r => pathname === r || pathname.startsWith(`${r}/`))) {
    const url = request.nextUrl.clone();
    url.pathname = `/${activeWoreda}${pathname}`;
    const redirectResponse = NextResponse.redirect(url);
    redirectResponse.cookies.set('active_woreda', activeWoreda, { path: '/' });
    return redirectResponse;
  }

  return supabaseResponse;
}
