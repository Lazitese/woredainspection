import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { FormsRepView } from "@/components/dashboard/forms/FormsRepView";
import { createClient } from "@/utils/supabase/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { redirect } from "next/navigation";
import { verifyAdminUser } from "@/lib/adminAuth";
import { sortFormSchemas } from "@/utils/schemaSort";
import { getWoredaConfig } from "@/config/woredas";

export const dynamic = 'force-dynamic';

export default async function FormsPage({
  searchParams,
}: {
  searchParams?: Promise<{ woreda?: string; year?: string; period?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const isAdminAuthorized = await verifyAdminUser(user.id, user.email);
  if (!isAdminAuthorized) {
    redirect('/auth/login?error=unauthorized');
  }

  const resolvedParams = searchParams ? await searchParams : {};
  const woredaSlug = resolvedParams.woreda || 'woreda1';
  const woredaConfig = getWoredaConfig(woredaSlug);

  // Fetch admin profile to get woreda or fallback to active woreda from URL
  const { data: adminProfile } = await supabaseAdmin
    .from('user_profiles')
    .select('region, system_role')
    .eq('user_id', user.id)
    .maybeSingle();

  const userRegion = adminProfile?.region || woredaConfig.name;

  const userProfile = {
    user_id: user.id,
    system_role: 'representative',
    region: userRegion,
  };

  const { data: currentReports } = await supabaseAdmin
    .from('reports')
    .select('*')
    .eq('region', userRegion)
    .order('created_at', { ascending: false });

  const { data: fetchedSchemas } = await supabaseAdmin
    .from('form_schemas')
    .select('*');

  const sortedSchemas = sortFormSchemas(fetchedSchemas || []);

  return (
    <DashboardLayout>
      <div className="py-4 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border/50 gap-2">
          <div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              የወረዳ ኢንስፔክሽን ሪፖርት ማቅረቢያ
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              ለአቃቂ ቃሊቲ ክፍለ ከተማ የሚላክ ይፋዊ የሩብ ዓመት እና የበጀት ዓመት ኢንስፔክሽን ሪፖርት (ቅጽ 01 - 25)
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold w-fit">
            <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
            <span>ሪፖርት አቅራቢ: {userRegion}</span>
          </div>
        </div>
        <FormsRepView
          userProfile={userProfile}
          initialReports={currentReports || []}
          initialSchemas={sortedSchemas}
          defaultYear={resolvedParams.year ? Number(resolvedParams.year) : undefined}
          defaultPeriod={resolvedParams.period as any}
        />
      </div>
    </DashboardLayout>
  );
}
