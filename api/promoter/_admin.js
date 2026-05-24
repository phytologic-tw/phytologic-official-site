import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdmin, pickDefinedEntries } from "../_member-utils.js";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

export function getBearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization || "";
  const match = String(header).match(/^Bearer\s+(.+)$/i);
  return match?.[1] || "";
}

export async function requireAdmin(req, res) {
  const token = getBearerToken(req);
  if (!token) {
    res.status(401).json({ error: "Missing admin authorization." });
    return null;
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    res.status(500).json({ error: "Missing Supabase auth configuration." });
    return null;
  }

  const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: authData, error: authError } = await authClient.auth.getUser(token);
  const user = authData?.user;

  if (authError || !user) {
    res.status(401).json({ error: "Invalid admin authorization." });
    return null;
  }

  const supabase = getSupabaseAdmin();
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id,email,role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    res.status(500).json({ error: profileError.message });
    return null;
  }

  if (String(profile?.role || "").toLowerCase() !== "admin") {
    res.status(403).json({ error: "Admin role required." });
    return null;
  }

  return { supabase, user, profile };
}

export function normalizePromoterPayload(body = {}) {
  const id = String(body.id || "").trim().toUpperCase();
  const type = String(body.type || "").trim();
  const name = String(body.name || "").trim();

  if (!id) throw new Error("Missing promoter id.");
  if (!type) throw new Error("Missing promoter type.");
  if (!name) throw new Error("Missing promoter name.");

  return pickDefinedEntries({
    id,
    type,
    name,
    region: body.region,
    contact: body.contact,
    line_url: body.line_url,
    qr_code_url: body.qr_code_url,
    cp_per_referral: Number(body.cp_per_referral || 0),
    cp_per_first_purchase: Number(body.cp_per_first_purchase || 0),
    is_active: body.is_active !== false,
    notes: body.notes,
  });
}

export function buildLineUrl(promoterId, source = "referral", eventId = "") {
  const params = new URLSearchParams({ ref: promoterId, src: source });
  if (eventId) params.set("evt", eventId);
  return `https://line.me/R/ti/p/@phytologic?${params.toString()}`;
}
