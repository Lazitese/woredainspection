const fs = require('fs');

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
  const fullSql = fs.readFileSync('supabase/combined_migrations.sql', 'utf8');
  console.log(`Sending combined_migrations.sql (${fullSql.length} bytes) to MCP execute_sql...`);
  
  try {
    const result = await callMcp('execute_sql', { query: fullSql });
    console.log('✅ Successfully applied combined_migrations.sql!');
    console.log(result.content?.[0]?.text?.substring(0, 200));
  } catch (err) {
    console.error('❌ Failed on full SQL, error:', err.message);
  }
}

main();
