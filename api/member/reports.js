import { getSupabaseAdmin, normalizeProfile } from "../_member-utils.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const lineUserId = req.query?.lineUserId || req.query?.line_user_id;
  if (!lineUserId || typeof lineUserId !== "string" || !lineUserId.startsWith("U")) {
    return res.status(400).json({ error: "Invalid LINE userId" });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("line_user_id", lineUserId)
      .maybeSingle();

    if (profileError) throw profileError;
    if (!profile) return res.status(404).json({ error: "Member not found" });

    const { data: drReports, error: drError } = await supabase
      .from("dr_marvin_reports")
      .select("id,report_type,answers,scores,health_score,recommended_product_id,report_content,le_awarded,created_at")
      .eq("profile_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (drError) throw drError;

    let quickReports = [];
    const quickResult = await supabase
      .from("assessment_reports")
      .select("id,created_at,inflammation_level,recommended_products,recommended_product,system_scores,ai_analysis,lifestyle_advice")
      .eq("line_user_id", lineUserId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (!quickResult.error) quickReports = quickResult.data || [];

    return res.status(200).json({
      profile: normalizeProfile(profile),
      reports: (drReports || []).map((report) => ({ ...report, source: "dr_marvin" })),
      quick_reports: quickReports.map((report) => ({ ...report, source: "website_quick" })),
    });
  } catch (error) {
    console.error("[member/reports] failed:", error);
    return res.status(500).json({ error: error.message });
  }
}
