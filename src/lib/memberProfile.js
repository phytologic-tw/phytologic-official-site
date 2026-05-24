// src/lib/memberProfile.js
// Supabase 會員資料操作：建立、讀取、更新、打卡

import { supabase } from "./supabase";

// 台灣時間今日日期（YYYY-MM-DD）
export function getTaiwanToday() {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Taipei",
  }).format(new Date());
}

// 健康類型對應推薦飲品
const HEALTH_TYPE_DRINK = {
  抗發炎修復: "雪山植萃",
  代謝促排: "青檸植萃",
  女性保養: "玫瑰植萃",
  運動增肌: "桂香植萃",
  護眼抗氧化: "紫莓植萃",
};

// 幸運色池（依健康類型）
const LUCKY_COLORS = {
  雪山植萃: ["珍珠白", "米白", "象牙白", "薰衣草", "淡粉"],
  青檸植萃: ["翡翠綠", "薄荷綠", "橄欖綠", "草地綠", "深綠"],
  玫瑰植萃: ["玫瑰紅", "桃粉", "珊瑚粉", "淡紫", "胭脂"],
  桂香植萃: ["金鑽黃", "琥珀", "橙金", "暖橙", "薑黃"],
  紫莓植萃: ["水晶紫", "藍紫", "靛藍", "薰衣草紫", "紫羅蘭"],
};

function getLevelNumber(level) {
  if (typeof level === "number") return level;
  if (typeof level === "string" && level.startsWith("L")) {
    return Number(level.replace("L", "")) || 1;
  }
  return 1;
}

function normalizeMember(profile) {
  if (!profile) return profile;

  const healthType = profile.inflammation_level || profile.health_type;
  const recommendedDrink = profile.recommended_drink || HEALTH_TYPE_DRINK[healthType] || "雪山植萃";
  const colors = LUCKY_COLORS[recommendedDrink] || LUCKY_COLORS["雪山植萃"];
  const level = profile.level || "L1";
  const levelNumber = getLevelNumber(level);
  const lePoints = profile.le_points ?? 0;
  const pPoints = profile.p_points ?? 0;
  const cpPoints = profile.cp_points ?? 0;

  return {
    ...profile,
    display_name: profile.nickname || profile.line_display_name,
    picture_url: profile.line_picture_url,
    level,
    level_number: levelNumber,
    title: profile.title ?? "改變者",
    p_points: pPoints,
    cp_points: cpPoints,
    le_points: lePoints,
    p: pPoints,
    cp: cpPoints,
    le: lePoints,
    health_type: healthType,
    recommended_drink: recommendedDrink,
    lucky_color: profile.lucky_color || colors[0],
  };
}

function buildHealthUpdates(updates = {}) {
  const nextUpdates = { ...updates };

  if ("healthType" in nextUpdates) {
    nextUpdates.inflammation_level = nextUpdates.healthType;
    delete nextUpdates.healthType;
  }

  if ("ageGroup" in nextUpdates) {
    nextUpdates.age_group = nextUpdates.ageGroup;
    delete nextUpdates.ageGroup;
  }

  delete nextUpdates.recommendedDrink;
  delete nextUpdates.luckyColor;
  delete nextUpdates.health_type;
  delete nextUpdates.recommended_drink;
  delete nextUpdates.lucky_color;

  return nextUpdates;
}

function calculateNextCheckinStats(member, today) {
  const yesterday = new Date(`${today}T00:00:00+08:00`);
  yesterday.setDate(yesterday.getDate() - 1);
  const taiwanYesterday = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Taipei",
  }).format(yesterday);

  const currentStreak = member.streak_days ?? 0;
  const streakDays = member.last_checkin_date === taiwanYesterday ? currentStreak + 1 : 1;
  const lePoints = (member.le_points ?? 0) + 10;
  const healthScore = Math.min((member.health_score ?? 0) + 3, 100);
  const levelNumber = calcLevel(lePoints);

  return {
    lePoints,
    healthScore,
    streakDays,
    level: `L${levelNumber}`,
    title: calcTitle(levelNumber),
    totalCheckins: (member.total_checkins ?? 0) + 1,
    longestStreak: Math.max(member.longest_streak ?? 0, streakDays),
  };
}

/**
 * 根據 LINE userId 找到或建立會員
 * 這是所有 LINE 頁面的入口函式
 */
export async function findOrCreateMember(lineProfile, attribution = {}) {
  if (!lineProfile?.userId) return { member: null, error: "缺少必要資料" };

  const { userId, displayName, pictureUrl, statusMessage } = lineProfile;

  try {
    const response = await fetch("/api/line-member", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lineUserId: userId,
        displayName,
        pictureUrl,
        statusMessage,
        attribution,
      }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "會員建立失敗");

    return { member: normalizeMember(result.profile), isNew: result.isNewMember };
  } catch (err) {
    console.error("[memberProfile] findOrCreateMember 失敗:", err);
    return { member: null, error: err.message };
  }
}

/**
 * 根據 line_user_id 取得會員資料
 */
export async function getMemberByLineId(lineUserId) {
  if (!supabase || !lineUserId) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("line_user_id", lineUserId)
    .maybeSingle();

  if (error) {
    console.error("[memberProfile] getMemberByLineId 失敗:", error);
    return null;
  }
  return normalizeMember(data);
}

/**
 * 更新會員健康資料（問卷完成後呼叫）
 */
export async function updateMemberHealth(lineUserId, updates = {}) {
  if (!supabase || !lineUserId) return false;

  const profileUpdates = buildHealthUpdates(updates);
  if (Object.keys(profileUpdates).length === 0) return false;

  const { data, error } = await supabase
    .from("profiles")
    .update(profileUpdates)
    .eq("line_user_id", lineUserId)
    .select()
    .single();

  if (error) {
    console.error("[memberProfile] updateMemberHealth 失敗:", error);
    return false;
  }
  return normalizeMember(data);
}

/**
 * 更新 LIFF 建檔資料（首次登入後填寫）
 */
export async function updateMemberProfile(lineUserId, updates = {}, attribution = {}) {
  if (!lineUserId) return { member: null, error: "會員資料不完整" };

  try {
    const response = await fetch("/api/line-member", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lineUserId,
        profileData: updates,
        attribution,
      }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "建檔儲存失敗");

    const member = normalizeMember(result.profile);
    sessionStorage.setItem("line_member", JSON.stringify(member));
    return { member, error: null };
  } catch (err) {
    console.error("[memberProfile] updateMemberProfile 失敗:", err);
    return { member: null, error: err.message };
  }
}

/**
 * 今日打卡
 * 返回: { success, alreadyChecked, le, healthScore, streakDays, message }
 */
export async function doCheckin(lineUserIdOrMember, checkinData = {}) {
  const lineUserId = typeof lineUserIdOrMember === "string"
    ? lineUserIdOrMember
    : lineUserIdOrMember?.line_user_id;

  if (!lineUserId) return { success: false, message: "會員資料不完整" };

  try {
    const response = await fetch("/api/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lineUserId,
        ...checkinData,
      }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "打卡失敗");

    if (result.profile) sessionStorage.setItem("line_member", JSON.stringify(normalizeMember(result.profile)));
    return result;
  } catch (err) {
    console.error("[memberProfile] doCheckin 失敗:", err);
    return { success: false, message: "打卡失敗，請稍後再試" };
  }
}

/**
 * 取得會員打卡紀錄（最近 N 天）
 */
export async function getCheckinHistory(lineUserIdOrMemberId, limit = 30) {
  if (!supabase || !lineUserIdOrMemberId) return [];

  let member = null;
  if (typeof lineUserIdOrMemberId === "string" && lineUserIdOrMemberId.startsWith("U")) {
    member = await getMemberByLineId(lineUserIdOrMemberId);
  } else {
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", lineUserIdOrMemberId)
      .maybeSingle();

    if (error) {
      console.error("[memberProfile] getCheckinHistory 會員查詢失敗:", error);
      return [];
    }
    member = data;
  }

  if (!member) return [];

  const { data, error } = await supabase
    .from("daily_checkins")
    .select("*")
    .eq("member_id", member.id)
    .order("checkin_date", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[memberProfile] getCheckinHistory 失敗:", error);
    return [];
  }
  return data ?? [];
}

/**
 * 等級計算
 */
function calcLevel(le) {
  if (le >= 1000) return 4;
  if (le >= 300) return 3;
  if (le >= 100) return 2;
  return 1;
}

function calcTitle(level) {
  const titles = { 1: "改變者", 2: "實踐者", 3: "教育家", 4: "實業家" };
  return titles[level] || "改變者";
}

export { calcLevel, calcTitle, LUCKY_COLORS, HEALTH_TYPE_DRINK };
