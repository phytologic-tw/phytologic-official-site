import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Brain,
  Dumbbell,
  Eye,
  Heart,
  Leaf,
  Mail,
  MapPin,
  Menu,
  Newspaper,
  Phone,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import HealthAssessment from "./components/HealthAssessment";
import { isSupabaseConfigured, supabase } from "./lib/supabase";

const logo = "/logo.png";
const lineCtaUrl = import.meta.env.VITE_LINE_CTA_URL || "https://line.me/R/ti/p/@phytologic";

const navItems = ["品牌理念", "產品系列", "派森", "最新消息", "合作加盟", "聯絡我們"];

const colorStories = [
  { color: "珍珠白", title: "保持清楚與清醒", text: "希望未來有一天，還能把自己這一輩子學到的東西，好好地分享給孩子。" },
  { color: "翡翠綠", title: "吃得下，才活得好", text: "代謝與腸胃，是一切修復真正的起點。" },
  { color: "玫瑰紅", title: "愛美想帥，是想陪伴更久", text: "不是害怕老，而是希望還能保有好的狀態陪孩子長大。" },
  { color: "金鑽黃", title: "真正的力量", text: "當家人需要你的時候，你還有力氣站在前面。" },
  { color: "水晶紫", title: "看見人生重要的瞬間", text: "想再多看看家人的樣子、世界的風景與人生的回憶。" },
];

const products = [
  { id: "white", name: "雪山植萃", english: "Pearl White", colorName: "珍珠白", theme: "修復・抗發炎・溫和滋補", icon: Sparkles, accent: "#F5EFE4", deep: "#A98E61", desc: "以鉑金基底液結合蘋果、山藥、銀耳與核桃，為高壓、熬夜、腸胃敏感族群提供溫和的植物修復支持。", tags: ["細胞修復", "腸胃支持", "抗氧化", "低負擔"] },
  { id: "green", name: "青檸植萃", english: "Emerald Green", colorName: "翡翠綠", theme: "代謝・腸道促排・體內環保", icon: Leaf, accent: "#DDEEDB", deep: "#1E6B43", desc: "以深綠蔬菜、芭樂、檸檬與黑木耳建構高纖維、天然維生素C與微量營養素的代謝促排配方。", tags: ["腸道促排", "代謝支持", "高纖維", "低糖"] },
  { id: "rose", name: "玫瑰植萃", english: "Rose Red", colorName: "玫瑰紅", theme: "女性保養・氣色・抗氧化", icon: Heart, accent: "#F5DDE2", deep: "#AA3F57", desc: "以甜菜根、紫甘藍、銀耳、芭樂、百香果、檸檬與玫瑰花瓣，打造女性日常保養與紅潤氣色配方。", tags: ["膠原支持", "紅潤氣色", "保水滋潤", "抗氧化"] },
  { id: "gold", name: "桂香植萃", english: "Golden Yellow", colorName: "金鑽黃", theme: "運動修復・增肌減脂・代謝引擎", icon: Dumbbell, accent: "#F8E6AD", deep: "#B8871B", desc: "以甜玉米、香蕉、百香果、薑黃與桂香精釀液，提供運動後能量回補、肌肉修復與抗氧化支持。", tags: ["運動修復", "蛋白質利用", "電解質", "體態管理"] },
  { id: "purple", name: "紫莓植萃", english: "Crystal Purple", colorName: "水晶紫", theme: "護眼・抗氧化・3C族保養", icon: Eye, accent: "#E7DDF6", deep: "#65439A", desc: "以藍莓、桑椹、紫薯、紫高麗菜、木鱉果與紅蘿蔔，建構水脂雙溶的護眼抗氧化網路。", tags: ["3C護眼", "花青素", "維生素A先質", "高吸收"] },
];

const news = [
  { date: "2026.05", category: "品牌公告", title: "植本邏輯官方網站籌備啟動", text: "以品牌形象、產品教育、派森與合作加盟為核心，建立完整官方資訊入口。", detail: "官方網站將作為植本邏輯的品牌門面，整合創辦理念、產品教育、派森、加盟合作與最新活動資訊，讓消費者、合作夥伴與加盟主都能快速理解品牌價值。" },
  { date: "2026.07", category: "展會消息", title: "高雄加盟展合作計畫啟動", text: "招募城市合作者、門市加盟與衛星據點，共同推動植物機能飲品進入日常生活。", detail: "高雄加盟展將以試飲體驗、品牌說明、城市合作者洽談與門市模型展示為核心，目標建立可複製、可落地、可擴張的植物機能飲品合作系統。" },
  { date: "COMING", category: "系統開發", title: "LINE會員與AI健康推薦系統", text: "以生活狀態、身體反應與個人化資料，建立每日飲品建議與健康陪伴服務。", detail: "第一階段將以LINE作為會員入口，導入AI超級客服、每日推播、飲品推薦、好運顏色、生活任務與回訪紀錄，讓健康服務變得更輕、更近、更容易持續。" },
];

const philosophyCards = [
  { title: "不是飲料，是食物", text: "每一杯都以每天敢給家人吃為底線，回到植物、營養與身體真正需要的本質。", detail: "植本邏輯的產品不是短暫流行的飲料，而是每天會進入身體、長期被吸收、影響未來十年與二十年的食物。因此我們以家人的標準設計產品，重視食材來源、營養邏輯、風味接受度與長期可持續性。" },
  { title: "三好原則", text: "好喝、好看、好吸收。真正能持續的健康，一定要能融入生活。", detail: "好喝，才能每天持續；好看，才能被願意靠近；好吸收，才真正對身體有意義。植本邏輯把健康產品從『忍耐』變成『享受』，讓機能飲品不只是有效，而是能被長期喜歡。" },
  { title: "三無鐵律", text: "無人工、無化學、無合成。真正重要的人，值得最乾淨的選擇。", detail: "我們拒絕人工香精、化學合成風味與不必要的工業添加，盡可能回到真正從土地長出來的植物本源。因為這不是做給市場看的產品，而是做給家人每天吃的東西。" },
];

const aiQuestions = [
  { title: "睡醒後仍常覺得疲勞、白天容易打瞌睡或注意力不集中嗎？", category: "brain", organ: "大腦・中樞神經・自律神經", options: ["從不發生", "偶爾發生", "經常發生"] },
  { title: "經常有腹脹、消化不良、便祕或腹瀉交替的狀況嗎？", category: "gut", organ: "胃・小腸・大腸・腸道黏膜", options: ["從不發生", "偶爾發生", "經常發生"] },
  { title: "身體容易浮腫、尿液深黃、皮膚搔癢或有沉重不清爽的感覺嗎？", category: "detox", organ: "肝臟・膽囊・腎臟・淋巴系統", options: ["從不發生", "偶爾發生", "經常發生"] },
  { title: "吃完正餐後仍想吃甜食，或幾小時沒吃就頭暈、發抖、煩躁嗎？", category: "metabolic", organ: "血糖・胰島素・心血管代謝", options: ["從不發生", "偶爾發生", "經常發生"] },
  { title: "肌肉、關節、肩頸或下背經常痠痛、僵硬，運動後恢復變慢嗎？", category: "muscle", organ: "肌肉・骨骼・關節・結締組織", options: ["從不發生", "偶爾發生", "經常發生"] },
  { title: "容易過敏、反覆感冒、皮膚紅癢，或長時間使用3C後眼睛乾澀畏光嗎？", category: "immuneEye", organ: "免疫系統・皮膚屏障・眼部微血管", options: ["從不發生", "偶爾發生", "經常發生"] },
];

const fallbackRecommendationRules = {
  brain: { productId: "white", reason: "疲勞、睡眠品質、腦霧與神經緊繃", lifestyleAdvice: "今晚先把睡前30分鐘改成無螢幕時間，並固定起床時間，讓自律神經重新建立節律。" },
  gut: { productId: "green", reason: "腸胃蠕動、消化負擔與體內環保", lifestyleAdvice: "今天開始每餐先吃蔬菜與原型食物，減少油炸與加工食品，並觀察排便型態。" },
  detox: { productId: "green", reason: "水腫、沉重感、代謝與排除負擔", lifestyleAdvice: "把含糖飲與重鹹食物先減半，補足水分並增加步行，幫助身體降低代謝壓力。" },
  metabolic: { productId: "green", reason: "血糖波動、甜食渴望與代謝穩定", lifestyleAdvice: "先避免空腹喝含糖飲，正餐加入蛋白質與高纖蔬菜，讓血糖曲線更平穩。" },
  muscle: { productId: "gold", reason: "肌肉修復、關節支持與運動後恢復", lifestyleAdvice: "每天安排10分鐘伸展與輕阻力訓練，並在活動後補充足夠蛋白質與水分。" },
  immuneEye: { productId: "purple", reason: "免疫過敏、皮膚發炎與3C用眼疲勞", lifestyleAdvice: "使用3C每30分鐘看遠方30秒，並增加深色蔬果攝取，幫助補充抗氧化植化素。" },
};

const genderOptions = ["男", "女", "其他"];
const workTypeOptions = ["久坐辦公", "外勤走動", "體力勞動", "學生", "自由業", "其他"];
const defaultProfile = { gender: "", age: "", height: "", weight: "", workType: "" };
const defaultQuestionOptions = ["從不發生", "偶爾發生", "經常發生"];

function calculateBmi(heightCm, weightKg) {
  const height = Number(heightCm);
  const weight = Number(weightKg);
  if (!height || !weight) return null;
  return weight / (height / 100) ** 2;
}

function getBmiLabel(bmi) {
  if (!bmi) return "尚未計算";
  if (bmi < 18.5) return "偏低";
  if (bmi < 24) return "標準";
  if (bmi < 27) return "過重";
  return "偏高";
}

function productIdFromRule(rule = {}) {
  const rawProduct = String(rule.productId || rule.product_id || rule.product_slug || rule.product_key || rule.recommended_product_id || rule.recommended_product || rule.product_name || "").toLowerCase();
  const matchedProduct = products.find((product) => {
    const names = [product.id, product.name, product.english, product.colorName].map((value) => value.toLowerCase());
    return names.some((name) => rawProduct.includes(name) || name.includes(rawProduct));
  });
  return matchedProduct?.id || "white";
}

function normalizeQuestion(question, index) {
  const rawOptions = question.options || question.option_labels || question.answer_options;
  const options = Array.isArray(rawOptions)
    ? rawOptions.map((option) => (typeof option === "string" ? option : option.label || option.text || option.title)).filter(Boolean)
    : defaultQuestionOptions;

  return {
    id: question.id || `question-${index}`,
    title: question.title || question.question || question.question_text || question.prompt || aiQuestions[index]?.title || `健康問卷第 ${index + 1} 題`,
    category: question.system_category || question.category || question.system || aiQuestions[index]?.category || "brain",
    organ: question.organ || question.system_name || question.system_label || question.description || aiQuestions[index]?.organ || "身體系統",
    options: options.length >= 3 ? options.slice(0, 3) : defaultQuestionOptions,
  };
}

function normalizeRecommendationRule(rule) {
  const systemCategory = rule.system_category || rule.category || rule.system;
  if (!systemCategory) return null;

  return {
    systemCategory,
    productId: productIdFromRule(rule),
    productName: rule.product_name || rule.recommended_product || rule.recommended_product_name,
    reason: rule.reason || rule.recommendation_reason || rule.focus || rule.description || fallbackRecommendationRules[systemCategory]?.reason,
    lifestyleAdvice: rule.lifestyle_advice || rule.life_advice || rule.advice || rule.tip || rule.lifestyle_tip || fallbackRecommendationRules[systemCategory]?.lifestyleAdvice,
  };
}

function getAiAnalysis(selectedAnswers, questions = aiQuestions, recommendationRules = fallbackRecommendationRules) {
  const categoryScores = questions.reduce((acc, question, index) => {
    acc[question.category] = (acc[question.category] || 0) + (selectedAnswers[index] ?? 0);
    return acc;
  }, {});
  const totalScore = Object.values(categoryScores).reduce((sum, score) => sum + score, 0);
  const topCategory = Object.entries(categoryScores).sort((a, b) => b[1] - a[1])[0]?.[0] || questions[0]?.category || "brain";
  const severity = totalScore <= 2 ? "健康綠燈" : totalScore <= 6 ? "輕度發炎警訊" : totalScore <= 9 ? "中度發炎負擔" : "高度發炎警訊";
  const rule = recommendationRules[topCategory] || fallbackRecommendationRules[topCategory] || fallbackRecommendationRules.brain;
  const product = products.find((p) => p.id === rule.productId) || products[0];
  return {
    totalScore,
    severity,
    topCategory,
    product,
    productName: rule.productName || product.name,
    reason: rule.reason,
    tip: rule.lifestyleAdvice,
    completed: Object.keys(selectedAnswers).length === questions.length,
  };
}

function runContentTests() {
  console.assert(products.length === 5, "Expected five product cards.");
  console.assert(navItems.includes("派森"), "Navigation should include 派森.");
  console.assert(aiQuestions.length === 6, "Expected six inflammation screening questions.");
  console.assert(getAiAnalysis({ 0: 2, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }).product.id === "white", "Brain symptoms should recommend Snow Mountain/Pearl White.");
  console.assert(getAiAnalysis({ 0: 0, 1: 2, 2: 2, 3: 1, 4: 0, 5: 0 }).product.id === "green", "Gut/metabolic symptoms should recommend Emerald Green.");
  console.assert(getAiAnalysis({ 0: 0, 1: 0, 2: 0, 3: 0, 4: 2, 5: 0 }).product.id === "gold", "Muscle symptoms should recommend Golden Yellow.");
  console.assert(getAiAnalysis({ 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 2 }).product.id === "purple", "Immune/eye symptoms should recommend Crystal Purple.");
}
runContentTests();

function SectionTitle({ eyebrow, title, text }) {
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#B89B5E]">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-[#123828] md:text-5xl">{title}</h2>
      {text && <p className="mt-5 text-base leading-8 text-[#49675A] md:text-lg">{text}</p>}
    </div>
  );
}

function Pill({ children }) {
  return <span className="rounded-full border border-[#D8C99C]/70 bg-white/70 px-4 py-2 text-sm text-[#355548] shadow-sm">{children}</span>;
}

export default function PhytologicWebsite() {
  const [activeProduct, setActiveProduct] = useState(products[1]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [questionBank, setQuestionBank] = useState(aiQuestions);
  const [recommendationRules, setRecommendationRules] = useState(fallbackRecommendationRules);
  const [physonStatus, setPhysonStatus] = useState(isSupabaseConfigured ? "loading" : "fallback");
  const [profile, setProfile] = useState(defaultProfile);
  const [profileSubmitted, setProfileSubmitted] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnalyzing, setShowAnalyzing] = useState(false);
  const [showAiResult, setShowAiResult] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [infoModal, setInfoModal] = useState(null);
  const ActiveIcon = activeProduct.icon;
  const aiAnalysis = useMemo(() => getAiAnalysis(selectedAnswers, questionBank, recommendationRules), [selectedAnswers, questionBank, recommendationRules]);
  const aiRecommendation = aiAnalysis.product;
  const bmi = useMemo(() => calculateBmi(profile.height, profile.weight), [profile.height, profile.weight]);
  const profileCompleted = genderOptions.includes(profile.gender) && workTypeOptions.includes(profile.workType) && Number(profile.age) > 0 && Number(profile.height) > 0 && Number(profile.weight) > 0;
  const topSystemLabel = questionBank.find((question) => question.category === aiAnalysis.topCategory)?.organ || aiAnalysis.topCategory;
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = Math.round((answeredCount / questionBank.length) * 100);
  const currentQuestion = questionBank[currentQuestionIndex] || questionBank[0];
  const gradient = useMemo(() => ({ background: `radial-gradient(circle at 72% 25%, ${activeProduct.accent} 0%, rgba(255,255,255,.88) 34%, #F9F5EA 78%)` }), [activeProduct]);
  const openPhysonIntro = () => setInfoModal({ eyebrow: "PHYSON SYSTEM", title: "派森｜AI健康系統", text: "派森不是單純的AI聊天工具，而是植本邏輯建立的健康陪伴系統。它會透過生活型態、身體反應、飲用紀錄與健康目標，建立個人化植物機能建議，並透過LINE每日陪伴、提醒與回訪，讓健康真正融入生活。" });
  const updateProfile = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setProfileSubmitted(false);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setShowAnalyzing(false);
    setShowAiResult(false);
  };
  const submitProfile = () => {
    if (!profileCompleted) return;
    setProfileSubmitted(true);
    setShowAnalyzing(false);
    setShowAiResult(false);
  };
  const answerQuestion = (qIndex, score) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: score }));
    setShowAnalyzing(false);
    setShowAiResult(false);
    if (qIndex < questionBank.length - 1) {
      window.setTimeout(() => setCurrentQuestionIndex(qIndex + 1), 180);
    }
  };
  const analyzeAnswers = () => {
    if (!profileSubmitted || !aiAnalysis.completed) return;
    setShowAiResult(false);
    setShowAnalyzing(true);
    window.setTimeout(() => {
      setShowAnalyzing(false);
      setShowAiResult(true);
    }, 1200);
  };

  useEffect(() => {
    let ignore = false;

    async function loadPhysonContent() {
      if (!supabase) return;

      const [questionResponse, ruleResponse] = await Promise.all([
        supabase.from("question_bank").select("*").order("sort_order", { ascending: true }),
        supabase.from("recommendation_rules").select("*"),
      ]);

      if (ignore) return;

      if (questionResponse.error || ruleResponse.error) {
        setPhysonStatus("fallback");
        return;
      }

      const normalizedQuestions = (questionResponse.data || []).map(normalizeQuestion).filter(Boolean).slice(0, 6);
      const normalizedRules = (ruleResponse.data || [])
        .map(normalizeRecommendationRule)
        .filter(Boolean)
        .reduce((acc, rule) => ({ ...acc, [rule.systemCategory]: rule }), {});

      if (normalizedQuestions.length === 6) {
        setQuestionBank(normalizedQuestions);
      }

      if (Object.keys(normalizedRules).length > 0) {
        setRecommendationRules((prev) => ({ ...prev, ...normalizedRules }));
      }

      setPhysonStatus(normalizedQuestions.length === 6 ? "supabase" : "fallback");
      setSelectedAnswers({});
      setCurrentQuestionIndex(0);
      setShowAnalyzing(false);
      setShowAiResult(false);
    }

    loadPhysonContent();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F5EA] text-[#123828]">
      <header className="sticky top-0 z-50 border-b border-[#E7DDBF] bg-[#F9F5EA]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <a href="#top" className="flex items-center gap-3"><img src={logo} alt="植本邏輯 PHYTOLOGIC Logo" className="h-10 w-10 object-contain" /><div><div className="text-lg font-semibold tracking-[0.18em]">植本邏輯</div><div className="text-xs tracking-[0.24em] text-[#7D8D7F]">PHYTOLOGIC</div></div></a>
          <nav className="hidden items-center gap-8 text-sm text-[#355548] lg:flex">{navItems.map((item) => <a key={item} href={`#${item}`} className="transition hover:text-[#B89B5E]">{item}</a>)}</nav>
          <a href="#聯絡我們" className="hidden rounded-full bg-[#123828] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-[#123828]/15 transition hover:bg-[#1E6B43] md:block">預約洽談</a>
          <button type="button" className="lg:hidden" onClick={() => setMenuOpen((v) => !v)}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
        {menuOpen && <div className="border-t border-[#E7DDBF] px-5 py-5 lg:hidden"><div className="grid gap-4">{navItems.map((item) => <a key={item} href={`#${item}`} onClick={() => setMenuOpen(false)}>{item}</a>)}</div></div>}
      </header>

      <main id="top">
        <section className="relative overflow-hidden px-5 py-20 md:px-8 md:py-28" style={gradient}>
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.08fr_.92fr]">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#D8C99C] bg-white/70 px-4 py-2 text-sm text-[#6C5A2F] shadow-sm"><ShieldCheck className="h-4 w-4" /> 熱愛・尊重・相信</div>
              <h1 className="text-5xl font-semibold leading-tight tracking-tight md:text-7xl">全植物機能飲<br />× AI健康系統</h1>
              <p className="mt-7 max-w-2xl text-xl leading-9 text-[#49675A]">我們不是在販售飲料，而是用自然、科學與愛，守護人生裡真正重要的人。</p>
              <div className="mt-9 flex flex-wrap gap-4"><a href="#產品系列" className="rounded-full bg-[#123828] px-7 py-4 font-medium text-white shadow-xl shadow-[#123828]/20 transition hover:bg-[#1E6B43]">探索產品系列</a><button type="button" onClick={openPhysonIntro} className="rounded-full border border-[#B89B5E] bg-white/70 px-7 py-4 font-medium text-[#123828] transition hover:bg-white">了解派森</button></div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.1 }} className="relative">
              <div className="absolute -inset-8 rounded-[3rem] bg-white/35 blur-2xl" />
              <div className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/55 p-7 shadow-2xl shadow-[#123828]/10 backdrop-blur">
                <div className="flex items-center justify-between"><img src={logo} alt="植本邏輯 Logo" className="h-16 w-16 object-contain" /><div className="text-right text-sm tracking-[0.3em] text-[#B89B5E]">PHYTOLOGIC</div></div>
                <div className="mt-16 grid grid-cols-5 gap-3">{products.map((p) => <button key={p.id} type="button" onClick={() => setActiveProduct(p)} className="h-32 rounded-full border border-white/70 shadow-lg transition hover:-translate-y-1" style={{ background: `linear-gradient(180deg, ${p.accent}, ${p.deep})` }} title={p.name} />)}</div>
                <motion.button type="button" whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }} onClick={() => setDetailOpen(true)} className="mt-10 w-full rounded-[2rem] bg-[#123828] p-7 text-left text-white shadow-xl shadow-[#123828]/15"><div className="flex items-center gap-4"><div className="rounded-2xl bg-white/12 p-3"><ActiveIcon /></div><div><div className="text-2xl font-semibold">{activeProduct.name}</div><div className="text-sm text-white/65">{activeProduct.theme}</div></div></div><p className="mt-5 leading-7 text-white/78">{activeProduct.desc}</p><div className="mt-5 inline-flex items-center gap-2 text-sm text-[#D8C99C]">點擊查看完整機能內容 <ArrowRight className="h-4 w-4" /></div></motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="品牌理念" className="px-5 py-20 md:px-8"><SectionTitle eyebrow="Brand Philosophy" title="六個家庭，重新理解健康之後的人生答案" text="植本邏輯不是從商業開始，而是從家庭、陪伴與健康開始。" /><div className="mx-auto max-w-7xl overflow-hidden rounded-[3rem] border border-[#E7DDBF] bg-white/70 shadow-xl shadow-[#123828]/5"><div className="grid lg:grid-cols-[1.05fr_.95fr]"><div className="p-8 md:p-14"><div className="inline-flex items-center gap-2 rounded-full border border-[#D8C99C] bg-[#F9F5EA] px-4 py-2 text-sm text-[#8B7A4C]">從國際品牌經理人，到一位父親</div><h3 className="mt-8 text-4xl font-semibold leading-tight text-[#123828] md:text-5xl">有些事情，年輕時不會明白。</h3><div className="mt-8 space-y-6 text-lg leading-9 text-[#49675A]"><p>年輕的時候，我們總以為人生最重要的是成功、速度、成績與規模。我們熬夜、應酬、壓力、失眠，把青春與身體投入高速運轉的世界。</p><p>科技讓文明進步了，但人類卻離健康越來越遠。每天長時間盯著螢幕、吃著方便卻失去溫度的食物、過著快速卻疲憊的人生。很多人不是突然病倒，而是慢慢失去了健康。</p><p>五十歲那年，創辦人成為了一位父親。當孩子出生的那一刻，第一次真正思考：「我還有多久能陪他？」</p><p>那一刻開始，健康不再只是身體問題。而是能不能陪孩子長大、陪家人旅行、陪伴愛的人慢慢變老的人生問題。</p></div></div><div className="relative overflow-hidden bg-[#123828] p-8 text-white md:p-14"><div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at top right, #ffffff 0%, transparent 55%)" }} /><div className="relative z-10"><div className="text-sm tracking-[0.35em] text-[#D8C99C]">PHYTOLOGIC</div><h3 className="mt-6 text-4xl font-semibold leading-tight">不是能不能賣，<br />而是敢不敢每天給家人吃。</h3><div className="mt-10 space-y-6 text-lg leading-9 text-white/78"><p>植本邏輯開始重新研究植物、營養、人體修復、東方藥食智慧與西方營養學。因為真正重要的問題只有一個：「如果這是我要給家人每天吃的東西，它到底應該長成什麼樣子？」</p><p>所以我們堅持：無人工、無化學、無合成。真正從土地裡長出來的植物，才有資格成為身體長期吸收的根本。</p><p>我們不是在販售飲料。我們做的，其實是真正每天會進入人體、長期影響未來十年與二十年的食物。</p></div><div className="mt-10 flex flex-wrap gap-3"><Pill>重視生命</Pill><Pill>尊重自然</Pill><Pill>相信邏輯</Pill></div></div></div></div></div><div className="mx-auto mt-10 grid max-w-7xl gap-6 md:grid-cols-3">{philosophyCards.map((card) => <motion.button key={card.title} type="button" whileHover={{ y: -6 }} whileTap={{ scale: 0.98 }} onClick={() => setInfoModal({ eyebrow: "Brand Philosophy", title: card.title, text: card.detail })} className="rounded-[2rem] border border-[#E2D5B5] bg-white/60 p-8 text-left shadow-sm transition hover:border-[#B89B5E] hover:bg-white"><h3 className="text-2xl font-semibold">{card.title}</h3><p className="mt-4 leading-8 text-[#49675A]">{card.text}</p><div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#1E6B43]">查看理念 <ArrowRight className="h-4 w-4" /></div></motion.button>)}</div></section>

        <section className="px-5 py-8 md:px-8 md:py-14"><div className="mx-auto max-w-7xl rounded-[3rem] border border-[#E7DDBF] bg-[#123828] p-8 text-white md:p-12"><div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between"><div className="max-w-2xl"><div className="text-sm tracking-[0.35em] text-[#D8C99C]">LIFE COLORS</div><h2 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">植本邏輯的每一種顏色，<br />都是一種人生願望。</h2></div><p className="max-w-xl text-lg leading-9 text-white/75">我們的產品不是冰冷的商品名稱，而是一位父親、一位丈夫，以及六個家庭對人生最真實的願望。</p></div><div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-5">{colorStories.map((story, index) => <motion.div key={story.color} whileHover={{ y: -8 }} className="rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur"><div className="text-sm tracking-[0.25em] text-[#D8C99C]">0{index + 1}</div><h3 className="mt-4 text-2xl font-semibold">{story.color}</h3><div className="mt-2 text-lg text-white/90">{story.title}</div><p className="mt-5 leading-8 text-white/70">{story.text}</p></motion.div>)}</div></div></section>

        <section id="產品系列" className="bg-white/45 px-5 py-20 md:px-8"><SectionTitle eyebrow="Product System" title="五色植物機能系統" text="每一種顏色，都是一種人生願望；每一款配方，對應一種現代人的身體需求。" /><div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-5">{products.map((p) => { const Icon = p.icon; return <button key={p.id} type="button" onClick={() => setActiveProduct(p)} className={`rounded-[2rem] border p-6 text-left shadow-sm transition hover:-translate-y-1 ${activeProduct.id === p.id ? "border-[#B89B5E] bg-white" : "border-[#E7DDBF] bg-white/65"}`}><div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: p.accent, color: p.deep }}><Icon /></div><div className="text-xl font-semibold">{p.name}</div><div className="mt-1 text-xs uppercase tracking-[0.18em] text-[#8B7A4C]">{p.english}</div><p className="mt-4 min-h-[84px] text-sm leading-7 text-[#49675A]">{p.desc}</p></button>; })}</div><button type="button" onClick={() => setDetailOpen(true)} className="mx-auto mt-8 block w-full max-w-7xl rounded-[2.5rem] border border-[#E7DDBF] bg-[#123828] p-8 text-left text-white transition hover:-translate-y-1 hover:shadow-2xl md:p-10"><div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center"><div><div className="text-sm tracking-[0.32em] text-[#D8C99C]">{activeProduct.colorName}</div><h3 className="mt-3 text-4xl font-semibold">{activeProduct.name}</h3><p className="mt-4 text-lg text-white/75">{activeProduct.theme}</p></div><div><p className="leading-8 text-white/78">{activeProduct.desc}</p><div className="mt-6 flex flex-wrap gap-3">{activeProduct.tags.map((tag) => <span key={tag} className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/85">{tag}</span>)}</div></div></div></button></section>

        <section id="派森" className="bg-[#F5F2EB] px-5 py-20 md:px-8">
          <HealthAssessment />
        </section>

        <section className="hidden">
          <div className="pointer-events-none absolute left-[8%] top-20 h-56 w-56 rounded-full bg-[#DDEEDB]/70 blur-3xl" />
          <div className="pointer-events-none absolute bottom-24 right-[8%] h-72 w-72 rounded-full bg-[#D8C99C]/40 blur-3xl" />
          <SectionTitle eyebrow="AI Health System" title="每個人，都應該擁有自己的植物機能建議" text="以LINE會員作為初期入口，結合生活狀態、身體反應、飲用紀錄與個人化建議，讓派森成為健康陪伴與品牌服務的核心。" />
          <div className="relative mx-auto max-w-6xl">
            <div className="physon-glass overflow-hidden rounded-[2.75rem] p-5 shadow-2xl shadow-[#123828]/12 md:p-8">
              <div className="flex flex-col gap-6 border-b border-white/60 pb-7 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-[#123828] text-[#D8C99C] shadow-xl shadow-[#123828]/20">
                    <span className="physon-breath-dot absolute -right-1 -top-1 h-4 w-4 rounded-full bg-[#D8C99C]" />
                    <Leaf className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="text-sm tracking-[0.28em] text-[#B89B5E]">PHYSON AI SIGNAL SCAN</div>
                    <h3 className="mt-1 text-3xl font-semibold text-[#123828] md:text-4xl">派森AI健康問卷</h3>
                    <p className="mt-2 text-sm text-[#49675A]">基本資料 + 6題身體訊號快篩</p>
                  </div>
                </div>
                <div className="rounded-full border border-[#D8C99C]/70 bg-white/55 px-5 py-3 text-sm font-medium text-[#355548] shadow-sm">高端植物機能分析</div>
              </div>

              {physonStatus === "loading" && <p className="mt-6 rounded-3xl border border-[#D8C99C]/60 bg-white/50 px-5 py-4 text-sm text-[#8B7A4C] shadow-sm">派森正在同步題庫內容...</p>}

              <div className="mt-8 rounded-[2.25rem] border border-white/70 bg-white/45 p-6 shadow-xl shadow-[#123828]/8 backdrop-blur md:p-8">
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div>
                    <div className="text-sm tracking-[0.22em] text-[#B89B5E]">基本資料輸入區</div>
                    <h4 className="mt-2 text-2xl font-semibold text-[#123828]">先建立個人分析基準</h4>
                  </div>
                  {profileSubmitted && <span className="rounded-full bg-[#DDEEDB] px-4 py-2 text-sm text-[#1E6B43]">基本資料已完成</span>}
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm text-[#8B7A4C]">性別</span>
                    <select value={profile.gender} onChange={(event) => updateProfile("gender", event.target.value)} className="w-full rounded-3xl border border-[#E2D5B5] bg-white/70 px-5 py-4 text-[#123828] shadow-sm outline-none backdrop-blur focus:border-[#B89B5E]">
                      <option value="">請選擇</option>
                      {genderOptions.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm text-[#8B7A4C]">年齡</span>
                    <input type="number" min="1" value={profile.age} onChange={(event) => updateProfile("age", event.target.value)} className="w-full rounded-3xl border border-[#E2D5B5] bg-white/70 px-5 py-4 text-[#123828] shadow-sm outline-none backdrop-blur focus:border-[#B89B5E]" placeholder="例如 35" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm text-[#8B7A4C]">身高 cm</span>
                    <input type="number" min="1" value={profile.height} onChange={(event) => updateProfile("height", event.target.value)} className="w-full rounded-3xl border border-[#E2D5B5] bg-white/70 px-5 py-4 text-[#123828] shadow-sm outline-none backdrop-blur focus:border-[#B89B5E]" placeholder="例如 170" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm text-[#8B7A4C]">體重 kg</span>
                    <input type="number" min="1" value={profile.weight} onChange={(event) => updateProfile("weight", event.target.value)} className="w-full rounded-3xl border border-[#E2D5B5] bg-white/70 px-5 py-4 text-[#123828] shadow-sm outline-none backdrop-blur focus:border-[#B89B5E]" placeholder="例如 65" />
                  </label>
                  <label className="block md:col-span-2">
                    <span className="mb-2 block text-sm text-[#8B7A4C]">工作型態</span>
                    <select value={profile.workType} onChange={(event) => updateProfile("workType", event.target.value)} className="w-full rounded-3xl border border-[#E2D5B5] bg-white/70 px-5 py-4 text-[#123828] shadow-sm outline-none backdrop-blur focus:border-[#B89B5E]">
                      <option value="">請選擇</option>
                      {workTypeOptions.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </label>
                </div>
                <button type="button" onClick={submitProfile} className="mt-6 rounded-full bg-[#123828] px-8 py-4 font-medium text-white shadow-xl shadow-[#123828]/20 transition hover:bg-[#1E6B43]">{profileCompleted ? "開始6題派森問卷" : "請先完成基本資料"}</button>
              </div>

              {profileSubmitted && <div className="mx-auto mt-8 max-w-4xl rounded-[2.5rem] border border-white/70 bg-[#123828]/95 p-6 text-white shadow-2xl shadow-[#123828]/20 md:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-sm tracking-[0.25em] text-[#D8C99C]">QUESTION {currentQuestionIndex + 1} / {questionBank.length}</div>
                    <h4 className="mt-2 text-2xl font-semibold">身體訊號掃描中</h4>
                  </div>
                  <div className="text-sm text-white/70">{answeredCount} 題已完成</div>
                </div>
                <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/12">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#D8C99C] via-[#F9F5EA] to-[#1E6B43] transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                </div>
                <motion.div key={currentQuestion?.id || currentQuestionIndex} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mt-8 rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-xl shadow-black/10 backdrop-blur">
                  <div className="text-sm text-[#D8C99C]">對應系統：{currentQuestion?.organ}</div>
                  <div className="mt-4 text-2xl font-semibold leading-10">{currentQuestion?.title}</div>
                  <div className="mt-7 grid gap-3 md:grid-cols-3">{currentQuestion?.options.map((option, score) => { const active = selectedAnswers[currentQuestionIndex] === score; return <button key={option} type="button" onClick={() => answerQuestion(currentQuestionIndex, score)} className={`rounded-3xl px-5 py-4 text-sm font-medium shadow-lg transition hover:-translate-y-0.5 ${active ? "bg-[#D8C99C] text-[#123828] shadow-[#D8C99C]/20" : "border border-white/15 bg-white/10 text-white hover:bg-white/18"}`}>{option}<span className="mt-1 block text-xs opacity-70">{score} 分</span></button>; })}</div>
                </motion.div>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <button type="button" onClick={() => setCurrentQuestionIndex((index) => Math.max(0, index - 1))} className="rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white/85 transition hover:bg-white/10">上一題</button>
                  <div className="flex flex-wrap gap-3">
                    {questionBank.map((question, index) => <button key={question.id || index} type="button" onClick={() => setCurrentQuestionIndex(index)} className={`h-3 w-3 rounded-full transition ${index === currentQuestionIndex ? "bg-[#D8C99C]" : selectedAnswers[index] !== undefined ? "bg-white/70" : "bg-white/20"}`} aria-label={`切換到第 ${index + 1} 題`} />)}
                  </div>
                  <button type="button" onClick={analyzeAnswers} className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#123828] shadow-xl shadow-white/10 transition hover:bg-[#D8C99C]">{aiAnalysis.completed ? "取得派森分析結果" : "完成6題後分析"}</button>
                </div>
              </div>}
            </div>

            <motion.div key={showAiResult ? `${aiRecommendation.id}-${aiAnalysis.totalScore}` : showAnalyzing ? "analyzing" : profileSubmitted ? "ready" : "profile"} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="physon-glass mx-auto mt-8 max-w-6xl rounded-[2.75rem] p-7 shadow-2xl shadow-[#123828]/12 md:p-9">
              {!showAiResult ? <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
                <div className="relative flex h-28 w-28 items-center justify-center">
                  <span className="physon-pulse-ring absolute inset-0 rounded-full border border-[#D8C99C]" />
                  <span className="physon-pulse-ring absolute inset-4 rounded-full border border-[#1E6B43]/50" />
                  <div className="physon-loader flex h-20 w-20 items-center justify-center rounded-full bg-[#123828] text-[#D8C99C] shadow-2xl shadow-[#123828]/25"><Brain className="h-8 w-8" /></div>
                </div>
                <h3 className="mt-8 text-3xl font-semibold text-[#123828]">{showAnalyzing ? "派森 AI 正在分析你的身體訊號" : profileSubmitted ? "完成問卷後啟動派森分析" : "先完成基本資料，建立個人化分析基準"}</h3>
                <p className="mt-4 max-w-xl text-lg leading-8 text-[#49675A]">{showAnalyzing ? "同步比對發炎風險與生活模式" : profileSubmitted ? "6題完成後，派森會整合BMI、身體訊號與工作型態，產生專屬建議。" : "基本資料完成後，系統會顯示6題派森AI健康問卷。"}</p>
              </div> : <>
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4"><div className="rounded-3xl p-4 shadow-xl" style={{ background: aiRecommendation.accent, color: aiRecommendation.deep }}><Brain /></div><div><div className="text-sm tracking-[0.25em] text-[#B89B5E]">PHYSON HEALTH ANALYSIS</div><h3 className="text-4xl font-semibold text-[#123828]">{aiAnalysis.severity}</h3></div></div>
                  <div className="rounded-full border border-[#D8C99C]/70 bg-white/55 px-5 py-3 text-sm font-medium text-[#355548]">完整報告可透過 LINE 取得</div>
                </div>
                <div className="mt-8 grid gap-5 md:grid-cols-3">
                  <div className="rounded-[2rem] border border-white/70 bg-white/60 p-6 shadow-xl shadow-[#123828]/8 backdrop-blur"><div className="text-sm tracking-[0.2em] text-[#B89B5E]">BMI</div><div className="mt-4 text-5xl font-semibold text-[#123828]">{bmi ? bmi.toFixed(1) : "--"}</div><p className="mt-3 text-sm leading-6 text-[#49675A]">{getBmiLabel(bmi)}｜{profile.gender}・{profile.age}歲・{profile.workType}</p></div>
                  <div className="rounded-[2rem] border border-white/70 bg-[#123828] p-6 text-white shadow-xl shadow-[#123828]/14"><div className="text-sm tracking-[0.2em] text-[#D8C99C]">發炎風險指數</div><div className="mt-4 text-5xl font-semibold">{aiAnalysis.totalScore}<span className="text-xl text-white/60">/12</span></div><p className="mt-3 text-sm leading-6 text-white/70">{aiAnalysis.severity}｜最高分系統：{topSystemLabel}</p></div>
                  <div className="rounded-[2rem] border border-white/70 bg-white/60 p-6 shadow-xl shadow-[#123828]/8 backdrop-blur"><div className="text-sm tracking-[0.2em] text-[#B89B5E]">發炎風險摘要</div><p className="mt-4 leading-8 text-[#49675A]">派森優先關注「{topSystemLabel}」，並搭配BMI與生活型態作為後續調整方向。</p></div>
                </div>
                <div className="mt-6 overflow-hidden rounded-[2.5rem] border border-white/70 bg-[#123828] text-white shadow-2xl shadow-[#123828]/18">
                  <div className="grid gap-0 lg:grid-cols-[.9fr_1.1fr]">
                    <div className="p-8" style={{ background: `linear-gradient(145deg, ${aiRecommendation.accent}, ${aiRecommendation.deep})` }}><div className="flex h-full min-h-64 flex-col justify-between rounded-[2rem] bg-white/18 p-7 backdrop-blur"><div><div className="text-sm tracking-[0.28em] text-white/75">RECOMMENDED DRINK</div><h4 className="mt-4 text-4xl font-semibold">{aiAnalysis.productName}</h4><p className="mt-3 text-lg text-white/85">{aiRecommendation.theme}</p></div><div className="mt-8 flex flex-wrap gap-2">{aiRecommendation.tags.map((tag) => <span key={tag} className="rounded-full bg-white/18 px-4 py-2 text-sm text-white">{tag}</span>)}</div></div></div>
                    <div className="p-8"><div className="text-sm tracking-[0.22em] text-[#D8C99C]">推薦原因</div><p className="mt-4 text-lg leading-9 text-white/78">{aiAnalysis.reason}</p><p className="mt-5 leading-8 text-white/65">派森依最高分系統「{topSystemLabel}」對應推薦規則，建議優先選擇「{aiAnalysis.productName}」。</p></div>
                  </div>
                </div>
                <div className="mt-6 rounded-[2rem] border border-white/70 bg-white/60 p-6 shadow-xl shadow-[#123828]/8 backdrop-blur"><div className="mb-2 flex items-center gap-2 text-[#1E6B43]"><Leaf className="h-5 w-5" />生活建議</div><p className="leading-8 text-[#49675A]">{aiAnalysis.tip}</p></div>
                <div className="mt-8 flex flex-wrap gap-3"><a href={lineCtaUrl} target="_blank" rel="noreferrer" className="rounded-full border border-[#D8C99C] bg-gradient-to-r from-[#123828] via-[#1E6B43] to-[#B89B5E] px-8 py-4 font-semibold text-white shadow-2xl shadow-[#123828]/20 transition hover:-translate-y-0.5">加入 LINE 取得完整個人健康報告</a><button type="button" onClick={() => { setActiveProduct(aiRecommendation); setDetailOpen(true); }} className="rounded-full border border-[#B89B5E] bg-white/70 px-8 py-4 font-medium text-[#123828] transition hover:bg-white">查看完整產品介紹</button></div>
              </>}
            </motion.div>
          </div>
        </section>

        <section id="最新消息" className="bg-white/45 px-5 py-20 md:px-8"><SectionTitle eyebrow="News" title="最新消息" text="品牌公告、試飲活動、加盟展消息與健康專欄。" /><div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">{news.map((n) => <motion.button key={n.title} type="button" whileHover={{ y: -6 }} whileTap={{ scale: 0.98 }} onClick={() => setInfoModal({ eyebrow: `${n.category}｜${n.date}`, title: n.title, text: n.detail })} className="rounded-[2rem] border border-[#E7DDBF] bg-white/70 p-7 text-left shadow-sm transition hover:border-[#B89B5E] hover:bg-white"><div className="flex items-center justify-between text-sm text-[#8B7A4C]"><span>{n.category}</span><span>{n.date}</span></div><h3 className="mt-5 text-2xl font-semibold">{n.title}</h3><p className="mt-4 leading-7 text-[#49675A]">{n.text}</p><div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#1E6B43]">閱讀更多 <ArrowRight className="h-4 w-4" /></div></motion.button>)}</div></section>

        <section id="合作加盟" className="px-5 py-20 md:px-8"><div className="mx-auto grid max-w-7xl gap-10 rounded-[3rem] bg-[#123828] p-8 text-white md:p-12 lg:grid-cols-[1fr_.9fr] lg:items-center"><div><p className="text-sm uppercase tracking-[0.35em] text-[#D8C99C]">Partnership</p><h2 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">讓每一個人活得久，還要活得好精彩。</h2><p className="mt-6 max-w-2xl text-lg leading-9 text-white/75">開放城市合作者、門市加盟、衛星據點、企業健康方案與試飲活動合作。總部提供產品系統、品牌內容、會員系統與營運支持。</p><div className="mt-8 flex flex-wrap gap-3"><Pill>城市合作者</Pill><Pill>門市加盟</Pill><Pill>衛星據點</Pill><Pill>企業方案</Pill></div></div><div className="rounded-[2rem] bg-white/10 p-7"><Newspaper className="mb-6 text-[#D8C99C]" /><h3 className="text-2xl font-semibold">合作洽談重點</h3><ul className="mt-5 space-y-4 text-white/78"><li>・品牌與產品教育完整建置</li><li>・試飲活動與加盟展轉換流程</li><li>・LINE會員與派森導入</li><li>・產品供應、物流與營運SOP支持</li></ul></div></div></section>

        <section id="聯絡我們" className="bg-white/45 px-5 py-20 md:px-8"><SectionTitle eyebrow="Contact" title="聯絡我們" text="歡迎洽詢品牌合作、門市加盟、城市合作者、企業健康方案與試飲活動。" /><div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.85fr_1.15fr]"><div className="rounded-[2rem] border border-[#E7DDBF] bg-white/70 p-8 shadow-sm"><img src={logo} alt="植本邏輯 Logo" className="h-20 w-20 object-contain" /><h3 className="mt-6 text-3xl font-semibold">植本邏輯｜PHYTOLOGIC</h3><p className="mt-4 leading-8 text-[#49675A]">重視生命。尊重自然。相信邏輯。</p><div className="mt-8 space-y-4 text-[#355548]"><div className="flex items-center gap-3"><MapPin className="h-5 w-5 text-[#B89B5E]" /> Taiwan</div><div className="flex items-center gap-3"><Mail className="h-5 w-5 text-[#B89B5E]" /> bryan@phytologic.tw</div><div className="flex items-center gap-3"><Phone className="h-5 w-5 text-[#B89B5E]" /> 07-223-2301</div></div></div><form className="rounded-[2rem] border border-[#E7DDBF] bg-white/80 p-8 shadow-sm"><div className="grid gap-5 md:grid-cols-2"><input className="rounded-2xl border border-[#E2D5B5] bg-white px-5 py-4 outline-none focus:border-[#B89B5E]" placeholder="姓名" /><input className="rounded-2xl border border-[#E2D5B5] bg-white px-5 py-4 outline-none focus:border-[#B89B5E]" placeholder="電話" /><input className="rounded-2xl border border-[#E2D5B5] bg-white px-5 py-4 outline-none focus:border-[#B89B5E]" placeholder="Email" /><select className="rounded-2xl border border-[#E2D5B5] bg-white px-5 py-4 outline-none focus:border-[#B89B5E]"><option>合作類型</option><option>門市加盟</option><option>城市合作者</option><option>企業健康方案</option><option>試飲活動</option><option>媒體/其他</option></select></div><textarea className="mt-5 min-h-36 w-full rounded-2xl border border-[#E2D5B5] bg-white px-5 py-4 outline-none focus:border-[#B89B5E]" placeholder="請留下您的需求與所在城市" /><button type="button" onClick={() => setFormSent(true)} className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#123828] px-8 py-4 font-medium text-white shadow-xl shadow-[#123828]/15 transition hover:bg-[#1E6B43]">{formSent ? "已收到洽詢" : "送出洽詢"} <ArrowRight className="h-4 w-4" /></button>{formSent && <p className="mt-4 rounded-2xl bg-[#DDEEDB] px-5 py-4 text-[#1E6B43]">感謝您的洽詢，品牌團隊將儘快與您聯繫。</p>}</form></div></section>

        {infoModal && <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#123828]/55 px-5 backdrop-blur-sm" onClick={() => setInfoModal(null)}><motion.div initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl rounded-[2.5rem] border border-white/70 bg-[#F9F5EA] p-8 shadow-2xl"><div className="flex items-start justify-between gap-5"><div><div className="text-sm tracking-[0.25em] text-[#B89B5E]">{infoModal.eyebrow}</div><h3 className="mt-3 text-4xl font-semibold text-[#123828]">{infoModal.title}</h3></div><button type="button" onClick={() => setInfoModal(null)} className="rounded-full bg-white p-3 text-[#123828] shadow"><X /></button></div><p className="mt-8 rounded-[2rem] bg-white/70 p-7 text-lg leading-9 text-[#49675A]">{infoModal.text}</p><button type="button" onClick={() => setInfoModal(null)} className="mt-7 rounded-full bg-[#123828] px-7 py-4 font-medium text-white">我知道了</button></motion.div></div>}
        {detailOpen && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#123828]/55 px-5 backdrop-blur-sm" onClick={() => setDetailOpen(false)}><motion.div initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} onClick={(e) => e.stopPropagation()} className="max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-[2.5rem] border border-white/70 bg-[#F9F5EA] p-8 shadow-2xl"><div className="flex items-start justify-between gap-5"><div><div className="text-sm tracking-[0.32em] text-[#B89B5E]">{activeProduct.colorName}｜{activeProduct.english}</div><h3 className="mt-3 text-4xl font-semibold text-[#123828]">{activeProduct.name}</h3><p className="mt-3 text-lg text-[#49675A]">{activeProduct.theme}</p></div><button type="button" onClick={() => setDetailOpen(false)} className="rounded-full bg-white p-3 text-[#123828] shadow"><X /></button></div><div className="mt-8 rounded-[2rem] p-7" style={{ background: activeProduct.accent }}><p className="text-lg leading-9 text-[#355548]">{activeProduct.desc}</p></div><div className="mt-7 grid gap-4 md:grid-cols-2">{activeProduct.tags.map((tag, index) => <div key={tag} className="rounded-2xl border border-[#E2D5B5] bg-white/75 p-5"><div className="text-sm text-[#B89B5E]">機能重點 0{index + 1}</div><div className="mt-2 text-xl font-semibold text-[#123828]">{tag}</div></div>)}</div><div className="mt-8 flex flex-wrap gap-3"><a href="#聯絡我們" onClick={() => setDetailOpen(false)} className="rounded-full bg-[#123828] px-7 py-4 font-medium text-white">預約試飲 / 洽詢</a><button type="button" onClick={() => setDetailOpen(false)} className="rounded-full border border-[#B89B5E] px-7 py-4 font-medium text-[#123828]">關閉</button></div></motion.div></div>}
      </main>

      <footer className="border-t border-[#E7DDBF] px-5 py-10 md:px-8"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 text-sm text-[#49675A] md:flex-row md:items-center"><div>© 2026 植本邏輯 PHYTOLOGIC. All rights reserved.</div><div className="tracking-[0.28em]">熱愛・尊重・相信</div></div></footer>
    </div>
  );
}
