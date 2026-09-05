import { createClient } from '@supabase/supabase-js';

const akdbUrl = 'https://akdb.raey.work';
const akdbAnonKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc4ODUyMDYyMCwiZXhwIjo0OTQ0MTk0MjIwLCJyb2xlIjoiYW5vbiJ9.fjvnv7iiIJCFJ1_SPQvcWCHAUW_Ka0I5a9DbSPS1uyI';

async function testAnon() {
  const akdb = createClient(akdbUrl, akdbAnonKey);
  const { data: news, error: newsErr } = await akdb.from('news_articles').select('*');
  console.log('AKDB with ANON KEY - news_articles:', news?.length, newsErr);

  const { data: personnel, error: persErr } = await akdb.from('personnel').select('*');
  console.log('AKDB with ANON KEY - personnel:', personnel?.length, persErr);
}

testAnon().catch(console.error);
