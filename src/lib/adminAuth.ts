import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getServerActiveWoreda } from "@/utils/supabase/server-woreda";
import { createClient } from "@/utils/supabase/server";

export async function verifyAdminUser(userId: string, email?: string): Promise<boolean> {
  try {
    const activeWoreda = await getServerActiveWoreda();
    const { data: profile } = await supabaseAdmin
      .from('admin_profiles')
      .select('role, status, woreda_id')
      .eq('id', userId)
      .maybeSingle();

    if (!profile) return false;

    if (profile.woreda_id !== activeWoreda) {
      return false;
    }
    
    // Accept active status (case-insensitive) or active role
    if (profile.status && profile.status.toLowerCase() !== 'active') {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Admin verification error:", error);
    return false;
  }
}

export async function requireAuthenticatedWoredaAdmin(options?: { requireSuperAdmin?: boolean }): Promise<{
  userId: string;
  activeWoreda: string;
  role: string;
}> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Unauthorized: Authentication required.');
  }

  const activeWoreda = await getServerActiveWoreda();
  const { data: profile } = await supabaseAdmin
    .from('admin_profiles')
    .select('id, role, status, access_level, modules, woreda_id')
    .eq('id', user.id)
    .eq('woreda_id', activeWoreda)
    .maybeSingle();

  if (!profile || profile.woreda_id !== activeWoreda || (profile.status && profile.status.toLowerCase() !== 'active')) {
    throw new Error(`Forbidden: Account is not an active administrator for ${activeWoreda}.`);
  }

  if (options?.requireSuperAdmin) {
    const canManageAdmins =
      profile.role === 'super_admin' ||
      profile.access_level === 'all' ||
      profile.modules?.includes('admins');
    if (!canManageAdmins) {
      throw new Error('Forbidden: Super admin or admin-management access required.');
    }
  }

  return {
    userId: user.id,
    activeWoreda,
    role: profile.role,
  };
}
