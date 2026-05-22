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

/**
 * 根據 LINE userId 找到或建立會員
 * 這是所有 LINE 頁面的入口函式
 */
export async function findOrCreateMember(lineProfile) {
  if (!supabase || !lineProfile?.userId) return { member: null, error: "缺少必要資料" };

  const { userId, displayName, pictureUrl } = lineProfile;

  try {
    // 先嘗試查找既有會員
    const { data: existing, error: findErr } = await supabase
      .from("line_members")
      .select("*")
      .eq("line_user_id", userId)
      .maybeSingle();

    if (findErr) throw findErr;

    // 既有會員：回傳資料
    if (existing) {
      // 更新頭像和名稱（可能已更換）
      const { data: updated } = await supabase
        .from("line_members")
        .update({ display_name: displayName, picture_url: pictureUrl })
        .eq("line_user_id", userId)
        .select()
        .single();
      return { member: updated || existing, isNew: false };
    }

    // 新會員：建立 profile
    const recommendedDrink = "雪山植萃"; // 預設，問卷完成後更新
    const luckyColor = "珍珠白";

    const { data: created, error: createErr } = await supabase
      .from("line_members")
      .insert({
        line_user_id: userId,
        display_name: displayName,
        picture_url: pictureUrl,
        recommended_drink: recommendedDrink,
        lucky_color: luckyColor,
        level: 1,
        title: "改變者",
        le: 0,
        cp: 0,
        health_score: 0,
        streak_days: 0,
      })
      .select()
      .single();

    if (createErr) throw createErr;

    return { member: created, isNew: true };
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
    .from("line_members")
    .select("*")
    .eq("line_user_id", lineUserId)
    .maybeSingle();

  if (error) {
    console.error("[memberProfile] getMemberByLineId 失敗:", error);
    return null;
  }
  return data;
}

/**
 * 更新會員健康資料（問卷完成後呼叫）
 */
export async function updateMemberHealth(lineUserId, { healthType, recommendedDrink, luckyColor, ageGroup }) {
  if (!supabase || !lineUserId) return false;

  const drink = recommendedDrink || HEALTH_TYPE_DRINK[healthType] || "雪山植萃";
  const colors = LUCKY_COLORS[drink] || LUCKY_COLORS["雪山植萃"];
  const color = luckyColor || colors[Math.floor(Math.random() * colors.length)];

  const { error } = await supabase
    .from("line_members")
    .update({
      health_type: healthType,
      recommended_drink: drink,
      lucky_color: color,
      age_group: ageGroup,
    })
    .eq("line_user_id", lineUserId);

  if (error) {
    console.error("[memberProfile] updateMemberHealth 失敗:", error);
    return false;
  }
  return true;
}

/**
 * 今日打卡
 * 返回: { success, alreadyChecked, le, healthScore, streakDays, message }
 */
export async function doCheckin(memberId) {
  if (!supabase || !memberId) return { success: false, message: "會員資料不完整" };

  const today = getTaiwanToday();

  try {
    // 檢查今天是否已打卡
    const { data: existing } = await supabase
      .from("daily_checkins")
      .select("id")
      .eq("member_id", memberId)
      .eq("checkin_date", today)
      .maybeSingle();

    if (existing) {
      return { success: true, alreadyChecked: true, message: "今天已完成飲用，明天繼續加油！" };
    }

    // 取得目前會員資料
    const { data: member, error: memberErr } = await supabase
      .from("line_members")
      .select("le, health_score, streak_days, last_checkin_date")
      .eq("id", memberId)
      .single();

    if (memberErr) throw memberErr;

    // 計算連續天數（昨天是否有打卡）
    const yesterday = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Taipei" })
      .format(new Date(Date.now() - 86400000));

    const isConsecutive = member.last_checkin_date === yesterday;
    const newStreakDays = isConsecutive ? (member.streak_days || 0) + 1 : 1;
    const newLe = (member.le || 0) + 10;
    const newHealthScore = Math.min((member.health_score || 0) + 3, 100);

    // 寫入打卡紀錄
    const { error: checkinErr } = await supabase
      .from("daily_checkins")
      .insert({
        member_id: memberId,
        checkin_date: today,
        le_earned: 10,
        health_score_earned: 3,
      });

    if (checkinErr) throw checkinErr;

    // 更新會員積分
    const { error: updateErr } = await supabase
      .from("line_members")
      .update({
        le: newLe,
        health_score: newHealthScore,
        streak_days: newStreakDays,
        last_checkin_date: today,
        level: calcLevel(newLe),
        title: calcTitle(calcLevel(newLe)),
      })
      .eq("id", memberId);

    if (updateErr) throw updateErr;

    return {
      success: true,
      alreadyChecked: false,
      le: newLe,
      healthScore: newHealthScore,
      streakDays: newStreakDays,
      message: newStreakDays >= 7
        ? `連續第 ${newStreakDays} 天！你真的做到了 🌿`
        : `第 ${newStreakDays} 天，繼續讓身體感受植物的力量`,
    };
  } catch (err) {
    console.error("[memberProfile] doCheckin 失敗:", err);
    return { success: false, message: "打卡失敗，請稍後再試" };
  }
}

/**
 * 取得會員打卡紀錄（最近 N 天）
 */
export async function getCheckinHistory(memberId, days = 7) {
  if (!supabase || !memberId) return [];

  const { data, error } = await supabase
    .from("daily_checkins")
    .select("checkin_date, le_earned, health_score_earned")
    .eq("member_id", memberId)
    .order("checkin_date", { ascending: false })
    .limit(days);

  if (error) return [];
  return data || [];
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
