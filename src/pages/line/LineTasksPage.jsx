// src/pages/line/LineTasksPage.jsx
import React, { useEffect, useState } from "react";
import LineMemberLayout from "./LineMemberLayout";
import { getCheckinHistory } from "../../lib/memberProfile";

export default function LineTasksPage({ route, go }) {
  const [member, setMember] = useState(null);
  const [checkinDates, setCheckinDates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const stored = sessionStorage.getItem("line_member");
      if (!stored) { go("/line/entry"); return; }
      const m = JSON.parse(stored);
      setMember(m);

      const history = await getCheckinHistory(m.id, 7);
      setCheckinDates(history.map(h => h.checkin_date));
      setLoading(false);
    }
    load();
  }, [go]);

  if (loading || !member) {
    return (
      <LineMemberLayout route={route} go={go} member={member}>
        <div className="flex h-64 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#123828] border-t-transparent" />
        </div>
      </LineMemberLayout>
    );
  }

  const completedDays = Math.min(member.streak_days || 0, 7);
  const allDone = completedDays >= 7;

  const TASK_LABELS = [
    "第一天，開始改變",
    "第二天，身體在感受",
    "第三天，習慣正在形成",
    "第四天，過了一半",
    "第五天，感受身體的變化",
    "第六天，快到了",
    "第七天，你做到了",
  ];

  return (
    <LineMemberLayout route={route} go={go} member={member}>
      <div className="px-4 py-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#8B7A4C]">活動任務</p>
        <h1 className="mb-1 text-2xl font-semibold text-[#123828]">七日啟動任務</h1>
        <p className="mb-6 text-sm text-[#49675A]">連續七天飲用，建立你的健康日常。</p>

        {/* 進度條 */}
        <div className="mb-6 rounded-2xl border border-[#E7DDBF] bg-white p-5">
          <div className="mb-3 flex justify-between text-sm">
            <span className="font-medium text-[#123828]">完成進度</span>
            <span className="text-[#8B7A4C]">{completedDays} / 7 天</span>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: 7 }, (_, i) => {
              const done = i < completedDays;
              return (
                <div
                  key={i}
                  className={`flex h-9 items-center justify-center rounded-xl text-xs font-semibold transition ${
                    done
                      ? "bg-[#123828] text-white"
                      : "bg-[#F0EBE0] text-[#9A8C68]"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </div>
              );
            })}
          </div>
        </div>

        {/* 每天任務列表 */}
        <div className="mb-6 space-y-3">
          {TASK_LABELS.map((label, i) => {
            const done = i < completedDays;
            const isCurrent = i === completedDays && !allDone;
            return (
              <div
                key={i}
                className={`flex items-center gap-3 rounded-2xl border p-4 ${
                  done
                    ? "border-[#BFDABC] bg-[#DDEEDB]"
                    : isCurrent
                    ? "border-[#D8C99C] bg-white shadow-sm"
                    : "border-[#E7DDBF] bg-white opacity-60"
                }`}
              >
                <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                  done ? "bg-[#1E6B43] text-white" : isCurrent ? "bg-[#123828] text-white" : "bg-[#F0EBE0] text-[#9A8C68]"
                }`}>
                  {done ? "✓" : i + 1}
                </div>
                <div>
                  <p className={`text-sm font-medium ${done ? "text-[#1E6B43]" : isCurrent ? "text-[#123828]" : "text-[#9A8C68]"}`}>
                    {label}
                  </p>
                  {isCurrent && (
                    <p className="text-xs text-[#8B7A4C]">今天完成打卡即可完成</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 完成獎勵 */}
        {allDone && (
          <div className="rounded-2xl border border-[#D8C99C] bg-[#F8E6AD] p-5 text-center">
            <p className="mb-1 text-lg font-semibold text-[#B8871B]">🎉 七日任務完成！</p>
            <p className="text-sm text-[#7B6229]">你已經建立了屬於自己的健康日常。繼續保持，讓改變成為一生的習慣。</p>
          </div>
        )}

        {!allDone && (
          <button onClick={() => go("/line/checkin")} className="w-full rounded-2xl bg-[#123828] py-4 text-sm font-semibold text-white">
            前往今日打卡
          </button>
        )}
      </div>
    </LineMemberLayout>
  );
}
