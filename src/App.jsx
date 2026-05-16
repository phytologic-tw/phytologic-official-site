export default function App() {
  return (
    <div style={page}>
      <section style={hero}>
        <div style={glow1}></div>
        <div style={glow2}></div>

        <div style={left}>
          <div style={tag}>
            AI HEALTH SYSTEM ・ PLANT FUNCTIONAL DRINK
          </div>

          <h1 style={title}>
            讓每一個人
            <br />
            活得久，
            <br />
            還要活得精彩。
          </h1>

          <p style={desc}>
            植本邏輯結合全植物機能飲與派森 AI 健康系統，
            從現代人的生活狀態、代謝壓力與身體反應出發，
            建立真正能每天執行的健康修復方式。
          </p>

          <div style={actions}>
            <button style={primaryBtn}>開始 AI 分析</button>
            <button style={secondaryBtn}>探索六色系統</button>
          </div>
        </div>

        <div style={right}>
          <div style={circleWrap}>
            <div style={{ ...orb, background: "#22c55e", top: 0 }} />
            <div style={{ ...orb, background: "#facc15", right: 0 }} />
            <div style={{ ...orb, background: "#f43f5e", bottom: 0 }} />
            <div style={{ ...orb, background: "#8b5cf6", left: 0 }} />

            <div style={center}>
              <div style={centerSmall}>PLANT × AI</div>
              <div style={centerBig}>PHYTOLOGIC</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const page = {
  minHeight: "100vh",
  background: "#07130d",
  color: "white",
  overflow: "hidden",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

const hero = {
  minHeight: "100vh",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  alignItems: "center",
  padding: "0 80px",
  position: "relative",
};

const glow1 = {
  position: "absolute",
  width: 500,
  height: 500,
  borderRadius: "50%",
  background: "rgba(34,197,94,.15)",
  filter: "blur(80px)",
  top: -120,
  left: -120,
};

const glow2 = {
  position: "absolute",
  width: 500,
  height: 500,
  borderRadius: "50%",
  background: "rgba(250,204,21,.12)",
  filter: "blur(80px)",
  bottom: -120,
  right: -120,
};

const left = {
  position: "relative",
  zIndex: 2,
};

const tag = {
  display: "inline-block",
  padding: "12px 20px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,.15)",
  color: "#d6b04a",
  fontWeight: 900,
  letterSpacing: 1,
  marginBottom: 24,
};

const title = {
  fontSize: "88px",
  lineHeight: 1,
  fontWeight: 950,
  letterSpacing: "-4px",
  margin: 0,
};

const desc = {
  marginTop: 30,
  fontSize: 24,
  lineHeight: 1.8,
  color: "rgba(255,255,255,.72)",
  maxWidth: 760,
};

const actions = {
  display: "flex",
  gap: 18,
  marginTop: 40,
};

const primaryBtn = {
  padding: "18px 34px",
  borderRadius: 999,
  border: "none",
  background: "#d6b04a",
  color: "#07130d",
  fontSize: 18,
  fontWeight: 900,
  cursor: "pointer",
};

const secondaryBtn = {
  padding: "18px 34px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,.15)",
  background: "transparent",
  color: "white",
  fontSize: 18,
  fontWeight: 900,
  cursor: "pointer",
};

const right = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const circleWrap = {
  width: 520,
  height: 520,
  borderRadius: "50%",
  position: "relative",
  border: "1px solid rgba(255,255,255,.08)",
};

const orb = {
  position: "absolute",
  width: 140,
  height: 140,
  borderRadius: "50%",
  boxShadow: "0 20px 60px rgba(0,0,0,.35)",
};

const center = {
  position: "absolute",
  inset: 0,
  margin: "auto",
  width: 280,
  height: 280,
  borderRadius: "50%",
  background: "rgba(255,255,255,.05)",
  border: "1px solid rgba(255,255,255,.1)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backdropFilter: "blur(20px)",
};

const centerSmall = {
  color: "#d6b04a",
  fontWeight: 900,
  marginBottom: 10,
};

const centerBig = {
  fontSize: 40,
  fontWeight: 950,
};
