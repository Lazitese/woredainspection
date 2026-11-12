'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { WoredaConfig, getWoredaConfig, DEFAULT_WOREDA, isValidWoreda } from '@/config/woredas';
import { extractWoredaFromHost } from '@/utils/supabase/woreda-fetch';
import { useParams, usePathname } from 'next/navigation';

interface WoredaContextType {
  woreda: WoredaConfig;
  activeWoreda: WoredaConfig;
  woredaSlug: string;
  woredaPrefix: string;
  isSubdomain: boolean;
  createWoredaUrl: (path: string) => string;
}

const WoredaContext = createContext<WoredaContextType>({
  woreda: DEFAULT_WOREDA,
  activeWoreda: DEFAULT_WOREDA,
  woredaSlug: DEFAULT_WOREDA.slug,
  woredaPrefix: `/${DEFAULT_WOREDA.slug}`,
  isSubdomain: false,
  createWoredaUrl: (path: string) => `/${DEFAULT_WOREDA.slug}${path.startsWith('/') ? path : `/${path}`}`,
});

export function WoredaProvider({
  children,
  initialWoreda,
  isSubdomain = false,
}: {
  children: React.ReactNode;
  initialWoreda?: WoredaConfig;
  isSubdomain?: boolean;
}) {
  const params = useParams();
  const pathname = usePathname();

  const browserHostWoreda =
    typeof window !== 'undefined' ? extractWoredaFromHost(window.location.hostname) : null;
  const effectiveIsSubdomain = Boolean(isSubdomain || browserHostWoreda);

  const activeWoreda = useMemo(() => {
    if (browserHostWoreda) {
      return getWoredaConfig(browserHostWoreda);
    }
    if (params?.woreda && typeof params.woreda === 'string' && isValidWoreda(params.woreda)) {
      return getWoredaConfig(params.woreda);
    }
    // Check if pathname starts with a woreda slug e.g. /woreda1/...
    if (pathname) {
      const match = pathname.match(/^\/(woreda\d+)(?:\/|$)/i);
      if (match && isValidWoreda(match[1].toLowerCase())) {
        return getWoredaConfig(match[1].toLowerCase());
      }
    }
    if (initialWoreda) return initialWoreda;
    return DEFAULT_WOREDA;
  }, [browserHostWoreda, params, pathname, initialWoreda]);

  const woredaPrefix = effectiveIsSubdomain ? '' : `/${activeWoreda.slug}`;

  const createWoredaUrl = (path: string) => {
    if (!path) return woredaPrefix || '/';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    if (effectiveIsSubdomain) {
      const stripped = cleanPath.replace(/^\/woreda\d+(?=\/|$)/i, '');
      return stripped || '/';
    }
    if (cleanPath === '/') return woredaPrefix;
    if (
      cleanPath === woredaPrefix ||
      cleanPath.startsWith(`${woredaPrefix}/`) ||
      cleanPath.startsWith(`${woredaPrefix}#`) ||
      cleanPath.startsWith(`${woredaPrefix}?`)
    ) {
      return cleanPath;
    }
    return `${woredaPrefix}${cleanPath}`;
  };

  return (
    <WoredaContext.Provider
      value={{
        woreda: activeWoreda,
        activeWoreda,
        woredaSlug: activeWoreda.slug,
        woredaPrefix,
        isSubdomain: effectiveIsSubdomain,
        createWoredaUrl,
      }}
    >
      {children}
    </WoredaContext.Provider>
  );
}

export function useWoreda() {
  const context = useContext(WoredaContext);
  return context;
}
