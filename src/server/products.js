import { PRODUCTS, activeProducts, findProductById, productPromptList } from "../data/products.js";

let cachedProducts = null;
let cachedAt = 0;
const CACHE_MS = 5 * 60 * 1000;

function normalizeProduct(row) {
  return {
    id: row.id,
    slug: row.slug || row.id,
    sort_order: row.sort_order ?? 100,
    name: row.name,
    short_name: row.short_name,
    color_name: row.color_name,
    theme: row.theme,
    description: row.description,
    focus: row.focus,
    tags: row.tags || [],
    audience: row.audience,
    ingredients: row.ingredients || [],
    best_for: row.best_for || [],
    system_keys: row.system_keys || [],
    line_summary: row.line_summary,
    bg_color: row.bg_color,
    text_color: row.text_color,
    status: row.status || "active",
  };
}

export async function getProducts(supabase, { allowFallback = true } = {}) {
  const now = Date.now();
  if (cachedProducts && now - cachedAt < CACHE_MS) return cachedProducts;

  if (supabase) {
    const { data, error } = await supabase
      .from("products")
      .select("id,slug,sort_order,name,short_name,color_name,theme,description,focus,tags,audience,ingredients,best_for,system_keys,line_summary,bg_color,text_color,status")
      .eq("status", "active")
      .order("sort_order", { ascending: true });

    if (!error && Array.isArray(data) && data.length > 0) {
      cachedProducts = data.map(normalizeProduct);
      cachedAt = now;
      return cachedProducts;
    }

    if (!allowFallback) throw error || new Error("No active products found.");
  }

  cachedProducts = activeProducts(PRODUCTS);
  cachedAt = now;
  return cachedProducts;
}

export function getStaticProducts() {
  return activeProducts(PRODUCTS);
}

export function findProduct(id, products = PRODUCTS) {
  return findProductById(id, products) || findProductById(id, PRODUCTS);
}

export function buildProductPromptList(products = PRODUCTS) {
  return productPromptList(products);
}
