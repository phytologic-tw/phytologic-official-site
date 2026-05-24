import { createClient } from "@supabase/supabase-js";
import { calcLifeNumber, calcZodiac } from "./prompts.js";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

let supabaseAdmin;

function getSupabaseAdmin() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing Supabase server configuration.");
  }

  if (!supabaseAdmin) {
    supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return supabaseAdmin;
}

function normalizeProfile(profile) {
  if (!profile) return profile;
  const lePoints = profile.le_points ?? 0;
  const pPoints = profile.p_points ?? 0;
  const cpPoints = profile.cp_points ?? 0;
  const level = profile.level || "L1";

  return {
    ...profile,
    display_name: profile.nickname || profile.line_display_name,
    picture_url: profile.line_picture_url,
    level,
    level_number: Number(String(level).replace("L", "")) || 1,
    le: lePoints,
    p: pPoints,
    cp: cpPoints,
  };
}

function normalizeLevelForWrite(level) {
  if (typeof level === "string" && /^L[1-4]$/.test(level)) return level;
  if (typeof level === "number" && level >= 1 && level <= 4) return `L${level}`;
  if (typeof level === "string" && /^[1-4]$/.test(level)) return `L${level}`;
  return "L1";
}

function buildProfilePayload(body) {
  const profileData = body.profileData || {};
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
    birthdate: "birthdate",
    bloodType: "blood_type",
    city: "city",
    sleepHours: "sleep_hours",
    dietPattern: "diet_pattern",
    stressLevel: "stress_level",
  };

  Object.entries(fieldMap).forEach(([inputKey, dbKey]) => {
    const value = profileData[inputKey];
    if (value !== undefined && value !== "") payload[dbKey] = typeof value === "string" ? value.trim() : value;
  });

  if (payload.birthdate) {
    payload.life_number = calcLifeNumber(payload.birthdate);
    const zodiac = calcZodiac(payload.birthdate);
    payload.zodiac = zodiac.sign;
    payload.zodiac_element = zodiac.element;
  }

  return payload;
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
