import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function main() {
  const email = 'alazartesema1@gmail.com';
  const phone = '+251938560597';

  console.log(`Setting up test admin account in Woredas DB (${supabaseUrl})...`);

  // Check if auth user exists
  const { data: { users }, error: listErr } = await supabase.auth.admin.listUsers();
  let user = users?.find(u => u.email === email);

  if (!user) {
    console.log('Creating auth user for', email);
    const { data: created, error: createErr } = await supabase.auth.admin.createUser({
      email,
      password: 'TestPassword2026!',
      email_confirm: true,
      user_metadata: { first_name: 'Alazar', last_name: 'Tesema' }
    });
    if (createErr) throw createErr;
    user = created.user;
  } else {
    console.log('Found existing auth user:', user.id);
  }

  // Upsert admin profile
  const { data: profile, error: profileErr } = await supabase
    .from('admin_profiles')
    .upsert({
      id: user.id,
      email: email,
      phone: phone,
      first_name: 'Alazar',
      last_name: 'Tesema',
      role: 'super_admin',
      access_level: 'all',
      status: 'active',
      woreda_id: 'woreda13'
    }, { onConflict: 'id' })
    .select()
    .single();

  if (profileErr) {
    console.error('Error upserting admin profile:', profileErr);
  } else {
    console.log('Admin profile successfully configured:', profile);
  }
}

main().catch(console.error);
