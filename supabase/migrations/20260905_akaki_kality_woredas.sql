-- Migration: 20260905_akaki_kality_woredas.sql
-- Description: Updates administrative regions to Akaki Kality Sub-City 17 Woredas (Woreda 1-13 excluding 11, and Special Woredas 1-5)

-- 1. Add new Woreda values to ethiopia_region enum if it exists
DO $$ BEGIN
  ALTER TYPE public.ethiopia_region ADD VALUE IF NOT EXISTS 'ወረዳ 1';
  ALTER TYPE public.ethiopia_region ADD VALUE IF NOT EXISTS 'ወረዳ 2';
  ALTER TYPE public.ethiopia_region ADD VALUE IF NOT EXISTS 'ወረዳ 3';
  ALTER TYPE public.ethiopia_region ADD VALUE IF NOT EXISTS 'ወረዳ 4';
  ALTER TYPE public.ethiopia_region ADD VALUE IF NOT EXISTS 'ወረዳ 5';
  ALTER TYPE public.ethiopia_region ADD VALUE IF NOT EXISTS 'ወረዳ 6';
  ALTER TYPE public.ethiopia_region ADD VALUE IF NOT EXISTS 'ወረዳ 7';
  ALTER TYPE public.ethiopia_region ADD VALUE IF NOT EXISTS 'ወረዳ 8';
  ALTER TYPE public.ethiopia_region ADD VALUE IF NOT EXISTS 'ወረዳ 9';
  ALTER TYPE public.ethiopia_region ADD VALUE IF NOT EXISTS 'ወረዳ 10';
  ALTER TYPE public.ethiopia_region ADD VALUE IF NOT EXISTS 'ወረዳ 12';
  ALTER TYPE public.ethiopia_region ADD VALUE IF NOT EXISTS 'ወረዳ 13';
  ALTER TYPE public.ethiopia_region ADD VALUE IF NOT EXISTS 'ልዩ ወረዳ 1';
  ALTER TYPE public.ethiopia_region ADD VALUE IF NOT EXISTS 'ልዩ ወረዳ 2';
  ALTER TYPE public.ethiopia_region ADD VALUE IF NOT EXISTS 'ልዩ ወረዳ 3';
  ALTER TYPE public.ethiopia_region ADD VALUE IF NOT EXISTS 'ልዩ ወረዳ 4';
  ALTER TYPE public.ethiopia_region ADD VALUE IF NOT EXISTS 'ልዩ ወረዳ 5';
EXCEPTION WHEN others THEN NULL;
END $$;

-- 2. Alter user_profiles.region column to TEXT so any future woreda changes never fail on enum constraints
DO $$ BEGIN
  ALTER TABLE public.user_profiles ALTER COLUMN region TYPE text;
EXCEPTION WHEN others THEN NULL;
END $$;

-- 3. Update any existing default category titles in sletena_categories
UPDATE public.sletena_categories
SET title = 'የአቃቂ ቃሊቲ ክ/ከተማ ብልጽግና የኢንስፔክሽንና የስነ ምግባር ኮሚሽን ፅ/ቤት የስልጠና ፍላጎት ማሰበሰቢያ ቅጽ'
WHERE title LIKE '%የብልፅግና የኢንስፔክሽንና የሥነ-ምግባር ኮሚሽን ዋና ጽ/ቤት%' AND category_type = 'NEED';

UPDATE public.sletena_categories
SET title = 'የአቃቂ ቃሊቲ ክ/ከተማ ብልጽግና የኢንስፔክሽንና የስነ ምግባር ኮሚሽን ፅ/ቤት የድህረ-ስልጠና ዕርካታ ምዘና ቅጽ'
WHERE title LIKE '%የብልፅግና የኢንስፔክሽንና የሥነ-ምግባር ኮሚሽን ዋና ጽ/ቤት%' AND category_type = 'SATISFACTION';
