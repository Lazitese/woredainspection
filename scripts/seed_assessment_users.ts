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

// Self Assessment Questions Definition
const SELF_QUESTIONS = [
  { id: "1.1", weight: 1.0 }, { id: "1.2", weight: 1.0 }, { id: "1.3", weight: 0.5 }, { id: "1.4", weight: 1.0 }, { id: "1.5", weight: 1.0 },
  { id: "2.1", weight: 0.5 }, { id: "2.2", weight: 0.5 }, { id: "2.3", weight: 0.5 }, { id: "2.4", weight: 0.5 }, { id: "2.5", weight: 0.5 }, { id: "2.6", weight: 0.5 }, { id: "2.7", weight: 0.5 }, { id: "2.8", weight: 0.5 },
  { id: "3.1", weight: 0.25 }, { id: "3.2", weight: 0.25 }, { id: "3.3", weight: 0.25 }, { id: "3.4", weight: 0.25 }, { id: "3.5", weight: 0.25 }, { id: "3.6", weight: 0.25 }, { id: "3.7", weight: 0.25 }, { id: "3.8", weight: 0.25 }, { id: "3.9", weight: 0.25 }, { id: "3.10", weight: 0.25 }, { id: "3.11", weight: 0.5 }, { id: "3.12", weight: 0.5 }, { id: "3.13", weight: 0.5 },
  { id: "4.1", weight: 0.25 }, { id: "4.2", weight: 0.25 }, { id: "4.3", weight: 0.5 }, { id: "4.4", weight: 1.0 }, { id: "4.5", weight: 0.5 }, { id: "4.6", weight: 0.5 }, { id: "4.7", weight: 0.5 }
];

const EVAL_QUESTIONS = [
  { id: "1.1", weight: 1.0 }, { id: "1.2", weight: 1.0 }, { id: "1.3", weight: 0.5 }, { id: "1.4", weight: 1.0 }, { id: "1.5", weight: 1.0 },
  { id: "2.1", weight: 0.5 }, { id: "2.2", weight: 0.5 }, { id: "2.3", weight: 0.5 }, { id: "2.4", weight: 0.5 }, { id: "2.5", weight: 0.5 }, { id: "2.6", weight: 0.5 }, { id: "2.7", weight: 0.5 }, { id: "2.8", weight: 0.5 },
  { id: "3.1", weight: 0.25 }, { id: "3.2", weight: 0.25 }, { id: "3.3", weight: 0.25 }, { id: "3.4", weight: 0.25 }, { id: "3.5", weight: 0.25 }, { id: "3.6", weight: 0.25 }, { id: "3.7", weight: 0.25 }, { id: "3.8", weight: 0.25 }, { id: "3.9", weight: 0.25 }, { id: "3.10", weight: 0.25 }, { id: "3.11", weight: 0.5 }, { id: "3.12", weight: 0.5 }, { id: "3.13", weight: 0.5 },
  { id: "4.1", weight: 0.25 }, { id: "4.2", weight: 0.25 }, { id: "4.3", weight: 0.5 }, { id: "4.4", weight: 1.0 }, { id: "4.5", weight: 0.5 }, { id: "4.6", weight: 0.5 }, { id: "4.7", weight: 0.5 }
];

function generateSelfResponses(baseScore: number) {
  const responses: Record<string, number> = {};
  let totalRawScore = 0;
  SELF_QUESTIONS.forEach(q => {
    const val = Math.min(5, Math.max(3, baseScore + (Math.random() > 0.5 ? 0 : -1)));
    responses[q.id] = val;
    totalRawScore += q.weight * val;
  });
  const score_10 = parseFloat((totalRawScore / 10).toFixed(2));
  return { responses, score_10 };
}

function generateEvalResponses(baseScore: number) {
  const responses: Record<string, number> = {};
  let totalRawScore = 0;
  EVAL_QUESTIONS.forEach(q => {
    const val = Math.min(5, Math.max(3, baseScore + (Math.random() > 0.5 ? 0 : -1)));
    responses[q.id] = val;
    totalRawScore += q.weight * val;
  });
  const score_20 = parseFloat((totalRawScore / 5).toFixed(2));
  return { responses, score_20 };
}

interface NewAssessmentUser {
  name: string;
  phone: string; // E.164
  localPhone: string;
  authEmail: string;
  officialEmail: string;
  password: string;
  role: 'regular' | 'evaluator' | 'approver';
  roleTitle: string;
  region?: string;
  institution?: string;
  autoSubmitSelf?: boolean;
}

const NEW_USERS: NewAssessmentUser[] = [
  // --- Dedicated 10% Self Assessment Users ---
  {
    name: 'የ10% የራስ ምዘና ተጠቃሚ 1 (Self Assessment User 1)',
    phone: '+251911000071',
    localPhone: '0911000071',
    authEmail: '251911000071@federal.local',
    officialEmail: 'self1@akakikality.gov.et',
    password: 'Assessment10@2026!',
    role: 'regular',
    roleTitle: 'የራስ ምዘና ተመዛኝ (Self Assessment)',
    region: 'የአቃቂ ቃሊቲ ክ/ከተማ',
    institution: 'የኢንስፔክሽንና የሥነ-ምግባር ኮሚሽን',
    autoSubmitSelf: true
  },
  {
    name: 'የ10% የራስ ምዘና ተጠቃሚ 2 (Self Assessment User 2)',
    phone: '+251911000072',
    localPhone: '0911000072',
    authEmail: '251911000072@federal.local',
    officialEmail: 'self2@akakikality.gov.et',
    password: 'Assessment10@2026!',
    role: 'regular',
    roleTitle: 'የራስ ምዘና ተመዛኝ (Self Assessment)',
    region: 'የአቃቂ ቃሊቲ ክ/ከተማ',
    institution: 'የኢንስፔክሽንና የሥነ-ምግባር ኮሚሽን',
    autoSubmitSelf: false // Left open for manual submission
  },

  // --- Dedicated Evaluator Users (20% Peer Evaluators) ---
  {
    name: 'የምዘና መዛኝ 1 (Evaluator 1)',
    phone: '+251911000081',
    localPhone: '0911000081',
    authEmail: '251911000081@federal.local',
    officialEmail: 'evaluator1@akakikality.gov.et',
    password: 'Evaluator01@2026!',
    role: 'evaluator',
    roleTitle: 'የቡድን አባላት መዛኝ (Evaluator)',
    region: 'የአቃቂ ቃሊቲ ክ/ከተማ',
    institution: 'የኢንስፔክሽንና የሥነ-ምግባር ኮሚሽን',
    autoSubmitSelf: true
  },
  {
    name: 'የምዘና መዛኝ 2 (Evaluator 2)',
    phone: '+251911000082',
    localPhone: '0911000082',
    authEmail: '251911000082@federal.local',
    officialEmail: 'evaluator2@akakikality.gov.et',
    password: 'Evaluator02@2026!',
    role: 'evaluator',
    roleTitle: 'የቡድን አባላት መዛኝ (Evaluator)',
    region: 'የአቃቂ ቃሊቲ ክ/ከተማ',
    institution: 'የኢንስፔክሽንና የሥነ-ምግባር ኮሚሽን',
    autoSubmitSelf: true
  },
  {
    name: 'የምዘና መዛኝ 3 (Evaluator 3)',
    phone: '+251911000083',
    localPhone: '0911000083',
    authEmail: '251911000083@federal.local',
    officialEmail: 'evaluator3@akakikality.gov.et',
    password: 'Evaluator03@2026!',
    role: 'evaluator',
    roleTitle: 'የቡድን አባላት መዛኝ (Evaluator)',
    region: 'የአቃቂ ቃሊቲ ክ/ከተማ',
    institution: 'የኢንስፔክሽንና የሥነ-ምግባር ኮሚሽን',
    autoSubmitSelf: false // Left open
  },

  // --- Dedicated Approver Users (70% & Final Score Approvers) ---
  {
    name: 'የምዘና አጽዳቂ 1 (Approver 1)',
    phone: '+251911000085',
    localPhone: '0911000085',
    authEmail: '251911000085@federal.local',
    officialEmail: 'approver1@akakikality.gov.et',
    password: 'Approver01@2026!',
    role: 'approver',
    roleTitle: 'የምዘና ውጤት አጽዳቂ (Approver)',
    region: 'የአቃቂ ቃሊቲ ክ/ከተማ',
    institution: 'የኢንስፔክሽንና የሥነ-ምግባር ኮሚሽን',
    autoSubmitSelf: true
  },
  {
    name: 'ዋና የምዘና አጽዳቂ (Chief Approver)',
    phone: '+251911000086',
    localPhone: '0911000086',
    authEmail: '251911000086@federal.local',
    officialEmail: 'approver2@akakikality.gov.et',
    password: 'Approver02@2026!',
    role: 'approver',
    roleTitle: 'ዋና የምዘና ውጤት አጽዳቂ (Chief Approver)',
    region: 'የአቃቂ ቃሊቲ ክ/ከተማ',
    institution: 'የኢንስፔክሽንና የሥነ-ምግባር ኮሚሽን',
    autoSubmitSelf: true
  }
];

async function main() {
  console.log('=== SEEDING ASSESSMENT USERS (10%, EVALUATORS, APPROVERS) ===\n');

  // 1. Fetch active assessment period
  let periodId = 'd50e2573-adb6-4a88-94a6-0496901d60a7';
  const { data: periodData, error: periodErr } = await supabaseAdmin
    .from('assessment_periods')
    .select('*')
    .eq('id', periodId)
    .maybeSingle();

  if (!periodData) {
    console.log('Active period not found by fixed ID, fetching first active period...');
    const { data: anyActive } = await supabaseAdmin
      .from('assessment_periods')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (anyActive) {
      periodId = anyActive.id;
      console.log(`Using active period: ${anyActive.name} (${periodId})`);
    } else {
      console.error('No active assessment period found!');
      process.exit(1);
    }
  } else {
    console.log(`Using active period: ${periodData.name} (${periodId})`);
  }

  // 2. Enroll all existing 17 Woreda representatives as regular (10% self-assessment) members
  console.log('\n--- Step 1: Enrolling all 17 Woreda Representatives as 10% Assessment Members ---');
  const { data: repUsers } = await supabaseAdmin
    .from('users')
    .select('id, full_name, phone_number')
    .like('phone_number', '+2519110000%');

  const enrolledWoredas: string[] = [];
  for (const u of (repUsers || [])) {
    // skip super admin (0911000000) and complaints leader (0911000099)
    if (u.phone_number === '+251911000000' || u.phone_number === '+251911000099') continue;

    const { error: mErr } = await supabaseAdmin
      .from('period_members')
      .upsert({
        period_id: periodId,
        user_id: u.id,
        role: 'regular'
      }, { onConflict: 'period_id, user_id' });

    if (mErr) {
      console.warn(`  Failed enrolling ${u.full_name}:`, mErr.message);
    } else {
      enrolledWoredas.push(u.full_name);
      console.log(`  ✓ Enrolled [10% Regular]: ${u.full_name} (${u.phone_number})`);
    }
  }

  // Also pre-fill sample 10% self assessment for Woreda 1 and Woreda 2 so Evaluator/Approver sees data
  const woreda1 = repUsers?.find(u => u.phone_number === '+251911000001');
  if (woreda1) {
    const { responses, score_10 } = generateSelfResponses(4.5);
    await supabaseAdmin.from('self_assessments').upsert({
      period_id: periodId,
      user_id: woreda1.id,
      responses,
      score_10,
      is_locked: true
    }, { onConflict: 'period_id, user_id' });
    console.log(`  ✓ Pre-filled sample 10% Self Assessment for Woreda 1: ${score_10}/10`);
  }

  const woreda2 = repUsers?.find(u => u.phone_number === '+251911000002');
  if (woreda2) {
    const { responses, score_10 } = generateSelfResponses(4.2);
    await supabaseAdmin.from('self_assessments').upsert({
      period_id: periodId,
      user_id: woreda2.id,
      responses,
      score_10,
      is_locked: true
    }, { onConflict: 'period_id, user_id' });
    console.log(`  ✓ Pre-filled sample 10% Self Assessment for Woreda 2: ${score_10}/10`);
  }

  // 3. Create/Upsert Dedicated Assessment Users (10% Self, Evaluators, Approvers)
  console.log('\n--- Step 2: Creating Dedicated Assessment Users ---');
  const userRecordMap: Record<string, string> = {};

  for (const nu of NEW_USERS) {
    let userId: string | null = null;

    // Check if user exists in public.users
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('phone_number', nu.phone)
      .maybeSingle();

    if (existingUser) {
      userId = existingUser.id;
      // Update password and metadata in auth
      await supabaseAdmin.auth.admin.updateUserById(userId!, {
        password: nu.password,
        email: nu.authEmail,
        email_confirm: true,
        user_metadata: {
          full_name: nu.name,
          phone: nu.phone,
          force_password_change: false,
          requires_password_change: false
        }
      });
      console.log(`  ✓ Updated existing Auth user: ${nu.name} (${nu.localPhone})`);
    } else {
      // Create brand new auth user
      const { data: authRes, error: authErr } = await supabaseAdmin.auth.admin.createUser({
        email: nu.authEmail,
        password: nu.password,
        email_confirm: true,
        user_metadata: {
          full_name: nu.name,
          phone: nu.phone,
          force_password_change: false,
          requires_password_change: false
        }
      });

      if (authErr) {
        if (authErr.message.includes('already')) {
          // fetch auth user by email via generateLink
          const { data: linkData } = await supabaseAdmin.auth.admin.generateLink({
            type: 'magiclink',
            email: nu.authEmail
          });
          if (linkData?.user) {
            userId = linkData.user.id;
            await supabaseAdmin.auth.admin.updateUserById(userId, {
              password: nu.password,
              user_metadata: {
                full_name: nu.name,
                phone: nu.phone,
                force_password_change: false,
                requires_password_change: false
              }
            });
          }
        } else {
          console.error(`  ✗ Error creating auth for ${nu.name}:`, authErr.message);
          continue;
        }
      } else {
        userId = authRes.user.id;
      }
      console.log(`  ✓ Created new Auth user: ${nu.name} (${nu.localPhone})`);
    }

    if (!userId) continue;
    userRecordMap[nu.phone] = userId;

    // Upsert public.users
    await supabaseAdmin
      .from('users')
      .upsert({
        id: userId,
        phone_number: nu.phone,
        full_name: nu.name
      });

    // Upsert user_profiles
    await supabaseAdmin
      .from('user_profiles')
      .upsert({
        user_id: userId,
        gender: 'ወንድ',
        age: 36,
        education_level: 'ሁለተኛ ዲግሪ (Masters)',
        professional_field: 'ማኔጅመንት እና አመራር (Management & Leadership)',
        experience_professional: 10,
        experience_leadership: 6,
        institution: nu.institution || 'የኢንስፔክሽንና የሥነ-ምግባር ኮሚሽን',
        current_responsibility_gov: nu.roleTitle,
        current_responsibility_com: nu.roleTitle,
        system_role: 'assessment',
        region: nu.region || 'የአቃቂ ቃሊቲ ክ/ከተማ'
      });

    // Enroll in period_members
    await supabaseAdmin
      .from('period_members')
      .upsert({
        period_id: periodId,
        user_id: userId,
        role: nu.role
      }, { onConflict: 'period_id, user_id' });

    console.log(`  ✓ Enrolled in period [${nu.role.toUpperCase()}]: ${nu.name}`);

    // Pre-fill 10% self assessment if enabled
    if (nu.autoSubmitSelf) {
      const { responses, score_10 } = generateSelfResponses(4.5);
      await supabaseAdmin.from('self_assessments').upsert({
        period_id: periodId,
        user_id: userId,
        responses,
        score_10,
        is_locked: false // Unlocked so user can edit or inspect
      }, { onConflict: 'period_id, user_id' });
      console.log(`    → Pre-filled 10% Self Assessment: ${score_10}/10`);
    }
  }

  // 4. Pre-fill sample Peer Evaluations (20%) from Evaluator 1 for Woreda 1
  console.log('\n--- Step 3: Pre-filling Sample 20% Evaluation from Evaluator 1 ---');
  const eval1Id = userRecordMap['+251911000081'];
  if (eval1Id && woreda1) {
    const { responses, score_20 } = generateEvalResponses(4.3);
    await supabaseAdmin.from('evaluations').upsert({
      period_id: periodId,
      evaluator_id: eval1Id,
      target_user_id: woreda1.id,
      responses,
      score_20,
      is_locked: true
    }, { onConflict: 'period_id, evaluator_id, target_user_id' });
    console.log(`  ✓ Evaluator 1 evaluated Woreda 1: ${score_20}/20`);
  }

  // 5. Verify logins for all created accounts
  console.log('\n--- Step 4: Verifying Login for Assessment Accounts ---');
  for (const nu of NEW_USERS) {
    const { data: loginData, error: loginErr } = await supabaseAnon.auth.signInWithPassword({
      email: nu.authEmail,
      password: nu.password
    });

    if (loginErr) {
      console.error(`  ✗ Login verification FAILED for ${nu.name}:`, loginErr.message);
    } else {
      console.log(`  ✓ Login verification SUCCESS: [${nu.role}] ${nu.localPhone} / ${nu.officialEmail}`);
    }
  }

  // Also verify Woreda 1 assessment login
  const { error: w1Err } = await supabaseAnon.auth.signInWithPassword({
    email: '251911000001@federal.local',
    password: 'Woreda01@2026!'
  });
  if (w1Err) {
    console.error('  ✗ Login verification failed for Woreda 1:', w1Err.message);
  } else {
    console.log('  ✓ Login verification SUCCESS for Woreda 1 (0911000001)');
  }

  console.log('\n=== SEEDING COMPLETED SUCCESSFULLY! ===');
}

main().catch(console.error);
