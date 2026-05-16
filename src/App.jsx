import { useEffect, useMemo, useRef, useState } from "react";

/**
 * 植本邏輯 PHYTOLOGIC 官方網站
 * 升級內容：
 * 1. 六色流動品牌背景
 * 2. Hero 高級動態視覺
 * 3. 六色植萃互動卡片與產品彈窗
 * 4. 派森 AI：基本資料 → 問卷 → 分析報告 → 推薦植萃
 * 5. LINE / 試飲 / 加盟 CTA
 *
 * 使用方式：
 * 直接用本檔完整覆蓋 src/App.jsx
 */

const PRODUCTS = [
  {
    id: "pearl",
    name: "珍珠白",
    en: "PEARL WHITE",
    color: "#F2F1EC",
    accent: "#D8D4C8",
    dark: "#7B796F",
    tag: "清晰與傳承",
    system: "大腦神經・睡眠修復・慢性發炎",
    wish: "保持清楚和清醒，真正陪他長大。",
    headline: "保持清楚和清醒，真正陪他長大",
    desc:
      "珍珠白代表傳承。不是只留下財富，而是真正能陪孩子長大、把一輩子的經驗完整分享給重要的人。適合長期疲勞、腦霧、睡眠不佳與身體需要溫和修復的人。",
    ingredients: ["豆薯", "山藥", "老薑", "銀耳", "蘋果", "紅棗", "生核桃"],
    benefits: ["慢性發炎修復", "腸胃溫和調理", "睡眠與神經支持", "高壓疲勞恢復"],
    kcal: "88.8",
    protein: "4.2g",
    fat: "4.5g",
    carb: "8.5g",
    bestFor: ["經常熬夜", "腸胃敏感", "疲勞壓力大", "需要溫和滋補"],
  },
  {
    id: "emerald",
    name: "翡翠綠",
    en: "EMERALD GREEN",
    color: "#3E6B4B",
    accent: "#2F5239",
    dark: "#24422E",
    tag: "代謝與腸胃",
    system: "腸胃代謝・排除負擔・體內環保",
    wish: "吃得下，才可以活得好。",
    headline: "吃得下，才可以活得好",
    desc:
      "翡翠綠是一切修復的起點。腸胃好、代謝才會好，身體負擔才會下降。適合外食多、便祕、身體沉重、代謝慢與需要高纖淨化的人。",
    ingredients: ["地瓜葉", "櫛瓜", "青江菜", "黑木耳", "芭樂", "檸檬", "香水檸檬皮"],
    benefits: ["促進腸胃蠕動", "提升代謝效率", "排除身體負擔", "高纖體內環保"],
    kcal: "67.8",
    protein: "4.1g",
    fat: "3.0g",
    carb: "6.5g",
    bestFor: ["外食族", "便祕困擾", "代謝慢", "久坐上班族"],
  },
  {
    id: "rose",
    name: "玫瑰紅",
    en: "ROSE RED",
    color: "#9E4A56",
    accent: "#7D3A44",
    dark: "#67303A",
    tag: "氣色與生命力",
    system: "膠原支持・循環氣色・女性保養",
    wish: "愛美想帥，不是為了再瘋一把。",
    headline: "愛美想帥，不是為了再瘋一把",
    desc:
      "玫瑰紅代表年輕狀態與生命力。真正的年輕不是年齡，而是身體裡還有沒有那份光澤、氣色與神奇的力量。",
    ingredients: ["甜菜根", "紫甘藍", "銀耳", "紅棗", "芭樂", "百香果", "檸檬", "玫瑰花瓣"],
    benefits: ["促進膠原蛋白合成", "維持肌膚彈性", "抗氧化保養", "改善紅潤氣色"],
    kcal: "75.6",
    protein: "4.1g",
    fat: "3.2g",
    carb: "8.3g",
    bestFor: ["氣色暗沉", "女性保養", "肌膚彈性", "抗老需求"],
  },
  {
    id: "diamond",
    name: "金鑽黃",
    en: "DIAMOND YELLOW",
    color: "#D8A133",
    accent: "#B5862A",
    dark: "#7E5A18",
    tag: "力量與守護",
    system: "肌肉能量・運動恢復・體態管理",
    wish: "當家人需要你的時候，你還有力氣站在前面。",
    headline: "一個男人對家庭最簡單的責任感",
    desc:
      "金鑽黃代表力量。真正的強壯不是為了打敗誰，而是當重要的人需要你時，你還有力氣站在前面。",
    ingredients: ["甜玉米", "豆薯", "黃甜椒", "紅蘿蔔", "百香果", "香蕉", "新鮮薑黃"],
    benefits: ["運動後恢復", "蛋白質利用支持", "維持肌肉收縮", "降低訓練後發炎"],
    kcal: "68",
    protein: "3.5g",
    fat: "2.8g",
    carb: "10.5g",
    bestFor: ["運動健身", "增肌減脂", "肌肉痠痛", "體力下降"],
  },
  {
    id: "crystal",
    name: "水晶紫",
    en: "CRYSTAL PURPLE",
    color: "#7566A8",
    accent: "#5C5084",
    dark: "#453B69",
    tag: "看見與感知",
    system: "視覺神經・3C 疲勞・抗氧化防護",
    wish: "看見家人的樣子，也看見世界的風景。",
    headline: "看見家人的樣子與世界的風景",
    desc:
      "水晶紫不是只為了護眼，而是為了能看見家人的樣子、世界的風景，以及人生裡那些值得記住的重要瞬間。",
    ingredients: ["木鱉果", "紫薯", "紅蘿蔔", "藍莓", "紫高麗菜", "芭樂", "桑椹", "檸檬"],
    benefits: ["維持暗處視覺", "減輕眼部氧化壓力", "舒緩 3C 疲勞", "提升脂溶性護眼營養吸收"],
    kcal: "71.5",
    protein: "3.7g",
    fat: "2.8g",
    carb: "7.9g",
    bestFor: ["3C 族群", "眼睛乾澀", "夜間駕駛", "高氧化壓力"],
  },
  {
    id: "platinum",
    name: "鉑金白",
    en: "PLATINUM WHITE",
    color: "#D9D9D6",
    accent: "#A6A6A3",
    dark: "#6E6E69",
    tag: "高階修復",
    system: "重度耗損・全身修復・高階防護",
    wish: "讓身體重新恢復它原本該有的力量。",
    headline: "高階修復，重啟身體深層防禦",
    desc:
      "鉑金白是高階修復基底。當身體長期處於高壓、熬夜、代謝混亂與多系統耗損時，需要從根本重新建立防護。",
    ingredients: ["大黃豆", "大薏仁", "生核桃", "奇亞籽", "大燕麥", "礦泉水"],
    benefits: ["優質植物蛋白", "高階細胞修復", "穩定基礎代謝", "全身性抗發炎支持"],
    kcal: "82.0",
    protein: "5.5g",
    fat: "4.0g",
    carb: "7.0g",
    bestFor: ["重度疲勞", "高壓耗損", "修復期", "需要全面打底"],
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
  {
    q: "常常覺得疲勞，即使睡醒之後仍然沒有精神？",
    sys: "神經系統・能量代謝",
    productId: "pearl",
  },
  {
    q: "注意力難以集中，思考變慢，或常出現腦霧感？",
    sys: "大腦神經・專注力",
    productId: "pearl",
  },
  {
    q: "經常腹脹、消化不良、便祕，或腹瀉與便祕交替？",
    sys: "消化系統・腸道屏障",
    productId: "emerald",
  },
  {
    q: "身體經常沉重、水腫，或覺得代謝不乾淨？",
    sys: "排毒系統・水分代謝",
    productId: "emerald",
  },
  {
    q: "皮膚暗沉、氣色差、容易乾癢，或近期明顯掉髮？",
    sys: "膠原循環・皮膚屏障",
    productId: "rose",
  },
  {
    q: "容易嘴破、牙齦出血、氣色蒼白，或覺得臉色不夠紅潤？",
    sys: "微血管・氣色循環",
    productId: "rose",
  },
  {
    q: "肌肉或關節經常痠痛、僵硬、緊繃，運動後恢復很慢？",
    sys: "肌肉骨骼・發炎反應",
    productId: "diamond",
  },
  {
    q: "體力明顯下降，爬樓梯容易喘，或覺得肌肉力量不夠？",
    sys: "肌肉能量・體態管理",
    productId: "diamond",
  },
  {
    q: "長時間使用手機或電腦後，眼睛容易乾澀、酸痛、畏光？",
    sys: "視覺神經・3C 防護",
    productId: "crystal",
  },
  {
    q: "視力容易模糊、眼睛疲勞，或夜間看東西比較吃力？",
    sys: "視覺感知・抗氧化",
    productId: "crystal",
  },
  {
    q: "經常壓力巨大、焦慮、情緒起伏，休假也無法真正放鬆？",
    sys: "內分泌・壓力荷爾蒙",
    productId: "platinum",
  },
  {
    q: "經常渴望甜食、澱粉、手搖飲，吃完飯後容易想睡？",
    sys: "血糖系統・代謝阻抗",
    productId: "platinum",
  },
];

function useFont() {
  useEffect(() => {
    const id = "phytologic-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;600;700;900&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,500;1,600&family=JetBrains+Mono:wght@400;600;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

function useInView(ref, threshold = 0.12) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, threshold]);
  return visible;
}

function findProduct(id) {
  return PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];
}

function getDominantProduct(answers, profile) {
  const productScores = Object.fromEntries(PRODUCTS.map((p) => [p.id, 0]));
  QUIZ_BANK.forEach((item, index) => {
    const val = answers[index] || 0;
    productScores[item.productId] += val;
  });

  if (profile.sleep === "經常熬夜" || profile.sleep === "睡眠品質差") productScores.pearl += 2;
  if (profile.workType === "久坐上班") productScores.emerald += 2;
  if (profile.workType === "勞動工作" || profile.exercise === "高強度訓練") productScores.diamond += 2;
  if (profile.workType === "學生") productScores.crystal += 1;
  if (profile.gender === "女性") productScores.rose += 1;
  if (profile.age === "50～60" || profile.age === "65～75") productScores.platinum += 1;

  const [id] = Object.entries(productScores).sort((a, b) => b[1] - a[1])[0];
  return findProduct(id);
}

function getLevel(score) {
  if (score >= 19) {
    return {
      label: "高度系統性發炎",
      color: "#9E4A56",
      message:
        "身體可能正處於多系統高壓耗損狀態。建議立即降低精緻糖、油炸與加工食品，建立固定睡眠，並以高階修復型植萃作為日常調養起點。若症狀明顯，建議諮詢醫師或營養師。",
    };
  }
  if (score >= 12) {
    return {
      label: "中度發炎耗損",
      color: "#D8A133",
      message:
        "身體已出現多項慢性發炎警訊，常見於熬夜、外食、高壓與代謝負擔。建議從腸胃代謝、睡眠與抗氧化攝取三個方向同步調整。",
    };
  }
  if (score >= 5) {
    return {
      label: "輕度微幅發炎",
      color: "#7566A8",
      message:
        "目前屬於可逆的微幅耗損狀態。建議維持穩定作息、增加天然蔬果與膳食纖維，並依照主要不適系統選擇對應植萃。",
    };
  }
  return {
    label: "健康綠燈穩定",
    color: "#3E6B4B",
    message:
      "目前發炎負荷偏低，身體狀態穩定。建議持續維持乾淨飲食、規律活動與足夠睡眠，將健康變成長期可以持續的生活方式。",
  };
}

function Logo({ compact = false }) {
  return (
    <div className="logoWrap">
      <svg viewBox="0 0 100 100" className="logoMark" aria-label="PHYTOLOGIC logo">
        <defs>
          <linearGradient id="logoGrad" x1="0" x2="1">
            <stop offset="0%" stopColor="#2F5239" />
            <stop offset="100%" stopColor="#4D7C59" />
          </linearGradient>
        </defs>
        <polygon points="50,5 90,27 90,73 50,95 10,73 10,27" fill="url(#logoGrad)" />
        <path
          d="M50,95 C62,70 82,58 80,28 C63,42 56,63 50,95 Z"
          fill="#FFFFFF"
          opacity="0.95"
        />
      </svg>
      {!compact && (
        <div>
          <div className="logoText">PHYTOLOGIC</div>
          <div className="logoSub">植本邏輯</div>
        </div>
      )}
    </div>
  );
}

function ColorOrbs() {
  return (
    <div className="heroOrbs" aria-hidden="true">
      {PRODUCTS.map((p, i) => (
        <span
          key={p.id}
          className={`floatingOrb orb${i + 1}`}
          style={{ background: p.color, boxShadow: `0 30px 80px ${p.color}55` }}
        />
      ))}
    </div>
  );
}

function ProductOrb({ product, size = 72 }) {
  const light = product.id === "pearl" || product.id === "platinum";
  return (
    <div
      className="productOrb"
      style={{
        width: size,
        height: size,
        background: product.color,
        border: light ? "1px solid rgba(0,0,0,.08)" : "none",
        boxShadow: light
          ? "inset 0 10px 20px rgba(0,0,0,.04), 0 18px 45px rgba(0,0,0,.08)"
          : `0 18px 45px ${product.color}50`,
      }}
    />
  );
}

function ProductCard({ product, onClick }) {
  return (
    <button className="productCard" onClick={() => onClick(product)} type="button">
      <div className="productCardTop">
        <ProductOrb product={product} size={64} />
        <div>
          <div className="mono productEn">{product.en}</div>
          <h3>{product.name}</h3>
        </div>
      </div>
      <div className="productPill" style={{ color: product.dark, background: `${product.color}22` }}>
        {product.tag}
      </div>
      <p className="productWish">「{product.wish}」</p>
      <p className="productDesc">{product.desc}</p>
      <div className="productSystem">{product.system}</div>
    </button>
  );
}

function ProductModal({ product, onClose }) {
  useEffect(() => {
    const close = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [onClose]);

  return (
    <div className="modalBackdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modalHead">
          <div className="modalTitle">
            <ProductOrb product={product} size={76} />
            <div>
              <div className="mono">{product.en}</div>
              <h3>{product.name}</h3>
              <p>{product.system}</p>
            </div>
          </div>
          <button className="closeBtn" type="button" onClick={onClose}>
            ✕
          </button>
        </div>

        <blockquote style={{ color: product.dark }}>「{product.headline}」</blockquote>
        <p className="modalDesc">{product.desc}</p>

        <div className="modalGrid">
          <div>
            <div className="sectionMini">CORE INGREDIENTS</div>
            <div className="chips">
              {product.ingredients.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="sectionMini">BEST FOR</div>
            <div className="chips">
              {product.bestFor.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="benefitList">
          <div className="sectionMini">CORE BENEFITS</div>
          {product.benefits.map((b) => (
            <div className="benefitItem" key={b}>
              <span style={{ color: product.dark }}>✦</span>
              <span>{b}</span>
            </div>
          ))}
        </div>

        <div className="nutrition">
          {[
            ["熱量", product.kcal, "kcal"],
            ["蛋白質", product.protein, ""],
            ["脂肪", product.fat, ""],
            ["碳水", product.carb, ""],
          ].map(([label, val, unit]) => (
            <div key={label}>
              <strong>{val}</strong>
              <span>
                {label}
                {unit ? ` / ${unit}` : ""}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuizSystem() {
  const [stage, setStage] = useState("profile");
  const [profile, setProfile] = useState({
    gender: "",
    age: "",
    workType: "",
    sleep: "",
    exercise: "",
  });
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});

  const profileComplete = Object.values(profile).every(Boolean);
  const score = Object.values(answers).reduce((sum, val) => sum + val, 0);
  const progress = ((current + 1) / QUIZ_BANK.length) * 100;
  const resultProduct = useMemo(() => getDominantProduct(answers, profile), [answers, profile]);
  const level = getLevel(score);

  function chooseAnswer(val) {
    const next = { ...answers, [current]: val };
    setAnswers(next);
    if (current + 1 >= QUIZ_BANK.length) {
      setStage("result");
      return;
    }
    setCurrent((prev) => prev + 1);
  }

  function reset() {
    setStage("profile");
    setProfile({ gender: "", age: "", workType: "", sleep: "", exercise: "" });
    setCurrent(0);
    setAnswers({});
  }

  if (stage === "profile") {
    return (
      <div className="quizInner">
        <div className="mono quizPhase">PHASE 01 · BASIC PROFILE</div>
        <h3>先建立你的基礎狀態</h3>
        <p className="quizNote">派森會先理解你的性別、年齡、工作型態、睡眠與運動習慣，再開始分析身體發炎傾向。</p>

        <div className="profileGrid">
          {[
            ["gender", "性別"],
            ["age", "年齡"],
            ["workType", "工作型態"],
            ["sleep", "睡眠狀況"],
            ["exercise", "運動頻率"],
          ].map(([key, label]) => (
            <label key={key} className="selectLabel">
              <span>{label}</span>
              <select
                value={profile[key]}
                onChange={(e) => setProfile((prev) => ({ ...prev, [key]: e.target.value }))}
              >
                <option value="">請選擇</option>
                {PROFILE_OPTIONS[key].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>

        <button
          type="button"
          className="primaryBtn wide"
          disabled={!profileComplete}
          onClick={() => setStage("quiz")}
        >
          開始派森 AI 分析
        </button>
      </div>
    );
  }

  if (stage === "quiz") {
    const item = QUIZ_BANK[current];
    return (
      <div className="quizInner">
        <div className="quizProgressTop">
          <span className="mono">QUESTION {current + 1} / {QUIZ_BANK.length}</span>
          <span>{item.sys}</span>
        </div>
        <div className="progressLine">
          <i style={{ width: `${progress}%` }} />
        </div>

        <div className="questionCard">
          <h3>{item.q}</h3>
          <div className="answerList">
            {[
              ["從不 / 無此症狀", 0],
              ["偶爾 / 輕微感受", 1],
              ["經常 / 頻繁困擾", 2],
            ].map(([label, val]) => (
              <button type="button" key={label} onClick={() => chooseAnswer(val)}>
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
    <div className="quizInner result">
      <div className="resultHeader">
        <div className="mono">PAISEN DIAGNOSTIC REPORT</div>
        <h3 style={{ color: level.color }}>{level.label}</h3>
        <p>
          系統炎症總評分：<strong style={{ color: level.color }}>{score}</strong> / 24
        </p>
      </div>

      <div className="adviceBox" style={{ borderColor: `${level.color}33`, background: `${level.color}08` }}>
        <div className="sectionMini" style={{ color: level.color }}>AI HEALTH ADVICE</div>
        <p>{level.message}</p>
      </div>

      <div className="recommendBox">
        <div className="sectionMini">AI TARGETED BLEND</div>
        <div className="recommendMain">
          <ProductOrb product={resultProduct} size={76} />
          <div>
            <div className="mono">{resultProduct.en}</div>
            <h4>{resultProduct.name}</h4>
            <p>「{resultProduct.headline}」</p>
            <small>{resultProduct.system}</small>
          </div>
        </div>
      </div>

      <div className="dailyPlan">
        <div className="sectionMini">TODAY'S MINI PLAN</div>
        <ul>
          <li>今天先減少精緻糖、油炸與高鹽加工食品。</li>
          <li>晚餐增加一份深色蔬菜，並提前 30 分鐘放下手機。</li>
          <li>今日代表色：<strong style={{ color: resultProduct.dark }}>{resultProduct.name}</strong>。</li>
        </ul>
      </div>

      <div className="resultActions">
        <a className="primaryBtn" href="#trial">申請試飲體驗</a>
        <button type="button" className="ghostBtn" onClick={reset}>重新分析</button>
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

  const mailBody = encodeURIComponent(
    `試飲申請\n\n姓名：${form.name}\n電話：${form.phone}\n城市：${form.city}\n身體困擾：${form.concern}`
  );

  return (
    <form className="trialForm" onSubmit={(e) => e.preventDefault()}>
      <div className="formGrid">
        {[
          ["name", "姓名"],
          ["phone", "電話"],
          ["city", "城市"],
        ].map(([key, label]) => (
          <label key={key}>
            <span>{label}</span>
            <input
              value={form[key]}
              onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
              placeholder={`請輸入${label}`}
            />
          </label>
        ))}
      </div>
      <label>
        <span>目前最想改善的身體狀態</span>
        <textarea
          value={form.concern}
          onChange={(e) => setForm((prev) => ({ ...prev, concern: e.target.value }))}
          placeholder="例如：疲勞、便祕、睡不好、眼睛乾澀、想控制體態..."
        />
      </label>
      <a className="primaryBtn wide" href={`mailto:bryan@phytologic.tw?subject=植本邏輯試飲申請&body=${mailBody}`}>
        送出試飲申請
      </a>
    </form>
  );
}

export default function App() {
  useFont();

  const [activeProduct, setActiveProduct] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const storyRef = useRef(null);
  const productsRef = useRef(null);
  const quizRef = useRef(null);
  const trialRef = useRef(null);

  const storyVisible = useInView(storyRef);
  const productsVisible = useInView(productsRef);
  const quizVisible = useInView(quizRef);
  const trialVisible = useInView(trialRef);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="app">
      <style>{CSS}</style>

      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <Logo />
        <div className="navLinks">
          <a href="#story">品牌故事</a>
          <a href="#products">六色植萃</a>
          <a href="#quiz">派森 AI</a>
          <a href="#trial">試飲申請</a>
        </div>
      </nav>

      <a className="floatingCta" href="#quiz">
        <span>派森 AI</span>
        <b>立即分析</b>
      </a>

      <header className="hero">
        <ColorOrbs />
        <div className="heroContent">
          <div className="mono heroKicker">重視生命。尊重自然。相信邏輯。</div>
          <h1>
            健康不是為了活得久。
            <br />
            而是為了能 <em>好好陪伴。</em>
          </h1>
          <p>
            我們不是在做飲料，而是真正每天會進入人體、長期被身體吸收的植物機能系統。
            從愛出發，結合科學與自然，守護人生裡真正重要的人。
          </p>
          <div className="heroActions">
            <a className="primaryBtn" href="#products">探索六色植萃</a>
            <a className="ghostBtn" href="#quiz">派森 AI 分析</a>
          </div>
        </div>
      </header>

      <section id="story" ref={storyRef} className="section story">
        <div className={`sectionGrid ${storyVisible ? "show" : ""}`}>
          <div>
            <div className="sectionKicker">BRAND STORY</div>
            <h2>
              六個家庭，重新理解健康之後的人生答案。
            </h2>
            <p>
              50歲那年成為父親，當孩子出生的那一刻，我第一次認真思考：「我還有多久能陪他？」
            </p>
            <p>
              植本邏輯不是從商業開始，而是從愛開始。不是做給市場看的商品，而是做給家人每天都敢吃的食物。
            </p>
          </div>
          <div className="principles">
            {[
              ["三好原則", "好喝", "能持續，才會真正改變。"],
              ["三好原則", "好看", "用美成就美，用好成就好。"],
              ["三好原則", "好吸收", "給身體恰到好處的需要。"],
              ["三無鐵律", "無人工", "只給家人真正的食物。"],
              ["三無鐵律", "無化學", "不給家人吃實驗室合成物。"],
              ["三無鐵律", "無合成", "讓家人品嚐真正自然味道。"],
            ].map(([type, title, desc]) => (
              <div key={title} className="principleCard">
                <small>{type}</small>
                <strong>{title}</strong>
                <span>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="products" ref={productsRef} className="section products">
        <div className={`sectionHead ${productsVisible ? "show" : ""}`}>
          <div className="sectionKicker">SIX COLOR SYSTEM</div>
          <h2>每一種顏色，都是人生。</h2>
          <p>不是賣營養名詞，而是回到你真正想守護的生活狀態。</p>
        </div>

        <div className={`productGrid ${productsVisible ? "show" : ""}`}>
          {PRODUCTS.map((p) => (
            <ProductCard key={p.id} product={p} onClick={setActiveProduct} />
          ))}
        </div>
      </section>

      <section id="quiz" ref={quizRef} className="section quizSection">
        <div className={`quizGrid ${quizVisible ? "show" : ""}`}>
          <div>
            <div className="sectionKicker green">PAISEN AI HEALTH SYSTEM</div>
            <h2>派森 AI 功能醫學炎症分析</h2>
            <p>
              先建立基本資料，再透過七大生理系統問卷，分析你的主要耗損來源，
              並推薦最適合的六色植萃與今日生活修復方向。
            </p>

            <div className="featureList">
              {[
                ["🧬", "七大系統評估", "神經、腸胃、排毒、血糖、內分泌、肌肉骨骼與免疫。"],
                ["📊", "炎症負荷評分", "將身體訊號轉換成可理解的分數與調養方向。"],
                ["🍵", "對齊六色植萃", "依據主要耗損系統，推薦最契合的植物機能飲。"],
                ["💬", "LINE 會員入口", "未來可延伸為每日健康提醒、幸運色與會員追蹤。"],
              ].map(([icon, title, desc]) => (
                <div key={title} className="featureItem">
                  <span>{icon}</span>
                  <div>
                    <strong>{title}</strong>
                    <p>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="quizCard">
            <div className="quizCardTitle">
              <strong>派森系統評估</strong>
              <span className="mono">PAISEN CLINICAL ANALYSIS</span>
            </div>
            <QuizSystem />
          </div>
        </div>
      </section>

      <section id="trial" ref={trialRef} className="section trial">
        <div className={`trialGrid ${trialVisible ? "show" : ""}`}>
          <div>
            <div className="sectionKicker">CONVERSION SYSTEM</div>
            <h2>先讓身體試一次，再讓市場相信。</h2>
            <p>
              植本邏輯最強的成交策略，是讓更多人真正喝到、感受到、願意持續。
              留下資料後，我們將安排試飲體驗與後續健康分析建議。
            </p>
            <div className="ctaPanel">
              <strong>LINE 官方導流</strong>
              <p>未來可將此按鈕改為你的 LINE 官方帳號連結，承接會員、問卷與每日推播。</p>
              <a className="ghostBtn" href="https://line.me" target="_blank" rel="noreferrer">
                加入 LINE 官方帳號
              </a>
            </div>
          </div>
          <TrialForm />
        </div>
      </section>

      <section className="section franchise">
        <div className="franchiseBox">
          <div>
            <div className="sectionKicker green">CITY PARTNER</div>
            <h2>城市合夥人與加盟展準備中</h2>
            <p>
              從產品供應、AI 健康系統、會員經營到試飲轉化，植本邏輯將建立一套可複製的城市健康據點模型。
            </p>
          </div>
          <a className="primaryBtn" href="mailto:bryan@phytologic.tw?subject=城市合夥人洽詢">
            洽詢城市合夥
          </a>
        </div>
      </section>

      <footer className="footer">
        <Logo />
        <div>
          <strong>真正重要的人，值得最乾淨的選擇。</strong>
          <span>© 2026 PHYTOLOGIC. bryan@phytologic.tw</span>
        </div>
      </footer>

      {activeProduct && (
        <ProductModal product={activeProduct} onClose={() => setActiveProduct(null)} />
      )}
    </div>
  );
}

const CSS = `
:root{
  --green:#3E6B4B;
  --green-dark:#263F2D;
  --ink:#191919;
  --muted:#666;
  --line:rgba(0,0,0,.07);
  --cream:#F8F7F2;
  --white:#fff;
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
.mono{font-family:'JetBrains Mono',monospace;letter-spacing:.12em}
a{text-decoration:none;color:inherit}
button,input,textarea,select{font-family:inherit}
button{cursor:pointer}
.nav{
  position:fixed;top:0;left:0;right:0;z-index:1000;
  display:flex;align-items:center;justify-content:space-between;
  padding:26px 64px;
  transition:.35s ease;
}
.nav.scrolled{
  padding:16px 64px;
  background:rgba(255,255,255,.88);
  backdrop-filter:blur(18px);
  border-bottom:1px solid rgba(0,0,0,.06);
}
.logoWrap{display:flex;align-items:center;gap:14px}
.logoMark{width:44px;height:44px;display:block}
.logoText{
  font-family:'JetBrains Mono',monospace;
  font-size:16px;
  font-weight:700;
  letter-spacing:.18em;
}
.logoSub{font-size:11px;color:#777;letter-spacing:.18em;margin-top:2px}
.navLinks{display:flex;gap:34px;font-size:14px;font-weight:700;letter-spacing:.06em}
.navLinks a{opacity:.86;transition:.25s}
.navLinks a:hover{opacity:1;color:var(--green)}
.floatingCta{
  position:fixed;right:28px;bottom:28px;z-index:900;
  display:flex;flex-direction:column;gap:2px;
  padding:14px 22px;border-radius:999px;
  color:#fff;background:linear-gradient(135deg,#2F5239,#4D7C59);
  box-shadow:0 18px 44px rgba(47,82,57,.28);
}
.floatingCta span{font-size:11px;opacity:.75}
.floatingCta b{font-size:14px;letter-spacing:.08em}
.hero{
  min-height:100vh;
  position:relative;
  display:flex;align-items:center;justify-content:center;
  padding:150px 64px 90px;
  background:
    radial-gradient(circle at 70% 30%,rgba(62,107,75,.055),transparent 34%),
    linear-gradient(180deg,#FFFFFF 0%,#FBFBF8 100%);
  overflow:hidden;
}
.hero:before{
  content:"";
  position:absolute;inset:0;
  background-image:
    linear-gradient(rgba(62,107,75,.035) 1px, transparent 1px),
    linear-gradient(90deg,rgba(62,107,75,.035) 1px, transparent 1px);
  background-size:72px 72px;
  mask-image:radial-gradient(circle at center, black, transparent 75%);
}
.heroContent{
  position:relative;z-index:3;
  max-width:980px;text-align:center;
  animation:fadeUp 1s cubic-bezier(.16,1,.3,1) both;
}
.heroKicker{
  color:var(--green);
  font-size:12px;
  font-weight:700;
  margin-bottom:30px;
}
.hero h1{
  margin:0 0 30px;
  font-family:'Cormorant Garamond','Noto Serif TC',serif;
  font-size:clamp(52px,7vw,96px);
  line-height:1.04;
  letter-spacing:-.035em;
  font-weight:700;
}
.hero h1 em{color:var(--green);font-style:italic}
.hero p{
  max-width:720px;margin:0 auto 44px;
  font-size:18px;line-height:2.05;color:#606060;
}
.heroActions{display:flex;gap:16px;justify-content:center;flex-wrap:wrap}
.primaryBtn,.ghostBtn{
  display:inline-flex;align-items:center;justify-content:center;
  min-height:54px;padding:0 34px;border-radius:999px;
  font-size:15px;font-weight:800;letter-spacing:.06em;
  transition:.25s cubic-bezier(.16,1,.3,1);
  border:1px solid transparent;
}
.primaryBtn{background:var(--green);color:#fff;box-shadow:0 16px 35px rgba(62,107,75,.2)}
.ghostBtn{background:#fff;color:#202020;border-color:rgba(0,0,0,.1)}
.primaryBtn:hover,.ghostBtn:hover{transform:translateY(-3px)}
.primaryBtn:disabled{opacity:.35;cursor:not-allowed;transform:none}
.wide{width:100%}
.heroOrbs{position:absolute;inset:0;z-index:1;pointer-events:none}
.floatingOrb{
  position:absolute;display:block;border-radius:999px;
  filter:blur(18px);opacity:.35;
  animation:floatOrb 12s ease-in-out infinite alternate;
}
.orb1{width:180px;height:180px;left:8%;top:20%;animation-delay:-1s}
.orb2{width:260px;height:260px;right:8%;top:18%;animation-delay:-4s}
.orb3{width:150px;height:150px;left:18%;bottom:18%;animation-delay:-7s}
.orb4{width:170px;height:170px;right:26%;bottom:14%;animation-delay:-3s}
.orb5{width:190px;height:190px;right:7%;bottom:22%;animation-delay:-9s}
.orb6{width:120px;height:120px;left:44%;top:12%;animation-delay:-5s}
.section{padding:130px 64px}
.sectionKicker{
  font-family:'JetBrains Mono',monospace;
  letter-spacing:.16em;
  font-size:11px;
  color:#888;
  font-weight:700;
  margin-bottom:18px;
}
.sectionKicker.green{color:var(--green)}
.section h2{
  font-family:'Cormorant Garamond','Noto Serif TC',serif;
  font-size:clamp(40px,5vw,62px);
  line-height:1.15;
  letter-spacing:-.025em;
  margin:0 0 28px;
}
.section p{font-size:16px;line-height:2;color:#5d5d5d}
.sectionGrid,.quizGrid,.trialGrid{
  max-width:1240px;margin:0 auto;
  display:grid;grid-template-columns:1fr 1fr;gap:88px;align-items:center;
  opacity:0;transform:translateY(24px);transition:.8s cubic-bezier(.16,1,.3,1);
}
.sectionGrid.show,.quizGrid.show,.trialGrid.show,.sectionHead.show,.productGrid.show{opacity:1;transform:none}
.story{background:#FAFAFA}
.principles{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.principleCard{
  background:#fff;border:1px solid rgba(0,0,0,.045);
  border-radius:24px;padding:26px;
  box-shadow:0 18px 40px rgba(0,0,0,.025);
}
.principleCard small{display:block;color:var(--green);font-weight:900;font-size:12px;margin-bottom:8px}
.principleCard strong{display:block;font-size:24px;margin-bottom:8px}
.principleCard span{font-size:13px;color:#666;line-height:1.7}
.products{background:#fff}
.sectionHead{
  max-width:760px;margin:0 auto 70px;text-align:center;
  opacity:0;transform:translateY(24px);transition:.8s cubic-bezier(.16,1,.3,1);
}
.productGrid{
  max-width:1320px;margin:0 auto;
  display:grid;grid-template-columns:repeat(3,1fr);gap:22px;
  opacity:0;transform:translateY(24px);transition:.8s cubic-bezier(.16,1,.3,1) .1s;
}
.productCard{
  text-align:left;background:#fff;border:1px solid rgba(0,0,0,.06);
  border-radius:28px;padding:34px 30px;
  box-shadow:0 8px 24px rgba(0,0,0,.02);
  transition:.35s cubic-bezier(.16,1,.3,1);
}
.productCard:hover{
  transform:translateY(-8px);
  border-color:rgba(62,107,75,.25);
  box-shadow:0 24px 55px rgba(0,0,0,.06);
}
.productCardTop{display:flex;align-items:center;gap:18px;margin-bottom:24px}
.productOrb{border-radius:999px;flex-shrink:0}
.productEn{font-size:10px;color:#999;margin-bottom:4px}
.productCard h3{
  margin:0;font-family:'Cormorant Garamond','Noto Serif TC',serif;
  font-size:29px;line-height:1;
}
.productPill{
  display:inline-flex;border-radius:999px;padding:7px 15px;
  font-size:12px;font-weight:900;margin-bottom:16px;
}
.productWish{
  font-family:'Cormorant Garamond','Noto Serif TC',serif;
  font-size:21px!important;line-height:1.55!important;
  color:#1e1e1e!important;font-style:italic;margin:0 0 12px;
}
.productDesc{
  margin:0 0 18px!important;
  font-size:14px!important;line-height:1.85!important;
}
.productSystem{
  padding-top:16px;border-top:1px solid rgba(0,0,0,.06);
  font-size:12px;color:#777;letter-spacing:.04em;
}
.quizSection{
  background:
    radial-gradient(circle at 20% 0%,rgba(62,107,75,.07),transparent 30%),
    #F8F7F2;
}
.quizGrid{grid-template-columns:.92fr 1.08fr;align-items:start}
.featureList{display:grid;gap:14px;margin-top:28px}
.featureItem{
  display:flex;gap:16px;background:#fff;border:1px solid rgba(0,0,0,.045);
  border-radius:18px;padding:18px;
}
.featureItem>span{font-size:22px}
.featureItem strong{display:block;margin-bottom:4px}
.featureItem p{margin:0!important;font-size:13px!important;line-height:1.65!important}
.quizCard{
  background:#fff;border:1px solid rgba(0,0,0,.06);
  border-radius:34px;padding:42px;
  box-shadow:0 28px 65px rgba(0,0,0,.045);
}
.quizCardTitle{margin-bottom:26px}
.quizCardTitle strong{
  display:block;font-family:'Cormorant Garamond','Noto Serif TC',serif;
  font-size:28px;color:var(--green);
}
.quizCardTitle span{font-size:10px;color:#999}
.quizInner h3{
  margin:0 0 16px;
  font-family:'Cormorant Garamond','Noto Serif TC',serif;
  font-size:32px;line-height:1.25;
}
.quizPhase{font-size:11px;color:var(--green);font-weight:700;margin-bottom:14px}
.quizNote{font-size:14px!important;line-height:1.8!important;margin-bottom:24px!important}
.profileGrid{display:grid;gap:14px;margin-bottom:24px}
.selectLabel span,.trialForm label span{
  display:block;font-size:12px;font-weight:900;color:#555;margin-bottom:8px;
}
.selectLabel select,.trialForm input,.trialForm textarea{
  width:100%;border:1px solid rgba(0,0,0,.09);background:#FBFBFA;
  border-radius:16px;padding:15px 16px;font-size:15px;color:#222;
  outline:none;transition:.2s;
}
.selectLabel select:focus,.trialForm input:focus,.trialForm textarea:focus{
  border-color:rgba(62,107,75,.45);background:#fff;
}
.quizProgressTop{
  display:flex;justify-content:space-between;gap:14px;align-items:center;
  margin-bottom:12px;font-size:12px;color:#777;
}
.quizProgressTop .mono{color:var(--green);font-weight:700}
.progressLine{height:3px;background:rgba(0,0,0,.06);border-radius:999px;margin-bottom:24px;overflow:hidden}
.progressLine i{display:block;height:100%;background:var(--green);transition:.35s ease}
.questionCard{
  background:#FAFAF8;border:1px solid rgba(0,0,0,.045);
  border-radius:24px;padding:30px;
}
.questionCard h3{
  font-family:'Noto Serif TC',serif;
  font-size:21px;line-height:1.75;margin-bottom:28px;
}
.answerList{display:grid;gap:12px}
.answerList button{
  display:flex;align-items:center;justify-content:space-between;
  width:100%;padding:17px 20px;background:#fff;border:1px solid rgba(0,0,0,.075);
  border-radius:16px;font-weight:800;color:#2b2b2b;transition:.25s;
}
.answerList button:hover{transform:translateY(-2px);border-color:rgba(62,107,75,.32)}
.answerList b{font-family:'JetBrains Mono',monospace;color:#999;font-size:12px}
.resultHeader{text-align:center;padding-bottom:26px;border-bottom:1px solid rgba(0,0,0,.07);margin-bottom:26px}
.resultHeader .mono{font-size:11px;color:#999;margin-bottom:10px}
.resultHeader h3{font-size:36px;margin-bottom:8px}
.resultHeader p{margin:0!important;font-size:14px!important}
.adviceBox,.recommendBox,.dailyPlan{
  border:1px solid rgba(0,0,0,.07);border-radius:22px;padding:24px;margin-bottom:18px;
}
.sectionMini{
  font-family:'JetBrains Mono',monospace;
  letter-spacing:.14em;font-size:11px;font-weight:800;color:#888;margin-bottom:12px;
}
.adviceBox p{font-size:14px!important;line-height:1.9!important;margin:0!important}
.recommendMain{display:flex;align-items:center;gap:18px}
.recommendMain h4{
  margin:4px 0 4px;font-size:28px;
  font-family:'Cormorant Garamond','Noto Serif TC',serif;
}
.recommendMain p,.recommendMain small{display:block;margin:0;color:#666;line-height:1.7}
.dailyPlan ul{margin:0;padding-left:20px;color:#555;line-height:1.9;font-size:14px}
.resultActions{display:flex;gap:12px;margin-top:24px}
.trial{
  background:
    linear-gradient(180deg,#fff 0%,#FAFAFA 100%);
}
.trialGrid{align-items:start}
.ctaPanel{
  margin-top:28px;background:#F8F7F2;border:1px solid rgba(0,0,0,.055);
  border-radius:24px;padding:26px;
}
.ctaPanel strong{font-size:20px}
.ctaPanel p{font-size:14px!important;margin:8px 0 18px!important}
.trialForm{
  background:#fff;border:1px solid rgba(0,0,0,.06);
  border-radius:32px;padding:36px;
  box-shadow:0 24px 60px rgba(0,0,0,.04);
}
.formGrid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.trialForm label{display:block;margin-bottom:16px}
.trialForm textarea{min-height:132px;resize:vertical}
.franchise{background:#F8F7F2;padding-top:80px}
.franchiseBox{
  max-width:1180px;margin:0 auto;background:#fff;border:1px solid rgba(0,0,0,.06);
  border-radius:34px;padding:46px;
  display:flex;justify-content:space-between;gap:40px;align-items:center;
}
.franchiseBox p{max-width:680px;margin-bottom:0!important}
.footer{
  padding:54px 64px;background:#fff;border-top:1px solid rgba(0,0,0,.06);
  display:flex;align-items:center;justify-content:space-between;gap:24px;
}
.footer>div:last-child{display:flex;flex-direction:column;gap:6px;text-align:right}
.footer strong{font-size:14px}
.footer span{font-family:'JetBrains Mono',monospace;font-size:11px;color:#999}
.modalBackdrop{
  position:fixed;inset:0;z-index:2000;background:rgba(255,255,255,.82);
  backdrop-filter:blur(18px);display:flex;align-items:center;justify-content:center;
  padding:24px;
}
.modal{
  width:min(760px,100%);max-height:88vh;overflow:auto;
  background:#fff;border:1px solid rgba(0,0,0,.08);
  border-radius:34px;padding:44px;
  box-shadow:0 34px 90px rgba(0,0,0,.12);
  animation:pop .35s cubic-bezier(.16,1,.3,1) both;
}
.modalHead{display:flex;justify-content:space-between;align-items:flex-start;gap:22px;margin-bottom:28px}
.modalTitle{display:flex;align-items:center;gap:20px}
.modalTitle .mono{font-size:11px;color:#999;margin-bottom:5px}
.modalTitle h3{
  margin:0;font-family:'Cormorant Garamond','Noto Serif TC',serif;
  font-size:38px;
}
.modalTitle p{margin:5px 0 0!important;font-size:13px!important;line-height:1.5!important}
.closeBtn{
  width:38px;height:38px;border-radius:999px;border:0;background:#F2F2F0;color:#555;
}
.modal blockquote{
  margin:0 0 18px;
  font-size:27px;line-height:1.55;font-weight:900;
}
.modalDesc{font-size:15px!important;line-height:2!important;margin-bottom:28px!important}
.modalGrid{display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-bottom:26px}
.chips{display:flex;gap:9px;flex-wrap:wrap}
.chips span{
  background:#F6F6F3;border:1px solid rgba(0,0,0,.05);
  border-radius:999px;padding:8px 12px;font-size:12px;font-weight:800;color:#555;
}
.benefitList{margin-bottom:26px}
.benefitItem{display:flex;gap:10px;align-items:flex-start;font-size:15px;line-height:1.7;margin-bottom:8px}
.nutrition{
  display:grid;grid-template-columns:repeat(4,1fr);
  background:#F8F7F2;border:1px solid rgba(0,0,0,.05);
  border-radius:22px;padding:22px;
}
.nutrition div{text-align:center}
.nutrition strong{
  display:block;font-family:'Cormorant Garamond',serif;
  font-size:28px;margin-bottom:4px;
}
.nutrition span{font-size:11px;color:#777}
@keyframes fadeUp{
  from{opacity:0;transform:translateY(34px)}
  to{opacity:1;transform:translateY(0)}
}
@keyframes floatOrb{
  from{transform:translate3d(0,0,0) scale(1)}
  to{transform:translate3d(30px,-28px,0) scale(1.12)}
}
@keyframes pop{
  from{opacity:0;transform:scale(.96) translateY(12px)}
  to{opacity:1;transform:scale(1) translateY(0)}
}
@media (max-width: 980px){
  .nav{padding:18px 24px}.nav.scrolled{padding:14px 24px}
  .navLinks{display:none}
  .hero{padding:128px 24px 70px}
  .hero p{font-size:16px}
  .section{padding:86px 24px}
  .sectionGrid,.quizGrid,.trialGrid{grid-template-columns:1fr;gap:44px}
  .productGrid{grid-template-columns:1fr}
  .principles{grid-template-columns:1fr}
  .quizCard,.trialForm{padding:28px 22px;border-radius:26px}
  .formGrid{grid-template-columns:1fr}
  .franchiseBox{flex-direction:column;align-items:flex-start;padding:30px}
  .footer{flex-direction:column;align-items:flex-start;padding:38px 24px}
  .footer>div:last-child{text-align:left}
  .modal{padding:28px 22px}
  .modalGrid,.nutrition{grid-template-columns:1fr}
  .nutrition{gap:16px}
  .floatingCta{right:18px;bottom:18px}
}
`;
