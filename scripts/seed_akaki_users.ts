import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase configuration in .env.local");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

export interface SeedUser {
  type: 'admin' | 'committee_leader' | 'representative';
  name: string;
  phone: string; // E.164 format
  localPhone: string; // 09...
  authEmail: string; // The email registered in auth.users
  displayEmail: string; // Official email
  password: string;
  region?: string;
  roleDescription: string;
}

export const SEED_USERS: SeedUser[] = [
  // 1. Central Super Admin
  {
    type: 'admin',
    name: 'የአቃቂ ቃሊቲ ክ/ከተማ ዋና አስተዳዳሪ (Super Admin)',
    phone: '+251911000000',
    localPhone: '0911000000',
    authEmail: 'admin@akakikality.gov.et',
    displayEmail: 'admin@akakikality.gov.et',
    password: 'Akaki@Admin2026!',
    roleDescription: 'ዋና አስተዳዳሪ (Super Admin) - ሙሉ ቁጥጥርና አስተዳደር',
  },
  // 2. Complaints & Ethics Committee Leader
  {
    type: 'committee_leader',
    name: 'የኮሚሽን ጽ/ቤት ሃላፊ (Complaints Committee Leader)',
    phone: '+251911000099',
    localPhone: '0911000099',
    authEmail: 'complaints.leader@akakikality.gov.et',
    displayEmail: 'complaints.leader@akakikality.gov.et',
    password: 'Akaki@Complaints2026!',
    roleDescription: 'የኮሚሽን ጽ/ቤት ሃላፊ - የአቤቱታና የሥነ-ምግባር ኮሚቴ መሪ',
  },
  // 3. 17 Woreda Representatives
  {
    type: 'representative',
    name: 'የወረዳ 1 ተወካይ',
    phone: '+251911000001',
    localPhone: '0911000001',
    authEmail: '251911000001@federal.local',
    displayEmail: 'woreda1@akakikality.gov.et',
    password: 'Woreda01@2026!',
    region: 'ወረዳ 1',
    roleDescription: 'የወረዳ 1 የኢንስፔክሽን ተወካይ (Representative)',
  },
  {
    type: 'representative',
    name: 'የወረዳ 2 ተወካይ',
    phone: '+251911000002',
    localPhone: '0911000002',
    authEmail: '251911000002@federal.local',
    displayEmail: 'woreda2@akakikality.gov.et',
    password: 'Woreda02@2026!',
    region: 'ወረዳ 2',
    roleDescription: 'የወረዳ 2 የኢንስፔክሽን ተወካይ (Representative)',
  },
  {
    type: 'representative',
    name: 'የወረዳ 3 ተወካይ',
    phone: '+251911000003',
    localPhone: '0911000003',
    authEmail: '251911000003@federal.local',
    displayEmail: 'woreda3@akakikality.gov.et',
    password: 'Woreda03@2026!',
    region: 'ወረዳ 3',
    roleDescription: 'የወረዳ 3 የኢንስፔክሽን ተወካይ (Representative)',
  },
  {
    type: 'representative',
    name: 'የወረዳ 4 ተወካይ',
    phone: '+251911000004',
    localPhone: '0911000004',
    authEmail: '251911000004@federal.local',
    displayEmail: 'woreda4@akakikality.gov.et',
    password: 'Woreda04@2026!',
    region: 'ወረዳ 4',
    roleDescription: 'የወረዳ 4 የኢንስፔክሽን ተወካይ (Representative)',
  },
  {
    type: 'representative',
    name: 'የወረዳ 5 ተወካይ',
    phone: '+251911000005',
    localPhone: '0911000005',
    authEmail: '251911000005@federal.local',
    displayEmail: 'woreda5@akakikality.gov.et',
    password: 'Woreda05@2026!',
    region: 'ወረዳ 5',
    roleDescription: 'የወረዳ 5 የኢንስፔክሽን ተወካይ (Representative)',
  },
  {
    type: 'representative',
    name: 'የወረዳ 6 ተወካይ',
    phone: '+251911000006',
    localPhone: '0911000006',
    authEmail: '251911000006@federal.local',
    displayEmail: 'woreda6@akakikality.gov.et',
    password: 'Woreda06@2026!',
    region: 'ወረዳ 6',
    roleDescription: 'የወረዳ 6 የኢንስፔክሽን ተወካይ (Representative)',
  },
  {
    type: 'representative',
    name: 'የወረዳ 7 ተወካይ',
    phone: '+251911000007',
    localPhone: '0911000007',
    authEmail: '251911000007@federal.local',
    displayEmail: 'woreda7@akakikality.gov.et',
    password: 'Woreda07@2026!',
    region: 'ወረዳ 7',
    roleDescription: 'የወረዳ 7 የኢንስፔክሽን ተወካይ (Representative)',
  },
  {
    type: 'representative',
    name: 'የወረዳ 8 ተወካይ',
    phone: '+251911000008',
    localPhone: '0911000008',
    authEmail: '251911000008@federal.local',
    displayEmail: 'woreda8@akakikality.gov.et',
    password: 'Woreda08@2026!',
    region: 'ወረዳ 8',
    roleDescription: 'የወረዳ 8 የኢንስፔክሽን ተወካይ (Representative)',
  },
  {
    type: 'representative',
    name: 'የወረዳ 9 ተወካይ',
    phone: '+251911000009',
    localPhone: '0911000009',
    authEmail: '251911000009@federal.local',
    displayEmail: 'woreda9@akakikality.gov.et',
    password: 'Woreda09@2026!',
    region: 'ወረዳ 9',
    roleDescription: 'የወረዳ 9 የኢንስፔክሽን ተወካይ (Representative)',
  },
  {
    type: 'representative',
    name: 'የወረዳ 10 ተወካይ',
    phone: '+251911000010',
    localPhone: '0911000010',
    authEmail: '251911000010@federal.local',
    displayEmail: 'woreda10@akakikality.gov.et',
    password: 'Woreda10@2026!',
    region: 'ወረዳ 10',
    roleDescription: 'የወረዳ 10 የኢንስፔክሽን ተወካይ (Representative)',
  },
  {
    type: 'representative',
    name: 'የወረዳ 12 ተወካይ',
    phone: '+251911000012',
    localPhone: '0911000012',
    authEmail: '251911000012@federal.local',
    displayEmail: 'woreda12@akakikality.gov.et',
    password: 'Woreda12@2026!',
    region: 'ወረዳ 12',
    roleDescription: 'የወረዳ 12 የኢንስፔክሽን ተወካይ (Representative)',
  },
  {
    type: 'representative',
    name: 'የወረዳ 13 ተወካይ',
    phone: '+251911000013',
    localPhone: '0911000013',
    authEmail: '251911000013@federal.local',
    displayEmail: 'woreda13@akakikality.gov.et',
    password: 'Woreda13@2026!',
    region: 'ወረዳ 13',
    roleDescription: 'የወረዳ 13 የኢንስፔክሽን ተወካይ (Representative)',
  },
  {
    type: 'representative',
    name: 'የልዩ ወረዳ 1 ተወካይ',
    phone: '+251911000021',
    localPhone: '0911000021',
    authEmail: '251911000021@federal.local',
    displayEmail: 'specialworeda1@akakikality.gov.et',
    password: 'SpecialWoreda01@2026!',
    region: 'ልዩ ወረዳ 1',
    roleDescription: 'የልዩ ወረዳ 1 የኢንስፔክሽን ተወካይ (Representative)',
  },
  {
    type: 'representative',
    name: 'የልዩ ወረዳ 2 ተወካይ',
    phone: '+251911000022',
    localPhone: '0911000022',
    authEmail: '251911000022@federal.local',
    displayEmail: 'specialworeda2@akakikality.gov.et',
    password: 'SpecialWoreda02@2026!',
    region: 'ልዩ ወረዳ 2',
    roleDescription: 'የልዩ ወረዳ 2 የኢንስፔክሽን ተወካይ (Representative)',
  },
  {
    type: 'representative',
    name: 'የልዩ ወረዳ 3 ተወካይ',
    phone: '+251911000023',
    localPhone: '0911000023',
    authEmail: '251911000023@federal.local',
    displayEmail: 'specialworeda3@akakikality.gov.et',
    password: 'SpecialWoreda03@2026!',
    region: 'ልዩ ወረዳ 3',
    roleDescription: 'የልዩ ወረዳ 3 የኢንስፔክሽን ተወካይ (Representative)',
  },
  {
    type: 'representative',
    name: 'የልዩ ወረዳ 4 ተወካይ',
    phone: '+251911000024',
    localPhone: '0911000024',
    authEmail: '251911000024@federal.local',
    displayEmail: 'specialworeda4@akakikality.gov.et',
    password: 'SpecialWoreda04@2026!',
    region: 'ልዩ ወረዳ 4',
    roleDescription: 'የልዩ ወረዳ 4 የኢንስፔክሽን ተወካይ (Representative)',
  },
  {
    type: 'representative',
    name: 'የልዩ ወረዳ 5 ተወካይ',
    phone: '+251911000025',
    localPhone: '0911000025',
    authEmail: '251911000025@federal.local',
    displayEmail: 'specialworeda5@akakikality.gov.et',
    password: 'SpecialWoreda05@2026!',
    region: 'ልዩ ወረዳ 5',
    roleDescription: 'የልዩ ወረዳ 5 የኢንስፔክሽን ተወካይ (Representative)',
  },
];

async function seedAllUsers() {
  console.log("==================================================================");
  console.log("  SEEDING USERS FOR AKAKI KALITY SUB-CITY PROSPERITY COMMISSION   ");
  console.log("==================================================================");
  console.log(`Target Supabase URL: ${supabaseUrl}\n`);

  let successCount = 0;
  let failCount = 0;

  for (const user of SEED_USERS) {
    console.log(`\n▶ Processing [${user.type.toUpperCase()}] ${user.name} (${user.displayEmail} / ${user.localPhone})...`);

    try {
      let userId: string | null = null;

      // Check if user already exists in auth.users by email
      const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
      const existingAuth = listData?.users?.find((u: any) => 
        u.email?.toLowerCase() === user.authEmail.toLowerCase() ||
        u.email?.toLowerCase() === user.displayEmail.toLowerCase() ||
        u.phone === user.phone
      );

      if (existingAuth) {
        userId = existingAuth.id;
        console.log(`  Existing auth user found (ID: ${userId}). Updating password & metadata...`);
        const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(userId, {
          email: user.authEmail,
          password: user.password,
          email_confirm: true,
          user_metadata: {
            full_name: user.name,
            phone: user.phone,
            role: user.type,
            system_role: user.type,
            region: user.region || null,
            force_password_change: false,
            requires_password_change: false,
          }
        });
        if (updateErr) {
          throw new Error(`Failed to update auth user: ${updateErr.message}`);
        }
      } else {
        console.log(`  Creating new auth user (${user.authEmail})...`);
        const { data: createData, error: createErr } = await supabaseAdmin.auth.admin.createUser({
          email: user.authEmail,
          password: user.password,
          email_confirm: true,
          user_metadata: {
            full_name: user.name,
            phone: user.phone,
            role: user.type,
            system_role: user.type,
            region: user.region || null,
            force_password_change: false,
            requires_password_change: false,
          }
        });

        if (createErr) {
          throw new Error(`Failed to create auth user: ${createErr.message}`);
        }
        userId = createData.user.id;
      }

      // Upsert into public.users
      const { error: userTableErr } = await supabaseAdmin
        .from('users')
        .upsert({
          id: userId,
          phone_number: user.phone,
          full_name: user.name,
        }, { onConflict: 'id' });

      if (userTableErr) {
        throw new Error(`Failed to upsert public.users: ${userTableErr.message}`);
      }

      // Handle role-specific tables
      if (user.type === 'admin') {
        const { error: adminErr } = await supabaseAdmin
          .from('admin_profiles')
          .upsert({
            id: userId,
            email: user.displayEmail,
            role: 'super_admin',
            first_name: 'አቃቂ ቃሊቲ',
            last_name: 'ዋና አስተዳዳሪ',
            phone: user.phone,
            access_level: 'all',
            status: 'Active',
            requires_password_change: false,
            permissions: ['all'],
            groups: ['HQ'],
            modules: ['dashboard', 'reports', 'analytics', 'complaints', 'admins', 'sletena', 'settings'],
          }, { onConflict: 'id' });

        if (adminErr) {
          throw new Error(`Failed to upsert admin_profiles: ${adminErr.message}`);
        }
        console.log(`  ✓ Admin profile upserted with full super_admin permissions.`);
      } else if (user.type === 'committee_leader') {
        const { error: leaderErr } = await supabaseAdmin
          .from('admin_profiles')
          .upsert({
            id: userId,
            email: user.displayEmail,
            role: 'committee_leader',
            first_name: 'የኮሚሽን ጽ/ቤት',
            last_name: 'ሃላፊ',
            phone: user.phone,
            access_level: 'specific',
            status: 'Active',
            requires_password_change: false,
            permissions: ['complaints_read', 'complaints_write', 'complaints_decision'],
            groups: ['Committee'],
            modules: ['complaints', 'committee-leader'],
          }, { onConflict: 'id' });

        if (leaderErr) {
          throw new Error(`Failed to upsert committee leader profile: ${leaderErr.message}`);
        }
        console.log(`  ✓ Committee Leader profile upserted with committee_leader permissions.`);
      } else if (user.type === 'representative') {
        // Upsert into user_profiles
        const { error: profErr } = await supabaseAdmin
          .from('user_profiles')
          .upsert({
            user_id: userId,
            system_role: 'representative',
            region: user.region,
          }, { onConflict: 'user_id' });

        if (profErr) {
          throw new Error(`Failed to upsert user_profiles: ${profErr.message}`);
        }

        // Upsert into reporting_profiles
        const { error: repProfErr } = await supabaseAdmin
          .from('reporting_profiles')
          .upsert({
            user_id: userId,
            hierarchy_level: 'woreda',
            region_name: user.region,
            subcity_name: 'አቃቂ ቃሊቲ',
          }, { onConflict: 'user_id' });

        if (repProfErr) {
          console.warn(`  Notice: reporting_profiles upsert note: ${repProfErr.message}`);
        }
        console.log(`  ✓ Representative profile upserted for region: "${user.region}".`);
      }

      // Verify sign in with Supabase Anon Client
      const { error: signInErr } = await supabaseAnon.auth.signInWithPassword({
        email: user.authEmail,
        password: user.password,
      });

      if (signInErr) {
        console.warn(`  ⚠️ Sign in verification warning for ${user.authEmail}: ${signInErr.message}`);
      } else {
        console.log(`  ✅ Authentication verified successfully via Anon API!`);
      }

      successCount++;
    } catch (err: any) {
      console.error(`  ❌ Error processing ${user.name}:`, err.message);
      failCount++;
    }
  }

  console.log("\n==================================================================");
  console.log(`SEEDING SUMMARY: ${successCount} succeeded, ${failCount} failed.`);
  console.log("==================================================================\n");
}

seedAllUsers().catch(console.error);
