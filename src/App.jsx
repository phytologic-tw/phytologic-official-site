export default function App() {
  const colors = [
    { name: "修復白", desc: "日常修復・基礎營養", color: "#f8fafc" },
    { name: "淨化綠", desc: "代謝循環・腸胃清爽", color: "#16a34a" },
    { name: "美顏紅", desc: "氣色光澤・美麗支持", color: "#e11d48" },
    { name: "強健黃", desc: "活力肌力・精神補給", color: "#facc15" },
    { name: "護眼紫", desc: "專注守護・抗氧支持", color: "#7c3aed" },
    { name: "鉑金白", desc: "高階養護・全人平衡", color: "#e5e7eb" },
  ];

  return (
    <div
      style={{
        background: "#f5f1e8",
        minHeight: "100vh",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#14532d",
      }}
    >
      {/* NAV */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "24px 64px",
          background: "rgba(245,241,232,0.88)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(20,83,45,0.08)",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img
            src="/phytologic-logo.png"
            alt="PHYTOLOGIC Logo"
            style={{ width: 58, height: 58, objectFit: "contain" }}
          />
          <div
            style={{
              fontSize: 30,
              fontWeight: 900,
              letterSpacing: "-1px",
            }}
          >
            PHYTOLOGIC｜植本邏輯
          </div>
        </div>

        <div style={{ display: "flex", gap: 36, fontWeight: 800 }}>
          <a href="#story" style={navLink}>品牌故事</a>
          <a href="#colors" style={navLink}>六色系統</a>
          <a href="#paisen" style={navLink}>派森問卷</a>
          <a href="#partner" style={navLink}>加盟合作</a>
        </div>
      </nav>

      {/* HERO */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: 70,
          padding: "96px 72px 90px",
          alignItems: "center",
        }}
      >
        <div>
          <div style={pill}>AI HEALTH SYSTEM ・ PLANT FUNCTIONAL DRINK</div>

          <h1
            style={{
              fontSize: 96,
              lineHeight: 0.95,
              margin: "28px 0 0",
              fontWeight: 950,
              letterSpacing: "-5px",
            }}
          >
            PHYTO
            <span style={{ color: "#c99a22" }}>LOGIC</span>
          </h1>

          <h2
            style={{
              fontSize: 58,
              lineHeight: 1.15,
              margin: "34px 0 28px",
              fontWeight: 900,
            }}
          >
            全植物機能飲 × AI健康系統
          </h2>

          <p style={heroText}>
            以天然蔬菜、穀物、水果與植物營養為核心，結合派森 AI
            健康系統，從生活狀態、身體反應與個人化需求出發，建立每一天都能實踐的健康飲用邏輯。
          </p>

          <div style={{ display: "flex", gap: 22, marginTop: 42 }}>
            <a href="#paisen" style={primaryBtn}>開始派森問卷</a>
            <a href="#colors" style={secondaryBtn}>探索六色系統</a>
          </div>
        </div>

        <div style={heroCard}>
          <div style={glowOne} />
          <div style={glowTwo} />
          <div style={{ fontSize: 72, fontWeight: 950, zIndex: 2 }}>
            植物 × AI
          </div>
          <p
            style={{
              fontSize: 27,
              lineHeight: 1.75,
              textAlign: "center",
              maxWidth: 390,
              color: "rgba(255,255,255,0.9)",
              fontWeight: 700,
              zIndex: 2,
            }}
          >
            讓每一個人活得久，還要活得好精彩。
          </p>
        </div>
      </section>

      {/* STORY */}
      <section id="story" style={section}>
        <div style={sectionLabel}>BRAND STORY</div>
        <h2 style={sectionTitle}>我們不是做飲料，我們做的是每天都能吃進身體的食物。</h2>
        <p style={sectionText}>
          植本邏輯源自一位父親對家人的承諾。從國際品牌專案經理人，到五十歲成為父親，
          健康成為家庭幸福與未來一切的根本。我們希望把天然、乾淨、有效的植物營養，
          轉化成每個人每天都容易實踐的生活方式。
        </p>
      </section>

      {/* COLORS */}
      <section id="colors" style={{ ...section, paddingTop: 40 }}>
        <div style={sectionLabel}>SIX COLOR SYSTEM</div>
        <h2 style={sectionTitle}>六色植物機能系統</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: 18,
            marginTop: 42,
          }}
        >
          {colors.map((item) => (
            <div key={item.name} style={colorCard}>
              <div
                style={{
                  width: 74,
                  height: 74,
                  borderRadius: "50%",
                  background: item.color,
                  marginBottom: 22,
                  boxShadow: "0 18px 40px rgba(0,0,0,0.12)",
                  border: "1px solid rgba(20,83,45,0.08)",
                }}
              />
              <h3 style={{ margin: 0, fontSize: 24 }}>{item.name}</h3>
              <p style={{ margin: "12px 0 0", color: "#4d5f42", lineHeight: 1.6 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* PAISEN */}
      <section id="paisen" style={section}>
        <div style={sectionLabel}>PAISEN AI SYSTEM</div>
        <h2 style={sectionTitle}>派森問卷：用 6 題快速理解今天的你</h2>

        <div style={questionBox}>
          {[
            "最近三天睡眠品質如何？",
            "今天身體是否有疲勞、沉重或水腫感？",
            "最近排便與消化狀態是否順暢？",
            "今天最想改善的是氣色、體力、代謝還是專注？",
            "平常蔬菜、水果、穀物攝取是否足夠？",
            "今天想要清爽、飽足、修復或高機能補給？",
          ].map((q, i) => (
            <div key={q} style={questionItem}>
              <span style={questionNumber}>{i + 1}</span>
              {q}
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 36 }}>
          <button style={primaryBtn}>開始分析</button>
        </div>
      </section>

      {/* PARTNER */}
      <section id="partner" style={partnerSection}>
        <h2 style={{ ...sectionTitle, color: "white" }}>加盟合作</h2>
        <p
          style={{
            fontSize: 24,
            lineHeight: 1.8,
            maxWidth: 900,
            margin: "0 auto",
            color: "rgba(255,255,255,0.86)",
          }}
        >
          植本邏輯提供產品供應、品牌視覺、AI健康系統、會員經營與門市營運模型，
          協助城市合作者建立可複製、可管理、可長期經營的植物機能飲事業。
        </p>

        <a
          href="mailto:bryan@phytologic.tw"
          style={{
            ...secondaryBtn,
            display: "inline-block",
            marginTop: 38,
          }}
        >
          聯絡加盟合作
        </a>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          padding: "34px 64px",
          display: "flex",
          justifyContent: "space-between",
          color: "#4d5f42",
          borderTop: "1px solid rgba(20,83,45,0.08)",
        }}
      >
        <div>© 2026 PHYTOLOGIC 植本邏輯</div>
        <div>bryan@phytologic.tw</div>
      </footer>
    </div>
  );
}

const navLink = {
  color: "#14532d",
  textDecoration: "none",
};

const pill = {
  display: "inline-block",
  padding: "13px 26px",
  borderRadius: 999,
  background: "white",
  color: "#166534",
  fontWeight: 900,
  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
};

const heroText = {
  fontSize: 24,
  lineHeight: 1.85,
  color: "#365314",
  maxWidth: 860,
  fontWeight: 650,
};

const primaryBtn = {
  padding: "20px 42px",
  borderRadius: 999,
  border: "none",
  background: "#166534",
  color: "white",
  fontSize: 20,
  fontWeight: 900,
  textDecoration: "none",
  cursor: "pointer",
  boxShadow: "0 18px 38px rgba(22,101,52,0.28)",
};

const secondaryBtn = {
  padding: "20px 42px",
  borderRadius: 999,
  border: "1px solid rgba(20,83,45,0.08)",
  background: "white",
  color: "#166534",
  fontSize: 20,
  fontWeight: 900,
  textDecoration: "none",
  cursor: "pointer",
};

const heroCard = {
  height: 620,
  borderRadius: 54,
  background:
    "radial-gradient(circle at 60% 70%, rgba(202,138,4,0.32), transparent 30%), linear-gradient(135deg, #14532d, #052e16)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
  boxShadow: "0 35px 90px rgba(0,0,0,0.22)",
  position: "relative",
  overflow: "hidden",
};

const glowOne = {
  position: "absolute",
  width: 280,
  height: 280,
  borderRadius: "50%",
  background: "rgba(255,255,255,0.06)",
  top: -80,
  right: -60,
};

const glowTwo = {
  position: "absolute",
  width: 220,
  height: 220,
  borderRadius: "50%",
  background: "rgba(255,255,255,0.04)",
  bottom: -70,
  left: -50,
};

const section = {
  padding: "86px 72px",
};

const sectionLabel = {
  color: "#c99a22",
  fontWeight: 950,
  letterSpacing: "2px",
  marginBottom: 18,
};

const sectionTitle = {
  fontSize: 48,
  lineHeight: 1.25,
  margin: "0 0 26px",
  fontWeight: 950,
  letterSpacing: "-1px",
};

const sectionText = {
  fontSize: 24,
  lineHeight: 1.9,
  color: "#365314",
  maxWidth: 1000,
  fontWeight: 600,
};

const colorCard = {
  background: "rgba(255,255,255,0.72)",
  border: "1px solid rgba(20,83,45,0.08)",
  borderRadius: 30,
  padding: 28,
  minHeight: 210,
  boxShadow: "0 18px 50px rgba(0,0,0,0.06)",
};

const questionBox = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 18,
  marginTop: 36,
};

const questionItem = {
  background: "white",
  borderRadius: 28,
  padding: "24px 28px",
  fontSize: 22,
  fontWeight: 800,
  color: "#14532d",
  boxShadow: "0 15px 45px rgba(0,0,0,0.05)",
};

const questionNumber = {
  display: "inline-flex",
  width: 34,
  height: 34,
  borderRadius: "50%",
  background: "#166534",
  color: "white",
  alignItems: "center",
  justifyContent: "center",
  marginRight: 14,
  fontSize: 16,
};

const partnerSection = {
  margin: "40px 72px 80px",
  padding: "80px 60px",
  borderRadius: 50,
  textAlign: "center",
  background:
    "linear-gradient(135deg, #14532d, #052e16)",
  color: "white",
};
