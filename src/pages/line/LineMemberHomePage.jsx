// src/pages/line/LineMemberHomePage.jsx
// 會員專區首頁：會員狀態、每日洞察、Dr. Marvin 引導、八大功能入口

import React, { useEffect, useState } from "react";
import {
  Bell,
  ClipboardCheck,
  FileText,
  Gift,
  HeartPulse,
  Share2,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  UserRound,
} from "lucide-react";
import LineMemberLayout from "./LineMemberLayout";

const FEATURE_ICONS = {
  checkin: ClipboardCheck,
  reports: FileText,
  assessment: Stethoscope,
  shop: ShoppingBag,
  tasks: Gift,
  profile: UserRound,
  referral: Share2,
  events: Bell,
};

function readStoredMember() {
  try {
    const stored = sessionStorage.getItem("line_member");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export default function LineMemberHomePage({ route, go }) {
  const [member, setMember] = useState(readStoredMember);
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function load() {
      const storedMember = readStoredMember();
      if (!storedMember?.line_user_id) {
        go("/line/entry");
        return;
      }

      setMember(storedMember);
      setLoading(true);
      setErrorMsg("");

      try {
        const params = new URLSearchParams({ lineUserId: storedMember.line_user_id });
        const response = await fetch(`/api/member/home?${params.toString()}`);
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "首頁資料讀取失敗");

        setHomeData(result);
        setMember(result.profile);
        sessionStorage.setItem("line_member", JSON.stringify(result.profile));
      } catch (error) {
        console.error("[LineMemberHomePage] load failed:", error);
        setErrorMsg(error.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [go]);

  const profile = homeData?.profile || member;

  return (
    <LineMemberLayout route={route} go={go} member={profile}>
      <div className="px-4 py-5">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-dark border-t-transparent" />
          </div>
        ) : errorMsg ? (
          <div className="border border-[#F0CACA] bg-white p-5 text-sm leading-6 text-brand-error">
            {errorMsg}
          </div>
        ) : (
          <>
            <section className="mb-5">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-brand-gold-deep">
                Member Home
              </p>
              <h1 className="text-2xl font-semibold text-brand-dark">
                {profile?.display_name || "健康夥伴"}，歡迎回來
              </h1>
            </section>

            <section className="mb-4 grid grid-cols-3 gap-3">
              <Metric label="生命能量" value={profile?.le_points ?? profile?.le ?? 0} unit="LE" />
              <Metric label="貢獻點" value={profile?.cp_points ?? profile?.cp ?? 0} unit="CP" />
              <Metric label="健康分" value={profile?.health_score ?? 0} unit="分" />
            </section>

            <section className="mb-4 border border-brand-border-warm bg-white p-5">
              <div className="mb-3 flex items-center gap-2 text-brand-gold-deep">
                <Sparkles className="h-4 w-4" />
                <p className="text-xs font-semibold uppercase tracking-widest">今日洞察</p>
              </div>
              <p className="text-sm leading-7 text-brand-dark">{homeData?.daily_insight}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-brand-mid">
                <InfoPill label="血型" value={profile?.blood_type || "未填"} />
                <InfoPill label="生命靈數" value={profile?.life_number || profile?.numerology_number || "計算中"} />
              </div>
            </section>

            <section className="mb-4 border border-[#D8E8D2] bg-[#F2F8EF] p-5">
              <div className="mb-2 flex items-center gap-2 text-[#1E6B43]">
                <HeartPulse className="h-5 w-5" />
                <p className="text-sm font-semibold">My Dr. Marvin</p>
              </div>
              <p className="text-sm leading-7 text-[#315744]">
                完成深度檢測後，系統會建立五維健康分數、植萃推薦與七日啟動計畫。
              </p>
              <button
                type="button"
                onClick={() => go("/line/assessment")}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-dark px-5 py-3 text-xs font-semibold text-white"
              >
                開始檢測
                <Stethoscope className="h-4 w-4" />
              </button>
            </section>

            <section className="mb-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-brand-dark">會員功能</p>
                <p className="text-xs text-brand-gold-deep">
                  {homeData?.has_checked_in_today ? "今日已打卡" : "今日尚未打卡"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {(homeData?.feature_grid || []).map((feature) => {
                  const Icon = FEATURE_ICONS[feature.id] || Sparkles;
                  const disabled = ["preview", "empty"].includes(feature.status) && feature.id !== "reports";
                  return (
                    <button
                      key={feature.id}
                      type="button"
                      onClick={() => !disabled && go(feature.path)}
                      className={`flex min-h-[88px] items-center gap-3 border border-brand-border-warm bg-white p-4 text-left transition ${
                        disabled ? "opacity-55" : "active:scale-98"
                      }`}
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-surface text-brand-dark">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-brand-dark">{feature.label}</span>
                        <span className="mt-1 block text-xs text-brand-gold-deep">
                          {feature.status === "done"
                            ? "已完成"
                            : feature.status === "preview"
                            ? "規劃中"
                            : feature.status === "empty"
                            ? "尚無資料"
                            : "可使用"}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {homeData?.announcements?.length > 0 && (
              <section className="mb-4 border border-brand-border-warm bg-white p-5">
                <p className="mb-3 text-sm font-semibold text-brand-dark">最新活動</p>
                <div className="grid gap-3">
                  {homeData.announcements.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => go("/line/events")}
                      className="text-left"
                    >
                      <p className="text-sm font-medium text-brand-dark">{item.title}</p>
                      {(item.summary || item.content) && (
                        <p className="mt-1 text-xs leading-5 text-brand-mid">
                          {item.summary || item.content}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </LineMemberLayout>
  );
}

function Metric({ label, value, unit }) {
  return (
    <div className="border border-brand-border-warm bg-white px-3 py-4 text-center">
      <p className="text-lg font-semibold text-brand-dark">{value}</p>
      <p className="text-[10px] text-brand-gold-deep">{unit}</p>
      <p className="text-[10px] text-[#9A8C68]">{label}</p>
    </div>
  );
}

function InfoPill({ label, value }) {
  return (
    <div className="bg-brand-surface px-3 py-2">
      <span className="mr-2 text-brand-gold-deep">{label}</span>
      <span className="font-semibold text-brand-dark">{value}</span>
    </div>
  );
}
