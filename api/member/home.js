import { getSupabaseAdmin, normalizeProfile } from "../_member-utils.js";

function getTaiwanToday() {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Taipei",
  }).format(new Date());
}

function buildFallbackInsight(profile) {
  const name = profile?.nickname || profile?.line_display_name || "你";
  const lifeNumber = profile?.life_number || profile?.numerology_number;
  const bloodType = profile?.blood_type;

  if (bloodType && lifeNumber) {
    return `${name}，你的 ${bloodType} 型節奏和生命靈數 ${lifeNumber} 都提醒我們：今天先把身體照顧好，穩定就是最好的前進。`;
  }

  return `${name}，今天先從一個小行動開始。完成飲用、記錄感受，讓植本邏輯慢慢累積更懂你的健康資料。`;
}

async function readMemberAnnouncements(supabase) {
  const baseSelect = "id,title,summary,content,published_at,is_pinned,status";

  const withAudience = await supabase
    .from("announcements")
    .select(`${baseSelect},audience,event_id`)
    .eq("status", "published")
    .in("audience", ["all", "member"])
    .order("is_pinned", { ascending: false })
    .order("published_at", { ascending: false })
    .limit(3);

  if (!withAudience.error) return withAudience.data || [];

  const fallback = await supabase
    .from("announcements")
    .select(baseSelect)
    .eq("status", "published")
    .order("is_pinned", { ascending: false })
    .order("published_at", { ascending: false })
    .limit(3);

  if (fallback.error) {
    console.error("[member/home] announcements lookup failed:", fallback.error.message);
    return [];
  }

  return fallback.data || [];
}

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

    const today = getTaiwanToday();
    const [
      checkinResult,
      reportsResult,
      latestReportResult,
      announcements,
    ] = await Promise.all([
      supabase
        .from("daily_checkins")
        .select("id,checkin_date,le_earned,le_awarded,mood_score,energy_level,energy_score")
        .eq("member_id", profile.id)
        .eq("checkin_date", today)
        .maybeSingle(),
      supabase
        .from("dr_marvin_reports")
        .select("id", { count: "exact", head: true })
        .eq("profile_id", profile.id),
      supabase
        .from("dr_marvin_reports")
        .select("id,report_type,health_score,recommended_product_id,created_at")
        .eq("profile_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      readMemberAnnouncements(supabase),
    ]);

    if (checkinResult.error) console.error("[member/home] checkin lookup failed:", checkinResult.error.message);
    if (reportsResult.error) console.error("[member/home] reports count failed:", reportsResult.error.message);
    if (latestReportResult.error) console.error("[member/home] latest report failed:", latestReportResult.error.message);

    const normalizedProfile = normalizeProfile(profile);
    const todayCheckin = checkinResult.error ? null : checkinResult.data;
    const latestReport = latestReportResult.error ? null : latestReportResult.data;

    return res.status(200).json({
      profile: normalizedProfile,
      today,
      today_checkin: todayCheckin,
      has_checked_in_today: Boolean(todayCheckin),
      daily_insight: profile.daily_insight || buildFallbackInsight(profile),
      daily_insight_generated: Boolean(profile.daily_insight),
      reports_count: reportsResult.error ? 0 : reportsResult.count || 0,
      latest_report: latestReport,
      announcements,
      feature_grid: [
        { id: "checkin", label: "今日打卡", path: "/line/checkin", status: todayCheckin ? "done" : "ready" },
        { id: "reports", label: "我的報告", path: "/line/reports", status: latestReport ? "ready" : "empty" },
        { id: "assessment", label: "My Dr. Marvin", path: "/line/assessment", status: "ready" },
        { id: "shop", label: "植萃商城", path: "/line/shop", status: "ready" },
        { id: "tasks", label: "任務中心", path: "/line/tasks", status: "preview" },
        { id: "profile", label: "我的帳戶", path: "/line/profile", status: "ready" },
        { id: "referral", label: "推薦好友", path: "/line/referral", status: "ready" },
        { id: "events", label: "最新活動", path: "/line/events", status: "preview" },
      ],
    });
  } catch (error) {
    console.error("[member/home] failed:", error);
    return res.status(500).json({ error: error.message });
  }
}
