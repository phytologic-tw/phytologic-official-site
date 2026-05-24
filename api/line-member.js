import { calcLifeNumber, calcZodiac } from "./prompts.js";
import {
  getSupabaseAdmin,
  normalizeAttribution,
  normalizeProfile,
  pickDefinedEntries,
} from "./_member-utils.js";

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

    const payload = await attachCityClimate(supabase, buildProfilePayload(req.body || {}));
    const { data: profile, error } = await supabase
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
    await linkLatestAssessmentReport(supabase, profile);

    return res.status(200).json({
      profile: normalizeProfile(profile),
      isNewMember: !existing,
    });
  } catch (error) {
    console.error("[line-member] failed:", error);
    return res.status(500).json({ error: error.message });
  }
}
