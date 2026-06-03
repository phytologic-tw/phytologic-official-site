import { calcFullAstroProfile, calcFlowNumber } from "../src/lib/astroCalc.js";
import { calcLevel, calcTitle, getSupabaseAdmin, normalizeProfile } from "../src/server/member-utils.js";
import { calcLifeNumber, getBloodTypeTrait, getLifeNumberTrait } from "../src/server/prompts.js";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const TASK_REWARDS = {
  profile_complete: { type: "starter", le: 30, cp: 0, label: "完成會員建檔" },
  daily_checkin: { type: "daily", le: 5, cp: 0, label: "完成今日飲用打卡" },
  dr_marvin_complete: { type: "starter", le: 0, cp: 50, label: "完成 My Dr. Marvin" },
  weekly_3_checkins: { type: "weekly", le: 20, cp: 10, label: "本週完成 3 次打卡" },
  weekly_5_checkins: { type: "weekly", le: 35, cp: 20, label: "本週完成 5 次打卡" },
  seven_day_complete: { type: "milestone", le: 100, cp: 100, label: "完成七日啟動" },
};

const CARD_DRAW_CATEGORIES = ["food", "clothing", "home", "travel", "learning", "leisure"];

const CARD_DRAW_CATEGORY_LABELS = {
  food: "食",
  clothing: "衣",
  home: "住",
  travel: "行",
  learning: "育",
  leisure: "樂",
};

const CARD_DRAW_TEMPLATES = {
  food: {
    short: [
      "今日輕食養胃益身心",
      "今日補充植物性能量",
      "今日飲食宜多彩多樣",
      "今日減少精緻糖分",
      "今日多補充水分滋潤",
      "今日宜溫熱食物暖身",
      "今日腸胃敏感需注意",
      "今日飲食順應節氣",
      "今日適合發酵食物",
    ],
    full:
      "今日流日數字提示飲食能量場。搭配植本綠拿鐵，可補充天然植物性營養素，陪你維持更穩定的日常飲食節奏。後續 AI 個人化解說將結合生命靈數、健康關注與流日資料，提供更貼近你的植本建議。",
  },
  clothing: {
    short: [
      "今日穿著輕盈自在",
      "今日植物色系加持",
      "今日自然纖維護體",
      "今日穿搭呼應能量",
      "今日避免過緊束縛",
      "今日層次穿搭靈活",
      "今日舒適優先自在",
      "今日色彩影響心情",
      "今日白色淨化場域",
    ],
    full:
      "今日穿著選擇會影響身體感受與行動節奏。植物色系、自然纖維與舒適剪裁，能幫助你把注意力放回呼吸與身體訊號，讓一整天更容易維持開放且穩定的狀態。",
  },
  home: {
    short: [
      "今日整理空間淨化",
      "今日引入自然光線",
      "今日植物淨化空氣",
      "今日減少螢幕干擾",
      "今日居家香氛放鬆",
      "今日整頓書桌清思",
      "今日調整睡眠環境",
      "今日家中加入綠植",
      "今日清掃能量更新",
    ],
    full:
      "今日居家能量適合流動與更新。整理一個小角落、打開自然光，或在空間裡加入植物，都能幫助生活場域回到清爽秩序，也讓身體比較容易進入安定節奏。",
  },
  travel: {
    short: [
      "今日步行感受自然",
      "今日避免倉促趕行",
      "今日順應節奏出行",
      "今日外出接觸綠意",
      "今日交通選擇步行",
      "今日行程留白緩行",
      "今日出行注意補水",
      "今日路途中保持覺察",
      "今日轉換環境充電",
    ],
    full:
      "今日行動建議順應自然節奏，不需要把每一段移動都安排得太滿。步行、緩行或在路途中接觸一點綠意，可以讓身體從緊繃裡鬆開，也替今天保留更好的調整空間。",
  },
  learning: {
    short: [
      "今日適合深度閱讀",
      "今日專注力較佳",
      "今日新知吸收旺盛",
      "今日記錄靈感想法",
      "今日學習植物知識",
      "今日聽覺學習有效",
      "今日反思比輸入重要",
      "今日整合既有所學",
      "今日靈感湧現捕捉",
    ],
    full:
      "今日學習能量適合從少量但深刻的內容開始。你可以選一個與身體、植物性營養或生活節奏相關的小題目，慢慢整理成自己的理解，讓知識變成能被實踐的日常選擇。",
  },
  leisure: {
    short: [
      "今日與自然同在",
      "今日靜心冥想充電",
      "今日創意活動流動",
      "今日走入植物環境",
      "今日音樂療癒心靈",
      "今日減少娛樂輸入",
      "今日手作連結大地",
      "今日輕鬆笑聲有益",
      "今日戶外活動優先",
    ],
    full:
      "今日休閒能量適合回到自然與感官。散步、音樂、手作或照料植物，都能讓身心從過度輸入中暫停一下。休息不是空白，而是讓下一段行動重新長出力量。",
  },
};

function getTaiwanToday() {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Taipei",
  }).format(new Date());
}

function normalizeNumberCardInterpretation(value, fallback) {
  const source = value && typeof value === "object" ? value : {};
  const sections = source.sections && typeof source.sections === "object" ? source.sections : {};
  return {
    title: source.title || fallback.title,
    summary: source.summary || fallback.summary,
    energy: source.energy || fallback.energy,
    body_hint: source.body_hint || fallback.body_hint,
    lifestyle_advice: source.lifestyle_advice || fallback.lifestyle_advice,
    sections: {
      food: sections.food || fallback.sections.food,
      clothing: sections.clothing || fallback.sections.clothing,
      living: sections.living || fallback.sections.living,
      movement: sections.movement || fallback.sections.movement,
      learning: sections.learning || fallback.sections.learning,
      joy: sections.joy || fallback.sections.joy,
    },
  };
}

function buildFallbackNumberCardInterpretation(profile, cardNumber, numerologyRef = {}) {
  const name = profile?.nickname || profile?.line_display_name || "你";
  const lifeNumber = profile?.life_number || profile?.numerology_number || (profile?.birth_date ? calcLifeNumber(profile.birth_date) : null);
  const lifeTrait = lifeNumber ? getLifeNumberTrait(lifeNumber) : null;
  const cardTitle = numerologyRef.deck_card?.card_title || numerologyRef.daily_card?.title || `第 ${cardNumber} 號植本數字卡`;
  const cardMessage = numerologyRef.deck_card?.card_message || numerologyRef.daily_card?.content || "今天先把身體放回穩定節奏，讓植物性營養、補水與休息成為最基本的支撐。";

  return {
    title: cardTitle,
    summary: `${name}，今日數字 ${cardNumber} 提醒你把注意力放回身體的真實節奏。${cardMessage}`,
    energy: lifeTrait?.personality
      ? `你的生命靈數 ${lifeNumber} 帶有「${lifeTrait.personality}」的傾向，今天適合用更安靜、可執行的小行動整理能量。`
      : `今日數字 ${cardNumber} 適合從一個可完成的小行動開始，避免把健康計畫一次排得太滿。`,
    body_hint: lifeTrait?.stressPattern
      ? `留意 ${lifeTrait.stressPattern} 相關訊號；這不是診斷，而是提醒你觀察身體壓力是否累積。`
      : "留意睡眠、消化、肩頸與精神飽和度，今天先降低過度刺激。",
    lifestyle_advice: "喝水、補充一份原型蔬果，並保留一段不被打擾的休息時間。",
    sections: {
      food: "選擇溫和、原型、植物性比例高的餐點，避免用精緻糖快速提神。",
      clothing: "穿著以舒適、透氣、容易活動為主，讓身體少一層負擔。",
      living: "整理一個小角落，讓視線和呼吸都有比較乾淨的停靠點。",
      movement: "用散步、伸展或緩慢活動啟動循環，不需要追求強度。",
      learning: "今天適合吸收少量但能實踐的健康知識，讀完後留下三句重點。",
      joy: "安排一件能讓感官放鬆的小事，例如音樂、植物、熱飲或安靜獨處。",
    },
  };
}

async function callAnthropicJson(prompt) {
  if (!ANTHROPIC_API_KEY) return null;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 900,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(`Anthropic failed: ${JSON.stringify(data)}`);
  const text = data.content?.map((item) => item.text || "").join("").trim();
  if (!text) return null;

  const jsonText = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
  return JSON.parse(jsonText);
}

async function buildNumberCardNumerologyRef({ supabase, profile, cardNumber }) {
  const lifeNumber = profile.life_number || profile.numerology_number || (profile.birth_date ? calcLifeNumber(profile.birth_date) : null);
  const [{ data: masterNumber }, { data: dailyCard }, { data: deckCards }, { data: astroProfile }] = await Promise.all([
    lifeNumber
      ? supabase
          .from("numerology_master_numbers")
          .select("master_number,label,core_tags,life_goal,best_expression,shadow_trait,ai_prompt_hint,health_tendency,element_affinity")
          .eq("master_number", lifeNumber)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    supabase
      .from("numerology_daily_cards")
      .select("title,content,positive_affirmation")
      .eq("flow_number", cardNumber)
      .eq("card_type", "draw_card")
      .maybeSingle(),
    supabase
      .from("numerology_card_deck")
      .select("card_title,card_message,action_hint,energy_type,illustration_key")
      .eq("number", cardNumber),
    supabase
      .from("member_astro_profiles")
      .select("master_number,zodiac_sign,birth_year_stem,innate_hua_lu,innate_hua_ji")
      .eq("profile_id", profile.id)
      .maybeSingle(),
  ]);

  return {
    life_number: lifeNumber,
    life_trait: lifeNumber ? getLifeNumberTrait(lifeNumber) : null,
    blood_trait: getBloodTypeTrait(profile.blood_type),
    master_number: masterNumber || null,
    daily_card: dailyCard || null,
    deck_card: Array.isArray(deckCards) && deckCards.length ? deckCards[0] : null,
    astro_profile: astroProfile || null,
  };
}

function buildNumberCardPrompt({ profile, cardNumber, numerologyRef, fallback }) {
  const name = profile.nickname || profile.line_display_name || "健康夥伴";
  return `你是植本邏輯 PHYTOLOGIC 的 Dr. Marvin，一位溫柔、克制、科學感的植物健康引導顧問。

請根據會員資料、今日抽到的數字卡與命理資料庫，產生今日數字卡解說。

規則：
- 只輸出 JSON，不要 Markdown，不要解釋
- 必須是繁體中文
- 不得診斷疾病、不得承諾療效、不得恐懼行銷
- 不得使用固定假文案，要結合下方會員資料與命理資料
- JSON key 必須完全符合格式

輸出格式：
{
  "title": "",
  "summary": "",
  "energy": "",
  "body_hint": "",
  "lifestyle_advice": "",
  "sections": {
    "food": "",
    "clothing": "",
    "living": "",
    "movement": "",
    "learning": "",
    "joy": ""
  }
}

會員資料：
暱稱：${name}
生日：${profile.birth_date || profile.birthdate || "未填"}
生命靈數：${numerologyRef.life_number || "未完成"}
血型：${profile.blood_type || "未填"}
性別：${profile.gender || "未填"}
飲食習慣：${profile.diet_pattern || profile.diet_type || "未填"}
壓力指數：${profile.stress_level || profile.stress_score || "未填"}
在意部位：${Array.isArray(profile.health_concerns) ? profile.health_concerns.join("、") : profile.health_concerns || "未填"}
健康分數：${profile.health_score ?? "未建立"}

今日抽到數字：${cardNumber}

命理資料庫：
生命靈數特質：${JSON.stringify(numerologyRef.life_trait || {})}
血型傾向：${JSON.stringify(numerologyRef.blood_trait || {})}
生命靈數資料表：${JSON.stringify(numerologyRef.master_number || {})}
今日數字卡資料：${JSON.stringify(numerologyRef.daily_card || {})}
牌組資料：${JSON.stringify(numerologyRef.deck_card || {})}
紫微/星座資料：${JSON.stringify(numerologyRef.astro_profile || {})}

若資料不足，請仍以會員已提供資料產生具體可行的解說。fallback 參考但不可逐字照抄：${JSON.stringify(fallback)}`;
}

async function generateNumberCardInterpretation({ supabase, profile, cardNumber }) {
  const numerologyRef = await buildNumberCardNumerologyRef({ supabase, profile, cardNumber });
  const fallback = buildFallbackNumberCardInterpretation(profile, cardNumber, numerologyRef);

  try {
    const aiJson = await callAnthropicJson(buildNumberCardPrompt({ profile, cardNumber, numerologyRef, fallback }));
    return {
      interpretation: normalizeNumberCardInterpretation(aiJson, fallback),
      aiGenerated: Boolean(aiJson),
    };
  } catch (error) {
    console.error("[member/number-card] AI generation failed:", error.message);
    return {
      interpretation: fallback,
      aiGenerated: false,
    };
  }
}

async function readNumberCardById({ supabase, profileId, cardId }) {
  const { data, error } = await supabase
    .from("daily_number_cards")
    .select("id,profile_id,card_number,draw_date,ai_interpretation,created_at,updated_at")
    .eq("profile_id", profileId)
    .eq("id", cardId)
    .maybeSingle();

  if (error) throw error;
  return data || null;
}

async function getOrCreateTodayNumberCard({ supabase, profile, date = getTaiwanToday() }) {
  const { data: existing, error: existingError } = await supabase
    .from("daily_number_cards")
    .select("id,profile_id,card_number,draw_date,ai_interpretation,created_at,updated_at")
    .eq("profile_id", profile.id)
    .eq("draw_date", date)
    .maybeSingle();

  if (existingError) throw existingError;
  if (existing?.ai_interpretation) return { card: existing, created: false };

  let card = existing;
  if (!card) {
    const cardNumber = Math.floor(Math.random() * 9) + 1;
    const { data: inserted, error: insertError } = await supabase
      .from("daily_number_cards")
      .insert({
        profile_id: profile.id,
        card_number: cardNumber,
        draw_date: date,
      })
      .select("id,profile_id,card_number,draw_date,ai_interpretation,created_at,updated_at")
      .single();

    if (insertError) {
      if (insertError.code === "23505") {
        const { data: conflictCard, error: conflictError } = await supabase
          .from("daily_number_cards")
          .select("id,profile_id,card_number,draw_date,ai_interpretation,created_at,updated_at")
          .eq("profile_id", profile.id)
          .eq("draw_date", date)
          .maybeSingle();
        if (conflictError) throw conflictError;
        card = conflictCard;
      } else {
        throw insertError;
      }
    } else {
      card = inserted;
    }
  }

  if (!card) throw new Error("number_card_create_failed");
  if (card.ai_interpretation) return { card, created: false };

  const { interpretation, aiGenerated } = await generateNumberCardInterpretation({
    supabase,
    profile,
    cardNumber: card.card_number,
  });

  const { data: updated, error: updateError } = await supabase
    .from("daily_number_cards")
    .update({
      ai_interpretation: { ...interpretation, ai_generated: aiGenerated },
      updated_at: new Date().toISOString(),
    })
    .eq("id", card.id)
    .select("id,profile_id,card_number,draw_date,ai_interpretation,created_at,updated_at")
    .single();

  if (updateError) throw updateError;
  return { card: updated, created: !existing };
}

async function readNumberCardHistory({ supabase, profileId }) {
  const { data, error } = await supabase
    .from("daily_number_cards")
    .select("id,card_number,draw_date,ai_interpretation,created_at,updated_at")
    .eq("profile_id", profileId)
    .order("draw_date", { ascending: false })
    .limit(30);

  if (error) throw error;
  return data || [];
}

function getTaiwanWeekKey(today) {
  const date = new Date(`${today}T00:00:00+08:00`);
  const day = date.getDay() || 7;
  date.setDate(date.getDate() + 4 - day);
  const yearStart = new Date(`${date.getFullYear()}-01-01T00:00:00+08:00`);
  const week = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  return `${date.getFullYear()}-W${String(week).padStart(2, "0")}`;
}

function buildFallbackInsight(profile) {
  const name = profile?.nickname || profile?.line_display_name || "你";
  const lifeNumber = profile?.life_number || profile?.numerology_number;
  const bloodType = profile?.blood_type;

  if (bloodType && lifeNumber) {
    return `${name}，你的 ${bloodType} 型節奏和生命靈數 ${lifeNumber} 都提醒我們：今天先把身體照顧好，穩定就是最好的前進。`;
  }

  return `${name}，今天先從一個小行動開始。完成飲用、記錄感受，讓植本邏輯慢慢累積更懂你的健康資料。`;
}

function normalizeConcerns(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return String(value).split(",").map((item) => item.trim()).filter(Boolean);
}

function getMissingProfileFields(profile) {
  const fields = [
    ["nickname", "暱稱", profile.nickname || profile.line_display_name],
    ["birth_date", "生日", profile.birth_date || profile.birthdate],
    ["gender", "性別", profile.gender],
    ["blood_type", "血型", profile.blood_type],
    ["city", "居住城市", profile.city],
    ["sleep_hours", "睡眠時間", profile.sleep_hours],
    ["diet_pattern", "飲食習慣", profile.diet_pattern || profile.diet_type],
    ["stress_level", "壓力感受", profile.stress_level],
    ["health_concerns", "在意部位", normalizeConcerns(profile.health_concerns).length > 0],
  ];

  return fields
    .filter(([, , value]) => !value)
    .map(([id, label]) => ({ id, label }));
}

function buildSevenDayPlan(profile, today) {
  const startDate = profile.seven_day_start_date || today;
  const start = new Date(`${startDate}T00:00:00+08:00`);
  const current = new Date(`${today}T00:00:00+08:00`);
  const rawDay = Math.floor((current - start) / 86400000) + 1;
  const currentDay = Math.min(Math.max(rawDay || 1, 1), 7);

  const days = [
    { day: 1, title: "建立角色", action: "完成會員建檔，讓 Dr. Marvin 認識你的基本節奏。", path: "/line/profile" },
    { day: 2, title: "第一次深測", action: "完成 My Dr. Marvin，取得五維健康分數。", path: "/line/assessment" },
    { day: 3, title: "讀懂報告", action: "查看個人報告，確認目前最需要照顧的系統。", path: "/line/reports" },
    { day: 4, title: "選定植萃", action: "依推薦飲品建立第一個固定補充節奏。", path: "/line/shop" },
    { day: 5, title: "邀請同行", action: "分享推薦連結，讓一位重要的人一起開始。", path: "/line/referral" },
    { day: 6, title: "穩定累積", action: "完成今日飲用打卡，觀察心情與活力變化。", path: "/line/checkin" },
    { day: 7, title: "解鎖身份", action: "完成七日啟動，拿到第一個健康身份徽章。", path: "/line/tasks" },
  ];

  return {
    start_date: startDate,
    current_day: currentDay,
    completed_days: Math.min(profile.streak_days || 0, 7),
    bonus_done: Boolean(profile.seven_day_bonus_done),
    days,
  };
}

function getPeriodKey(taskType, today) {
  if (taskType === "daily") return today;
  if (taskType === "weekly") return getTaiwanWeekKey(today);
  return "once";
}

function buildTaskState({ profile, todayCheckin, reportsCount, weeklyCheckins, claims, today }) {
  const profileCompleted = Boolean(profile.registration_completed_at || getMissingProfileFields(profile).length === 0);
  const claimMap = new Map((claims || []).map((claim) => [`${claim.task_id}:${claim.period_key}`, claim]));

  function makeTask(id, eligible, progress, target) {
    const reward = TASK_REWARDS[id];
    const periodKey = getPeriodKey(reward.type, today);
    const claim = claimMap.get(`${id}:${periodKey}`);
    return {
      id,
      label: reward.label,
      type: reward.type,
      period_key: periodKey,
      le_reward: reward.le,
      cp_reward: reward.cp,
      eligible: Boolean(eligible),
      claimed: Boolean(claim),
      claimed_at: claim?.claimed_at || null,
      progress,
      target,
    };
  }

  return [
    makeTask("profile_complete", profileCompleted, profileCompleted ? 1 : 0, 1),
    makeTask("daily_checkin", Boolean(todayCheckin), todayCheckin ? 1 : 0, 1),
    makeTask("dr_marvin_complete", reportsCount > 0 || Boolean(profile.last_report_id), reportsCount > 0 ? 1 : 0, 1),
    makeTask("weekly_3_checkins", weeklyCheckins >= 3, Math.min(weeklyCheckins, 3), 3),
    makeTask("weekly_5_checkins", weeklyCheckins >= 5, Math.min(weeklyCheckins, 5), 5),
    makeTask("seven_day_complete", (profile.streak_days || 0) >= 7, Math.min(profile.streak_days || 0, 7), 7),
  ];
}

async function readTaskClaims(supabase, profileId, today) {
  const periodKeys = ["once", today, getTaiwanWeekKey(today)];
  const { data, error } = await supabase
    .from("member_task_claims")
    .select("id,task_id,task_type,period_key,le_awarded,cp_awarded,claimed_at")
    .eq("profile_id", profileId)
    .in("period_key", periodKeys);

  if (!error) return data || [];

  console.error("[member/home] task claims lookup failed:", error.message);
  return [];
}

async function countWeeklyCheckins(supabase, profileId, today) {
  const date = new Date(`${today}T00:00:00+08:00`);
  const day = date.getDay() || 7;
  const monday = new Date(date);
  monday.setDate(date.getDate() - day + 1);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const startDate = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Taipei" }).format(monday);
  const endDate = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Taipei" }).format(sunday);

  const { count, error } = await supabase
    .from("daily_checkins")
    .select("id", { count: "exact", head: true })
    .eq("member_id", profileId)
    .gte("checkin_date", startDate)
    .lte("checkin_date", endDate);

  if (error) {
    console.error("[member/home] weekly checkins count failed:", error.message);
    return 0;
  }

  return count || 0;
}

async function readMemberAnnouncements(supabase) {
  const baseSelect = "id,title,summary,content,published_at,is_pinned,status";

  const withAudience = await supabase
    .from("announcements")
    .select(`${baseSelect},audience,event_id`)
    .eq("status", "published")
    .in("audience", ["all", "member"])
    .order("is_pinned", { ascending: false })
    .order("published_at", { ascending: false })
    .limit(3);

  if (!withAudience.error) return withAudience.data || [];

  const fallback = await supabase
    .from("announcements")
    .select(baseSelect)
    .eq("status", "published")
    .order("is_pinned", { ascending: false })
    .order("published_at", { ascending: false })
    .limit(3);

  if (fallback.error) {
    console.error("[member/home] announcements lookup failed:", fallback.error.message);
    return [];
  }

  return fallback.data || [];
}

async function readReports({ supabase, profile, lineUserId }) {
  const { data: drReports, error: drError } = await supabase
    .from("dr_marvin_reports")
    .select("id,report_type,answers,scores,health_score,recommended_product_id,report_content,le_awarded,created_at")
    .eq("profile_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (drError) throw drError;

  let quickReports = [];
  const quickResult = await supabase
    .from("assessment_reports")
    .select("id,created_at,inflammation_level,recommended_products,recommended_product,system_scores,ai_analysis,lifestyle_advice")
    .eq("line_user_id", lineUserId)
    .order("created_at", { ascending: false })
    .limit(10);

  if (!quickResult.error) quickReports = quickResult.data || [];

  return {
    profile: normalizeProfile(profile),
    reports: (drReports || []).map((report) => ({ ...report, source: "dr_marvin" })),
    quick_reports: quickReports.map((report) => ({ ...report, source: "website_quick" })),
  };
}

async function initAstroProfile({ supabase, profileId, birthDate }) {
  const astroProfile = calcFullAstroProfile(birthDate);
  if (!astroProfile) return { error: "birth_date required" };

  const { data: stemData } = await supabase
    .from("zwds_heavenly_stems")
    .select("hua_lu,hua_quan,hua_ke,hua_ji")
    .eq("stem", astroProfile.birth_year_stem)
    .maybeSingle();

  const { error } = await supabase
    .from("member_astro_profiles")
    .upsert({
      profile_id: profileId,
      ...astroProfile,
      innate_hua_lu: stemData?.hua_lu || null,
      innate_hua_quan: stemData?.hua_quan || null,
      innate_hua_ke: stemData?.hua_ke || null,
      innate_hua_ji: stemData?.hua_ji || null,
      computed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: "profile_id" });

  if (error) return { error: error.message };
  return {
    success: true,
    master_number: astroProfile.master_number,
    zodiac_sign: astroProfile.zodiac_sign,
  };
}

async function readAstroDailyCards({ supabase, profileId }) {
  const flowNumber = calcFlowNumber();
  const [{ data: cards, error: cardsError }, { data: deckCards, error: deckError }] = await Promise.all([
    supabase
      .from("numerology_daily_cards")
      .select("*")
      .eq("flow_number", flowNumber),
    supabase
      .from("numerology_card_deck")
      .select("*")
      .eq("number", flowNumber),
  ]);

  if (cardsError) throw cardsError;
  if (deckError) throw deckError;

  const drawnCard = deckCards?.length
    ? deckCards[Math.floor(Math.random() * deckCards.length)]
    : null;

  let zwdsInsight = null;
  if (profileId) {
    const { data: astro } = await supabase
      .from("member_astro_profiles")
      .select("birth_year_stem,innate_hua_lu,innate_hua_ji,master_number,zodiac_sign")
      .eq("profile_id", profileId)
      .maybeSingle();

    if (astro?.birth_year_stem) {
      zwdsInsight = {
        master_number: astro.master_number,
        zodiac_sign: astro.zodiac_sign,
        innate_hua_lu: astro.innate_hua_lu,
        innate_hua_ji: astro.innate_hua_ji,
      };
    }
  }

  const cardsByType = (cards || []).reduce((acc, card) => {
    acc[card.card_type] = card;
    return acc;
  }, {});

  return {
    flow_number: flowNumber,
    cards: cardsByType,
    drawn_card: drawnCard,
    zwds_insight: zwdsInsight,
  };
}

async function readDailyCardReadings({ supabase, profileId, date }) {
  const queryDate = date || getTaiwanToday();
  const { data, error } = await supabase
    .from("daily_card_readings")
    .select("category,drawn_number,short_advice,full_advice,numerology_ref,created_at")
    .eq("profile_id", profileId)
    .eq("date", queryDate)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return {
    date: queryDate,
    cards: data || [],
  };
}

function getHeaderValue(value) {
  if (Array.isArray(value)) return value[0];
  return typeof value === "string" ? value : "";
}

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return false;
  return !Number.isNaN(new Date(`${value}T00:00:00+08:00`).getTime());
}

function calculateCardDayNumber(dateStr) {
  const digits = dateStr.replace(/-/g, "").split("").map(Number);
  let sum = digits.reduce((total, digit) => total + digit, 0);
  while (sum > 9) {
    sum = String(sum).split("").map(Number).reduce((total, digit) => total + digit, 0);
  }
  return sum || 9;
}

async function getCardNumerologyRef({ supabase, profile, date, category, drawnNumber }) {
  const ref = {
    life_number: profile.life_number || profile.numerology_number || null,
    day_number: drawnNumber,
    category_label: CARD_DRAW_CATEGORY_LABELS[category] || null,
    daily_card: null,
    deck_card: null,
    zwds_daily: null,
    date,
  };

  const [{ data: dailyCard }, { data: deckCards }, { data: astroProfile }] = await Promise.all([
    supabase
      .from("numerology_daily_cards")
      .select("title,content,positive_affirmation")
      .eq("flow_number", drawnNumber)
      .eq("card_type", "draw_card")
      .maybeSingle(),
    supabase
      .from("numerology_card_deck")
      .select("card_title,card_message,action_hint,energy_type,illustration_key")
      .eq("number", drawnNumber),
    supabase
      .from("member_astro_profiles")
      .select("master_number,zodiac_sign,birth_year_stem,innate_hua_lu,innate_hua_ji")
      .eq("profile_id", profile.id)
      .maybeSingle(),
  ]);

  ref.daily_card = dailyCard || null;
  ref.deck_card = Array.isArray(deckCards) && deckCards.length
    ? deckCards[Math.floor(Math.random() * deckCards.length)]
    : null;
  ref.zwds_daily = astroProfile || null;

  return ref;
}

function generateCardAdvice({ profile, category, drawnNumber, numerologyRef }) {
  const template = CARD_DRAW_TEMPLATES[category];
  const shortAdvice = template?.short?.[(drawnNumber - 1) % 9] || "今日能量正在計算";
  const name = profile.nickname || profile.line_display_name || "你";
  const categoryLabel = CARD_DRAW_CATEGORY_LABELS[category] || "植本";
  const dailyHint = numerologyRef.daily_card?.content ? ` ${numerologyRef.daily_card.content}` : "";
  const deckHint = numerologyRef.deck_card?.action_hint ? ` 今日行動提示：${numerologyRef.deck_card.action_hint}` : "";
  const fullAdvice = `${name}，這張「${categoryLabel}」卡對應今日流日數字 ${drawnNumber}。${template?.full || "今日建議由植本 AI 即將個人化生成。"}${dailyHint}${deckHint}`;

  return {
    short_advice: shortAdvice.slice(0, 15),
    full_advice: fullAdvice,
  };
}

async function readExistingCardDraw({ supabase, profileId, date, category }) {
  const { data } = await supabase
    .from("daily_card_readings")
    .select("category,drawn_number,short_advice,full_advice,numerology_ref,ai_generated")
    .eq("profile_id", profileId)
    .eq("date", date)
    .eq("category", category)
    .maybeSingle();

  return data || null;
}

async function drawDailyCard({ supabase, profile, category, date }) {
  if (!CARD_DRAW_CATEGORIES.includes(category) || !isValidDate(date)) {
    return { status: 400, payload: { success: false, error: "invalid_params" } };
  }

  const existing = await readExistingCardDraw({ supabase, profileId: profile.id, date, category });
  if (existing) {
    return {
      status: 200,
      payload: {
        success: true,
        already_drawn: true,
        category: existing.category,
        drawn_number: existing.drawn_number,
        short_advice: existing.short_advice,
        full_advice: existing.full_advice,
        numerology_ref: existing.numerology_ref,
        ai_generated: existing.ai_generated,
      },
    };
  }

  const drawnNumber = calculateCardDayNumber(date);
  const numerologyRef = await getCardNumerologyRef({ supabase, profile, date, category, drawnNumber });
  const { short_advice: shortAdvice, full_advice: fullAdvice } = generateCardAdvice({
    profile,
    category,
    drawnNumber,
    numerologyRef,
  });

  const { data: inserted, error: insertError } = await supabase
    .from("daily_card_readings")
    .insert({
      profile_id: profile.id,
      date,
      category,
      drawn_number: drawnNumber,
      short_advice: shortAdvice,
      full_advice: fullAdvice,
      numerology_ref: numerologyRef,
      ai_generated: false,
    })
    .select("category,drawn_number,short_advice,full_advice,numerology_ref,ai_generated")
    .single();

  if (insertError) {
    if (insertError.code === "23505") {
      const conflictExisting = await readExistingCardDraw({ supabase, profileId: profile.id, date, category });
      if (conflictExisting) {
        return {
          status: 200,
          payload: {
            success: true,
            already_drawn: true,
            category: conflictExisting.category,
            drawn_number: conflictExisting.drawn_number,
            short_advice: conflictExisting.short_advice,
            full_advice: conflictExisting.full_advice,
            numerology_ref: conflictExisting.numerology_ref,
            ai_generated: conflictExisting.ai_generated,
          },
        };
      }
    }

    console.error("[member/card-draw] insert failed:", insertError.message);
    return { status: 500, payload: { success: false, error: "db_write_failed" } };
  }

  return {
    status: 200,
    payload: {
      success: true,
      category: inserted.category,
      drawn_number: inserted.drawn_number,
      short_advice: inserted.short_advice,
      full_advice: inserted.full_advice,
      numerology_ref: inserted.numerology_ref,
      ai_generated: inserted.ai_generated,
    },
  };
}

export default async function handler(req, res) {
  if (!["GET", "POST"].includes(req.method)) return res.status(405).json({ error: "Method not allowed" });

  const resource = req.method === "POST"
    ? req.body?.resource || req.query?.resource || "home"
    : req.query?.resource || "home";

  if (!["home", "reports", "astro-init", "astro-daily-cards", "daily-cards", "card-draw", "number-card-today", "number-card-history", "number-card-detail"].includes(resource)) {
    return res.status(400).json({ error: "Unsupported member resource." });
  }

  if (["reports", "daily-cards", "number-card-history", "number-card-detail"].includes(resource) && req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (resource === "astro-daily-cards" && req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (resource === "astro-init" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (resource === "card-draw" && req.method !== "POST") {
    return res.status(405).json({ success: false, error: "method_not_allowed" });
  }

  if (resource === "number-card-today" && !["GET", "POST"].includes(req.method)) {
    return res.status(405).json({ success: false, error: "method_not_allowed" });
  }

  try {
    const supabase = getSupabaseAdmin();

    if (resource === "astro-daily-cards") {
      const payload = await readAstroDailyCards({
        supabase,
        profileId: req.query?.profile_id || null,
      });
      return res.status(200).json(payload);
    }

    if (resource === "astro-init") {
      const profileId = req.body?.profile_id;
      const birthDate = req.body?.birth_date;
      if (!profileId || !birthDate) {
        return res.status(400).json({ error: "profile_id and birth_date required" });
      }

      const payload = await initAstroProfile({ supabase, profileId, birthDate });
      if (payload.error) return res.status(500).json({ error: payload.error });
      return res.status(200).json(payload);
    }

    const lineUserId = req.method === "POST"
      ? req.body?.lineUserId || req.body?.line_user_id || getHeaderValue(req.headers["x-line-user-id"])
      : req.query?.lineUserId || req.query?.line_user_id || req.headers["x-line-user-id"];
    if (!lineUserId || typeof lineUserId !== "string" || !lineUserId.startsWith("U")) {
      return res.status(400).json({ error: "Invalid LINE userId" });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("line_user_id", lineUserId)
      .maybeSingle();

    if (profileError) throw profileError;
    if (!profile) return res.status(404).json({ error: "Member not found" });

    if (resource === "reports") {
      const payload = await readReports({ supabase, profile, lineUserId });
      return res.status(200).json(payload);
    }

    if (resource === "daily-cards") {
      const payload = await readDailyCardReadings({
        supabase,
        profileId: profile.id,
        date: req.query?.date || null,
      });
      return res.status(200).json(payload);
    }

    if (resource === "number-card-today") {
      const { card, created } = await getOrCreateTodayNumberCard({
        supabase,
        profile,
        date: getTaiwanToday(),
      });
      return res.status(200).json({
        success: true,
        created,
        card,
      });
    }

    if (resource === "number-card-history") {
      const cards = await readNumberCardHistory({
        supabase,
        profileId: profile.id,
      });
      return res.status(200).json({
        success: true,
        cards,
      });
    }

    if (resource === "number-card-detail") {
      const cardId = req.query?.cardId || req.query?.card_id;
      if (!cardId) return res.status(400).json({ success: false, error: "card_id_required" });
      const card = await readNumberCardById({
        supabase,
        profileId: profile.id,
        cardId,
      });
      if (!card) return res.status(404).json({ success: false, error: "card_not_found" });
      return res.status(200).json({
        success: true,
        card,
      });
    }

    if (resource === "card-draw") {
      const { status, payload } = await drawDailyCard({
        supabase,
        profile,
        category: req.body?.category,
        date: req.body?.date || getTaiwanToday(),
      });
      return res.status(status).json(payload);
    }

    const today = getTaiwanToday();
    const weeklyCheckins = await countWeeklyCheckins(supabase, profile.id, today);
    const [
      checkinResult,
      reportsResult,
      latestReportResult,
      announcements,
    ] = await Promise.all([
      supabase
        .from("daily_checkins")
        .select("id,checkin_date,le_earned,le_awarded,mood_score,energy_level,energy_score")
        .eq("member_id", profile.id)
        .eq("checkin_date", today)
        .maybeSingle(),
      supabase
        .from("dr_marvin_reports")
        .select("id", { count: "exact", head: true })
        .eq("profile_id", profile.id),
      supabase
        .from("dr_marvin_reports")
        .select("id,report_type,health_score,recommended_product_id,created_at")
        .eq("profile_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      readMemberAnnouncements(supabase),
    ]);

    if (checkinResult.error) console.error("[member/home] checkin lookup failed:", checkinResult.error.message);
    if (reportsResult.error) console.error("[member/home] reports count failed:", reportsResult.error.message);
    if (latestReportResult.error) console.error("[member/home] latest report failed:", latestReportResult.error.message);

    const normalizedProfile = normalizeProfile(profile);
    const missingProfileFields = getMissingProfileFields(profile);
    const profileCompleted = Boolean(profile.registration_completed_at || missingProfileFields.length === 0);
    const todayCheckin = checkinResult.error ? null : checkinResult.data;
    const latestReport = latestReportResult.error ? null : latestReportResult.data;
    const reportsCount = reportsResult.error ? 0 : reportsResult.count || 0;
    const taskClaims = await readTaskClaims(supabase, profile.id, today);
    const taskState = buildTaskState({
      profile,
      todayCheckin,
      reportsCount,
      weeklyCheckins,
      claims: taskClaims,
      today,
    });

    if (req.method === "POST") {
      const taskId = req.body?.taskId || req.body?.task_id;
      const task = taskState.find((item) => item.id === taskId);
      if (!task) return res.status(400).json({ error: "Unsupported task id." });
      if (!task.eligible) return res.status(409).json({ error: "Task is not eligible yet.", task });
      if (task.claimed) return res.status(409).json({ error: "Task reward already claimed.", task });

      const reward = TASK_REWARDS[task.id];
      const { data: claim, error: claimError } = await supabase
        .from("member_task_claims")
        .insert({
          profile_id: profile.id,
          task_id: task.id,
          task_type: reward.type,
          period_key: task.period_key,
          le_awarded: reward.le,
          cp_awarded: reward.cp,
          metadata: {
            line_user_id: profile.line_user_id,
            label: reward.label,
            progress: task.progress,
            target: task.target,
          },
        })
        .select("*")
        .single();

      if (claimError) throw claimError;

      const nextLe = (profile.le_points || 0) + reward.le;
      const nextCp = (profile.cp_points || 0) + reward.cp;
      const nextLevelNumber = calcLevel(nextLe);
      const { data: updatedProfile, error: updateError } = await supabase
        .from("profiles")
        .update({
          le_points: nextLe,
          cp_points: nextCp,
          level: `L${nextLevelNumber}`,
          title: calcTitle(nextLevelNumber),
        })
        .eq("id", profile.id)
        .select("*")
        .single();

      if (updateError) throw updateError;

      return res.status(200).json({
        success: true,
        claim,
        task: { ...task, claimed: true, claimed_at: claim.claimed_at },
        profile: normalizeProfile(updatedProfile),
      });
    }

    return res.status(200).json({
      profile: normalizedProfile,
      profile_completed: profileCompleted,
      missing_profile_fields: missingProfileFields,
      seven_day_plan: buildSevenDayPlan(profile, today),
      task_claims: taskClaims,
      tasks: taskState,
      weekly_checkins: weeklyCheckins,
      today,
      today_checkin: todayCheckin,
      has_checked_in_today: Boolean(todayCheckin),
      daily_insight: profile.daily_insight || buildFallbackInsight(profile),
      daily_insight_generated: Boolean(profile.daily_insight),
      reports_count: reportsCount,
      latest_report: latestReport,
      announcements,
      feature_grid: [
        { id: "checkin", label: "今日打卡", path: "/line/checkin", status: todayCheckin ? "done" : "ready" },
        { id: "reports", label: "我的報告", path: "/line/reports", status: latestReport ? "ready" : "empty" },
        { id: "assessment", label: "My Dr. Marvin", path: "/line/assessment", status: "ready" },
        { id: "shop", label: "植萃商城", path: "/line/shop", status: "ready" },
        { id: "tasks", label: "任務中心", path: "/line/tasks", status: "ready" },
        { id: "profile", label: "我的帳戶", path: "/line/profile", status: "ready" },
        { id: "referral", label: "推薦好友", path: "/line/referral", status: "ready" },
        { id: "events", label: "最新活動", path: "/line/events", status: "ready" },
      ],
    });
  } catch (error) {
    console.error("[member/home] failed:", error);
    return res.status(500).json({ error: error.message });
  }
}
