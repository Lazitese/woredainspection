'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useWoreda } from '@/providers/woreda-provider';

type AdminProfile = {
  id: string;
  role: 'super_admin' | 'admin' | 'committee_leader';
  permissions: string[];
  first_name?: string;
  last_name?: string;
  access_level?: string;
  modules?: string[];
  email?: string;
  woreda_id?: string;
  status?: string;
};

type AdminContextType = {
  profile: AdminProfile | null;
  loading: boolean;
  isSuperAdmin: boolean;
  hasPermission: (permission: string) => boolean;
};

const AdminContext = createContext<AdminContextType>({
  profile: null,
  loading: true,
  isSuperAdmin: false,
  hasPermission: () => false,
});

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { woredaSlug } = useWoreda();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    async function loadProfile() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        if (mounted) {
          setProfile(null);
          setLoading(false);
        }
        return;
      }

      const { data, error } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('id', session.user.id)
        .eq('woreda_id', woredaSlug)
        .maybeSingle();

      if (error) {
        console.error('Error fetching admin profile:', error);
      }

      const isActive = !data?.status || data.status.toLowerCase() === 'active';
      const matchesWoreda = Boolean(data && data.woreda_id === woredaSlug);

      if (!error && mounted) {
        setProfile(isActive && matchesWoreda ? data : null);
      }
      
      if (mounted) setLoading(false);
    }

    loadProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setProfile(null);
      } else if (event === 'SIGNED_IN') {
        loadProfile();
      }
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [woredaSlug]);

  const isSuperAdmin = profile?.role === 'super_admin';
  
  const hasPermission = (permission: string) => {
    if (isSuperAdmin) return true;
    return profile?.permissions.includes(permission) ?? false;
  };

  return (
    <AdminContext.Provider value={{ profile, loading, isSuperAdmin, hasPermission }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
