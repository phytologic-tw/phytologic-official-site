import { getSupabaseAdmin, normalizeAttribution, pickDefinedEntries } from "../_member-utils.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const body = req.body || {};
  const lineUserId = body.lineUserId || body.line_user_id;
  const attribution = normalizeAttribution(body);

  if (!attribution.promoter_id && !attribution.referral_source && !attribution.event_id) {
    return res.status(400).json({ error: "Missing attribution parameters" });
  }

  if (!lineUserId) {
    return res.status(200).json({ attribution });
  }

  if (typeof lineUserId !== "string" || !lineUserId.startsWith("U")) {
    return res.status(400).json({ error: "Invalid LINE userId" });
  }

  try {
    const supabase = getSupabaseAdmin();
    const updates = pickDefinedEntries({
      ...attribution,
      joined_at: new Date().toISOString(),
    });

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("line_user_id", lineUserId)
      .select("id,line_user_id,promoter_id,promoter_type,referral_source,event_id")
      .maybeSingle();

    if (error) throw error;

    return res.status(200).json({ attribution, profile: data });
  } catch (error) {
    console.error("[promoter/track] failed:", error);
    return res.status(500).json({ error: error.message });
  }
}
