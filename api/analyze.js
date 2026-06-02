import { createClient } from "@supabase/supabase-js";
import { buildProductPromptList, getProducts } from "../src/server/products.js";

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
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body || {};
  if (!prompt) return res.status(400).json({ error: "Missing prompt" });

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "Missing ANTHROPIC_API_KEY" });
  }

  try {
    const products = await getProducts(getSupabaseAnon(), { allowFallback: true });
    const productContext = buildProductPromptList(products);
    const promptWithProducts = [
      "以下是目前 production products table / fallback catalog 的可推薦植萃飲品清單。若使用者 prompt 內另有產品清單，請以本清單為準。",
      productContext,
      "請只推薦清單內的 product id 與 name。",
      "",
      prompt,
    ].join("\n");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: promptWithProducts }],
      }),
    });

    const data = await response.json();
    if (!response.ok) return res.status(500).json({ error: data });

    const text = data.content?.map((content) => content.text || "").join("") || "";
    return res.status(200).json({ result: text, products });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
