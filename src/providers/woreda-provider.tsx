'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { WoredaConfig, getWoredaConfig, DEFAULT_WOREDA } from '@/config/woredas';
import { useParams, usePathname } from 'next/navigation';

interface WoredaContextType {
  woreda: WoredaConfig;
  activeWoreda: WoredaConfig;
  woredaSlug: string;
  woredaPrefix: string;
  createWoredaUrl: (path: string) => string;
}

const WoredaContext = createContext<WoredaContextType>({
  woreda: DEFAULT_WOREDA,
  activeWoreda: DEFAULT_WOREDA,
  woredaSlug: DEFAULT_WOREDA.slug,
  woredaPrefix: `/${DEFAULT_WOREDA.slug}`,
  createWoredaUrl: (path: string) => `/${DEFAULT_WOREDA.slug}${path.startsWith('/') ? path : `/${path}`}`,
});

export function WoredaProvider({
  children,
  initialWoreda,
}: {
  children: React.ReactNode;
  initialWoreda?: WoredaConfig;
}) {
  const params = useParams();
  const pathname = usePathname();

  const activeWoreda = useMemo(() => {
    if (initialWoreda) return initialWoreda;
    if (params?.woreda && typeof params.woreda === 'string') {
      return getWoredaConfig(params.woreda);
    }
    // Check if pathname starts with a woreda slug e.g. /woreda1/...
    if (pathname) {
      const match = pathname.match(/^\/(woreda\d+)/);
      if (match) {
        return getWoredaConfig(match[1]);
      }
    }
    return DEFAULT_WOREDA;
  }, [params, pathname, initialWoreda]);

  const woredaPrefix = `/${activeWoreda.slug}`;

  const createWoredaUrl = (path: string) => {
    if (!path) return woredaPrefix;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    if (cleanPath === '/') return woredaPrefix;
    if (cleanPath.startsWith(woredaPrefix)) return cleanPath;
    return `${woredaPrefix}${cleanPath}`;
  };

  return (
    <WoredaContext.Provider
      value={{
        woreda: activeWoreda,
        activeWoreda,
        woredaSlug: activeWoreda.slug,
        woredaPrefix,
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
