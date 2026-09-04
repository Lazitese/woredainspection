/**
 * run-seed.js — Applies seed SQL by using supabase-js admin client
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
  console.error('Missing env vars'); process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// Woreda users
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

  const k_t = b(12+w), k_d = b(Math.floor(k_t*0.85));
  const h_t = b(8+w),  h_d = b(Math.floor(h_t*0.80));
  const t_t = 1+k_t+h_t, t_d = 1+k_d+h_d;

  const mW=b(5+w), mF=b(2+Math.floor(w/2));
  const kW=b(3*k_t), kF=b(Math.floor(kW*0.35));
  const hW=b(2*h_t), hF=b(Math.floor(hW*0.30));

  const s_exp=b(3+w), s_sec=b(1), s_drv=b(1), s_tot=s_exp+s_sec+s_drv;
  const dp=b(4), da=b(Math.floor(dp*0.88));
  const tpM=b(20+w), tpF=b(8+w), taM=b(Math.floor(tpM*0.85)), taF=b(Math.floor(tpF*0.85));
  const bg=b(150000+w*15000), bgA=b(Math.floor(bg*0.82));
  const phP=b(90+w), phA=b(Math.floor(phP*0.88));
  const mrP=b(70+w), mrA=b(Math.floor(mrP*0.85));
  const paP=b(50+w), paA=b(Math.floor(paP*0.90));
  const icP=b(40+w), icA=b(Math.floor(icP*0.87));
  const cR=b(15+w), cRes=b(Math.floor(cR*0.80)), cP=cR-cRes;
  const pa=(base)=>{const p=b(base+w*2);const a=b(Math.floor(p*(0.75+Math.random()*0.20)));return{"እቅድ":String(p),"ክንውን":String(a),"%":String(pct(a,p))};};

  return {
    form_01:{"ክ/ከተማ ተጠሪ የሆኑ ወረዳዎች":{"ብዛት":"1","ያዋቀሩ":"1","ያላዋቀሩ":"0"},"ለወረዳ ተጠሪ የሆኑ ቀበሌዎች":{"ብዛት":String(k_t),"ያዋቀሩ":String(k_d),"ያላዋቀሩ":String(k_t-k_d)},"በብልፅግና ህብረት ደረጃ":{"ብዛት":String(h_t),"ያዋቀሩ":String(h_d),"ያላዋቀሩ":String(h_t-h_d)},"ጠቅላላ ድምር":{"ብዛት":String(t_t),"ያዋቀሩ":String(t_d),"ያላዋቀሩ":String(t_t-t_d)},"ያዋቀሩ %":String(pct(t_d,t_t))},
    form_02:{"የክፍለ-ክ/ከተማ ኮሚሽን":{"ወ":"0","ሴ":"0","ድ":"0"},"የወረዳ ኮሚሽን":{"ወ":String(mW),"ሴ":String(mF),"ድ":String(mW+mF)},"የቀበሌ ኮሚሽን":{"ወ":String(kW),"ሴ":String(kF),"ድ":String(kW+kF)},"የብልፅግና ህብረት ኮሚሽን":{"ወ":String(hW),"ሴ":String(hF),"ድ":String(hW+hF)},"ጠቅላላ ድምር":{"ወ":String(mW+kW+hW),"ሴ":String(mF+kF+hF),"ድ":String(mW+kW+hW+mF+kF+hF)}},
    form_03:{"የወረዳ/ክ/ከተማ ኮሚሽን ጽ/ቤት":{"ጽ/ኃ":"1","ም/ክ":"1","ባለሙ":String(s_exp),"ጸሐ":String(s_sec),"ሹፌ":String(s_drv),"ድም":String(s_tot+2)},"ጠቅላላ ድምር":{"ጽ/ኃ":"1","ም/ክ":"1","ባለሙ":String(s_exp),"ጸሐ":String(s_sec),"ሹፌ":String(s_drv),"ድም":String(s_tot+2)}},
    form_04:{"የወረዳ/ክ/ከተማ ቅርንጫፍ ጽ/ቤት":{"እቅድ":String(dp),"ክንውን":String(da),"%":String(pct(da,dp))},"ጠቅላላ ድምር":{"እቅድ":String(dp),"ክንውን":String(da),"%":String(pct(da,dp))}},
    form_05:{"ስልጠናዎች":{"እቅድ":String(rnd(2,4)),"ክንውን":String(rnd(1,3)),"%":String(rnd(65,95))},"ስልጠና ተሳታፊዎች ወ":{"እቅድ":String(tpM),"ክንውን":String(taM),"%":String(pct(taM,tpM))},"ስልጠና ተሳታፊዎች ሴ":{"እቅድ":String(tpF),"ክንውን":String(taF),"%":String(pct(taF,tpF))},"ስልጠና ተሳታፊዎች ድ":{"እቅድ":String(tpM+tpF),"ክንውን":String(taM+taF),"%":String(pct(taM+taF,tpM+tpF))}},
    form_06_1:{"ዓ/አቀፍ በጀት":{"እቅድ":String(bg),"ክንውን":String(bgA),"%":String(pct(bgA,bg))},"ከፌደራል":{"እቅድ":String(Math.floor(bg*0.6)),"ክንውን":String(Math.floor(bgA*0.6)),"%":String(pct(bgA,bg))},"ከክ/ከተማ":{"እቅድ":String(Math.floor(bg*0.4)),"ክንውን":String(Math.floor(bgA*0.4)),"%":String(pct(bgA,bg))}},
    form_06_2:{"ደሞዝ":{"እቅድ":String(Math.floor(bg*0.55)),"ክንውን":String(Math.floor(bgA*0.55)),"%":String(pct(bgA,bg))},"ካፒታል":{"እቅድ":String(Math.floor(bg*0.20)),"ክንውን":String(Math.floor(bgA*0.20)),"%":String(pct(bgA,bg))},"አገልግሎት":{"እቅድ":String(Math.floor(bg*0.25)),"ክንውን":String(Math.floor(bgA*0.25)),"%":String(pct(bgA,bg))},"ጠቅላላ":{"እቅድ":String(bg),"ክንውን":String(bgA),"%":String(pct(bgA,bg))}},
    form_07:{"ዋና ትኩረቶች":{"እቅድ":String(phP),"ክንውን":String(phA),"%":String(pct(phA,phP))},"ያጠናቀቁ":{"ብዛት":String(phA),"ወ":String(Math.floor(phA*0.65)),"ሴ":String(Math.floor(phA*0.35))},"ያልጠናቀቁ":{"ብዛት":String(phP-phA)},"ያጠናቀቁ %":String(pct(phA,phP))},
    form_08:{"ዋና ትኩረቶች":{"እቅድ":String(mrP),"ክንውን":String(mrA),"%":String(pct(mrA,mrP))},"ያጠናቀቁ":{"ብዛት":String(mrA)},"ያልጠናቀቁ":{"ብዛት":String(mrP-mrA)},"ያጠናቀቁ %":String(pct(mrA,mrP))},
    form_09:{"ዋና ትኩረቶች":{"እቅድ":String(paP),"ክንውን":String(paA),"%":String(pct(paA,paP))},"ያጠናቀቁ":{"ብዛት":String(paA)},"ያልጠናቀቁ":{"ብዛት":String(paP-paA)},"ያጠናቀቁ %":String(pct(paA,paP))},
    form_10:{"ዋና ትኩረቶች":{"እቅድ":String(icP),"ክንውን":String(icA),"%":String(pct(icA,icP))},"ያጠናቀቁ":{"ብዛት":String(icA)},"ያልጠናቀቁ":{"ብዛት":String(icP-icA)},"ያጠናቀቁ %":String(pct(icA,icP))},
    form_11:{"የተቀበሉ":{"ወ":String(Math.floor(cR*0.6)),"ሴ":String(Math.floor(cR*0.4)),"ድ":String(cR)},"የተፈቱ":{"ወ":String(Math.floor(cRes*0.6)),"ሴ":String(Math.floor(cRes*0.4)),"ድ":String(cRes)},"ያልተፈቱ":{"ወ":String(Math.floor(cP*0.6)),"ሴ":String(Math.floor(cP*0.4)),"ድ":String(cP)},"የተፈቱ %":String(pct(cRes,cR))},
    form_12:{"ዋና ትኩረቶች":pa(60),"ያጠናቀቁ":{"ብዛት":String(b(50+w))},"ያልጠናቀቁ":{"ብዛት":String(b(10))},"ያጠናቀቁ %":String(rnd(72,95))},
    form_13:{"ዋና ትኩረቶች":pa(55),"ያጠናቀቁ":{"ብዛት":String(b(45+w))},"ያልጠናቀቁ":{"ብዛት":String(b(8))},"ያጠናቀቁ %":String(rnd(75,95))},
    form_14:{"ዋና ትኩረቶች":pa(30),"ያጠናቀቁ":{"ብዛት":String(b(25+w))},"ያልጠናቀቁ":{"ብዛት":String(b(5))},"ያጠናቀቁ %":String(rnd(78,96))},
    form_15:{"ዋና ትኩረቶች":pa(45),"ያጠናቀቁ":{"ብዛት":String(b(38+w))},"ያልጠናቀቁ":{"ብዛት":String(b(7))},"ያጠናቀቁ %":String(rnd(80,97))},
    form_16:{"ዋና ትኩረቶች":pa(35),"ያጠናቀቁ":{"ብዛት":String(b(30+w))},"ያልጠናቀቁ":{"ብዛት":String(b(5))},"ያጠናቀቁ %":String(rnd(82,95))},
    form_17:{"ዋና ትኩረቶች":pa(25),"ያጠናቀቁ":{"ብዛት":String(b(22+w))},"ያልጠናቀቁ":{"ብዛት":String(b(3))},"ያጠናቀቁ %":String(rnd(83,97))},
    form_18:{"ዋና ትኩረቶች":pa(20),"ያጠናቀቁ":{"ብዛት":String(b(18+w))},"ያልጠናቀቁ":{"ብዛት":String(b(3))},"ያጠናቀቁ %":String(rnd(85,97))},
    form_19:{"ዋና ትኩረቶች":pa(18),"ያጠናቀቁ":{"ብዛት":String(b(15+w))},"ያልጠናቀቁ":{"ብዛት":String(b(3))},"ያጠናቀቁ %":String(rnd(80,95))},
    form_20:{"ዋና ትኩረቶች":pa(22),"ያጠናቀቁ":{"ብዛት":String(b(19+w))},"ያልጠናቀቁ":{"ብዛት":String(b(3))},"ያጠናቀቁ %":String(rnd(82,96))},
    form_21:{"ዋና ትኩረቶች":pa(28),"ያጠናቀቁ":{"ብዛት":String(b(24+w))},"ያልጠናቀቁ":{"ብዛት":String(b(4))},"ያጠናቀቁ %":String(rnd(80,95))},
    form_22:{"ዋና ትኩረቶች":pa(32),"ያጠናቀቁ":{"ብዛት":String(b(28+w))},"ያልጠናቀቁ":{"ብዛት":String(b(4))},"ያጠናቀቁ %":String(rnd(83,97))},
    form_23:{"ዋና ትኩረቶች":pa(40),"ያጠናቀቁ":{"ብዛት":String(b(35+w))},"ያልጠናቀቁ":{"ብዛት":String(b(5))},"ያጠናቀቁ %":String(rnd(82,96))},
    form_24:{"ዋና ትኩረቶች":pa(15),"ያጠናቀቁ":{"ብዛት":String(b(13+w))},"ያልጠናቀቁ":{"ብዛት":String(b(2))},"ያጠናቀቁ %":String(rnd(85,97))},
    form_25:{"ዋና ትኩረቶች":pa(12),"ያጠናቀቁ":{"ብዛት":String(b(10+w))},"ያልጠናቀቁ":{"ብዛት":String(b(2))},"ያጠናቀቁ %":String(rnd(83,97))},
    narration_report:{summary:`${YEAR} በጀት ዓመት ሪፖርት`,challenges:'የሰው ሀይል ክፍተት እና የበጀት ውስንነት ዋና ተግዳሮቶች ናቸው።',recommendations:'ከፍተኛ ስልጠናና የሀብት ማሰባሰብ ያስፈልጋል።'}
  };
}

async function main() {
  // Delete old dummy data
  console.log('🗑️  Removing old dummy data...');
  const { error: delErr } = await supabase
    .from('reports')
    .delete()
    .eq('year', YEAR)
    .eq('submitter_level', 'woreda')
    .eq('status', 'submitted');
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
        report_type: 'numerical',
        period_category: periodCode,
        budget_year: String(YEAR),
        submitter_id: userId,
        submitter_level: 'region',
        region_name: woreda,
        status: 'submitted',
        forms_data: formsData,
        year: YEAR,
        period,
        submitted_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('reports').insert(row);
      if (error) {
        failed++;
        console.error(`❌ ${woreda} | ${period}: ${error.message}`);
      } else {
        ok++;
        process.stdout.write(`✅ ${ok}/${entries.length * PERIODS.length} ${woreda} ${period}\r`);
      }
    }
  }

  console.log(`\n\n📊 Done: ${ok} inserted, ${failed} failed`);
}

main().catch(console.error);
