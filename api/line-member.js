import { calcLifeNumber, calcZodiac } from "../src/server/prompts.js";
import {
  getSupabaseAdmin,
  inferPromoterType,
  normalizeAttribution,
  normalizeProfile,
  pickDefinedEntries,
} from "../src/server/member-utils.js";

const DEFAULT_MEMBER_REFERRAL_CP = 500;

function normalizeLevelForWrite(level) {
  if (typeof level === "string" && /^L[1-4]$/.test(level)) return level;
  if (typeof level === "number" && level >= 1 && level <= 4) return `L${level}`;
  if (typeof level === "string" && /^[1-4]$/.test(level)) return `L${level}`;
  return "L1";
}

function normalizeStressScore(value) {
  if (typeof value === "number") return value >= 1 && value <= 5 ? value : null;
  const numeric = Number(value);
  if (Number.isInteger(numeric) && numeric >= 1 && numeric <= 5) return numeric;

  const map = {
    低: 1,
    中等: 2,
    偏高: 3,
    高: 4,
    非常高: 5,
  };
  return map[value] || null;
}

function buildMemberReferralCode(profile) {
  if (profile?.referral_code) return profile.referral_code;
  const seed = String(profile?.id || profile?.line_user_id || "").replace(/[^a-zA-Z0-9]/g, "");
  return `P_MEMBER_${seed.slice(-6).toUpperCase().padStart(6, "0")}`;
}

function shouldCompleteRegistration(body) {
  return Object.keys(body?.profileData || {}).length > 0;
}

function buildProfilePayload(body) {
  const profileData = body.profileData || {};
  const attribution = normalizeAttribution({
    ...(body.attribution || {}),
    ...body,
    ...profileData,
  });
  const payload = {
    line_user_id: body.lineUserId,
    line_linked_at: new Date().toISOString(),
    role: "user",
  };

  if (body.displayName !== undefined) payload.line_display_name = body.displayName || null;
  if (body.pictureUrl !== undefined) payload.line_picture_url = body.pictureUrl || null;
  if (body.statusMessage !== undefined) payload.line_status_message = body.statusMessage || null;

  const fieldMap = {
    nickname: "nickname",
    gender: "gender",
    birthDate: "birth_date",
    birth_date: "birth_date",
    birthdate: "birthdate",
    bloodType: "blood_type",
    blood_type: "blood_type",
    city: "city",
    sleepHours: "sleep_hours",
    sleep_hours: "sleep_hours",
    dietType: "diet_type",
    diet_type: "diet_type",
    dietPattern: "diet_pattern",
    diet_pattern: "diet_pattern",
    stressLevel: "stress_level",
    stress_level: "stress_level",
    healthConcerns: "health_concerns",
    health_concerns: "health_concerns",
  };

  Object.entries(fieldMap).forEach(([inputKey, dbKey]) => {
    const value = profileData[inputKey];
    if (value !== undefined && value !== "") payload[dbKey] = typeof value === "string" ? value.trim() : value;
  });

  if (!payload.birthdate && payload.birth_date) payload.birthdate = payload.birth_date;
  if (!payload.birth_date && payload.birthdate) payload.birth_date = payload.birthdate;
  if (!payload.diet_pattern && payload.diet_type) payload.diet_pattern = payload.diet_type;
  if (!payload.diet_type && payload.diet_pattern) payload.diet_type = payload.diet_pattern;

  const stressScore = normalizeStressScore(profileData.stressScore ?? profileData.stress_score ?? payload.stress_level);
  if (stressScore) payload.stress_score = stressScore;

  if (payload.birth_date || payload.birthdate) {
    const birthday = payload.birth_date || payload.birthdate;
    const lifeNumber = calcLifeNumber(birthday);
    payload.life_number = lifeNumber;
    payload.numerology_number = lifeNumber;
    const zodiac = calcZodiac(birthday);
    payload.zodiac = zodiac.sign;
    payload.zodiac_element = zodiac.element;
  }

  if (Object.values(attribution).some(Boolean)) {
    Object.assign(payload, attribution);
    payload.joined_at = body.joinedAt || new Date().toISOString();
  }

  if (Object.keys(profileData).length > 0) {
    payload.registration_completed_at = new Date().toISOString();
    payload.seven_day_start_date = new Date().toISOString().slice(0, 10);
  }

  return pickDefinedEntries(payload);
}

async function attachCityClimate(supabase, payload) {
  if (!payload.city) return payload;

  const { data, error } = await supabase
    .from("city_climate")
    .select("*")
    .eq("city", payload.city)
    .maybeSingle();

  if (error) {
    console.error("[line-member] city_climate lookup failed:", error.message);
    return payload;
  }

  if (data) payload.city_climate = data;
  return payload;
}

async function linkLatestAssessmentReport(supabase, profile) {
  if (!profile?.line_user_id) return;

  const { data: report, error } = await supabase
    .from("assessment_reports")
    .select("id")
    .eq("line_user_id", profile.line_user_id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !report) {
    if (error) console.error("[line-member] assessment lookup failed:", error.message);
    return;
  }

  const { error: updateError } = await supabase
    .from("assessment_reports")
    .update({ profile_id: profile.id, member_id: profile.id })
    .eq("id", report.id);

  if (!updateError) return;

  const { error: fallbackError } = await supabase
    .from("assessment_reports")
    .update({ member_id: profile.id })
    .eq("id", report.id);

  if (fallbackError) console.error("[line-member] assessment link failed:", fallbackError.message);
}

async function ensureReferralCode(supabase, profile) {
  if (!profile?.id || profile.referral_code) return profile;

  const referralCode = buildMemberReferralCode(profile);
  const { data, error } = await supabase
    .from("profiles")
    .update({ referral_code: referralCode })
    .eq("id", profile.id)
    .select("*")
    .single();

  if (error) {
    console.error("[line-member] referral_code update failed:", error.message);
    return profile;
  }

  return data || profile;
}

async function findReferrerProfile(supabase, promoterId) {
  if (!promoterId || !promoterId.startsWith("P_MEMBER_")) return null;

  const { data: direct, error: directError } = await supabase
    .from("profiles")
    .select("id,line_user_id,nickname,line_display_name,cp_points,referral_code,promoter_id")
    .eq("referral_code", promoterId)
    .maybeSingle();

  if (directError) {
    console.error("[line-member] referrer lookup failed:", directError.message);
    return null;
  }
  if (direct) return direct;

  const suffix = promoterId.replace("P_MEMBER_", "");
  const { data: candidates, error: candidateError } = await supabase
    .from("profiles")
    .select("id,line_user_id,nickname,line_display_name,cp_points,referral_code,promoter_id")
    .limit(200);

  if (candidateError) {
    console.error("[line-member] referrer fallback lookup failed:", candidateError.message);
    return null;
  }

  return (candidates || []).find((profile) => buildMemberReferralCode(profile) === promoterId || String(profile.id).replace(/[^a-zA-Z0-9]/g, "").endsWith(suffix)) || null;
}

async function readPromoter(supabase, promoterId) {
  if (!promoterId) return null;
  const { data, error } = await supabase
    .from("promoters")
    .select("id,type,name,cp_per_referral,is_active")
    .eq("id", promoterId)
    .maybeSingle();

  if (error) {
    console.error("[line-member] promoter lookup failed:", error.message);
    return null;
  }

  return data;
}

async function writeReferralLog(supabase, payload) {
  const { data, error } = await supabase
    .from("referral_reward_logs")
    .insert(payload)
    .select("*")
    .single();

  if (!error) return data;
  if (error.code === "23505") return null;
  throw error;
}

async function settleReferralReward(supabase, profile) {
  const promoterId = String(profile?.promoter_id || "").trim().toUpperCase();
  if (!profile?.id || !promoterId) return null;

  const promoterType = profile.promoter_type || inferPromoterType(promoterId);
  const promoter = await readPromoter(supabase, promoterId);
  const logBase = {
    referred_profile_id: profile.id,
    promoter_id: promoterId,
    promoter_type: promoter?.type || promoterType,
    referral_source: profile.referral_source || null,
    event_id: profile.event_id || null,
    reward_type: "registration_completed",
    metadata: {
      referred_line_user_id: profile.line_user_id,
      promoter_name: promoter?.name || null,
    },
  };

  if (promoterType === "event") {
    return writeReferralLog(supabase, {
      ...logBase,
      status: "manual_review",
      reason: "event_source_requires_manual_settlement",
    });
  }

  if (!promoterId.startsWith("P_MEMBER_")) {
    return writeReferralLog(supabase, {
      ...logBase,
      status: "pending",
      reason: "non_member_promoter_manual_settlement",
    });
  }

  const referrer = await findReferrerProfile(supabase, promoterId);
  if (!referrer) {
    return writeReferralLog(supabase, {
      ...logBase,
      status: "manual_review",
      reason: "referrer_profile_not_found",
    });
  }

  if (referrer.id === profile.id || referrer.line_user_id === profile.line_user_id) {
    return writeReferralLog(supabase, {
      ...logBase,
      referrer_profile_id: referrer.id,
      status: "blocked",
      reason: "self_referral_blocked",
    });
  }

  const cpAwarded = Number(promoter?.cp_per_referral || DEFAULT_MEMBER_REFERRAL_CP);
  const log = await writeReferralLog(supabase, {
    ...logBase,
    referrer_profile_id: referrer.id,
    cp_awarded: cpAwarded,
    status: "awarded",
    reason: "registration_completed",
    settled_at: new Date().toISOString(),
  });

  if (!log || cpAwarded <= 0) return log;

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ cp_points: (referrer.cp_points || 0) + cpAwarded })
    .eq("id", referrer.id);

  if (updateError) console.error("[line-member] referral CP update failed:", updateError.message);
  return log;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { lineUserId } = req.body || {};
  if (!lineUserId || typeof lineUserId !== "string" || !lineUserId.startsWith("U")) {
    return res.status(400).json({ error: "Invalid LINE userId" });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data: existing, error: existingError } = await supabase
      .from("profiles")
      .select("*")
      .eq("line_user_id", lineUserId)
      .maybeSingle();

    if (existingError) throw existingError;

    const registrationWasComplete = Boolean(existing?.registration_completed_at);
    const completesRegistration = shouldCompleteRegistration(req.body || {});
    const payload = await attachCityClimate(supabase, buildProfilePayload(req.body || {}));
    const { data: upsertedProfile, error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: existing?.id,
          ...payload,
          level: normalizeLevelForWrite(existing?.level),
          title: existing?.title || "改變者",
        },
        { onConflict: "line_user_id", ignoreDuplicates: false }
      )
      .select("*")
      .single();

    if (error) throw error;
    const profile = await ensureReferralCode(supabase, upsertedProfile);
    await linkLatestAssessmentReport(supabase, profile);
    const referralReward = completesRegistration && !registrationWasComplete
      ? await settleReferralReward(supabase, profile).catch((rewardError) => {
        console.error("[line-member] referral reward failed:", rewardError.message);
        return null;
      })
      : null;

    return res.status(200).json({
      profile: normalizeProfile(profile),
      isNewMember: !existing,
      referralReward,
    });
  } catch (error) {
    console.error("[line-member] failed:", error);
    return res.status(500).json({ error: error.message });
  }
}
