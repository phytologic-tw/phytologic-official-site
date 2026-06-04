import {
  calcLevel,
  calcTitle,
  getSupabaseAdmin,
  normalizeProfile,
} from "../../src/server/member-utils.js";
import { findProduct, getProducts } from "../../src/server/products.js";

const SYSTEM_LABELS = {
  sleep: "睡眠指數",
  digestion: "消化指數",
  musculoskeletal: "肌骨指數",
  circulation: "循環指數",
  energy: "能量指數",
  brain_nerve: "大腦神經指數",
  digestive: "消化黏膜指數",
  detox_liver: "肝膽排毒指數",
  blood_sugar_cardio: "血糖心血管指數",
  endocrine_hormone: "內分泌荷爾蒙指數",
  muscle_bone: "肌肉骨骼指數",
  immune: "免疫發炎指數",
};

const PRODUCT_RULES = {
  sleep: "snow",
  digestion: "lime",
  musculoskeletal: "cinna",
  circulation: "rose",
  energy: "cinna",
  brain_nerve: "snow",
  digestive: "lime",
  detox_liver: "lime",
  blood_sugar_cardio: "lime",
  endocrine_hormone: "rose",
  muscle_bone: "cinna",
  immune: "snow",
};

const SECONDARY_PRODUCT_RULES = {
  sleep: "berry",
  digestion: "white_gold_base",
  musculoskeletal: "platinum",
  circulation: "lime",
  energy: "platinum",
  brain_nerve: "berry",
  digestive: "white_gold_base",
  detox_liver: "white_gold_base",
  blood_sugar_cardio: "lime",
  endocrine_hormone: "lime",
  muscle_bone: "platinum",
  immune: "snow",
};

const DEFAULT_SECONDARY_BY_PRIMARY = {
  snow: "berry",
  lime: "white_gold_base",
  rose: "lime",
  cinna: "platinum",
  berry: "snow",
  platinum: "lime",
  white_gold_base: "lime",
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
  const buckets = Object.fromEntries(Object.keys(SYSTEM_LABELS).map((key) => [key, []]));

  answers.forEach((answer) => {
    const system = answer.system_category || answer.system;
    if (system && buckets[system]) {
      buckets[system].push(answerSeverity(answer));
    }
  });

  const scores = {};
  Object.entries(buckets).forEach(([key, values]) => {
    if (!values.length) return;
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

function systemKeyForLabel(label) {
  const entry = Object.entries(SYSTEM_LABELS).find(([, systemLabel]) => systemLabel === label);
  return entry?.[0] || "energy";
}

function productForDimension(label, products) {
  const productId = PRODUCT_RULES[systemKeyForLabel(label)] || PRODUCT_RULES.energy;
  return findProduct(productId, products) || findProduct("berry", products);
}

function secondaryProductForDimension(label, primary, products) {
  const systemKey = systemKeyForLabel(label);
  const preferredId = SECONDARY_PRODUCT_RULES[systemKey] || DEFAULT_SECONDARY_BY_PRIMARY[primary?.id] || "berry";
  const preferred = findProduct(preferredId, products);
  if (preferred && preferred.id !== primary?.id) return preferred;

  const fallbackId = DEFAULT_SECONDARY_BY_PRIMARY[primary?.id] || "berry";
  const fallback = findProduct(fallbackId, products);
  if (fallback && fallback.id !== primary?.id) return fallback;

  return products.find((product) => product.id !== primary?.id && product.metadata?.product_role !== "base_carrier")
    || products.find((product) => product.id !== primary?.id)
    || primary;
}

function productSafetySummary(product) {
  const notes = product?.metadata?.safety_notes;
  if (!notes) return "";
  const cautions = [
    ...(notes.absolute_avoid || []),
    ...(notes.relative_caution || []),
    ...(notes.consult_professional || []),
  ];
  if (!cautions.length) return "";
  return `飲食注意：${cautions.slice(0, 2).join("；")}。`;
}

function buildReportContent({ profile, scores, healthScore, primary, secondary, focus }) {
  const name = profile.nickname || profile.line_display_name || "你";
  const focusText = focus.map((item) => `${item.label} ${item.score} 分`).join("、");
  const safetyText = [productSafetySummary(primary), productSafetySummary(secondary)].filter(Boolean).join("\n");
  return [
    `${name}，這次 Dr. Marvin 檢測的綜合健康分數是 ${healthScore} 分。`,
    `目前最需要關注的是：${focusText}。這代表身體正在提醒你，把日常節奏調回穩定會比追求一次性的補救更重要。`,
    `主推薦為 ${primary.name}，副推薦為 ${secondary.name}。建議這週先固定飲用主推薦，並搭配睡眠、飲水與飲食紀錄。`,
    safetyText || "若有慢性病、孕期、特殊藥物或飲食限制，請先與專業人員確認飲用安排。",
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
    const secondary = secondaryProductForDimension(focus[1]?.label || focus[0]?.label, primary, products);
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

    const assessmentSessionId = body.assessmentSessionId || body.assessment_session_id;
    if (assessmentSessionId) {
      await Promise.all(
        answers
          .filter((answer) => answer.question_id || answer.id)
          .map((answer) =>
            supabase
              .from("member_question_history")
              .update({
                answered_at: new Date().toISOString(),
                answer_score: answerSeverity(answer),
                answer_payload: answer,
              })
              .eq("profile_id", profile.id)
              .eq("assessment_session_id", assessmentSessionId)
              .eq("question_id", answer.question_id || answer.id)
          )
      );
    }

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
