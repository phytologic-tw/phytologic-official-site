export default function App() {
  const colors = [
    ["珍珠白", "清楚與清醒", "保持腦袋清楚，才能把愛與經驗完整交給下一代。", "#f8fafc"],
    ["翡翠綠", "代謝與腸胃", "吃得下、吸收得了，才是一切健康修復的起點。", "#22c55e"],
    ["玫瑰紅", "氣色與年輕", "不是害怕老去，而是想用好的狀態陪家人更久。", "#f43f5e"],
    ["金鑽黃", "力量與恢復", "真正的強壯，是家人需要你時，你還有力氣站在前面。", "#facc15"],
    ["水晶紫", "看見世界", "想和家人一起，再多看看這個世界一點。", "#8b5cf6"],
    ["鉑金白", "全人平衡", "健康不是只活得久，而是能陪伴、能擁抱、能大笑。", "#e5e7eb"],
  ];

  return (
    <main style={page}>
      <nav style={nav}>
        <div style={brand}>
          <img src="/phytologic-logo.png" style={logo} />
          <div>
            <div style={brandEn}>PHYTOLOGIC</div>
            <div style={brandTw}>植本邏輯</div>
          </div>
        </div>
        <div style={links}>
          <a style={link} href="#story">品牌故事</a>
          <a style={link} href="#colors">六色系統</a>
          <a style={link} href="#ai">派森 AI</a>
          <a style={link} href="#partner">加盟合作</a>
        </div>
      </nav>

      <section style={hero}>
        <div style={left}>
          <div style={tag}>AI HEALTH SYSTEM・PLANT FUNCTIONAL DRINK</div>
          <h1 style={h1}>讓每一個人<br />活得久，<br />還要活得精彩。</h1>
          <p style={lead}>
            植本邏輯結合全植物機能飲與派森 AI 健康系統，
            從生活狀態、代謝壓力與身體反應出發，建立每天都能執行的健康修復方式。
          </p>
          <div style={btns}>
            <a href="#ai" style={primary}>開始 AI 分析</a>
            <a href="#colors" style={ghost}>探索六色系統</a>
          </div>
        </div>

        <div style={orbit}>
          {colors.slice(1, 5).map((c, i) => (
            <div
              key={c[0]}
              style={{
                ...orb,
                background: c[3],
                transform: `rotate(${i * 90}deg) translate(220px) rotate(-${i * 90}deg)`,
              }}
            />
          ))}
          <div style={centerOrb}>
            <div style={gold}>PLANT × AI</div>
            <div style={centerText}>PHYTOLOGIC</div>
          </div>
        </div>
      </section>

      <section id="story" style={section}>
        <div style={small}>BRAND STORY</div>
        <h2 style={h2}>50歲成為父親後，<br />我第一次認真思考：</h2>
        <div style={quote}>「我還有多久能陪他？」</div>
        <p style={text}>
          植本邏輯不是從商業開始，而是從愛開始。我們不是做飲料，
          我們做的是每天會進入身體、長期被吸收、影響未來十年與二十年的食物。
        </p>
      </section>

      <section id="colors" style={darkSection}>
        <div style={small}>SIX COLOR SYSTEM</div>
        <h2 style={h2}>六色，不只是產品，是六種人生狀態。</h2>
        <div style={colorList}>
          {colors.map((c) => (
            <div style={colorRow} key={c[0]}>
              <div style={{ ...dot, background: c[3] }} />
              <div style={{ flex: 1 }}>
                <div style={colorName}>{c[0]}</div>
                <div style={colorTitle}>{c[1]}</div>
              </div>
              <p style={colorText}>{c[2]}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="ai" style={aiSection}>
        <div>
          <div style={small}>PAISEN AI SYSTEM</div>
          <h2 style={h2}>派森 AI 健康系統</h2>
          <p style={text}>
            用 6 題快速理解今天的身體狀態，從疲勞、腸胃、代謝、壓力與氧化反應，
            推薦最適合你的植物機能飲與生活建議。
          </p>
        </div>

        <div style={dashboard}>
          <div style={dashTitle}>AI ANALYSIS</div>
          {[
            ["發炎傾向", "68%"],
            ["腸胃代謝", "54%"],
            ["氧化壓力", "76%"],
          ].map(([name, value]) => (
            <div key={name} style={{ marginTop: 24 }}>
              <div style={dashRow}><span>{name}</span><b>{value}</b></div>
              <div style={bar}><div style={{ ...barIn, width: value }} /></div>
            </div>
          ))}
          <div style={recommend}>今日推薦：翡翠綠 × 水晶紫</div>
        </div>
      </section>

      <section style={standard}>
        <div>
          <div style={small}>OUR STANDARD</div>
          <h2 style={h2}>三好、三無，是我們給家人的標準。</h2>
        </div>
        <div style={standardGrid}>
          <div style={card}><h3>三好原則</h3><p>好喝、好看、好吸收。健康要能融入生活，才可能長期持續。</p></div>
          <div style={card}><h3>三無鐵律</h3><p>無人工、無化學、無合成。真正重要的人，值得最乾淨的選擇。</p></div>
        </div>
      </section>

      <section id="partner" style={partner}>
        <h2 style={{ ...h2, color: "white" }}>加盟合作</h2>
        <p style={{ ...text, margin: "0 auto", maxWidth: 860 }}>
          植本邏輯提供產品供應、品牌視覺、AI健康系統、會員經營與門市營運模型。
        </p>
        <a href="mailto:bryan@phytologic.tw" style={whiteBtn}>聯絡加盟合作</a>
      </section>

      <footer style={footer}>© 2026 PHYTOLOGIC 植本邏輯｜bryan@phytologic.tw</footer>
    </main>
  );
}

const page = { background: "#07130d", color: "#f8f5ea", fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" };
const nav = { position: "sticky", top: 0, zIndex: 99, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 64px", background: "rgba(7,19,13,.82)", backdropFilter: "blur(18px)", borderBottom: "1px solid rgba(255,255,255,.08)" };
const brand = { display: "flex", gap: 14, alignItems: "center" };
const logo = { width: 52, height: 52, objectFit: "contain" };
const brandEn = { fontSize: 25, fontWeight: 950 };
const brandTw = { fontSize: 14, color: "#d6b04a", fontWeight: 800 };
const links = { display: "flex", gap: 30 };
const link = { color: "#f8f5ea", textDecoration: "none", fontWeight: 800 };

const hero = { minHeight: "calc(100vh - 92px)", display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "center", gap: 40, padding: "70px 72px", background: "radial-gradient(circle at 20% 20%, rgba(34,197,94,.18), transparent 30%), radial-gradient(circle at 80% 70%, rgba(250,204,21,.16), transparent 30%)" };
const left = {};
const tag = { display: "inline-block", padding: "12px 22px", border: "1px solid rgba(214,176,74,.42)", borderRadius: 999, color: "#d6b04a", fontWeight: 950, letterSpacing: 1 };
const h1 = { fontSize: 86, lineHeight: 1.02, margin: "30px 0", letterSpacing: "-5px", fontWeight: 950 };
const lead = { fontSize: 24, lineHeight: 1.85, color: "rgba(248,245,234,.78)", maxWidth: 780, fontWeight: 600 };
const btns = { display: "flex", gap: 18, marginTop: 36 };
const primary = { padding: "19px 38px", borderRadius: 999, background: "#d6b04a", color: "#07130d", textDecoration: "none", fontSize: 19, fontWeight: 950 };
const ghost = { padding: "19px 38px", borderRadius: 999, border: "1px solid rgba(255,255,255,.18)", color: "#f8f5ea", textDecoration: "none", fontSize: 19, fontWeight: 950 };

const orbit = { position: "relative", width: 560, height: 560, margin: "0 auto", borderRadius: "50%", border: "1px solid rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center" };
const orb = { position: "absolute", width: 128, height: 128, borderRadius: "50%", boxShadow: "0 25px 60px rgba(0,0,0,.35)" };
const centerOrb = { width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.15)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" };
const gold = { color: "#d6b04a", fontWeight: 950, marginBottom: 10 };
const centerText = { fontSize: 42, fontWeight: 950 };

const section = { padding: "100px 72px" };
const darkSection = { padding: "100px 72px", background: "#0b1c12" };
const small = { color: "#d6b04a", fontWeight: 950, letterSpacing: 2, marginBottom: 18 };
const h2 = { fontSize: 54, lineHeight: 1.22, margin: "0 0 24px", fontWeight: 950, letterSpacing: "-2px" };
const quote = { fontSize: 56, color: "#d6b04a", fontWeight: 950, margin: "28px 0" };
const text = { fontSize: 24, lineHeight: 1.9, color: "rgba(248,245,234,.76)", maxWidth: 1050 };

const colorList = { display: "grid", gap: 18, marginTop: 42 };
const colorRow = { display: "flex", alignItems: "center", gap: 28, padding: "30px 34px", borderRadius: 34, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.08)" };
const dot = { width: 76, height: 76, borderRadius: "50%", flexShrink: 0 };
const colorName = { color: "#d6b04a", fontWeight: 950, fontSize: 20 };
const colorTitle = { fontSize: 34, fontWeight: 950, marginTop: 4 };
const colorText = { width: "48%", fontSize: 21, lineHeight: 1.7, color: "rgba(248,245,234,.72)" };

const aiSection = { padding: "100px 72px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 44, alignItems: "center" };
const dashboard = { borderRadius: 42, padding: 42, background: "linear-gradient(135deg, rgba(255,255,255,.13), rgba(255,255,255,.04))", border: "1px solid rgba(255,255,255,.14)", boxShadow: "0 35px 90px rgba(0,0,0,.25)" };
const dashTitle = { fontSize: 38, fontWeight: 950, color: "#d6b04a" };
const dashRow = { display: "flex", justifyContent: "space-between", fontSize: 22, fontWeight: 850 };
const bar = { height: 12, background: "rgba(255,255,255,.12)", borderRadius: 999, marginTop: 10 };
const barIn = { height: "100%", background: "#d6b04a", borderRadius: 999 };
const recommend = { marginTop: 32, padding: 24, borderRadius: 26, background: "rgba(214,176,74,.16)", color: "#f8f5ea", fontSize: 25, fontWeight: 950 };

const standard = { padding: "100px 72px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 };
const standardGrid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 };
const card = { background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 32, padding: 34, fontSize: 22, lineHeight: 1.8 };

const partner = { margin: "40px 72px 70px", padding: "82px 60px", borderRadius: 44, textAlign: "center", background: "linear-gradient(135deg,#14532d,#031008)" };
const whiteBtn = { display: "inline-block", marginTop: 34, padding: "18px 38px", borderRadius: 999, background: "#f8f5ea", color: "#07130d", textDecoration: "none", fontSize: 20, fontWeight: 950 };
const footer = { padding: "34px 64px", color: "rgba(248,245,234,.58)", borderTop: "1px solid rgba(255,255,255,.08)" };
