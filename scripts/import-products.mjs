#!/usr/bin/env node

import { createClient } from "@supabase/supabase-js";
import { PRODUCTS } from "../data/products.js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const writeKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ACCESS_TOKEN;
const dryRun = process.argv.includes("--dry-run");

if (!supabaseUrl) {
  console.error("Missing SUPABASE_URL.");
  process.exit(1);
}

if (!writeKey && !dryRun) {
  console.error("Missing write key. Set SUPABASE_SERVICE_ROLE_KEY only in a secure shell, or run --dry-run.");
  process.exit(1);
}

const rows = PRODUCTS.map((product) => ({
  id: product.id,
  slug: product.slug,
  sort_order: product.sort_order,
  name: product.name,
  short_name: product.short_name,
  color_name: product.color_name,
  theme: product.theme,
  description: product.description,
  focus: product.focus,
  tags: product.tags,
  audience: product.audience,
  ingredients: product.ingredients,
  best_for: product.best_for,
  system_keys: product.system_keys,
  line_summary: product.line_summary,
  bg_color: product.bg_color,
  text_color: product.text_color,
  status: product.status,
  metadata: product.metadata || {},
}));

if (dryRun) {
  console.log(JSON.stringify(rows, null, 2));
  process.exit(0);
}

const supabase = createClient(supabaseUrl, writeKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data, error } = await supabase
  .from("products")
  .upsert(rows, { onConflict: "id" })
  .select("id,name,status");

if (error) {
  console.error(error);
  process.exit(1);
}

console.log(`Imported ${data.length} products.`);
data.forEach((product) => {
  console.log(`- ${product.id}: ${product.name} (${product.status})`);
});
