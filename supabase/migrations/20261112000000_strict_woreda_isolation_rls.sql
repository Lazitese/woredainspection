-- Strictly bind authenticated RLS checks and Postgres helper functions to the active Woreda tenant.
-- Prevents any authenticated user from spoofing x-woreda-id to read/write another Woreda's data.

CREATE OR REPLACE FUNCTION public.user_belongs_to_woreda(uid uuid, target_woreda text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT
    EXISTS (
      SELECT 1 FROM public.admin_profiles ap
      WHERE ap.id = uid AND ap.woreda_id = target_woreda AND (ap.status = 'Active' OR ap.status IS NULL)
    )
    OR EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.user_id = uid AND up.woreda_id = target_woreda
    )
    OR EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = uid AND u.woreda_id = target_woreda
    )
    OR EXISTS (
      SELECT 1 FROM public.period_members pm
      WHERE pm.user_id = uid AND pm.woreda_id = target_woreda
    );
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = auth.uid()
      AND role IN ('super_admin', 'admin', 'committee_leader')
      AND (status = 'Active' OR status IS NULL)
      AND woreda_id = public.get_active_woreda()
  );
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = auth.uid()
      AND role = 'super_admin'
      AND (status = 'Active' OR status IS NULL)
      AND woreda_id = public.get_active_woreda()
  );
$$;

DO $$
DECLARE
  tbl text;
  strict_tables text[] := ARRAY[
    'admin_profiles',
    'approver_evaluations',
    'assessment_periods',
    'complaints',
    'document_access_logs',
    'documents',
    'evaluations',
    'feedbacks',
    'final_scores',
    'news_articles',
    'page_views',
    'period_members',
    'personnel',
    'public_files',
    'qr_codes',
    'report_feedbacks',
    'reporting_profiles',
    'reports',
    'scan_requests',
    'self_assessments',
    'sletena_categories',
    'sletena_satisfaction_submissions',
    'sletena_submissions',
    'user_profiles',
    'users'
  ];
BEGIN
  FOREACH tbl IN ARRAY strict_tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS woreda_tenant_isolation ON public.%I;', tbl);
    EXECUTE format($policy$
      CREATE POLICY woreda_tenant_isolation ON public.%I
      AS RESTRICTIVE
      FOR ALL
      TO public
      USING (
        woreda_id = public.get_active_woreda()
        AND (auth.uid() IS NULL OR public.user_belongs_to_woreda(auth.uid(), woreda_id))
      )
      WITH CHECK (
        woreda_id = public.get_active_woreda()
        AND (auth.uid() IS NULL OR public.user_belongs_to_woreda(auth.uid(), woreda_id))
      );
    $policy$, tbl);
  END LOOP;
END $$;

DROP POLICY IF EXISTS woreda_tenant_isolation ON public.document_folders;
DROP POLICY IF EXISTS woreda_tenant_isolation_select ON public.document_folders;
DROP POLICY IF EXISTS woreda_tenant_isolation_insert ON public.document_folders;
DROP POLICY IF EXISTS woreda_tenant_isolation_update ON public.document_folders;
DROP POLICY IF EXISTS woreda_tenant_isolation_delete ON public.document_folders;

CREATE POLICY woreda_tenant_isolation_select ON public.document_folders
  AS RESTRICTIVE FOR SELECT TO public
  USING (
    woreda_id = 'all'::text
    OR (
      woreda_id = public.get_active_woreda()
      AND (auth.uid() IS NULL OR public.user_belongs_to_woreda(auth.uid(), woreda_id))
    )
  );

CREATE POLICY woreda_tenant_isolation_insert ON public.document_folders
  AS RESTRICTIVE FOR INSERT TO public
  WITH CHECK (
    woreda_id = public.get_active_woreda()
    AND (auth.uid() IS NULL OR public.user_belongs_to_woreda(auth.uid(), woreda_id))
  );

CREATE POLICY woreda_tenant_isolation_update ON public.document_folders
  AS RESTRICTIVE FOR UPDATE TO public
  USING (
    woreda_id = public.get_active_woreda()
    AND (auth.uid() IS NULL OR public.user_belongs_to_woreda(auth.uid(), woreda_id))
  )
  WITH CHECK (
    woreda_id = public.get_active_woreda()
    AND (auth.uid() IS NULL OR public.user_belongs_to_woreda(auth.uid(), woreda_id))
  );

CREATE POLICY woreda_tenant_isolation_delete ON public.document_folders
  AS RESTRICTIVE FOR DELETE TO public
  USING (
    woreda_id = public.get_active_woreda()
    AND (auth.uid() IS NULL OR public.user_belongs_to_woreda(auth.uid(), woreda_id))
  );
