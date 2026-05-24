import { requireAdmin } from "./_admin.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const admin = await requireAdmin(req, res);
  if (!admin) return;

  const { promoterId, cpAmount, dryRun = false } = req.body || {};
  if (!promoterId) return res.status(400).json({ error: "Missing promoterId." });

  try {
    const { supabase } = admin;
    const { data: promoter, error: promoterError } = await supabase
      .from("promoters")
      .select("*")
      .eq("id", promoterId)
      .maybeSingle();
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
      .select("id,line_user_id,display_name:nickname,cp_points,referral_code")
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

    const nextCp = (recipient.cp_points || 0) + awardAmount;
    const { data: updated, error: updateError } = await supabase
      .from("profiles")
      .update({ cp_points: nextCp })
      .eq("id", recipient.id)
      .select("id,line_user_id,cp_points,referral_code")
      .single();
    if (updateError) throw updateError;

    return res.status(200).json({
      success: true,
      promoter,
      recipient: updated,
      referralCount,
      awardAmount,
    });
  } catch (error) {
    console.error("[promoter/award-cp] failed:", error);
    return res.status(500).json({ error: error.message });
  }
}
