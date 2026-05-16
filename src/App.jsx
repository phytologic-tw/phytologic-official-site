import { useState, useEffect } from "react";

// ── Google Fonts ──────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;700;900&family=DM+Serif+Display:ital@0;1&family=Space+Mono:wght@400;700&display=swap";
document.head.appendChild(fontLink);

// ── Color Data ────────────────────────────────────────────────
const COLORS = [
  { name: "珍珠白", title: "清楚與清醒", hex: "#f8fafc", desc: "提升認知清晰度，幫助睡眠品質" },
  { name: "翡翠綠", title: "代謝與腸胃", hex: "#22c55e", desc: "促進腸道健康，加速代謝循環" },
  { name: "玫瑰紅", title: "氣色與年輕", hex: "#f43f5e", desc: "抗氧化、改善氣色與皮膚光澤" },
  { name: "金鑽黃", title: "力量與恢復", hex: "#facc15", desc: "補充能量，加速運動後修復" },
  { name: "水晶紫", title: "看見世界", hex: "#8b5cf6", desc: "護眼、舒緩壓力與情緒平衡" },
  { name: "海洋藍", title: "深層修復", hex: "#38bdf8", desc: "深層細胞修復，增強免疫防禦" },
];

const QUESTION_BANK = [
  "最近是否容易疲勞，睡醒後仍沒精神？",
  "是否經常睡眠品質不好、淺眠、多夢或晚睡？",
  "是否常感覺注意力不集中、腦袋昏沉？",
  "最近是否容易腹脹、便祕或消化不順？",
  "是否常覺得身體沉重、水腫或代謝變慢？",
  "是否經常外食、吃甜食、炸物或加工食品？",
  "是否長時間使用手機、電腦，眼睛容易疲勞？",
  "是否容易肩頸痠痛或腰背緊繃？",
  "是否經常感覺壓力大、焦慮或情緒起伏明顯？",
  "是否容易皮膚暗沉、氣色不好或覺得老化變快？",
  "是否覺得體力下降、容易喘或恢復變慢？",
  "是否常覺得口乾、身體不清爽？",
];

function getResult(score) {
  if (score >= 4) return { label: "翡翠綠 × 水晶紫", note: "代謝與壓力修復優先方案", hex1: "#22c55e", hex2: "#8b5cf6" };
  if (score >= 2) return { label: "珍珠白 × 翡翠綠", note: "清醒與腸道調節方案", hex1: "#f8fafc", hex2: "#22c55e" };
  return { label: "玫瑰紅 × 金鑽黃", note: "氣色回春與體力恢復方案", hex1: "#f43f5e", hex2: "#facc15" };
}

// ── Orbit Animation ───────────────────────────────────────────
function OrbitRing() {
  const [angle, setAngle] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setAngle((a) => (a + 0.3) % 360), 16);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={orbitWrap}>
      {COLORS.map((c, i) => {
        const deg = (i * 60 + angle) * (Math.PI / 180);
        const r = 200;
        const x = Math.cos(deg) * r;
        const y = Math.sin(deg) * r;
        return (
          <div
            key={c.name}
            title={c.name}
            style={{
              ...orb,
              background: c.hex,
              transform: `translate(${x}px, ${y}px)`,
              boxShadow: `0 0 28px ${c.hex}88`,
            }}
          />
        );
      })}
      <div style={centerOrb}>
        <div style={{ color: "#d6b04a", fontWeight: 900, fontSize: 13, letterSpacing: 2, fontFamily: "'Space Mono', monospace" }}>
          PLANT × AI
        </div>
        <div style={{ fontSize: 28, fontWeight: 900, fontFamily: "'DM Serif Display', serif", marginTop: 4 }}>
          PHYTOLOGIC
        </div>
      </div>
    </div>
  );
}

// ── Quiz Component ────────────────────────────────────────────
function Quiz() {
  const [profile, setProfile] = useState({ gender: "", age: "", workType: "" });
  const [phase, setPhase] = useState("form"); // form | quiz | result
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);

  function startQuiz() {
    if (!profile.gender || !profile.age || !profile.workType) return;
    const shuffled = [...QUESTION_BANK].sort(() => Math.random() - 0.5).slice(0, 6);
    setQuestions(shuffled);
    setScore(0);
    setCurrent(0);
    setPhase("quiz");
  }

  function answer(yes) {
    const newScore = yes ? score + 1 : score;
    if (current + 1 >= questions.length) {
      setScore(newScore);
      setPhase("result");
    } else {
      setScore(newScore);
      setCurrent(current + 1);
    }
  }

  function reset() {
    setProfile({ gender: "", age: "", workType: "" });
    setPhase("form");
    setScore(0);
    setCurrent(0);
  }

  const result = getResult(score);
  const progress = phase === "quiz" ? ((current) / questions.length) * 100 : 100;

  return (
    <div style={dashboard}>
      <div style={dashTitle}>派森問卷</div>

      {/* Progress bar */}
      {phase !== "form" && (
        <div style={progressWrap}>
          <div style={{ ...progressBar, width: `${progress}%` }} />
        </div>
      )}

      {phase === "form" && (
        <>
          <div style={formGrid}>
            {[
              { label: "性別", key: "gender", type: "select", opts: ["男性", "女性", "其他"] },
              { label: "年齡", key: "age", type: "number" },
              { label: "工作類型", key: "workType", type: "select", opts: ["久坐辦公", "高壓管理", "體力勞動", "服務業", "自由工作"] },
            ].map(({ label, key, type, opts }) => (
              <label key={key} style={field}>
                {label}
                {type === "select" ? (
                  <select
                    style={inputStyle}
                    value={profile[key]}
                    onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                  >
                    <option value="" disabled>請選擇</option>
                    {opts.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input
                    style={inputStyle}
                    type="number"
                    placeholder="例如：35"
                    value={profile[key]}
                    onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                  />
                )}
              </label>
            ))}
          </div>
          <button
            style={{ ...primaryButton, marginTop: 30, opacity: (!profile.gender || !profile.age || !profile.workType) ? 0.5 : 1 }}
            onClick={startQuiz}
          >
            開始派森問卷 →
          </button>
        </>
      )}

      {phase === "quiz" && (
        <>
          <div style={profileBox}>
            {profile.gender}｜{profile.age} 歲｜{profile.workType}
          </div>
          <div style={questionCounter}>
            問題 {current + 1} / {questions.length}
          </div>
          <div style={questionCard}>
            <div style={{ fontWeight: 900, fontSize: 19, lineHeight: 1.6, fontFamily: "'Noto Serif TC', serif" }}>
              {questions[current]}
            </div>
            <div style={{ display: "flex", gap: 14, marginTop: 22 }}>
              <button style={yesBtn} onClick={() => answer(true)}>是　✓</button>
              <button style={noBtn} onClick={() => answer(false)}>否　✗</button>
            </div>
          </div>
        </>
      )}

      {phase === "result" && (
        <>
          <div style={recommend}>
            <div style={{ fontSize: 13, letterSpacing: 2, color: "rgba(248,245,234,.6)", marginBottom: 10, fontFamily: "'Space Mono',monospace" }}>
              AI 推薦方案
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
              <span style={{ width: 20, height: 20, borderRadius: "50%", background: result.hex1, display: "inline-block" }} />
              <span style={{ width: 20, height: 20, borderRadius: "50%", background: result.hex2, display: "inline-block" }} />
            </div>
            <div style={{ fontSize: 26, fontWeight: 950, fontFamily: "'Noto Serif TC', serif" }}>{result.label}</div>
            <div style={{ fontSize: 15, color: "#d6b04a", marginTop: 6 }}>{result.note}</div>
          </div>
          <p style={resultText}>
            派森判斷你目前的身體狀態需要從代謝、抗氧、睡眠修復與壓力調節開始優化。建議連續使用 21 天以觀察身體反應。
          </p>
          <button style={{ ...ghostButton, marginTop: 24 }} onClick={reset}>
            重新測驗
          </button>
        </>
      )}
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────
export default function App() {
  const [hoveredColor, setHoveredColor] = useState(null);

  return (
    <main style={page}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(30px) } to { opacity:1; transform:translateY(0) } }
        @keyframes shimmer { 0%,100% { opacity:.7 } 50% { opacity:1 } }
        a:hover { opacity:.75 !important; transition:opacity .2s; }
        button:active { transform:scale(.97); }
        ::-webkit-scrollbar { width:6px; background:#07130d; }
        ::-webkit-scrollbar-thumb { background:#2a3d2e; border-radius:99px; }
        .colorRow:hover { background:rgba(255,255,255,.1) !important; transform:translateX(6px); transition:all .2s; }
      `}</style>

      {/* NAV */}
      <nav style={nav}>
        <div style={brand}>
          <div style={logoCircle}>P</div>
          <div>
            <div style={brandEn}>PHYTOLOGIC</div>
            <div style={brandTw}>植本邏輯</div>
          </div>
        </div>
        <div style={links}>
          {[["#story","品牌故事"],["#colors","六色系統"],["#ai","派森 AI"]].map(([href,label]) => (
            <a key={href} style={link} href={href}>{label}</a>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section style={hero}>
        <div style={{ animation: "fadeUp .9s ease both" }}>
          <div style={tag}>AI HEALTH SYSTEM · PLANT FUNCTIONAL DRINK</div>
          <h1 style={h1}>
            讓每一個人<br />
            活得久，<br />
            <em style={{ fontStyle: "italic", color: "#d6b04a" }}>還要活得精彩。</em>
          </h1>
          <p style={lead}>
            植本邏輯結合全植物機能飲與派森 AI 健康系統，
            從生活狀態、代謝壓力與身體反應出發，
            建立每天都能執行的健康修復方式。
          </p>
          <div style={btns}>
            <a href="#ai" style={primary}>開始 AI 分析</a>
            <a href="#colors" style={ghost}>探索六色系統</a>
          </div>
        </div>
        <OrbitRing />
      </section>

      {/* STORY */}
      <section id="story" style={section}>
        <div style={sectionLabel}>BRAND STORY</div>
        <h2 style={h2}>
          50歲成為父親後，<br />
          我第一次認真思考：
        </h2>
        <div style={quote}>「我還有多久能陪他？」</div>
        <p style={text}>
          植本邏輯不是從商業開始，而是從愛開始。
          我們不是做飲料，而是做每天都會進入身體、
          長期影響未來十年與二十年的食物。
          每一瓶都是對健康的承諾，對時間的珍惜。
        </p>
        <div style={statsRow}>
          {[["6","種色系配方"],["21","天體感週期"],["100%","全植物萃取"]].map(([num, label]) => (
            <div key={label} style={statBox}>
              <div style={statNum}>{num}</div>
              <div style={statLabel}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* COLORS */}
      <section id="colors" style={darkSection}>
        <div style={sectionLabel}>SIX COLOR SYSTEM</div>
        <h2 style={h2}>六色，不只是產品，是六種人生狀態。</h2>
        <div style={colorGrid}>
          {COLORS.map((c) => (
            <div
              key={c.name}
              className="colorRow"
              style={colorRow}
              onMouseEnter={() => setHoveredColor(c.name)}
              onMouseLeave={() => setHoveredColor(null)}
            >
              <div style={{ ...dot, background: c.hex, boxShadow: hoveredColor === c.name ? `0 0 24px ${c.hex}99` : "none" }} />
              <div style={{ flex: 1 }}>
                <div style={colorName}>{c.name}</div>
                <div style={colorTitle}>{c.title}</div>
                <div style={colorDesc}>{c.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI SECTION */}
      <section id="ai" style={aiSection}>
        <div>
          <div style={sectionLabel}>PAISEN AI SYSTEM</div>
          <h2 style={h2}>派森 AI<br />健康系統</h2>
          <p style={text}>
            先建立基本資料，再由派森隨機抽出 6 題健康狀態問題。
            每一次測驗題目都不同，讓推薦更像真正的互動分析。
          </p>
          <div style={featureList}>
            {["逐題互動，非一次填答","每次隨機抽題，結果更精準","根據年齡與工作型態加權分析"].map((f) => (
              <div key={f} style={featureItem}>
                <span style={{ color: "#d6b04a" }}>✦</span> {f}
              </div>
            ))}
          </div>
        </div>
        <Quiz />
      </section>

      {/* FOOTER */}
      <footer style={footer}>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 13 }}>© 2026 PHYTOLOGIC 植本邏輯</div>
        <div style={{ fontSize: 13, color: "rgba(248,245,234,.4)" }}>Plant × AI · Health For All</div>
      </footer>
    </main>
  );
}

// ── Styles ────────────────────────────────────────────────────
const page = {
  background: "#07130d",
  color: "#f8f5ea",
  fontFamily: "'Noto Serif TC', serif",
  minHeight: "100vh",
};

const nav = {
  position: "sticky", top: 0, zIndex: 99,
  display: "flex", justifyContent: "space-between", alignItems: "center",
  padding: "18px 64px",
  background: "rgba(7,19,13,.88)",
  backdropFilter: "blur(20px)",
  borderBottom: "1px solid rgba(255,255,255,.08)",
};

const brand = { display: "flex", gap: 14, alignItems: "center" };
const logoCircle = {
  width: 46, height: 46, borderRadius: "50%",
  background: "linear-gradient(135deg,#22c55e,#d6b04a)",
  display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: 22, fontWeight: 900, color: "#07130d",
  fontFamily: "'DM Serif Display',serif",
};
const brandEn = { fontSize: 22, fontWeight: 900, letterSpacing: 1, fontFamily: "'Space Mono',monospace" };
const brandTw = { fontSize: 12, color: "#d6b04a", fontWeight: 700 };
const links = { display: "flex", gap: 32 };
const link = { color: "#f8f5ea", textDecoration: "none", fontWeight: 700, fontSize: 15, transition: "opacity .2s" };

const hero = {
  minHeight: "calc(100vh - 82px)",
  display: "grid", gridTemplateColumns: "1fr 1fr",
  alignItems: "center", gap: 40, padding: "80px 72px",
};

const tag = {
  display: "inline-block", padding: "10px 22px",
  border: "1px solid rgba(214,176,74,.45)", borderRadius: 999,
  color: "#d6b04a", fontWeight: 700, fontSize: 13,
  letterSpacing: 1.5, fontFamily: "'Space Mono',monospace",
};

const h1 = {
  fontSize: 80, lineHeight: 1.05, margin: "26px 0",
  letterSpacing: "-3px", fontWeight: 900,
  fontFamily: "'DM Serif Display',serif",
};

const lead = {
  fontSize: 20, lineHeight: 1.9,
  color: "rgba(248,245,234,.76)", maxWidth: 520,
};

const btns = { display: "flex", gap: 16, marginTop: 36, flexWrap: "wrap" };

const primary = {
  padding: "17px 36px", borderRadius: 999,
  background: "#d6b04a", color: "#07130d",
  textDecoration: "none", fontSize: 17, fontWeight: 900,
  transition: "opacity .2s",
};

const ghost = {
  padding: "17px 36px", borderRadius: 999,
  border: "1px solid rgba(255,255,255,.22)", color: "#f8f5ea",
  textDecoration: "none", fontSize: 17, fontWeight: 900,
};

const orbitWrap = {
  position: "relative", width: 500, height: 500, margin: "0 auto",
  display: "flex", alignItems: "center", justifyContent: "center",
};

const orb = {
  position: "absolute", width: 80, height: 80, borderRadius: "50%",
  transition: "box-shadow .3s",
};

const centerOrb = {
  width: 200, height: 200, borderRadius: "50%",
  background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.15)",
  display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
  zIndex: 2,
};

const section = { padding: "100px 72px" };

const darkSection = { padding: "100px 72px", background: "#0b1c12" };

const sectionLabel = {
  color: "#d6b04a", fontWeight: 700, marginBottom: 18, fontSize: 13,
  letterSpacing: 2, fontFamily: "'Space Mono',monospace",
};

const h2 = {
  fontSize: 50, lineHeight: 1.24, margin: "0 0 28px",
  fontWeight: 900, fontFamily: "'DM Serif Display',serif",
};

const quote = {
  fontSize: 48, color: "#d6b04a", fontWeight: 900,
  fontFamily: "'DM Serif Display',serif", fontStyle: "italic",
  margin: "0 0 32px",
};

const text = {
  fontSize: 20, lineHeight: 1.95,
  color: "rgba(248,245,234,.76)", maxWidth: 680,
};

const statsRow = { display: "flex", gap: 40, marginTop: 56 };
const statBox = { borderLeft: "2px solid #d6b04a", paddingLeft: 22 };
const statNum = { fontSize: 48, fontWeight: 900, color: "#d6b04a", fontFamily: "'DM Serif Display',serif" };
const statLabel = { fontSize: 14, color: "rgba(248,245,234,.6)", marginTop: 4 };

const colorGrid = { display: "grid", gap: 14, marginTop: 42 };
const colorRow = {
  display: "flex", alignItems: "center", gap: 28,
  padding: "26px 32px", borderRadius: 28,
  background: "rgba(255,255,255,.05)", cursor: "default",
  transition: "all .2s",
};
const dot = { width: 66, height: 66, borderRadius: "50%", flexShrink: 0, transition: "box-shadow .3s" };
const colorName = { color: "#d6b04a", fontWeight: 700, fontSize: 14, letterSpacing: 1, fontFamily: "'Space Mono',monospace" };
const colorTitle = { fontSize: 28, fontWeight: 900, fontFamily: "'DM Serif Display',serif", margin: "4px 0" };
const colorDesc = { fontSize: 14, color: "rgba(248,245,234,.55)", lineHeight: 1.6 };

const aiSection = {
  padding: "100px 72px",
  display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start",
};

const featureList = { marginTop: 32, display: "grid", gap: 12 };
const featureItem = { fontSize: 16, color: "rgba(248,245,234,.75)", lineHeight: 1.6 };

const dashboard = {
  borderRadius: 36, padding: "40px 38px",
  background: "linear-gradient(135deg,rgba(255,255,255,.11),rgba(255,255,255,.04))",
  border: "1px solid rgba(255,255,255,.12)",
};

const dashTitle = {
  fontSize: 32, fontWeight: 900, color: "#d6b04a",
  fontFamily: "'DM Serif Display',serif", marginBottom: 8,
};

const progressWrap = {
  height: 4, background: "rgba(255,255,255,.1)", borderRadius: 99,
  marginTop: 16, overflow: "hidden",
};

const progressBar = {
  height: "100%", background: "linear-gradient(90deg,#22c55e,#d6b04a)",
  borderRadius: 99, transition: "width .4s ease",
};

const formGrid = { display: "grid", gap: 16, marginTop: 24 };
const field = { display: "grid", gap: 8, fontSize: 15, fontWeight: 700 };
const inputStyle = {
  padding: "14px 16px", borderRadius: 16,
  border: "1px solid rgba(255,255,255,.14)",
  background: "#1a2a22", color: "white", fontSize: 16, outline: "none",
};

const primaryButton = {
  padding: "16px 30px", borderRadius: 999, border: "none",
  background: "#d6b04a", color: "#07130d", fontSize: 16, fontWeight: 900, cursor: "pointer",
};

const ghostButton = {
  padding: "16px 30px", borderRadius: 999,
  border: "1px solid rgba(255,255,255,.18)",
  background: "transparent", color: "white", fontSize: 16, fontWeight: 900, cursor: "pointer",
};

const profileBox = {
  padding: 16, borderRadius: 16,
  background: "rgba(214,176,74,.13)", color: "#d6b04a",
  fontSize: 16, fontWeight: 700, marginTop: 18,
  fontFamily: "'Space Mono',monospace",
};

const questionCounter = {
  marginTop: 20, marginBottom: 4, fontSize: 13,
  color: "rgba(248,245,234,.45)", fontFamily: "'Space Mono',monospace",
};

const questionCard = {
  marginTop: 8, padding: 24, borderRadius: 22,
  background: "rgba(255,255,255,.07)",
  border: "1px solid rgba(255,255,255,.08)",
};

const yesBtn = {
  padding: "11px 28px", borderRadius: 999, border: "none",
  background: "#d6b04a", color: "#07130d", fontWeight: 900, cursor: "pointer", fontSize: 15,
};

const noBtn = {
  padding: "11px 28px", borderRadius: 999,
  border: "1px solid rgba(255,255,255,.22)",
  background: "transparent", color: "white", fontWeight: 900, cursor: "pointer", fontSize: 15,
};

const recommend = {
  marginTop: 28, padding: 28, borderRadius: 24,
  background: "rgba(214,176,74,.13)", border: "1px solid rgba(214,176,74,.25)",
};

const resultText = {
  fontSize: 16, lineHeight: 1.85, color: "rgba(248,245,234,.7)", marginTop: 16,
};

const footer = {
  padding: "32px 64px", color: "rgba(248,245,234,.5)",
  borderTop: "1px solid rgba(255,255,255,.08)",
  display: "flex", justifyContent: "space-between", alignItems: "center",
};
