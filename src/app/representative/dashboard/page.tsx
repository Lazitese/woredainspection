import { FormsRepView } from "@/components/dashboard/forms/FormsRepView";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { RepLogoutButton } from "@/components/layout/rep-logout-button";
import { sortFormSchemas } from "@/utils/schemaSort";
import { getServerActiveWoreda } from "@/utils/supabase/server-woreda";

export default async function RepDashboardPage() {
  const supabase = await createClient();
  const activeWoreda = await getServerActiveWoreda();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) {
    redirect('/representative/login');
  }

  // Strictly enforce representative role within the active woreda tenant
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('system_role, region, user_id, woreda_id')
    .eq('user_id', userData.user.id)
    .eq('woreda_id', activeWoreda)
    .maybeSingle();

  if (!profile || profile.system_role !== 'representative' || profile.woreda_id !== activeWoreda) {
    redirect('/representative/login?error=access_denied');
  }

  // If force password reset is required, redirect to the reset page
  if (userData.user.user_metadata?.requires_password_change || userData.user.user_metadata?.force_password_change) {
    redirect('/representative/change-password');
  }

  // Rep data fetching (fetch by region instead of user_id so new reps see history)
  const { data: currentReports } = await supabase
    .from('reports')
    .select('*')
    .eq('region', profile.region);

  // Fetch dynamic schemas
  const { data: schemas } = await supabase
    .from('form_schemas')
    .select('*');
    
  // Sort them sequentially 1 to 25
  const sortedSchemas = sortFormSchemas(schemas || []);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] p-4 sm:p-8">
      <div className="max-w-4xl mx-auto mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex bg-surface-primary p-1 rounded-xl shadow-sm border border-border-light w-fit">
          <Link
            href="/representative/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all bg-brand-blue text-white shadow-md"
          >
            አዲስ ሪፖርት (Current Report)
          </Link>
          <Link
            href="/representative/dashboard/history"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all text-text-secondary hover:text-brand-blue hover:bg-brand-blue/5"
          >
            የሪፖርት ታሪክ (History)
          </Link>
        </div>
        <RepLogoutButton className="text-sm font-medium text-text-secondary hover:text-brand-blue px-4 py-2 rounded-lg hover:bg-surface-secondary transition-all w-auto">
          ዘግተው ይውጡ (Sign Out)
        </RepLogoutButton>
      </div>
      <FormsRepView userProfile={profile} initialReports={currentReports || []} initialSchemas={sortedSchemas} />
    </div>
  );
}
