// src/lib/dailyMessage.js
// 每日健康訊息產生、幸運色邏輯、寫入 daily_ai_messages
// 預留未來 LINE Messaging API push 使用

import { supabase } from "./supabase";
import { getTaiwanToday, LUCKY_COLORS } from "./memberProfile";

// 健康建議庫（依 health_type）
const HEALTH_ADVICE = {
  抗發炎修復: [
    "今天試著減少精緻糖分的攝取，身體會感謝你的選擇。",
    "充足的睡眠是最好的抗發炎藥物，今晚早一小時入睡吧。",
    "深呼吸三次，讓副交感神經接管，讓身體開始修復。",
    "溫熱水是今天的好朋友，幫助腸道蠕動與代謝循環。",
    "雪山植萃的核桃與銀耳，正在幫你的細胞做修復工程。",
  ],
  代謝促排: [
    "今天多走幾步路，啟動你的代謝引擎。",
    "試著在飯前喝一杯水，幫助消化和飽足感。",
    "青檸植萃的高纖維，正在幫你的腸道做清潔工作。",
    "今天的蔬菜攝取量達標了嗎？深色蔬菜是代謝的好朋友。",
    "規律的排便是健康的信號，觀察一下你的身體今天說什麼。",
  ],
  女性保養: [
    "今天給自己一點時間，不需要一直付出，先照顧好自己。",
    "玫瑰植萃的甜菜根正在幫你補充天然鐵質，讓氣色紅潤。",
    "保水是今天的重點，皮膚最需要的保養從內而外開始。",
    "情緒也是身體的訊號，今天感受到什麼，都值得被溫柔對待。",
    "銀耳與百香果，正在為你的膠原蛋白合成提供素材。",
  ],
  運動增肌: [
    "運動後的 30 分鐘是黃金補充窗口，桂香植萃幫你把握它。",
    "肌肉的生長需要休息，今天安排一次充分的恢復。",
    "電解質補充很重要，香蕉和植萃飲品是最自然的來源。",
    "運動不只是體態，是讓你在家人需要時還有力氣站在前面。",
    "薑黃的抗發炎效果正在幫你的肌肉減少運動後的酸痛。",
  ],
  護眼抗氧化: [
    "今天每用螢幕 50 分鐘，讓眼睛休息 10 分鐘看向遠方。",
    "紫莓植萃的花青素，正在為你的視網膜提供養護。",
    "藍光是眼睛的隱形敵人，今晚睡前 1 小時放下手機吧。",
    "護眼從飲食開始，深紫色食物是眼睛最好的食物藥。",
    "木鱉果的茄紅素，是脂溶性抗氧化劑，幫助眼部細胞抗氧化。",
  ],
};

// 預設建議（未完成問卷的新會員）
const DEFAULT_ADVICE = [
  "今天是新的開始，植本邏輯陪你建立一個健康的日常。",
  "完成 Dr. Marvin 分析，讓我們更了解你的身體需求。",
  "每一天的選擇，都是給未來的自己一封信。",
  "健康不是一天的事，是每一個今天的積累。",
  "小小的改變，帶來大大的不同。今天你做到了嗎？",
];

/**
 * 取得推薦的幸運色（依推薦飲品或隨機）
 */
function getTodayLuckyColor(recommendedDrink) {
  const colors = LUCKY_COLORS[recommendedDrink] || ["珍珠白", "翡翠綠", "玫瑰紅", "金鑽黃", "水晶紫"];
  const today = getTaiwanToday();
  // 同一天同一個人永遠拿到相同顏色（用日期做 seed）
  const seed = today.replace(/-/g, "").split("").reduce((a, b) => a + b.charCodeAt(0), 0);
  return colors[seed % colors.length];
}

/**
 * 產生今日健康訊息
 */
function generateTodayContent(member) {
  const healthType = member.health_type || "抗發炎修復";
  const advicePool = HEALTH_ADVICE[healthType] || DEFAULT_ADVICE;
  const today = getTaiwanToday();
  const seed = today.replace(/-/g, "").split("").reduce((a, b) => a + b.charCodeAt(0), 0);
  return advicePool[seed % advicePool.length];
}

/**
 * 產生今日建議行動
 */
function generateRecommendedAction(member) {
  const actions = [
    `今天飲用一瓶${member.recommended_drink || "植萃飲品"}`,
    "完成今日打卡，讓連續紀錄延續",
    "喝足 2000ml 的水",
    "早睡 30 分鐘，讓身體充分修復",
    "吃一份深色蔬菜",
  ];
  const today = getTaiwanToday();
  const seed = today.replace(/-/g, "").split("").reduce((a, b) => a + b.charCodeAt(0), 0) + 17;
  return actions[seed % actions.length];
}

/**
 * 取得或產生今日 AI 訊息（若已有今日訊息則直接回傳）
 * 這是主要對外 API
 */
export async function getTodayMessage(member) {
  if (!member?.id) return null;

  const today = getTaiwanToday();

  // 先查是否已有今日訊息
  const { data: existing } = await supabase
    .from("daily_ai_messages")
    .select("*")
    .eq("member_id", member.id)
    .eq("sent_date", today)
    .maybeSingle();

  if (existing) return existing;

  // 產生新訊息
  const luckyColor = getTodayLuckyColor(member.recommended_drink);
  const content = generateTodayContent(member);
  const recommendedAction = generateRecommendedAction(member);

  const { data: created, error } = await supabase
    .from("daily_ai_messages")
    .insert({
      member_id: member.id,
      sent_date: today,
      message_date: today,
      message_type: "daily_health",
      content,
      lucky_color: luckyColor,
      recommended_action: recommendedAction,
    })
    .select()
    .single();

  if (error) {
    console.error("[dailyMessage] 產生今日訊息失敗:", error);
    // fallback: 回傳本地產生的訊息，不儲存
    return {
      content,
      lucky_color: luckyColor,
      recommended_action: recommendedAction,
      message_date: today,
    };
  }

  return created;
}

/**
 * 預留：LINE Messaging API 推播格式
 * 未來呼叫 /api/line-push 時使用此格式
 */
export function formatPushMessage(member, todayMsg) {
  const greeting = getTimeGreeting();
  return [
    {
      type: "text",
      text: `${greeting}，${member.display_name || "健康夥伴"} 🌿\n\n今日幸運色：${todayMsg.lucky_color}\n\n${todayMsg.content}\n\n✨ 今日行動：${todayMsg.recommended_action}`,
    },
  ];
}

function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 6) return "深夜好";
  if (hour < 11) return "早安";
  if (hour < 14) return "午安";
  if (hour < 18) return "下午好";
  return "晚安";
}
