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

// 台灣時區星期幾（0=Sunday … 6=Saturday）
function getTaiwanDayOfWeek() {
  const label = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Taipei",
    weekday: "short",
  }).format(new Date());
  return { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[label] ?? new Date().getDay();
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

        if (!result.daily_insight_generated) {
          fetch("/api/dr-marvin/insight", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lineUserId: storedMember.line_user_id }),
          })
            .then((response) => response.json())
            .then((insightResult) => {
              if (!insightResult?.daily_insight) return;
              setHomeData((current) => current ? {
                ...current,
                daily_insight: insightResult.daily_insight,
                daily_insight_generated: true,
              } : current);
              if (insightResult.profile) {
                setMember(insightResult.profile);
                sessionStorage.setItem("line_member", JSON.stringify(insightResult.profile));
              }
            })
            .catch((insightError) => {
              console.error("[LineMemberHomePage] insight generation failed:", insightError);
            });
        }
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
  const announcements = homeData?.announcements ?? [];

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
            {/* 區塊 A｜身份卡 */}
            <section className="mb-5">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-brand-gold-deep">
                Member Home
              </p>
              <div className="flex items-end justify-between">
                <h1 className="text-2xl font-semibold text-brand-dark">
                  {profile?.display_name || "健康夥伴"}，歡迎回來
                </h1>
                {(profile?.streak_days ?? 0) > 0 && (
                  <span className="mb-0.5 shrink-0 text-xs font-medium text-brand-gold-deep">
                    🔥 {profile.streak_days} 天
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-brand-mid">
                {profile?.level || "L1"} · {profile?.title || "改變者"}
              </p>
            </section>

            {/* 三點數儀表：LE / CP / P（規格§1.1 區塊A） */}
            <section className="mb-4 grid grid-cols-3 gap-3">
              <Metric label="幸運能量" value={profile?.le_points ?? profile?.le ?? 0} unit="LE" />
              <Metric label="貢獻點" value={profile?.cp_points ?? profile?.cp ?? 0} unit="CP" />
              <Metric label="平台點" value={profile?.p_points ?? profile?.p ?? 0} unit="P" />
            </section>

            {/* 區塊 B｜今日任務提示卡（CTA 最高優先）*/}
            <section className="mb-4 border border-brand-border-warm bg-white p-5">
              {homeData?.has_checked_in_today ? (
                <div>
                  <p className="text-sm font-semibold text-[#1E6B43]">
                    ✓ 今日任務已完成！明天繼續保持。
                  </p>
                  {(profile?.streak_days ?? 0) > 0 && (
                    <p className="mt-1 text-xs text-brand-mid">
                      🔥 你已連續 {profile.streak_days} 天完成任務
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-brand-gold-deep">
                    今日任務
                  </p>
                  <p className="mb-2 text-sm font-semibold text-brand-dark">
                    飲用一杯植萃綠飲，並完成飲用打卡
                  </p>
                  <p className="mb-4 text-xs text-brand-mid">
                    完成後可獲得：LE +15 ｜ CP +1
                  </p>
                  {(profile?.streak_days ?? 0) > 0 && (
                    <p className="mb-3 text-xs text-brand-mid">
                      🔥 你已連續 {profile.streak_days} 天完成任務
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => go("/line/checkin")}
                    className="inline-flex items-center rounded-full bg-brand-dark px-5 py-3 text-xs font-semibold text-white"
                  >
                    前往任務中心 →
                  </button>
                </>
              )}
            </section>

            {!homeData?.profile_completed && (
              <section className="mb-4 border border-brand-border-gold bg-[#FFF9EA] p-5">
                <p className="mb-2 text-sm font-semibold text-brand-dark">完成角色建檔</p>
                <p className="text-sm leading-7 text-brand-mid">
                  還差 {(homeData?.missing_profile_fields || []).map((field) => field.label).join("、") || "基本資料"}，
                  完成後會啟動七日計畫與個人化洞察。
                </p>
                <button
                  type="button"
                  onClick={() => go("/line/entry")}
                  className="mt-4 inline-flex items-center rounded-full bg-brand-dark px-5 py-3 text-xs font-semibold text-white"
                >
                  前往完成建檔
                </button>
              </section>
            )}

            {homeData?.seven_day_plan && (
              <section className="mb-4 border border-brand-border-warm bg-white p-5">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold-deep">7 Day Start</p>
                    <p className="text-sm font-semibold text-brand-dark">
                      第 {homeData.seven_day_plan.current_day} 天 · {homeData.seven_day_plan.days?.[homeData.seven_day_plan.current_day - 1]?.title}
                    </p>
                  </div>
                  <p className="text-xs text-brand-gold-deep">
                    {homeData.seven_day_plan.completed_days || 0}/7
                  </p>
                </div>
                <p className="text-sm leading-7 text-brand-mid">
                  {homeData.seven_day_plan.days?.[homeData.seven_day_plan.current_day - 1]?.action}
                </p>
                <button
                  type="button"
                  onClick={() => go(homeData.seven_day_plan.days?.[homeData.seven_day_plan.current_day - 1]?.path || "/line/tasks")}
                  className="mt-4 inline-flex items-center rounded-full border border-brand-border-gold px-5 py-3 text-xs font-semibold text-brand-dark"
                >
                  查看今日任務
                </button>
              </section>
            )}

            {/* 區塊 C｜今日洞察 */}
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
              <p className="mt-3 text-[10px] leading-5 text-[#9A8C68]">
                本日洞察融合傳統能量學說，提供正向參考，不構成醫療建議。
              </p>
            </section>

            {/* 區塊 D｜Dr.Marvin 知識卡片（有報告→查看；無→首次檢測）*/}
            <section className="mb-4 border border-[#D8E8D2] bg-[#F2F8EF] p-5">
              <div className="mb-2 flex items-center gap-2 text-[#1E6B43]">
                <HeartPulse className="h-5 w-5" />
                <p className="text-sm font-semibold">My Dr. Marvin</p>
              </div>
              {(homeData?.reports_count ?? 0) > 0 ? (
                <>
                  <p className="text-sm leading-7 text-[#315744]">
                    你的健康報告已建立。定期查看 Dr. Marvin 的個人化建議，讓計畫持續升級。
                  </p>
                  <button
                    type="button"
                    onClick={() => go("/line/reports")}
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#1E6B43] px-5 py-3 text-xs font-semibold text-[#1E6B43]"
                  >
                    查看我的報告
                    <FileText className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
            </section>

            {/* 區塊 E｜情境提示（週一：更新週健康數據）*/}
            {getTaiwanDayOfWeek() === 1 && (
              <section className="mb-4 border border-brand-border-warm bg-[#FFF9EA] p-4">
                <p className="text-sm text-brand-dark">
                  📊 新的一週開始，可以在健檢中心更新本週身體數據囉
                </p>
                <button
                  type="button"
                  onClick={() => go("/line/checkin")}
                  className="mt-2 text-xs font-semibold text-brand-dark underline underline-offset-2"
                >
                  前往健檢 →
                </button>
              </section>
            )}

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

            {announcements.length > 0 && (
              <section className="mb-4 border border-brand-border-warm bg-white p-5">
                <p className="mb-3 text-sm font-semibold text-brand-dark">最新活動</p>
                <div className="grid gap-3">
                  {announcements.map((item) => (
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
