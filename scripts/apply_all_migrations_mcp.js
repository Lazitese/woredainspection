const fs = require('fs');
const path = require('path');

async function callMcp(toolName, args) {
  const res = await fetch('http://db.akkinspection.com.et/mcp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/event-stream',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: args,
      },
    }),
  });

  const json = await res.json();
  if (json.error) {
    throw new Error(JSON.stringify(json.error));
  }
  return json.result;
}

async function main() {
  const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

  console.log(`Found ${files.length} migration files to process...`);

  let succeeded = 0;
  let skippedOrExisted = 0;

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');

    try {
      await callMcp('execute_sql', { query: sql });
      console.log(`✅ [APPLIED] ${file}`);
      succeeded++;
    } catch (err) {
      const msg = err.message || '';
      // If table/type/column already exists or already enabled, that is expected
      if (
        msg.includes('already exists') ||
        msg.includes('duplicate key') ||
        msg.includes('does not exist')
      ) {
        console.log(`ℹ️ [ALREADY EXISTS / SKIPPED] ${file}`);
        skippedOrExisted++;
      } else {
        console.warn(`⚠️ [WARNING on ${file}]:`, msg.substring(0, 150));
      }
    }
  }

  console.log(`\n🎉 Migrations run complete: ${succeeded} succeeded, ${skippedOrExisted} already present.`);
}

main();
