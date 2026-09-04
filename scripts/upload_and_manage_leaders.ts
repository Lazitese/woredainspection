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

const LEADERS_DIR = path.join(process.cwd(), 'src', 'Leaders');
const BUCKET_NAME = 'personnel_photos';

interface LeaderDefinition {
  nameAm: string;
  nameEn: string;
  positionAm: string;
  positionEn: string;
  officeCategory: string;
  officeCategoryAm: string;
  department: string;
  region?: string;
  photoLocalFilename?: string; // Exact filename in src/Leaders
  storagePathKey: string; // Clean ASCII key in Supabase storage
}

const LEADERS_DATA: LeaderDefinition[] = [
  // --- 1. ም/ሰብሳቢ ---
  {
    nameAm: 'ወ/ሮ የሺ አክሊሉ',
    nameEn: 'Yeshi Aklilu',
    positionAm: 'ም/ሰብሳቢ',
    positionEn: 'Deputy Chairperson',
    officeCategory: 'deputy-chairperson,leadership-members,committee-members',
    officeCategoryAm: 'ም/ሰብሳቢ',
    department: 'የኢንስፔክሽንና የስነ ምግባር ኮሚሽን',
    photoLocalFilename: 'ወሮ የሺ አክሊሉ.jpg',
    storagePathKey: 'leaders/yeshi-aklilu.jpg',
  },

  // --- 2. ሰብሳቢና ፀሀፊ ---
  {
    nameAm: 'አቶ አህመድ ኡርጎ',
    nameEn: 'Ahmed Urgo',
    positionAm: 'ሰብሳቢና ፀሀፊ',
    positionEn: 'Chairperson & Secretary',
    officeCategory: 'chairperson-secretary,leadership-members,committee-members',
    officeCategoryAm: 'ሰብሳቢና ፀሀፊ',
    department: 'የኢንስፔክሽንና የስነ ምግባር ኮሚሽን',
    photoLocalFilename: 'አቶ አህመድ ኡርጎ.jpg',
    storagePathKey: 'leaders/ahmed-urgo.jpg',
  },

  // --- 3. አመራር አባላት ---
  {
    nameAm: 'አቶ ፈይሳ ከባሽ',
    nameEn: 'Feysa Kebash',
    positionAm: 'አመራርና ኮሚቴ አባል',
    positionEn: 'Leadership & Committee Member',
    officeCategory: 'leadership-members,committee-members',
    officeCategoryAm: 'አመራርና ኮሚቴ አባል',
    department: 'የኢንስፔክሽንና የስነ ምግባር ኮሚሽን',
    photoLocalFilename: 'አቶ ፈይሳ ከባሽ.jpg',
    storagePathKey: 'leaders/feysa-kebash.jpg',
  },
  {
    nameAm: 'ወ/ሮ ሀብለወርቅ ጌትነት',
    nameEn: 'Heblewerk Getnet',
    positionAm: 'አመራር አባል',
    positionEn: 'Leadership Member',
    officeCategory: 'leadership-members',
    officeCategoryAm: 'አመራር አባላት',
    department: 'የኢንስፔክሽንና የስነ ምግባር ኮሚሽን',
    photoLocalFilename: 'ወሮ ሀብለወርቅ ጌትነት.jpg',
    storagePathKey: 'leaders/heblewerk-getnet.jpg',
  },

  // --- 4. ኮሚቴ አባላት ---
  {
    nameAm: 'መስታወት ደጀኔ',
    nameEn: 'Mestawot Dejene',
    positionAm: 'ኮሚቴ አባል',
    positionEn: 'Committee Member',
    officeCategory: 'committee-members',
    officeCategoryAm: 'ኮሚቴ አባላት',
    department: 'የኢንስፔክሽንና የስነ ምግባር ኮሚቴ',
    photoLocalFilename: 'መስታወት ደጀኔ.jpg',
    storagePathKey: 'leaders/mestawot-dejene.jpg',
  },
  {
    nameAm: 'አቶ በየነ ቱሉ',
    nameEn: 'Beyene Tulu',
    positionAm: 'ኮሚቴ አባል',
    positionEn: 'Committee Member',
    officeCategory: 'committee-members',
    officeCategoryAm: 'ኮሚቴ አባላት',
    department: 'የኢንስፔክሽንና የስነ ምግባር ኮሚቴ',
    photoLocalFilename: 'አቶ በየነ ቱሉ.jpg',
    storagePathKey: 'leaders/beyene-tulu.jpg',
  },
  {
    nameAm: 'አቶ ብሩክ ዘርጋው',
    nameEn: 'Biruk Zergaw',
    positionAm: 'ኮሚቴ አባል',
    positionEn: 'Committee Member',
    officeCategory: 'committee-members',
    officeCategoryAm: 'ኮሚቴ አባላት',
    department: 'የኢንስፔክሽንና የስነ ምግባር ኮሚቴ',
    photoLocalFilename: 'አቶ ብሩክ ዘርጋው.jpg',
    storagePathKey: 'leaders/biruk-zergaw.jpg',
  },
  {
    nameAm: 'አቶ ተመስገን አየለ',
    nameEn: 'Temesgen Ayele',
    positionAm: 'ኮሚቴ አባል',
    positionEn: 'Committee Member',
    officeCategory: 'committee-members',
    officeCategoryAm: 'ኮሚቴ አባላት',
    department: 'የኢንስፔክሽንና የስነ ምግባር ኮሚቴ',
    photoLocalFilename: 'አቶ ተመስገን አየለ.jpg',
    storagePathKey: 'leaders/temesgen-ayele.jpg',
  },
  {
    nameAm: 'አቶ ደረጄ በድሉ',
    nameEn: 'Dereje Bedlu',
    positionAm: 'ኮሚቴ አባል',
    positionEn: 'Committee Member',
    officeCategory: 'committee-members',
    officeCategoryAm: 'ኮሚቴ አባላት',
    department: 'የኢንስፔክሽንና የስነ ምግባር ኮሚቴ',
    storagePathKey: '',
  },
  {
    nameAm: 'ወ/ሮ ሰላማዊት',
    nameEn: 'Selamawit',
    positionAm: 'ኮሚቴ አባል',
    positionEn: 'Committee Member',
    officeCategory: 'committee-members',
    officeCategoryAm: 'ኮሚቴ አባላት',
    department: 'የኢንስፔክሽንና የስነ ምግባር ኮሚቴ',
    storagePathKey: '',
  },

  // --- 4. ቅ/ጽ/ቤት ሀላፊዎች (Woreda Branch Heads) ---
  {
    nameAm: 'አቶ አወል',
    nameEn: 'Awol',
    positionAm: 'የወረዳ 1 ኮሚሽን ቅ/ጽ/ቤት ኃላፊ',
    positionEn: 'Woreda 1 Office Head',
    officeCategory: 'branch',
    officeCategoryAm: 'የወረዳ ቅርንጫፍ ጽ/ቤት',
    department: 'የወረዳ 1 ኮሚሽን ቅርንጫፍ ጽ/ቤት',
    region: 'ወረዳ 1',
    photoLocalFilename: 'አቶ አወል.jpg',
    storagePathKey: 'leaders/awol-woreda1.jpg',
  },
  {
    nameAm: 'አቶ ታምራት ግርማ',
    nameEn: 'Tamrat Girma',
    positionAm: 'የወረዳ 2 ኮሚሽን ቅ/ጽ/ቤት ኃላፊ',
    positionEn: 'Woreda 2 Office Head',
    officeCategory: 'branch',
    officeCategoryAm: 'የወረዳ ቅርንጫፍ ጽ/ቤት',
    department: 'የወረዳ 2 ኮሚሽን ቅርንጫፍ ጽ/ቤት',
    region: 'ወረዳ 2',
    photoLocalFilename: 'አቶ ታምራት ግርማ.jpg',
    storagePathKey: 'leaders/tamrat-girma-woreda2.jpg',
  },
  {
    nameAm: 'አቶ ታደገ ባንዳ',
    nameEn: 'Tadege Banda',
    positionAm: 'የወረዳ 3 ኮሚሽን ቅ/ጽ/ቤት ኃላፊ',
    positionEn: 'Woreda 3 Office Head',
    officeCategory: 'branch',
    officeCategoryAm: 'የወረዳ ቅርንጫፍ ጽ/ቤት',
    department: 'የወረዳ 3 ኮሚሽን ቅርንጫፍ ጽ/ቤት',
    region: 'ወረዳ 3',
    photoLocalFilename: 'አቶ\u00A0 ታደገ ባንዳ.jpg',
    storagePathKey: 'leaders/tadege-banda-woreda3.jpg',
  },
  {
    nameAm: 'የወረዳ 4 ኮሚሽን ቅ/ጽ/ቤት',
    nameEn: 'Woreda 4 Commission Office',
    positionAm: 'የወረዳ 4 ኮሚሽን ቅ/ጽ/ቤት ኃላፊ',
    positionEn: 'Woreda 4 Office Head',
    officeCategory: 'branch',
    officeCategoryAm: 'የወረዳ ቅርንጫፍ ጽ/ቤት',
    department: 'የወረዳ 4 ኮሚሽን ቅርንጫፍ ጽ/ቤት',
    region: 'ወረዳ 4',
    storagePathKey: '',
  },
  {
    nameAm: 'አቶ ሳምሶን አረጋ',
    nameEn: 'Samson Arega',
    positionAm: 'የወረዳ 5 ኮሚሽን ቅ/ጽ/ቤት ኃላፊ',
    positionEn: 'Woreda 5 Office Head',
    officeCategory: 'branch',
    officeCategoryAm: 'የወረዳ ቅርንጫፍ ጽ/ቤት',
    department: 'የወረዳ 5 ኮሚሽን ቅርንጫፍ ጽ/ቤት',
    region: 'ወረዳ 5',
    photoLocalFilename: 'አቶ\u00A0 ሳምሶን አረጋ.jpg',
    storagePathKey: 'leaders/samson-arega-woreda5.jpg',
  },
  {
    nameAm: 'አቶ ሁሴን አስፋው',
    nameEn: 'Hussein Asfaw',
    positionAm: 'የወረዳ 6 ኮሚሽን ቅ/ጽ/ቤት ኃላፊ',
    positionEn: 'Woreda 6 Office Head',
    officeCategory: 'branch',
    officeCategoryAm: 'የወረዳ ቅርንጫፍ ጽ/ቤት',
    department: 'የወረዳ 6 ኮሚሽን ቅርንጫፍ ጽ/ቤት',
    region: 'ወረዳ 6',
    photoLocalFilename: 'አቶ ሁሴን አስፋው.jpg',
    storagePathKey: 'leaders/hussein-asfaw-woreda6.jpg',
  },
  {
    nameAm: 'ወ/ሮ ፍሬህይወት አያል',
    nameEn: 'Frehiwot Ayal',
    positionAm: 'የወረዳ 7 ኮሚሽን ቅ/ጽ/ቤት ኃላፊ',
    positionEn: 'Woreda 7 Office Head',
    officeCategory: 'branch',
    officeCategoryAm: 'የወረዳ ቅርንጫፍ ጽ/ቤት',
    department: 'የወረዳ 7 ኮሚሽን ቅርንጫፍ ጽ/ቤት',
    region: 'ወረዳ 7',
    photoLocalFilename: 'ወሮ ፍሬህይወት.jpg',
    storagePathKey: 'leaders/frehiwot-ayal-woreda7.jpg',
  },
  {
    nameAm: 'ወ/ሮ ፅጌሬዳ ደበበ',
    nameEn: 'Tsigereda Debebe',
    positionAm: 'የወረዳ 8 ኮሚሽን ቅ/ጽ/ቤት ኃላፊ',
    positionEn: 'Woreda 8 Office Head',
    officeCategory: 'branch',
    officeCategoryAm: 'የወረዳ ቅርንጫፍ ጽ/ቤት',
    department: 'የወረዳ 8 ኮሚሽን ቅርንጫፍ ጽ/ቤት',
    region: 'ወረዳ 8',
    photoLocalFilename: 'ወሮ ፅጌሬዳ ደበበ.jpg',
    storagePathKey: 'leaders/tsigereda-debebe-woreda8.jpg',
  },
  {
    nameAm: 'አቶ አማረ ጉታ',
    nameEn: 'Amare Guta',
    positionAm: 'የወረዳ 9 ኮሚሽን ቅ/ጽ/ቤት ኃላፊ',
    positionEn: 'Woreda 9 Office Head',
    officeCategory: 'branch',
    officeCategoryAm: 'የወረዳ ቅርንጫፍ ጽ/ቤት',
    department: 'የወረዳ 9 ኮሚሽን ቅርንጫፍ ጽ/ቤት',
    region: 'ወረዳ 9',
    photoLocalFilename: 'አቶ\u00A0 አማረ ጉታ.jpg',
    storagePathKey: 'leaders/amare-guta-woreda9.jpg',
  },
  {
    nameAm: 'ወ/ሮ ልንገርሽ',
    nameEn: 'Lingeresh',
    positionAm: 'የወረዳ 10 ኮሚሽን ቅ/ጽ/ቤት ኃላፊ',
    positionEn: 'Woreda 10 Office Head',
    officeCategory: 'branch',
    officeCategoryAm: 'የወረዳ ቅርንጫፍ ጽ/ቤት',
    department: 'የወረዳ 10 ኮሚሽን ቅርንጫፍ ጽ/ቤት',
    region: 'ወረዳ 10',
    photoLocalFilename: 'ወሮ ልንገርሽ.jpg',
    storagePathKey: 'leaders/lingeresh-woreda10.jpg',
  },
  {
    nameAm: 'አቶ ደረጀ ረጋሳ',
    nameEn: 'Dereje Regassa',
    positionAm: 'የወረዳ 12 ኮሚሽን ቅ/ጽ/ቤት ኃላፊ',
    positionEn: 'Woreda 12 Office Head',
    officeCategory: 'branch',
    officeCategoryAm: 'የወረዳ ቅርንጫፍ ጽ/ቤት',
    department: 'የወረዳ 12 ኮሚሽን ቅርንጫፍ ጽ/ቤት',
    region: 'ወረዳ 12',
    photoLocalFilename: 'አቶ  ደረጀ ረጋሳ.jpg',
    storagePathKey: 'leaders/dereje-regassa-woreda12.jpg',
  },
  {
    nameAm: 'አቶ አዲስ ይሁን',
    nameEn: 'Addis Yihun',
    positionAm: 'የወረዳ 13 ኮሚሽን ቅ/ጽ/ቤት ኃላፊ',
    positionEn: 'Woreda 13 Office Head',
    officeCategory: 'branch',
    officeCategoryAm: 'የወረዳ ቅርንጫፍ ጽ/ቤት',
    department: 'የወረዳ 13 ኮሚሽን ቅርንጫፍ ጽ/ቤት',
    region: 'ወረዳ 13',
    photoLocalFilename: 'አቶ አዲስ ይሁን.jpg',
    storagePathKey: 'leaders/addis-yihun-woreda13.jpg',
  },
  {
    nameAm: 'ፍቅር ምህረቴ ገበየሁ',
    nameEn: 'Fikr Mihrete Gebeyehu',
    positionAm: 'የልዩ ወረዳ ኮሚሽን ቅ/ጽ/ቤት ኃላፊ',
    positionEn: 'Special Woreda Office Head',
    officeCategory: 'branch',
    officeCategoryAm: 'የወረዳ ቅርንጫፍ ጽ/ቤት',
    department: 'የልዩ ወረዳ ኮሚሽን ቅርንጫፍ ጽ/ቤት',
    region: 'ልዩ ወረዳ',
    photoLocalFilename: 'ፍቅር ምህረቴ ገበየሁ.jpg',
    storagePathKey: 'leaders/fikr-mihrete-gebeyehu-specialworeda.jpg',
  },
];

async function uploadAndManageLeaders() {
  console.log("==================================================================");
  console.log("   UPLOADING LEADERS PHOTOS TO SUPABASE STORAGE & DB SYNC         ");
  console.log("==================================================================");
  console.log(`Target URL: ${supabaseUrl}`);
  console.log(`Bucket: ${BUCKET_NAME}`);
  console.log(`Local Directory: ${LEADERS_DIR}\n`);

  // 1. Ensure bucket exists and is public
  const { data: buckets, error: bErr } = await supabaseAdmin.storage.listBuckets();
  const bucketExists = buckets?.some(b => b.id === BUCKET_NAME);
  if (!bucketExists) {
    console.log(`Bucket '${BUCKET_NAME}' does not exist. Creating...`);
    const { error: cErr } = await supabaseAdmin.storage.createBucket(BUCKET_NAME, { public: true });
    if (cErr) console.error("Error creating bucket:", cErr.message);
  } else {
    console.log(`✓ Bucket '${BUCKET_NAME}' confirmed.`);
  }

  // Clear existing personnel table to have a pristine sync
  console.log("\nClearing old entries in 'personnel' table...");
  const { error: delErr } = await supabaseAdmin.from('personnel').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (delErr) {
    console.warn("Notice clearing personnel:", delErr.message);
  } else {
    console.log("✓ Cleared existing personnel records.");
  }

  let uploadSuccessCount = 0;
  let dbSuccessCount = 0;

  for (const leader of LEADERS_DATA) {
    console.log(`\n▶ Processing: ${leader.nameAm} (${leader.positionAm})...`);
    let publicPhotoUrl: string | null = null;

    // Check if photo file is defined and exists locally
    if (leader.photoLocalFilename) {
      const localFilePath = path.join(LEADERS_DIR, leader.photoLocalFilename);
      if (fs.existsSync(localFilePath)) {
        const fileBuffer = fs.readFileSync(localFilePath);
        console.log(`  Uploading image '${leader.photoLocalFilename}' (${fileBuffer.length} bytes) -> '${leader.storagePathKey}'...`);

        const { error: upErr } = await supabaseAdmin.storage
          .from(BUCKET_NAME)
          .upload(leader.storagePathKey, fileBuffer, {
            contentType: 'image/jpeg',
            upsert: true,
          });

        if (upErr) {
          console.error(`  ❌ Storage upload failed:`, upErr.message);
        } else {
          // Construct public URL
          const { data: pubData } = supabaseAdmin.storage
            .from(BUCKET_NAME)
            .getPublicUrl(leader.storagePathKey);

          publicPhotoUrl = pubData.publicUrl;
          console.log(`  ✓ Uploaded to Supabase Storage!`);
          console.log(`    Public URL: ${publicPhotoUrl}`);
          uploadSuccessCount++;
        }
      } else {
        console.warn(`  ⚠️ Local file not found: ${localFilePath}`);
      }
    } else {
      console.log(`  ℹ No photo file specified. Card will use standard styled avatar placeholder.`);
    }

    // Insert into personnel table
    const { data: inserted, error: insertErr } = await supabaseAdmin
      .from('personnel')
      .insert({
        name: leader.nameEn,
        name_am: leader.nameAm,
        position: leader.positionEn,
        position_am: leader.positionAm,
        office_category: leader.officeCategory,
        office_category_am: leader.officeCategoryAm,
        department: leader.department,
        region: leader.region || null,
        photo: publicPhotoUrl,
        status: 'Active',
      })
      .select()
      .single();

    if (insertErr) {
      console.error(`  ❌ DB insert error:`, insertErr.message);
    } else {
      console.log(`  ✓ Inserted into 'personnel' table (ID: ${inserted.id})`);
      dbSuccessCount++;
    }
  }

  console.log("\n==================================================================");
  console.log(`LEADERS SYNC SUMMARY:`);
  console.log(`- Photos uploaded to Supabase Storage: ${uploadSuccessCount}`);
  console.log(`- Personnel records created in Database: ${dbSuccessCount} / ${LEADERS_DATA.length}`);
  console.log("==================================================================\n");
}

uploadAndManageLeaders().catch(console.error);
