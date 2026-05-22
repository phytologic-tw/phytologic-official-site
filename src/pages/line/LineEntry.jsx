// src/pages/line/LineEntry.jsx
// LINE 登入入口頁：LIFF 初始化 → 取得 userId → 建立或讀取會員 → 導向 /line/today

import React, { useEffect, useState } from "react";
import { initLiff, getLiffProfile } from "../../lib/lineAuth";
import { findOrCreateMember } from "../../lib/memberProfile";

const logo = "/logo.png";

export default function LineEntry({ go }) {
  const [status, setStatus] = useState("loading"); // loading | error | redirecting
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function init() {
      try {
        setStatus("loading");

        // 1. 初始化 LIFF（若未登入會自動跳轉 LINE 登入）
        const ok = await initLiff();
        if (!ok) return; // 正在導向 LINE 登入，等待跳轉

        // 2. 取得 LINE 個人資料
        const profile = await getLiffProfile();
        if (!profile) {
          setErrorMsg("無法取得 LINE 個人資料，請確認已登入 LINE。");
          setStatus("error");
          return;
        }

        // 3. 建立或讀取 Supabase 會員
        const { member, error } = await findOrCreateMember(profile);
        if (error || !member) {
          setErrorMsg("錯誤：" + (error?.message || error?.code || JSON.stringify(error) || "未知錯誤"));
          setStatus("error");
          return;
        }

        // 4. 儲存到 sessionStorage 供各頁面使用（避免重複查詢）
        sessionStorage.setItem("line_member", JSON.stringify(member));
        sessionStorage.setItem("line_profile", JSON.stringify(profile));

        setStatus("redirecting");

        // 5. 新會員導向問卷，既有會員導向今日狀態
        if (member.isNew || !member.health_type) {
          go("/line/assessment");
        } else {
          go("/line/today");
        }
      } catch (err) {
        console.error("[LineEntry] 初始化失敗:", err);
        setErrorMsg("系統初始化失敗，請關閉後重新開啟。");
        setStatus("error");
      }
    }

    init();
  }, [go]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F9F5EA] px-6">
      <img src={logo} alt="植本邏輯" className="mb-8 h-16 w-16 object-contain" />

      {status === "loading" && (
        <>
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#123828] border-t-transparent" />
          <p className="text-sm text-[#49675A]">正在確認您的身份...</p>
        </>
      )}

      {status === "redirecting" && (
        <>
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#06C755] border-t-transparent" />
          <p className="text-sm text-[#1E6B43]">歡迎回來，正在載入您的健康資料...</p>
        </>
      )}

      {status === "error" && (
        <div className="w-full max-w-sm rounded-2xl border border-[#F0CACA] bg-white p-6 text-center">
          <p className="mb-2 text-lg font-semibold text-[#9A3C2D]">連線異常</p>
          <p className="mb-5 text-sm leading-6 text-[#49675A]">{errorMsg}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-full bg-[#123828] px-6 py-3 text-sm font-medium text-white"
          >
            重新嘗試
          </button>
        </div>
      )}

      <p className="mt-12 text-xs text-[#9A8C68]">植本邏輯 PHYTOLOGIC</p>
    </div>
  );
}
