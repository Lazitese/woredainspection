import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getServerActiveWoreda } from "@/utils/supabase/server-woreda";

export async function verifyAdminUser(userId: string, email?: string): Promise<boolean> {
  try {
    const activeWoreda = await getServerActiveWoreda();
    const { data: profile } = await supabaseAdmin
      .from('admin_profiles')
      .select('role, status, woreda_id')
      .eq('id', userId)
      .maybeSingle();

    if (!profile) return false;

    if (profile.woreda_id && profile.woreda_id !== activeWoreda && profile.woreda_id !== 'all') {
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
