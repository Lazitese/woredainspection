import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase configuration");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const BUCKET_NAME = 'personnel_photos';

const NEWS_DATA = [
  {
    title: 'የፓርቲዉን ስራ ይበልጥ ተጠናክሮ እንዲቀጥል የኮሚሽን ሚና ከፍተኛ ነው',
    content: 'የፓርቲዉን ስራ ይበልጥ ተጠናክሮ እንዲቀጥል የኮሚሽን ሚና ከፍተኛ ነው። በአቃቂ ቃሊቲ ክ/ከተማ ኢንስፔክሽንና ስነ-ምግባር ኮሚሽን የቅድመ-ምርጫ ስራዎች ያሉበትን ደረጃ ለማወቅ የኢንስፔክሽን ቡድን በማወቀር ግቦቹን የጋራ በማድረግ ስምሪት ተሰጥቷል ።',
    description: 'በአቃቂ ቃሊቲ ክ/ከተማ ኢንስፔክሽንና ስነ-ምግባር ኮሚሽን የቅድመ-ምርጫ ስራዎች ያሉበትን ደረጃ ለማወቅ የኢንስፔክሽን ቡድን በማወቀር ግቦቹን የጋራ በማድረግ ስምሪት ተሰጥቷል ።',
    excerpt: 'በአቃቂ ቃሊቲ ክ/ከተማ ኢንስፔክሽንና ስነ-ምግባር ኮሚሽን የቅድመ-ምርጫ ስራዎች ያሉበትን ደረጃ ለማወቅ የኢንስፔክሽን ቡድን በማወቀር ግቦቹን የጋራ በማድረግ ስምሪት ተሰጥቷል ።',
    localFile: 'news 1.jpg',
    storageKey: 'news/news-1.jpg',
    category: 'ዓበይት ዜናዎች',
  },
  {
    title: 'የብልፅግና ፓርቲ የምርጫ ምልክት “የስንዴ ነዶ” ነው',
    content: 'የብልፅግና ፓርቲ የምርጫ ምልክት “የስንዴ ነዶ” ነው። የስንዴ ነዶ የመደመር፣ የአንድነት፣ ትብብርና የሉአላዊነት መገለጫ ነው። ኢትዮጵያን ወደ ተምሳሌት ሀገር!',
    description: 'የብልፅግና ፓርቲ የምርጫ ምልክት “የስንዴ ነዶ” ነው። የስንዴ ነዶ የመደመር፣ የአንድነት፣ ትብብርና የሉአላዊነት መገለጫ ነው። ኢትዮጵያን ወደ ተምሳሌት ሀገር!',
    excerpt: 'የብልፅግና ፓርቲ የምርጫ ምልክት “የስንዴ ነዶ” ነው። የስንዴ ነዶ የመደመር፣ የአንድነት፣ ትብብርና የሉአላዊነት መገለጫ ነው።',
    localFile: 'news 2.jpg',
    storageKey: 'news/news-2.jpg',
    category: 'የፓርቲ ዜናዎች',
  },
  {
    title: 'የስንዴ ነዶ የመደመር፣ የአንድነት፣ ትብብርና የሉአላዊነት መገለጫ ነው',
    content: 'የብልፅግና ፓርቲ የምርጫ ምልክት “የስንዴ ነዶ” ነው። የስንዴ ነዶ የመደመር፣ የአንድነት፣ ትብብርና የሉአላዊነት መገለጫ ነው። ኢትዮጵያን ወደ ተምሳሌት ሀገር!',
    description: 'የብልፅግና ፓርቲ የምርጫ ምልክት “የስንዴ ነዶ” ነው። የስንዴ ነዶ የመደመር፣ የአንድነት፣ ትብብርና የሉአላዊነት መገለጫ ነው። ኢትዮጵያን ወደ ተምሳሌት ሀገር!',
    excerpt: 'የብልፅግና ፓርቲ የምርጫ ምልክት “የስንዴ ነዶ” ነው። የስንዴ ነዶ የመደመር፣ የአንድነት፣ ትብብርና የሉአላዊነት መገለጫ ነው።',
    localFile: 'news 3.jpg',
    storageKey: 'news/news-3.jpg',
    category: 'የፓርቲ ዜናዎች',
  },
];

async function main() {
  console.log("=== Starting News Upload & Population ===");

  // Ensure public/news directory exists for static fallback
  const publicNewsDir = path.join(process.cwd(), 'public', 'news');
  if (!fs.existsSync(publicNewsDir)) {
    fs.mkdirSync(publicNewsDir, { recursive: true });
  }

  for (let i = 0; i < NEWS_DATA.length; i++) {
    const item = NEWS_DATA[i];
    const srcPath = path.join(process.cwd(), 'src', item.localFile);

    let publicUrl = '';

    if (fs.existsSync(srcPath)) {
      // 1. Copy to public/news/
      const staticDest = path.join(publicNewsDir, path.basename(item.storageKey));
      fs.copyFileSync(srcPath, staticDest);
      console.log(`Copied ${item.localFile} to ${staticDest}`);

      // 2. Upload to Supabase Storage
      const fileBuffer = fs.readFileSync(srcPath);
      const { error: uploadErr } = await supabaseAdmin.storage
        .from(BUCKET_NAME)
        .upload(item.storageKey, fileBuffer, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (uploadErr) {
        console.warn(`Storage upload warning for ${item.storageKey}:`, uploadErr.message);
        publicUrl = `/news/${path.basename(item.storageKey)}`;
      } else {
        const { data: urlData } = supabaseAdmin.storage
          .from(BUCKET_NAME)
          .getPublicUrl(item.storageKey);
        publicUrl = urlData.publicUrl;
        console.log(`Uploaded ${item.storageKey} -> ${publicUrl}`);
      }
    } else {
      console.warn(`Local file not found: ${srcPath}`);
    }

    const now = new Date();
    // Offset each article slightly so they sort chronologically
    now.setMinutes(now.getMinutes() - i * 15);
    const dateIso = now.toISOString();

    // Check if an article with same title already exists
    const { data: existing } = await supabaseAdmin
      .from('news_articles')
      .select('id')
      .eq('title', item.title)
      .maybeSingle();

    if (existing) {
      const { error: updateErr } = await supabaseAdmin
        .from('news_articles')
        .update({
          content: item.content,
          description: item.description,
          excerpt: item.excerpt,
          image: publicUrl,
          images: [publicUrl],
          category: item.category,
          status: 'Published',
          lang: 'am',
          author: 'የአቃቂ ቃሊቲ ክ/ከተማ ኮሚሽን',
          article_type: 'News',
        })
        .eq('id', existing.id);

      if (updateErr) {
        console.error(`Error updating article "${item.title}":`, updateErr.message);
      } else {
        console.log(`Updated article "${item.title}"`);
      }
    } else {
      const { error: insertErr } = await supabaseAdmin
        .from('news_articles')
        .insert([{
          title: item.title,
          content: item.content,
          description: item.description,
          excerpt: item.excerpt,
          image: publicUrl,
          images: [publicUrl],
          category: item.category,
          status: 'Published',
          lang: 'am',
          author: 'የአቃቂ ቃሊቲ ክ/ከተማ ኮሚሽን',
          article_type: 'News',
          created: dateIso,
          published: dateIso,
        }]);

      if (insertErr) {
        console.error(`Error inserting article "${item.title}":`, insertErr.message);
      } else {
        console.log(`Inserted article "${item.title}"`);
      }
    }
  }

  console.log("=== News upload and database seeding completed successfully! ===");
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
