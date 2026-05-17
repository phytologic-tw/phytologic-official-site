import React, { useMemo, useState } from "react";
import { ArrowRight, Check, Leaf, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const QUESTION_COUNT = 15;

const AGE_GROUPS = [
  { label: "青少年", range: "12-16 歲" },
  { label: "青年", range: "20-30 歲" },
  { label: "中壯年", range: "35-45 歲" },
  { label: "熟齡", range: "50-60 歲" },
  { label: "銀髮樂齡", range: "65-75 歲" },
];

const PRODUCTS = [
  { id: "snow", name: "雪山植萃", color: "#C8DFC6", desc: "抗發炎修復｜腸胃舒緩", focus: "疲勞、腦霧、睡眠品質、腸胃敏感與修復需求" },
  { id: "lime", name: "青檸植萃", color: "#C2DBA0", desc: "代謝排毒｜體內環保", focus: "排便、腹脹、水腫、血糖波動、甜食渴望與代謝負擔" },
  { id: "rose", name: "玫瑰植萃", color: "#E8C4CB", desc: "女性保養｜抗老美容", focus: "荷爾蒙、肌膚、免疫、氣色、發炎修復與抗老保養" },
  { id: "cinna", name: "桂香植萃", color: "#E8D4A0", desc: "運動恢復｜增肌減脂", focus: "肌肉關節痠痛、體能下降、運動恢復、代謝與體態管理" },
  { id: "berry", name: "紫莓植萃", color: "#C4B0D8", desc: "護眼抗氧化｜3C族群", focus: "眼睛乾澀、畏光、3C疲勞、神經壓力、免疫與抗氧化需求" },
];

const INFLAMMATION_QUESTIONS = [
  { id: "q001", category: "brain", text: "常常覺得疲勞，睡醒之後依然沒有精力充沛，甚至有越睡越累的感覺？" },
  { id: "q002", category: "brain", text: "睡眠品質不好，容易多夢、淺眠、早醒，或半夜醒來後難以入睡？" },
  { id: "q003", category: "brain", text: "白天開會、上班、看電視或搭車時，容易不受控制地打瞌睡？" },
  { id: "q004", category: "brain", text: "注意力不集中，出現腦霧，難以全神貫注或完成一項任務？" },
  { id: "q005", category: "brain", text: "記憶力明顯減退，常忘東忘西，例如忘記剛才要做什麼或找不到物品？" },
  { id: "q006", category: "brain", text: "比平時更焦慮、擔心，或有莫名恐慌、心神不寧的感覺？" },
  { id: "q007", category: "brain", text: "眼睛容易乾澀、發癢、畏光，或長時間看螢幕後特別疲勞？" },
  { id: "q008", category: "gut", text: "經常消化不良，吃飽後覺得胃部脹滿、食積不化或胃脹？" },
  { id: "q009", category: "gut", text: "飯後或兩餐之間，肚子經常膨脹得很大，容易腹脹或脹氣？" },
  { id: "q010", category: "gut", text: "排便困難、糞便乾硬，或超過一天以上才排便？" },
  { id: "q011", category: "gut", text: "經常有腹瀉、稀水便，或腹瀉與便祕交替發生？" },
  { id: "q012", category: "gut", text: "吃完飯或空腹太久時，容易感到心口灼熱或胃酸逆流？" },
  { id: "q013", category: "gut", text: "舌頭上經常覆蓋厚白或黃色舌苔，或早晨起床覺得口苦口乾？" },
  { id: "q014", category: "immune", text: "一年內感冒三次以上，或感染後遲遲好不了？" },
  { id: "q015", category: "immune", text: "身體比較容易過敏，例如起風疹塊、打噴嚏、流鼻水、咳嗽？" },
  { id: "q016", category: "immune", text: "被蚊子叮咬後，紅腫或搔癢很久都沒有消退？" },
  { id: "q017", category: "immune", text: "皮膚有濕疹、異位性皮膚炎、牛皮癬、蕁麻疹或反覆青春痘？" },
  { id: "q018", category: "immune", text: "對某些食物產生明顯不適反應，例如腹瀉、疼痛、皮膚起疹？" },
  { id: "q019", category: "detox", text: "身體容易水腫，某些日子看起來浮腫，或小腹有異常微凸感？" },
  { id: "q020", category: "detox", text: "常常有一種中毒、沉重或身體極度不清爽的疲累感？" },
  { id: "q021", category: "detox", text: "尿液經常呈現深黃色，或覺得排尿後身體仍不清爽？" },
  { id: "q022", category: "detox", text: "皮膚容易發癢、粗糙、異常增厚，或腳後跟嚴重粗糙龜裂？" },
  { id: "q023", category: "detox", text: "容易掉頭髮，或指甲變脆、容易剝落、出現明顯橫紋或縱紋？" },
  { id: "q024", category: "sugar", text: "經常極度渴望含糖或澱粉類食物，例如吃完正餐一定要吃甜點或喝手搖飲？" },
  { id: "q025", category: "sugar", text: "幾小時沒吃東西就頭暈、手抖、心慌、煩躁或餓極成怒？" },
  { id: "q026", category: "sugar", text: "吃飽飯後容易陷入昏昏欲睡的食睏狀態，無法集中精神？" },
  { id: "q027", category: "sugar", text: "腰圍等於或大於臀圍，或覺得內臟脂肪、小腹凸出越來越明顯？" },
  { id: "q028", category: "sugar", text: "爬樓梯或稍微活動就覺得沒力氣、容易喘，體能明顯下降？" },
  { id: "q029", category: "hormone", text: "容易在下午疲憊或頭痛，晚上卻又精神好起來，造成習慣性熬夜？" },
  { id: "q030", category: "hormone", text: "突然從座位上站起來時，會感到嚴重頭暈目眩？" },
  { id: "q031", category: "hormone", text: "時常強烈渴望吃極度重鹹的食物？" },
  { id: "q032", category: "hormone", text: "即使環境溫暖，依然常覺得手腳冰冷？" },
  { id: "q033", category: "hormone", text: "修整眉毛時，發現外側三分之一變得稀疏或缺失？" },
  { id: "q034", category: "hormone", text: "性衝動或性慾顯著消失或減退，或半夜常需要起床小便兩次以上？" },
  { id: "q035", category: "muscle", text: "肌肉或關節經常發痠、發疼或僵硬？" },
  { id: "q036", category: "muscle", text: "有慢性且長期無法緩解的頸部、肩部、背部或下背疼痛與緊繃感？" },
  { id: "q037", category: "muscle", text: "關節活動時不斷發出喀喀響或劈啪聲？" },
  { id: "q038", category: "muscle", text: "雙手和雙腳有刺痛、隨機刺痛，或麻木無感覺的狀況？" },
  { id: "q039", category: "muscle", text: "按摩時會感到異常疼痛，尤其是雙臂、腿部稍微按壓就受不了？" },
  { id: "q040", category: "muscle", text: "運動後舒緩的僵硬或疼痛，隔天又再度復發或更明顯？" },
];

const ANSWER_OPTIONS = [
  { label: "從不", score: 0 },
  { label: "偶爾", score: 1 },
  { label: "經常", score: 2 },
];

const CATEGORY_LABELS = {
  brain: "腦部與神經壓力",
  gut: "消化與腸胃負擔",
  immune: "免疫與過敏反應",
  detox: "排毒與水分代謝",
  sugar: "血糖與代謝波動",
  hormone: "內分泌與荷爾蒙",
  muscle: "肌肉骨骼與恢復",
};

function shuffleQuestions() {
  const pool = [...INFLAMMATION_QUESTIONS];
  for (let index = pool.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [pool[index], pool[swapIndex]] = [pool[swapIndex], pool[index]];
  }
  return pool.slice(0, QUESTION_COUNT);
}

function getLevel(total) {
  if (total <= 5) return "健康綠燈";
  if (total <= 11) return "輕度發炎";
  if (total <= 20) return "中度發炎";
  return "重度發炎";
}

function buildCategoryScores(questions, answers) {
  return questions.reduce((scores, question) => {
    scores[question.category] = (scores[question.category] || 0) + (answers[question.id] ?? 0);
    return scores;
  }, {});
}

function fallbackProduct(categoryScores) {
  const topCategory = Object.entries(categoryScores).sort((a, b) => b[1] - a[1])[0]?.[0] || "brain";
  const mapping = {
    brain: "berry",
    gut: "snow",
    immune: "rose",
    detox: "lime",
    sugar: "lime",
    hormone: "rose",
    muscle: "cinna",
  };
  return PRODUCTS.find((product) => product.id === mapping[topCategory]) || PRODUCTS[0];
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

function buildPrompt({ ageLabel, total, levelLabel, categorySummary, answerSummary }) {
  const productSummary = PRODUCTS.map((product) => `${product.id}｜${product.name}｜${product.desc}｜適合：${product.focus}`).join("\n");

  return `你是植本邏輯（PHYTOLOGIC）的健康顧問，精通功能醫學、慢性發炎評估與植物機能飲料。

請根據以下「發炎指數短版問卷」結果，分析使用者目前最可能的發炎壓力來源，並推薦最適合的一款植本邏輯飲品與一個具體生活改變方式。

用戶資料：
- 年齡層：${ageLabel}
- 發炎指數短版總分：${total} / 30（${levelLabel}）
- 分類線索：${categorySummary}
- 15 題作答結果：
${answerSummary}

可推薦飲品：
${productSummary}

請只回傳 JSON，不要 Markdown，不要補充 JSON 以外文字。格式如下：
{
  "analysis": "150-220字繁體中文分析。用「您」直接說明目前最關鍵的發炎狀況、可能生活型態原因，以及為什麼這款飲品最適合。",
  "recommendedProductId": "snow 或 lime 或 rose 或 cinna 或 berry",
  "recommendedProductName": "飲品名稱",
  "lifestyleChange": "一個具體、今天就能開始的生活改變方式，60字以內"
}`;
}

export default function HealthAssessment() {
  const [step, setStep] = useState(0);
  const [ageGroup, setAgeGroup] = useState(null);
  const [questions, setQuestions] = useState(() => shuffleQuestions());
  const [answers, setAnswers] = useState({});
  const [aiResult, setAiResult] = useState(null);
  const [statusText, setStatusText] = useState("");
  const [saveNotice, setSaveNotice] = useState("");

  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / QUESTION_COUNT) * 100);
  const completed = answeredCount === QUESTION_COUNT;

  const result = useMemo(() => {
    if (!ageGroup) return null;
    const total = Object.values(answers).reduce((sum, score) => sum + score, 0);
    const levelLabel = getLevel(total);
    const categoryScores = buildCategoryScores(questions, answers);
    const topSignals = Object.entries(categoryScores)
      .filter(([, score]) => score > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([key, score]) => `${CATEGORY_LABELS[key]} ${score} 分`);
    const fallback = fallbackProduct(categoryScores);

    return {
      total,
      levelLabel,
      categoryScores,
      topSignals,
      fallbackProduct: fallback,
      categorySummary: topSignals.length ? topSignals.join("；") : "目前沒有明顯集中線索",
      answerSummary: questions.map((question, index) => `${index + 1}. ${question.text} 回答：${ANSWER_OPTIONS.find((option) => option.score === answers[question.id])?.label ?? "未作答"}`).join("\n"),
    };
  }, [ageGroup, answers, questions]);

  const resetAssessment = () => {
    setStep(0);
    setAgeGroup(null);
    setQuestions(shuffleQuestions());
    setAnswers({});
    setAiResult(null);
    setStatusText("");
    setSaveNotice("");
  };

  const runAnalysis = async () => {
    if (!result || !completed) return;

    setStep(2);
    setStatusText("派森正在分析 15 題發炎指數線索...");
    setSaveNotice("");

    const fallbackProductChoice = result.fallbackProduct;
    const fallback = {
      analysis: `您目前的發炎指數短版總分為 ${result.total} 分，屬於「${result.levelLabel}」。從回答來看，較需要留意的是 ${result.categorySummary}。這通常和睡眠節律、壓力累積、精緻澱粉、久坐與恢復不足有關。建議先固定睡眠時間、減少含糖飲與油炸物，並增加每天十分鐘步行。飲品可優先選擇 ${fallbackProductChoice.name}，協助日常保養與身體負擔調整。`,
      recommendedProductId: fallbackProductChoice.id,
      recommendedProductName: fallbackProductChoice.name,
      lifestyleChange: "今天先把含糖飲減半，晚餐增加一份深色蔬菜，睡前30分鐘不看螢幕。",
    };

    let parsedResult = fallback;
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: buildPrompt({
            ageLabel: `${ageGroup.label}（${ageGroup.range}）`,
            total: result.total,
            levelLabel: result.levelLabel,
            categorySummary: result.categorySummary,
            answerSummary: result.answerSummary,
          }),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error?.message || data?.error || "AI analysis failed");
      parsedResult = parseAiResult(data.result, fallback);
    } catch {
      setStatusText("目前先使用本機分析產生報告。");
    }

    const selectedProduct = PRODUCTS.find((product) => product.id === parsedResult.recommendedProductId || product.name === parsedResult.recommendedProductName) || fallbackProductChoice;
    const finalResult = {
      ...parsedResult,
      recommendedProductId: selectedProduct.id,
      recommendedProductName: selectedProduct.name,
      product: selectedProduct,
    };

    setAiResult(finalResult);

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from("assessments").insert({
        age_group: ageGroup.label,
        total_score: result.total,
        level: result.levelLabel,
        system_scores: result.categoryScores,
        recommended_products: [selectedProduct.name],
        ai_analysis: `${finalResult.analysis}\n生活建議：${finalResult.lifestyleChange}`,
      });
      setSaveNotice(error ? "資料暫時未寫入 Supabase，結果仍可正常查看。" : "本次評估已寫入健康檢測紀錄。");
    } else {
      setSaveNotice("尚未設定 Supabase 連線，這次結果只顯示在目前頁面。");
    }

    setStep(3);
  };

  return (
    <div className="mx-auto max-w-5xl text-[#1C3D2B]">
      <div className="mb-10 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.32em] text-[#C8A96E]">PHYSON AI HEALTH CHECK</p>
        <h3 className="text-3xl font-semibold md:text-5xl">派森 AI 發炎指數快篩</h3>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#49675A]">從發炎指數題庫隨機抽出 15 題，快速掌握身體警訊，再由 AI 分析最適合的植萃飲品與生活調整方向。</p>
      </div>

      {step === 0 && (
        <div className="rounded-2xl border border-[#E5E0D5] bg-white p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1C3D2B] text-white"><Leaf className="h-5 w-5" /></div>
            <div>
              <p className="text-sm text-[#8B7A4C]">步驟 1 / 3</p>
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
            開始 15 題快篩 <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="rounded-2xl border border-[#E5E0D5] bg-white p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1C3D2B] text-white"><Sparkles className="h-5 w-5" /></div>
              <div>
                <p className="text-sm text-[#8B7A4C]">步驟 2 / 3</p>
                <h4 className="text-2xl font-semibold">發炎指數 15 題快篩</h4>
              </div>
            </div>
            <div className="text-sm text-[#49675A]">{answeredCount} / {QUESTION_COUNT} 題完成</div>
          </div>
          <div className="mt-6 h-3 overflow-hidden rounded-full bg-[#EFEAE0]">
            <div className="h-full rounded-full bg-[#C8A96E] transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-8 space-y-5">
            {questions.map((question, index) => (
              <div key={question.id} className="rounded-2xl border border-[#E5E0D5] bg-[#FDFBF6] p-5">
                <p className="font-medium leading-7">{index + 1}. {question.text}</p>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {ANSWER_OPTIONS.map((option) => {
                    const active = answers[question.id] === option.score;
                    return (
                      <button key={option.label} type="button" onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: option.score }))} className={`rounded-full border px-5 py-3 text-sm font-medium transition ${active ? "border-[#1C3D2B] bg-[#1C3D2B] text-white" : "border-[#E5E0D5] bg-white text-[#1C3D2B] hover:border-[#C8A96E]"}`}>
                        {active && <Check className="mr-2 inline h-4 w-4" />}{option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
            <button type="button" onClick={resetAssessment} className="rounded-full border border-[#C8A96E] bg-white px-6 py-3 font-medium text-[#1C3D2B] transition hover:bg-[#F5F2EB]">重新抽題</button>
            <button type="button" disabled={!completed} onClick={runAnalysis} className="inline-flex items-center gap-2 rounded-full bg-[#1C3D2B] px-7 py-3 font-medium text-white transition hover:bg-[#28583F] disabled:cursor-not-allowed disabled:bg-[#A9B5AF]">
              交給 AI 分析 <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-[#E5E0D5] bg-white p-8 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#C8A96E]" />
          <h4 className="mt-6 text-3xl font-semibold">派森正在生成個人化分析</h4>
          <p className="mt-4 max-w-lg leading-8 text-[#49675A]">{statusText || "AI 正在比對發炎線索、飲品特性與可執行的生活改變方式。"}</p>
        </div>
      )}

      {step === 3 && result && aiResult && (
        <div className="space-y-6">
          <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-2xl border border-[#E5E0D5] bg-[#1C3D2B] p-7 text-white">
              <p className="text-sm tracking-[0.24em] text-[#C8A96E]">INFLAMMATION SCORE</p>
              <div className="mt-4 text-6xl font-semibold">{result.total}<span className="text-xl text-white/55">/30</span></div>
              <div className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#1C3D2B]">{result.levelLabel}</div>
              <p className="mt-5 leading-8 text-white/72">{ageGroup.label}（{ageGroup.range}）｜15 題發炎指數快篩</p>
            </div>
            <div className="rounded-2xl border border-[#E5E0D5] bg-white p-7">
              <h4 className="text-2xl font-semibold">AI 判讀重點</h4>
              <p className="mt-4 text-lg leading-9 text-[#49675A]">{aiResult.analysis}</p>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-2xl border border-[#E5E0D5] bg-white p-7">
              <span className="rounded-full bg-[#1C3D2B] px-4 py-2 text-sm font-medium text-white">AI 首選推薦</span>
              <div className="mt-6 h-3 w-24 rounded-full" style={{ backgroundColor: aiResult.product.color }} />
              <h4 className="mt-5 text-3xl font-semibold">{aiResult.product.name}</h4>
              <p className="mt-3 text-[#49675A]">{aiResult.product.desc}</p>
            </div>
            <div className="rounded-2xl border border-[#E5E0D5] bg-[#FDFBF6] p-7">
              <h4 className="text-2xl font-semibold">今天開始的生活改變</h4>
              <p className="mt-4 text-lg leading-9 text-[#49675A]">{aiResult.lifestyleChange}</p>
              {saveNotice && <p className="mt-5 rounded-2xl bg-white px-5 py-4 text-sm text-[#8B7A4C]">{saveNotice}</p>}
            </div>
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
