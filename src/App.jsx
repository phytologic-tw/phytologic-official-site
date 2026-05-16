import { useState, useEffect, useRef } from "react";

// ── Google Fonts ───────────────────────────────────────────────────────────────
const fl = document.createElement("link");
fl.rel = "stylesheet";
fl.href = "https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=JetBrains+Mono:wght@400;700&display=swap";
document.head.appendChild(fl);

// ── Data ───────────────────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: "pearl",
    name: "珍珠白",
    en: "PEARL WHITE",
    color: "#F2F1EC",
    accent: "#D9D8D2",
    tag: "清晰與傳承",
    headline: "保持清楚和清醒，真正陪他長大",
    desc: "不是只留下財富，而是真正陪他長大。如果腦袋不行了，很多愛就成為負擔。保持清晰，是為了將一輩子的經驗完整傳承。",
    ingredients: ["山藥", "白木耳", "蘋果", "生核桃", "百合"],
    benefits: ["維持大腦清晰・神經傳導穩定", "深層滋潤・對抗慢性發炎", "提供高品質 Omega-3"],
    kcal: "88.8", protein: "4.2g", fat: "4.5g", carb: "8.5g",
  },
  {
    id: "emerald",
    name: "翡翠綠",
    en: "EMERALD GREEN",
    color: "#3E6B4B",
    accent: "#2F5239",
    tag: "代謝與腸胃",
    headline: "吃的下，才可以活得好",
    desc: "腸胃好，代謝才會好，發炎才會少，這才是維持身體健康真正的根本。一切修復真正的起點，來自於乾淨的代謝。",
    ingredients: ["地瓜葉", "櫛瓜", "芭樂", "檸檬", "綠花椰菜"],
    benefits: ["強大抗氧化・促進腸胃蠕動", "豐富微量營養素・驅動代謝", "清除體內負擔・淨化"],
    kcal: "67.8", protein: "4.1g", fat: "3.0g", carb: "6.5g",
  },
  {
    id: "rose",
    name: "玫瑰紅",
    en: "ROSE RED",
    color: "#9E4A56",
    accent: "#7D3A44",
    tag: "年輕與生命力",
    headline: "愛美想帥，不是為了再瘋一把",
    desc: "希望自己還能保有好的狀態，陪孩子更久一點。真正的年輕從來不是年齡，而是身體裡還有沒有生命裡那份神奇的力量。",
    ingredients: ["甜菜根", "玫瑰花瓣", "紅棗", "紫甘藍", "百香果"],
    benefits: ["促進膠原蛋白合成・彈性", "強效抗氧化・減緩老化", "促進鐵質吸收・紅潤氣色"],
    kcal: "75.6", protein: "4.1g", fat: "3.2g", carb: "8.3g",
  },
  {
    id: "diamond",
    name: "金鑽黃",
    en: "DIAMOND YELLOW",
    color: "#D8A133",
    accent: "#B5862A",
    tag: "力量與守護",
    headline: "一個男人對家庭最簡單的責任感",
    desc: "真正的強壯，不是為了打敗誰。而是當家人需要你的時候，你還有力氣站在前面。給予肌肉與能量最純粹的支援。",
    ingredients: ["甜玉米", "黃甜椒", "新鮮薑黃", "香蕉", "豆薯"],
    benefits: ["蛋白質節省效應・幫助增肌", "薑黃素降低運動發炎", "穩定能量供給・加速恢復"],
    kcal: "68", protein: "3.5g", fat: "2.8g", carb: "10.5g",
  },
  {
    id: "crystal",
    name: "水晶紫",
    en: "CRYSTAL PURPLE",
    color: "#7566A8",
    accent: "#5C5084",
    tag: "看見與感知",
    headline: "看見家人的樣子與世界的風景",
    desc: "不是為了護眼，而是為了希望能看見家人的樣子、世界的風景。因為人生最後留下來的，都是回憶。",
    ingredients: ["木鱉果", "紫薯", "藍莓", "桑椹", "紫高麗"],
    benefits: ["豐富維生素A・維持暗處視覺", "強效花青素・減輕眼部氧化", "保護感光細胞・延緩退化"],
    kcal: "71.5", protein: "3.7g", fat: "2.8g", carb: "7.9g",
  },
  {
    id: "platinum",
    name: "鉑金白",
    en: "PLATINUM WHITE",
    color: "#D9D9D6",
    accent: "#A6A6A3",
    tag: "高階修復",
    headline: "極簡未來感，重啟深層細胞防禦",
    desc: "應對重度發炎與高壓耗損，以極簡純粹的修復配方，進行全身性的機能重整與高階防護。",
    ingredients: ["白花椰", "大豆胜肽", "高麗菜", "牛蒡", "亞麻仁"],
    benefits: ["高階細胞修復・對抗自由基", "深度抗炎・免疫調節", "穩固基礎代謝屏障"],
    kcal: "82.0", protein: "5.5g", fat: "4.0g", carb: "7.0g",
  }
];

const AGE_GROUPS = [
  { label: "青少年", range: "12～16 歲", total: 20 },
  { label: "青年", range: "20～30 歲", total: 20 },
  { label: "輕熟齡", range: "35～45 歲", total: 20 },
  { label: "熟齡", range: "50～60 歲", total: 20 },
  { label: "銀髮族", range: "65～75 歲", total: 20 },
];

// 功能醫學七大系統炎症題目庫
const QUIZ_BANK = [
  { q: "常常覺得極度疲勞，即使睡醒後仍覺得沒有精神？", sys: "神經系統・能量代謝" },
  { q: "注意力難以集中，思考緩慢，常出現恍惚的「腦霧」感？", sys: "神經系統・腦部防護" },
  { q: "經常肚子脹氣、消化不良，或者有不定期便祕、拉肚子困擾？", sys: "消化系統・腸道屏障" },
  { q: "身體容易保留水分、經常感覺眼瞼或手腳局部浮腫？", sys: "解毒系統・水分代謝" },
  { q: "皮膚容易乾癢、暗沉、氣色差，或是近期異常掉髮？", sys: "免疫系統・皮膚屏障" },
  { q: "肌肉或關節經常感到莫名的痠痛、僵硬或緊繃？", sys: "骨骼肌肉・發炎反應" },
  { q: "長時間、高度使用3C產品，眼睛經常乾澀、酸痛或視力疲勞？", sys: "感知系統・視覺防護" },
  { q: "經常感到壓力巨大、莫名焦慮，或者情緒起伏難以控制？", sys: "內分泌系統・皮質醇壓力" },
  { q: "日常飲食中，極度渴望含糖手搖飲、麵包或澱粉類食物？", sys: "血糖系統・代謝阻抗" },
  { q: "換季或空氣不佳時容易過敏（起疹子、打噴嚏、流鼻水）？", sys: "免疫系統・過敏反應" }
];

function getRecommend(score) {
  // 分數範圍：0 ~ 20 分 (10題 * 2分)
  if (score >= 16) return PRODUCTS[5]; // 鉑金白 - 高階重度修復
  if (score >= 13) return PRODUCTS[0]; // 珍珠白 - 大腦神經
  if (score >= 10) return PRODUCTS[1]; // 翡翠綠 - 腸胃代謝
  if (score >= 7)  return PRODUCTS[3]; // 金鑽黃 - 力量肌肉
  if (score >= 4)  return PRODUCTS[4]; // 水晶紫 - 視覺看見
  return PRODUCTS[2]; // 玫瑰紅 - 基礎保養與生命力
}

// ── Hooks ──────────────────────────────────────────────────────────────────────
function useInView(ref, threshold = 0.1) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return visible;
}

// ── Sub-components ─────────────────────────────────────────────────────────────
function Orb({ color, size = 80, style = {} }) {
  const isLight = color === "#F2F1EC" || color === "#D9D9D6";
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: color,
      boxShadow: isLight ? "inset 0 4px 10px rgba(0,0,0,0.03), 0 8px 24px rgba(0,0,0,0.06)" : `0 8px 24px ${color}25`,
      border: isLight ? "1px solid rgba(0,0,0,0.05)" : "none",
      flexShrink: 0,
      ...style,
    }} />
  );
}

function ProductModal({ product, onClose }) {
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const isLight = product.color === "#F2F1EC" || product.color === "#D9D9D6";

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(255,255,255,0.85)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, backdropFilter: "blur(16px)" }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 32, padding: "48px", maxWidth: 640, width: "100%", maxHeight: "85vh", overflowY: "auto",
        boxShadow: "0 30px 70px rgba(0,0,0,0.08)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 36 }}>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <Orb color={product.color} size={64} />
            <div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#888", letterSpacing: 2, marginBottom: 4 }}>{product.en}</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 700, color: "#1A1A1A" }}>{product.name}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "#F5F5F5", border: "none", color: "#666", width: 36, height: 36, borderRadius: "50%", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>

        <div style={{ fontFamily: "'Noto Serif TC',serif", fontSize: 22, fontWeight: 700, color: "#3E6B4B", marginBottom: 24, lineHeight: 1.5 }}>「{product.headline}」</div>
        <p style={{ fontSize: 15, color: "#555", lineHeight: 1.8, marginBottom: 32 }}>{product.desc}</p>

        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, color: "#888", letterSpacing: 2, fontFamily: "'JetBrains Mono',monospace", marginBottom: 16 }}>CORE BENEFITS / 核心機能</div>
          {product.benefits.map(b => (
            <div key={b} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
              <span style={{ color: "#3E6B4B", marginTop: 1 }}>✦</span>
              <span style={{ fontSize: 15, lineHeight: 1.6, color: "#333" }}>{b}</span>
            </div>
          ))}
        </div>

        <div style={{ background: "#F9F9F7", borderRadius: 20, padding: 28, border: "1px solid rgba(0,0,0,0.03)" }}>
          <div style={{ fontSize: 11, color: "#888", letterSpacing: 2, fontFamily: "'JetBrains Mono',monospace", marginBottom: 16 }}>NUTRITION / 100g</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
            {[["熱量", product.kcal, "kcal"],["蛋白質", product.protein, ""],["脂肪", product.fat, ""],["碳水", product.carb, ""]].map(([label, val, unit]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 700, color: "#1A1A1A" }}>{val}</div>
                <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>{label} {unit && `(${unit})`}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuizSection() {
  const [step, setStep] = useState("select"); // select | quiz | result
  const [ageGroup, setAgeGroup] = useState(null);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);

  const score = Object.values(answers).reduce((a, b) => a + b, 0);

  function answer(val) {
    setAnswers({ ...answers, [current]: val });
    if (current + 1 >= QUIZ_BANK.length) {
      setStep("result");
    } else {
      setCurrent(current + 1);
    }
  }

  function restart() {
    setStep("select");
    setAgeGroup(null);
    setAnswers({});
    setCurrent(0);
  }

  const recommend = step === "result" ? getRecommend(score) : null;
  const progress = step === "quiz" ? ((current + 1) / QUIZ_BANK.length) * 100 : 0;

  function getInflammationLevel() {
    if (score >= 16) return { label: "高度系統性發炎", color: "#9E4A56", advice: "體內多個生理系統正處於高壓耗損與深度慢性發炎狀態。強烈建議積極調整生活與飲食型態，並啟動高階植萃修復機制，必要時尋求專業醫師協助。" };
    if (score >= 10) return { label: "中度發炎耗損", color: "#D8A133", advice: "身體已發出多項慢性發炎警訊，特別在消化與神經能量系統。建議立刻實施抗發炎剔除飲食法，減少外食加工品，並加強補充植物功能性膳食纖維與 Omega-3。" };
    if (score >= 4)  return { label: "輕度微幅發炎", color: "#7566A8", advice: "目前發炎反應尚處於初期微調階段，多表現為日常疲勞與代謝沉重。建議維持穩定作息，多攝取天然彩虹植化素以提升體內細胞的抗氧化防護網。" };
    return { label: "健康綠燈穩定", color: "#3E6B4B", advice: "目前體內炎症指數極低，生理平衡控制優異。請繼續保持目前的乾淨飲食習慣、充足睡眠與規律律動，讓身體維持在最佳本源狀態。" };
  }

  const level = step === "result" ? getInflammationLevel() : null;

  return (
    <div style={{ width: "100%", margin: "0 auto" }}>
      {/* Step: Select Age */}
      {step === "select" && (
        <div style={{ animation: "fadeUp 0.6s ease both" }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#3E6B4B", letterSpacing: 2, marginBottom: 20, fontWeight: 700 }}>PHASE 01 · 選擇專屬年齡層</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {AGE_GROUPS.map(ag => (
              <button key={ag.label} onClick={() => { setAgeGroup(ag); setStep("quiz"); }}
                style={{
                  padding: "20px 28px", borderRadius: 16, border: "1px solid rgba(0,0,0,0.06)",
                  background: "#FFFFFF", color: "#2C2C2C", cursor: "pointer", textAlign: "left",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.01)"
                }}
              >
                <span style={{ fontFamily: "'Noto Serif TC',serif", fontSize: 18, fontWeight: 700, color: "#1A1A1A" }}>{ag.label}</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: "#888" }}>{ag.range}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step: Quiz Questions */}
      {step === "quiz" && (
        <div style={{ animation: "fadeUp 0.6s ease both" }}>
          {/* Progress Header */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#3E6B4B", fontWeight: 700, letterSpacing: 1 }}>
                QUESTION {current + 1} / {QUIZ_BANK.length}
              </span>
              <span style={{ fontSize: 12, color: "#888", background: "#F5F5F3", padding: "4px 12px", borderRadius: 99 }}>
                {QUIZ_BANK[current].sys}
              </span>
            </div>
            <div style={{ height: 2, background: "rgba(0,0,0,0.05)", borderRadius: 99 }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "#3E6B4B", borderRadius: 99, transition: "width .4s cubic-bezier(0.16, 1, 0.3, 1)" }} />
            </div>
          </div>

          {/* Question Card */}
          <div style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.05)", borderRadius: 24, padding: "40px 32px", boxShadow: "0 10px 30px rgba(0,0,0,0.02)" }}>
            <div style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 22, fontWeight: 700, lineHeight: 1.8, marginBottom: 40, color: "#1A1A1A", minHeight: "80px" }}>
              {QUIZ_BANK[current].q}
            </div>
            
            {/* Elegant Column Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[["從不 / 無此症狀", 0], ["偶爾 / 輕微感受", 1], ["經常 / 頻繁困擾", 2]].map(([label, val]) => (
                <button key={label} onClick={() => answer(val)} style={{
                  padding: "16px 24px", borderRadius: 14, border: "1px solid rgba(0,0,0,0.08)",
                  background: "#FAFAFA", color: "#333", cursor: "pointer", fontSize: 15, fontWeight: 700,
                  textAlign: "left", fontFamily: "'Noto Serif TC',serif", display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  <span>{label}</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#999" }}>+{val}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step: Result Screen */}
      {step === "result" && recommend && level && (
        <div style={{ animation: "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both" }}>
          {/* Diagnostic Header */}
          <div style={{ textAlign: "center", marginBottom: 40, paddingBottom: 32, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#888", letterSpacing: 2, marginBottom: 12 }}>DIAGNOSTIC REPORT</div>
            <div style={{ fontFamily: "'Noto Serif TC',serif", fontSize: 36, fontWeight: 900, color: level.color, marginBottom: 8 }}>
              {level.label}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, color: "#666" }}>
              系統炎症總評分：<span style={{ fontWeight: 700, color: level.color }}>{score}</span> / 20
            </div>
          </div>

          {/* Expert Advice Block */}
          <div style={{ background: `${level.color}06`, border: `1px solid ${level.color}18`, borderRadius: 20, padding: "28px 24px", marginBottom: 40 }}>
            <div style={{ fontSize: 12, color: level.color, fontWeight: 900, fontFamily: "'JetBrains Mono',monospace", marginBottom: 8 }}>✦ CLINICAL ADVICE / 深度調養建議</div>
            <div style={{ fontSize: 15, lineHeight: 1.9, color: "#444", fontWeight: 500 }}>{level.advice}</div>
          </div>

          {/* Targeted Recipe Recommendation */}
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#3E6B4B", letterSpacing: 2, marginBottom: 16, fontWeight: 700 }}>AI TARGETED PRESCRIPTION / 專屬機能飲推薦</div>
          <div style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 24, padding: "32px", boxShadow: "0 12px 32px rgba(0,0,0,0.02)", display: "flex", gap: 24, alignItems: "center" }}>
            <Orb color={recommend.color} size={72} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700, color: "#1A1A1A" }}>{recommend.name}</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#888" }}>{recommend.en}</span>
              </div>
              <div style={{ fontSize: 14, color: "#3E6B4B", fontWeight: 700, fontStyle: "italic", marginBottom: 8 }}>「{recommend.headline}」</div>
              <div style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>核心標的：{recommend.tag}</div>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 40 }}>
            <button onClick={restart} style={{ padding: "16px 40px", borderRadius: 99, border: "1px solid #E0E0E0", background: "#FFFFFF", color: "#2C2C2C", cursor: "pointer", fontSize: 14, fontWeight: 700, letterSpacing: 1 }}>
              重新進行系統測驗
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────────
export default function App() {
  const [activeProduct, setActiveProduct] = useState(null);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const h = () => setNavScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const heroRef = useRef(null);
  const storyRef = useRef(null);
  const productsRef = useRef(null);
  const quizRef = useRef(null);

  const heroVisible = useInView(heroRef, 0.05);
  const storyVisible = useInView(storyRef);
  const productsVisible = useInView(productsRef);
  const quizVisible = useInView(quizRef);

  return (
    <div style={{ background: "#FAFAFA", color: "#2C2C2C", fontFamily: "'Noto Serif TC', serif", minHeight: "100vh" }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(30px) } to { opacity:1; transform:translateY(0) } }
        ::-webkit-scrollbar { width:6px; background:#F0F0F0 }
        ::-webkit-scrollbar-thumb { background:#CCCCCC; border-radius:99px }
        a { text-decoration:none; transition:opacity .2s }
        a:hover { opacity:.6 }
        button { transition:all .3s cubic-bezier(0.16, 1, 0.3, 1) }
        button:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.04); }
        button:active { transform:scale(.98) }
      `}</style>

      {/* ── NAV ────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 500,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: navScrolled ? "16px 60px" : "28px 60px",
        background: navScrolled ? "rgba(255,255,255,.9)" : "transparent",
        backdropFilter: navScrolled ? "blur(12px)" : "none",
        borderBottom: navScrolled ? "1px solid rgba(0,0,0,.05)" : "none",
        transition: "all .4s ease",
      }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", fill: "#3E6B4B" }}>
              <polygon points="50,5 90,27 90,73 50,95 10,73 10,27" />
              <path d="M50,95 C65,70 80,60 80,30 C60,45 55,65 50,95 Z" fill="#FFFFFF" opacity="0.9" />
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 16, fontWeight: 700, letterSpacing: 2, color: "#1A1A1A" }}>PHYTOLOGIC</div>
            <div style={{ fontSize: 11, color: "#888", letterSpacing: 2, marginTop: 2 }}>植本邏輯</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 40 }}>
          {[["#story","品牌故事"],["#products","六色植萃"],["#quiz","派森 AI"]].map(([href, label]) => (
            <a key={href} href={href} style={{ color: "#2C2C2C", fontWeight: 700, fontSize: 13, letterSpacing: 1 }}>{label}</a>
          ))}
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────── */}
      <section ref={heroRef} style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "140px 72px 80px", background: "#FFFFFF", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-10%", right: "-5%", width: "60vw", height: "60vw", background: "radial-gradient(circle, rgba(62,107,75,0.03) 0%, rgba(255,255,255,0) 70%)", borderRadius: "50%", zIndex: 0 }} />
        
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 900, animation: heroVisible ? "fadeUp 1s ease both" : "none" }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#3E6B4B", letterSpacing: 4, marginBottom: 32 }}>
            重視生命。尊重自然。相信邏輯。
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 72, lineHeight: 1.1, fontWeight: 700, letterSpacing: "-1px", margin: "0 0 32px", color: "#1A1A1A" }}>
            健康不是為了活得久。<br />
            而是為了能<em style={{ color: "#3E6B4B", fontStyle: "italic" }}>好好陪伴。</em>
          </h1>
          <p style={{ fontSize: 18, lineHeight: 2, color: "#666", maxWidth: 600, margin: "0 auto 48px" }}>
            我們不是在做飲料，而是真正每天會進入人體、長期被身體吸收的植物機能系統。從愛出發，結合科學與自然，守護人生裡真正重要的人。
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            <a href="#products" style={{ padding: "18px 40px", borderRadius: 99, background: "#3E6B4B", color: "#FFFFFF", fontSize: 15, fontWeight: 700, letterSpacing: 1 }}>探索六色植萃</a>
            <a href="#quiz" style={{ padding: "18px 40px", borderRadius: 99, border: "1px solid #E0E0E0", background: "#FFFFFF", color: "#2C2C2C", fontSize: 15, fontWeight: 700, letterSpacing: 1 }}>派森 AI 分析</a>
          </div>
        </div>
      </section>

      {/* ── STORY ──────────────────────────────────────── */}
      <section id="story" ref={storyRef} style={{ padding: "140px 72px", background: "#FAFAFA" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 100, alignItems: "center" }}>
          <div style={{ animation: storyVisible ? "fadeUp 0.8s ease both" : "none" }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#888", letterSpacing: 2, marginBottom: 24 }}>BRAND STORY</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 48, fontWeight: 700, lineHeight: 1.3, margin: "0 0 32px", color: "#1A1A1A" }}>
              六個家庭，<br />重新理解健康之後的<br />人生答案。
            </h2>
            <p style={{ fontSize: 16, lineHeight: 2.2, color: "#555", marginBottom: 24 }}>
              50歲那年成為父親，當孩子出生的那一刻，我第一次認真思考：「我還有多久能陪他？」
            </p>
            <p style={{ fontSize: 16, lineHeight: 2.2, color: "#555" }}>
              這句話徹底改變了我的人生。健康從來不只是身體問題，而是人生所有幸福的根本。我們不是在做給市場看的商品，而是做給家人吃的食物。植本邏輯，不是從商業開始，而是從愛開始。
            </p>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, animation: storyVisible ? "fadeUp 0.8s ease both 0.2s" : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 24, marginTop: 40 }}>
              {["好喝", "好看", "好吸收"].map((v) => (
                <div key={v} style={{ background: "#FFFFFF", padding: "32px", borderRadius: "20px 0 20px 20px", boxShadow: "0 10px 30px rgba(0,0,0,0.01)", border: "1px solid rgba(0,0,0,0.03)" }}>
                  <div style={{ fontSize: 12, color: "#3E6B4B", fontWeight: 900, marginBottom: 8 }}>✦ 三好原則</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: "#1A1A1A" }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {["無人工", "無化學", "無合成"].map((v) => (
                <div key={v} style={{ background: "#FFFFFF", padding: "32px", borderRadius: "0 20px 20px 20px", boxShadow: "0 10px 30px rgba(0,0,0,0.01)", border: "1px solid rgba(0,0,0,0.03)" }}>
                  <div style={{ fontSize: 12, color: "#888", fontWeight: 900, marginBottom: 8 }}>✦ 三無鐵律</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: "#1A1A1A" }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ───────────────────────────────────── */}
      <section id="products" ref={productsRef} style={{ padding: "140px 72px", background: "#FFFFFF" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 80, animation: productsVisible ? "fadeUp 0.6s ease both" : "none" }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#888", letterSpacing: 2, marginBottom: 16 }}>SIX COLOR SYSTEM</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 42, fontWeight: 700, margin: 0, color: "#1A1A1A" }}>每一種顏色，都是人生。</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, animation: productsVisible ? "fadeUp 0.8s ease both 0.15s" : "none" }}>
            {PRODUCTS.map(p => <ProductCard key={p.id} product={p} onClick={setActiveProduct} />)}
          </div>
        </div>
      </section>

      {/* ── QUIZ SECTION ───────────────────────────────── */}
      <section id="quiz" ref={quizRef} style={{ padding: "140px 72px", background: "#F9F9F6" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 100, alignItems: "start" }}>
            <div style={{ animation: quizVisible ? "fadeUp 0.8s ease both" : "none" }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#3E6B4B", letterSpacing: 2, marginBottom: 24, fontWeight: 700 }}>PAISEN AI HEALTH SYSTEM</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 48, fontWeight: 700, lineHeight: 1.2, margin: "0 0 32px", color: "#1A1A1A" }}>
                派森 AI<br />功能醫學炎症分析
              </h2>
              <p style={{ fontSize: 16, lineHeight: 2, color: "#666", marginBottom: 32 }}>
                本評估系統根據功能醫學「七大核心生理系統」炎症指數架構客製設計 。結合不同年齡層調校參數 ，精準定量評估身體沉默的發炎警訊，防範現代人因壓力與不當外食導致的慢性亞健康耗損。
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  ["🧬", "功能醫學七大維度層次", "涵蓋神經、腸道屏障、排毒、血糖阻抗等全面性健康評估"],
                  ["📊", "精準定量發炎指數", "跳脫傳統粗略問卷，提供具備臨床調養價值的系統性分析報告"],
                  ["🍵", "對齊六色機能矩陣", "依據最終發炎負荷，智慧配對最契合的天然高階植萃配方"],
                ].map(([icon, title, desc]) => (
                  <div key={title} style={{ display: "flex", gap: 16, padding: "20px", background: "#FFFFFF", borderRadius: 16, border: "1px solid rgba(0,0,0,0.03)" }}>
                    <span style={{ fontSize: 20 }}>{icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: 4, color: "#1A1A1A" }}>{title}</div>
                      <div style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Quiz Card Widget */}
            <div style={{
              background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.05)", borderRadius: 32, padding: "48px 40px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.02)", animation: quizVisible ? "fadeUp 0.8s ease both 0.2s" : "none",
            }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 700, color: "#3E6B4B", marginBottom: 4 }}>派森系統評估</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#999", letterSpacing: 2, marginBottom: 32 }}>PAISEN CLINICAL ANALYSIS SYSTEM</div>
              <QuizSection />
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────── */}
      <footer style={{ padding: "60px 72px", background: "#F5F5F5", borderTop: "1px solid #EBEBEB" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
               <svg viewBox="0 0 100 100" style={{ width: 24, height: 24, fill: "#3E6B4B" }}>
                 <polygon points="50,5 90,27 90,73 50,95 10,73 10,27" />
               </svg>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 16, fontWeight: 700, letterSpacing: 2, color: "#1A1A1A" }}>PHYTOLOGIC</div>
            </div>
            <div style={{ fontSize: 14, color: "#666", fontWeight: 700 }}>真正重要的人，值得最乾淨的選擇。</div>
          </div>
          <div style={{ fontSize: 12, color: "#999", fontFamily: "'JetBrains Mono',monospace" }}>
            © 2026 PHYTOLOGIC. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>

      {/* ── Product Modal ───────────────────────────────── */}
      {activeProduct && <ProductModal product={activeProduct} onClose={() => setActiveProduct(null)} />}
    </div>
  );
}

function ProductCard({ product, onClick }) {
  const [hovered, setHovered] = useState(false);
  const isLight = product.color === "#F2F1EC" || product.color === "#D9D9D6";
  const textColor = isLight ? "#2C2C2C" : product.color;

  return (
    <div
      onClick={() => onClick(product)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 24, padding: "40px 32px", cursor: "pointer",
        background: "#FFFFFF",
        border: hovered ? `1px solid ${product.accent}66` : "1px solid rgba(0,0,0,0.05)",
        transition: "all .4s cubic-bezier(0.16, 1, 0.3, 1)", 
        transform: hovered ? "translateY(-6px)" : "none",
        boxShadow: hovered ? `0 20px 40px rgba(0,0,0,0.03)` : "0 4px 12px rgba(0,0,0,0.01)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
        <Orb color={product.color} size={64} />
        <div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#888", letterSpacing: 2, marginBottom: 2 }}>{product.en}</div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700, color: "#1A1A1A" }}>{product.name}</div>
        </div>
      </div>
      <div style={{ display: "inline-block", padding: "6px 16px", borderRadius: 99, background: isLight ? "#F8F8F8" : `${product.color}15`, color: textColor, fontSize: 12, fontWeight: 700, marginBottom: 16 }}>{product.tag}</div>
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 600, fontStyle: "italic", marginBottom: 12, lineHeight: 1.5, color: "#1A1A1A" }}>「{product.headline}」</div>
      <div style={{ fontSize: 14, color: "#666666", lineHeight: 1.8 }}>{product.desc}</div>
    </div>
  );
}
