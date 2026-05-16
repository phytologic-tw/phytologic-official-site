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
    ["珍珠白", "清楚與清醒", "保持腦袋清楚，才能把愛與經驗完整交給下一代。", "#f8fafc"],
    ["翡翠綠", "代謝與腸胃", "吃得下、吸收得了，才是一切健康修復的起點。", "#22c55e"],
    ["玫瑰紅", "氣色與年輕", "不是害怕老去，而是想用好的狀態陪家人更久。", "#f43f5e"],
    ["金鑽黃", "力量與恢復", "真正的強壯，是家人需要你時，你還有力氣站在前面。", "#facc15"],
    ["水晶紫", "看見世界", "想和家人一起，再多看看這個世界一點。", "#8b5cf6"],
    ["鉑金白", "全人平衡", "健康不是只活得久，而是能陪伴、能擁抱、能大笑。", "#e5e7eb"],
  ];

  const questionBank = [
    "最近是否容易疲勞，睡醒後仍覺得沒有精神？",
    "是否經常睡眠品質不好、淺眠、多夢或晚睡？",
    "是否常感覺注意力不集中、腦袋昏沉或記憶力變差？",
    "最近是否容易腹脹、便祕、腹瀉或消化不順？",
    "是否常覺得身體沉重、水腫、小腹凸出或代謝變慢？",
    "是否經常外食、吃甜食、炸物、加工食品或含糖飲料？",
    "是否長時間使用手機、電腦，眼睛容易乾澀或疲勞？",
    "是否容易肩頸痠痛、腰背緊繃或運動後恢復很慢？",
    "是否經常感覺壓力大、焦慮、煩躁或情緒起伏明顯？",
    "是否容易皮膚暗沉、氣色不好、長痘或覺得老化變快？",
    "是否覺得體力下降、爬樓梯容易喘或肌力不足？",
    "是否常覺得口乾、尿液偏黃、身體不清爽？",
  ];

  const canStart = profile.gender && profile.age && profile.workType;

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
    if (score >= 4) return "今日推薦：翡翠綠 × 水晶紫";
    if (score >= 2) return "今日推薦：珍珠白 × 翡翠綠";
    return "今日推薦：鉑金白 × 玫瑰紅";
  }

  function getProfileNote() {
    const age = Number(profile.age);
    const work = profile.workType;

    if (age >= 50) return "熟齡族群建議優先重視代謝、肌力、睡眠與長期修復。";
    if (work === "久坐辦公") return "久坐辦公型態建議優先關注腸胃代謝、眼睛疲勞與肩頸壓力。";
    if (work === "高壓管理") return "高壓管理型態建議優先關注睡眠修復、壓力調節與慢性發炎。";
    if (work === "體力勞動") return "體力勞動型態建議優先關注肌肉恢復、能量補給與電解質平衡。";
    return "依照你的基本資料，建議從日常代謝、抗氧化與穩定營養補充開始。";
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
          <a style={link} href="#story">品牌故事</a>
          <a style={link} href="#colors">六色系統</a>
          <a style={link} href="#ai">派森 AI</a>
          <a style={link} href="#partner">加盟合作</a>
        </div>
      </nav>

      <section style={hero}>
        <div>
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
                    onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                  >
                    <option value="">請選擇</option>
                    <option value="女性">女性</option>
                    <option value="男性">男性</option>
                    <option value="其他">其他</option>
                  </select>
                </label>

                <label style={field}>
                  年齡
                  <input
                    style={input}
                    type="number"
                    placeholder="例如：42"
                    value={profile.age}
                    onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                  />
                </label>

                <label style={field}>
                  工作類型
                  <select
                    style={input}
                    value={profile.workType}
                    onChange={(e) => setProfile({ ...profile, workType: e.target.value })}
                  >
                    <option value="">請選擇</option>
                    <option value="久坐辦公">久坐辦公</option>
                    <option value="高壓管理">高壓管理</option>
                    <option value="體力勞動">體力勞動</option>
                    <option value="服務業站立">服務業站立</option>
                    <option value="自由工作">自由工作</option>
                    <option value="退休生活">退休生活</option>
                  </select>
                </label>
              </div>

              <button
                style={{
                  ...primary,
                  border: "none",
                  marginTop: 28,
                  opacity: canStart ? 1 : 0.45,
                }}
                disabled={!canStart}
                onClick={startQuiz}
              >
                開始派森問卷
              </button>
            </>
          )}

          {started && !done && (
            <>
              <div style={profileBox}>
                {profile.gender}｜{profile.age} 歲｜{profile.workType}
              </div>

              {selectedQuestions.map((q, i) => (
                <div key={q} style={questionCard}>
                  <div style={{ fontWeight: 900 }}>{i + 1}. {q}</div>
                  <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                    <button style={yesBtn} onClick={() => setScore(score + 1)}>是</button>
                    <button style={noBtn}>否</button>
                  </div>
                </div>
              ))}

              <button style={{ ...primary, border: "none", marginTop: 24 }} onClick={() => setDone(true)}>
                產生 AI 建議
              </button>
            </>
          )}

          {started && done && (
            <>
              <div style={recommend}>{getResult()}</div>
              <p style={text}>
                {getProfileNote()} 派森判斷你今天的身體狀態需要從代謝、抗氧與修復開始調整。
                建議今天減少甜食、炸物與過度加工食品，多補充水分，並選擇適合的植物機能飲作為日常支持。
              </p>

              <button style={{ ...ghost, marginTop: 24 }} onClick={resetQuiz}>
                重新測驗
              </button>
            </>
          )}
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
const tag = { display: "inline-block", padding: "12px 22px", border: "1px solid rgba(214,176,74,.42)", borderRadius: 999, color: "#d6b04a", fontWeight: 950, letterSpacing: 1 };
const h1 = { fontSize: 86, lineHeight: 1.02, margin: "30px 0", letterSpacing: "-5px", fontWeight: 950 };
const lead = { fontSize: 24, lineHeight: 1.85, color: "rgba(248,245,234,.78)", maxWidth: 780, fontWeight: 600 };
const btns = { display: "flex", gap: 18, marginTop: 36 };
const primary = { padding: "19px 38px", borderRadius: 999, background: "#d6b04a", color: "#07130d", textDecoration: "none", fontSize: 19, fontWeight: 950, cursor: "pointer" };
const ghost = { padding: "19px 38px", borderRadius: 999, border: "1px solid rgba(255,255,255,.18)", color: "#f8f5ea", background: "transparent", textDecoration: "none", fontSize: 19, fontWeight: 950, cursor: "pointer" };

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

const aiSection = { padding: "100px 72px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 44, alignItems: "start" };
const dashboard = { borderRadius: 42, padding: 42, background: "linear-gradient(135deg, rgba(255,255,255,.13), rgba(255,255,255,.04))", border: "1px solid rgba(255,255,255,.14)", boxShadow: "0 35px 90px rgba(0,0,0,.25)" };
const dashTitle = { fontSize: 38, fontWeight: 950, color: "#d6b04a" };
const formGrid = { display: "grid", gap: 18, marginTop: 24 };
const field = { display: "grid", gap: 10, fontSize: 18, fontWeight: 900 };
const input = { padding: "16px 18px", borderRadius: 18, border: "1px solid rgba(255,255,255,.16)", background: "rgba(255,255,255,.08)", color: "#f8f5ea", fontSize: 18 };
const profileBox = { padding: 18, borderRadius: 20, background: "rgba(214,176,74,.14)", color: "#d6b04a", fontSize: 19, fontWeight: 900, marginTop: 20 };
const questionCard = { marginTop: 18, padding: 22, borderRadius: 24, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.1)", fontSize: 20, lineHeight: 1.6 };
const yesBtn = { padding: "10px 22px", borderRadius: 999, border: "none", background: "#d6b04a", color: "#07130d", fontWeight: 900, cursor: "pointer" };
const noBtn = { padding: "10px 22px", borderRadius: 999, border: "1px solid rgba(255,255,255,.2)", background: "transparent", color: "white", fontWeight: 900, cursor: "pointer" };
const recommend = { marginTop: 32, padding: 24, borderRadius: 26, background: "rgba(214,176,74,.16)", color: "#f8f5ea", fontSize: 25, fontWeight: 950 };

const standard = { padding: "100px 72px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 };
const standardGrid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 };
const card = { background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 32, padding: 34, fontSize: 22, lineHeight: 1.8 };

const partner = { margin: "40px 72px 70px", padding: "82px 60px", borderRadius: 44, textAlign: "center", background: "linear-gradient(135deg,#14532d,#031008)" };
const whiteBtn = { display: "inline-block", marginTop: 34, padding: "18px 38px", borderRadius: 999, background: "#f8f5ea", color: "#07130d", textDecoration: "none", fontSize: 20, fontWeight: 950 };
const footer = { padding: "34px 64px", color: "rgba(248,245,234,.58)", borderTop: "1px solid rgba(255,255,255,.08)" };
