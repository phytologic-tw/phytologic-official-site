import {
  getSupabaseAdmin,
  normalizeProfile,
} from "../_member-utils.js";
import {
  calcLifeNumber,
  getBloodTypeTrait,
  getLifeNumberTrait,
} from "../prompts.js";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

function fallbackInsight(profile) {
  const name = profile.nickname || profile.line_display_name || "你";
  const bloodType = profile.blood_type || "未填血型";
  const lifeNumber = profile.life_number || profile.numerology_number || "未完成";
  const product = profile.recommended_product || "植萃飲品";
  return `${name}，今天先讓身體回到可持續的節奏。${bloodType} 型與生命靈數 ${lifeNumber} 的資料會逐步協助 Dr. Marvin 理解你；先完成飲用、補水與一段安靜休息，就是今天最好的照顧。推薦方向：${product}。`;
}

function buildPrompt(profile) {
  const name = profile.nickname || profile.line_display_name || "健康夥伴";
  const birthday = profile.birth_date || profile.birthdate;
  const lifeNumber = profile.life_number || profile.numerology_number || (birthday ? calcLifeNumber(birthday) : null);
  const lifeTrait = lifeNumber ? getLifeNumberTrait(lifeNumber) : null;
  const bloodTrait = getBloodTypeTrait(profile.blood_type);

  return `你是植本邏輯 PHYTOLOGIC 的 Dr. Marvin，一位溫柔、克制、科學感的植物健康引導顧問。

請為會員產生一段「今日植本洞察」，必須符合：
- 繁體中文
- 70 到 95 字
- 不診斷疾病、不承諾療效、不使用恐懼行銷
- 語氣像安靜的植物學家：溫柔、具體、有邏輯
- 結合血型、生命靈數、生活資料與推薦飲品，但不要像算命
- 只輸出純文字，不要 JSON，不要標題

會員資料：
暱稱：${name}
血型：${profile.blood_type || "未填"}
生命靈數：${lifeNumber || "未完成"}
靈數特質：${lifeTrait?.personality || "資料不足"}
靈數壓力模式：${lifeTrait?.stressPattern || "資料不足"}
血型體質傾向：${bloodTrait.trait}
飲食型態：${profile.diet_pattern || profile.diet_type || "未填"}
睡眠：${profile.sleep_hours || profile.sleep_quality || "未填"}
壓力：${profile.stress_level || profile.stress_score || "未填"}
健康分數：${profile.health_score ?? "未建立"}
推薦飲品：${profile.recommended_product || "尚未推薦"}
今日日期：${new Intl.DateTimeFormat("zh-TW", { timeZone: "Asia/Taipei", dateStyle: "full" }).format(new Date())}`;
}

async function callAnthropicText(prompt) {
  if (!ANTHROPIC_API_KEY) return null;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 220,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(`Anthropic failed: ${JSON.stringify(data)}`);
  return data.content?.map((item) => item.text || "").join("").trim() || null;
}

async function findProfile(supabase, lineUserId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("line_user_id", lineUserId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const body = req.body || {};
  const lineUserId = body.lineUserId || body.line_user_id;
  const force = Boolean(body.force);
  if (!lineUserId || typeof lineUserId !== "string" || !lineUserId.startsWith("U")) {
    return res.status(400).json({ error: "Invalid LINE userId" });
  }

  try {
    const supabase = getSupabaseAdmin();
    const profile = await findProfile(supabase, lineUserId);
    if (!profile) return res.status(404).json({ error: "Member not found" });

    const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Taipei" }).format(new Date());
    const currentDate = profile.daily_insight_updated_at
      ? new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Taipei" }).format(new Date(profile.daily_insight_updated_at))
      : "";

    if (!force && profile.daily_insight && currentDate === today) {
      return res.status(200).json({
        success: true,
        generated: false,
        daily_insight: profile.daily_insight,
        profile: normalizeProfile(profile),
      });
    }

    const prompt = buildPrompt(profile);
    const aiText = await callAnthropicText(prompt);
    const dailyInsight = (aiText || fallbackInsight(profile)).replace(/^["「]|["」]$/g, "").trim();

    const { data: updated, error: updateError } = await supabase
      .from("profiles")
      .update({
        daily_insight: dailyInsight,
        daily_insight_updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id)
      .select("*")
      .single();

    if (updateError) throw updateError;

    return res.status(200).json({
      success: true,
      generated: Boolean(aiText),
      daily_insight: dailyInsight,
      profile: normalizeProfile(updated),
    });
  } catch (error) {
    console.error("[dr-marvin/insight] failed:", error);
    return res.status(500).json({ error: error.message });
  }
}
