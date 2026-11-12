"use server";

import crypto from 'crypto';
import { notifyRegistration, notifyPasswordReset, notifyReportUpdate } from '@/lib/notify';
import { canSubmitReport, ReportPeriod } from '@/lib/et-calendar';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { createClient } from '@/utils/supabase/server';
import { sortFormSchemas } from '@/utils/schemaSort';
import { normalizePhoneToE164 } from '@/lib/phone';
import { getServerActiveWoreda } from '@/utils/supabase/server-woreda';
import { getWoredaConfig, WOREDAS_LIST } from '@/config/woredas';
import { requireAuthenticatedWoredaAdmin, verifyAdminUser } from '@/lib/adminAuth';

export async function createRepresentativeAction(formData: FormData) {
  try {
    const { activeWoreda } = await requireAuthenticatedWoredaAdmin();
    const woredaConfig = getWoredaConfig(activeWoreda);
    const fullName = (formData.get('fullName') as string)?.trim();
    const rawPhone = (formData.get('phone') as string)?.trim();
    const rawEmail = (formData.get('email') as string)?.trim() || undefined;
    const region = woredaConfig.name;

    if (!fullName || !rawPhone) {
      return { error: 'Missing required fields' };
    }

    const phone = normalizePhoneToE164(rawPhone);
    const syntheticEmail = `${phone.replace('+', '')}@federal.local`;

    const password = crypto.randomBytes(4).toString('hex'); // 8 characters

    let userId: string | null = null;

    // 1. Check if user already exists in public.users in this activeWoreda
    const phoneNoPlus = phone.replace('+', '');
    const phoneWith0 = `0${phone.replace(/^\+251/, '')}`;
    const { data: existingUsers } = await supabaseAdmin
      .from('users')
      .select('id, woreda_id')
      .eq('woreda_id', activeWoreda)
      .in('phone_number', [phone, phoneNoPlus, phoneWith0, rawPhone]);

    if (existingUsers && existingUsers.length > 0) {
      userId = existingUsers[0].id;
    }

    if (!userId) {
      // Check auth user using generateLink (bypasses listUsers 50 limit)
      const { data: linkData } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: syntheticEmail,
      });
      if (linkData?.user) {
        const candidateId = linkData.user.id;
        // Guard against hijacking a user belonging to a different woreda
        const metaWoreda = linkData.user.user_metadata?.woreda_id;
        if (metaWoreda && metaWoreda !== activeWoreda) {
          return { error: `ይህ ስልክ ቁጥር በሌላ ወረዳ (${metaWoreda}) የተመዘገበ ነው።` };
        }
        const { data: otherProf } = await supabaseAdmin
          .from('user_profiles')
          .select('woreda_id')
          .eq('user_id', candidateId)
          .maybeSingle();
        if (otherProf?.woreda_id && otherProf.woreda_id !== activeWoreda) {
          return { error: `ይህ ስልክ ቁጥር በሌላ ወረዳ (${otherProf.woreda_id}) የተመዘገበ ነው።` };
        }
        userId = candidateId;
      }
    }

    if (userId) {
      // User exists in this woreda — update password and user_metadata
      const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        email: syntheticEmail,
        email_confirm: true,
        password: password,
        user_metadata: {
          full_name: fullName,
          phone: phone,
          woreda_id: activeWoreda,
          region: region,
          role: 'representative',
          system_role: 'representative',
          requires_password_change: true,
          force_password_change: true
        }
      });
      if (updateErr) {
        console.error("Failed to update rep password:", updateErr);
        return { error: 'Failed to update user password: ' + updateErr.message };
      }
    } else {
      // Create new Auth user
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: syntheticEmail,
        email_confirm: true,
        password: password,
        user_metadata: {
          full_name: fullName,
          phone: phone,
          woreda_id: activeWoreda,
          region: region,
          role: 'representative',
          system_role: 'representative',
          requires_password_change: true,
          force_password_change: true
        }
      });

      if (authError) {
        if (authError.message.includes('already') || authError.message.includes('registered') || authError.message.includes('exists')) {
          const { data: linkData } = await supabaseAdmin.auth.admin.generateLink({ type: 'magiclink', email: syntheticEmail });
          if (linkData?.user) {
            const metaWoreda = linkData.user.user_metadata?.woreda_id;
            if (metaWoreda && metaWoreda !== activeWoreda) {
              return { error: `ይህ ስልክ ቁጥር በሌላ ወረዳ (${metaWoreda}) የተመዘገበ ነው።` };
            }
            userId = linkData.user.id;
            await supabaseAdmin.auth.admin.updateUserById(userId, {
              email: syntheticEmail,
              email_confirm: true,
              password: password,
              user_metadata: { full_name: fullName, phone: phone, woreda_id: activeWoreda, region: region, role: 'representative', system_role: 'representative', requires_password_change: true, force_password_change: true }
            });
          } else {
            return { error: authError.message };
          }
        } else {
          return { error: authError.message };
        }
      } else {
        userId = authData.user.id;
      }
    }

    // 2. Upsert public.users table strictly scoped to activeWoreda
    await supabaseAdmin
      .from('users')
      .upsert({ id: userId, phone_number: phone, full_name: fullName, woreda_id: activeWoreda });

    // 3. Upsert user_profiles table with role, region, and woreda_id
    const { error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .upsert({
        user_id: userId,
        system_role: 'representative',
        region: region,
        woreda_id: activeWoreda,
      }, { onConflict: 'user_id' });

    if (profileError) {
      return { error: 'Failed to update profile: ' + profileError.message };
    }

    // 4. Notify representative (SMS first → email fallback)
    const notifyResult = await notifyRegistration({
      phone,
      email: rawEmail,
      name: fullName,
      password,
      role: 'representative',
    });

    if (!notifyResult.smsDelivered && !notifyResult.emailDelivered) {
      return { success: true, smsDelivered: false, tempPassword: password, phone };
    }

    return { success: true, smsDelivered: notifyResult.smsDelivered, emailDelivered: notifyResult.emailDelivered };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteRepresentativeAction(userId: string) {
  try {
    const { activeWoreda } = await requireAuthenticatedWoredaAdmin();

    // Ensure the target representative belongs strictly to activeWoreda before deleting
    const { data: targetProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('user_id, woreda_id, system_role')
      .eq('user_id', userId)
      .eq('woreda_id', activeWoreda)
      .maybeSingle();

    if (!targetProfile || targetProfile.woreda_id !== activeWoreda) {
      return { error: 'Representative not found in your woreda.' };
    }

    // Delete from auth.admin (cascades to public.users and user_profiles)
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) {
      return { error: error.message };
    }

    // Fallback: also try to delete from public.users manually just in case
    await supabaseAdmin.from('users').delete().eq('id', userId).eq('woreda_id', activeWoreda);

    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function resetRepresentativePasswordAction(userId: string, phone: string, fullName: string) {
  try {
    const { activeWoreda } = await requireAuthenticatedWoredaAdmin();

    const { data: targetProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('user_id, woreda_id')
      .eq('user_id', userId)
      .eq('woreda_id', activeWoreda)
      .maybeSingle();

    if (!targetProfile || targetProfile.woreda_id !== activeWoreda) {
      return { error: 'Representative not found in your woreda.' };
    }

    const password = crypto.randomBytes(4).toString('hex'); // 8 characters

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password,
      user_metadata: { requires_password_change: true }
    });

    if (updateError) {
      return { error: 'Failed to reset password: ' + updateError.message };
    }

    const notifyResult = await notifyPasswordReset({
      phone,
      name: fullName,
      password,
      role: 'representative',
    });

    if (!notifyResult.smsDelivered && !notifyResult.emailDelivered) {
      return { success: true, smsDelivered: false, tempPassword: password };
    }

    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

function getPeriodCategory(period: string): string {
  if (period.includes('1ኛ')) return 'q1';
  if (period.includes('2ኛ')) return 'q2';
  if (period.includes('3ኛ')) return 'q3';
  if (period.includes('4ኛ')) return 'q4';
  return 'q3';
}

async function verifyReportCaller(targetUserId: string): Promise<{ activeWoreda: string; regionName: string } | { error: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Unauthorized: Authentication required.' };
  }

  const activeWoreda = await getServerActiveWoreda();
  const woredaConfig = getWoredaConfig(activeWoreda);

  const isAdmin = await verifyAdminUser(user.id, user.email);
  if (isAdmin) {
    return { activeWoreda, regionName: woredaConfig.name };
  }

  if (user.id !== targetUserId) {
    return { error: 'Forbidden: Cannot submit reports for another user.' };
  }

  const { data: repProfile } = await supabaseAdmin
    .from('user_profiles')
    .select('woreda_id, system_role')
    .eq('user_id', user.id)
    .eq('woreda_id', activeWoreda)
    .maybeSingle();

  if (!repProfile || repProfile.woreda_id !== activeWoreda) {
    return { error: 'Forbidden: User does not belong to this woreda.' };
  }

  return { activeWoreda, regionName: woredaConfig.name };
}

export async function saveReportFormAction(
  userId: string,
  region: string,
  year: number,
  period: ReportPeriod,
  formsData: any
) {
  try {
    const authCheck = await verifyReportCaller(userId);
    if ('error' in authCheck) {
      return { error: authCheck.error };
    }
    const { activeWoreda, regionName } = authCheck;

    // Check if period is valid
    if (!canSubmitReport(period)) {
      return { error: 'ሪፖርት ማቅረቢያ ጊዜ አይደለም። (Not in reporting window)' };
    }

    // Fetch current form schemas to snapshot
    const { data: schemas } = await supabaseAdmin.from('form_schemas').select('*');

    const payload = {
      user_id: userId,
      submitter_id: userId,
      woreda_id: activeWoreda,
      title: `የ${regionName} ${period} ሪፖርት`,
      report_type: 'numerical',
      budget_year: String(year),
      period_category: getPeriodCategory(period),
      submitter_level: 'woreda',
      region_name: regionName,
      region: regionName,
      year,
      period,
      forms_data: formsData,
      numerical_data: formsData,
      schema_snapshot: sortFormSchemas(schemas || []),
      status: 'draft',
      updated_at: new Date().toISOString()
    };

    // 1. Check if report already exists for (woreda_id, year, period)
    const { data: existingReports } = await supabaseAdmin
      .from('reports')
      .select('id')
      .eq('woreda_id', activeWoreda)
      .eq('year', year)
      .eq('period', period)
      .limit(1);

    if (existingReports && existingReports.length > 0) {
      const { error: updateError } = await supabaseAdmin
        .from('reports')
        .update(payload)
        .eq('id', existingReports[0].id)
        .eq('woreda_id', activeWoreda);

      if (updateError) return { error: updateError.message };
    } else {
      const { error: insertError } = await supabaseAdmin
        .from('reports')
        .insert(payload);

      if (insertError) return { error: insertError.message };
    }

    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function submitReportAction(
  userId: string,
  region: string,
  year: number,
  period: ReportPeriod,
  formsData: any
) {
  try {
    const authCheck = await verifyReportCaller(userId);
    if ('error' in authCheck) {
      return { error: authCheck.error };
    }
    const { activeWoreda, regionName } = authCheck;

    if (!canSubmitReport(period)) {
      return { error: 'ሪፖርት ማቅረቢያ ጊዜ አይደለም። (Not in reporting window)' };
    }

    // Fetch current form schemas to snapshot
    const { data: schemas } = await supabaseAdmin.from('form_schemas').select('*');

    const payload = {
      user_id: userId,
      submitter_id: userId,
      woreda_id: activeWoreda,
      title: `የ${regionName} ${period} ሪፖርት`,
      report_type: 'numerical',
      budget_year: String(year),
      period_category: getPeriodCategory(period),
      submitter_level: 'woreda',
      region_name: regionName,
      region: regionName,
      year,
      period,
      forms_data: formsData,
      numerical_data: formsData,
      schema_snapshot: sortFormSchemas(schemas || []),
      status: 'submitted',
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // 1. Check if report already exists for (woreda_id, year, period)
    const { data: existingReports } = await supabaseAdmin
      .from('reports')
      .select('id')
      .eq('woreda_id', activeWoreda)
      .eq('year', year)
      .eq('period', period)
      .limit(1);

    if (existingReports && existingReports.length > 0) {
      const { error: updateError } = await supabaseAdmin
        .from('reports')
        .update(payload)
        .eq('id', existingReports[0].id)
        .eq('woreda_id', activeWoreda);

      if (updateError) return { error: updateError.message };
    } else {
      const { error: insertError } = await supabaseAdmin
        .from('reports')
        .insert(payload);

      if (insertError) return { error: insertError.message };
    }

    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function provideAdminFeedbackAction(
  reportId: string,
  feedback: string
) {
  try {
    const { activeWoreda } = await requireAuthenticatedWoredaAdmin();

    const { data: report, error: fetchError } = await supabaseAdmin
      .from('reports')
      .select('region, user_id')
      .eq('id', reportId)
      .eq('woreda_id', activeWoreda)
      .single();

    if (fetchError || !report) return { error: 'Failed to fetch report details' };

    const { error } = await supabaseAdmin
      .from('reports')
      .update({
        admin_feedback: feedback,
        status: 'reviewed'
      })
      .eq('id', reportId)
      .eq('woreda_id', activeWoreda);

    if (error) return { error: error.message };

    // Send SMS notification to representative
    if (report.user_id) {
      const { data: user } = await supabaseAdmin
        .from('users')
        .select('phone_number, full_name')
        .eq('id', report.user_id)
        .single();

      if (user && (user.phone_number || (user as any).email)) {
        await notifyReportUpdate({
          phone: user.phone_number,
          email: (user as any).email,
          name: user.full_name || 'ተወካይ',
          subject: 'ICODiS — የሪፖርት ግብረ መልስ',
          message: `ለ${report.region} ባስገቡት ሪፖርት ላይ ግብረ መልስ ተሰጥቷል። እባክዎ ዳሽቦርድዎን ይጎብኙ።`,
          loginPath: '/representative/login',
        });
      }
    }

    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function approveReportAction(reportId: string) {
  try {
    const { activeWoreda } = await requireAuthenticatedWoredaAdmin();

    const { error } = await supabaseAdmin
      .from('reports')
      .update({
        status: 'approved'
      })
      .eq('id', reportId)
      .eq('woreda_id', activeWoreda);

    if (error) return { error: error.message };
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function uploadReportAttachmentAction(formData: FormData): Promise<{ url?: string; error?: string }> {
  try {
    const file = formData.get('file') as File;
    const year = (formData.get('year') as string) || 'general';
    const region = (formData.get('region') as string) || 'all';

    if (!file || file.size === 0) {
      return { error: 'No file provided' };
    }

    const sanitizeSegment = (str: string) => {
      return encodeURIComponent((str || '').trim())
        .replace(/%/g, '')
        .replace(/[^a-zA-Z0-9_-]/g, '_') || 'default';
    };

    const safeYear = sanitizeSegment(year);
    const safeRegion = sanitizeSegment(region);
    const fileExt = file.name.split('.').pop()?.replace(/[^a-zA-Z0-9]/g, '') || 'bin';
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const storagePath = `${safeYear}/${safeRegion}/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = file.type || 'application/octet-stream';

    let lastError: string = '';

    // 1. Try server client with user session
    try {
      const serverSupabase = await createClient();
      const { error: userUploadError } = await serverSupabase.storage
        .from('report_attachments')
        .upload(storagePath, buffer, {
          contentType,
          upsert: true,
        });

      if (!userUploadError) {
        const { data } = serverSupabase.storage
          .from('report_attachments')
          .getPublicUrl(storagePath);
        if (data?.publicUrl) return { url: data.publicUrl };
      } else {
        lastError = userUploadError.message;
      }
    } catch (e: any) {
      lastError = e?.message || String(e);
    }

    // 2. Try supabaseAdmin with candidate buckets
    const candidateBuckets = ['report_attachments', 'documents', 'public_files', 'complaints'];
    for (const bucket of candidateBuckets) {
      try {
        const { error: adminUploadError } = await supabaseAdmin.storage
          .from(bucket)
          .upload(storagePath, buffer, {
            contentType,
            upsert: true,
          });

        if (!adminUploadError) {
          const { data } = supabaseAdmin.storage
            .from(bucket)
            .getPublicUrl(storagePath);
          if (data?.publicUrl) return { url: data.publicUrl };
        } else {
          lastError = adminUploadError.message;
        }
      } catch (err: any) {
        lastError = err?.message || String(err);
      }
    }

    return { error: lastError || 'Failed to upload attachment' };
  } catch (err: any) {
    return { error: err.message || 'Unknown upload error' };
  }
}

export async function uploadFeedbackAttachmentAction(formData: FormData): Promise<{ url?: string; error?: string }> {
  try {
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'feedback_attachments';

    if (!file || file.size === 0) {
      return { error: 'No file provided' };
    }

    const fileExt = file.name.split('.').pop()?.replace(/[^a-zA-Z0-9]/g, '') || 'bin';
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const storagePath = `${folder}/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = file.type || 'application/octet-stream';

    let lastError: string = '';

    // 1. Try server client with user session
    try {
      const serverSupabase = await createClient();
      const { error: userUploadError } = await serverSupabase.storage
        .from('report_attachments')
        .upload(storagePath, buffer, {
          contentType,
          upsert: true,
        });

      if (!userUploadError) {
        const { data } = serverSupabase.storage
          .from('report_attachments')
          .getPublicUrl(storagePath);
        if (data?.publicUrl) return { url: data.publicUrl };
      } else {
        lastError = userUploadError.message;
      }
    } catch (e: any) {
      lastError = e?.message || String(e);
    }

    // 2. Try supabaseAdmin with candidate buckets
    const candidateBuckets = ['report_attachments', 'documents', 'public_files', 'complaints'];
    for (const bucket of candidateBuckets) {
      try {
        const { error: adminUploadError } = await supabaseAdmin.storage
          .from(bucket)
          .upload(storagePath, buffer, {
            contentType,
            upsert: true,
          });

        if (!adminUploadError) {
          const { data } = supabaseAdmin.storage
            .from(bucket)
            .getPublicUrl(storagePath);
          if (data?.publicUrl) return { url: data.publicUrl };
        } else {
          lastError = adminUploadError.message;
        }
      } catch (err: any) {
        lastError = err?.message || String(err);
      }
    }

    return { error: lastError || 'Failed to upload attachment' };
  } catch (err: any) {
    return { error: err.message || 'Upload error' };
  }
}

