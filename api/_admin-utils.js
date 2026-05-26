import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function getSupabaseAdmin() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function getBearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization || "";
  const match = String(header).match(/^Bearer\s+(.+)$/i);
  return match?.[1] || "";
}

async function getAuthUser(token) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Missing Supabase auth configuration.");
  }

  const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await authClient.auth.getUser(token);
  if (error || !data?.user) throw new Error("Invalid admin authorization.");
  return data.user;
}

async function findAdminProfile(supabase, user) {
  const columns = "id,email,full_name,role";
  const byId = await supabase.from("profiles").select(columns).eq("id", user.id).maybeSingle();
  if (byId.error) throw byId.error;
  if (byId.data) return byId.data;

  if (!user.email) return null;
  const byEmail = await supabase.from("profiles").select(columns).eq("email", user.email).maybeSingle();
  if (byEmail.error) throw byEmail.error;
  return byEmail.data || null;
}

export async function requireAdmin(req, res) {
  const token = getBearerToken(req);
  if (!token) {
    res.status(401).json({ error: "Missing admin authorization." });
    return null;
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    res.status(500).json({ error: "Missing Supabase server configuration." });
    return null;
  }

  try {
    const user = await getAuthUser(token);
    const profile = await findAdminProfile(supabase, user);
    if (String(profile?.role || "").trim().toLowerCase() !== "admin") {
      res.status(403).json({
        error: profile
          ? `Admin role required. Current role: ${profile.role || "empty"}.`
          : `Admin profile not found for ${user.email || user.id}.`,
      });
      return null;
    }
    return { supabase, user, profile };
  } catch (error) {
    res.status(error.message === "Invalid admin authorization." ? 401 : 500).json({ error: error.message });
    return null;
  }
}
