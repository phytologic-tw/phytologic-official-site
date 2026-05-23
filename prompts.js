// ============================================================
// 植本邏輯 AI 分析 Prompt 系統 V2.0
// 檔案：api/prompts.js
// 用途：LINE 完整報告生成、七天計畫生成、每日訊息生成
// ============================================================

// ------------------------------------------------------------
// 工具函數：計算生命靈數
// ------------------------------------------------------------
export function calcLifeNumber(birthdate) {
  // birthdate: "YYYY-MM-DD"
  const digits = birthdate.replace(/-/g, "").split("").map(Number);
  let sum = digits.reduce((a, b) => a + b, 0);
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = String(sum).split("").map(Number).reduce((a, b) => a + b, 0);
  }
  return sum;
}

// ------------------------------------------------------------
// 工具函數：計算星座
// ------------------------------------------------------------
export function calcZodiac(birthdate) {
  const date = new Date(birthdate);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const zodiacs = [
    { sign: "摩羯座", element: "土", end: [1, 19] },
    { sign: "水瓶座", element: "風", end: [2, 18] },
    { sign: "雙魚座", element: "水", end: [3, 20] },
    { sign: "牡羊座", element: "火", end: [4, 19] },
    { sign: "金牛座", element: "土", end: [5, 20] },
    { sign: "雙子座", element: "風", end: [6, 20] },
    { sign: "巨蟹座", element: "水", end: [7, 22] },
    { sign: "獅子座", element: "火", end: [8, 22] },
    { sign: "處女座", element: "土", end: [9, 22] },
    { sign: "天秤座", element: "風", end: [10, 22] },
    { sign: "天蠍座", element: "水", end: [11, 21] },
    { sign: "射手座", element: "火", end: [12, 21] },
    { sign: "摩羯座", element: "土", end: [12, 31] },
  ];
  for (const z of zodiacs) {
    if (month < z.end[0] || (month === z.end[0] && day <= z.end[1])) {
      return { sign: z.sign, element: z.element };
    }
  }
  return { sign: "摩羯座", element: "土" };
}

// ------------------------------------------------------------
// 工具函數：血型體質傾向
// ------------------------------------------------------------
export function getBloodTypeTrait(bloodType) {
  const traits = {
    A: {
      trait: "腸胃較敏感，偏向植物性蛋白消化，壓力容易積累在消化系統",
      risk: "壓力性腸胃炎、過敏反應偏強",
      affinity: "青檸植萃（代謝排毒）、雪山植萃（腸胃舒緩）",
    },
    B: {
      trait: "代謝彈性較好，但免疫系統容易過度反應，過敏傾向明顯",
      risk: "季節性過敏、免疫波動",
      affinity: "雪山植萃（修復）、玫瑰植萃（免疫平衡）",
    },
    AB: {
      trait: "混合體質，兼具 A 型腸胃敏感與 B 型免疫特性，需要多面向補充",
      risk: "複合型發炎、腸胃與免疫雙重壓力",
      affinity: "建議完整七天輪換計畫，不偏重單一飲品",
    },
    O: {
      trait: "消化酵素旺盛、新陳代謝較強，但壓力型發炎明顯，容易影響情緒",
      risk: "壓力性發炎、血糖波動、情緒型飲食",
      affinity: "玫瑰植萃（情緒舒緩）、雪山植萃（抗發炎）",
    },
  };
  return traits[bloodType] || traits["AB"];
}

// ------------------------------------------------------------
// 工具函數：生命靈數人格特質
// ------------------------------------------------------------
export function getLifeNumberTrait(num) {
  const traits = {
    1: { personality: "領導型人格，容易因掌控需求積累壓力", stressPattern: "頭痛、肩頸緊繃、睡眠淺", color: "紅色" },
    2: { personality: "協調型人格，容易為他人著想而忽略自身需求", stressPattern: "腸胃敏感、情緒起伏", color: "橙色" },
    3: { personality: "創意表達型，壓力來自表達受阻或創意無法發揮", stressPattern: "腸胃緊張、喉嚨不適", color: "黃色" },
    4: { personality: "穩定建構型，追求秩序，壓力來自失控與不確定", stressPattern: "肌肉僵硬、腰背痠痛", color: "綠色" },
    5: { personality: "自由冒險型，厭倦重複，容易因缺乏變化而焦慮", stressPattern: "神經緊張、消化不規律", color: "藍色" },
    6: { personality: "責任照顧型，對自己與他人要求高，容易過勞", stressPattern: "慢性疲勞、免疫下降", color: "靛色" },
    7: { personality: "深度思考型，容易過度分析與內耗", stressPattern: "睡眠障礙、神經壓力、腦霧", color: "紫色" },
    8: { personality: "成就驅動型，工作優先，容易忽略身體訊號", stressPattern: "心血管壓力、腎上腺疲勞", color: "金色" },
    9: { personality: "理想主義型，情感豐沛，容易因理想落差而內耗", stressPattern: "免疫波動、情緒型發炎", color: "白色" },
    11: { personality: "直覺型領袖，高度敏感，容易因環境能量影響身體", stressPattern: "神經系統過敏、睡眠品質差", color: "銀色" },
    22: { personality: "建設者靈數，責任感超強，容易慢性過勞", stressPattern: "慢性發炎、全身疲勞", color: "金色" },
  };
  return traits[num] || traits[9];
}

// ------------------------------------------------------------
// 主 Prompt：LINE 完整個人化報告
// 整合：網頁快篩（7題）+ 會員建檔（7項）+ LINE 第二次問卷（7題）
// ------------------------------------------------------------
export function buildFullReportPrompt({
  // 身體基本資料（來自網頁快篩）
  gender,
  ageGroup,
  bmi,
  workType,
  sleepQuality,
  exerciseHabit,

  // 會員建檔資料（7項）
  nickname,
  birthdate,
  bloodType,
  city,
  sleepHours,
  dietPattern,
  stressLevel,

  // 計算後的體質標籤
  lifeNumber,
  lifeNumberTrait,
  zodiac,
  zodiacElement,
  bloodTypeTrait,

  // 城市氣候資料
  cityClimate,

  // 網頁快篩結果（7題）
  webSurveyTotal,
  webSurveyLevel,
  webCategorySummary,
  webAnswerSummary,

  // LINE 第二次問卷（7題）
  lineSurveyAnswers,

  // 推薦飲品（快篩計算結果）
  recommendedProductId,
  recommendedProductName,
}) {
  const productList = `
snow｜雪山植萃｜抗發炎修復・腸胃舒緩｜適合：疲勞、腦霧、睡眠品質差、腸胃敏感
lime｜青檸植萃｜代謝排毒・體內環保｜適合：排便問題、腹脹、水腫、血糖波動、甜食渴望
rose｜玫瑰植萃｜女性保養・抗老美容｜適合：荷爾蒙、肌膚、免疫、氣色、抗老
cinna｜桂香植萃｜運動恢復・增肌減脂｜適合：肌肉關節痠痛、體能下降、運動恢復
berry｜紫莓植萃｜護眼抗氧化・3C族群｜適合：眼睛乾澀、3C疲勞、神經壓力、抗氧化
  `.trim();

  const lineSurveyText = Object.entries(lineSurveyAnswers)
    .map(([q, a]) => `- ${q}：${a}`)
    .join("\n");

  return `你是植本邏輯（PHYTOLOGIC）的首席健康顧問 Dr. Marvin，精通功能醫學、慢性發炎評估、生命數字學與植物機能科學。

你現在要為「${nickname}」生成一份完整的個人化健康分析報告。這份報告整合了三個層次的資料：身體數據、生活習慣問卷、以及體質環境背景，是真正為這個人量身打造的分析，不是套模板。

每一個建議都必須能指回用戶的具體答案，說明「因為你填寫了 X，所以你的身體出現 Y，因此建議 Z」。

================================================================
【第一層：身體基本資料 × 快篩結果（來自官網）】
================================================================
性別：${gender}
年齡區間：${ageGroup}
BMI：${bmi}（請計算健康體重建議與缺口）
職業型態：${workType}
睡眠品質：${sleepQuality}
運動習慣：${exerciseHabit}

發炎快篩總分：${webSurveyTotal} / 14（${webSurveyLevel}）
主要發炎線索：${webCategorySummary}

快篩 7 題作答：
${webAnswerSummary}

================================================================
【第二層：會員建檔資料（7項）】
================================================================
暱稱：${nickname}
出生年月日：${birthdate}
血型：${bloodType}
居住城市：${city}
睡眠時間：${sleepHours}
飲食習慣：${dietPattern}
壓力感受：${stressLevel}

================================================================
【第三層：體質環境背景（系統計算）】
================================================================
生命靈數：${lifeNumber}
靈數人格特質：${lifeNumberTrait.personality}
靈數壓力模式：${lifeNumberTrait.stressPattern}
幸運色：${lifeNumberTrait.color}

星座：${zodiac}（${zodiacElement}象星座）
血型體質：${bloodTypeTrait.trait}
血型風險傾向：${bloodTypeTrait.risk}
血型飲品親和度：${bloodTypeTrait.affinity}

城市氣候：${city} — ${cityClimate.humidity}、${cityClimate.temperature}、${cityClimate.climate_type}
城市健康風險：${cityClimate.health_risks?.join("、")}
建議每日補水：${cityClimate.water_advice}
季節提醒：${cityClimate.season_note}

================================================================
【第四層：LINE 補充問卷（7題）】
================================================================
${lineSurveyText}

================================================================
【可推薦飲品清單】
================================================================
${productList}

快篩系統推薦飲品：${recommendedProductName}（${recommendedProductId}）

================================================================
【輸出格式要求】
================================================================
請只回傳 JSON，不要任何 Markdown 或額外文字。

{
  "section1_energy": {
    "title": "🌿 生命能量解讀",
    "life_number_insight": "生命靈數 ${lifeNumber} 的人格特質，結合 ${nickname} 目前的壓力感受（${stressLevel}）與職業型態（${workType}），說明為什麼這個人容易在身體哪個部位積累壓力，100字",
    "zodiac_insight": "星座（${zodiac}）的體質傾向，結合城市氣候，說明環境對身體的具體影響，60字",
    "blood_type_insight": "血型（${bloodType}）的體質特性，結合飲食習慣（${dietPattern}），說明身體目前最需要什麼支援，60字",
    "lucky_color": "${lifeNumberTrait.color}",
    "today_energy_tip": "根據靈數與目前發炎狀態，給一個今日能量建議，40字以內"
  },

  "section2_inflammation": {
    "title": "🔬 發炎現況分析",
    "overall": "整合所有資料，說明 ${nickname} 目前最關鍵的發炎狀況，以及是哪些生活型態因素共同造成這個結果，150字",
    "top_signals": [
      { "system": "最需關注的系統名稱", "score_context": "說明為什麼這個系統壓力最大，指回具體的問卷答案，60字" },
      { "system": "第二需關注系統", "score_context": "說明原因，指回具體答案，60字" },
      { "system": "第三需關注系統", "score_context": "說明原因，指回具體答案，60字" }
    ],
    "city_risk_note": "結合 ${city} 的氣候特性，說明環境如何加重目前的發炎狀況，60字"
  },

  "section3_bmi": {
    "title": "⚖️ 體重健康管理",
    "current_status": "目前 BMI ${bmi} 屬於哪個區間，說明對健康的影響",
    "direction": "需要減重 / 維持均衡 / 建議增肌（三選一）",
    "calorie_advice": "根據年齡（${ageGroup}）、性別（${gender}）、BMI、運動習慣（${exerciseHabit}），估算 TDEE 與建議熱量缺口或盈餘，具體數字，60字",
    "goal_timeline": "以目前建議的方向執行，預估幾週可以看到明顯改變，30字"
  },

  "section4_diet": {
    "title": "🥗 個人化飲食建議",
    "plan_type": "外食族攻略 / 均衡飲食計畫 / 熱量缺口計畫（根據 ${dietPattern} 和 BMI 選擇最適合的一種）",
    "main_advice": "針對 ${nickname} 的飲食習慣（${dietPattern}）提供具體的每日飲食建議，包含早中晚餐重點，150字",
    "avoid_list": ["今天起可以開始減少的 3 件事，每項 20 字以內"],
    "balance_note": "說明現代人要達成完整均衡飲食的難度（需攝取 27 種以上食物類型），以及植萃如何作為精準補充的解方，80字，語氣自然不推銷"
  },

  "section5_exercise": {
    "title": "🏃 運動建議",
    "recommended_types": [
      { "type": "最適合的運動類型名稱", "reason": "為什麼適合 ${nickname} 目前的狀態，30字", "how": "具體做法，30字" },
      { "type": "第二推薦", "reason": "原因，30字", "how": "做法，30字" }
    ],
    "frequency": "建議每週頻率與時長",
    "city_outdoor_note": "結合 ${city} 氣候，說明戶外運動的注意事項，30字"
  },

  "section6_lifestyle": {
    "title": "🌙 生活規律建議",
    "sleep_advice": "根據目前睡眠時間（${sleepHours}）與睡眠品質（${sleepQuality}），給出具體的睡眠改善建議，60字",
    "stress_advice": "根據壓力感受（${stressLevel}）與靈數壓力模式，給出 1 個今天就能做的壓力釋放行動，50字",
    "water_advice": "根據 ${city} 氣候（建議 ${cityClimate.water_advice}）與飲食習慣，說明每日補水的具體建議，40字"
  },

  "section7_seven_day_plan": {
    "title": "✨ 七天定製修補計畫",
    "intro": "根據 ${nickname} 的整體狀況，說明這七天計畫的核心目標，50字",
    "days": [
      {
        "day": 1,
        "theme": "啟動排毒",
        "morning": "早晨具體行動，30字",
        "diet": "今日飲食重點，40字",
        "exercise": "今日運動建議，30字",
        "evening": "夜晚收尾行動，30字",
        "product": "lime",
        "product_name": "青檸植萃",
        "drink_timing": "飲用時機與方式，20字",
        "product_reason": "為什麼今天選這款，結合今日主題，30字",
        "expected_feeling": "今天做到這些，你可能會感受到：30字"
      },
      {
        "day": 2,
        "theme": "平衡修復",
        "morning": "早晨具體行動，30字",
        "diet": "今日飲食重點，40字",
        "exercise": "今日運動建議，30字",
        "evening": "夜晚收尾行動，30字",
        "product": "rose",
        "product_name": "玫瑰植萃",
        "drink_timing": "飲用時機與方式，20字",
        "product_reason": "為什麼今天選這款，結合今日主題，30字",
        "expected_feeling": "預期感受，30字"
      },
      {
        "day": 3,
        "theme": "代謝激活",
        "morning": "早晨具體行動，30字",
        "diet": "今日飲食重點，40字",
        "exercise": "今日運動建議，30字",
        "evening": "夜晚收尾行動，30字",
        "product": "lime",
        "product_name": "青檸植萃",
        "drink_timing": "飲用時機與方式，20字",
        "product_reason": "為什麼今天選這款，30字",
        "expected_feeling": "預期感受，30字"
      },
      {
        "day": 4,
        "theme": "深層養護",
        "morning": "早晨具體行動，30字",
        "diet": "今日飲食重點，40字",
        "exercise": "今日運動建議，30字",
        "evening": "夜晚收尾行動，30字",
        "product": "rose",
        "product_name": "玫瑰植萃",
        "drink_timing": "飲用時機與方式，20字",
        "product_reason": "為什麼今天選這款，30字",
        "expected_feeling": "預期感受，30字"
      },
      {
        "day": 5,
        "theme": "抗發炎核心",
        "morning": "早晨具體行動，30字",
        "diet": "今日飲食重點，40字",
        "exercise": "今日運動建議，30字",
        "evening": "夜晚收尾行動，30字",
        "product": "snow",
        "product_name": "雪山植萃",
        "drink_timing": "飲用時機與方式，20字",
        "product_reason": "為什麼今天選這款，30字",
        "expected_feeling": "預期感受，30字"
      },
      {
        "day": 6,
        "theme": "系統整合",
        "morning": "早晨具體行動，30字",
        "diet": "今日飲食重點，40字",
        "exercise": "今日運動建議，30字",
        "evening": "夜晚收尾行動，30字",
        "product": "snow",
        "product_name": "雪山植萃",
        "drink_timing": "飲用時機與方式，20字",
        "product_reason": "為什麼今天選這款，30字",
        "expected_feeling": "預期感受，30字"
      },
      {
        "day": 7,
        "theme": "成果鞏固",
        "morning": "早晨具體行動，30字",
        "diet": "今日飲食重點，40字",
        "exercise": "今日運動建議，30字",
        "evening": "夜晚收尾行動，30字",
        "product": "snow",
        "product_name": "雪山植萃",
        "drink_timing": "飲用時機與方式，20字",
        "product_reason": "為什麼今天選這款，30字",
        "expected_feeling": "預期感受，30字"
      }
    ],
    "completion_reward": "完成七天計畫後，你將解鎖「修復者」稱號，獲得 500 LE 幸運能量值，並在第 8 天收到前後對比報告。",
    "day8_preview": "第 8 天你將重新測量發炎指數，看看七天帶來了什麼真實改變。"
  },

  "section8_product": {
    "title": "🌱 植本邏輯為你加分",
    "primary_recommendation": "${recommendedProductName}",
    "primary_reason": "根據 ${nickname} 的整體資料，說明為什麼這款飲品最適合目前狀態，結合具體的發炎線索、血型親和度與城市氣候，120字",
    "drink_method": "建議的飲用時機、溫度與搭配方式，50字",
    "seven_day_note": "說明七天計畫中三款植萃輪換的設計邏輯（青檸啟動代謝→玫瑰修復平衡→雪山深層抗發炎），60字"
  },

  "member_data_to_save": {
    "health_score": "根據所有資料計算的綜合健康分數 0-100（數字）",
    "life_number": ${lifeNumber},
    "zodiac": "${zodiac}",
    "zodiac_element": "${zodiacElement}",
    "recommended_product": "${recommendedProductId}"
  }
}`;
}

// ------------------------------------------------------------
// 每日推送 Prompt（Day 1 ~ Day 7）
// ------------------------------------------------------------
export function buildDailyPlanPrompt({ nickname, planDay, dayPlan, streakDays, lePoints }) {
  return `你是植本邏輯 Dr. Marvin。

${nickname} 正在進行七天修補計畫的第 ${planDay} 天（今日主題：${dayPlan.theme}）。
目前連續打卡 ${streakDays} 天，累積 ${lePoints} LE 幸運能量值。

請生成今日的 LINE 推送訊息，格式如下（回傳 JSON）：

{
  "greeting": "早安問候 + 第幾天進度提示，帶進度感（例：▓▓▓░░░░ 3/7），30字",
  "today_mission": {
    "morning": "${dayPlan.morning}",
    "diet": "${dayPlan.diet}",
    "exercise": "${dayPlan.exercise}",
    "evening": "${dayPlan.evening}"
  },
  "product_highlight": "今日植萃：${dayPlan.product_name}｜${dayPlan.drink_timing}｜${dayPlan.product_reason}",
  "expected_feeling": "${dayPlan.expected_feeling}",
  "le_reminder": "完成今日所有任務可獲得：飲用植萃 +15 LE、完成飲食建議 +5 LE、完成運動 +10 LE",
  "checkin_cta": "點擊下方按鈕記錄今日完成狀態 👇"
}`;
}

// ------------------------------------------------------------
// 第 8 天前後對比報告 Prompt
// ------------------------------------------------------------
export function buildDay8ReportPrompt({
  nickname,
  originalScore,
  originalLevel,
  newScore,
  newLevel,
  totalCheckins,
  totalLeEarned,
  badgesUnlocked,
}) {
  return `你是植本邏輯 Dr. Marvin。

${nickname} 完成了七天修補計畫！請生成第 8 天的前後對比報告（回傳 JSON）：

原始發炎分數：${originalScore}（${originalLevel}）
七天後發炎分數：${newScore}（${newLevel}）
七天打卡次數：${totalCheckins} / 7
累積 LE 幸運能量值：${totalLeEarned}
解鎖稱號：${badgesUnlocked.join("、") || "無"}

{
  "celebration": "恭喜語，帶入具體數據，說明七天的努力成果，60字",
  "score_comparison": "發炎分數從 ${originalScore} 到 ${newScore} 的變化解讀，說明意義，60字",
  "what_changed": "根據分數變化，說明身體最可能改善的部分，60字",
  "next_step": {
    "option_a": "繼續下一階段計畫的建議（強化版），40字",
    "option_b": "維持習慣的簡易版建議，40字"
  },
  "reorder_cta": "自然引導補貨的文案，不強迫推銷，說明持續飲用的長期效果，50字",
  "le_summary": "累積 ${totalLeEarned} LE，可以用來做什麼（盲盒、稱號等），30字"
}`;
}

// ------------------------------------------------------------
// LINE 第二次問卷題目（7題，加入後隨機推送，非建檔）
// 這些題目的答案存入 assessment_reports.second_survey
// 用於強化後續 AI 分析深度
// ------------------------------------------------------------
export const SECOND_SURVEY_QUESTIONS = [
  {
    id: "sq001",
    text: "您一天平均喝水量大約是？",
    options: ["少於 1 公升", "1 ~ 1.5 公升", "1.5 ~ 2 公升", "2 公升以上"],
  },
  {
    id: "sq002",
    text: "您的排便規律如何？",
    options: ["每天順暢", "每天但不太順", "2 ~ 3 天一次", "不規律或更久"],
  },
  {
    id: "sq003",
    text: "您對甜食或手搖飲的渴望程度？",
    options: ["幾乎沒有", "偶爾想", "幾乎每天都想", "難以抗拒"],
  },
  {
    id: "sq004",
    text: "您的皮膚狀況最近如何？",
    options: ["健康穩定", "偶爾出油或泛紅", "乾燥脫皮", "痘痘或敏感頻繁"],
  },
  {
    id: "sq005",
    text: "您最常感到的身體不適是？",
    options: ["肩頸僵硬", "腸胃不適", "頭痛或眼睛疲勞", "手腳冰冷"],
  },
  {
    id: "sq006",
    text: "您通常在幾點上床準備睡覺？",
    options: ["22:00 以前", "22:00 ~ 23:30", "23:30 ~ 01:00", "01:00 以後"],
  },
  {
    id: "sq007",
    text: "您最近一個月有沒有感覺情緒容易波動或低落？",
    options: ["幾乎沒有", "偶爾", "頻繁", "幾乎每天都有"],
  },
];

// ============================================================
// 使用範例（在 api/line-webhook.js 中調用）
// ============================================================
/*

import {
  calcLifeNumber,
  calcZodiac,
  getBloodTypeTrait,
  getLifeNumberTrait,
  buildFullReportPrompt,
  buildDailyPlanPrompt,
  buildDay8ReportPrompt,
} from "./prompts.js";

// 建檔完成 + 第二次問卷完成後，生成完整報告
async function generateFullReport(profile, assessmentReport, cityClimate) {
  const lifeNumber = calcLifeNumber(profile.birthdate);
  const { sign: zodiac, element: zodiacElement } = calcZodiac(profile.birthdate);
  const lifeNumberTrait = getLifeNumberTrait(lifeNumber);
  const bloodTypeTrait = getBloodTypeTrait(profile.blood_type);

  const prompt = buildFullReportPrompt({
    // 網頁快篩資料
    gender: assessmentReport.gender,
    ageGroup: assessmentReport.age_group,
    bmi: assessmentReport.bmi,
    workType: assessmentReport.work_type,
    sleepQuality: assessmentReport.sleep_quality,
    exerciseHabit: assessmentReport.exercise_habit,

    // 建檔 7 項
    nickname: profile.nickname,
    birthdate: profile.birthdate,
    bloodType: profile.blood_type,
    city: profile.city,
    sleepHours: profile.sleep_hours,
    dietPattern: profile.diet_pattern,
    stressLevel: profile.stress_level,

    // 計算結果
    lifeNumber,
    lifeNumberTrait,
    zodiac,
    zodiacElement,
    bloodTypeTrait,
    cityClimate,

    // 快篩結果
    webSurveyTotal: assessmentReport.total_score,
    webSurveyLevel: assessmentReport.inflammation_level,
    webCategorySummary: assessmentReport.full_report?.topSignals?.join("；"),
    webAnswerSummary: assessmentReport.full_report?.answerSummary,

    // LINE 第二次問卷
    lineSurveyAnswers: assessmentReport.second_survey,

    // 推薦飲品
    recommendedProductId: assessmentReport.recommended_products?.[0],
    recommendedProductName: assessmentReport.recommended_products?.[0],
  });

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  const text = data.content?.map((c) => c.text || "").join("") || "";
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

*/
