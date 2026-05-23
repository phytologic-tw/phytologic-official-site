// src/pages/line/LineProfilePage.jsx
import React, { useEffect, useState } from "react";
import LineMemberLayout from "./LineMemberLayout";
import { calcLevel, calcTitle } from "../../lib/memberProfile";

const DRINK_COLORS = {
  雪山植萃: { bg: "#F5EFE4", text: "#A98E61" },
  青檸植萃: { bg: "#DDEEDB", text: "#1E6B43" },
  玫瑰植萃: { bg: "#F5DDE2", text: "#AA3F57" },
  桂香植萃: { bg: "#F8E6AD", text: "#B8871B" },
  紫莓植萃: { bg: "#E7DDF6", text: "#65439A" },
};

const LEVEL_NEXT_LE = { 1: 100, 2: 300, 3: 1000, 4: 9999 };

export default function LineProfilePage({ route, go }) {
  const [member, setMember] = useState(null);

  useEffect(() => {
    function refreshMember() {
      const stored = sessionStorage.getItem("line_member");
      if (stored) setMember(JSON.parse(stored));
    }

    function handleVisibilityChange() {
      if (!document.hidden) refreshMember();
    }

    const stored = sessionStorage.getItem("line_member");
    if (!stored) { go("/line/entry"); return; }
    setMember(JSON.parse(stored));
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [go]);

  if (!member) return null;

  const drink = member.recommended_drink || "雪山植萃";
  const color = DRINK_COLORS[drink] || DRINK_COLORS["雪山植萃"];
  const level = member.level_number || 1;
  const le = member.le || 0;
  const nextLe = LEVEL_NEXT_LE[level] || 100;
  const progress = Math.min((le / nextLe) * 100, 100);

  return (
    <LineMemberLayout route={route} go={go} member={member}>
      <div className="px-4 py-6">
        {/* 頭像與身份 */}
        <div className="mb-6 flex flex-col items-center text-center">
          {member.picture_url ? (
            <img src={member.picture_url} alt={member.display_name} className="mb-3 h-20 w-20 rounded-full border-2 border-brand-border-warm object-cover" />
          ) : (
            <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-brand-dark text-2xl font-semibold text-white">
              {(member.display_name || "?")[0]}
            </div>
          )}
          <h2 className="text-xl font-semibold text-brand-dark">{member.display_name || "健康夥伴"}</h2>
          <div className="mt-1 flex items-center gap-2">
            <span className="rounded-full bg-brand-dark px-3 py-1 text-xs font-semibold text-white">Lv.{level}</span>
            <span className="text-sm text-brand-gold-deep">{member.title || "改變者"}</span>
          </div>
        </div>

        {/* 等級進度條 */}
        <div className="mb-5 rounded-2xl border border-brand-border-warm bg-white p-5">
          <div className="mb-2 flex justify-between text-xs text-brand-gold-deep">
            <span>升級進度</span>
            <span>{le} / {nextLe} LE</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#F0EBE0]">
            <div className="h-full rounded-full bg-brand-dark transition-all" style={{ width: `${progress}%` }} />
          </div>
          {level < 4 && (
            <p className="mt-2 text-xs text-[#9A8C68]">再 {nextLe - le} LE 升級為「{calcTitle(level + 1)}」</p>
          )}
        </div>

        {/* 積分資料 */}
        <div className="mb-4 grid grid-cols-2 gap-3">
          <InfoCard label="生命能量" value={`${le} LE`} />
          <InfoCard label="貢獻點數" value={`${member.cp || 0} CP`} />
          <InfoCard label="健康值" value={`${member.health_score || 0} 分`} />
          <InfoCard label="連續打卡" value={`${member.streak_days || 0} 天`} />
        </div>

        {/* 健康特質 */}
        <div className="mb-4 rounded-2xl border border-brand-border-warm bg-white p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-gold-deep">健康特質</p>
          <div className="flex flex-wrap gap-2">
            {member.health_type && (
              <span className="rounded-full bg-[#F0EBE0] px-3 py-1 text-xs text-brand-mid">{member.health_type}</span>
            )}
            {member.age_group && (
              <span className="rounded-full bg-[#F0EBE0] px-3 py-1 text-xs text-brand-mid">{member.age_group}</span>
            )}
          </div>
        </div>

        {/* 推薦飲品與幸運色 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl p-4 text-center" style={{ background: color.bg }}>
            <p className="mb-1 text-[10px]" style={{ color: color.text }}>推薦飲品</p>
            <p className="text-sm font-semibold" style={{ color: color.text }}>{drink}</p>
          </div>
          <div className="rounded-2xl border border-brand-border-warm bg-white p-4 text-center">
            <p className="mb-1 text-[10px] text-brand-gold-deep">幸運色</p>
            <p className="text-sm font-semibold text-brand-dark">{member.lucky_color || "珍珠白"}</p>
          </div>
        </div>

        {/* 重新做分析 */}
        {!member.health_type && (
          <button
            onClick={() => go("/line/assessment")}
            className="mt-5 w-full rounded-2xl border border-brand-border-gold bg-white py-4 text-sm font-semibold text-brand-dark"
          >
            完成派森分析，了解你的健康特質
          </button>
        )}
      </div>
    </LineMemberLayout>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-brand-border-warm bg-white p-4 text-center">
      <p className="text-base font-semibold text-brand-dark">{value}</p>
      <p className="text-[10px] text-brand-gold-deep">{label}</p>
    </div>
  );
}
