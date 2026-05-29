import { createClient } from "@supabase/supabase-js";
import { getProducts } from "./_products.js";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

let supabase;

function getSupabaseAnon() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  if (!supabase) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return supabase;
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const products = await getProducts(getSupabaseAnon(), { allowFallback: true });
    return res.status(200).json({ products });
  } catch (error) {
    console.error("[products] failed:", error);
    return res.status(500).json({ error: error.message });
  }
}
