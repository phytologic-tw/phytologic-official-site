import { useState, useEffect, useRef } from "react";

// ── Google Fonts ───────────────────────────────────────────────────────────────
const fl = document.createElement("link");
fl.rel = "stylesheet";
fl.href = "https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=JetBrains+Mono:wght@400;700&display=swap";
document.head.appendChild(fl);

// ── Data (對齊品牌 VI 的六色系統) ─────────────────────────────────────────────
const PRODUCTS = [
  {
    id: "pearl",
    name: "珍珠白",
    en: "PEARL WHITE",
    color: "#F2F1EC",
    accent: "#D9D8D2",
    tag: "清晰與傳承",
    headline: "保持清楚和清醒，真正陪他長大",
    desc: "不是只留下財富，而是真正陪他長大。如果腦袋不行了，很多愛就成為負擔了。保持清晰，是為了將一輩子的經驗完整傳承。",
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
    target: "女性保養・膠原蛋白・氣色",
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
    target: "健身族・增肌減脂・運動恢復",
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

// ── Components ─────────────────────────────────────────────────────────────────
function Orb({ color, size = 80, style = {} }) {
  const isLight = color === "#F2F1EC" || color === "#D9D9D6";
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: color,
      boxShadow: isLight ? "inset 0 4px 10px rgba(0,0,0,0.05), 0 10px 30px rgba(0,0,0,0.08)" : `0 10px 30px ${color}33`,
      border: isLight ? "1px solid rgba(0,0,0,0.03)" : "none",
      flexShrink: 0,
      ...style,
    }} />
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
        boxShadow: hovered ? `0 20px 40px rgba(0,0,0,0.04)` : "0 4px 12px rgba(0,0,0,0.02)",
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
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 600, fontStyle: "italic", marginBottom: 12, lineHeight: 1.5, color: "#1A1A1A" }}>{product.headline}</div>
      <div style={{ fontSize: 14, color: "#666666", lineHeight: 1.8 }}>{product.desc}</div>
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

  return (
    <div style={{ background: "#FAFAFA", color: "#2C2C2C", fontFamily: "'Noto Serif TC', serif", minHeight: "100vh" }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(30px) } to { opacity:1; transform:translateY(0) } }
        ::-webkit-scrollbar { width:6px; background:#F0F0F0 }
        ::-webkit-scrollbar-thumb { background:#CCCCCC; border-radius:99px }
        a { text-decoration:none; transition:opacity .2s }
        a:hover { opacity:.6 }
        button { transition:all .2s }
        button:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
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
            {/* 六角形 LOGO 意象 */}
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
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "140px 72px 80px", background: "#FFFFFF", position: "relative", overflow: "hidden" }}>
        {/* 柔霧光線背景裝飾 */}
        <div style={{ position: "absolute", top: "-10%", right: "-5%", width: "60vw", height: "60vw", background: "radial-gradient(circle, rgba(62,107,75,0.03) 0%, rgba(255,255,255,0) 70%)", borderRadius: "50%", zIndex: 0 }} />
        
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 900, animation: "fadeUp 1s ease both" }}>
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
      <section id="story" style={{ padding: "140px 72px", background: "#FAFAFA" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 100, alignItems: "center" }}>
          <div>
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
          
          {/* 三好三無 六角排版 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 24, marginTop: 40 }}>
              {["好喝", "好看", "好吸收"].map((v) => (
                <div key={v} style={{ background: "#FFFFFF", padding: "32px", borderRadius: "20px 0 20px 20px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.02)" }}>
                  <div style={{ fontSize: 12, color: "#3E6B4B", fontWeight: 900, marginBottom: 8 }}>✦ 三好原則</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: "#1A1A1A" }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {["無人工", "無化學", "無合成"].map((v) => (
                <div key={v} style={{ background: "#FFFFFF", padding: "32px", borderRadius: "0 20px 20px 20px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.02)" }}>
                  <div style={{ fontSize: 12, color: "#888", fontWeight: 900, marginBottom: 8 }}>✦ 三無鐵律</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: "#1A1A1A" }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ───────────────────────────────────── */}
      <section id="products" style={{ padding: "140px 72px", background: "#FFFFFF" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#888", letterSpacing: 2, marginBottom: 16 }}>SIX COLOR SYSTEM</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 42, fontWeight: 700, margin: 0, color: "#1A1A1A" }}>每一種顏色，都是人生。</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {PRODUCTS.map(p => <ProductCard key={p.id} product={p} onClick={setActiveProduct} />)}
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
    </div>
  );
}
