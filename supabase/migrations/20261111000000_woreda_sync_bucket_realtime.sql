-- Enum additions required by admin-provisioning & woreda11
ALTER TYPE public.admin_role ADD VALUE IF NOT EXISTS 'committee_leader';
ALTER TYPE public.ethiopia_region ADD VALUE IF NOT EXISTS 'ወረዳ 11';

-- Ensure report_attachments storage bucket exists and is accessible
INSERT INTO storage.buckets (id, name, public)
VALUES ('report_attachments', 'report_attachments', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Allow public insert to report_attachments" ON storage.objects;
CREATE POLICY "Allow public insert to report_attachments"
ON storage.objects FOR INSERT TO public
WITH CHECK (bucket_id = 'report_attachments'::text);

DROP POLICY IF EXISTS "Allow public select from report_attachments" ON storage.objects;
CREATE POLICY "Allow public select from report_attachments"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'report_attachments'::text);

DROP POLICY IF EXISTS "Allow authenticated update in report_attachments" ON storage.objects;
CREATE POLICY "Allow authenticated update in report_attachments"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'report_attachments'::text);

DROP POLICY IF EXISTS "Allow authenticated delete in report_attachments" ON storage.objects;
CREATE POLICY "Allow authenticated delete in report_attachments"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'report_attachments'::text);

-- Harden helper checks
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = auth.uid()
      AND role IN ('super_admin', 'admin', 'committee_leader')
      AND (status = 'Active' OR status IS NULL)
  );
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = auth.uid()
      AND role = 'super_admin'
      AND (status = 'Active' OR status IS NULL)
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO authenticated, anon;

-- Ensure Sletena tables are published to supabase_realtime
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'sletena_categories'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.sletena_categories;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'sletena_submissions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.sletena_submissions;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'sletena_satisfaction_submissions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.sletena_satisfaction_submissions;
  END IF;
END $$;
