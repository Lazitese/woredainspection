# 🔐 የአቃቂ ቃሊቲ ክ/ከተማ ብልጽግና የኢንስፔክሽንና የስነ ምግባር ኮሚሽን ፅ/ቤት — የተጠቃሚዎች መለያ ዝርዝር (System Credentials)

> **የመረጃ ደህንነት ማስታወሻ (Confidentiality Notice):**  
> ይህ ሰነድ ለአቃቂ ቃሊቲ ክ/ከተማ የኢንስፔክሽንና የስነ ምግባር ኮሚሽን ፅ/ቤት ዋና አስተዳዳሪዎች እና ለ17ቱ ወረዳዎች ተወካዮች የተዘጋጁ ይፋዊ የመግቢያ መለያዎችን የያዘ ነው።  
> **የዳታቤዝ አገልጋይ (Database Host):** `https://akdb.raey.work`  
> **የተዘጋጀበት ቀን (Generated At):** መስከረም 2026 (September 2026)

---

## 🌐 የፖርታል መግቢያ አድራሻዎች (Portal URLs)

| ፖርታል (Portal) | አድራሻ (URL) | ዓላማ (Purpose) |
| :--- | :--- | :--- |
| **የዋና አስተዳዳሪ ፖርታል (Admin Portal)** | [`/auth/login`](http://localhost:3000/auth/login) | አጠቃላይ ዳሽቦርድ፣ ስታትስቲክስ፣ የቅጾች ማስተካከያ፣ የተጠቃሚዎች አስተዳደር |
| **የወረዳ ተወካዮች ፖርታል (Representative Portal)** | [`/representative/login`](http://localhost:3000/representative/login) | የወረዳ የኢንስፔክሽን ሪፖርቶች ማቅረቢያና ታሪክ መመልከቻ |
| **የአቤቱታና ስነ-ምግባር ኮሚቴ ፖርታል (Complaints Portal)** | [`/complaint/login`](http://localhost:3000/complaint/login) | የህዝብና የሰራተኛ አቤቱታዎች ክትትልና ውሳኔ ማጽደቂያ |

---

## 🏛️ 1. የዋና ጽ/ቤት አስተዳዳሪዎች (Central Administration & Leadership)

| ተ.ቁ | የሥራ ኃላፊነት (Title / Office) | የመግቢያ ስልክ (Phone) | የመግቢያ ኢሜይል (Email / Username) | የይለፍ ቃል (Password) | ሚና (Role) | የመግቢያ ገጽ |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **የአቃቂ ቃሊቲ ክ/ከተማ ዋና አስተዳዳሪ (Super Admin)** | `0911000000` / `+251911000000` | `admin@akakikality.gov.et` *(ወይም `admin`)* | `Akaki@Admin2026!` | `super_admin` | [`/auth/login`](http://localhost:3000/auth/login) |
| **2** | **የኮሚሽን ጽ/ቤት ሃላፊ (Complaints Committee Leader)** | `0911000099` / `+251911000099` | `complaints.leader@akakikality.gov.et` | `Akaki@Complaints2026!` | `committee_leader` | [`/complaint/login`](http://localhost:3000/complaint/login) |

> 💡 **ማስታወሻ:** ዋና አስተዳዳሪው በስልክ ቁጥር (`0911000000`)፣ በኢሜይል (`admin@akakikality.gov.et`) ወይም በተጠቃሚ ስም (`admin`) መግባት ይችላል።

---

## 🏢 2. የ17ቱ ወረዳዎች ተወካዮች መለያ ዝርዝር (17 Woreda Representatives)

> ⚠️ **ማሳሰቢያ:** ወረዳ 11 እንደተገለጸው በአስተዳደራዊ መዋቅሩ ውስጥ ያልተካተተ (Excluded) ሲሆን፣ አጠቃላይ 17ቱ ወረዳዎች **ወረዳ 1–10**፣ **ወረዳ 12–13** እና **ልዩ ወረዳ 1–5** ናቸው።  
> ተወካዮች በስልክ ቁጥራቸው (ምሳሌ፡ `0911000001`) ወይም በይፋዊ ኢሜይላቸው (ምሳሌ፡ `woreda1@akakikality.gov.et`) በቀጥታ መግባት ይችላሉ።

| ተ.ቁ | ወረዳ (Woreda Name) | የመግቢያ ስልክ ቁጥር (Phone) | ይፋዊ ኢሜይል (Official Email) | የይለፍ ቃል (Password) | የተመደበው ወረዳ (Region Scope) | የመግቢያ ገጽ |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **ወረዳ 1** | `0911000001` | `woreda1@akakikality.gov.et` | `Woreda01@2026!` | `ወረዳ 1` | [`/representative/login`](http://localhost:3000/representative/login) |
| **2** | **ወረዳ 2** | `0911000002` | `woreda2@akakikality.gov.et` | `Woreda02@2026!` | `ወረዳ 2` | [`/representative/login`](http://localhost:3000/representative/login) |
| **3** | **ወረዳ 3** | `0911000003` | `woreda3@akakikality.gov.et` | `Woreda03@2026!` | `ወረዳ 3` | [`/representative/login`](http://localhost:3000/representative/login) |
| **4** | **ወረዳ 4** | `0911000004` | `woreda4@akakikality.gov.et` | `Woreda04@2026!` | `ወረዳ 4` | [`/representative/login`](http://localhost:3000/representative/login) |
| **5** | **ወረዳ 5** | `0911000005` | `woreda5@akakikality.gov.et` | `Woreda05@2026!` | `ወረዳ 5` | [`/representative/login`](http://localhost:3000/representative/login) |
| **6** | **ወረዳ 6** | `0911000006` | `woreda6@akakikality.gov.et` | `Woreda06@2026!` | `ወረዳ 6` | [`/representative/login`](http://localhost:3000/representative/login) |
| **7** | **ወረዳ 7** | `0911000007` | `woreda7@akakikality.gov.et` | `Woreda07@2026!` | `ወረዳ 7` | [`/representative/login`](http://localhost:3000/representative/login) |
| **8** | **ወረዳ 8** | `0911000008` | `woreda8@akakikality.gov.et` | `Woreda08@2026!` | `ወረዳ 8` | [`/representative/login`](http://localhost:3000/representative/login) |
| **9** | **ወረዳ 9** | `0911000009` | `woreda9@akakikality.gov.et` | `Woreda09@2026!` | `ወረዳ 9` | [`/representative/login`](http://localhost:3000/representative/login) |
| **10** | **ወረዳ 10** | `0911000010` | `woreda10@akakikality.gov.et` | `Woreda10@2026!` | `ወረዳ 10` | [`/representative/login`](http://localhost:3000/representative/login) |
| **11** | **ወረዳ 12** | `0911000012` | `woreda12@akakikality.gov.et` | `Woreda12@2026!` | `ወረዳ 12` | [`/representative/login`](http://localhost:3000/representative/login) |
| **12** | **ወረዳ 13** | `0911000013` | `woreda13@akakikality.gov.et` | `Woreda13@2026!` | `ወረዳ 13` | [`/representative/login`](http://localhost:3000/representative/login) |
| **13** | **ልዩ ወረዳ 1** | `0911000021` | `specialworeda1@akakikality.gov.et` | `SpecialWoreda01@2026!` | `ልዩ ወረዳ 1` | [`/representative/login`](http://localhost:3000/representative/login) |
| **14** | **ልዩ ወረዳ 2** | `0911000022` | `specialworeda2@akakikality.gov.et` | `SpecialWoreda02@2026!` | `ልዩ ወረዳ 2` | [`/representative/login`](http://localhost:3000/representative/login) |
| **15** | **ልዩ ወረዳ 3** | `0911000023` | `specialworeda3@akakikality.gov.et` | `SpecialWoreda03@2026!` | `ልዩ ወረዳ 3` | [`/representative/login`](http://localhost:3000/representative/login) |
| **16** | **ልዩ ወረዳ 4** | `0911000024` | `specialworeda4@akakikality.gov.et` | `SpecialWoreda04@2026!` | `ልዩ ወረዳ 4` | [`/representative/login`](http://localhost:3000/representative/login) |
| **17** | **ልዩ ወረዳ 5** | `0911000025` | `specialworeda5@akakikality.gov.et` | `SpecialWoreda05@2026!` | `ልዩ ወረዳ 5` | [`/representative/login`](http://localhost:3000/representative/login) |

---

## 🛠️ አጠቃቀምና ማረጋገጫ (Usage & Verification Details)

1. **የመግቢያ ዘዴ (Authentication Options):**
   - ተወካዮች በ**ስልክ ቁጥር** (በ `09110000XX` ወይም `+2519110000XX` ቅርጸት) መግባት ይችላሉ።
   - እንዲሁም በ**ይፋዊ ኢሜይል** (ምሳሌ፡ `woreda1@akakikality.gov.et`) መግባት ይችላሉ።
2. **ራስ-ሰር ማረጋገጫ (Verification):**
   - ሁሉም 19 አካውንቶች በዳታቤዙ ውስጥ ሙሉ በሙሉ የገበሩ (Active and Confirmed) ሲሆኑ፣ የመጀመሪያ የይለፍ ቃል ማስገደድ (Force password reset) አይጠይቁም።
   - ሁሉም መለያዎች በራስ-ሰር የተፈተኑና በስኬት የተረጋገጡ (100% Verified) ናቸው።
3. **የመረጃ ቋት ሰንጠረዦች (Database Tables Linked):**
   - `auth.users` — ደህንነቱ የተጠበቀ ምስጠራና ማረጋገጫ
   - `public.users` — ስም እና የስልክ ቁጥር መረጃ
   - `public.user_profiles` — የተወካይ ሚና እና የተመደበው ወረዳ (`region`)
   - `public.reporting_profiles` — የሪፖርት አቀራረብ ደረጃ (`hierarchy_level = 'woreda'`)
   - `public.admin_profiles` — የአስተዳዳሪ ፍቃዶች እና የሞጁል አስተዳደር
