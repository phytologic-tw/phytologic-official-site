import { buildLineUrl, normalizePromoterPayload, requireAdmin } from "./_admin.js";

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  const { supabase } = admin;

  try {
    if (req.method === "GET") {
      const { data, error } = await supabase
        .from("promoters")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return res.status(200).json({ promoters: data || [] });
    }

    if (req.method === "POST") {
      const payload = normalizePromoterPayload(req.body || {});
      if (!payload.line_url) payload.line_url = buildLineUrl(payload.id, payload.type === "event" ? `event_${payload.id}` : "referral");

      const { data, error } = await supabase
        .from("promoters")
        .upsert(payload, { onConflict: "id", ignoreDuplicates: false })
        .select("*")
        .single();
      if (error) throw error;
      return res.status(200).json({ promoter: data });
    }

    if (req.method === "PATCH") {
      const { id, ...updates } = req.body || {};
      if (!id) return res.status(400).json({ error: "Missing promoter id." });

      const payload = normalizePromoterPayload({ id, ...updates });
      const { data, error } = await supabase
        .from("promoters")
        .update(payload)
        .eq("id", id)
        .select("*")
        .single();
      if (error) throw error;
      return res.status(200).json({ promoter: data });
    }

    if (req.method === "DELETE") {
      const id = req.query?.id || req.body?.id;
      if (!id) return res.status(400).json({ error: "Missing promoter id." });
      const { error } = await supabase.from("promoters").delete().eq("id", id);
      if (error) throw error;
      return res.status(200).json({ success: true, id });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("[promoter/manage] failed:", error);
    return res.status(500).json({ error: error.message });
  }
}
