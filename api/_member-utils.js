import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

let supabaseAdmin;

export function getSupabaseAdmin() {
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

export function inferPromoterType(promoterId = "") {
  const id = String(promoterId).trim().toUpperCase();
  if (id.startsWith("P_STORE_")) return "store";
  if (id.startsWith("P_PARTNER_")) return "partner";
  if (id.startsWith("P_MEMBER_")) return "member";
  if (id.startsWith("P_KOL_")) return "kol";
  if (id.startsWith("P_EVENT_")) return "event";
  return promoterId ? "unknown" : null;
}

export function normalizeAttribution(input = {}) {
  const ref = input.ref ?? input.promoterId ?? input.promoter_id;
  const src = input.src ?? input.referralSource ?? input.referral_source;
  const evt = input.evt ?? input.eventId ?? input.event_id;
  const promoterType = input.promoterType ?? input.promoter_type;

  const promoterId = typeof ref === "string" ? ref.trim() : "";
  const referralSource = typeof src === "string" ? src.trim() : "";
  const eventId = typeof evt === "string" ? evt.trim() : "";

  return {
    promoter_id: promoterId || null,
    promoter_type: promoterType || inferPromoterType(promoterId),
    referral_source: referralSource || null,
    event_id: eventId || null,
  };
}

export function pickDefinedEntries(payload) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== "")
  );
}

export function normalizeProfile(profile) {
  if (!profile) return profile;

  const lePoints = profile.le_points ?? 0;
  const pPoints = profile.p_points ?? 0;
  const cpPoints = profile.cp_points ?? 0;
  const level = profile.level || "L1";
  const displayName = profile.nickname || profile.line_display_name || "植本會員";
  const recommendedDrink = profile.recommended_product || profile.recommended_product_id || "雪山植萃";

  return {
    ...profile,
    display_name: displayName,
    picture_url: profile.line_picture_url,
    level,
    level_number: Number(String(level).replace("L", "")) || 1,
    recommended_drink: recommendedDrink,
    le: lePoints,
    p: pPoints,
    cp: cpPoints,
  };
}

export function getTaiwanToday() {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Taipei",
  }).format(new Date());
}

export function getTaiwanDateDaysAgo(days) {
  const date = new Date(`${getTaiwanToday()}T00:00:00+08:00`);
  date.setDate(date.getDate() - days);
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Taipei",
  }).format(date);
}

export function calcLevel(lePoints = 0) {
  if (lePoints >= 1000) return 4;
  if (lePoints >= 300) return 3;
  if (lePoints >= 100) return 2;
  return 1;
}

export function calcTitle(levelNumber = 1) {
  const titles = { 1: "改變者", 2: "實踐者", 3: "教育家", 4: "實業家" };
  return titles[levelNumber] || "改變者";
}
