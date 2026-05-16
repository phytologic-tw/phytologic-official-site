import { useEffect, useMemo, useState } from "react";

const PRODUCTS = [
  {
    id: "pearl",
    name: "珍珠白",
    en: "PEARL WHITE",
    color: "#F2F1EC",
    dark: "#77746A",
    tag: "清晰與傳承",
    system: "大腦神經・睡眠修復・慢性發炎",
    headline: "保持清楚和清醒，真正陪他長大",
    desc: "珍珠白代表傳承。適合長期疲勞、腦霧、睡眠不佳與身體需要溫和修復的人。",
  },
  {
    id: "emerald",
    name: "翡翠綠",
    en: "EMERALD GREEN",
    color: "#3E6B4B",
    dark: "#24422E",
    tag: "代謝與腸胃",
    system: "腸胃代謝・排除負擔・體內環保",
    headline: "吃得下，才可以活得好",
    desc: "翡翠綠是一切修復的起點。適合外食多、便祕、身體沉重、代謝慢與需要高纖淨化的人。",
  },
  {
    id: "rose",
    name: "玫瑰紅",
    en: "ROSE RED",
    color: "#9E4A56",
    dark: "#67303A",
    tag: "氣色與生命力",
    system: "膠原支持・循環氣色・女性保養",
    headline: "愛美想帥，不是為了再瘋一把",
    desc: "玫瑰紅代表年輕狀態與生命力。適合氣色暗沉、肌膚彈性、女性保養與抗氧化需求。",
  },
  {
    id: "diamond",
    name: "金鑽黃",
    en: "DIAMOND YELLOW",
    color: "#D8A133",
    dark: "#7E5A18",
    tag: "力量與守護",
    system: "肌肉能量・運動恢復・體態管理",
    headline: "當家人需要你的時候，你還有力氣站在前面",
    desc: "金鑽黃代表力量。適合運動健身、增肌減脂、肌肉恢復與體力下降的人。",
  },
  {
    id: "crystal",
    name: "水晶紫",
    en: "CRYSTAL PURPLE",
    color: "#7566A8",
    dark: "#453B69",
    tag: "看見與感知",
    system: "視覺神經・3C 疲勞・抗氧化防護",
    headline: "看見家人的樣子與世界的風景",
    desc: "水晶紫不是只為了護眼，而是為了能看見家人的樣子與世界的風景。適合 3C 族群。",
  },
  {
    id: "platinum",
    name: "鉑金白",
    en: "PLATINUM WHITE",
    color: "#D9D9D6",
    dark: "#6E6E69",
    tag: "高階修復",
    system: "重度耗損・全身修復・高階防護",
    headline: "高階修復，重啟身體深層防禦",
    desc: "鉑金白是高階修復基底。適合高壓、熬夜、代謝混亂與多系統耗損狀態。",
  },
];

const PROFILE_OPTIONS = {
  gender: ["女性", "男性", "不指定"],
  age: ["12～16", "20～30", "35～45", "50～60", "65～75"],
  workType: ["久坐上班", "高壓管理", "長時間站立", "勞動工作", "學生", "自由工作"],
  sleep: ["睡得很好", "偶爾熬夜", "經常熬夜", "睡眠品質差"],
  exercise: ["幾乎沒有", "每週 1～2 次", "每週 3 次以上", "高強度訓練"],
};

const QUIZ_BANK = [
  { q: "常常覺得疲勞，即使睡醒之後仍然沒有精神？", sys: "神經系統・能量代謝", productId: "pearl" },
  { q: "注意力難以集中，思考變慢，或常出現腦霧感？", sys: "大腦神經・專注力", productId: "pearl" },
  { q: "經常腹脹、消化不良、便祕，或腹瀉與便祕交替？", sys: "消化系統・腸道屏障", productId: "emerald" },
  { q: "身體經常沉重、水腫，或覺得代謝不乾淨？", sys: "排毒系統・水分代謝", productId: "emerald" },
  { q: "皮膚暗沉、氣色差、容易乾癢，或近期明顯掉髮？", sys: "膠原循環・皮膚屏障", productId: "rose" },
  { q: "容易嘴破、牙齦出血、氣色蒼白，或覺得臉色不夠紅潤？", sys: "微血管・氣色循環", productId: "rose" },
  { q: "肌肉或關節經常痠痛、僵硬、緊繃，運動後恢復很慢？", sys: "肌肉骨骼・發炎反應", productId: "diamond" },
  { q: "體力明顯下降，爬樓梯容易喘，或覺得肌肉力量不夠？", sys: "肌肉能量・體態管理", productId: "diamond" },
  { q: "長時間使用手機或電腦後，眼睛容易乾澀、酸痛、畏光？", sys: "視覺神經・3C 防護", productId: "crystal" },
  { q: "視力容易模糊、眼睛疲勞，或夜間看東西比較吃力？", sys: "視覺感知・抗氧化", productId: "crystal" },
  { q: "經常壓力巨大、焦慮、情緒起伏，休假也無法真正放鬆？", sys: "內分泌・壓力荷爾蒙", productId: "platinum" },
  { q: "經常渴望甜食、澱粉、手搖飲，吃完飯後容易想睡？", sys: "血糖系統・代謝阻抗", productId: "platinum" },
];

function getProduct(id) {
  return PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];
}

function getLevel(score) {
  if (score >= 19) {
    return {
      label: "高度系統性發炎",
      color: "#9E4A56",
      message: "身體可能正處於多系統高壓耗損狀態。建議立即降低精緻糖、油炸與加工食品，建立固定睡眠，並以高階修復型植萃作為日常調養起點。",
    };
  }

  if (score >= 12) {
    return {
      label: "中度發炎耗損",
      color: "#D8A133",
      message: "身體已出現多項慢性發炎警訊，常見於熬夜、外食、高壓與代謝負擔。建議從腸胃代謝、睡眠與抗氧化攝取三個方向同步調整。",
    };
  }

  if (score >= 5) {
    return {
      label: "輕度微幅發炎",
      color: "#7566A8",
      message: "目前屬於可逆的微幅耗損狀態。建議維持穩定作息、增加天然蔬果與膳食纖維，並依照主要不適系統選擇對應植萃。",
    };
  }

  return {
    label: "健康綠燈穩定",
    color: "#3E6B4B",
    message: "目前發炎負荷偏低，身體狀態穩定。建議持續維持乾淨飲食、規律活動與足夠睡眠。",
  };
}

function getBmiStatus(profile) {
  const height = Number(profile.height);
  const weight = Number(profile.weight);

  if (!height || !weight || height <= 0 || weight <= 0) {
    return {
      bmi: "--",
      label: "尚未建立",
      color: "#777",
      message: "身高與體重資料不足，無法估算 BMI。",
    };
  }

  const bmi = weight / Math.pow(height / 100, 2);

  if (bmi < 18.5) {
    return {
      bmi: bmi.toFixed(1),
      label: "偏瘦",
      color: "#7566A8",
      message: "體重偏低時，調養重點不只是熱量，而是腸胃吸收率、蛋白質品質與規律作息。",
    };
  }

  if (bmi < 24) {
    return {
      bmi: bmi.toFixed(1),
      label: "標準區間",
      color: "#3E6B4B",
      message: "體重落在相對穩定區間，建議重點放在抗發炎、睡眠品質、代謝效率與長期維持。",
    };
  }

  if (bmi < 27) {
    return {
      bmi: bmi.toFixed(1),
      label: "過重警訊",
      color: "#D8A133",
      message: "體重已進入代謝警訊區，建議優先檢視精緻澱粉、含糖飲、宵夜與久坐問題。",
    };
  }

  return {
    bmi: bmi.toFixed(1),
    label: "高度代謝負擔",
    color: "#9E4A56",
    message: "體重與代謝負擔偏高，建議從低糖、高纖、規律睡眠與每日活動量同步調整。",
  };
}

function getSystemScores(answers) {
  const scores = Object.fromEntries(PRODUCTS.map((p) => [p.id, 0]));

  QUIZ_BANK.forEach((item, index) => {
    scores[item.productId] += answers[index] || 0;
  });

  return PRODUCTS.map((product) => ({
    ...product,
    score: scores[product.id] || 0,
  })).sort((a, b) => b.score - a.score);
}

function getThreeDayPlan(product, level, bmiStatus) {
  const plans = {
    pearl: [
      "第一天：提前 30 分鐘放下螢幕，晚餐減少油炸、酒精與過量咖啡因，讓神經系統先降噪。",
      "第二天：早餐補充植物蛋白與好油，下午避免第二杯咖啡，穩定能量曲線。",
      "第三天：安排 20 分鐘慢走或伸展，睡前做 5 分鐘深呼吸，修復壓力荷爾蒙。",
    ],
    emerald: [
      "第一天：晚餐增加一份深綠色蔬菜，減少精緻澱粉與高鹽加工食品。",
      "第二天：早上補充溫水，餐後散步 10 分鐘，協助腸胃蠕動與血糖穩定。",
      "第三天：記錄排便、腹脹與水腫變化，把腸胃反應作為調整飲食的核心指標。",
    ],
    rose: [
      "第一天：補充高維生素 C 蔬果，減少甜點與含糖飲，降低膠原糖化壓力。",
      "第二天：晚餐加入紅紫色蔬果，觀察氣色、口腔與皮膚乾燥狀態。",
      "第三天：睡眠提前 30 分鐘，搭配溫和伸展，讓循環與修復效率提升。",
    ],
    diamond: [
      "第一天：安排 15～20 分鐘低強度肌力訓練，避免只做有氧。",
      "第二天：每餐加入足量植物蛋白，運動後補充乾淨碳水協助恢復。",
      "第三天：檢查肌肉痠痛與精神狀態，若痠痛過久，降低訓練量並提高修復營養。",
    ],
    crystal: [
      "第一天：每使用螢幕 30 分鐘，離開螢幕看遠方 30 秒。",
      "第二天：晚餐加入紫色與橘紅色蔬果，增加花青素與類胡蘿蔔素來源。",
      "第三天：睡前 60 分鐘降低螢幕亮度，觀察眼睛乾澀與睡眠品質變化。",
    ],
    platinum: [
      "第一天：停止含糖飲、油炸與宵夜，先把身體最大發炎來源降下來。",
      "第二天：三餐固定，補充植物蛋白、高纖與好油，避免血糖大幅波動。",
      "第三天：安排 20 分鐘低強度活動，建立固定睡眠時間，作為長期修復起點。",
    ],
  };

  const result = [...(plans[product.id] || plans.platinum)];

  if (level.label.includes("高度")) {
    result.push("提醒：若疲勞、心悸、疼痛、血糖或血壓問題明顯，請同步諮詢專業醫師或營養師。");
  }

  if (bmiStatus.label.includes("過重") || bmiStatus.label.includes("高度")) {
    result.push("BMI 提醒：本週優先減少含糖飲與宵夜，比激烈節食更重要。");
  }

  if (bmiStatus.label.includes("偏瘦")) {
    result.push("BMI 提醒：不要盲目少吃，請優先提高蛋白質、好油與腸胃吸收品質。");
  }

  return result;
}

function Logo() {
  return (
    <div className="logo">
      <svg viewBox="0 0 100 100">
        <polygon points="50,5 90,27 90,73 50,95 10,73 10,27" />
        <path d="M50,95 C62,70 82,58 80,28 C63,42 56,63 50,95 Z" />
      </svg>
      <div>
        <strong>PHYTOLOGIC</strong>
        <span>植本邏輯</span>
      </div>
    </div>
  );
}

function ProductOrb({ product, size = 64 }) {
  return (
    <div
      className="orb"
      style={{
        width: size,
        height: size,
        background: product.color,
        boxShadow: `0 18px 45px ${product.color}55`,
      }}
    />
  );
}

function ProductCard({ product }) {
  return (
    <div className="productCard">
      <div className="productTop">
        <ProductOrb product={product} />
        <div>
          <small>{product.en}</small>
          <h3>{product.name}</h3>
        </div>
      </div>
      <span className="pill" style={{ background: `${product.color}22`, color: product.dark }}>
        {product.tag}
      </span>
      <h4>「{product.headline}」</h4>
      <p>{product.desc}</p>
      <b>{product.system}</b>
    </div>
  );
}

function QuizSystem() {
  const [stage, setStage] = useState("profile");
  const [profile, setProfile] = useState({
    gender: "",
    age: "",
    height: "",
    weight: "",
    workType: "",
    sleep: "",
    exercise: "",
  });
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});

  const profileComplete = Object.values(profile).every(Boolean);
  const score = Object.values(answers).reduce((sum, val) => sum + val, 0);
  const level = getLevel(score);
  const bmiStatus = getBmiStatus(profile);
  const systemScores = useMemo(() => getSystemScores(answers), [answers]);
  const resultProduct = systemScores[0] || PRODUCTS[0];
  const topSystems = systemScores.filter((item) => item.score > 0).slice(0, 3);
  const threeDayPlan = getThreeDayPlan(resultProduct, level, bmiStatus);

  function chooseAnswer(val) {
    const next = { ...answers, [current]: val };
    setAnswers(next);

    if (current + 1 >= QUIZ_BANK.length) {
      setStage("result");
    } else {
      setCurrent(current + 1);
    }
  }

  function reset() {
    setStage("profile");
    setProfile({
      gender: "",
      age: "",
      height: "",
      weight: "",
      workType: "",
      sleep: "",
      exercise: "",
    });
    setCurrent(0);
    setAnswers({});
  }

  if (stage === "profile") {
    return (
      <div className="quizBox">
        <div className="kicker">PHASE 01 · BASIC PROFILE</div>
        <h3>先建立你的基礎狀態</h3>
        <p>派森會先理解你的性別、年齡、身高、體重、工作型態、睡眠與運動習慣。</p>

        <div className="profileGrid">
          {[
            ["gender", "性別"],
            ["age", "年齡"],
            ["height", "身高 cm"],
            ["weight", "體重 kg"],
            ["workType", "工作型態"],
            ["sleep", "睡眠狀況"],
            ["exercise", "運動頻率"],
          ].map(([key, label]) => (
            <label key={key}>
              <span>{label}</span>

              {key === "height" || key === "weight" ? (
                <input
                  type="number"
                  value={profile[key]}
                  placeholder={key === "height" ? "例如：175" : "例如：72"}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      [key]: e.target.value,
                    }))
                  }
                />
              ) : (
                <select
                  value={profile[key]}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      [key]: e.target.value,
                    }))
                  }
                >
                  <option value="">請選擇</option>
                  {PROFILE_OPTIONS[key].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              )}
            </label>
          ))}
        </div>

        <button disabled={!profileComplete} onClick={() => setStage("quiz")}>
          開始派森 AI 分析
        </button>
      </div>
    );
  }

  if (stage === "quiz") {
    const item = QUIZ_BANK[current];
    const progress = ((current + 1) / QUIZ_BANK.length) * 100;

    return (
      <div className="quizBox">
        <div className="quizProgress">
          <span>
            QUESTION {current + 1} / {QUIZ_BANK.length}
          </span>
          <b>{item.sys}</b>
        </div>

        <div className="bar">
          <i style={{ width: `${progress}%` }} />
        </div>

        <div className="question">
          <h3>{item.q}</h3>

          <div className="answers">
            {[
              ["從不 / 無此症狀", 0],
              ["偶爾 / 輕微感受", 1],
              ["經常 / 頻繁困擾", 2],
            ].map(([label, val]) => (
              <button key={label} onClick={() => chooseAnswer(val)}>
                <span>{label}</span>
                <b>+{val}</b>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quizBox result">
      <div className="resultHeader">
        <div className="kicker">PAISEN AI DIAGNOSTIC REPORT</div>
        <h3 style={{ color: level.color }}>{level.label}</h3>
        <p>
          系統炎症總評分：
          <strong style={{ color: level.color }}> {score}</strong> / 24
        </p>
      </div>

      <div className="reportStats">
        <div>
          <span>年齡層</span>
          <strong>{profile.age} 歲</strong>
        </div>
        <div>
          <span>BMI</span>
          <strong style={{ color: bmiStatus.color }}>{bmiStatus.bmi}</strong>
          <small>{bmiStatus.label}</small>
        </div>
        <div>
          <span>主要耗損</span>
          <strong>{resultProduct.tag}</strong>
        </div>
      </div>

      <div className="advice">
        <h4>派森分析摘要</h4>
        <p>{level.message}</p>
        <p>{bmiStatus.message}</p>
      </div>

      <div className="systemMap">
        <h4>PRIMARY DEPLETION SYSTEMS / 主要耗損系統</h4>

        {topSystems.length ? (
          topSystems.map((item) => (
            <div className="systemRow" key={item.id}>
              <div>
                <strong>{item.name}</strong>
                <span>{item.system}</span>
              </div>
              <div className="scoreBar">
                <i
                  style={{
                    width: `${Math.min(100, (item.score / 4) * 100)}%`,
                    background: item.color,
                  }}
                />
              </div>
              <b>{item.score}</b>
            </div>
          ))
        ) : (
          <p>目前沒有明顯單一系統耗損，建議以日常保養與穩定作息為主。</p>
        )}
      </div>

      <div className="recommend">
        <h4>AI TARGETED BLEND / 專屬植萃推薦</h4>
        <div className="recommendMain">
          <ProductOrb product={resultProduct} size={82} />
          <div>
            <small>{resultProduct.en}</small>
            <h3>{resultProduct.name}</h3>
            <p>「{resultProduct.headline}」</p>
            <span>{resultProduct.system}</span>
          </div>
        </div>
      </div>

      <div className="dailyPlan">
        <h4>TODAY'S MINI PLAN / 今日修復方向</h4>
        <ul>
          <li>
            今日代表色：
            <strong style={{ color: resultProduct.dark }}>{resultProduct.name}</strong>
          </li>
          <li>今日修復重點：{resultProduct.tag}</li>
          <li>
            {profile.sleep === "經常熬夜" || profile.sleep === "睡眠品質差"
              ? "今天請把睡眠提前 30 分鐘，這會比多補一杯咖啡更有效。"
              : "今天維持穩定作息，讓身體保持低發炎節奏。"}
          </li>
        </ul>
      </div>

      <div className="dailyPlan">
        <h4>3-DAY RESET PLAN / 三日修復計畫</h4>
        <ul>
          {threeDayPlan.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="resultActions">
        <a href="#trial">申請試飲體驗</a>
        <button onClick={reset}>重新分析</button>
      </div>
    </div>
  );
}

function TrialForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    concern: "",
  });

  const body = encodeURIComponent(
    `試飲申請\n\n姓名：${form.name}\n電話：${form.phone}\n城市：${form.city}\n身體困擾：${form.concern}`
  );

  return (
    <form className="trialForm" onSubmit={(e) => e.preventDefault()}>
      <label>
        <span>姓名</span>
        <input
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
        />
      </label>
      <label>
        <span>電話</span>
        <input
          value={form.phone}
          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
        />
      </label>
      <label>
        <span>城市</span>
        <input
          value={form.city}
          onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
        />
      </label>
      <label>
        <span>目前最想改善的身體狀態</span>
        <textarea
          value={form.concern}
          onChange={(e) => setForm((p) => ({ ...p, concern: e.target.value }))}
        />
      </label>

      <a href={`mailto:bryan@phytologic.tw?subject=植本邏輯試飲申請&body=${body}`}>
        送出試飲申請
      </a>
    </form>
  );
}

export default function App() {
  useEffect(() => {
    const id = "phytologic-font";
    if (document.getElementById(id)) return;

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;600;700;900&family=Cormorant+Garamond:wght@400;600;700&family=JetBrains+Mono:wght@400;700&display=swap";
    document.head.appendChild(link);
  }, []);

  return (
    <div className="app">
      <style>{CSS}</style>

      <nav>
        <Logo />
        <div className="navLinks">
          <a href="#story">品牌故事</a>
          <a href="#products">六色植萃</a>
          <a href="#quiz">派森 AI</a>
          <a href="#trial">試飲申請</a>
        </div>
      </nav>

      <header className="hero">
        <div className="bgOrb one" />
        <div className="bgOrb two" />
        <div className="bgOrb three" />

        <div className="heroContent">
          <div className="kicker">重視生命。尊重自然。相信邏輯。</div>
          <h1>
            健康不是為了活得久。
            <br />
            而是為了能 <em>好好陪伴。</em>
          </h1>
          <p>
            我們不是在做飲料，而是真正每天會進入人體、長期被身體吸收的植物機能系統。
          </p>
          <div className="heroBtns">
            <a href="#products">探索六色植萃</a>
            <a href="#quiz">派森 AI 分析</a>
          </div>
        </div>
      </header>

      <section id="story" className="section story">
        <div className="grid">
          <div>
            <div className="kicker">BRAND STORY</div>
            <h2>六個家庭，重新理解健康之後的人生答案。</h2>
            <p>
              50歲那年成為父親，當孩子出生的那一刻，我第一次認真思考：「我還有多久能陪他？」
            </p>
            <p>
              植本邏輯不是從商業開始，而是從愛開始。不是做給市場看的商品，而是做給家人每天都敢吃的食物。
            </p>
          </div>

          <div className="principles">
            {["好喝", "好看", "好吸收", "無人工", "無化學", "無合成"].map((item) => (
              <div key={item}>
                <span>PHYTOLOGIC</span>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="products" className="section products">
        <div className="sectionHead">
          <div className="kicker">SIX COLOR SYSTEM</div>
          <h2>每一種顏色，都是人生。</h2>
          <p>不是賣營養名詞，而是回到你真正想守護的生活狀態。</p>
        </div>

        <div className="productGrid">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section id="quiz" className="section quizSection">
        <div className="grid">
          <div>
            <div className="kicker green">PAISEN AI HEALTH SYSTEM</div>
            <h2>派森 AI 功能醫學炎症分析</h2>
            <p>
              先建立基本資料，再透過七大生理系統問卷，分析你的主要耗損來源，
              並推薦最適合的六色植萃與今日生活修復方向。
            </p>

            <div className="features">
              <div>🧬 七大系統評估</div>
              <div>📊 炎症負荷評分</div>
              <div>🍵 對齊六色植萃</div>
              <div>💬 LINE 會員入口</div>
            </div>
          </div>

          <div className="quizCard">
            <QuizSystem />
          </div>
        </div>
      </section>

      <section id="trial" className="section trial">
        <div className="grid">
          <div>
            <div className="kicker">CONVERSION SYSTEM</div>
            <h2>先讓身體試一次，再讓市場相信。</h2>
            <p>
              植本邏輯最強的成交策略，是讓更多人真正喝到、感受到、願意持續。
            </p>
          </div>
          <TrialForm />
        </div>
      </section>

      <footer>
        <Logo />
        <div>
          <strong>真正重要的人，值得最乾淨的選擇。</strong>
          <span>© 2026 PHYTOLOGIC. bryan@phytologic.tw</span>
        </div>
      </footer>
    </div>
  );
}

const CSS = `
:root{
  --green:#3E6B4B;
  --ink:#191919;
  --muted:#666;
  --cream:#F8F7F2;
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:#FAFAFA;color:var(--ink)}
.app{
  min-height:100vh;
  font-family:'Noto Serif TC',serif;
  color:var(--ink);
  overflow-x:hidden;
}
a{text-decoration:none;color:inherit}
button,input,textarea,select{font-family:inherit}
button{cursor:pointer}
nav{
  position:fixed;
  top:0;
  left:0;
  right:0;
  z-index:1000;
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:22px 60px;
  background:rgba(255,255,255,.86);
  backdrop-filter:blur(18px);
  border-bottom:1px solid rgba(0,0,0,.06);
}
.logo{
  display:flex;
  align-items:center;
  gap:14px;
}
.logo svg{
  width:42px;
  height:42px;
}
.logo polygon{
  fill:#3E6B4B;
}
.logo path{
  fill:#fff;
}
.logo strong{
  display:block;
  font-family:'JetBrains Mono',monospace;
  letter-spacing:.16em;
}
.logo span{
  display:block;
  font-size:11px;
  color:#777;
  margin-top:2px;
}
.navLinks{
  display:flex;
  gap:30px;
  font-size:14px;
  font-weight:700;
}
.hero{
  min-height:100vh;
  position:relative;
  display:flex;
  align-items:center;
  justify-content:center;
  text-align:center;
  padding:140px 24px 80px;
  background:linear-gradient(180deg,#fff,#F9F8F2);
  overflow:hidden;
}
.bgOrb{
  position:absolute;
  border-radius:50%;
  filter:blur(28px);
  opacity:.35;
}
.bgOrb.one{
  width:260px;
  height:260px;
  background:#3E6B4B;
  top:18%;
  right:12%;
}
.bgOrb.two{
  width:180px;
  height:180px;
  background:#9E4A56;
  bottom:18%;
  left:12%;
}
.bgOrb.three{
  width:160px;
  height:160px;
  background:#7566A8;
  bottom:22%;
  right:22%;
}
.heroContent{
  position:relative;
  z-index:2;
  max-width:960px;
}
.kicker{
  font-family:'JetBrains Mono',monospace;
  font-size:11px;
  letter-spacing:.16em;
  font-weight:700;
  color:#888;
  margin-bottom:18px;
}
.kicker.green{
  color:var(--green);
}
.hero h1{
  font-family:'Cormorant Garamond','Noto Serif TC',serif;
  font-size:clamp(48px,7vw,90px);
  line-height:1.08;
  margin:0 0 30px;
}
.hero h1 em{
  color:var(--green);
}
.hero p{
  font-size:18px;
  color:#666;
  line-height:2;
  max-width:680px;
  margin:0 auto 40px;
}
.heroBtns{
  display:flex;
  gap:16px;
  justify-content:center;
  flex-wrap:wrap;
}
.heroBtns a,
.resultActions a,
.trialForm a,
.quizBox button{
  display:inline-flex;
  justify-content:center;
  align-items:center;
  min-height:54px;
  padding:0 34px;
  border-radius:999px;
  background:var(--green);
  color:white;
  font-weight:900;
  border:0;
}
.heroBtns a:last-child,
.resultActions button{
  background:white;
  color:#222;
  border:1px solid rgba(0,0,0,.12);
}
.section{
  padding:120px 64px;
}
.grid{
  max-width:1240px;
  margin:0 auto;
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:80px;
  align-items:center;
}
.section h2{
  font-family:'Cormorant Garamond','Noto Serif TC',serif;
  font-size:clamp(38px,5vw,60px);
  line-height:1.15;
  margin:0 0 26px;
}
.section p{
  font-size:16px;
  line-height:2;
  color:#5d5d5d;
}
.principles{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:18px;
}
.principles div{
  background:white;
  border:1px solid rgba(0,0,0,.06);
  border-radius:24px;
  padding:28px;
}
.principles span{
  display:block;
  color:var(--green);
  font-size:11px;
  font-weight:900;
  margin-bottom:8px;
}
.principles strong{
  font-size:26px;
}
.products{
  background:white;
}
.sectionHead{
  max-width:760px;
  margin:0 auto 70px;
  text-align:center;
}
.productGrid{
  max-width:1320px;
  margin:0 auto;
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:22px;
}
.productCard{
  background:white;
  border:1px solid rgba(0,0,0,.07);
  border-radius:28px;
  padding:32px;
  box-shadow:0 12px 32px rgba(0,0,0,.03);
}
.productTop{
  display:flex;
  align-items:center;
  gap:18px;
  margin-bottom:22px;
}
.orb{
  border-radius:50%;
  flex-shrink:0;
}
.productTop small,
.recommendMain small{
  display:block;
  font-family:'JetBrains Mono',monospace;
  font-size:10px;
  color:#999;
  letter-spacing:.12em;
}
.productCard h3,
.recommendMain h3{
  font-family:'Cormorant Garamond','Noto Serif TC',serif;
  font-size:30px;
  margin:4px 0;
}
.productCard h4{
  font-size:19px;
  line-height:1.6;
  margin:18px 0 10px;
}
.productCard p{
  font-size:14px;
  line-height:1.8;
  color:#666;
}
.productCard b{
  display:block;
  padding-top:16px;
  margin-top:16px;
  border-top:1px solid rgba(0,0,0,.06);
  font-size:12px;
  color:#777;
}
.pill{
  display:inline-flex;
  padding:7px 14px;
  border-radius:999px;
  font-size:12px;
  font-weight:900;
}
.quizSection{
  background:var(--cream);
}
.features{
  display:grid;
  gap:14px;
  margin-top:28px;
}
.features div{
  background:white;
  border:1px solid rgba(0,0,0,.06);
  border-radius:18px;
  padding:18px;
  font-weight:800;
}
.quizCard,
.trialForm{
  background:white;
  border:1px solid rgba(0,0,0,.07);
  border-radius:34px;
  padding:42px;
  box-shadow:0 28px 65px rgba(0,0,0,.045);
}
.quizBox h3{
  font-size:30px;
  margin:0 0 16px;
}
.quizBox p{
  color:#666;
  line-height:1.8;
}
.profileGrid{
  display:grid;
  gap:14px;
  margin:24px 0;
}
.profileGrid label,
.trialForm label{
  display:block;
}
.profileGrid span,
.trialForm span{
  display:block;
  font-size:12px;
  font-weight:900;
  color:#555;
  margin-bottom:8px;
}
.profileGrid input,
.profileGrid select,
.trialForm input,
.trialForm textarea{
  width:100%;
  border:1px solid rgba(0,0,0,.1);
  background:#FBFBFA;
  border-radius:16px;
  padding:15px 16px;
  font-size:15px;
  outline:none;
}
.trialForm textarea{
  min-height:120px;
}
.quizBox button:disabled{
  opacity:.35;
  cursor:not-allowed;
}
.quizProgress{
  display:flex;
  justify-content:space-between;
  gap:12px;
  font-size:12px;
  color:#777;
  margin-bottom:12px;
}
.bar{
  height:3px;
  background:rgba(0,0,0,.08);
  border-radius:99px;
  overflow:hidden;
  margin-bottom:24px;
}
.bar i{
  display:block;
  height:100%;
  background:var(--green);
}
.question{
  background:#FAFAF8;
  border:1px solid rgba(0,0,0,.06);
  border-radius:24px;
  padding:30px;
}
.question h3{
  font-size:21px;
  line-height:1.75;
}
.answers{
  display:grid;
  gap:12px;
}
.answers button{
  width:100%;
  display:flex;
  justify-content:space-between;
  background:white;
  color:#222;
  border:1px solid rgba(0,0,0,.08);
  border-radius:16px;
}
.resultHeader{
  text-align:center;
  padding-bottom:26px;
  border-bottom:1px solid rgba(0,0,0,.08);
  margin-bottom:24px;
}
.reportStats{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:12px;
  margin-bottom:22px;
}
.reportStats div{
  background:#FAFAF8;
  border:1px solid rgba(0,0,0,.06);
  border-radius:18px;
  padding:16px;
  text-align:center;
}
.reportStats span{
  display:block;
  font-size:11px;
  color:#888;
  margin-bottom:6px;
}
.reportStats strong{
  display:block;
  font-size:18px;
}
.reportStats small{
  display:block;
  margin-top:4px;
  color:#777;
}
.advice,
.systemMap,
.recommend,
.dailyPlan{
  border:1px solid rgba(0,0,0,.07);
  border-radius:22px;
  padding:24px;
  margin-bottom:18px;
  background:white;
}
.advice h4,
.systemMap h4,
.recommend h4,
.dailyPlan h4{
  font-family:'JetBrains Mono',monospace;
  font-size:11px;
  letter-spacing:.14em;
  color:#888;
  margin:0 0 12px;
}
.systemRow{
  display:grid;
  grid-template-columns:1.3fr 1fr 28px;
  gap:14px;
  align-items:center;
  padding:12px 0;
  border-top:1px solid rgba(0,0,0,.06);
}
.systemRow span{
  display:block;
  font-size:12px;
  color:#777;
  margin-top:4px;
}
.scoreBar{
  height:8px;
  background:rgba(0,0,0,.08);
  border-radius:999px;
  overflow:hidden;
}
.scoreBar i{
  display:block;
  height:100%;
}
.recommendMain{
  display:flex;
  align-items:center;
  gap:18px;
}
.dailyPlan ul{
  margin:0;
  padding-left:20px;
  line-height:1.9;
  color:#555;
}
.resultActions{
  display:flex;
  gap:12px;
  margin-top:24px;
}
.trial{
  background:white;
}
.trialForm{
  display:grid;
  gap:16px;
}
.trialForm a{
  margin-top:8px;
}
footer{
  padding:54px 64px;
  background:white;
  border-top:1px solid rgba(0,0,0,.07);
  display:flex;
  justify-content:space-between;
  align-items:center;
}
footer > div:last-child{
  display:flex;
  flex-direction:column;
  gap:6px;
  text-align:right;
}
footer span{
  color:#999;
  font-size:12px;
}
@media(max-width:980px){
  nav{
    padding:16px 22px;
  }
  .navLinks{
    display:none;
  }
  .section{
    padding:86px 24px;
  }
  .grid,
  .productGrid{
    grid-template-columns:1fr;
  }
  .principles{
    grid-template-columns:1fr;
  }
  .quizCard,
  .trialForm{
    padding:28px 22px;
  }
  .reportStats{
    grid-template-columns:1fr;
  }
  .systemRow{
    grid-template-columns:1fr;
  }
  footer{
    flex-direction:column;
    align-items:flex-start;
    gap:20px;
    padding:36px 24px;
  }
  footer > div:last-child{
    text-align:left;
  }
}
`;
