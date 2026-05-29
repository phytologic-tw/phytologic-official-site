import {
  calcLevel,
  calcTitle,
  getSupabaseAdmin,
  normalizeProfile,
} from "../_member-utils.js";
import { findProduct, getProducts } from "../_products.js";

const SYSTEM_LABELS = {
  sleep: "睡眠指數",
  digestion: "消化指數",
  musculoskeletal: "肌骨指數",
  circulation: "循環指數",
  energy: "能量指數",
};

const PRODUCT_RULES = {
  sleep: "snow",
  digestion: "lime",
  musculoskeletal: "cinna",
  circulation: "rose",
  energy: "berry",
};

function normalizeAnswers(rawAnswers) {
  if (Array.isArray(rawAnswers)) return rawAnswers;
  if (!rawAnswers || typeof rawAnswers !== "object") return [];
  return Object.entries(rawAnswers).map(([id, value]) => ({ id, value }));
}

function answerSeverity(answer) {
  if (typeof answer.score === "number") return Math.max(0, Math.min(3, answer.score));
  if (typeof answer.severity === "number") return Math.max(0, Math.min(3, answer.severity));
  const numeric = Number(answer.value);
  if (Number.isFinite(numeric)) {
    if (numeric >= 1 && numeric <= 10) return Math.max(0, Math.min(3, Math.round((10 - numeric) / 3)));
    if (numeric >= 0 && numeric <= 3) return numeric;
  }
  return 1;
}

function calculateScores(answers) {
  const buckets = {
    sleep: [],
    digestion: [],
    musculoskeletal: [],
    circulation: [],
    energy: [],
  };

  answers.forEach((answer) => {
    if (answer.system && buckets[answer.system]) {
      buckets[answer.system].push(answerSeverity(answer));
    }
  });

  const scores = {};
  Object.entries(buckets).forEach(([key, values]) => {
    const avgSeverity = values.length
      ? values.reduce((sum, value) => sum + value, 0) / values.length
      : 1;
    scores[SYSTEM_LABELS[key]] = Math.max(0, Math.min(100, Math.round(100 - avgSeverity * 25)));
  });

  return scores;
}

function rankFocusDimensions(scores) {
  return Object.entries(scores)
    .sort((a, b) => Number(a[1]) - Number(b[1]))
    .slice(0, 2)
    .map(([label, score]) => ({ label, score }));
}

function productForDimension(label, products) {
  const entry = Object.entries(SYSTEM_LABELS).find(([, systemLabel]) => systemLabel === label);
  const productId = PRODUCT_RULES[entry?.[0]] || PRODUCT_RULES.energy;
  return findProduct(productId, products) || findProduct("berry", products);
}

function buildReportContent({ profile, scores, healthScore, primary, secondary, focus }) {
  const name = profile.nickname || profile.line_display_name || "你";
  const focusText = focus.map((item) => `${item.label} ${item.score} 分`).join("、");
  return [
    `${name}，這次 Dr. Marvin 檢測的綜合健康分數是 ${healthScore} 分。`,
    `目前最需要關注的是：${focusText}。這代表身體正在提醒你，把日常節奏調回穩定會比追求一次性的補救更重要。`,
    `主推薦為 ${primary.name}，副推薦為 ${secondary.name}。建議這週先固定飲用主推薦，並搭配睡眠、飲水與飲食紀錄。`,
    "本週三個行動：固定每日飲用一次植萃、睡前 30 分鐘放下螢幕、每天補足水分並記錄身體感受。",
    profile.life_number || profile.numerology_number
      ? `以生命靈數 ${profile.life_number || profile.numerology_number} 來看，你適合用可重複的小儀式建立安全感；穩定的節奏會讓身體更快回到自己的邏輯。`
      : "完成生日資料後，Dr. Marvin 會把生命靈數洞察一起納入報告。",
  ].join("\n\n");
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
  if (!lineUserId || typeof lineUserId !== "string" || !lineUserId.startsWith("U")) {
    return res.status(400).json({ error: "Invalid LINE userId" });
  }

  const answers = normalizeAnswers(body.answers);
  if (answers.length < 10) return res.status(400).json({ error: "At least 10 answers are required" });

  try {
    const supabase = getSupabaseAdmin();
    const products = await getProducts(supabase, { allowFallback: true });
    const profile = await findProfile(supabase, lineUserId);
    if (!profile) return res.status(404).json({ error: "Member not found" });

    const scores = calculateScores(answers);
    const healthScore = Math.round(
      Object.values(scores).reduce((sum, value) => sum + Number(value || 0), 0) / Object.values(scores).length
    );
    const focus = rankFocusDimensions(scores);
    const primary = productForDimension(focus[0]?.label, products);
    const secondary = productForDimension(focus[1]?.label, products);
    const reportContent = buildReportContent({ profile, scores, healthScore, primary, secondary, focus });

    const { data: report, error: reportError } = await supabase
      .from("dr_marvin_reports")
      .insert({
        profile_id: profile.id,
        report_type: "deep",
        answers,
        scores,
        health_score: healthScore,
        recommended_product_id: primary.id,
        report_content: reportContent,
        le_awarded: 100,
      })
      .select("*")
      .single();

    if (reportError) throw reportError;

    const nextLe = (profile.le_points || 0) + 100;
    const nextLevelNumber = calcLevel(nextLe);
    const { data: updatedProfile, error: profileError } = await supabase
      .from("profiles")
      .update({
        health_score: healthScore,
        recommended_product_id: primary.id,
        recommended_product: primary.name,
        last_report_id: report.id,
        le_points: nextLe,
        level: `L${nextLevelNumber}`,
        title: calcTitle(nextLevelNumber),
      })
      .eq("id", profile.id)
      .select("*")
      .single();

    if (profileError) throw profileError;

    return res.status(200).json({
      success: true,
      report,
      profile: normalizeProfile(updatedProfile),
      summary: {
        healthScore,
        scores,
        focus,
        primaryRecommendation: primary,
        secondaryRecommendation: secondary,
        leAwarded: 100,
      },
    });
  } catch (error) {
    console.error("[dr-marvin/analyze] failed:", error);
    return res.status(500).json({ error: error.message });
  }
}
