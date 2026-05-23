// src/pages/line/LineEntry.jsx
// LINE 登入入口頁：LIFF 初始化 → 建立或讀取會員 → 首次建檔 → 導向 /line/today

import React, { useEffect, useState } from "react";
import { initLiff, getLiffProfile } from "../../lib/lineAuth";
import { findOrCreateMember, updateMemberProfile } from "../../lib/memberProfile";

const logo = "/logo.png";
const BLOOD_TYPES = ["A", "B", "AB", "O"];
const CITY_OPTIONS = [
  "台北市",
  "新北市",
  "桃園市",
  "台中市",
  "台南市",
  "高雄市",
  "基隆市",
  "新竹市",
  "嘉義市",
  "新竹縣",
  "苗栗縣",
  "彰化縣",
  "南投縣",
  "雲林縣",
  "嘉義縣",
  "屏東縣",
  "宜蘭縣",
  "花蓮縣",
  "台東縣",
  "澎湖縣",
  "金門縣",
  "連江縣",
];
const SLEEP_OPTIONS = ["少於 5 小時", "5-6 小時", "6-7 小時", "7-8 小時", "8 小時以上", "作息不固定"];
const DIET_OPTIONS = ["外食為主", "自煮為主", "蔬食為主", "高蛋白飲食", "甜食/手搖較多", "飲食不固定"];
const STRESS_OPTIONS = ["低", "中等", "偏高", "高", "非常高"];

function isProfileComplete(member) {
  return Boolean(
    member?.nickname &&
    member?.birthdate &&
    member?.blood_type &&
    member?.city &&
    member?.sleep_hours &&
    member?.diet_pattern &&
    member?.stress_level
  );
}

function buildInitialForm(member, profile) {
  return {
    nickname: member?.nickname || member?.line_display_name || profile?.displayName || "",
    birthdate: member?.birthdate || "",
    bloodType: member?.blood_type || "",
    city: member?.city || "",
    sleepHours: member?.sleep_hours || "",
    dietPattern: member?.diet_pattern || "",
    stressLevel: member?.stress_level || "",
  };
}

export default function LineEntry({ go }) {
  const [status, setStatus] = useState("loading"); // loading | form | saving | error | redirecting
  const [member, setMember] = useState(null);
  const [form, setForm] = useState(buildInitialForm());
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
        const { member: nextMember, error } = await findOrCreateMember(profile);
        if (error || !nextMember) {
          setErrorMsg("錯誤：" + (error?.message || error?.code || JSON.stringify(error) || "未知錯誤"));
          setStatus("error");
          return;
        }

        // 4. 儲存到 sessionStorage 供各頁面使用（避免重複查詢）
        sessionStorage.setItem("line_member", JSON.stringify(nextMember));
        sessionStorage.setItem("line_profile", JSON.stringify(profile));
        setMember(nextMember);
        setForm(buildInitialForm(nextMember, profile));

        setStatus("redirecting");

        // 5. 未完成 7 項建檔資料時停留本頁填寫；完成後進今日頁
        if (isProfileComplete(nextMember)) {
          go("/line/today");
        } else {
          setStatus("form");
        }
      } catch (err) {
        console.error("[LineEntry] 初始化失敗:", err);
        setErrorMsg("系統初始化失敗，請關閉後重新開啟。");
        setStatus("error");
      }
    }

    init();
  }, [go]);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!member?.line_user_id || status === "saving") return;

    const missing = Object.values(form).some((value) => !String(value || "").trim());
    if (missing) {
      setErrorMsg("請完成所有建檔資料，讓派森可以建立你的個人化健康背景。");
      setStatus("form");
      return;
    }

    setStatus("saving");
    const { member: updated, error } = await updateMemberProfile(member.line_user_id, form);
    if (error || !updated) {
      setErrorMsg("建檔儲存失敗：" + (error || "未知錯誤"));
      setStatus("error");
      return;
    }

    setMember(updated);
    setStatus("redirecting");
    go("/line/today");
  }

  return (
    <div className="min-h-screen bg-brand-bg px-5 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col">
        <div className="mb-8 flex items-center gap-3">
          <img src={logo} alt="植本邏輯" className="h-12 w-12 object-contain" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold-deep">PHYTOLOGIC</p>
            <p className="text-lg font-semibold text-brand-dark">LINE 會員建檔</p>
          </div>
        </div>

        {status === "loading" && (
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-brand-dark border-t-transparent" />
            <p className="text-sm text-brand-mid">正在確認您的身份...</p>
          </div>
        )}

        {status === "redirecting" && (
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-line border-t-transparent" />
            <p className="text-sm text-[#1E6B43]">歡迎回來，正在載入您的健康資料...</p>
          </div>
        )}

        {(status === "form" || status === "saving") && (
          <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
            <div className="mb-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-gold-deep">Profile</p>
              <h1 className="text-2xl font-semibold text-brand-dark">先讓派森認識你</h1>
              <p className="mt-2 text-sm leading-6 text-brand-mid">完成 7 項建檔資料後，之後的健康建議會依你的生活背景調整。</p>
            </div>

            {errorMsg && (
              <div className="mb-4 border border-[#F0CACA] bg-white px-4 py-3 text-sm leading-6 text-brand-error">
                {errorMsg}
              </div>
            )}

            <div className="grid gap-4">
              <Field label="暱稱">
                <input
                  value={form.nickname}
                  onChange={(e) => updateField("nickname", e.target.value)}
                  className="line-entry-input"
                  placeholder="想被怎麼稱呼"
                  required
                />
              </Field>

              <Field label="出生年月日">
                <input
                  type="date"
                  value={form.birthdate}
                  onChange={(e) => updateField("birthdate", e.target.value)}
                  className="line-entry-input"
                  required
                />
              </Field>

              <Field label="血型">
                <Select value={form.bloodType} onChange={(value) => updateField("bloodType", value)} options={BLOOD_TYPES} placeholder="選擇血型" />
              </Field>

              <Field label="居住城市">
                <Select value={form.city} onChange={(value) => updateField("city", value)} options={CITY_OPTIONS} placeholder="選擇城市" />
              </Field>

              <Field label="睡眠時間">
                <Select value={form.sleepHours} onChange={(value) => updateField("sleepHours", value)} options={SLEEP_OPTIONS} placeholder="平均睡眠時間" />
              </Field>

              <Field label="飲食習慣">
                <Select value={form.dietPattern} onChange={(value) => updateField("dietPattern", value)} options={DIET_OPTIONS} placeholder="主要飲食型態" />
              </Field>

              <Field label="壓力感受">
                <Select value={form.stressLevel} onChange={(value) => updateField("stressLevel", value)} options={STRESS_OPTIONS} placeholder="最近壓力程度" />
              </Field>
            </div>

            <button
              type="submit"
              disabled={status === "saving"}
              className="mt-6 w-full rounded-2xl bg-brand-dark py-4 text-sm font-semibold text-white transition disabled:opacity-60 active:scale-98"
            >
              {status === "saving" ? "儲存中..." : "完成建檔，進入今日狀態"}
            </button>
          </form>
        )}

        {status === "error" && (
          <div className="flex flex-1 items-center">
            <div className="w-full border border-[#F0CACA] bg-white p-6 text-center">
              <p className="mb-2 text-lg font-semibold text-brand-error">連線異常</p>
              <p className="mb-5 text-sm leading-6 text-brand-mid">{errorMsg}</p>
              <button
                onClick={() => window.location.reload()}
                className="rounded-full bg-brand-dark px-6 py-3 text-sm font-medium text-white"
              >
                重新嘗試
              </button>
            </div>
          </div>
        )}

        <p className="mt-8 text-center text-xs text-[#9A8C68]">植本邏輯 PHYTOLOGIC</p>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold text-brand-gold-deep">{label}</span>
      {children}
    </label>
  );
}

function Select({ value, onChange, options, placeholder }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="line-entry-input" required>
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  );
}
