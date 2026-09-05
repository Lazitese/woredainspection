import { createClient } from '@supabase/supabase-js';

const akdbUrl = 'https://akdb.raey.work';
const akdbKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc4ODUyMDYyMCwiZXhwIjo0OTQ0MTk0MjIwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.705zd5o4QNcTD1ex_Nen6hSnIOgUEC-JU87mw0xu47M';

const dbUrl = 'https://db.raey.work';
const dbAnonKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc4NDk4MDUwMCwiZXhwIjo0OTQwNjU0MTAwLCJyb2xlIjoiYW5vbiJ9.VT9bQiEjq0yZEbFOYiUBsl-GieDttkDAa3NLGTM87gA';

async function check() {
  const akdb = createClient(akdbUrl, akdbKey);
  const db = createClient(dbUrl, dbAnonKey);

  const { data: akArticles } = await akdb.from('news_articles').select('*');
  console.log('AKDB articles:', akArticles);

  const { data: dbArticles } = await db.from('news_articles').select('id, title, status, article_type');
  console.log('Federal articles:', dbArticles);
}

check().catch(console.error);
