import { useState, useEffect, useRef } from "react";

// ── Google Fonts ───────────────────────────────────────────────────────────────
const fl = document.createElement("link");
fl.rel = "stylesheet";
fl.href = "https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=JetBrains+Mono:wght@400;700&display=swap";
document.head.appendChild(fl);

// ── Data ───────────────────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: "snow",
    name: "雪山植萃",
    en: "PLATINUM BASE",
    color: "#f8fafc",
    accent: "#94a3b8",
    tag: "抗發炎・修復",
    target: "腸胃敏感・慢性發炎・心血管",
    headline: "從細胞層面，深度修復發炎",
    desc: "以生核桃的 Omega-3 對抗慢性發炎，搭配蘋果、山藥、白木耳的水溶性纖維，強化腸道與心血管防護。",
    ingredients: ["豆薯", "山藥", "老薑", "銀耳", "蘋果", "紅棗", "生核桃"],
    benefits: ["抑制慢性發炎・細胞修復", "強化腸胃道・免疫力", "守護心血管・穩定代謝"],
    kcal: "88.8",
    protein: "4.2g",
    fat: "4.5g",
    carb: "8.5g",
  },
  {
    id: "lime",
    name: "青檸植萃",
    en: "GREEN DETOX",
    color: "#22c55e",
    accent: "#86efac",
    tag: "代謝・排毒",
    target: "便祕・減重・高血脂・免疫低下",
    headline: "體內環保，淨化代謝負擔",
    desc: "豐富維生素C與膳食纖維，加速腸道排毒、強化抗氧化防禦，是名副其實的「植物綠拿鐵」。",
    ingredients: ["地瓜葉", "櫛瓜", "青江菜", "黑木耳", "芭樂", "檸檬", "香水檸檬皮"],
    benefits: ["強大抗氧化・對抗自由基", "促進腸胃蠕動・排毒", "豐富微量營養素・驅動代謝"],
    kcal: "67.8",
    protein: "4.1g",
    fat: "3.0g",
    carb: "6.5g",
  },
  {
    id: "rose",
    name: "玫瑰植萃",
    en: "ROSE BEAUTY",
    color: "#f43f5e",
    accent: "#fda4af",
    tag: "美容・抗老",
    target: "女性保養・膠原蛋白・氣色",
    headline: "由內而外，綻放真實光采",
    desc: "甜菜根、紫甘藍、玫瑰花瓣的花青素複合體，搭配高單位維生素C，促進膠原蛋白合成，改善氣色。",
    ingredients: ["甜菜根", "紫甘藍", "銀耳", "紅棗", "芭樂", "百香果", "玫瑰花瓣"],
    benefits: ["促進膠原蛋白合成・彈性", "強效抗氧化・減緩老化", "促進鐵質吸收・紅潤氣色"],
    kcal: "75.6",
    protein: "4.1g",
    fat: "3.2g",
    carb: "8.3g",
  },
  {
    id: "cinnamon",
    name: "桂香植萃",
    en: "SPORT FUEL",
    color: "#facc15",
    accent: "#fde68a",
    tag: "運動・增肌",
    target: "健身族・增肌減脂・運動恢復",
    headline: "乾淨能量，全面支援訓練",
    desc: "複合醣類 + 植物蛋白 + 薑黃素的黃金組合，啟動蛋白質節省效應，降低運動發炎，加速恢復。",
    ingredients: ["甜玉米", "豆薯", "黃甜椒", "紅蘿蔔", "百香果", "香蕉", "新鮮薑黃"],
    benefits: ["蛋白質節省效應・幫助增肌", "維生素B6促進胺基酸代謝", "薑黃素降低運動發炎"],
    kcal: "68",
    protein: "3.5g",
    fat: "2.8g",
    carb: "10.5g",
  },
  {
    id: "berry",
    name: "紫莓植萃",
    en: "EYE SHIELD",
    color: "#8b5cf6",
    accent: "#c4b5fd",
    tag: "護眼・抗氧化",
    target: "3C族群・夜間駕駛・視力保健",
    headline: "守護視界，對抗光線氧化",
    desc: "木鱉果、藍莓、桑椹、紫薯的水脂雙溶抗氧化網路，加速視紫質再生，全方位保護眼部細胞。",
    ingredients: ["木鱉果", "紫薯", "紅蘿蔔", "藍莓", "紫色高麗菜", "芭樂", "桑椹"],
    benefits: ["豐富維生素A・維持暗處視覺", "強效花青素・減輕眼部氧化", "高單位維生素C・護眼防禦"],
    kcal: "71.5",
    protein: "3.7g",
    fat: "2.8g",
    carb: "7.9g",
  },
];

const AGE_GROUPS = [
  { label: "青少年", range: "12～16 歲", total: 75, thresholds: [[0,14,"健康綠燈","目前沒有明顯慢性發炎問題"],[15,29,"輕度發炎","建議減少油炸與精緻糖"],[30,49,"中度發炎","建議實施飲食剔除法"],[50,150,"重度發炎","強烈建議尋求醫師協助"]] },
  { label: "青年", range: "20～30 歲", total: 100, thresholds: [[0,15,"健康綠燈","發炎指數極低，繼續保持"],[16,40,"輕度發炎","補充抗氧化蔬果與水溶性纖維"],[41,70,"中度發炎","啟動剔除飲食法，補充Omega-3"],[71,200,"重度發炎","強烈建議尋求醫師協助"]] },
  { label: "輕熟齡", range: "35～45 歲", total: 100, thresholds: [[0,20,"健康綠燈","發炎指數極低，繼續保持"],[21,50,"輕度發炎","補充高抗氧化植化素"],[51,90,"中度發炎","強烈建議剔除飲食法"],[91,200,"重度發炎","多個臟器受到發炎損害"]] },
  { label: "熟齡", range: "50～60 歲", total: 100, thresholds: [[0,24,"健康綠燈","發炎指數控制極低"],[25,59,"輕中度發炎","建議抗發炎飲食"],[60,94,"重度發炎","強烈建議尋求醫師協助"],[95,200,"極度危險","多個臟器嚴重受損"]] },
  { label: "銀髮族", range: "65～75 歲", total: 100, thresholds: [[0,30,"健康綠燈","退化指數控制優異"],[31,70,"輕中度發炎","增加優質蛋白質與Omega-3"],[71,120,"重度發炎","尋求醫師與營養師協助"],[121,200,"極度危險","高度心血管與失智風險"]] },
];

// 從PDF抽取代表性問題（各部分各2題）
const QUIZ_BANK = [
  "常常覺得疲勞，睡醒後仍沒精神？",
  "晚上睡眠品質不好、淺眠或多夢？",
  "注意力不集中，出現「腦霧」感？",
  "經常消化不良、腹脹或便祕？",
  "身體容易保留水分、感覺浮腫？",
  "皮膚暗沉、氣色差，或容易掉髮？",
  "肌肉或關節經常痠痛、僵硬？",
  "長時間使用3C，眼睛容易疲勞？",
  "常感到壓力大、焦慮或情緒起伏？",
  "渴望含糖或澱粉類食物？",
  "容易過敏（起風疹塊、打噴嚏）？",
  "手腳冰冷，即使環境溫暖？",
  "容易外食、攝取炸物或加工食品？",
  "運動後恢復變慢，體力下降？",
  "體重在幾天內劇烈波動超過2公斤？",
  "牙齦容易出血或嘴巴反覆破洞？",
  "傷口癒合速度比以前慢？",
  "一年內感冒三次以上？",
];

function getRecommend(score, total) {
  const ratio = score / total;
  if (ratio >= 0.6) return PRODUCTS[0]; // 雪山 - 重度發炎修復
  if (ratio >= 0.4) return PRODUCTS[1]; // 青檸 - 代謝排毒
  if (ratio >= 0.25) return PRODUCTS[3]; // 桂香 - 能量修復
  return PRODUCTS[2]; // 玫瑰 - 保養
}

// ── Hooks ──────────────────────────────────────────────────────────────────────
function useInView(ref, threshold = 0.15) {
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
function Orb({ color, size = 80, glow = false, style = {} }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: color === "#f8fafc" ? "radial-gradient(circle at 35% 35%, #fff, #e2e8f0)" : color,
      boxShadow: glow ? `0 0 ${size * 0.5}px ${color}66, 0 0 ${size}px ${color}22` : "none",
      flexShrink: 0,
      ...style,
    }} />
  );
}

function OrbitHero() {
  const [angle, setAngle] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setAngle(a => (a + 0.25) % 360), 16);
    return () => clearInterval(id);
  }, []);
  const r = 200;
  return (
    <div style={{ position: "relative", width: 480, height: 480, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {/* Ring */}
      <div style={{ position: "absolute", width: 440, height: 440, borderRadius: "50%", border: "1px solid rgba(255,255,255,.1)", top: 20, left: 20 }} />
      <div style={{ position: "absolute", width: 320, height: 320, borderRadius: "50%", border: "1px solid rgba(214,176,74,.15)", top: 80, left: 80 }} />
      {/* Orbiting orbs */}
      {PRODUCTS.map((p, i) => {
        const deg = ((i * 72) + angle) * (Math.PI / 180);
        return (
          <div key={p.id} style={{
            position: "absolute", width: 64, height: 64, borderRadius: "50%",
            background: p.color === "#f8fafc" ? "#e2e8f0" : p.color,
            boxShadow: `0 0 28px ${p.color}88`,
            transform: `translate(${Math.cos(deg) * r}px, ${Math.sin(deg) * r}px)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 900, color: "#07130d",
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            <span style={{ fontSize: 9, textAlign: "center", lineHeight: 1.2, color: p.color === "#f8fafc" ? "#475569" : "#07130d" }}>
              {p.name.slice(0, 2)}
            </span>
          </div>
        );
      })}
      {/* Center */}
      <div style={{
        width: 180, height: 180, borderRadius: "50%",
        background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.15)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        backdropFilter: "blur(8px)", zIndex: 2,
      }}>
        <div style={{ color: "#d6b04a", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: 2, marginBottom: 6 }}>PLANT × AI</div>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700, letterSpacing: 1 }}>植本邏輯</div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "rgba(248,245,234,.5)", marginTop: 4, letterSpacing: 1 }}>PHYTOLOGIC</div>
      </div>
    </div>
  );
}

function ProductCard({ product, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={() => onClick(product)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 28, padding: "32px 28px", cursor: "pointer",
        background: hovered ? `linear-gradient(135deg, ${product.color}18, ${product.color}08)` : "rgba(255,255,255,.05)",
        border: `1px solid ${hovered ? product.color + "55" : "rgba(255,255,255,.1)"}`,
        transition: "all .3s", transform: hovered ? "translateY(-6px)" : "none",
        boxShadow: hovered ? `0 20px 60px ${product.color}22` : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
        <Orb color={product.color} size={52} glow={hovered} />
        <div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: product.color, letterSpacing: 2, marginBottom: 2 }}>{product.en}</div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700 }}>{product.name}</div>
        </div>
      </div>
      <div style={{ display: "inline-block", padding: "5px 14px", borderRadius: 99, background: `${product.color}22`, color: product.color, fontSize: 12, fontWeight: 700, marginBottom: 14 }}>{product.tag}</div>
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 600, fontStyle: "italic", marginBottom: 10, lineHeight: 1.4 }}>{product.headline}</div>
      <div style={{ fontSize: 14, color: "rgba(248,245,234,.65)", lineHeight: 1.8 }}>{product.desc}</div>
      <div style={{ marginTop: 20, display: "flex", flexWrap: "wrap", gap: 8 }}>
        {product.ingredients.map(ing => (
          <span key={ing} style={{ padding: "3px 10px", borderRadius: 99, border: "1px solid rgba(255,255,255,.15)", fontSize: 12, color: "rgba(248,245,234,.6)" }}>{ing}</span>
        ))}
      </div>
    </div>
  );
}

function ProductModal({ product, onClose }) {
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, backdropFilter: "blur(8px)" }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#0f1f16", border: `1px solid ${product.color}44`, borderRadius: 36, padding: "48px", maxWidth: 680, width: "100%", maxHeight: "85vh", overflowY: "auto",
        boxShadow: `0 40px 120px ${product.color}22`,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <Orb color={product.color} size={72} glow />
            <div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: product.color, letterSpacing: 2, marginBottom: 4 }}>{product.en}</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 38, fontWeight: 700 }}>{product.name}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,.1)", border: "none", color: "white", width: 40, height: 40, borderRadius: "50%", cursor: "pointer", fontSize: 18 }}>✕</button>
        </div>

        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontStyle: "italic", color: product.color, marginBottom: 24, lineHeight: 1.4 }}>「{product.headline}」</div>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: product.color, letterSpacing: 2, fontFamily: "'JetBrains Mono',monospace", marginBottom: 12 }}>CORE BENEFITS</div>
          {product.benefits.map(b => (
            <div key={b} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
              <span style={{ color: product.color, marginTop: 2 }}>✦</span>
              <span style={{ fontSize: 16, lineHeight: 1.6, color: "rgba(248,245,234,.85)" }}>{b}</span>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: product.color, letterSpacing: 2, fontFamily: "'JetBrains Mono',monospace", marginBottom: 12 }}>TARGET GROUPS</div>
          <div style={{ fontSize: 16, color: "rgba(248,245,234,.75)", lineHeight: 1.8 }}>適合：{product.target}</div>
        </div>

        <div style={{ background: "rgba(255,255,255,.05)", borderRadius: 20, padding: 24 }}>
          <div style={{ fontSize: 11, color: product.color, letterSpacing: 2, fontFamily: "'JetBrains Mono',monospace", marginBottom: 16 }}>NUTRITION / 100g</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
            {[["熱量", product.kcal, "kcal"],["蛋白質", product.protein, ""],["脂肪", product.fat, ""],["碳水", product.carb, ""]].map(([label, val, unit]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 700, color: product.color }}>{val}</div>
                <div style={{ fontSize: 11, color: "rgba(248,245,234,.5)", marginTop: 2 }}>{unit || "公克"}</div>
                <div style={{ fontSize: 13, color: "rgba(248,245,234,.7)", marginTop: 4 }}>{label}</div>
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
  const [questions] = useState(() => [...QUIZ_BANK].sort(() => Math.random() - 0.5).slice(0, 10));
  const [current, setCurrent] = useState(0);

  const score = Object.values(answers).reduce((a, b) => a + b, 0);

  function answer(val) {
    const newAnswers = { ...answers, [current]: val };
    setAnswers(newAnswers);
    if (current + 1 >= questions.length) {
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

  const recommend = step === "result" ? getRecommend(score, questions.length * 2) : null;
  const progress = step === "quiz" ? ((current) / questions.length) * 100 : 0;

  // Determine inflammation level
  function getInflammationLevel() {
    const ratio = score / (questions.length * 2);
    if (ratio >= 0.6) return { label: "重度發炎", color: "#ef4444", advice: "建議積極尋求醫師或營養師協助，立即啟動抗發炎飲食計劃。" };
    if (ratio >= 0.4) return { label: "中度發炎", color: "#f97316", advice: "身體多個系統正處於發炎耗損，建議調整飲食並補充 Omega-3 與維生素C。" };
    if (ratio >= 0.2) return { label: "輕度發炎", color: "#eab308", advice: "身體已發出微小警訊，建議減少加工食品，增加植物性抗氧化攝取。" };
    return { label: "健康綠燈", color: "#22c55e", advice: "目前發炎指數低，繼續保持均衡飲食與規律作息。" };
  }

  const level = step === "result" ? getInflammationLevel() : null;

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      {/* Step: select age */}
      {step === "select" && (
        <div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#d6b04a", letterSpacing: 2, marginBottom: 16 }}>STEP 01 · 選擇年齡層</div>
          <div style={{ display: "grid", gap: 10 }}>
            {AGE_GROUPS.map(ag => (
              <button key={ag.label} onClick={() => { setAgeGroup(ag); setStep("quiz"); }}
                style={{
                  padding: "18px 24px", borderRadius: 16, border: "1px solid rgba(255,255,255,.12)",
                  background: ageGroup?.label === ag.label ? "rgba(214,176,74,.15)" : "rgba(255,255,255,.05)",
                  color: "white", cursor: "pointer", textAlign: "left",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  transition: "all .2s",
                }}
              >
                <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 700 }}>{ag.label}</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "rgba(248,245,234,.5)" }}>{ag.range}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step: quiz */}
      {step === "quiz" && (
        <div>
          {/* Progress */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#d6b04a" }}>問題 {current + 1} / {questions.length}</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "rgba(248,245,234,.4)" }}>{ageGroup?.label} · {ageGroup?.range}</span>
            </div>
            <div style={{ height: 3, background: "rgba(255,255,255,.1)", borderRadius: 99 }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #22c55e, #d6b04a)", borderRadius: 99, transition: "width .4s ease" }} />
            </div>
          </div>

          {/* Question */}
          <div style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 24, padding: "32px 28px", marginBottom: 20 }}>
            <div style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 20, fontWeight: 700, lineHeight: 1.7, marginBottom: 28 }}>
              {questions[current]}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[["從不", 0], ["偶爾", 1], ["經常", 2]].map(([label, val]) => (
                <button key={label} onClick={() => answer(val)} style={{
                  padding: "14px", borderRadius: 14, border: "1px solid rgba(255,255,255,.15)",
                  background: "transparent", color: "white", cursor: "pointer", fontSize: 15, fontWeight: 700,
                  fontFamily: "'Noto Serif TC',serif", transition: "all .15s",
                }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step: result */}
      {step === "result" && recommend && level && (
        <div>
          {/* Level badge */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "rgba(248,245,234,.5)", letterSpacing: 2, marginBottom: 12 }}>INFLAMMATION SCORE</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 52, fontWeight: 700, color: level.color }}>{level.label}</div>
            <div style={{ marginTop: 8, fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: "rgba(248,245,234,.5)" }}>得分：{score} / {questions.length * 2}</div>
          </div>

          {/* Advice */}
          <div style={{ background: `${level.color}15`, border: `1px solid ${level.color}40`, borderRadius: 20, padding: 24, marginBottom: 28 }}>
            <div style={{ fontSize: 15, lineHeight: 1.8, color: "rgba(248,245,234,.85)" }}>{level.advice}</div>
          </div>

          {/* Product recommendation */}
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#d6b04a", letterSpacing: 2, marginBottom: 16 }}>AI 推薦方案</div>
          <div style={{ background: `${recommend.color}12`, border: `1px solid ${recommend.color}40`, borderRadius: 24, padding: "28px 24px", marginBottom: 24 }}>
            <div style={{ display: "flex", gap: 18, alignItems: "center", marginBottom: 16 }}>
              <Orb color={recommend.color} size={56} glow />
              <div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: recommend.color, letterSpacing: 2, marginBottom: 4 }}>{recommend.en}</div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 700 }}>{recommend.name}</div>
              </div>
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontStyle: "italic", color: "rgba(248,245,234,.8)", marginBottom: 12 }}>「{recommend.headline}」</div>
            {recommend.benefits.map(b => (
              <div key={b} style={{ display: "flex", gap: 10, marginBottom: 6 }}>
                <span style={{ color: recommend.color }}>✦</span>
                <span style={{ fontSize: 14, color: "rgba(248,245,234,.7)" }}>{b}</span>
              </div>
            ))}
          </div>

          <button onClick={restart} style={{ padding: "16px 32px", borderRadius: 99, border: "1px solid rgba(255,255,255,.2)", background: "transparent", color: "white", cursor: "pointer", fontSize: 15, fontWeight: 700 }}>
            重新測驗
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────────
export default function App() {
  const [activeProduct, setActiveProduct] = useState(null);
  const [navScrolled, setNavScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const h = () => setNavScrolled(window.scrollY > 60);
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
    <div style={{ background: "#07130d", color: "#f8f5ea", fontFamily: "'Noto Serif TC', serif", minHeight: "100vh" }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(40px) } to { opacity:1; transform:translateY(0) } }
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes pulse { 0%,100% { opacity:.6 } 50% { opacity:1 } }
        ::-webkit-scrollbar { width:5px; background:#07130d }
        ::-webkit-scrollbar-thumb { background:#1e3a28; border-radius:99px }
        a { text-decoration:none; transition:opacity .2s }
        a:hover { opacity:.7 }
        button { transition:all .2s }
        button:hover { opacity:.85 }
        button:active { transform:scale(.97) }
      `}</style>

      {/* ── NAV ────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 500,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: navScrolled ? "14px 60px" : "22px 60px",
        background: navScrolled ? "rgba(7,19,13,.95)" : "transparent",
        backdropFilter: navScrolled ? "blur(20px)" : "none",
        borderBottom: navScrolled ? "1px solid rgba(255,255,255,.07)" : "none",
        transition: "all .4s",
      }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            background: "linear-gradient(135deg, #22c55e 0%, #d6b04a 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 700, color: "#07130d",
          }}>植</div>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 16, fontWeight: 700, letterSpacing: 2 }}>PHYTOLOGIC</div>
            <div style={{ fontSize: 10, color: "#d6b04a", letterSpacing: 1 }}>植本邏輯</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 36 }}>
          {[["#story","品牌故事"],["#products","六色植萃"],["#quiz","派森 AI"]].map(([href, label]) => (
            <a key={href} href={href} style={{ color: "#f8f5ea", fontWeight: 700, fontSize: 14, letterSpacing: 0.5 }}>{label}</a>
          ))}
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────── */}
      <section ref={heroRef} style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "center", gap: 40, padding: "120px 72px 80px" }}>
        <div style={{ animation: heroVisible ? "fadeUp .9s ease both" : "none" }}>
          <div style={{
            display: "inline-block", padding: "9px 20px", border: "1px solid rgba(214,176,74,.4)",
            borderRadius: 99, fontFamily: "'JetBrains Mono',monospace", fontSize: 11,
            color: "#d6b04a", letterSpacing: 2, marginBottom: 28,
          }}>
            AI HEALTH SYSTEM · PLANT FUNCTIONAL DRINK
          </div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond',serif", fontSize: 84, lineHeight: 1.04,
            fontWeight: 700, letterSpacing: "-2px", margin: "0 0 28px",
          }}>
            讓每一個人<br />
            活得久，<br />
            <em style={{ color: "#d6b04a", fontStyle: "italic" }}>還要活得精彩。</em>
          </h1>
          <p style={{ fontSize: 18, lineHeight: 2, color: "rgba(248,245,234,.72)", maxWidth: 500, marginBottom: 40 }}>
            植本邏輯結合全植物機能飲與派森 AI 健康系統，
            從生活狀態、代謝壓力與身體反應出發，
            建立每天都能執行的健康修復方式。
          </p>
          <div style={{ display: "flex", gap: 16 }}>
            <a href="#quiz" style={{
              padding: "17px 36px", borderRadius: 99,
              background: "#d6b04a", color: "#07130d",
              fontSize: 16, fontWeight: 900, letterSpacing: 0.5,
            }}>開始 AI 分析 →</a>
            <a href="#products" style={{
              padding: "17px 36px", borderRadius: 99,
              border: "1px solid rgba(255,255,255,.2)", color: "#f8f5ea",
              fontSize: 16, fontWeight: 700,
            }}>探索植萃系列</a>
          </div>
          {/* Stats */}
          <div style={{ display: "flex", gap: 40, marginTop: 56, paddingTop: 40, borderTop: "1px solid rgba(255,255,255,.08)" }}>
            {[["5","款植萃配方"],["100%","全植物萃取"],["Zero","人工添加物"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 700, color: "#d6b04a" }}>{n}</div>
                <div style={{ fontSize: 13, color: "rgba(248,245,234,.5)", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", animation: heroVisible ? "fadeIn 1.2s ease both .3s" : "none" }}>
          <OrbitHero />
        </div>
      </section>

      {/* ── STORY ──────────────────────────────────────── */}
      <section id="story" ref={storyRef} style={{ padding: "120px 72px", maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div style={{ animation: storyVisible ? "fadeUp .8s ease both" : "none" }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#d6b04a", letterSpacing: 2, marginBottom: 20 }}>BRAND STORY · 品牌故事</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 52, fontWeight: 700, lineHeight: 1.2, margin: "0 0 32px" }}>
              50歲成為父親後，<br />我第一次認真思考：
            </h2>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 48, fontStyle: "italic", color: "#d6b04a", marginBottom: 36, lineHeight: 1.3 }}>
              「我還有多久<br />能陪他？」
            </div>
            <p style={{ fontSize: 17, lineHeight: 2, color: "rgba(248,245,234,.72)" }}>
              植本邏輯不是從商業開始，而是從愛開始。我們不是做飲料，而是做每天都會進入身體、長期影響未來十年與二十年的食物。每一瓶都是對健康的承諾，對時間的珍惜。
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, animation: storyVisible ? "fadeUp .8s ease both .2s" : "none" }}>
            {[
              ["🌿", "全植物配方", "五款植萃均以天然食材為原料，零人工添加，進入身體的每一口都安心。"],
              ["🔬", "科學論證", "每款配方均附 SGS 八大營養標示模擬與植化素機能分析，數據說話。"],
              ["🤖", "派森 AI 系統", "根據年齡、生活型態與身體狀態，給出個人化的植萃搭配建議。"],
              ["💚", "長期修復", "不追求速效，從細胞層面啟動修復，建立可持續的健康習慣。"],
            ].map(([icon, title, desc]) => (
              <div key={title} style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 22, padding: "28px 24px" }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 13, lineHeight: 1.7, color: "rgba(248,245,234,.6)" }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ───────────────────────────────────── */}
      <section id="products" ref={productsRef} style={{ padding: "120px 72px", background: "#0b1c12" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64, animation: productsVisible ? "fadeUp .7s ease both" : "none" }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#d6b04a", letterSpacing: 2, marginBottom: 16 }}>FIVE COLOR SYSTEM · 五色植萃</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 52, fontWeight: 700, margin: 0 }}>五色，不只是產品，是五種身體狀態的精準解答。</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, animation: productsVisible ? "fadeUp .8s ease both .15s" : "none" }}>
            {PRODUCTS.slice(0, 3).map(p => <ProductCard key={p.id} product={p} onClick={setActiveProduct} />)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20, animation: productsVisible ? "fadeUp .8s ease both .3s" : "none" }}>
            {PRODUCTS.slice(3).map(p => <ProductCard key={p.id} product={p} onClick={setActiveProduct} />)}
          </div>
          <div style={{ textAlign: "center", marginTop: 32, fontSize: 14, color: "rgba(248,245,234,.4)" }}>點擊任一產品卡片查看完整資訊 →</div>
        </div>
      </section>

      {/* ── INFLAMMATION INFO ──────────────────────────── */}
      <section style={{ padding: "100px 72px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#d6b04a", letterSpacing: 2, marginBottom: 20 }}>CHRONIC INFLAMMATION · 慢性發炎</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 48, fontWeight: 700, lineHeight: 1.2, margin: "0 0 28px" }}>
                沉默的火焰，<br />正在悄悄燃燒你的身體。
              </h2>
              <p style={{ fontSize: 16, lineHeight: 2, color: "rgba(248,245,234,.7)", marginBottom: 32 }}>
                慢性發炎不像急性發炎有明顯的紅腫熱痛，它以疲勞、腦霧、消化不順、皮膚暗沉等方式悄悄表現。長期下來，慢性發炎是大多數現代慢性病的根源。
              </p>
              <div style={{ display: "grid", gap: 12 }}>
                {[
                  ["大腦・神經", "疲勞、腦霧、情緒波動、注意力不集中"],
                  ["消化系統", "腹脹、便祕、腸漏症、消化不良"],
                  ["血糖・代謝", "肥胖、胰島素阻抗、代謝症候群"],
                  ["免疫・皮膚", "過敏、氣色暗沉、慢性皮膚問題"],
                ].map(([sys, sym]) => (
                  <div key={sys} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "16px 20px", background: "rgba(255,255,255,.04)", borderRadius: 16, border: "1px solid rgba(255,255,255,.07)" }}>
                    <span style={{ color: "#d6b04a", fontWeight: 900, flexShrink: 0, marginTop: 2 }}>▸</span>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: 2 }}>{sys}</div>
                      <div style={{ fontSize: 13, color: "rgba(248,245,234,.55)" }}>{sym}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ background: "linear-gradient(135deg, rgba(34,197,94,.1), rgba(214,176,74,.08))", border: "1px solid rgba(34,197,94,.2)", borderRadius: 32, padding: "40px 36px" }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 700, marginBottom: 28, color: "#22c55e" }}>植本邏輯的抗發炎策略</div>
                {[
                  ["Omega-3 脂肪酸", "生核桃提供 ALA，抑制花生四烯酸發炎途徑"],
                  ["花青素複合體", "紫薯、藍莓、桑椹的多酚協同清除自由基"],
                  ["薑黃素 Curcumin", "天然 COX-2 抑制劑，快速緩解急慢性發炎"],
                  ["水溶性膳食纖維", "促進腸道益生菌，產生 SCFA 修復腸道屏障"],
                  ["大豆異黃酮", "雙向調節免疫，降低血脂與慢性發炎指標"],
                ].map(([nutrient, desc], i) => (
                  <div key={nutrient} style={{ display: "flex", gap: 16, marginBottom: 18, alignItems: "flex-start" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(34,197,94,.2)", color: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, flexShrink: 0, fontFamily: "'JetBrains Mono',monospace" }}>{i + 1}</div>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: 3, color: "#22c55e" }}>{nutrient}</div>
                      <div style={{ fontSize: 13, color: "rgba(248,245,234,.6)", lineHeight: 1.6 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUIZ ───────────────────────────────────────── */}
      <section id="quiz" ref={quizRef} style={{ padding: "120px 72px", background: "#0b1c12" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
            <div style={{ animation: quizVisible ? "fadeUp .8s ease both" : "none" }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#d6b04a", letterSpacing: 2, marginBottom: 20 }}>PAISEN AI · 派森健康系統</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 52, fontWeight: 700, lineHeight: 1.2, margin: "0 0 28px" }}>
                派森 AI<br />發炎指數測驗
              </h2>
              <p style={{ fontSize: 16, lineHeight: 2, color: "rgba(248,245,234,.7)", marginBottom: 40 }}>
                根據功能醫學「七大系統炎症指數測驗」客製化設計。依照您的年齡層，選取最符合生理狀態的問題，精準評估體內發炎程度，並給出個人化植萃推薦方案。
              </p>
              <div style={{ display: "grid", gap: 12 }}>
                {[
                  ["📋", "分年齡客製問卷", "從12歲青少年到75歲銀髮族，每個年齡層獨立設計問題"],
                  ["🧠", "七大系統評估", "涵蓋神經、消化、排毒、血糖、內分泌、骨骼、免疫系統"],
                  ["🎯", "精準推薦配方", "根據發炎程度與症狀模式，配對最適合的植萃飲品"],
                ].map(([icon, title, desc]) => (
                  <div key={title} style={{ display: "flex", gap: 16, padding: "16px 20px", background: "rgba(255,255,255,.04)", borderRadius: 16, border: "1px solid rgba(255,255,255,.07)" }}>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>{icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: 2 }}>{title}</div>
                      <div style={{ fontSize: 13, color: "rgba(248,245,234,.55)", lineHeight: 1.6 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quiz Widget */}
            <div style={{
              background: "linear-gradient(135deg, rgba(255,255,255,.09), rgba(255,255,255,.04))",
              border: "1px solid rgba(255,255,255,.12)", borderRadius: 36, padding: "40px 36px",
              animation: quizVisible ? "fadeUp .8s ease both .2s" : "none",
            }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 700, color: "#d6b04a", marginBottom: 4 }}>派森問卷</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "rgba(248,245,234,.4)", marginBottom: 28 }}>PAISEN HEALTH QUESTIONNAIRE</div>
              <QuizSection />
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────── */}
      <footer style={{ padding: "48px 72px", borderTop: "1px solid rgba(255,255,255,.08)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #22c55e, #d6b04a)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond',serif", fontSize: 16, fontWeight: 700, color: "#07130d" }}>植</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 700, letterSpacing: 2 }}>PHYTOLOGIC</div>
            </div>
            <div style={{ fontSize: 13, color: "rgba(248,245,234,.4)" }}>© 2026 植本邏輯 · Plant × AI · Health For All</div>
          </div>
          <div style={{ display: "flex", gap: 32 }}>
            {[["#story","品牌故事"],["#products","植萃系列"],["#quiz","派森 AI"]].map(([href, label]) => (
              <a key={href} href={href} style={{ color: "rgba(248,245,234,.5)", fontSize: 13 }}>{label}</a>
            ))}
          </div>
        </div>
      </footer>

      {/* ── Product Modal ───────────────────────────────── */}
      {activeProduct && <ProductModal product={activeProduct} onClose={() => setActiveProduct(null)} />}
    </div>
  );
}
