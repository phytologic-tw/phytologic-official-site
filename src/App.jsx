export default function App() {
  return (
    <div
      style={{
        background: "#f5f1e8",
        minHeight: "100vh",
        fontFamily: "sans-serif",
        color: "#0f172a",
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "24px 60px",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <img
            src="/phytologic-logo.png"
            alt="PHYTOLOGIC Logo"
            style={{
              width: "56px",
              height: "56px",
              objectFit: "contain",
            }}
          />

          <div
            style={{
              fontSize: "32px",
              fontWeight: "800",
              color: "#14532d",
              letterSpacing: "-1px",
            }}
          >
            PHYTOLOGIC｜植本邏輯
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "40px",
            fontWeight: "600",
            color: "#14532d",
          }}
        >
          <div>品牌故事</div>
          <div>六色系統</div>
          <div>派森問卷</div>
          <div>加盟合作</div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "80px 60px",
          gap: "60px",
        }}
      >
        {/* Left */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "inline-block",
              padding: "12px 24px",
              borderRadius: "999px",
              background: "white",
              color: "#166534",
              fontWeight: "700",
              marginBottom: "30px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            AI HEALTH SYSTEM ・ PLANT FUNCTIONAL DRINK
          </div>

          <h1
            style={{
              fontSize: "92px",
              lineHeight: 1,
              margin: 0,
              fontWeight: "900",
              letterSpacing: "-4px",
              color: "#14532d",
            }}
          >
            PHYTO
            <span style={{ color: "#ca8a04" }}>LOGIC</span>
          </h1>

          <h2
            style={{
              fontSize: "64px",
              lineHeight: 1.2,
              marginTop: "30px",
              marginBottom: "30px",
              color: "#166534",
            }}
          >
            全植物機能飲 × AI健康系統
          </h2>

          <p
            style={{
              fontSize: "24px",
              lineHeight: 1.8,
              color: "#365314",
              maxWidth: "900px",
            }}
          >
            以天然蔬菜、穀物、水果與植物營養為核心，
            結合派森 AI 健康系統，
            從生活狀態、身體反應與個人化需求出發，
            建立每一天都能實踐的健康飲用邏輯。
          </p>

          <div
            style={{
              display: "flex",
              gap: "24px",
              marginTop: "40px",
            }}
          >
            <button
              style={{
                padding: "20px 40px",
                borderRadius: "999px",
                border: "none",
                background: "#166534",
                color: "white",
                fontSize: "20px",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 10px 30px rgba(22,101,52,0.25)",
              }}
            >
              開始派森問卷
            </button>

            <button
              style={{
                padding: "20px 40px",
                borderRadius: "999px",
                border: "none",
                background: "white",
                color: "#166534",
                fontSize: "20px",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
              }}
            >
              探索六色系統
            </button>
          </div>
        </div>

        {/* Right */}
        <div
          style={{
            width: "520px",
            height: "620px",
            borderRadius: "48px",
            background:
              "radial-gradient(circle at center, rgba(202,138,4,0.25), transparent 35%), linear-gradient(135deg, #14532d, #052e16)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            boxShadow: "0 30px 80px rgba(0,0,0,0.2)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "300px",
              height: "300px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "50%",
              top: "-100px",
              right: "-80px",
            }}
          />

          <div
            style={{
              position: "absolute",
              width: "240px",
              height: "240px",
              background: "rgba(255,255,255,0.03)",
              borderRadius: "50%",
              bottom: "-80px",
              left: "-60px",
            }}
          />

          <div
            style={{
              fontSize: "72px",
              fontWeight: "900",
              marginBottom: "30px",
              zIndex: 1,
            }}
          >
            植物 × AI
          </div>

          <div
            style={{
              fontSize: "28px",
              lineHeight: 1.8,
              textAlign: "center",
              maxWidth: "380px",
              color: "rgba(255,255,255,0.9)",
              zIndex: 1,
            }}
          >
            讓每一個人活得久，
            還要活得好精彩。
          </div>
        </div>
      </section>
    </div>
  );
}
