import {
  calcLevel,
  calcTitle,
  getSupabaseAdmin,
  getTaiwanDateDaysAgo,
  getTaiwanToday,
  normalizeProfile,
} from "./_member-utils.js";

const BASE_LE = 10;

function clampScore(value) {
  const number = Number(value);
  if (!Number.isInteger(number)) return null;
  if (number < 1 || number > 5) return null;
  return number;
}

function daysBetweenTaiwanDates(startDate, endDate) {
  if (!startDate || !endDate) return null;
  const start = new Date(`${startDate}T00:00:00+08:00`);
  const end = new Date(`${endDate}T00:00:00+08:00`);
  return Math.floor((end - start) / 86400000);
}

function calculateStreak(profile, today) {
  if (profile.last_checkin_date === today) return profile.streak_days || 0;
  const yesterday = getTaiwanDateDaysAgo(1);
  return profile.last_checkin_date === yesterday ? (profile.streak_days || 0) + 1 : 1;
}

function calculateMultiplier(profile, streakDays, today) {
  const sevenDayOffset = daysBetweenTaiwanDates(profile.seven_day_start_date, today);
  const inSevenDayPlan = sevenDayOffset !== null && sevenDayOffset >= 0 && sevenDayOffset <= 6 && !profile.seven_day_bonus_done;

  if (inSevenDayPlan) return { multiplier: 3, reason: "seven_day_start" };
  if (streakDays >= 7) return { multiplier: 2, reason: "seven_day_streak" };
  if (streakDays >= 3) return { multiplier: 1.5, reason: "three_day_streak" };
  return { multiplier: 1, reason: "base" };
}

async function findMember(supabase, lineUserId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("line_user_id", lineUserId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const body = req.body || {};
  const lineUserId = body.lineUserId || body.line_user_id;
  if (!lineUserId || typeof lineUserId !== "string" || !lineUserId.startsWith("U")) {
    return res.status(400).json({ error: "Invalid LINE userId" });
  }

  try {
    const supabase = getSupabaseAdmin();
    const today = getTaiwanToday();
    const profile = await findMember(supabase, lineUserId);
    if (!profile) return res.status(404).json({ error: "Member not found" });

    if (profile.last_checkin_date === today) {
      const { data: existing } = await supabase
        .from("daily_checkins")
        .select("*")
        .eq("member_id", profile.id)
        .eq("checkin_date", today)
        .maybeSingle();

      return res.status(200).json({
        success: true,
        alreadyChecked: true,
        message: "今天已完成飲用，明天繼續加油！",
        profile: normalizeProfile(profile),
        checkin: existing || null,
      });
    }

    const streakDays = calculateStreak(profile, today);
    const { multiplier, reason } = calculateMultiplier(profile, streakDays, today);
    const leAwarded = Math.round(BASE_LE * multiplier);
    const nextLePoints = (profile.le_points || 0) + leAwarded;
    const nextHealthScore = Math.min((profile.health_score || 0) + 3, 100);
    const levelNumber = calcLevel(nextLePoints);

    const checkinPayload = {
      member_id: profile.id,
      profile_id: profile.id,
      checkin_date: today,
      product_consumed: body.productConsumed || body.drinkProduct || body.drink_product || profile.recommended_product || profile.recommended_product_id || null,
      drink_product: body.drinkProduct || body.drink_product || body.productConsumed || profile.recommended_product || profile.recommended_product_id || null,
      drink_done: true,
      mood_score: clampScore(body.moodScore ?? body.mood_score),
      energy_score: clampScore(body.energyScore ?? body.energy_score ?? body.energyLevel ?? body.energy_level),
      energy_level: clampScore(body.energyLevel ?? body.energy_level ?? body.energyScore ?? body.energy_score),
      symptoms: Array.isArray(body.symptoms) ? body.symptoms : [],
      le_awarded: leAwarded,
      le_earned: leAwarded,
      notes: body.notes || body.note || null,
      note: body.note || body.notes || null,
    };

    const { data: checkin, error: checkinError } = await supabase
      .from("daily_checkins")
      .upsert(checkinPayload, { onConflict: "member_id,checkin_date" })
      .select()
      .single();

    if (checkinError) throw checkinError;

    const profileUpdates = {
      last_checkin_date: today,
      le_points: nextLePoints,
      health_score: nextHealthScore,
      streak_days: streakDays,
      longest_streak: Math.max(profile.longest_streak || 0, streakDays),
      total_checkins: (profile.total_checkins || 0) + 1,
      level: `L${levelNumber}`,
      title: calcTitle(levelNumber),
    };

    if (profile.seven_day_start_date) {
      const planOffset = daysBetweenTaiwanDates(profile.seven_day_start_date, today);
      if (planOffset !== null && planOffset >= 6 && streakDays >= 7) {
        profileUpdates.seven_day_bonus_done = true;
      }
    }

    const { data: updatedProfile, error: updateError } = await supabase
      .from("profiles")
      .update(profileUpdates)
      .eq("id", profile.id)
      .select("*")
      .single();

    if (updateError) throw updateError;

    return res.status(200).json({
      success: true,
      alreadyChecked: false,
      message: "今日打卡完成，讓植物營養繼續陪你累積。",
      leAwarded,
      multiplier,
      multiplierReason: reason,
      le: nextLePoints,
      healthScore: nextHealthScore,
      streakDays,
      profile: normalizeProfile(updatedProfile),
      checkin,
    });
  } catch (error) {
    console.error("[checkin] failed:", error);
    return res.status(500).json({ error: error.message });
  }
}
