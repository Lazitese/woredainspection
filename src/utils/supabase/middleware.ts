import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isValidWoreda } from '@/config/woredas'
import { createWoredaFetch, extractWoredaFromHost, extractWoredaFromUrl } from './woreda-fetch'

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hostWoreda = extractWoredaFromHost(
    request.headers.get('x-forwarded-host') || request.headers.get('host')
  );
  const woredaMatch = pathname.match(/^\/(woreda\d+)(\/.*)?$/i);
  const woredaSlug = woredaMatch ? woredaMatch[1].toLowerCase() : null;
  const effectivePath = woredaMatch ? (woredaMatch[2] || '/') : pathname;

  if (woredaSlug && !isValidWoreda(woredaSlug)) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // Determine the active woreda: subdomain host takes strict precedence, then URL path, Referer, or cookie
  const refererWoreda = extractWoredaFromUrl(request.headers.get('referer'));
  const cookieWoreda = request.cookies.get('active_woreda')?.value?.toLowerCase();
  const activeWoreda =
    hostWoreda ||
    (woredaSlug && isValidWoreda(woredaSlug) ? woredaSlug : null) ||
    (refererWoreda && isValidWoreda(refererWoreda) ? refererWoreda : null) ||
    (cookieWoreda && isValidWoreda(cookieWoreda) ? cookieWoreda : null) ||
    'woreda1';

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-woreda-id', activeWoreda);
  if (hostWoreda) {
    requestHeaders.set('x-woreda-subdomain', '1');
  } else {
    requestHeaders.delete('x-woreda-subdomain');
  }

  let supabaseResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        fetch: createWoredaFetch(() => activeWoreda),
      },
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

  const prefix = hostWoreda ? '' : `/${activeWoreda}`;

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
    // Verify the authenticated user belongs strictly to activeWoreda for this portal
    if (effectivePath.startsWith('/dashboard') || effectivePath.startsWith('/complaint')) {
      const { data: adminProfile } = await supabase
        .from('admin_profiles')
        .select('id, role, status, woreda_id')
        .eq('id', user.id)
        .eq('woreda_id', activeWoreda)
        .maybeSingle();

      const isActiveAdmin = Boolean(
        adminProfile &&
        adminProfile.woreda_id === activeWoreda &&
        (!adminProfile.status || adminProfile.status.toLowerCase() === 'active')
      );

      if (!isActiveAdmin) {
        const url = request.nextUrl.clone();
        url.pathname = effectivePath.startsWith('/complaint')
          ? `${prefix}/complaint/login`
          : `${prefix}/auth/login`;
        url.searchParams.set('error', 'unauthorized');
        return NextResponse.redirect(url);
      }

      if (effectivePath.startsWith('/complaint') && adminProfile?.role !== 'committee_leader' && adminProfile?.role !== 'super_admin') {
        const url = request.nextUrl.clone();
        url.pathname = `${prefix}/complaint/login`;
        url.searchParams.set('error', 'unauthorized');
        return NextResponse.redirect(url);
      }
    } else if (effectivePath.startsWith('/representative')) {
      const { data: repProfile } = await supabase
        .from('user_profiles')
        .select('user_id, system_role, woreda_id')
        .eq('user_id', user.id)
        .eq('woreda_id', activeWoreda)
        .maybeSingle();

      if (!repProfile || repProfile.system_role !== 'representative' || repProfile.woreda_id !== activeWoreda) {
        const url = request.nextUrl.clone();
        url.pathname = `${prefix}/representative/login`;
        url.searchParams.set('error', 'access_denied');
        return NextResponse.redirect(url);
      }
    } else if (effectivePath.startsWith('/assessment')) {
      const [{ data: adminProf }, { data: woredaUser }, { data: woredaMember }] = await Promise.all([
        supabase.from('admin_profiles').select('id').eq('id', user.id).maybeSingle(),
        supabase.from('users').select('id').eq('id', user.id).eq('woreda_id', activeWoreda).maybeSingle(),
        supabase.from('period_members').select('id').eq('user_id', user.id).eq('woreda_id', activeWoreda).limit(1).maybeSingle(),
      ]);

      if (adminProf || (!woredaUser && !woredaMember)) {
        const url = request.nextUrl.clone();
        url.pathname = `${prefix}/assessment/login`;
        url.searchParams.set('error', 'unauthorized');
        return NextResponse.redirect(url);
      }
    }

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
    const { data: adminProfile } = await supabase
      .from('admin_profiles')
      .select('id, status, woreda_id')
      .eq('id', user.id)
      .eq('woreda_id', activeWoreda)
      .maybeSingle();

    if (
      adminProfile &&
      adminProfile.woreda_id === activeWoreda &&
      (!adminProfile.status || adminProfile.status.toLowerCase() === 'active')
    ) {
      const url = request.nextUrl.clone();
      url.pathname = `${prefix}/dashboard`;
      return NextResponse.redirect(url);
    }
  }

  // Subdomain routing mode (e.g., woreda1.akkinspection.com.et .. woreda13.akkinspection.com.et)
  if (hostWoreda) {
    // Strip accidental /woredaN prefix on GET navigation so URLs remain clean on subdomains
    if (woredaSlug && (request.method === 'GET' || request.method === 'HEAD') && !request.headers.get('next-action')) {
      const url = request.nextUrl.clone();
      url.pathname = effectivePath;
      const redirectResponse = NextResponse.redirect(url);
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie);
      });
      redirectResponse.cookies.set('active_woreda', hostWoreda, { path: '/' });
      return redirectResponse;
    }

    // Subdomain root '/' renders the tenant home page internally via /[woreda]
    if (effectivePath === '/') {
      const url = request.nextUrl.clone();
      url.pathname = `/${hostWoreda}`;
      const rewriteResponse = NextResponse.rewrite(url, {
        request: {
          headers: requestHeaders,
        },
      });
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        rewriteResponse.cookies.set(cookie);
      });
      rewriteResponse.cookies.set('active_woreda', hostWoreda, { path: '/' });
      return rewriteResponse;
    }

    // All other paths on subdomain (e.g. /abetuta, /dashboard, /auth/login, /api/...) rewrite stripped path if needed
    if (woredaSlug) {
      const url = request.nextUrl.clone();
      url.pathname = effectivePath;
      url.searchParams.set('woreda', hostWoreda);
      const rewriteResponse = NextResponse.rewrite(url, {
        request: {
          headers: requestHeaders,
        },
      });
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        rewriteResponse.cookies.set(cookie);
      });
      rewriteResponse.cookies.set('active_woreda', hostWoreda, { path: '/' });
      return rewriteResponse;
    }

    supabaseResponse.cookies.set('active_woreda', hostWoreda, { path: '/' });
    return supabaseResponse;
  }

  // Path-based routing mode (e.g., woreda.akkinspection.com.et/woreda2/abetuta)
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
