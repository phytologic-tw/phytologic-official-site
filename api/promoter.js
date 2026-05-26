import { getSupabaseAdmin, normalizeAttribution, pickDefinedEntries } from "./_member-utils.js";
import { requireAdmin } from "./_admin-utils.js";

function normalizePromoterPayload(body = {}) {
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

function buildLineUrl(promoterId, source = "referral", eventId = "") {
  const params = new URLSearchParams({ ref: promoterId, src: source });
  if (eventId) params.set("evt", eventId);
  return `https://line.me/R/ti/p/@phytologic?${params.toString()}`;
}

function groupBy(rows, key) {
  return rows.reduce((acc, row) => {
    const value = row[key] || "unknown";
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

async function handleTrack(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const body = req.body || {};
  const lineUserId = body.lineUserId || body.line_user_id;
  const attribution = normalizeAttribution(body);

  if (!attribution.promoter_id && !attribution.referral_source && !attribution.event_id) {
    return res.status(400).json({ error: "Missing attribution parameters" });
  }

  if (!lineUserId) return res.status(200).json({ attribution });
  if (typeof lineUserId !== "string" || !lineUserId.startsWith("U")) {
    return res.status(400).json({ error: "Invalid LINE userId" });
  }

  const supabase = getSupabaseAdmin();
  const updates = pickDefinedEntries({ ...attribution, joined_at: new Date().toISOString() });
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("line_user_id", lineUserId)
    .select("id,line_user_id,promoter_id,promoter_type,referral_source,event_id")
    .maybeSingle();

  if (error) throw error;
  return res.status(200).json({ attribution, profile: data });
}

async function handleManage(req, res, supabase) {
  if (req.method === "GET") {
    const { data, error } = await supabase.from("promoters").select("*").order("created_at", { ascending: false });
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
    const { data, error } = await supabase.from("promoters").update(payload).eq("id", id).select("*").single();
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
}

async function handleStats(_req, res, supabase) {
  const [{ data: promoters, error: promotersError }, { data: profiles, error: profilesError }] = await Promise.all([
    supabase.from("promoters").select("*").order("created_at", { ascending: false }),
    supabase
      .from("profiles")
      .select("id,line_user_id,promoter_id,promoter_type,referral_source,event_id,joined_at,created_at,registration_completed_at")
      .not("promoter_id", "is", null),
  ]);

  if (promotersError) throw promotersError;
  if (profilesError) throw profilesError;

  const { data: rewardLogs, error: rewardLogsError } = await supabase
    .from("referral_reward_logs")
    .select("id,promoter_id,referrer_profile_id,referred_profile_id,cp_awarded,status,created_at,settled_at");

  if (rewardLogsError) console.error("[promoter] referral_reward_logs lookup failed:", rewardLogsError.message);

  const memberRows = profiles || [];
  const promoterRows = promoters || [];
  const rewardRows = rewardLogsError ? [] : rewardLogs || [];
  const promoterStats = promoterRows.map((promoter) => {
    const members = memberRows.filter((profile) => profile.promoter_id === promoter.id);
    const logs = rewardRows.filter((log) => log.promoter_id === promoter.id);
    return {
      ...promoter,
      referred_count: members.length,
      completed_registration_count: members.filter((profile) => profile.registration_completed_at).length,
      referral_reward_count: logs.length,
      referral_cp_awarded: logs
        .filter((log) => log.status === "awarded")
        .reduce((sum, log) => sum + Number(log.cp_awarded || 0), 0),
      manual_review_count: logs.filter((log) => ["manual_review", "pending"].includes(log.status)).length,
      blocked_count: logs.filter((log) => log.status === "blocked").length,
      latest_joined_at: members.map((profile) => profile.joined_at || profile.created_at).filter(Boolean).sort().at(-1) || null,
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
      referral_reward_count: rewardRows.length,
      referral_cp_awarded: rewardRows
        .filter((log) => log.status === "awarded")
        .reduce((sum, log) => sum + Number(log.cp_awarded || 0), 0),
      referral_manual_review_count: rewardRows.filter((log) => ["manual_review", "pending"].includes(log.status)).length,
      referral_blocked_count: rewardRows.filter((log) => log.status === "blocked").length,
      by_type: groupBy(memberRows, "promoter_type"),
      by_source: groupBy(memberRows, "referral_source"),
    },
    promoters: promoterStats,
    orphan_promoters: orphanPromoters,
  });
}

async function handleAwardCp(req, res, supabase) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { promoterId, cpAmount, dryRun = false } = req.body || {};
  if (!promoterId) return res.status(400).json({ error: "Missing promoterId." });

  const { data: promoter, error: promoterError } = await supabase.from("promoters").select("*").eq("id", promoterId).maybeSingle();
  if (promoterError) throw promoterError;
  if (!promoter) return res.status(404).json({ error: "Promoter not found." });

  const { count, error: countError } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("promoter_id", promoterId);
  if (countError) throw countError;

  const referralCount = count || 0;
  const awardAmount = Number(cpAmount ?? promoter.cp_per_referral ?? 0) * referralCount;
  const isMemberPromoter = promoter.type === "member" || promoterId.startsWith("P_MEMBER_");
  const { data: recipient, error: recipientError } = await supabase
    .from("profiles")
    .select("id,line_user_id,nickname,cp_points,referral_code")
    .or(`referral_code.eq.${promoterId},promoter_id.eq.${promoterId}`)
    .limit(1)
    .maybeSingle();
  if (recipientError) throw recipientError;

  if (!isMemberPromoter || !recipient) {
    return res.status(200).json({
      success: false,
      requires_manual_settlement: true,
      promoter,
      referralCount,
      awardAmount,
      message: "此推廣人不是可直接入帳的會員推廣人，請由 Admin 手動結算。",
    });
  }

  if (dryRun || awardAmount <= 0) {
    return res.status(200).json({ success: true, dryRun: true, promoter, recipient, referralCount, awardAmount });
  }

  const { data: updated, error: updateError } = await supabase
    .from("profiles")
    .update({ cp_points: (recipient.cp_points || 0) + awardAmount })
    .eq("id", recipient.id)
    .select("id,line_user_id,cp_points,referral_code")
    .single();
  if (updateError) throw updateError;

  return res.status(200).json({ success: true, promoter, recipient: updated, referralCount, awardAmount });
}

export default async function handler(req, res) {
  const action = req.query?.action || req.body?.action || "track";

  try {
    if (action === "track") return await handleTrack(req, res);

    const admin = await requireAdmin(req, res);
    if (!admin) return;
    if (action === "manage") return await handleManage(req, res, admin.supabase);
    if (action === "stats") return await handleStats(req, res, admin.supabase);
    if (action === "award-cp") return await handleAwardCp(req, res, admin.supabase);

    return res.status(400).json({ error: "Unsupported promoter action." });
  } catch (error) {
    console.error("[promoter] failed:", error);
    return res.status(500).json({ error: error.message });
  }
}
