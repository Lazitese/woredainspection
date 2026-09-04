/**
 * apply-seed.js — Applies the dummy reports seed SQL via Supabase REST API
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Read env
const envContent = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
const getEnv = (key) => {
  const match = envContent.replace(/\r\n/g, '\n').split('\n').find(l => l.startsWith(key + '='));
  return match ? match.slice(key.length + 1).trim() : null;
};

const SUPABASE_URL = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const SERVICE_KEY = getEnv('SUPABASE_SERVICE_ROLE_KEY');

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

// Read the SQL file
const sqlFile = path.join(__dirname, '..', 'supabase', 'migrations', '20260905120000_seed_dummy_reports.sql');
const fullSQL = fs.readFileSync(sqlFile, 'utf8');

// Split into individual INSERT statements
// Each statement ends with );
const statements = fullSQL
  .split(/;\s*\n/)
  .map(s => s.trim())
  .filter(s => s.startsWith('INSERT INTO'));

console.log(`📦 Found ${statements.length} INSERT statements to apply`);

// Execute via Supabase REST SQL endpoint
function execSQL(sql) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/rpc/execute_sql`);
    // Use the pg REST endpoint
    const restUrl = new URL(`${SUPABASE_URL}/pg`);

    const body = JSON.stringify({ query: sql + ';' });

    const options = {
      hostname: url.hostname,
      port: url.protocol === 'https:' ? 443 : 80,
      path: '/rest/v1/rpc/execute_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'apikey': SERVICE_KEY,
        'Content-Length': Buffer.byteLength(body),
      }
    };

    const lib = url.protocol === 'https:' ? https : http;
    const req = lib.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ ok: true });
        } else {
          resolve({ ok: false, status: res.statusCode, body: data.slice(0, 200) });
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// Alternative: use Supabase JS client approach via node
async function runViaFetch() {
  let ok = 0, failed = 0;

  for (let i = 0; i < statements.length; i++) {
    const sql = statements[i];
    const woreda = sql.match(/'(ወረዳ \d+|ልዩ ወረዳ \d+)'/)?.[1] || `Statement ${i+1}`;
    const period = sql.match(/'(\d+[ኛ|ተኛ].*?አመት)'/)?.[1] || '';

    try {
      const result = await execSQL(sql);
      if (result.ok) {
        ok++;
        process.stdout.write(`✅ ${ok}/${statements.length} ${woreda} ${period}\r`);
      } else {
        failed++;
        console.log(`\n⚠️ Failed [${woreda}]: HTTP ${result.status} — ${result.body}`);
      }
    } catch (err) {
      failed++;
      console.log(`\n❌ Error [${woreda}]: ${err.message}`);
    }
  }

  console.log(`\n\n📊 Done: ${ok} succeeded, ${failed} failed out of ${statements.length} total`);
}

runViaFetch().catch(console.error);
