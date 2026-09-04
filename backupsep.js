const fs = require('fs');

async function executeSql(query) {
  const res = await fetch('https://akdb.raey.work/mcp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/event-stream'
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: {
        name: 'execute_sql',
        arguments: { query }
      }
    })
  });
  const data = await res.json();
  if (data.result && data.result.content && data.result.content[0]) {
    const text = data.result.content[0].text;
    const match = text.match(/<untrusted-data-[^>]+>\n([\s\S]*?)\n<\/untrusted-data-[^>]+>/);
    if (match && match[1]) {
      return JSON.parse(match[1]);
    }
  }
  return [];
}

async function run() {
  console.log('Starting full database backup via MCP execute_sql...');
  const backup = {
    metadata: {
      timestamp: new Date().toISOString(),
      note: "Backup created via MCP execute_sql"
    },
    data: {}
  };

  const schemas = ['public', 'auth', 'storage']; // focus on main ones
  
  for (const schema of schemas) {
    console.log(`Fetching tables for schema ${schema}...`);
    const tables = await executeSql(`SELECT table_name FROM information_schema.tables WHERE table_schema = '${schema}'`);
    backup.data[schema] = {};
    
    for (const t of tables) {
      const tableName = t.table_name;
      console.log(`Fetching data for ${schema}.${tableName}...`);
      const rows = await executeSql(`SELECT * FROM "${schema}"."${tableName}"`);
      backup.data[schema][tableName] = rows;
    }
  }

  fs.writeFileSync('backupsep.json', JSON.stringify(backup, null, 2));
  console.log('Backup saved to backupsep.json');
}

run().catch(console.error);
