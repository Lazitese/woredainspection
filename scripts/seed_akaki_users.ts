import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase configuration in .env.local / .env");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

import { WOREDAS_LIST } from '../src/config/woredas';
import { normalizePhoneToE164 } from '../src/lib/phone';

export interface WoredaSuperAdminSeed {
  woredaNum: number;
  woredaId: string;
  regionName: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  localPhone: string;
  email: string;
  legacyEmail: string;
  password: string;
}

export const WOREDA_SUPER_ADMINS: WoredaSuperAdminSeed[] = WOREDAS_LIST.map((w) => {
  const num = w.number;
  const padded = num.toString().padStart(2, '0');
  const rawLeaderName = (w.leaderName || `የወረዳ ${num} ዋና አስተዳዳሪ`).trim();
  const nameParts = rawLeaderName.split(/\s+/);
  const firstName = nameParts[0] || `ወረዳ ${num}`;
  const lastName = nameParts.slice(1).join(' ') || 'ዋና አስተዳዳሪ';
  const rawPhone = (w.phone || `09110000${padded}`).trim();
  const e164Phone = normalizePhoneToE164(rawPhone);
  const localPhone = rawPhone.startsWith('0') ? rawPhone : `0${e164Phone.replace(/^\+251/, '')}`;
  const email = (w.email || `woreda${num}@akakikality.gov.et`).trim().toLowerCase().replace(/\s+/g, '');

  return {
    woredaNum: num,
    woredaId: w.slug,
    regionName: w.name,
    firstName,
    lastName,
    fullName: rawLeaderName,
    phone: e164Phone,
    localPhone,
    email,
    legacyEmail: `woreda${num}@akakikality.gov.et`,
    password: `Woreda${padded}@2026!`,
  };
});

async function seedWoredaSuperAdmins() {
  console.log("==================================================================");
  console.log("  SEEDING 12 WOREDA SUPER ADMINS (WOREDA 1 - 13, SKIPPING 12)     ");
  console.log("==================================================================");
  console.log(`Target Supabase URL: ${supabaseUrl}\n`);

  let successCount = 0;
  let failCount = 0;

  const { data: listData } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
  const existingUsers = listData?.users || [];

  for (const admin of WOREDA_SUPER_ADMINS) {
    console.log(`\n▶ Processing [${admin.woredaId.toUpperCase()}] ${admin.fullName} (${admin.email} / ${admin.localPhone})...`);

    try {
      let userId: string | null = null;

      const existingAuth = existingUsers.find((u: any) =>
        u.email?.toLowerCase() === admin.email.toLowerCase() ||
        u.email?.toLowerCase() === admin.legacyEmail.toLowerCase() ||
        (u.user_metadata?.woreda_id === admin.woredaId && u.user_metadata?.role === 'super_admin') ||
        u.phone === admin.phone
      );

      if (existingAuth) {
        userId = existingAuth.id;
        console.log(`  Existing auth user found (ID: ${userId}). Updating password & metadata...`);
        const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(userId, {
          email: admin.email,
          password: admin.password,
          email_confirm: true,
          user_metadata: {
            full_name: admin.fullName,
            phone: admin.phone,
            role: 'super_admin',
            system_role: 'super_admin',
            region: admin.regionName,
            woreda_id: admin.woredaId,
            force_password_change: false,
            requires_password_change: false,
          }
        });
        if (updateErr) throw new Error(`Failed to update auth user: ${updateErr.message}`);
      } else {
        console.log(`  Creating new auth user (${admin.email})...`);
        const { data: createData, error: createErr } = await supabaseAdmin.auth.admin.createUser({
          email: admin.email,
          password: admin.password,
          email_confirm: true,
          user_metadata: {
            full_name: admin.fullName,
            phone: admin.phone,
            role: 'super_admin',
            system_role: 'super_admin',
            region: admin.regionName,
            woreda_id: admin.woredaId,
            force_password_change: false,
            requires_password_change: false,
          }
        });
        if (createErr) throw new Error(`Failed to create auth user: ${createErr.message}`);
        userId = createData.user.id;
      }

      // 1. Upsert into public.users
      const { error: userTableErr } = await supabaseAdmin
        .from('users')
        .upsert({
          id: userId,
          phone_number: admin.phone,
          full_name: admin.fullName,
          woreda_id: admin.woredaId,
        }, { onConflict: 'id' });

      if (userTableErr) throw new Error(`Failed to upsert public.users: ${userTableErr.message}`);

      // 2. Upsert into public.admin_profiles
      const { error: adminErr } = await supabaseAdmin
        .from('admin_profiles')
        .upsert({
          id: userId,
          email: admin.email,
          role: 'super_admin',
          first_name: admin.firstName,
          last_name: admin.lastName,
          phone: admin.phone,
          access_level: 'all',
          status: 'Active',
          requires_password_change: false,
          permissions: ['all'],
          groups: ['HQ'],
          modules: ['dashboard', 'forms', 'assessment', 'sletena', 'complaints', 'documents', 'news', 'personnel', 'feedback', 'qr-access', 'admins'],
          woreda_id: admin.woredaId,
        }, { onConflict: 'id' });

      if (adminErr) throw new Error(`Failed to upsert admin_profiles: ${adminErr.message}`);

      // 3. Upsert into public.user_profiles
      const { error: profErr } = await supabaseAdmin
        .from('user_profiles')
        .upsert({
          user_id: userId,
          system_role: 'super_admin',
          region: admin.regionName,
          woreda_id: admin.woredaId,
        }, { onConflict: 'user_id' });

      if (profErr) throw new Error(`Failed to upsert user_profiles: ${profErr.message}`);

      // 4. Upsert into public.reporting_profiles
      const { error: repProfErr } = await supabaseAdmin
        .from('reporting_profiles')
        .upsert({
          user_id: userId,
          hierarchy_level: 'woreda',
          region_name: admin.regionName,
          subcity_name: 'አቃቂ ቃሊቲ',
          woreda_id: admin.woredaId,
        }, { onConflict: 'user_id' });

      if (repProfErr) {
        console.warn(`  Notice: reporting_profiles upsert note: ${repProfErr.message}`);
      }

      // 5. Verify sign in with Supabase Anon Client
      const { error: signInErr } = await supabaseAnon.auth.signInWithPassword({
        email: admin.email,
        password: admin.password,
      });

      if (signInErr) {
        throw new Error(`Sign in verification failed for ${admin.email}: ${signInErr.message}`);
      } else {
        console.log(`  ✅ Super Admin seeded & verified for ${admin.woredaId} (${admin.email} / ${admin.password})`);
      }

      successCount++;
    } catch (err: any) {
      console.error(`  ❌ Error processing ${admin.woredaId}:`, err.message);
      failCount++;
    }
  }

  console.log("\n==================================================================");
  console.log(`SEEDING SUMMARY: ${successCount} succeeded, ${failCount} failed.`);
  console.log("==================================================================\n");
}

seedWoredaSuperAdmins().catch(console.error);
