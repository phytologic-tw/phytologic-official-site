import { calcLevel, calcTitle, getSupabaseAdmin, normalizeProfile } from "../src/server/member-utils.js";

const TASK_REWARDS = {
  profile_complete: { type: "starter", le: 30, cp: 0, label: "完成會員建檔" },
  daily_checkin: { type: "daily", le: 5, cp: 0, label: "完成今日飲用打卡" },
  dr_marvin_complete: { type: "starter", le: 0, cp: 50, label: "完成 My Dr. Marvin" },
  weekly_3_checkins: { type: "weekly", le: 20, cp: 10, label: "本週完成 3 次打卡" },
  weekly_5_checkins: { type: "weekly", le: 35, cp: 20, label: "本週完成 5 次打卡" },
  seven_day_complete: { type: "milestone", le: 100, cp: 100, label: "完成七日啟動" },
};

function getTaiwanToday() {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Taipei",
  }).format(new Date());
}

function getTaiwanWeekKey(today) {
  const date = new Date(`${today}T00:00:00+08:00`);
  const day = date.getDay() || 7;
  date.setDate(date.getDate() + 4 - day);
  const yearStart = new Date(`${date.getFullYear()}-01-01T00:00:00+08:00`);
  const week = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  return `${date.getFullYear()}-W${String(week).padStart(2, "0")}`;
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

function normalizeConcerns(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return String(value).split(",").map((item) => item.trim()).filter(Boolean);
}

function getMissingProfileFields(profile) {
  const fields = [
    ["nickname", "暱稱", profile.nickname || profile.line_display_name],
    ["birth_date", "生日", profile.birth_date || profile.birthdate],
    ["gender", "性別", profile.gender],
    ["blood_type", "血型", profile.blood_type],
    ["city", "居住城市", profile.city],
    ["sleep_hours", "睡眠時間", profile.sleep_hours],
    ["diet_pattern", "飲食習慣", profile.diet_pattern || profile.diet_type],
    ["stress_level", "壓力感受", profile.stress_level],
    ["health_concerns", "在意部位", normalizeConcerns(profile.health_concerns).length > 0],
  ];

  return fields
    .filter(([, , value]) => !value)
    .map(([id, label]) => ({ id, label }));
}

function buildSevenDayPlan(profile, today) {
  const startDate = profile.seven_day_start_date || today;
  const start = new Date(`${startDate}T00:00:00+08:00`);
  const current = new Date(`${today}T00:00:00+08:00`);
  const rawDay = Math.floor((current - start) / 86400000) + 1;
  const currentDay = Math.min(Math.max(rawDay || 1, 1), 7);

  const days = [
    { day: 1, title: "建立角色", action: "完成會員建檔，讓 Dr. Marvin 認識你的基本節奏。", path: "/line/profile" },
    { day: 2, title: "第一次深測", action: "完成 My Dr. Marvin，取得五維健康分數。", path: "/line/assessment" },
    { day: 3, title: "讀懂報告", action: "查看個人報告，確認目前最需要照顧的系統。", path: "/line/reports" },
    { day: 4, title: "選定植萃", action: "依推薦飲品建立第一個固定補充節奏。", path: "/line/shop" },
    { day: 5, title: "邀請同行", action: "分享推薦連結，讓一位重要的人一起開始。", path: "/line/referral" },
    { day: 6, title: "穩定累積", action: "完成今日飲用打卡，觀察心情與活力變化。", path: "/line/checkin" },
    { day: 7, title: "解鎖身份", action: "完成七日啟動，拿到第一個健康身份徽章。", path: "/line/tasks" },
  ];

  return {
    start_date: startDate,
    current_day: currentDay,
    completed_days: Math.min(profile.streak_days || 0, 7),
    bonus_done: Boolean(profile.seven_day_bonus_done),
    days,
  };
}

function getPeriodKey(taskType, today) {
  if (taskType === "daily") return today;
  if (taskType === "weekly") return getTaiwanWeekKey(today);
  return "once";
}

function buildTaskState({ profile, todayCheckin, reportsCount, weeklyCheckins, claims, today }) {
  const profileCompleted = Boolean(profile.registration_completed_at || getMissingProfileFields(profile).length === 0);
  const claimMap = new Map((claims || []).map((claim) => [`${claim.task_id}:${claim.period_key}`, claim]));

  function makeTask(id, eligible, progress, target) {
    const reward = TASK_REWARDS[id];
    const periodKey = getPeriodKey(reward.type, today);
    const claim = claimMap.get(`${id}:${periodKey}`);
    return {
      id,
      label: reward.label,
      type: reward.type,
      period_key: periodKey,
      le_reward: reward.le,
      cp_reward: reward.cp,
      eligible: Boolean(eligible),
      claimed: Boolean(claim),
      claimed_at: claim?.claimed_at || null,
      progress,
      target,
    };
  }

  return [
    makeTask("profile_complete", profileCompleted, profileCompleted ? 1 : 0, 1),
    makeTask("daily_checkin", Boolean(todayCheckin), todayCheckin ? 1 : 0, 1),
    makeTask("dr_marvin_complete", reportsCount > 0 || Boolean(profile.last_report_id), reportsCount > 0 ? 1 : 0, 1),
    makeTask("weekly_3_checkins", weeklyCheckins >= 3, Math.min(weeklyCheckins, 3), 3),
    makeTask("weekly_5_checkins", weeklyCheckins >= 5, Math.min(weeklyCheckins, 5), 5),
    makeTask("seven_day_complete", (profile.streak_days || 0) >= 7, Math.min(profile.streak_days || 0, 7), 7),
  ];
}

async function readTaskClaims(supabase, profileId, today) {
  const periodKeys = ["once", today, getTaiwanWeekKey(today)];
  const { data, error } = await supabase
    .from("member_task_claims")
    .select("id,task_id,task_type,period_key,le_awarded,cp_awarded,claimed_at")
    .eq("profile_id", profileId)
    .in("period_key", periodKeys);

  if (!error) return data || [];

  console.error("[member/home] task claims lookup failed:", error.message);
  return [];
}

async function countWeeklyCheckins(supabase, profileId, today) {
  const date = new Date(`${today}T00:00:00+08:00`);
  const day = date.getDay() || 7;
  const monday = new Date(date);
  monday.setDate(date.getDate() - day + 1);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const startDate = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Taipei" }).format(monday);
  const endDate = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Taipei" }).format(sunday);

  const { count, error } = await supabase
    .from("daily_checkins")
    .select("id", { count: "exact", head: true })
    .eq("member_id", profileId)
    .gte("checkin_date", startDate)
    .lte("checkin_date", endDate);

  if (error) {
    console.error("[member/home] weekly checkins count failed:", error.message);
    return 0;
  }

  return count || 0;
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

async function readReports({ supabase, profile, lineUserId }) {
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

  return {
    profile: normalizeProfile(profile),
    reports: (drReports || []).map((report) => ({ ...report, source: "dr_marvin" })),
    quick_reports: quickReports.map((report) => ({ ...report, source: "website_quick" })),
  };
}

export default async function handler(req, res) {
  if (!["GET", "POST"].includes(req.method)) return res.status(405).json({ error: "Method not allowed" });

  const resource = req.method === "POST"
    ? req.body?.resource || req.query?.resource || "home"
    : req.query?.resource || "home";

  if (!["home", "reports"].includes(resource)) {
    return res.status(400).json({ error: "Unsupported member resource." });
  }

  if (resource === "reports" && req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const lineUserId = req.method === "POST"
    ? req.body?.lineUserId || req.body?.line_user_id
    : req.query?.lineUserId || req.query?.line_user_id;
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

    if (resource === "reports") {
      const payload = await readReports({ supabase, profile, lineUserId });
      return res.status(200).json(payload);
    }

    const today = getTaiwanToday();
    const weeklyCheckins = await countWeeklyCheckins(supabase, profile.id, today);
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
    const missingProfileFields = getMissingProfileFields(profile);
    const profileCompleted = Boolean(profile.registration_completed_at || missingProfileFields.length === 0);
    const todayCheckin = checkinResult.error ? null : checkinResult.data;
    const latestReport = latestReportResult.error ? null : latestReportResult.data;
    const reportsCount = reportsResult.error ? 0 : reportsResult.count || 0;
    const taskClaims = await readTaskClaims(supabase, profile.id, today);
    const taskState = buildTaskState({
      profile,
      todayCheckin,
      reportsCount,
      weeklyCheckins,
      claims: taskClaims,
      today,
    });

    if (req.method === "POST") {
      const taskId = req.body?.taskId || req.body?.task_id;
      const task = taskState.find((item) => item.id === taskId);
      if (!task) return res.status(400).json({ error: "Unsupported task id." });
      if (!task.eligible) return res.status(409).json({ error: "Task is not eligible yet.", task });
      if (task.claimed) return res.status(409).json({ error: "Task reward already claimed.", task });

      const reward = TASK_REWARDS[task.id];
      const { data: claim, error: claimError } = await supabase
        .from("member_task_claims")
        .insert({
          profile_id: profile.id,
          task_id: task.id,
          task_type: reward.type,
          period_key: task.period_key,
          le_awarded: reward.le,
          cp_awarded: reward.cp,
          metadata: {
            line_user_id: profile.line_user_id,
            label: reward.label,
            progress: task.progress,
            target: task.target,
          },
        })
        .select("*")
        .single();

      if (claimError) throw claimError;

      const nextLe = (profile.le_points || 0) + reward.le;
      const nextCp = (profile.cp_points || 0) + reward.cp;
      const nextLevelNumber = calcLevel(nextLe);
      const { data: updatedProfile, error: updateError } = await supabase
        .from("profiles")
        .update({
          le_points: nextLe,
          cp_points: nextCp,
          level: `L${nextLevelNumber}`,
          title: calcTitle(nextLevelNumber),
        })
        .eq("id", profile.id)
        .select("*")
        .single();

      if (updateError) throw updateError;

      return res.status(200).json({
        success: true,
        claim,
        task: { ...task, claimed: true, claimed_at: claim.claimed_at },
        profile: normalizeProfile(updatedProfile),
      });
    }

    return res.status(200).json({
      profile: normalizedProfile,
      profile_completed: profileCompleted,
      missing_profile_fields: missingProfileFields,
      seven_day_plan: buildSevenDayPlan(profile, today),
      task_claims: taskClaims,
      tasks: taskState,
      weekly_checkins: weeklyCheckins,
      today,
      today_checkin: todayCheckin,
      has_checked_in_today: Boolean(todayCheckin),
      daily_insight: profile.daily_insight || buildFallbackInsight(profile),
      daily_insight_generated: Boolean(profile.daily_insight),
      reports_count: reportsCount,
      latest_report: latestReport,
      announcements,
      feature_grid: [
        { id: "checkin", label: "今日打卡", path: "/line/checkin", status: todayCheckin ? "done" : "ready" },
        { id: "reports", label: "我的報告", path: "/line/reports", status: latestReport ? "ready" : "empty" },
        { id: "assessment", label: "My Dr. Marvin", path: "/line/assessment", status: "ready" },
        { id: "shop", label: "植萃商城", path: "/line/shop", status: "ready" },
        { id: "tasks", label: "任務中心", path: "/line/tasks", status: "ready" },
        { id: "profile", label: "我的帳戶", path: "/line/profile", status: "ready" },
        { id: "referral", label: "推薦好友", path: "/line/referral", status: "ready" },
        { id: "events", label: "最新活動", path: "/line/events", status: "ready" },
      ],
    });
  } catch (error) {
    console.error("[member/home] failed:", error);
    return res.status(500).json({ error: error.message });
  }
}
