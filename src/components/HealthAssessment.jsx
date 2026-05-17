import React, { useMemo, useState } from "react";
import { Activity, ArrowLeft, ArrowRight, Brain, Check, Dumbbell, HeartPulse, Leaf, Loader2, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const SECTIONS = [
  {
    key: "brain", label: "大腦與神經系統", Icon: Brain,
    qs: [
      "常常覺得疲勞，睡醒之後依然沒有精力充沛？",
      "注意力不集中，出現「腦霧」現象？",
      "比平時更焦慮、擔心，或有莫名恐慌？",
      "記憶力減退，常忘東忘西？",
      "睡眠品質不好、失眠或多夢？",
    ],
  },
  {
    key: "gut", label: "消化系統", Icon: Leaf,
    qs: [
      "經常消化不良或飯後腹脹？",
      "有便祕或腹瀉問題？",
      "刷牙時牙齦容易發炎出血？",
      "胃酸逆流或心口灼熱？",
      "舌頭上有厚白舌苔？",
    ],
  },
  {
    key: "detox", label: "排毒系統", Icon: Activity,
    qs: [
      "身體容易水腫或小腹微凸？",
      "常有「中毒」、身體極度沉重的感覺？",
      "皮膚容易發癢、粗糙或掉髮？",
      "指甲脆弱容易剝落？",
      "尿液常呈深黃色？",
    ],
  },
  {
    key: "sugar", label: "血糖與代謝", Icon: HeartPulse,
    qs: [
      "吃完正餐仍強烈渴望甜食？",
      "幾小時沒進食會頭暈、煩躁？",
      "腰圍接近或超過臀圍？",
      "爬樓梯容易喘、體能下降？",
      "飯後常昏昏欲睡？",
    ],
  },
  {
    key: "hormone", label: "內分泌與荷爾蒙", Icon: Sparkles,
    qs: [
      "下午容易疲憊頭痛，晚上卻精神好？",
      "即使環境溫暖，手腳仍常冰冷？",
      "性慾顯著降低？",
      "半夜起床小便兩次以上？",
      "眉毛外側三分之一稀疏或缺失？",
    ],
  },
  {
    key: "muscle", label: "肌肉骨骼系統", Icon: Dumbbell,
    qs: [
      "肌肉或關節常發痠發疼？",
      "頸部或背部有長期無法緩解的痠痛？",
      "按摩時感到異常疼痛？",
      "手腳常有刺痛或麻木感？",
      "關節活動時常發出喀喀聲？",
    ],
  },
  {
    key: "immune", label: "免疫系統", Icon: ShieldCheck,
    qs: [
      "一年內感冒三次以上？",
      "皮膚有濕疹、異位性皮膚炎等狀況？",
      "被蚊子叮後紅腫久未消退？",
      "對特定食物有強烈不適反應？",
      "傷口癒合速度極慢？",
    ],
  },
];

const AGE_GROUPS = [
  { label: "青少年", range: "12-16 歲", thresholds: [14, 29, 49] },
  { label: "青年", range: "20-30 歲", thresholds: [15, 40, 70] },
  { label: "中壯年", range: "35-45 歲", thresholds: [20, 50, 90] },
  { label: "熟齡", range: "50-60 歲", thresholds: [20, 50, 90] },
  { label: "銀髮樂齡", range: "65-75 歲", thresholds: [30, 70, 120] },
];

const PRODUCTS = [
  { id: "snow", name: "雪山植萃", color: "#C8DFC6", desc: "抗發炎修復｜腸胃舒緩", keys: ["brain", "gut"] },
  { id: "lime", name: "青檸植萃", color: "#C2DBA0", desc: "代謝排毒｜體內環保", keys: ["detox", "sugar"] },
  { id: "rose", name: "玫瑰植萃", color: "#E8C4CB", desc: "女性保養｜抗老美容", keys: ["hormone", "immune"] },
  { id: "cinna", name: "桂香植萃", color: "#E8D4A0", desc: "運動恢復｜增肌減脂", keys: ["muscle", "sugar"] },
  { id: "berry", name: "紫莓植萃", color: "#C4B0D8", desc: "護眼抗氧化｜3C族群", keys: ["brain", "immune"] },
];

const ANSWER_OPTIONS = [
  { label: "從不", score: 0 },
  { label: "偶爾", score: 1 },
  { label: "經常", score: 2 },
];

const fallbackAnalysis = ({ ageLabel, total, levelLabel, topSystems, rec1, rec2 }) =>
  `您目前的慢性發炎總分為 ${total} 分，屬於「${levelLabel}」，最需要留意的是 ${topSystems}。這個年齡層常見的原因多半與睡眠節律、壓力累積、久坐、精緻飲食和恢復不足有關。建議先從固定睡眠時間、每餐增加原型蔬果與每天散步十分鐘開始，讓身體逐步降低負擔。日常配方可優先搭配 ${rec1.name}，並視生活型態加入 ${rec2.name} 作為輔助。`;

function getLevel(ageGroup, total) {
  const [t1, t2, t3] = ageGroup.thresholds;
  if (total <= t1) return "健康綠燈";
  if (total <= t2) return "輕度發炎";
  if (total <= t3) return "中度發炎";
  return "重度發炎";
}

function buildScores(answers) {
  return SECTIONS.reduce((scores, section) => {
    scores[section.key] = section.qs.reduce((sum, _, index) => sum + (answers[`${section.key}-${index}`] ?? 0), 0);
    return scores;
  }, {});
}

function getRecommendations(systemScores) {
  const topKeys = Object.entries(systemScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([key]) => key);

  return PRODUCTS.map((product) => ({
    ...product,
    matchScore: product.keys.filter((key) => topKeys.includes(key)).length,
  }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 2);
}

function buildPrompt({ ageLabel, total, levelLabel, topSystems, systemScoresSummary, rec1, rec2 }) {
  return `你是植本邏輯（PHYTOLOGIC）的健康顧問，精通功能醫學與植物機能飲料。

用戶資料：
- 年齡層：${ageLabel}
- 慢性發炎總分：${total} 分（${levelLabel}）
- 最需關注的系統：${topSystems}
- 各系統分數：${systemScoresSummary}

推薦產品：
1. ${rec1.name}（${rec1.desc}）
2. ${rec2.name}（${rec2.desc}）

請生成一份 150-200 字的中文個人化健康分析：
1. 用「您」直接說明體內目前最關鍵的發炎狀況
2. 說明這個年齡層這些症狀背後最常見的生活型態原因
3. 給一個具體的日常改變建議
4. 最後自然帶到推薦的植萃配方

語氣溫暖專業，流暢段落書寫，不分點列舉，不使用 Markdown 符號。`;
}

export default function HealthAssessment() {
  const [step, setStep] = useState(0);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [ageGroup, setAgeGroup] = useState(null);
  const [answers, setAnswers] = useState({});
  const [analysis, setAnalysis] = useState("");
  const [statusText, setStatusText] = useState("");
  const [saveNotice, setSaveNotice] = useState("");

  const currentSection = SECTIONS[sectionIndex];
  const CurrentSectionIcon = currentSection.Icon;
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = SECTIONS.reduce((sum, section) => sum + section.qs.length, 0);
  const currentAnswered = currentSection.qs.every((_, index) => answers[`${currentSection.key}-${index}`] !== undefined);
  const progress = Math.round((answeredCount / totalQuestions) * 100);

  const result = useMemo(() => {
    if (!ageGroup) return null;
    const systemScores = buildScores(answers);
    const total = Object.values(systemScores).reduce((sum, score) => sum + score, 0);
    const levelLabel = getLevel(ageGroup, total);
    const recommendations = getRecommendations(systemScores);
    const topSystems = Object.entries(systemScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([key]) => SECTIONS.find((section) => section.key === key)?.label)
      .join("、");
    const systemScoresSummary = SECTIONS.map((section) => `${section.label} ${systemScores[section.key]} 分`).join("；");

    return { systemScores, total, levelLabel, recommendations, topSystems, systemScoresSummary };
  }, [ageGroup, answers]);

  const resetAssessment = () => {
    setStep(0);
    setSectionIndex(0);
    setAgeGroup(null);
    setAnswers({});
    setAnalysis("");
    setStatusText("");
    setSaveNotice("");
  };

  const runAnalysis = async () => {
    if (!result) return;
    setStep(2);
    setStatusText("派森正在整合 35 題身體訊號...");
    setSaveNotice("");

    const [rec1, rec2] = result.recommendations;
    const promptPayload = {
      ageLabel: `${ageGroup.label}（${ageGroup.range}）`,
      total: result.total,
      levelLabel: result.levelLabel,
      topSystems: result.topSystems,
      systemScoresSummary: result.systemScoresSummary,
      rec1,
      rec2,
    };

    let aiText = "";
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: buildPrompt(promptPayload) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error?.message || data?.error || "AI analysis failed");
      aiText = data.result;
    } catch (error) {
      aiText = fallbackAnalysis(promptPayload);
      setStatusText("目前先使用本機分析產生報告。");
    }

    setAnalysis(aiText);

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from("assessments").insert({
        age_group: ageGroup.label,
        total_score: result.total,
        level: result.levelLabel,
        system_scores: result.systemScores,
        recommended_products: result.recommendations.map((product) => product.name),
        ai_analysis: aiText,
      });
      setSaveNotice(error ? "資料暫時未寫入 Supabase，結果仍可正常查看。" : "本次評估已寫入健康檢測紀錄。");
    } else {
      setSaveNotice("尚未設定 Supabase 連線，這次結果只顯示在目前頁面。");
    }

    setStep(3);
  };

  return (
    <div className="mx-auto max-w-6xl text-[#1C3D2B]">
      <div className="mb-10 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.32em] text-[#C8A96E]">PHYSON AI HEALTH CHECK</p>
        <h3 className="text-3xl font-semibold md:text-5xl">派森 AI 慢性發炎健康檢測</h3>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#49675A]">透過 7 大系統、35 題身體訊號，建立個人化慢性發炎風險分析與植萃配方建議。</p>
      </div>

      {step === 0 && (
        <div className="rounded-2xl border border-[#E5E0D5] bg-white p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1C3D2B] text-white"><Leaf className="h-5 w-5" /></div>
            <div>
              <p className="text-sm text-[#8B7A4C]">步驟 1 / 4</p>
              <h4 className="text-2xl font-semibold">選擇您的年齡層</h4>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-5">
            {AGE_GROUPS.map((group) => {
              const active = ageGroup?.label === group.label;
              return (
                <button key={group.label} type="button" onClick={() => setAgeGroup(group)} className={`rounded-2xl border p-5 text-left transition ${active ? "border-[#1C3D2B] bg-[#1C3D2B] text-white" : "border-[#E5E0D5] bg-white hover:border-[#C8A96E]"}`}>
                  <span className="block text-lg font-semibold">{group.label}</span>
                  <span className={`mt-2 block text-sm ${active ? "text-white/72" : "text-[#49675A]"}`}>{group.range}</span>
                </button>
              );
            })}
          </div>
          <button type="button" disabled={!ageGroup} onClick={() => setStep(1)} className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#1C3D2B] px-7 py-4 font-medium text-white transition hover:bg-[#28583F] disabled:cursor-not-allowed disabled:bg-[#A9B5AF]">
            開始檢測 <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="rounded-2xl border border-[#E5E0D5] bg-white p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1C3D2B] text-white"><CurrentSectionIcon className="h-5 w-5" /></div>
              <div>
                <p className="text-sm text-[#8B7A4C]">系統 {sectionIndex + 1} / {SECTIONS.length}</p>
                <h4 className="text-2xl font-semibold">{currentSection.label}</h4>
              </div>
            </div>
            <div className="text-sm text-[#49675A]">{answeredCount} / {totalQuestions} 題完成</div>
          </div>
          <div className="mt-6 h-3 overflow-hidden rounded-full bg-[#EFEAE0]">
            <div className="h-full rounded-full bg-[#C8A96E] transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-8 space-y-5">
            {currentSection.qs.map((question, index) => (
              <div key={question} className="rounded-2xl border border-[#E5E0D5] bg-[#FDFBF6] p-5">
                <p className="font-medium leading-7">{index + 1}. {question}</p>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {ANSWER_OPTIONS.map((option) => {
                    const answerKey = `${currentSection.key}-${index}`;
                    const active = answers[answerKey] === option.score;
                    return (
                      <button key={option.label} type="button" onClick={() => setAnswers((prev) => ({ ...prev, [answerKey]: option.score }))} className={`rounded-full border px-5 py-3 text-sm font-medium transition ${active ? "border-[#1C3D2B] bg-[#1C3D2B] text-white" : "border-[#E5E0D5] bg-white text-[#1C3D2B] hover:border-[#C8A96E]"}`}>
                        {active && <Check className="mr-2 inline h-4 w-4" />}{option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
            <button type="button" onClick={() => sectionIndex === 0 ? setStep(0) : setSectionIndex((index) => index - 1)} className="inline-flex items-center gap-2 rounded-full border border-[#C8A96E] bg-white px-6 py-3 font-medium text-[#1C3D2B] transition hover:bg-[#F5F2EB]">
              <ArrowLeft className="h-4 w-4" /> 上一步
            </button>
            <button type="button" disabled={!currentAnswered} onClick={() => sectionIndex === SECTIONS.length - 1 ? runAnalysis() : setSectionIndex((index) => index + 1)} className="inline-flex items-center gap-2 rounded-full bg-[#1C3D2B] px-7 py-3 font-medium text-white transition hover:bg-[#28583F] disabled:cursor-not-allowed disabled:bg-[#A9B5AF]">
              {sectionIndex === SECTIONS.length - 1 ? "產生分析" : "下一個系統"} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-[#E5E0D5] bg-white p-8 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#C8A96E]" />
          <h4 className="mt-6 text-3xl font-semibold">派森正在生成個人化分析</h4>
          <p className="mt-4 max-w-lg leading-8 text-[#49675A]">{statusText || "同步比對年齡層、系統分數與植萃配方推薦。"}</p>
        </div>
      )}

      {step === 3 && result && (
        <div className="space-y-6">
          <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-2xl border border-[#E5E0D5] bg-[#1C3D2B] p-7 text-white">
              <p className="text-sm tracking-[0.24em] text-[#C8A96E]">TOTAL SCORE</p>
              <div className="mt-4 text-6xl font-semibold">{result.total}</div>
              <div className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#1C3D2B]">{result.levelLabel}</div>
              <p className="mt-5 leading-8 text-white/72">{ageGroup.label}（{ageGroup.range}）｜最需關注：{result.topSystems}</p>
            </div>
            <div className="rounded-2xl border border-[#E5E0D5] bg-white p-7">
              <h4 className="text-2xl font-semibold">7 大系統分數</h4>
              <div className="mt-5 space-y-4">
                {SECTIONS.map((section) => {
                  const score = result.systemScores[section.key];
                  return (
                    <div key={section.key}>
                      <div className="mb-2 flex justify-between gap-4 text-sm"><span>{section.label}</span><span>{score} / 10</span></div>
                      <div className="h-3 overflow-hidden rounded-full bg-[#EFEAE0]"><div className="h-full rounded-full bg-[#C8A96E]" style={{ width: `${score * 10}%` }} /></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-[#E5E0D5] bg-white p-7">
            <h4 className="text-2xl font-semibold">個人化健康分析</h4>
            <p className="mt-4 whitespace-pre-wrap text-lg leading-9 text-[#49675A]">{analysis}</p>
            {saveNotice && <p className="mt-5 rounded-2xl bg-[#F5F2EB] px-5 py-4 text-sm text-[#8B7A4C]">{saveNotice}</p>}
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {result.recommendations.map((product, index) => (
              <div key={product.id} className="rounded-2xl border border-[#E5E0D5] bg-white p-7">
                {index === 0 && <span className="rounded-full bg-[#1C3D2B] px-4 py-2 text-sm font-medium text-white">首選推薦</span>}
                <div className="mt-5 h-3 w-24 rounded-full" style={{ backgroundColor: product.color }} />
                <h4 className="mt-5 text-3xl font-semibold">{product.name}</h4>
                <p className="mt-3 text-[#49675A]">{product.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="max-w-3xl text-sm leading-7 text-[#7D8D7F]">本檢測為健康管理與產品建議參考，不能取代醫療診斷、治療或專業醫師建議。如有明顯不適或慢性疾病，請諮詢合格醫療人員。</p>
            <button type="button" onClick={resetAssessment} className="inline-flex items-center gap-2 rounded-full bg-[#1C3D2B] px-7 py-4 font-medium text-white transition hover:bg-[#28583F]">
              <RotateCcw className="h-4 w-4" /> 重新評估
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
