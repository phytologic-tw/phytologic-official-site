import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Check, Leaf, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { supabase, supabaseConfigMessage } from "../lib/supabase";
import { submitPublicRecord } from "../lib/adminData";
import UnlockFullReportCard from "./line/UnlockFullReportCard";

const QUESTION_COUNT = 7;
const hasJoinedLine = false;

const AGE_GROUPS = [
  { label: "青少年", range: "12-16 歲" },
  { label: "青年", range: "20-30 歲" },
  { label: "中壯年", range: "35-45 歲" },
  { label: "熟齡", range: "50-60 歲" },
  { label: "銀髮樂齡", range: "65-75 歲" },
];

const WORK_TYPES = ["久坐辦公", "外勤走動", "體力勞動", "學生", "輪班工作", "自由業 / 居家工作", "其他"];
const SLEEP_HOURS = ["少於 5 小時", "5-6 小時", "6-7 小時", "7-8 小時", "8 小時以上"];
const SLEEP_QUALITY = ["良好", "普通", "淺眠 / 多夢", "常醒 / 早醒", "入睡困難"];
const EXERCISE_HABITS = ["幾乎沒有", "每週 1-2 次", "每週 3-4 次", "每週 5 次以上", "高強度訓練"];
const DIET_PATTERNS = ["均衡飲食", "外食為主", "高油 / 高糖", "低醣 / 控糖", "素食 / 植物性飲食", "常跳餐"];
const STRESS_LEVELS = ["低", "中", "偏高", "高", "非常高"];

const CATEGORY_ORDER = ["sleep", "digestion", "stress", "metabolism", "immune", "muscle", "eye"];

const initialProfile = {
  gender: "",
  ageGroup: "",
  heightCm: "",
  weightKg: "",
  workType: "",
  sleepHours: "",
  sleepQuality: "",
  exerciseHabit: "",
  dietPattern: "",
  stressLevel: "",
};

const PRODUCTS = [
  { id: "lime", name: "青檸植萃", color: "#BFD9BF", desc: "翡翠綠｜代謝循環、腸道順暢與體內環保支持", focus: "digestion / metabolism", categories: ["digestion", "metabolism"] },
  { id: "snow", name: "雪山植萃", color: "#E7DDCF", desc: "珍珠白｜睡眠、壓力疲勞與免疫平衡支持", focus: "sleep / stress / immune", categories: ["sleep", "stress", "immune"] },
  { id: "rose", name: "玫瑰植萃", color: "#E6C3CC", desc: "寶石紅｜女性保養、氣色循環與抗氧化支持", focus: "female / beauty", categories: ["female", "beauty"] },
  { id: "cinna", name: "桂香植萃", color: "#E6D39E", desc: "金鑽黃｜運動恢復、能量代謝與增肌支持", focus: "muscle / exercise", categories: ["muscle", "exercise"] },
  { id: "berry", name: "紫莓植萃", color: "#CFC3DF", desc: "碧璽紫｜護眼抗氧化、3C 使用與長時間用眼支持", focus: "eye / screen", categories: ["eye", "screen"] },
];

const QUESTION_BANK = [
  { id: "sleep-01", category: "sleep", text: "最近睡醒後仍覺得疲勞，白天精神恢復速度偏慢？", tags: ["少於 5 小時", "5-6 小時", "淺眠 / 多夢", "常醒 / 早醒", "入睡困難", "輪班工作"] },
  { id: "sleep-02", category: "sleep", text: "入睡、熟睡或維持固定作息，對你來說變得不太穩定？", tags: ["淺眠 / 多夢", "常醒 / 早醒", "入睡困難", "高", "非常高"] },
  { id: "digestion-01", category: "digestion", text: "外食或吃得較油時，容易覺得胃脹、消化速度慢或腹部悶重？", tags: ["外食為主", "高油 / 高糖", "久坐辦公", "常跳餐"] },
  { id: "digestion-02", category: "digestion", text: "排便節奏不固定，偶爾有乾硬、卡住或排完仍不清爽的感覺？", tags: ["外食為主", "少於 5 小時", "5-6 小時", "久坐辦公"] },
  { id: "stress-01", category: "stress", text: "工作或生活壓力一高，就容易焦躁、緊繃或難以真正放鬆？", tags: ["偏高", "高", "非常高", "久坐辦公", "自由業 / 居家工作"] },
  { id: "stress-02", category: "stress", text: "下午或晚上常覺得腦袋轉很久，身體累但精神停不下來？", tags: ["高", "非常高", "入睡困難", "淺眠 / 多夢", "輪班工作"] },
  { id: "metabolism-01", category: "metabolism", text: "久坐、外食或鹽分較高後，隔天容易覺得浮腫或身體沉重？", tags: ["久坐辦公", "外食為主", "高油 / 高糖", "體力勞動"] },
  { id: "metabolism-02", category: "metabolism", text: "餐後容易昏沉，或對甜食、澱粉與手搖飲的渴望變明顯？", tags: ["高油 / 高糖", "常跳餐", "外食為主", "少於 5 小時"] },
  { id: "immune-01", category: "immune", text: "換季、熬夜或壓力大時，身體防護感變弱，容易出現敏感反應？", tags: ["少於 5 小時", "5-6 小時", "偏高", "高", "非常高"] },
  { id: "immune-02", category: "immune", text: "皮膚、鼻子或喉嚨在環境變化時，較容易有不舒服的訊號？", tags: ["外勤走動", "學生", "輪班工作", "高"] },
  { id: "muscle-01", category: "muscle", text: "運動、久站或久坐後，肌肉緊繃、痠感或恢復速度不如以往？", tags: ["每週 3-4 次", "每週 5 次以上", "高強度訓練", "久坐辦公", "體力勞動"] },
  { id: "muscle-02", category: "muscle", text: "訓練後或勞動後，隔天仍覺得身體沉、腿部或肩頸需要更久舒緩？", tags: ["體力勞動", "外勤走動", "高強度訓練", "每週 5 次以上"] },
  { id: "eye-01", category: "eye", text: "長時間看手機、電腦或平板後，眼睛乾澀、酸脹或聚焦變慢？", tags: ["久坐辦公", "學生", "自由業 / 居家工作", "少於 5 小時"] },
  { id: "eye-02", category: "eye", text: "晚上或光線變暗時，視覺清晰度與眼睛舒適度比較容易下降？", tags: ["熟齡", "銀髮樂齡", "久坐辦公", "學生"] },
];

const ANSWER_OPTIONS = [
  { label: "完全沒有", score: 1 },
  { label: "很少發生", score: 2 },
  { label: "偶爾發生", score: 3 },
  { label: "經常發生", score: 4 },
  { label: "非常明顯", score: 5 },
];

const CATEGORY_LABELS = {
  sleep: "睡眠 / 疲勞",
  digestion: "腸胃 / 排便",
  metabolism: "代謝 / 水腫",
  stress: "壓力 / 情緒",
  immune: "免疫 / 敏感",
  muscle: "肌肉 / 運動恢復",
  eye: "眼睛 / 3C 使用",
};

function profileSignals(profile) {
  return Object.values(profile).filter(Boolean).join("｜");
}

function questionRelevance(question, profile) {
  const signals = profileSignals(profile);
  return question.tags.reduce((score, tag) => score + (signals.includes(tag) ? 3 : 0), 0) + Math.random();
}

function selectQuestions(profile) {
  return CATEGORY_ORDER.map((category) => {
    const pool = QUESTION_BANK.filter((question) => question.category === category);
    return [...pool].sort((a, b) => questionRelevance(b, profile) - questionRelevance(a, profile))[0];
  }).filter(Boolean).slice(0, QUESTION_COUNT);
}

function getLevel(total) {
  if (total <= 13) return "狀態穩定";
  if (total <= 20) return "輕度失衡";
  if (total <= 27) return "中度警訊";
  return "高度警訊";
}

function buildCategoryScores(questions, answers) {
  return questions.reduce((scores, question) => {
    scores[question.category] = (scores[question.category] || 0) + (answers[question.id] ?? 0);
    return scores;
  }, {});
}

function getRecommendedProducts(categoryScores, profile) {
  const productScores = PRODUCTS.map((product) => {
    const categoryScore = product.categories.reduce((sum, category) => sum + (categoryScores[category] || 0), 0);
    const femaleBeautyBoost = product.id === "rose" && profile.gender === "女" ? 1 : 0;
    return { ...product, score: categoryScore + femaleBeautyBoost };
  }).sort((a, b) => b.score - a.score);

  const primary = productScores[0] || PRODUCTS[0];
  const secondary = productScores.find((product) => product.id !== primary.id && product.score === primary.score) || productScores.find((product) => product.id !== primary.id);
  return { primary, secondary };
}

function parseAiResult(text, fallback) {
  const jsonText = text?.match(/\{[\s\S]*\}/)?.[0];
  if (!jsonText) return fallback;

  try {
    return { ...fallback, ...JSON.parse(jsonText) };
  } catch {
    return fallback;
  }
}

function getBmi(profile) {
  const height = Number(profile.heightCm);
  const weight = Number(profile.weightKg);
  if (!height || !weight) return null;
  return Number((weight / ((height / 100) ** 2)).toFixed(1));
}

function buildProfileSummary(profile, bmi) {
  return {
    ageLabel: profile.ageGroup,
    bmi: bmi ? String(bmi) : "未提供",
    workType: profile.workType,
    sleep: `${profile.sleepHours}，睡眠品質：${profile.sleepQuality}`,
    exercise: profile.exerciseHabit,
    diet: profile.dietPattern,
    stress: profile.stressLevel,
  };
}

function buildPrompt({ profileSummary, total, levelLabel, categorySummary, answerSummary, primary, secondary }) {
  const productSummary = PRODUCTS.map((product) => `${product.id}｜${product.name}｜${product.desc}｜對應：${product.focus}`).join("\n");

  return `你是植本邏輯（PHYTOLOGIC）的 Dr.Marvin 健康系統顧問，擅長以生活型態與植物機能飲品做日常健康建議。

請根據以下「7 題生理狀態快篩」結果，分析使用者目前最需要被支持的生活狀態，並推薦最適合的一款植本邏輯飲品與一個具體生活改變方式。請避免醫療宣稱，用支持、幫助、維持、有助於、調節等語氣。

用戶資料：
- 年齡：${profileSummary.ageLabel}
- BMI：${profileSummary.bmi}
- 職業型態：${profileSummary.workType}
- 睡眠：${profileSummary.sleep}
- 運動：${profileSummary.exercise}
- 飲食：${profileSummary.diet}
- 壓力：${profileSummary.stress}
- 快篩總分：${total} / 35（${levelLabel}）
- 分類線索：${categorySummary}
- 系統推薦主選：${primary.name}
- 系統推薦輔助：${secondary?.name || "無"}
- 7 題作答結果：
${answerSummary}

可推薦飲品：
${productSummary}

請只回傳 JSON，不要 Markdown，不要補充 JSON 以外文字。格式如下：
{
  "analysis": "150-220字繁體中文分析。用「您」直接說明目前最關鍵的生活狀態、可能原因，以及為什麼這款飲品最適合。",
  "recommendedProductId": "snow 或 lime 或 rose 或 cinna 或 berry",
  "recommendedProductName": "飲品名稱",
  "lifestyleChange": "一個具體、今天就能開始的生活改變方式，60字以內"
}`;
}

function getMissingColumn(message = "") {
  return message.match(/Could not find the '([^']+)' column/)?.[1] || null;
}

async function insertAssessmentReport(reportPayload) {
  const payload = { ...reportPayload };
  const removedColumns = [];

  for (let attempt = 0; attempt < 30; attempt += 1) {
    const { error } = await supabase.from("assessment_reports").insert(payload);
    if (!error) return { error: null, removedColumns };

    const missingColumn = getMissingColumn(error.message);
    if (!missingColumn || !(missingColumn in payload)) return { error, removedColumns };

    delete payload[missingColumn];
    removedColumns.push(missingColumn);
  }

  return {
    error: new Error("assessment_reports schema cache 缺少多個欄位，請執行 Supabase migration 後再試。"),
    removedColumns,
  };
}

export default function HealthAssessment() {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState(initialProfile);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [aiResult, setAiResult] = useState(null);
  const [statusText, setStatusText] = useState("");
  const [saveNotice, setSaveNotice] = useState("");
  const [saveStatus, setSaveStatus] = useState("idle");
  const [assessmentId, setAssessmentId] = useState(null);
  const resultRef = useRef(null);

  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / QUESTION_COUNT) * 100);
  const completed = answeredCount === QUESTION_COUNT;
  const bmi = getBmi(profile);
  const profileCompleted = Object.values(profile).every(Boolean) && bmi;
  const profileSummary = buildProfileSummary(profile, bmi);

  const result = useMemo(() => {
    if (!profile.ageGroup || questions.length !== QUESTION_COUNT) return null;
    const total = Object.values(answers).reduce((sum, score) => sum + score, 0);
    const levelLabel = getLevel(total);
    const categoryScores = buildCategoryScores(questions, answers);
    const topSignals = Object.entries(categoryScores)
      .filter(([, score]) => score > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([key, score]) => `${CATEGORY_LABELS[key]} ${score} 分`);
    const recommendations = getRecommendedProducts(categoryScores, profile);

    return {
      total,
      levelLabel,
      categoryScores,
      topSignals,
      recommendations,
      categorySummary: topSignals.length ? topSignals.join("；") : "目前沒有明顯集中線索",
      answerSummary: questions.map((question, index) => `${index + 1}. ${question.text} 回答：${ANSWER_OPTIONS.find((option) => option.score === answers[question.id])?.label ?? "未作答"}`).join("\n"),
    };
  }, [profile, answers, questions]);

  useEffect(() => {
    if (step === 3) {
      window.setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    }
  }, [step]);

  const resetAssessment = () => {
    setStep(0);
    setProfile(initialProfile);
    setQuestions([]);
    setAnswers({});
    setAiResult(null);
    setStatusText("");
    setSaveNotice("");
    setSaveStatus("idle");
    setAssessmentId(null);
  };

  const startAssessment = () => {
    setQuestions(selectQuestions(profile));
    setAnswers({});
    setAiResult(null);
    setSaveNotice("");
    setStep(1);
    window.setTimeout(() => document.querySelector("#physon")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  const runAnalysis = async () => {
    if (!result || !completed) return;

    setStep(2);
    setStatusText("Dr.Marvin 正在分析 7 題生理狀態線索...");
    setSaveNotice("");
    setSaveStatus("idle");

    const { primary, secondary } = result.recommendations;
    const fallback = {
      analysis: `您目前的快篩總分為 ${result.total} 分，屬於「${result.levelLabel}」。從回答來看，較需要留意的是 ${result.categorySummary}。這通常與睡眠節律、壓力累積、外食型態、久坐或恢復不足有關。Dr.Marvin 建議優先選擇 ${primary.name}，以植物機能支持日常狀態；${secondary ? `也可把 ${secondary.name} 作為輔助選擇。` : ""}`,
      recommendedProductId: primary.id,
      recommendedProductName: primary.name,
      lifestyleChange: "今天先固定一個睡前儀式，晚餐增加深色蔬菜，並安排10分鐘輕快步行。",
    };

    let parsedResult = fallback;
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: buildPrompt({
            profileSummary,
            total: result.total,
            levelLabel: result.levelLabel,
            categorySummary: result.categorySummary,
            answerSummary: result.answerSummary,
            primary,
            secondary,
          }),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error?.message || data?.error || "AI analysis failed");
      parsedResult = parseAiResult(data.result, fallback);
    } catch {
      setStatusText("目前先使用本機分析產生報告。");
    }

    const selectedProduct = PRODUCTS.find((product) => product.id === parsedResult.recommendedProductId || product.name === parsedResult.recommendedProductName) || primary;
    const secondaryProduct = secondary?.id === selectedProduct.id ? null : secondary;
    const finalResult = {
      ...parsedResult,
      recommendedProductId: selectedProduct.id,
      recommendedProductName: selectedProduct.name,
      product: selectedProduct,
      secondaryProduct,
    };

    setAiResult(finalResult);

    const answerRows = questions.map((question) => ({
      id: question.id,
      category: question.category,
      categoryLabel: CATEGORY_LABELS[question.category],
      text: question.text,
      score: answers[question.id] ?? null,
      label: ANSWER_OPTIONS.find((option) => option.score === answers[question.id])?.label ?? null,
    }));
    const createdAt = new Date().toISOString();
    const clientGeneratedId = crypto.randomUUID();
    const reportPayload = {
      id: clientGeneratedId,
      name: null,
      gender: profile.gender,
      age_group: profile.ageGroup,
      height_cm: Number(profile.heightCm),
      weight_kg: Number(profile.weightKg),
      bmi,
      work_type: profile.workType,
      sleep_hours: profile.sleepHours,
      sleep_quality: profile.sleepQuality,
      exercise_habit: profile.exerciseHabit,
      diet_pattern: profile.dietPattern,
      stress_level: profile.stressLevel,
      answers: answerRows,
      total_score: result.total,
      inflammation_level: result.levelLabel,
      system_scores: result.categoryScores,
      primary_systems: result.categoryScores,
      recommended_products: [selectedProduct.name, secondaryProduct?.name].filter(Boolean),
      ai_analysis: finalResult.analysis,
      lifestyle_advice: finalResult.lifestyleChange,
      partial_report: {
        analysis: finalResult.analysis,
        lifestyleChange: finalResult.lifestyleChange,
        level: result.levelLabel,
        recommendedProductName: selectedProduct.name,
        secondaryProductName: secondaryProduct?.name || null,
        scoreRange: "7-35",
        questionCount: QUESTION_COUNT,
      },
      full_report: {
        profile: profileSummary,
        systemScores: result.categoryScores,
        topSignals: result.topSignals,
        answerSummary: result.answerSummary,
        questions: answerRows,
        recommendationLogic: "digestion/metabolism→青檸；sleep/stress/immune→雪山；female/beauty→玫瑰；muscle/exercise→桂香；eye/screen→紫莓",
      },
      has_joined_line: hasJoinedLine,
      created_at: createdAt,
    };

    setSaveStatus("loading");
    if (supabase) {
      const { error, removedColumns } = await insertAssessmentReport(reportPayload);
      if (error) {
        setSaveStatus("error");
        setSaveNotice(`測驗結果儲存失敗：${error.message}`);
      } else {
        setAssessmentId(clientGeneratedId);
        setSaveStatus("success");
        setSaveNotice(removedColumns.length ? "本次評估已建立，請至下方取得報告編號。部分完整欄位待資料庫更新後啟用。" : "本次評估已建立，請至下方取得報告編號。");
      }
    } else {
      try {
        await submitPublicRecord("assessment_reports", reportPayload);
        setAssessmentId(clientGeneratedId);
        setSaveStatus("success");
        setSaveNotice("Supabase 尚未設定，本次評估已暫存在 localStorage demo fallback。");
      } catch (requestError) {
        setSaveStatus("error");
        setSaveNotice(`${supabaseConfigMessage} ${requestError.message}`);
      }
    }

    setStep(3);
  };

  return (
    <div className="mx-auto max-w-5xl text-[#1C3D2B]">
      <div className="mb-10 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.32em] text-[#C8A96E]">DR.MARVIN HEALTH CHECK</p>
        <h3 className="text-3xl font-semibold md:text-5xl">Dr.Marvin 生理狀態快篩</h3>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#49675A]">依年齡、工作型態、睡眠、運動與壓力資料，從題庫挑出最相關的 7 題，快速建立植物機能飲品推薦。</p>
      </div>

      {step === 0 && (
        <div className="rounded-2xl border border-[#E5E0D5] bg-white p-6 shadow-xl shadow-[#123828]/5 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1C3D2B] text-white"><Leaf className="h-5 w-5" /></div>
            <div>
              <p className="text-sm text-[#8B7A4C]">步驟 1 / 3</p>
              <h4 className="text-2xl font-semibold">輸入基本資料</h4>
            </div>
          </div>
          <div className="mb-7 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm text-[#8B7A4C]">性別</span>
              <select value={profile.gender} onChange={(event) => setProfile((prev) => ({ ...prev, gender: event.target.value }))} className="w-full rounded-2xl border border-[#E5E0D5] bg-white px-5 py-4 outline-none focus:border-[#C8A96E]">
                <option value="">請選擇</option>
                <option>男</option>
                <option>女</option>
                <option>其他</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-[#8B7A4C]">年齡區間</span>
              <select value={profile.ageGroup} onChange={(event) => setProfile((prev) => ({ ...prev, ageGroup: event.target.value }))} className="w-full rounded-2xl border border-[#E5E0D5] bg-white px-5 py-4 outline-none focus:border-[#C8A96E]">
                <option value="">請選擇</option>
                {AGE_GROUPS.map((group) => <option key={group.label} value={`${group.label}（${group.range}）`}>{group.label}（{group.range}）</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-[#8B7A4C]">職業 / 工作型態</span>
              <select value={profile.workType} onChange={(event) => setProfile((prev) => ({ ...prev, workType: event.target.value }))} className="w-full rounded-2xl border border-[#E5E0D5] bg-white px-5 py-4 outline-none focus:border-[#C8A96E]">
                <option value="">請選擇</option>
                {WORK_TYPES.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-2 block text-sm text-[#8B7A4C]">身高 cm</span>
                <input type="number" min="1" value={profile.heightCm} onChange={(event) => setProfile((prev) => ({ ...prev, heightCm: event.target.value }))} className="w-full rounded-2xl border border-[#E5E0D5] bg-white px-5 py-4 outline-none focus:border-[#C8A96E]" placeholder="170" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-[#8B7A4C]">體重 kg</span>
                <input type="number" min="1" value={profile.weightKg} onChange={(event) => setProfile((prev) => ({ ...prev, weightKg: event.target.value }))} className="w-full rounded-2xl border border-[#E5E0D5] bg-white px-5 py-4 outline-none focus:border-[#C8A96E]" placeholder="65" />
              </label>
            </div>
            <label className="block">
              <span className="mb-2 block text-sm text-[#8B7A4C]">睡眠時間</span>
              <select value={profile.sleepHours} onChange={(event) => setProfile((prev) => ({ ...prev, sleepHours: event.target.value }))} className="w-full rounded-2xl border border-[#E5E0D5] bg-white px-5 py-4 outline-none focus:border-[#C8A96E]">
                <option value="">請選擇</option>
                {SLEEP_HOURS.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-[#8B7A4C]">睡眠品質</span>
              <select value={profile.sleepQuality} onChange={(event) => setProfile((prev) => ({ ...prev, sleepQuality: event.target.value }))} className="w-full rounded-2xl border border-[#E5E0D5] bg-white px-5 py-4 outline-none focus:border-[#C8A96E]">
                <option value="">請選擇</option>
                {SLEEP_QUALITY.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-[#8B7A4C]">運動習慣</span>
              <select value={profile.exerciseHabit} onChange={(event) => setProfile((prev) => ({ ...prev, exerciseHabit: event.target.value }))} className="w-full rounded-2xl border border-[#E5E0D5] bg-white px-5 py-4 outline-none focus:border-[#C8A96E]">
                <option value="">請選擇</option>
                {EXERCISE_HABITS.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-[#8B7A4C]">飲食型態</span>
              <select value={profile.dietPattern} onChange={(event) => setProfile((prev) => ({ ...prev, dietPattern: event.target.value }))} className="w-full rounded-2xl border border-[#E5E0D5] bg-white px-5 py-4 outline-none focus:border-[#C8A96E]">
                <option value="">請選擇</option>
                {DIET_PATTERNS.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm text-[#8B7A4C]">壓力程度</span>
              <select value={profile.stressLevel} onChange={(event) => setProfile((prev) => ({ ...prev, stressLevel: event.target.value }))} className="w-full rounded-2xl border border-[#E5E0D5] bg-white px-5 py-4 outline-none focus:border-[#C8A96E]">
                <option value="">請選擇</option>
                {STRESS_LEVELS.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
          </div>
          {bmi && <p className="mb-2 text-sm text-[#49675A]">BMI 將納入 AI 分析：<span className="font-semibold text-[#1C3D2B]">{bmi}</span></p>}
          <button type="button" disabled={!profileCompleted} onClick={startAssessment} className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#1C3D2B] px-7 py-4 font-medium text-white transition hover:bg-[#28583F] disabled:cursor-not-allowed disabled:bg-[#A9B5AF]">
            開始 7 題快篩 <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="rounded-2xl border border-[#E5E0D5] bg-white p-5 shadow-xl shadow-[#123828]/5 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1C3D2B] text-white"><Sparkles className="h-5 w-5" /></div>
              <div>
                <p className="text-sm text-[#8B7A4C]">步驟 2 / 3</p>
                <h4 className="text-2xl font-semibold">7 題生理狀態快篩</h4>
              </div>
            </div>
            <div className="rounded-full bg-[#F5F2EB] px-4 py-2 text-sm font-semibold text-[#49675A]">{answeredCount} / {QUESTION_COUNT} 題完成</div>
          </div>
          <div className="mt-6 h-3 overflow-hidden rounded-full bg-[#EFEAE0]">
            <div className="h-full rounded-full bg-[#C8A96E] transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-8 space-y-5">
            {questions.map((question, index) => (
              <div key={question.id} className="rounded-2xl border border-[#E5E0D5] bg-[#FDFBF6] p-5">
                <div className="mb-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#8B7A4C]">{CATEGORY_LABELS[question.category]}</div>
                <p className="font-medium leading-7">{index + 1}. {question.text}</p>
                <div className="mt-4 grid grid-cols-5 gap-2">
                  {ANSWER_OPTIONS.map((option) => {
                    const active = answers[question.id] === option.score;
                    return (
                      <button key={option.score} type="button" onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: option.score }))} className={`min-h-[62px] rounded-2xl border px-2 py-2 text-center text-xs font-semibold transition md:min-h-[72px] md:text-sm ${active ? "border-[#1C3D2B] bg-[#1C3D2B] text-white shadow-lg shadow-[#1C3D2B]/15" : "border-[#E5E0D5] bg-white text-[#1C3D2B] hover:border-[#C8A96E]"}`} aria-label={`${option.score} 分：${option.label}`}>
                        <span className="block text-xl md:text-2xl">{option.score}</span>
                        <span className="mt-1 block leading-tight">{option.label}</span>
                        {active && <Check className="mx-auto mt-1 h-4 w-4" />}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-3 text-right text-sm text-[#8B7A4C]">
                  目前分數：<span className="font-semibold text-[#1C3D2B]">{answers[question.id] || "-"} / 5</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
            <button type="button" onClick={resetAssessment} className="rounded-full border border-[#C8A96E] bg-white px-6 py-3 font-medium text-[#1C3D2B] transition hover:bg-[#F5F2EB]">重新填寫資料</button>
            <button type="button" disabled={!completed} onClick={runAnalysis} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#1C3D2B] px-7 py-3 font-medium text-white transition hover:bg-[#28583F] disabled:cursor-not-allowed disabled:bg-[#A9B5AF]">
              交給 AI 分析 <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-[#E5E0D5] bg-white p-8 text-center shadow-xl shadow-[#123828]/5">
          <Loader2 className="h-12 w-12 animate-spin text-[#C8A96E]" />
          <h4 className="mt-6 text-3xl font-semibold">Dr.Marvin 正在生成個人化分析</h4>
          <p className="mt-4 max-w-lg leading-8 text-[#49675A]">{statusText || "AI 正在比對生活型態、分類分數與植物機能飲品特性。"}</p>
        </div>
      )}

      {step === 3 && result && aiResult && (
        <div ref={resultRef} className="space-y-6 scroll-mt-24">
          <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-2xl border border-[#E5E0D5] bg-[#1C3D2B] p-7 text-white shadow-xl shadow-[#123828]/10">
              <p className="text-sm tracking-[0.24em] text-[#C8A96E]">PHYSIOLOGIC SCORE</p>
              <div className="mt-4 text-6xl font-semibold">{result.total}<span className="text-xl text-white/50">/35</span></div>
              <div className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#1C3D2B]">{result.levelLabel}</div>
              <p className="mt-5 leading-8 text-white/70">{profile.ageGroup}｜7 題生理狀態快篩</p>
            </div>
            <div className="rounded-2xl border border-[#E5E0D5] bg-white p-7 shadow-xl shadow-[#123828]/5">
              <h4 className="text-2xl font-semibold">AI 判讀重點</h4>
              <p className="mt-4 text-lg leading-9 text-[#49675A]">{aiResult.analysis}</p>
            </div>
          </div>
          <div className="rounded-2xl border border-[#E5E0D5] bg-white p-7">
            <h4 className="text-2xl font-semibold">基本資料摘要</h4>
            <div className="mt-5 grid gap-3 text-sm text-[#49675A] md:grid-cols-5">
              <div className="rounded-2xl bg-[#FDFBF6] p-4"><span className="block text-[#8B7A4C]">年齡區間</span><strong className="mt-2 block text-[#1C3D2B]">{profileSummary.ageLabel}</strong></div>
              <div className="rounded-2xl bg-[#FDFBF6] p-4"><span className="block text-[#8B7A4C]">BMI</span><strong className="mt-2 block text-[#1C3D2B]">{profileSummary.bmi}</strong></div>
              <div className="rounded-2xl bg-[#FDFBF6] p-4"><span className="block text-[#8B7A4C]">工作型態</span><strong className="mt-2 block text-[#1C3D2B]">{profileSummary.workType}</strong></div>
              <div className="rounded-2xl bg-[#FDFBF6] p-4"><span className="block text-[#8B7A4C]">睡眠狀態</span><strong className="mt-2 block text-[#1C3D2B]">{profileSummary.sleep}</strong></div>
              <div className="rounded-2xl bg-[#FDFBF6] p-4"><span className="block text-[#8B7A4C]">運動頻率</span><strong className="mt-2 block text-[#1C3D2B]">{profileSummary.exercise}</strong></div>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-2xl border border-[#E5E0D5] bg-white p-7 shadow-xl shadow-[#123828]/5">
              <span className="rounded-full bg-[#1C3D2B] px-4 py-2 text-sm font-medium text-white">AI 首選推薦</span>
              <div className="mt-6 h-3 w-24 rounded-full" style={{ backgroundColor: aiResult.product.color }} />
              <h4 className="mt-5 text-3xl font-semibold">{aiResult.product.name}</h4>
              <p className="mt-3 leading-7 text-[#49675A]">{aiResult.product.desc}</p>
              {aiResult.secondaryProduct && (
                <div className="mt-5 rounded-2xl bg-[#FDFBF6] p-4">
                  <div className="text-sm font-semibold text-[#8B7A4C]">輔助推薦</div>
                  <div className="mt-2 text-xl font-semibold text-[#1C3D2B]">{aiResult.secondaryProduct.name}</div>
                  <p className="mt-2 text-sm leading-6 text-[#49675A]">{aiResult.secondaryProduct.desc}</p>
                </div>
              )}
            </div>
            <div className="rounded-2xl border border-[#E5E0D5] bg-[#FDFBF6] p-7">
              <h4 className="text-2xl font-semibold">今天開始的生活改變</h4>
              <p className="mt-4 text-lg leading-9 text-[#49675A]">{aiResult.lifestyleChange}</p>
              {saveNotice && <p className={`mt-5 rounded-2xl px-5 py-4 text-sm ${saveStatus === "error" ? "bg-[#FFF7F5] text-[#9A3C2D]" : "bg-white text-[#8B7A4C]"}`}>{saveStatus === "loading" ? "測驗結果儲存中..." : saveNotice}</p>}
            </div>
          </div>
          {!hasJoinedLine && <div className="rounded-[2rem] border-2 border-[#06C755]/50 bg-[#06C755]/5 p-2 shadow-2xl shadow-[#06C755]/15"><UnlockFullReportCard assessmentId={assessmentId} /></div>}
          <div className={`${hasJoinedLine ? "" : "pointer-events-none select-none blur-sm"} grid gap-5 md:grid-cols-2`}>
            {CATEGORY_ORDER.map((key) => (
              <div key={key} className="rounded-2xl border border-[#E5E0D5] bg-white p-5">
                <div className="text-sm text-[#8B7A4C]">{CATEGORY_LABELS[key]}</div>
                <div className="mt-3 text-3xl font-semibold">{result.categoryScores[key] || 0}<span className="text-sm text-[#7D8D7F]"> / 5 分</span></div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="max-w-3xl text-sm leading-7 text-[#7D8D7F]">本檢測為健康管理與產品建議參考，不能取代專業評估或合格專業人員建議。如有明顯或長期不適，請尋求專業協助。</p>
            <button type="button" onClick={resetAssessment} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#1C3D2B] px-7 py-4 font-medium text-white transition hover:bg-[#28583F]">
              <RotateCcw className="h-4 w-4" /> 重新評估
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
