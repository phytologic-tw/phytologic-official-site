// src/lib/lineAuth.js
// LIFF 初始化、LINE userId 取得、登入狀態管理

import liff from "@line/liff";

const LIFF_ID = import.meta.env.VITE_LINE_LIFF_ID || "2010068530-ddmtwm5t";

let _liffInitialized = false;
let _liffProfile = null;

/**
 * 初始化 LIFF SDK
 * 必須在所有 /line/* 頁面最先呼叫
 */
export async function initLiff() {
  if (_liffInitialized) return true;

  try {
    await liff.init({ liffId: LIFF_ID });
    _liffInitialized = true;

    // 如果尚未登入，自動導向 LINE 登入
    if (!liff.isLoggedIn()) {
      liff.login({ redirectUri: window.location.href });
      return false;
    }

    return true;
  } catch (err) {
    console.error("[lineAuth] LIFF 初始化失敗:", err);
    return false;
  }
}

/**
 * 取得目前登入的 LINE 使用者資料
 * 返回: { userId, displayName, pictureUrl, statusMessage }
 */
export async function getLiffProfile() {
  if (_liffProfile) return _liffProfile;

  try {
    if (!liff.isLoggedIn()) return null;

    const profile = await liff.getProfile();
    _liffProfile = {
      userId: profile.userId,
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl,
      statusMessage: profile.statusMessage || "",
    };
    return _liffProfile;
  } catch (err) {
    console.error("[lineAuth] 取得 LINE 個人資料失敗:", err);
    return null;
  }
}

/**
 * 取得 LIFF 存取 Token（用於後端驗證）
 */
export async function getLiffAccessToken() {
  try {
    return liff.getAccessToken();
  } catch {
    return null;
  }
}

/**
 * 判斷目前是否在 LINE 瀏覽器內開啟
 */
export async function isInLiffBrowser() {
  try {
    return liff.isInClient();
  } catch {
    return false;
  }
}

/**
 * LINE 登出
 */
export async function liffLogout() {
  try {
    liff.logout();
    _liffProfile = null;
    _liffInitialized = false;
  } catch (err) {
    console.error("[lineAuth] 登出失敗:", err);
  }
}

/**
 * 透過 LIFF 傳送訊息給使用者自己（需 chat_message.write scope）
 */
export async function sendLiffMessage(messages) {
  try {
    if (liff.isInClient()) {
      await liff.sendMessages(messages);
    }
  } catch (err) {
    console.error("[lineAuth] 傳送訊息失敗:", err);
  }
}
