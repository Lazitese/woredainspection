import { createClient } from '@supabase/supabase-js';

const akdbUrl = 'https://akdb.raey.work';
const akdbKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc4ODUyMDYyMCwiZXhwIjo0OTQ0MTk0MjIwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.705zd5o4QNcTD1ex_Nen6hSnIOgUEC-JU87mw0xu47M';

const dbUrl = 'https://db.raey.work';
const dbKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc4NDk4MDUwMCwiZXhwIjo0OTQwNjU0MTAwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.w_aFm_9pB7Zl4Q_f5G_zWJ8x7L0sT5y6vR1qO4mN9eY'; // wait, what was the service key for federal? Or anon key?

// Let's check with anon key or whatever we have
const dbAnonKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc4NDk4MDUwMCwiZXhwIjo0OTQwNjU0MTAwLCJyb2xlIjoiYW5vbiJ9.VT9bQiEjq0yZEbFOYiUBsl-GieDttkDAa3NLGTM87gA';

async function check() {
  const akdb = createClient(akdbUrl, akdbKey);
  const db = createClient(dbUrl, dbAnonKey);

  console.log('--- AKDB (https://akdb.raey.work) ---');
  const { data: akNews, error: akNewsErr } = await akdb.from('news_articles').select('id, title, category, created');
  console.log('AKDB news articles count:', akNews?.length, akNewsErr || '');
  if (akNews?.length) {
    console.log('Sample AKDB news:', akNews.slice(0, 3));
  }

  const { data: akPersonnel, error: akPersErr } = await akdb.from('personnel').select('id, name, role, category');
  console.log('AKDB personnel count:', akPersonnel?.length, akPersErr || '');
  if (akPersonnel?.length) {
    console.log('Sample AKDB personnel:', akPersonnel.slice(0, 3));
  }

  console.log('\n--- FEDERAL DB (https://db.raey.work) ---');
  const { data: fedNews, error: fedNewsErr } = await db.from('news_articles').select('id, title, category, created');
  console.log('Federal news articles count:', fedNews?.length, fedNewsErr || '');
  if (fedNews?.length) {
    console.log('Sample Federal news:', fedNews.slice(0, 3));
  }

  const { data: fedPersonnel, error: fedPersErr } = await db.from('personnel').select('id, name, role, category');
  console.log('Federal personnel count:', fedPersonnel?.length, fedPersErr || '');
  if (fedPersonnel?.length) {
    console.log('Sample Federal personnel:', fedPersonnel.slice(0, 3));
  }
}

check().catch(console.error);
