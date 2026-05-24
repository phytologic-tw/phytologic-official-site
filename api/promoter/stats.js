import { requireAdmin } from "./_admin.js";

function groupBy(rows, key) {
  return rows.reduce((acc, row) => {
    const value = row[key] || "unknown";
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const admin = await requireAdmin(req, res);
  if (!admin) return;

  try {
    const { supabase } = admin;
    const [{ data: promoters, error: promotersError }, { data: profiles, error: profilesError }] = await Promise.all([
      supabase.from("promoters").select("*").order("created_at", { ascending: false }),
      supabase
        .from("profiles")
        .select("id,line_user_id,promoter_id,promoter_type,referral_source,event_id,joined_at,created_at,registration_completed_at")
        .not("promoter_id", "is", null),
    ]);

    if (promotersError) throw promotersError;
    if (profilesError) throw profilesError;

    const memberRows = profiles || [];
    const promoterRows = promoters || [];
    const promoterStats = promoterRows.map((promoter) => {
      const members = memberRows.filter((profile) => profile.promoter_id === promoter.id);
      return {
        ...promoter,
        referred_count: members.length,
        completed_registration_count: members.filter((profile) => profile.registration_completed_at).length,
        latest_joined_at: members
          .map((profile) => profile.joined_at || profile.created_at)
          .filter(Boolean)
          .sort()
          .at(-1) || null,
      };
    });

    const orphanPromoters = Object.entries(groupBy(memberRows, "promoter_id"))
      .filter(([id]) => !promoterRows.some((promoter) => promoter.id === id))
      .map(([id, count]) => ({ id, referred_count: count }));

    return res.status(200).json({
      summary: {
        promoters_count: promoterRows.length,
        active_promoters_count: promoterRows.filter((promoter) => promoter.is_active !== false).length,
        referred_members_count: memberRows.length,
        by_type: groupBy(memberRows, "promoter_type"),
        by_source: groupBy(memberRows, "referral_source"),
      },
      promoters: promoterStats,
      orphan_promoters: orphanPromoters,
    });
  } catch (error) {
    console.error("[promoter/stats] failed:", error);
    return res.status(500).json({ error: error.message });
  }
}
