export default function App() {
  const colors = [
    {
      name: "珍珠白",
      title: "保持清楚與清醒",
      line: "我希望有一天，還能把這一輩子學到的東西，完整交給孩子。",
      desc: "基礎修復、日常營養、清醒專注。",
      color: "#f8fafc",
    },
    {
      name: "翡翠綠",
      title: "吃得下，才能活得好",
      line: "腸胃好，代謝才會好，這是一切修復真正的起點。",
      desc: "代謝循環、腸胃清爽、體內環保。",
      color: "#16a34a",
    },
    {
      name: "玫瑰紅",
      title: "氣色與年輕感",
      line: "不是害怕老去，而是希望自己還能保有好的狀態，陪家人更久一點。",
      desc: "氣色光澤、膠原支持、抗氧保養。",
      color: "#e11d48",
    },
    {
      name: "金鑽黃",
      title: "力量與恢復",
      line: "真正的強壯，是當家人需要你的時候，你還有力氣站在前面。",
      desc: "活力肌力、運動修復、能量補給。",
      color: "#facc15",
    },
    {
      name: "水晶紫",
      title: "看見世界",
      line: "我想和家人一起，再多看看這世界一點。",
      desc: "護眼抗氧、3C修復、視覺守護。",
      color: "#7c3aed",
    },
    {
      name: "鉑金白",
      title: "全人平衡",
      line: "健康不是活得久而已，而是能陪伴、能擁抱、能行走、能大笑。",
      desc: "高階養護、全人平衡、長期修復。",
      color: "#e5e7eb",
    },
  ];

  const fatigue = ["熬夜", "外食", "高壓", "久坐", "螢幕", "慢性發炎"];

  const questions = [
    "最近三天睡醒後，是否仍覺得疲勞？",
    "最近是否容易腹脹、便祕或消化不順？",
    "今天是否有水腫、沉重或代謝變慢的感覺？",
    "是否長時間使用手機、電腦或眼睛容易疲勞？",
    "最近是否常吃甜食、炸物、加工食品或外食？",
    "今天最想改善的是代謝、氣色、體力、專注還是修復？",
  ];

  return (
    <div style={page}>
      <nav style={nav}>
        <div style={brand}>
          <img src="/phytologic-logo.png" alt="PHYTOLOGIC Logo" style={logo} />
          <div>
            <div style={brandName}>PHYTOLOGIC</div>
            <div style={brandSub}>植本邏輯</div>
          </div>
        </div>

        <div style={navLinks}>
          <a href="#story" style={navLink}>品牌故事</a>
          <a href="#colors" style={navLink}>六色系統</a>
          <a href="#paisen" style={navLink}>派森 AI</a>
          <a href="#partner" style={navLink}>加盟合作</a>
        </div>
      </nav>

      <section style={hero}>
        <div style={heroGlowA} />
        <div style={heroGlowB} />
        <div style={heroGlowC} />

        <div style={heroContent}>
          <div style={pill}>PLANT FUNCTIONAL DRINK × AI HEALTH SYSTEM</div>

          <h1 style={heroTitle}>
            讓每一個人
            <br />
            活得久，
            <br />
            還要活得精彩。
          </h1>

          <p style={heroText}>
            植本邏輯不是在販售飲料，而是用天然植物、營養邏輯與 AI 健康系統，
            建立每個人每天都能實踐的身體修復方式。
          </p>

          <div style={heroActions}>
            <a href="#paisen" style={primaryBtn}>開始派森 AI 分析</a>
            <a href="#colors" style={secondaryBtn}>探索六色植萃</a>
          </div>

          <div style={belief}>重視生命｜尊重自然｜相信邏輯</div>
        </div>

        <div style={heroPanel}>
          <div style={panelTitle}>PAISEN</div>
          <div style={panelSub}>AI HEALTH SYSTEM</div>
          <div style={scanBox}>
            <div style={scanLine} />
            <div style={scanItem}>慢性發炎傾向</div>
            <div style={scanItem}>腸胃代謝狀態</div>
            <div style={scanItem}>氧化壓力反應</div>
            <div style={scanItem}>植物機能推薦</div>
          </div>
        </div>
      </section>

      <section style={fatigueSection}>
        <h2 style={darkTitle}>
          我們的文明進步了，
          <br />
          但身體卻越來越疲憊。
        </h2>
        <p style={darkText}>
          現代人每天面對高壓、螢幕、外食與失衡作息。很多人不是突然失去健康，
          而是慢慢失去身體原本該有的力量。
        </p>

        <div style={fatigueGrid}>
          {fatigue.map((item) => (
            <div key={item} style={fatigueCard}>{item}</div>
          ))}
        </div>
      </section>

      <section id="story" style={storySection}>
        <div style={sectionLabel}>BRAND STORY</div>
        <h2 style={sectionTitle}>
          50歲成為父親後，
          <br />
          我第一次開始認真思考：
        </h2>
        <div style={quote}>「我還有多久能陪他？」</div>
        <p style={sectionText}>
          這不是一個從商業開始的品牌，而是一位父親、一位丈夫、六個家庭，
          重新理解健康之後的答案。我們不是做飲料，我們做的是每天會進入身體、
          長期被吸收、影響未來十年與二十年的食物。
        </p>
      </section>

      <section id="colors" style={section}>
        <div style={sectionLabel}>SIX COLOR SYSTEM</div>
        <h2 style={sectionTitle}>六色植物機能系統</h2>
        <p style={sectionText}>
          每一種顏色，不只是產品分類，而是一種人生狀態。植本邏輯用六色植萃，
          對應現代人的代謝、修復、氣色、力量、視覺與全人平衡。
        </p>

        <div style={colorGrid}>
          {colors.map((item) => (
            <div key={item.name} style={colorCard}>
              <div style={{ ...colorOrb, background: item.color }} />
              <div style={colorName}>{item.name}</div>
              <h3 style={colorTitle}>{item.title}</h3>
              <p style={colorLine}>{item.line}</p>
              <p style={colorDesc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="paisen" style={paisenSection}>
        <div style={sectionLabel}>PAISEN AI SYSTEM</div>
        <h2 style={sectionTitle}>派森 AI 健康系統</h2>
        <p style={sectionText}>
          用 6 題快速理解今天的身體狀態，從疲勞、腸胃、代謝、壓力與氧化反應，
          推薦最適合你的植物機能飲與生活建議。
        </p>

        <div style={aiLayout}>
          <div style={questionBox}>
            {questions.map((q, i) => (
              <div key={q} style={questionItem}>
                <span style={questionNumber}>{i + 1}</span>
                {q}
              </div>
            ))}
          </div>

          <div style={resultBox}>
            <div style={resultTitle}>AI 分析預覽</div>
            <div style={resultRow}><span>發炎傾向</span><b>中度</b></div>
            <div style={bar}><div style={{ ...barInner, width: "68%" }} /></div>
            <div style={resultRow}><span>腸胃代謝</span><b>偏弱</b></div>
            <div style={bar}><div style={{ ...barInner, width: "54%" }} /></div>
            <div style={resultRow}><span>氧化壓力</span><b>偏高</b></div>
            <div style={bar}><div style={{ ...barInner, width: "76%" }} /></div>
            <div style={recommend}>推薦：翡翠綠 × 水晶紫</div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 38 }}>
          <button style={primaryBtn}>開始分析</button>
        </div>
      </section>

      <section style={principleSection}>
        <div>
          <div style={sectionLabel}>OUR STANDARD</div>
          <h2 style={sectionTitle}>三好、三無，是我們給家人的標準。</h2>
        </div>

        <div style={principleGrid}>
          <div style={principleCard}>
            <h3>三好原則</h3>
            <p>好喝、好看、好吸收。真正能持續的健康，一定要能融入生活。</p>
          </div>
          <div style={principleCard}>
            <h3>三無鐵律</h3>
            <p>無人工、無化學、無合成。真正重要的人，值得最乾淨的選擇。</p>
          </div>
        </div>
      </section>

      <section id="partner" style={partnerSection}>
        <h2 style={{ ...sectionTitle, color: "white" }}>加盟合作</h2>
        <p style={partnerText}>
          植本邏輯提供產品供應、品牌視覺、AI健康系統、會員經營與門市營運模型，
          協助城市合作者建立可複製、可管理、可長期經營的植物機能飲事業。
        </p>
        <a href="mailto:bryan@phytologic.tw" style={partnerBtn}>聯絡加盟合作</a>
      </section>

      <footer style={footer}>
        <div>© 2026 PHYTOLOGIC 植本邏輯</div>
        <div>bryan@phytologic.tw</div>
      </footer>
    </div>
  );
}

const page = {
  background: "#f5f1e8",
  minHeight: "100vh",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  color: "#14532d",
};

const nav = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "22px 64px",
  background: "rgba(245,241,232,0.86)",
  backdropFilter: "blur(18px)",
  borderBottom: "1px solid rgba(20,83,45,0.08)",
  position: "sticky",
  top: 0,
  zIndex: 50,
};

const brand = { display: "flex", alignItems: "center", gap: 14 };
const logo = { width: 54, height: 54, objectFit: "contain" };
const brandName = { fontSize: 26, fontWeight: 950, letterSpacing: "-1px" };
const brandSub = { fontSize: 14, fontWeight: 800, color: "#6b7d55" };
const navLinks = { display: "flex", gap: 34, fontWeight: 900 };
const navLink = { color: "#14532d", textDecoration: "none" };

const hero = {
  position: "relative",
  overflow: "hidden",
  display: "grid",
  gridTemplateColumns: "1.1fr 0.9fr",
  gap: 70,
  padding: "110px 72px 110px",
  alignItems: "center",
};

const heroGlowA = {
  position: "absolute",
  width: 520,
  height: 520,
  borderRadius: "50%",
  background: "rgba(22,163,74,0.18)",
  filter: "blur(40px)",
  top: -160,
  left: -120,
};

const heroGlowB = {
  position: "absolute",
  width: 440,
  height: 440,
  borderRadius: "50%",
  background: "rgba(201,154,34,0.22)",
  filter: "blur(55px)",
  bottom: -120,
  right: 80,
};

const heroGlowC = {
  position: "absolute",
  width: 340,
  height: 340,
  borderRadius: "50%",
  background: "rgba(124,58,237,0.15)",
  filter: "blur(50px)",
  top: 160,
  right: 420,
};

const heroContent = { position: "relative", zIndex: 2 };
const pill = {
  display: "inline-block",
  padding: "13px 24px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.76)",
  color: "#166534",
  fontWeight: 950,
  letterSpacing: "1px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
};

const heroTitle = {
  fontSize: 88,
  lineHeight: 1.02,
  margin: "28px 0 28px",
  fontWeight: 950,
  letterSpacing: "-5px",
};

const heroText = {
  fontSize: 24,
  lineHeight: 1.85,
  color: "#365314",
  maxWidth: 860,
  fontWeight: 650,
};

const heroActions = { display: "flex", gap: 20, marginTop: 40 };
const belief = { marginTop: 30, fontSize: 18, fontWeight: 900, color: "#c99a22" };

const primaryBtn = {
  padding: "20px 42px",
  borderRadius: 999,
  border: "none",
  background: "#166534",
  color: "white",
  fontSize: 20,
  fontWeight: 950,
  textDecoration: "none",
  cursor: "pointer",
  boxShadow: "0 18px 38px rgba(22,101,52,0.28)",
};

const secondaryBtn = {
  padding: "20px 42px",
  borderRadius: 999,
  border: "1px solid rgba(20,83,45,0.1)",
  background: "rgba(255,255,255,0.8)",
  color: "#166534",
  fontSize: 20,
  fontWeight: 950,
  textDecoration: "none",
};

const heroPanel = {
  position: "relative",
  zIndex: 2,
  minHeight: 620,
  borderRadius: 56,
  background: "linear-gradient(135deg, #14532d, #052e16)",
  color: "white",
  padding: 48,
  boxShadow: "0 35px 90px rgba(0,0,0,0.24)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const panelTitle = { fontSize: 78, fontWeight: 950, letterSpacing: "-3px" };
const panelSub = { color: "#d6b04a", fontWeight: 950, letterSpacing: "2px", marginBottom: 34 };
const scanBox = {
  position: "relative",
  border: "1px solid rgba(255,255,255,0.18)",
  borderRadius: 34,
  padding: 28,
  background: "rgba(255,255,255,0.06)",
  overflow: "hidden",
};

const scanLine = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 4,
  background: "linear-gradient(90deg, transparent, #d6b04a, transparent)",
};

const scanItem = {
  padding: "18px 0",
  borderBottom: "1px solid rgba(255,255,255,0.1)",
  fontSize: 22,
  fontWeight: 850,
};

const fatigueSection = {
  margin: "20px 72px",
  borderRadius: 54,
  padding: "88px 64px",
  background: "linear-gradient(135deg, #10251a, #06130d)",
  color: "white",
  textAlign: "center",
};

const darkTitle = { fontSize: 58, lineHeight: 1.18, margin: 0, fontWeight: 950 };
const darkText = {
  fontSize: 24,
  lineHeight: 1.8,
  color: "rgba(255,255,255,0.78)",
  maxWidth: 900,
  margin: "26px auto 42px",
};

const fatigueGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(6, 1fr)",
  gap: 16,
};

const fatigueCard = {
  padding: "24px 10px",
  borderRadius: 28,
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.1)",
  fontSize: 22,
  fontWeight: 950,
};

const section = { padding: "92px 72px" };
const storySection = { padding: "110px 72px 92px" };
const sectionLabel = {
  color: "#c99a22",
  fontWeight: 950,
  letterSpacing: "2px",
  marginBottom: 18,
};

const sectionTitle = {
  fontSize: 52,
  lineHeight: 1.25,
  margin: "0 0 26px",
  fontWeight: 950,
  letterSpacing: "-1.5px",
};

const quote = {
  fontSize: 54,
  lineHeight: 1.25,
  color: "#166534",
  fontWeight: 950,
  margin: "20px 0 28px",
};

const sectionText = {
  fontSize: 24,
  lineHeight: 1.9,
  color: "#365314",
  maxWidth: 1040,
  fontWeight: 650,
};

const colorGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 22,
  marginTop: 44,
};

const colorCard = {
  background: "rgba(255,255,255,0.76)",
  border: "1px solid rgba(20,83,45,0.08)",
  borderRadius: 34,
  padding: 34,
  minHeight: 310,
  boxShadow: "0 18px 50px rgba(0,0,0,0.06)",
};

const colorOrb = {
  width: 70,
  height: 70,
  borderRadius: "50%",
  marginBottom: 22,
  boxShadow: "0 18px 42px rgba(0,0,0,0.14)",
};

const colorName = { fontSize: 22, fontWeight: 950, color: "#c99a22" };
const colorTitle = { fontSize: 32, margin: "12px 0 14px", color: "#14532d" };
const colorLine = { fontSize: 21, lineHeight: 1.7, fontWeight: 850, color: "#14532d" };
const colorDesc = { fontSize: 18, lineHeight: 1.7, color: "#5a6848" };

const paisenSection = {
  padding: "92px 72px",
  background: "rgba(255,255,255,0.34)",
};

const aiLayout = {
  display: "grid",
  gridTemplateColumns: "1.1fr 0.9fr",
  gap: 28,
  marginTop: 42,
};

const questionBox = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 18,
};

const questionItem = {
  background: "white",
  borderRadius: 28,
  padding: "24px 28px",
  fontSize: 21,
  lineHeight: 1.45,
  fontWeight: 850,
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

const resultBox = {
  background: "linear-gradient(135deg, #14532d, #052e16)",
  color: "white",
  borderRadius: 34,
  padding: 34,
  boxShadow: "0 25px 70px rgba(0,0,0,0.16)",
};

const resultTitle = { fontSize: 32, fontWeight: 950, marginBottom: 26 };
const resultRow = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: 20,
  fontWeight: 850,
  marginTop: 18,
};

const bar = {
  height: 10,
  background: "rgba(255,255,255,0.12)",
  borderRadius: 999,
  overflow: "hidden",
  marginTop: 10,
};

const barInner = {
  height: "100%",
  background: "#d6b04a",
  borderRadius: 999,
};

const recommend = {
  marginTop: 30,
  padding: 22,
  borderRadius: 24,
  background: "rgba(255,255,255,0.1)",
  fontSize: 24,
  fontWeight: 950,
};

const principleSection = {
  padding: "92px 72px",
  display: "grid",
  gridTemplateColumns: "0.9fr 1.1fr",
  gap: 36,
  alignItems: "center",
};

const principleGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 22,
};

const principleCard = {
  background: "white",
  borderRadius: 34,
  padding: 36,
  boxShadow: "0 18px 50px rgba(0,0,0,0.06)",
  fontSize: 22,
  lineHeight: 1.8,
  color: "#365314",
};

const partnerSection = {
  margin: "40px 72px 80px",
  padding: "84px 60px",
  borderRadius: 54,
  textAlign: "center",
  background: "linear-gradient(135deg, #14532d, #052e16)",
  color: "white",
};

const partnerText = {
  fontSize: 24,
  lineHeight: 1.8,
  maxWidth: 900,
  margin: "0 auto",
  color: "rgba(255,255,255,0.86)",
};

const partnerBtn = {
  display: "inline-block",
  marginTop: 38,
  padding: "20px 42px",
  borderRadius: 999,
  background: "white",
  color: "#166534",
  fontSize: 20,
  fontWeight: 950,
  textDecoration: "none",
};

const footer = {
  padding: "34px 64px",
  display: "flex",
  justifyContent: "space-between",
  color: "#4d5f42",
  borderTop: "1px solid rgba(20,83,45,0.08)",
};
