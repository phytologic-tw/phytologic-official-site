// src/pages/line/LineTodayPage.jsx
// 今日狀態頁：幸運色、健康建議、推薦飲品、積分總覽

import React, { useEffect, useState } from "react";
import LineMemberLayout from "./LineMemberLayout";
import { getTodayMessage } from "../../lib/dailyMessage";
import { getTaiwanToday } from "../../lib/memberProfile";

const DRINK_COLORS = {
  雪山植萃: { bg: "#F5EFE4", text: "#A98E61", border: "#E2D5B5" },
  青檸植萃: { bg: "#DDEEDB", text: "#1E6B43", border: "#BFDABC" },
  玫瑰植萃: { bg: "#F5DDE2", text: "#AA3F57", border: "#E9BBC6" },
  桂香植萃: { bg: "#F8E6AD", text: "#B8871B", border: "#E6C76B" },
  紫莓植萃: { bg: "#E7DDF6", text: "#65439A", border: "#D4C1EF" },
};

export default function LineTodayPage({ route, go }) {
  const [member, setMember] = useState(null);
  const [todayMsg, setTodayMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function refreshMember() {
      const stored = sessionStorage.getItem("line_member");
      if (stored) setMember(JSON.parse(stored));
    }

    function handleVisibilityChange() {
      if (!document.hidden) refreshMember();
    }

    async function load() {
      const stored = sessionStorage.getItem("line_member");
      if (!stored) { go("/line/entry"); return; }

      const m = JSON.parse(stored);
      setMember(m);

      const msg = await getTodayMessage(m);
      setTodayMsg(msg);
      setLoading(false);
    }
    load();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [go]);

  if (loading) {
    return (
      <LineMemberLayout route={route} go={go} member={member}>
        <div className="flex h-64 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-dark border-t-transparent" />
        </div>
      </LineMemberLayout>
    );
  }

  const drink = member?.recommended_drink || "雪山植萃";
  const drinkColor = DRINK_COLORS[drink] || DRINK_COLORS["雪山植萃"];
  const luckyColor = todayMsg?.lucky_color || member?.lucky_color || "珍珠白";
  const today = getTaiwanToday();
  const todayChecked = member?.last_checkin_date === today;

  return (
    <LineMemberLayout route={route} go={go} member={member}>
      <div className="px-4 py-5">

        {/* 日期 */}
        <p className="mb-1 text-xs tracking-widest text-brand-gold-deep">
          {new Date().toLocaleDateString("zh-TW", { month: "long", day: "numeric", weekday: "long" })}
        </p>
        <h1 className="mb-5 text-2xl font-semibold text-brand-dark">
          {member?.display_name?.split(" ")[0] || "健康夥伴"}，今天好嗎？
        </h1>

        {/* 今日幸運色卡 */}
        <div
          className="mb-4 rounded-2xl p-5"
          style={{ background: drinkColor.bg, border: `1px solid ${drinkColor.border}` }}
        >
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest" style={{ color: drinkColor.text }}>
            今日幸運色
          </p>
          <p className="text-2xl font-semibold" style={{ color: drinkColor.text }}>{luckyColor}</p>
          {todayMsg?.content && (
            <p className="mt-3 text-sm leading-7" style={{ color: drinkColor.text, opacity: 0.85 }}>
              {todayMsg.content}
            </p>
          )}
        </div>

        {/* 今日行動 */}
        {todayMsg?.recommended_action && (
          <div className="mb-4 rounded-2xl border border-brand-border-warm bg-white px-5 py-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-brand-gold-deep">今日行動</p>
            <p className="text-sm font-medium text-brand-dark">{todayMsg.recommended_action}</p>
          </div>
        )}

        {/* 積分與狀態列 */}
        <div className="mb-4 grid grid-cols-3 gap-3">
          <StatCard label="生命能量" value={member?.le || 0} unit="LE" />
          <StatCard label="健康值" value={member?.health_score || 0} unit="分" />
          <StatCard label="連續打卡" value={member?.streak_days || 0} unit="天" />
        </div>

        {/* 推薦飲品 */}
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-brand-border-warm bg-white px-5 py-4">
          <div>
            <p className="mb-1 text-xs text-brand-gold-deep">今日推薦</p>
            <p className="font-semibold text-brand-dark">{drink}</p>
          </div>
          <span
            className="rounded-full px-4 py-2 text-xs font-semibold"
            style={{ background: drinkColor.bg, color: drinkColor.text }}
          >
            適合你的選擇
          </span>
        </div>

        {/* 今日打卡 CTA */}
        {todayChecked ? (
          <div className="rounded-2xl border border-[#BFDABC] bg-[#DDEEDB] p-5 text-center">
            <p className="text-sm font-semibold text-[#1E6B43]">✓ 今天已完成飲用</p>
            <p className="mt-1 text-xs text-[#3E6350]">繼續保持，明天再回來打卡</p>
          </div>
        ) : (
          <button
            onClick={() => go("/line/checkin")}
            className="w-full rounded-2xl bg-brand-dark py-4 text-sm font-semibold text-white transition active:scale-98"
          >
            今天已飲用 — 前往打卡
          </button>
        )}

      </div>
    </LineMemberLayout>
  );
}

function StatCard({ label, value, unit }) {
  return (
    <div className="rounded-2xl border border-brand-border-warm bg-white px-3 py-4 text-center">
      <p className="text-lg font-semibold text-brand-dark">{value}</p>
      <p className="text-[10px] text-brand-gold-deep">{unit}</p>
      <p className="text-[10px] text-[#9A8C68]">{label}</p>
    </div>
  );
}
