/**
 * run-seed.js — Reseeds realistic dummy report data for all 17 woredas
 * based on the REAL 24 Woreda report schemas from 2018  2ኛ  ሩብ አሀዛዊ Report (2) (1).md.
 * 
 * node scripts/run-seed.js
 */
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read env
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8').replace(/\r\n/g, '\n');
const getEnv = (key) => {
  const lines = envContent.split('\n');
  const line = lines.find(l => l.startsWith(key + '='));
  return line ? line.slice(key.length + 1).trim() : null;
};

const SUPABASE_URL = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const SERVICE_KEY = getEnv('SUPABASE_SERVICE_ROLE_KEY');

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing env vars in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// Woreda users mapping
const WOREDA_USERS = {
  'ወረዳ 1':    '9ffe5632-7f29-4024-a2f4-9fd604da7576',
  'ወረዳ 2':    '20d37dbd-3167-4759-9d3f-79c888f5e17e',
  'ወረዳ 3':    'bd22f49b-a63c-46f0-8207-274736d4c2c9',
  'ወረዳ 4':    '23fa6d2b-8c1a-4b65-a328-e7bbce116bd0',
  'ወረዳ 5':    'd6255686-c4d0-41d5-ab93-b951cdbb5ea2',
  'ወረዳ 6':    '0c5d8712-fd6c-4d27-afbd-cdf9f5021bf6',
  'ወረዳ 7':    '171d8958-5464-4f34-a27f-a918f463b0ed',
  'ወረዳ 8':    '62706574-7ab1-4096-a7f7-6e46b90a78a4',
  'ወረዳ 9':    '3a1121fd-871d-48f5-afa8-ee1c4fdbe322',
  'ወረዳ 10':   'd65d037c-e9e9-4809-ba7f-738edf2032d1',
  'ወረዳ 12':   '1c0da08a-be0e-4590-be49-bd632b7af2d3',
  'ወረዳ 13':   '9579364e-9e92-43b6-841d-3ee823cb8fc7',
  'ልዩ ወረዳ 1': '08e4f9d4-dc42-4304-b436-b5fd4227be8a',
  'ልዩ ወረዳ 2': '8ebacd25-f63a-45aa-baea-c5fa1e9a4483',
  'ልዩ ወረዳ 3': '96b4cae0-4c5f-48a9-95ac-44d3fd92fe1c',
  'ልዩ ወረዳ 4': 'de31594b-ccd9-4e0f-83c0-d141f0a8b101',
  'ልዩ ወረዳ 5': '4bfd7adb-a4bf-4890-8a16-ed77ab14926d',
};

const YEAR = 2018;
const PERIODS = [
  { label: '1ኛ ሩብ አመት', code: 'q1' },
  { label: '2ኛ ሩብ አመት', code: 'q2' },
];

function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pct(done, total) { return total > 0 ? Math.round((done / total) * 100) : 0; }

function gen(woredaIndex) {
  const w = woredaIndex + 1;
  const b = (base) => Math.max(0, base + rnd(-Math.floor(base * 0.15), Math.floor(base * 0.15)));

  const unionsCount = b(32 + w);
  const unionsEstablished = b(Math.floor(unionsCount * 0.95));
  const totCount = 1 + unionsCount;
  const totEstablished = 1 + unionsEstablished;

  const w_m = b(4 + (w % 3)), w_f = b(3 + (w % 2)), w_tot = w_m + w_f;
  const u_m = b(100 + w * 2), u_f = b(60 + w), u_tot = u_m + u_f;
  const tot_m = w_m + u_m, tot_f = w_f + u_f, tot_d = w_tot + u_tot;

  const exp = b(1 + (w % 2));
  const staffTot = 1 + exp + 1; // head + exp + secretary

  const bgt = b(50000 + w * 5000);

  const trainPlan = b(1500 + w * 40), trainDone = b(Math.floor(trainPlan * 0.92));

  const partyM = b(1500 + w * 25), partyF = b(900 + w * 20), partyTot = partyM + partyF;
  const famCount = b(200 + w * 5);
  const dbM = b(2800 + w * 30), dbF = b(4200 + w * 40), dbTot = dbM + dbF;

  const revPlan = b(800000 + w * 15000), revDone = b(Math.floor(revPlan * 0.88));
  const miscPlan = b(1500000 + w * 25000), miscDone = b(Math.floor(miscPlan * 0.82));

  return {
    form_01: {
      "ወረዳ": { "ብዛት": "1", "ያዋቀሩ": "1", "ያላዋቀሩ": "0" },
      "በብልፅግና ህብረት ደረጃ": { "ብዛት": String(unionsCount), "ያዋቀሩ": String(unionsEstablished), "ያላዋቀሩ": String(unionsCount - unionsEstablished) },
      "ጠቅላላ ድምር": { "ብዛት": String(totCount), "ያዋቀሩ": String(totEstablished), "ያላዋቀሩ": String(totCount - totEstablished) },
      "ያዋቀሩ %": String(pct(totEstablished, totCount))
    },
    form_02: {
      "የወረዳ ኮሚሽን": { "ወ": String(w_m), "ሴ": String(w_f), "ድ": String(w_tot) },
      "የብልፅግና ህብረት ኮሚሽን": { "ወ": String(u_m), "ሴ": String(u_f), "ድ": String(u_tot) },
      "ጠቅላላ ድምር": { "ወ": String(tot_m), "ሴ": String(tot_f), "ድ": String(tot_d) }
    },
    form_03: {
      "የወረዳ ኮሚሽን ጽ/ቤት": { "ጽ/ኃ": "1", "ም/ክ": "0", "ባለሙ": String(exp), "ጸሐ": "1", "ሹፌ": "0", "ድም": String(staffTot) },
      "ጠቅላላ ድምር": { "ጽ/ኃ": "1", "ም/ክ": "0", "ባለሙ": String(exp), "ጸሐ": "1", "ሹፌ": "0", "ድም": String(staffTot) }
    },
    form_04: {
      "የወረዳ ቅ/ጽ/ቤት": { "እቅድ": "1", "ክንውን": "1", "%": "100" },
      "ጠቅላላ ድምር": { "እቅድ": "1", "ክንውን": "1", "%": "100" }
    },
    form_04_1: {
      "ለወረዳ": { "ብር": String(bgt), "ሣ": "0" },
      "ጠቅላላ ድምር": { "ብር": String(bgt), "ሣ": "0" }
    },
    form_05: {
      "ወረዳ ኮሚሽን": { "እቅድ": "1", "ክንውን": "1", "%": "100" },
      "በብልጽግና ህብረት ኮሚሽን": { "እቅድ": String(unionsCount), "ክንውን": String(unionsCount), "%": "100" },
      "አጠቃላይ ድምር": { "እቅድ": String(totCount), "ክንውን": String(totCount), "%": "100" }
    },
    form_06: {
      "ወረዳ": { "እቅድ": "1", "ክንውን": "1", "%": "100" },
      "በብልጽግና ህብረት ኮሚሽን": { "እቅድ": String(unionsCount), "ክንውን": String(unionsCount), "%": "100" },
      "ጠቅላላ ድምር": { "እቅድ": String(totCount), "ክንውን": String(totCount), "%": "100" }
    },
    form_06_1: {
      "በወረዳ ደረጃ": { "ወ": String(w_m), "ሴ": String(w_f), "ድ": String(w_tot) },
      "በብልጽግና ህብረት ኮሚሽን": { "ወ": String(u_m - 5), "ሴ": String(u_f - 2), "ድ": String(u_tot - 7) },
      "ጠቅላላ ድምር": { "ወ": String(tot_m - 5), "ሴ": String(tot_f - 2), "ድ": String(tot_d - 7) },
      "ምርመራ": ""
    },
    form_07: {
      "በወረዳ ደረጃ": { "ወ": String(w_m), "ሴ": String(w_f), "ድ": String(w_tot) },
      "በብልጽግና ህብረት ኮሚሽን": { "ወ": String(b(70 + w)), "ሴ": String(b(95 + w)), "ድ": String(b(165 + w * 2)) },
      "አጠቃላይ ድምር": { "ወ": String(b(74 + w)), "ሴ": String(b(98 + w)), "ድ": String(b(172 + w * 2)) }
    },
    form_08: {
      "ለወረዳ የላኩ የብልጽግና ህብረት": { "ዕቅድ": String(unionsCount), "ክንውን": String(unionsCount), "%": "100" },
      "ለአባላት ኮንፈረንስ ሪፖርት ያቀረቡ የኮሚሽን መዋቅር ብዛት": {
        "ከተማ": "0",
        "በክፍለ ከተማ ወረዳ 1 ጊዜ": "1",
        "ወረዳ 1 ጊዜ": "1",
        "ህብረት 1 ጊዜ": String(unionsCount),
        "ጠቅላላ ድምር": String(totCount)
      }
    },
    form_09: {
      "በወረዳ": { "ዕቅድ": "1", "ክንውን": "1", "%": "100" },
      "በብልጽግና ህብረት": { "ዕቅድ": String(unionsCount), "ክንውን": String(unionsEstablished), "%": String(pct(unionsEstablished, unionsCount)) },
      "አጠቃላይ ድምር": { "ዕቅድ": String(totCount), "ክንውን": String(totEstablished), "%": String(pct(totEstablished, totCount)) }
    },
    form_10: {
      "በወረዳ ደረጃ": { "ዕቅድ": "1", "ክንውን": "1", "%": "100" },
      "በብልጽግና ህብረት ደረጃ": { "ዕቅድ": String(unionsCount), "ክንውን": String(unionsCount), "%": "100" },
      "አጠቃላይ ድምር": { "ዕቅድ": String(totCount), "ክንውን": String(totCount), "%": "100" }
    },
    form_11: {
      "በወረዳ ደረጃ": { "ዕቅድ": "1", "ክንውን": "1", "%": "100" },
      "በብልጽግና ህብረት ደረጃ": { "ዕቅድ": String(unionsCount), "ክንውን": String(unionsCount), "%": "100" },
      "አጠቃላይ ድምር": { "ዕቅድ": String(totCount), "ክንውን": String(totCount), "%": "100" }
    },
    form_12: {
      "በወረዳ ደረጃ": { "ዕቅድ": String(trainPlan), "ክንውን": String(trainDone), "%": String(pct(trainDone, trainPlan)) },
      "በብልጽግና ህብረት ደረጃ": { "ዕቅድ": "0", "ክንውን": "0", "%": "0" },
      "አጠቃላይ ድምር": { "ዕቅድ": String(trainPlan), "ክንውን": String(trainDone), "%": String(pct(trainDone, trainPlan)) }
    },
    form_13: {
      "የፓርቲ አባላት ብዛት": { "ወንድ": String(partyM), "ሴት": String(partyF), "ድምር": String(partyTot) },
      "አባላት የተደራጁበት አሃድ ብዛት": { "የብልፅግና ቤተሰብ ብዛት": String(famCount), "የብልፅግና ህብረት ብዛት": String(unionsCount) },
      "ከአጠቃላይ የአባላት ብዛት ወደ ዳታ ቤዝ የገባ መረጃ ብዛት": { "ወ": String(dbM), "ሴ": String(dbF), "ድ": String(dbTot), "%": "100" }
    },
    form_14: {
      "በ2ኛ ሩብ ዓመት የተወሰዱ እርምጃዎች": {
        "ተግሣጽ": String(1 + (w % 2)),
        "የቃል ማስጠንቀቂያ": String(1 + (w % 3)),
        "የጽሐፍ ማስጠንቀቂያ": "1",
        "ከሃላፊነት ዝቅ ማድረግ": "0",
        "ከሃላፊነት ማንሳት": "0",
        "ከሃላፊነት ማገድ": "0",
        "ከአባልነት መሠረዝ": String(w % 2),
        "ጠቅላላ ድምር": String(3 + (w % 2) + (w % 3) + (w % 2))
      },
      "ከአባልነት ከተሰረዙ ውስጥ በኮንፈረንስ ቀርቦ የጸደቀ": { "ብዛት": String(w % 2), "%": "100" }
    },
    form_15: {
      "የቀረቡ ቅሬታዎችና አፈጻጸም": {
        "የቀረቡ": String(4 + (w % 3)),
        "የተፈቱ": String(3 + (w % 3)),
        "በሂደት ያሉ": "1",
        "ሌላ": "0",
        "ድምር": String(4 + (w % 3))
      },
      "ምርመራ": ""
    },
    form_15_1: {
      "የቀረቡ አቤቱታዎችና አፈጻጸማቸው": {
        "የቀረቡ": String(2 + (w % 3)),
        "ውሳኔ ያገኙ": String(1 + (w % 3)),
        "በሂደት ያሉ": "1",
        "የተመለሱ": "0",
        "ኮሚሽን የማይመለከት": "0"
      },
      "በኮሚሽኑ የተሰጡ ውሳኔዎች": {
        "የጸነ": String(1 + (w % 2)),
        "የተሻረ": "0",
        "የተሻሻለ": "0",
        "ድምር": String(1 + (w % 2))
      },
      "በኮሚሽኑ ከተሰጡ ውሳኔዎች በፓርቲ መዋቅር": {
        "የተፈጸመ": String(1 + (w % 2)),
        "ያልተፈጸመ": "0",
        "በሂደት ያለ": "0",
        "ድምር": String(1 + (w % 2))
      }
    },
    form_16: {
      "ቋሚ ንብረት": { "በክፍለ ከተማ": "0", "ወረዳ": String(10 + (w % 5)), "ድምር": String(10 + (w % 5)) },
      "ልዩ ተንቀሳቃሽ ንብረት": { "በክፍለ ከተማ": "0", "ወረዳ": "0", "ድምር": "0" },
      "ጠቅላላ የተመዘገበ ንብረት ብዛት": { "በክፍለ ከተማ": "0", "ወረዳ": String(10 + (w % 5)), "ድምር": String(10 + (w % 5)) }
    },
    form_17: {
      "በወረዳ ደረጃ": { "2015": "0", "2016": "0", "2017": "0" },
      "ጠቅላላ ድምር": { "2015": "0", "2016": "0", "2017": "0" },
      "በሶስቱ ዓመት የኦዲት ግኝቶችና የማስተካከያ ርምጃዎች": { "ጉድለት[በብር]": "0", "የተመለሰ": "0", "ያልተመለሰ": "0" }
    },
    form_17_1: {
      "በወረዳ ደረጃ": { "እቅድ": "1", "ክንውን": "1", "በ%": "100" },
      "ጠቅላላ ድምር": { "እቅድ": "1", "ክንውን": "1", "በ%": "100" },
      "ጠቅላላ የኦዲት ግኝቶች በብር": { "ጉድለት": "0", "የተመለሰ": "0", "ያልተመለሰ": "0" }
    },
    form_18: {
      "የአባልነት መዋጮ ገቢ": { "እቅድ": String(revPlan), "ክንውን": String(revDone), "%": String(pct(revDone, revPlan)) },
      "ልዩ ልዩ ገቢ(ድጋፍ፣ የመደመር መንግስት፤የመጽሄት ሽያጭ፣ ውዝፍ)": { "እቅድ": String(miscPlan), "ክንውን": String(miscDone), "%": String(pct(miscDone, miscPlan)) },
      "ለዋና ጽ/ቤት ፈሰስ %20 የተደረገ": { "እቅድ": "0", "ክንውን": "0", "%": "0" }
    },
    form_19: {
      "የኮሚሽን መድረክ": { "እቅድ": "6", "ክንውን": "6" },
      "የኮሚሽን ሥራ አመራር ኮሚቴ መድረክ": { "እቅድ": "18", "ክንውን": String(12 + (w % 5)) },
      "የኮሚሽኑ ቅ/ጽ/ቤት ማኔጅመንት ኮሚቴ መድረክ": { "እቅድ": "0", "ክንውን": "0" },
      "ለክልል ተጠሪ ከሆኑ ከዞን/ከተማ/ልዩ ወረዳ ኮሚሽን ጋር የተደረገ መድረክ": { "እቅድ": "0", "ክንውን": "0" },
      "ለክልል ተጠሪ ከሆኑ የዞን/ከተማ/ልዩ ወረዳ የኮሚሽን ቅ/ጽ/ቤት ኃላፊዎች ጋር የተደረገ መድረክ": { "እቅድ": "0", "ክንውን": "0" },
      "ከክልል/ከተማ ፓርቲ ቅ/ጽ/ቤት ሥራ አመራር ኮሚቴ ጋር የተደረገ": { "እቅድ": "0", "ክንውን": "0" }
    },
    form_20: {
      "ለፓርቲ ቅ/ጽ/ቤት እንዲያርሙ ግብረ-መልስ የተሰጠ የተጣሱ የአሰራር ሥርዓቶች ብዛት": String(4 + (w % 4)),
      "ከአባልነት ተባረው የተመለሱ ብዛት": "0",
      "ከኃላፊነት ተነስተው የተመለሱ አመራሮች ብዛት": "0",
      "በኢንስፔክሽን የተገኘ የፓርቲ መዋጮ የማይከፍሉ አባላት": { "ብዛት": "0", "ብር": "0" },
      "ለሌላ ዓላማ ውሎ የነበረ የተመለሰ የፓርቲ ገንዘብ ብዛት በብር": "0",
      "ኦዲት እንዲያስደርጉ የተደረገ የፓርቲ ቅ/ጽ/ቤት ብዛት": "1",
      "እንዲመለስ የተደረገ የኦዲት ግኝቶች በብር": "0",
      "የፓርቲ ንብረት እንዲመዘግቡ የተደረገ የፓርቲ ቅ/ጽ/ቤቶች": { "ብዛት": "1", "ንብረት": "-" },
      "ሌላ ካለ ይጨመር": ""
    },
    narration_report: {
      summary: `${YEAR} በጀት ዓመት የወረዳ የሥራ አፈጻጸም ሪፖርት`,
      challenges: 'የሰው ሀይል ክፍተት እና የተወሰነ የበጀት ውስንነት ያጋጠሙ ዋና ዋና ተግዳሮቶች ናቸው።',
      recommendations: 'ቀጣይነት ያለው የክህሎት ማሳደጊያ ስልጠናና የቁጥጥር ስራዎች እንዲጠናከሩ ይመከራል።'
    }
  };
}

async function main() {
  console.log('🗑️  Removing old dummy reports for 2018...');
  const { error: delErr } = await supabase
    .from('reports')
    .delete()
    .eq('year', YEAR)
    .eq('submitter_level', 'region');
  if (delErr) console.warn('Delete warning:', delErr.message);

  let ok = 0, failed = 0;
  const entries = Object.entries(WOREDA_USERS);

  for (let i = 0; i < entries.length; i++) {
    const [woreda, userId] = entries[i];
    for (const { label: period, code: periodCode } of PERIODS) {
      const formsData = gen(i);
      const title = `${woreda} — ${YEAR} ${period} ሪፖርት`;
      const row = {
        title,
        region: woreda,
        region_name: woreda,
        year: YEAR,
        budget_year: String(YEAR),
        period,
        period_category: periodCode,
        status: 'submitted',
        report_type: 'numerical',
        submitter_level: 'region',
        submitter_id: userId,
        user_id: userId,
        forms_data: formsData,
        submitted_at: new Date(Date.now() - rnd(1, 30) * 86400000).toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('reports').upsert(row, {
        onConflict: 'region,year,period',
        ignoreDuplicates: false,
      });

      if (error) {
        // Fallback insert without onConflict
        const { error: insErr } = await supabase.from('reports').insert(row);
        if (insErr) {
          console.error(`  ❌ ${woreda} (${period}):`, insErr.message);
          failed++;
        } else {
          ok++;
        }
      } else {
        ok++;
      }
    }
    process.stdout.write(`  [${i+1}/${entries.length}] ${woreda} ✓\n`);
  }

  console.log(`\n🎉 Done! Seeded ${ok} reports successfully. (${failed} failed)`);
}

main().catch(console.error);
