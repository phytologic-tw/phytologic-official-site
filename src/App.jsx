import { useState } from "react";

export default function App() {
  const [profile, setProfile] = useState({
    gender: "",
    age: "",
    workType: "",
  });

  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  const colors = [
    ["珍珠白", "清楚與清醒", "#f8fafc"],
    ["翡翠綠", "代謝與腸胃", "#22c55e"],
    ["玫瑰紅", "氣色與年輕", "#f43f5e"],
    ["金鑽黃", "力量與恢復", "#facc15"],
    ["水晶紫", "看見世界", "#8b5cf6"],
  ];

  const questionBank = [
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

  function startQuiz() {
    const shuffled = [...questionBank].sort(() => Math.random() - 0.5);
    setSelectedQuestions(shuffled.slice(0, 6));
    setScore(0);
    setDone(false);
    setStarted(true);
  }

  function resetQuiz() {
    setStarted(false);
    setDone(false);
    setScore(0);
    setSelectedQuestions([]);
  }

  function getResult() {
    if (score >= 4) {
      return "今日推薦：翡翠綠 × 水晶紫";
    }

    if (score >= 2) {
      return "今日推薦：珍珠白 × 翡翠綠";
    }

    return "今日推薦：玫瑰紅 × 金鑽黃";
  }

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
          <a style={link} href="#story">
            品牌故事
          </a>

          <a style={link} href="#colors">
            六色系統
          </a>

          <a style={link} href="#ai">
            派森 AI
          </a>
        </div>
      </nav>

      <section style={hero}>
        <div>
          <div style={tag}>
            AI HEALTH SYSTEM・PLANT FUNCTIONAL DRINK
          </div>

          <h1 style={h1}>
            讓每一個人
            <br />
            活得久，
            <br />
            還要活得精彩。
          </h1>

          <p style={lead}>
            植本邏輯結合全植物機能飲與派森 AI 健康系統，
            從生活狀態、代謝壓力與身體反應出發，
            建立每天都能執行的健康修復方式。
          </p>

          <div style={btns}>
            <a href="#ai" style={primary}>
              開始 AI 分析
            </a>

            <a href="#colors" style={ghost}>
              探索六色系統
            </a>
          </div>
        </div>

        <div style={orbit}>
          {colors.map((c, i) => (
            <div
              key={c[0]}
              style={{
                ...orb,
                background: c[2],
                transform: `rotate(${i * 72}deg) translate(220px) rotate(-${
                  i * 72
                }deg)`,
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

        <h2 style={h2}>
          50歲成為父親後，
          <br />
          我第一次認真思考：
        </h2>

        <div style={quote}>「我還有多久能陪他？」</div>

        <p style={text}>
          植本邏輯不是從商業開始，而是從愛開始。
          我們不是做飲料，而是做每天都會進入身體、
          長期影響未來十年與二十年的食物。
        </p>
      </section>

      <section id="colors" style={darkSection}>
        <div style={small}>SIX COLOR SYSTEM</div>

        <h2 style={h2}>六色，不只是產品，是六種人生狀態。</h2>

        <div style={colorList}>
          {colors.map((c) => (
            <div style={colorRow} key={c[0]}>
              <div
                style={{
                  ...dot,
                  background: c[2],
                }}
              />

              <div>
                <div style={colorName}>{c[0]}</div>
                <div style={colorTitle}>{c[1]}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="ai" style={aiSection}>
        <div>
          <div style={small}>PAISEN AI SYSTEM</div>

          <h2 style={h2}>派森 AI 健康系統</h2>

          <p style={text}>
            先建立基本資料，再由派森隨機抽出 6 題健康狀態問題。
            每一次測驗題目都不同，讓推薦更像真正的互動分析。
          </p>
        </div>

        <div style={dashboard}>
          <div style={dashTitle}>派森問卷</div>

          {!started && (
            <>
              <div style={formGrid}>
                <label style={field}>
                  性別
                  <select
                    style={input}
                    value={profile.gender}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        gender: e.target.value,
                      })
                    }
                  >
                    <option value="" disabled>
                      請選擇
                    </option>

                    <option value="男性">男性</option>
                    <option value="女性">女性</option>
                    <option value="其他">其他</option>
                  </select>
                </label>

                <label style={field}>
                  年齡
                  <input
                    style={input}
                    type="number"
                    placeholder="例如：35"
                    value={profile.age}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        age: e.target.value,
                      })
                    }
                  />
                </label>

                <label style={field}>
                  工作類型
                  <select
                    style={input}
                    value={profile.workType}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        workType: e.target.value,
                      })
                    }
                  >
                    <option value="" disabled>
                      請選擇
                    </option>

                    <option value="久坐辦公">久坐辦公</option>
                    <option value="高壓管理">高壓管理</option>
                    <option value="體力勞動">體力勞動</option>
                    <option value="服務業">服務業</option>
                    <option value="自由工作">自由工作</option>
                  </select>
                </label>
              </div>

              <button
                style={{
                  ...primaryButton,
                  marginTop: 30,
                }}
                onClick={startQuiz}
              >
                開始派森問卷
              </button>
            </>
          )}

          {started && !done && (
            <>
              <div style={profileBox}>
                {profile.gender}｜{profile.age} 歲｜
                {profile.workType}
              </div>

              {selectedQuestions.map((q, i) => (
                <div key={q} style={questionCard}>
                  <div style={{ fontWeight: 900 }}>
                    {i + 1}. {q}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      marginTop: 16,
                    }}
                  >
                    <button
                      style={yesBtn}
                      onClick={() => setScore(score + 1)}
                    >
                      是
                    </button>

                    <button style={noBtn}>否</button>
                  </div>
                </div>
              ))}

              <button
                style={{
                  ...primaryButton,
                  marginTop: 24,
                }}
                onClick={() => setDone(true)}
              >
                產生 AI 建議
              </button>
            </>
          )}

          {started && done && (
            <>
              <div style={recommend}>{getResult()}</div>

              <p style={resultText}>
                派森判斷你目前的身體狀態需要從代謝、抗氧、
                睡眠修復與壓力調節開始優化。
              </p>

              <button
                style={{
                  ...ghostButton,
                  marginTop: 24,
                }}
                onClick={resetQuiz}
              >
                重新測驗
              </button>
            </>
          )}
        </div>
      </section>

      <footer style={footer}>
        © 2026 PHYTOLOGIC 植本邏輯
      </footer>
    </main>
  );
}

const page = {
  background: "#07130d",
  color: "#f8f5ea",
  fontFamily:
    "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
};

const nav = {
  position: "sticky",
  top: 0,
  zIndex: 99,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px 64px",
  background: "rgba(7,19,13,.82)",
  backdropFilter: "blur(18px)",
  borderBottom: "1px solid rgba(255,255,255,.08)",
};

const brand = {
  display: "flex",
  gap: 14,
  alignItems: "center",
};

const logo = {
  width: 52,
  height: 52,
  objectFit: "contain",
};

const brandEn = {
  fontSize: 25,
  fontWeight: 950,
};

const brandTw = {
  fontSize: 14,
  color: "#d6b04a",
  fontWeight: 800,
};

const links = {
  display: "flex",
  gap: 30,
};

const link = {
  color: "#f8f5ea",
  textDecoration: "none",
  fontWeight: 800,
};

const hero = {
  minHeight: "calc(100vh - 92px)",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  alignItems: "center",
  gap: 40,
  padding: "70px 72px",
};

const tag = {
  display: "inline-block",
  padding: "12px 22px",
  border: "1px solid rgba(214,176,74,.42)",
  borderRadius: 999,
  color: "#d6b04a",
  fontWeight: 950,
};

const h1 = {
  fontSize: 86,
  lineHeight: 1.02,
  margin: "30px 0",
  letterSpacing: "-5px",
  fontWeight: 950,
};

const lead = {
  fontSize: 24,
  lineHeight: 1.85,
  color: "rgba(248,245,234,.78)",
  maxWidth: 780,
};

const btns = {
  display: "flex",
  gap: 18,
  marginTop: 36,
};

const primary = {
  padding: "19px 38px",
  borderRadius: 999,
  background: "#d6b04a",
  color: "#07130d",
  textDecoration: "none",
  fontSize: 19,
  fontWeight: 950,
};

const ghost = {
  padding: "19px 38px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,.18)",
  color: "#f8f5ea",
  textDecoration: "none",
  fontSize: 19,
  fontWeight: 950,
};

const orbit = {
  position: "relative",
  width: 560,
  height: 560,
  margin: "0 auto",
  borderRadius: "50%",
  border: "1px solid rgba(255,255,255,.1)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const orb = {
  position: "absolute",
  width: 128,
  height: 128,
  borderRadius: "50%",
};

const centerOrb = {
  width: 300,
  height: 300,
  borderRadius: "50%",
  background: "rgba(255,255,255,.06)",
  border: "1px solid rgba(255,255,255,.15)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};

const gold = {
  color: "#d6b04a",
  fontWeight: 950,
};

const centerText = {
  fontSize: 42,
  fontWeight: 950,
};

const section = {
  padding: "100px 72px",
};

const darkSection = {
  padding: "100px 72px",
  background: "#0b1c12",
};

const small = {
  color: "#d6b04a",
  fontWeight: 950,
  marginBottom: 18,
};

const h2 = {
  fontSize: 54,
  lineHeight: 1.22,
  margin: "0 0 24px",
  fontWeight: 950,
};

const quote = {
  fontSize: 56,
  color: "#d6b04a",
  fontWeight: 950,
};

const text = {
  fontSize: 24,
  lineHeight: 1.9,
  color: "rgba(248,245,234,.76)",
  maxWidth: 1050,
};

const colorList = {
  display: "grid",
  gap: 18,
  marginTop: 42,
};

const colorRow = {
  display: "flex",
  alignItems: "center",
  gap: 28,
  padding: "30px 34px",
  borderRadius: 34,
  background: "rgba(255,255,255,.06)",
};

const dot = {
  width: 76,
  height: 76,
  borderRadius: "50%",
};

const colorName = {
  color: "#d6b04a",
  fontWeight: 950,
  fontSize: 20,
};

const colorTitle = {
  fontSize: 34,
  fontWeight: 950,
};

const aiSection = {
  padding: "100px 72px",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 44,
};

const dashboard = {
  borderRadius: 42,
  padding: 42,
  background:
    "linear-gradient(135deg, rgba(255,255,255,.13), rgba(255,255,255,.04))",
  border: "1px solid rgba(255,255,255,.14)",
};

const dashTitle = {
  fontSize: 38,
  fontWeight: 950,
  color: "#d6b04a",
};

const formGrid = {
  display: "grid",
  gap: 18,
  marginTop: 24,
};

const field = {
  display: "grid",
  gap: 10,
  fontSize: 18,
  fontWeight: 900,
};

const input = {
  padding: "16px 18px",
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,.16)",
  background: "#1a2a22",
  color: "white",
  fontSize: 18,
  width: "100%",
  outline: "none",
};

const primaryButton = {
  padding: "18px 34px",
  borderRadius: 999,
  border: "none",
  background: "#d6b04a",
  color: "#07130d",
  fontSize: 18,
  fontWeight: 900,
  cursor: "pointer",
};

const ghostButton = {
  padding: "18px 34px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,.15)",
  background: "transparent",
  color: "white",
  fontSize: 18,
  fontWeight: 900,
  cursor: "pointer",
};

const profileBox = {
  padding: 18,
  borderRadius: 20,
  background: "rgba(214,176,74,.14)",
  color: "#d6b04a",
  fontSize: 19,
  fontWeight: 900,
  marginTop: 20,
};

const questionCard = {
  marginTop: 18,
  padding: 22,
  borderRadius: 24,
  background: "rgba(255,255,255,.08)",
};

const yesBtn = {
  padding: "10px 22px",
  borderRadius: 999,
  border: "none",
  background: "#d6b04a",
  color: "#07130d",
  fontWeight: 900,
  cursor: "pointer",
};

const noBtn = {
  padding: "10px 22px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,.2)",
  background: "transparent",
  color: "white",
  fontWeight: 900,
  cursor: "pointer",
};

const recommend = {
  marginTop: 32,
  padding: 24,
  borderRadius: 26,
  background: "rgba(214,176,74,.16)",
  fontSize: 25,
  fontWeight: 950,
};

const resultText = {
  fontSize: 22,
  lineHeight: 1.8,
  color: "rgba(248,245,234,.76)",
};

const footer = {
  padding: "34px 64px",
  color: "rgba(248,245,234,.58)",
  borderTop: "1px solid rgba(255,255,255,.08)",
};
