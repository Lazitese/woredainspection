const fs = require('fs');

const data = JSON.parse(fs.readFileSync('src/data/forms-schema.json', 'utf8'));

let sql = `-- Seed initial form schemas\n`;
sql += `INSERT INTO public.form_schemas (id, table_title, columns)\nVALUES\n`;

const values = data.map(form => {
  const id = form.id.replace(/'/g, "''");
  const title = form.table_title.replace(/'/g, "''");
  const cols = JSON.stringify(form.columns).replace(/'/g, "''");
  return `  ('${id}', '${title}', '${cols}'::jsonb, NOW())`;
});

sql = `-- Seed and update form schemas\n`;
sql += `INSERT INTO public.form_schemas (id, table_title, columns, updated_at)\nVALUES\n`;
sql += values.join(',\n');
sql += `\nON CONFLICT (id) DO UPDATE SET\n`;
sql += `  table_title = EXCLUDED.table_title,\n`;
sql += `  columns = EXCLUDED.columns,\n`;
sql += `  updated_at = NOW();\n`;

fs.writeFileSync('supabase/migrations/20260709094600_seed_form_schemas.sql', sql);
console.log('Seed migration created.');

