// src/pages/line/LineCheckinPage.jsx
// 今日飲用打卡：台灣時區判斷、防重複、積分更新

import React, { useEffect, useState } from "react";
import LineMemberLayout from "./LineMemberLayout";
import { doCheckin, getTaiwanToday } from "../../lib/memberProfile";

export default function LineCheckinPage({ route, go }) {
  const [member, setMember] = useState(null);
  const [state, setState] = useState("idle"); // idle | loading | done | already
  const [result, setResult] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("line_member");
    if (!stored) { go("/line/entry"); return; }
    const m = JSON.parse(stored);
    setMember(m);

    // 若今天已打卡，直接顯示已完成
    if (m.last_checkin_date === getTaiwanToday()) {
      setState("already");
    }
  }, [go]);

  async function handleCheckin() {
    if (!member?.id || state === "loading") return;
    setState("loading");

    const res = await doCheckin(member.id);

    if (res.alreadyChecked) {
      setState("already");
      return;
    }

    if (res.success) {
      // 更新 sessionStorage 的積分
      const updated = {
        ...member,
        le: res.le,
        health_score: res.healthScore,
        streak_days: res.streakDays,
        last_checkin_date: getTaiwanToday(),
      };
      sessionStorage.setItem("line_member", JSON.stringify(updated));
      setMember(updated);
      setResult(res);
      setState("done");
    } else {
      setState("idle");
      alert(res.message || "打卡失敗，請稍後再試");
    }
  }

  const drink = member?.recommended_drink || "雪山植萃";

  return (
    <LineMemberLayout route={route} go={go} member={member}>
      <div className="px-4 py-8">

        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#8B7A4C]">今日飲用</p>
        <h1 className="mb-6 text-2xl font-semibold text-[#123828]">今天喝了嗎？</h1>

        {/* 推薦飲品展示 */}
        <div className="mb-6 rounded-2xl border border-[#E7DDBF] bg-white p-6 text-center">
          <p className="mb-1 text-xs text-[#8B7A4C]">今日推薦飲品</p>
          <p className="text-2xl font-semibold text-[#123828]">{drink}</p>
          <p className="mt-2 text-sm text-[#49675A]">每一口都是給身體的一次修復</p>
        </div>

        {/* 打卡積分預告 */}
        <div className="mb-6 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-2xl border border-[#E7DDBF] bg-white py-4">
            <p className="text-lg font-semibold text-[#123828]">+10</p>
            <p className="text-[10px] text-[#8B7A4C]">生命能量 LE</p>
          </div>
          <div className="rounded-2xl border border-[#E7DDBF] bg-white py-4">
            <p className="text-lg font-semibold text-[#123828]">+3</p>
            <p className="text-[10px] text-[#8B7A4C]">健康值</p>
          </div>
          <div className="rounded-2xl border border-[#E7DDBF] bg-white py-4">
            <p className="text-lg font-semibold text-[#123828]">
              {member?.streak_days != null ? member.streak_days + 1 : "?"}
            </p>
            <p className="text-[10px] text-[#8B7A4C]">連續天數</p>
          </div>
        </div>

        {/* 狀態顯示 */}
        {state === "done" && result && (
          <div className="mb-5 rounded-2xl border border-[#BFDABC] bg-[#DDEEDB] p-5 text-center">
            <p className="mb-1 text-base font-semibold text-[#1E6B43]">✓ 打卡成功！</p>
            <p className="text-sm text-[#3E6350]">{result.message}</p>
            <div className="mt-3 flex justify-center gap-6 text-sm">
              <span className="text-[#1E6B43]">LE {result.le}</span>
              <span className="text-[#1E6B43]">健康值 {result.healthScore}</span>
              <span className="text-[#1E6B43]">{result.streakDays} 天連續</span>
            </div>
          </div>
        )}

        {state === "already" && (
          <div className="mb-5 rounded-2xl border border-[#BFDABC] bg-[#DDEEDB] p-5 text-center">
            <p className="mb-1 text-base font-semibold text-[#1E6B43]">今天已完成飲用 ✓</p>
            <p className="text-sm text-[#3E6350]">明天再回來，讓習慣持續累積</p>
          </div>
        )}

        {/* 打卡按鈕 */}
        {(state === "idle" || state === "loading") && (
          <button
            onClick={handleCheckin}
            disabled={state === "loading"}
            className="w-full rounded-2xl bg-[#123828] py-4 text-sm font-semibold text-white transition disabled:opacity-60 active:scale-98"
          >
            {state === "loading" ? "記錄中..." : "今天已飲用，完成打卡"}
          </button>
        )}

        {(state === "done" || state === "already") && (
          <button
            onClick={() => go("/line/today")}
            className="mt-3 w-full rounded-2xl border border-[#E7DDBF] bg-white py-4 text-sm font-semibold text-[#123828] transition"
          >
            回到今日狀態
          </button>
        )}

        {/* 品牌文案 */}
        <p className="mt-8 text-center text-xs leading-6 text-[#9A8C68]">
          每一天回來，都是讓自己變好的證據。
        </p>
      </div>
    </LineMemberLayout>
  );
}
