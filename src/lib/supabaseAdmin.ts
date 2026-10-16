import { createClient } from '@supabase/supabase-js';
import { createWoredaFetch } from '@/utils/supabase/woreda-fetch';
import { getServerActiveWoreda } from '@/utils/supabase/server-woreda';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = 
  process.env.SUPABASE_SERVICE_ROLE_KEY || 
  process.env.SUPABASE_SECRET_KEY || 
  process.env.SUPABASE_SERVICE_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Missing Supabase Service Key. Check .env.local for SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEY');
}

// WARNING: Never expose this client to the frontend!
export const supabaseAdmin = createClient<any>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  global: {
    fetch: createWoredaFetch(getServerActiveWoreda),
  },
});
