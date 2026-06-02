// src/pages/line/LineReportsPage.jsx
// 我的報告：Dr. Marvin 深度檢測與官網初篩紀錄

import React, { useEffect, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, FileText, Leaf, Stethoscope } from "lucide-react";
import LineMemberLayout from "./LineMemberLayout";

const PRODUCT_NAMES = {
  snow: "雪山植萃",
  lime: "青檸植萃",
  rose: "玫瑰植萃",
  cinna: "桂香植萃",
  berry: "紫莓植萃",
};

const REPORT_TABS = [
  { id: "health", label: "健康趨勢" },
  { id: "marvin", label: "Dr. Marvin" },
  { id: "cards", label: "每日卡牌" },
  { id: "checkins", label: "打卡紀錄" },
];

const CATEGORY_ORDER = ["food", "clothing", "home", "travel", "learning", "leisure"];

const CATEGORY_META = {
  food: { label: "食" },
  clothing: { label: "衣" },
  home: { label: "住" },
  travel: { label: "行" },
  learning: { label: "育" },
  leisure: { label: "樂" },
};

function readStoredMember() {
  try {
    const stored = sessionStorage.getItem("line_member");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getTaiwanToday() {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Taipei",
  }).format(new Date());
}

function formatDateHeading(value) {
  return new Date(`${value}T00:00:00+08:00`).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function shiftDate(value, days) {
  const date = new Date(`${value}T00:00:00+08:00`);
  date.setDate(date.getDate() + days);
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Taipei" }).format(date);
}

function daysBetween(start, end) {
  const startTime = new Date(`${start}T00:00:00+08:00`).getTime();
  const endTime = new Date(`${end}T00:00:00+08:00`).getTime();
  return Math.round((endTime - startTime) / 86400000);
}

function reportTitle(report) {
  if (report.source === "website_quick") return report.inflammation_level || "官網初篩";
  return report.health_score != null ? `健康分數 ${report.health_score}` : "Dr. Marvin 深度報告";
}

function productName(id) {
  return PRODUCT_NAMES[id] || id || "雪山植萃";
}

export default function LineReportsPage({ route, go }) {
  const [member, setMember] = useState(readStoredMember);
  const [reports, setReports] = useState([]);
  const [quickReports, setQuickReports] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [activeTab, setActiveTab] = useState("health");
  const [selectedDate, setSelectedDate] = useState(getTaiwanToday);
  const [cardReadings, setCardReadings] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState("");
  const [cardLoading, setCardLoading] = useState(false);
  const [cardError, setCardError] = useState("");
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
        params.set("resource", "reports");
        const response = await fetch(`/api/member?${params.toString()}`);
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "報告讀取失敗");

        setMember(result.profile);
        sessionStorage.setItem("line_member", JSON.stringify(result.profile));
        setReports(result.reports || []);
        setQuickReports(result.quick_reports || []);
        setSelectedId(result.reports?.[0]?.id || result.quick_reports?.[0]?.id || "");
      } catch (error) {
        console.error("[LineReportsPage] load failed:", error);
        setErrorMsg(error.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [go]);

  useEffect(() => {
    if (activeTab !== "cards" || !member?.line_user_id) return;

    let mounted = true;
    async function loadCardReadings() {
      setCardLoading(true);
      setCardError("");
      try {
        const params = new URLSearchParams({ resource: "daily-cards", date: selectedDate });
        const response = await fetch(`/api/member?${params.toString()}`, {
          headers: { "x-line-user-id": member.line_user_id },
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "卡牌紀錄讀取失敗");
        if (!mounted) return;
        setCardReadings(result.cards || []);
      } catch (error) {
        console.error("[LineReportsPage] card readings load failed:", error);
        if (mounted) {
          setCardReadings([]);
          setCardError(error.message);
        }
      } finally {
        if (mounted) setCardLoading(false);
      }
    }

    loadCardReadings();
    return () => {
      mounted = false;
    };
  }, [activeTab, selectedDate, member?.line_user_id]);

  const allReports = [...reports, ...quickReports];
  const selected = allReports.find((report) => report.id === selectedId) || allReports[0];
  const scores = selected?.scores || selected?.system_scores || {};
  const today = getTaiwanToday();
  const selectedIsToday = selectedDate === today;
  const canGoForward = selectedDate < today;
  const canGoBack = daysBetween(selectedDate, today) < 30;
  const cardsByCategory = Object.fromEntries(cardReadings.map((card) => [card.category, card]));

  function changeSelectedDate(delta) {
    const nextDate = shiftDate(selectedDate, delta);
    const nextDistance = daysBetween(nextDate, today);
    if (nextDate > today || nextDistance > 30) return;
    setSelectedDate(nextDate);
    setExpandedCategory("");
  }

  function renderDailyCardsTab() {
    const hasAnyCards = cardReadings.length > 0;

    return (
      <section>
        <div className="mb-4 flex items-center justify-center gap-4 py-3 text-sm text-brand-dark">
          <button
            type="button"
            onClick={() => changeSelectedDate(-1)}
            disabled={!canGoBack}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(138,154,106,0.3)] text-brand-mid disabled:opacity-35"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[132px] text-center font-serif font-semibold">{formatDateHeading(selectedDate)}</span>
          <button
            type="button"
            onClick={() => changeSelectedDate(1)}
            disabled={!canGoForward}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(138,154,106,0.3)] text-brand-mid disabled:opacity-35"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {cardLoading && (
          <div className="flex h-40 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-dark border-t-transparent" />
          </div>
        )}

        {!cardLoading && cardError && (
          <div className="rounded-lg border border-[#F0CACA] bg-white p-5 text-sm text-brand-error">{cardError}</div>
        )}

        {!cardLoading && !cardError && !hasAnyCards && (
          <div className="rounded-lg border border-brand-border-warm bg-white p-6 text-center">
            <Leaf className="mx-auto mb-3 h-8 w-8 text-brand-gold-deep" />
            <p className="text-base font-semibold text-brand-dark">這一天尚無卡牌紀錄</p>
            <p className="mt-2 text-sm leading-6 text-brand-mid">
              {selectedIsToday ? "完成今日六向度抽卡後，紀錄會出現在這裡。" : "請切換其他日期查看歷史卡牌。"}
            </p>
            {selectedIsToday && (
              <button
                type="button"
                onClick={() => go("/line/cards")}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-dark py-4 text-sm font-semibold text-white"
              >
                前往今日抽卡
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {!cardLoading && !cardError && hasAnyCards && (
          <div className="grid gap-2">
            {CATEGORY_ORDER.map((category) => {
              const card = cardsByCategory[category];
              const meta = CATEGORY_META[category];
              const expanded = expandedCategory === category;
              return (
                <article key={category} className="overflow-hidden rounded-lg border border-[rgba(138,154,106,0.2)] bg-white">
                  <button
                    type="button"
                    onClick={() => card ? setExpandedCategory(expanded ? "" : category) : go("/line/cards")}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left"
                  >
                    <span className="min-w-6 font-serif text-base font-bold text-brand-dark">{meta.label}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-brand-dark">
                        {card ? `${meta.label} · ${card.drawn_number}` : meta.label}
                      </p>
                      <p className={`mt-1 text-xs ${card ? "text-brand-mid" : "text-brand-mid/60"}`}>
                        {card?.short_advice || "今日尚未抽取"}
                      </p>
                    </div>
                    <span className="text-xs text-brand-mid">{card ? (expanded ? "收合" : "查看詳細 ›") : "前往抽卡 ›"}</span>
                  </button>
                  {card && expanded && (
                    <div className="border-t border-[#EFE7D8] px-4 pb-4 pt-3">
                      <p className="mb-2 text-xs font-semibold text-brand-gold-deep">詳細解說</p>
                      <p className="whitespace-pre-line text-sm leading-7 text-brand-mid">{card.full_advice}</p>
                      <div className="mt-3 rounded-lg bg-[#F7F4EE] p-3 text-xs leading-6 text-brand-mid">
                        <p className="font-semibold text-brand-dark">參考依據</p>
                        <p>生命靈數 {card.numerology_ref?.life_number || "未設定"}</p>
                        <p>流日數字 {card.numerology_ref?.day_number || card.drawn_number}</p>
                        {card.numerology_ref?.zwds_daily?.zodiac_sign ? (
                          <p>星座提示 {card.numerology_ref.zwds_daily.zodiac_sign}</p>
                        ) : null}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    );
  }

  return (
    <LineMemberLayout route={route} go={go} member={member}>
      <div className="px-4 py-6">
        <button
          type="button"
          onClick={() => go("/line/member-home")}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-brand-dark"
        >
          <ArrowLeft className="h-4 w-4" />
          會員首頁
        </button>

        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-gold-deep">Reports</p>
        <h1 className="mb-2 text-2xl font-semibold text-brand-dark">我的報告</h1>
        <p className="mb-6 text-sm leading-6 text-brand-mid">查看 My Dr. Marvin 深度檢測與官網初篩紀錄。</p>

        <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
          {REPORT_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${
                activeTab === tab.id
                  ? "bg-brand-dark text-white"
                  : "border border-brand-border-warm bg-white text-brand-mid"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex h-56 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-dark border-t-transparent" />
          </div>
        )}

        {!loading && errorMsg && (
          <div className="rounded-lg border border-[#F0CACA] bg-white p-5 text-sm text-brand-error">
            {errorMsg}
          </div>
        )}

        {!loading && !errorMsg && activeTab === "cards" && renderDailyCardsTab()}

        {!loading && !errorMsg && activeTab === "checkins" && (
          <section className="rounded-lg border border-brand-border-warm bg-white p-6 text-center">
            <FileText className="mx-auto mb-3 h-8 w-8 text-brand-gold-deep" />
            <p className="text-base font-semibold text-brand-dark">打卡紀錄整理中</p>
            <p className="mt-2 text-sm leading-6 text-brand-mid">今日打卡與連續天數已在任務中心顯示，完整歷史列表後續會放在這裡。</p>
            <button
              type="button"
              onClick={() => go("/line/missions")}
              className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-brand-dark py-4 text-sm font-semibold text-white"
            >
              前往任務中心
            </button>
          </section>
        )}

        {!loading && !errorMsg && activeTab === "health" && (
          <section className="rounded-lg border border-brand-border-warm bg-white p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-gold-deep">Health Trend</p>
            {selected ? (
              <>
                <p className="text-2xl font-semibold text-brand-dark">{reportTitle(selected)}</p>
                <p className="mt-2 text-sm text-brand-mid">{formatDate(selected.created_at)}</p>
                {Object.keys(scores).length > 0 ? (
                  <div className="mt-5 grid gap-3">
                    {Object.entries(scores).map(([label, value]) => {
                      const numeric = Number(value) || 0;
                      return (
                        <div key={label}>
                          <div className="mb-1 flex justify-between text-xs">
                            <span className="text-brand-mid">{label}</span>
                            <span className="font-semibold text-brand-dark">{numeric}</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-[#F0EBE0]">
                            <div className="h-full rounded-full bg-brand-dark" style={{ width: `${Math.min(numeric, 100)}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="mt-4 text-sm leading-6 text-brand-mid">完成深度檢測後，七大系統趨勢會逐步累積。</p>
                )}
              </>
            ) : (
              <p className="text-sm leading-6 text-brand-mid">尚無健康趨勢資料，完成 My Dr. Marvin 後會開始累積。</p>
            )}
          </section>
        )}

        {!loading && !errorMsg && activeTab === "marvin" && allReports.length === 0 && (
          <div className="rounded-lg border border-brand-border-warm bg-white p-6 text-center">
            <FileText className="mx-auto mb-3 h-8 w-8 text-brand-gold-deep" />
            <p className="text-base font-semibold text-brand-dark">尚無報告</p>
            <p className="mt-2 text-sm leading-6 text-brand-mid">
              完成 My Dr. Marvin 深度檢測後，報告會出現在這裡。
            </p>
            <button
              type="button"
              onClick={() => go("/line/assessment")}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-dark py-4 text-sm font-semibold text-white"
            >
              前往檢測
              <Stethoscope className="h-4 w-4" />
            </button>
          </div>
        )}

        {!loading && !errorMsg && activeTab === "marvin" && selected && (
          <>
            <section className="mb-4 rounded-lg bg-brand-dark p-5 text-white">
              <p className="mb-1 text-xs text-white/65">
                {selected.source === "dr_marvin" ? "My Dr. Marvin" : "官網初篩"}・{formatDate(selected.created_at)}
              </p>
              <p className="text-2xl font-semibold">{reportTitle(selected)}</p>
              {selected.recommended_product_id && (
                <p className="mt-3 text-sm text-white/80">推薦飲品：{productName(selected.recommended_product_id)}</p>
              )}
              {selected.le_awarded ? (
                <p className="mt-1 text-sm text-white/70">本次獲得：{selected.le_awarded} LE</p>
              ) : null}
            </section>

            {Object.keys(scores).length > 0 && (
              <section className="mb-4 rounded-lg border border-brand-border-warm bg-white p-5">
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-brand-gold-deep">五維健康分數</p>
                <div className="grid gap-3">
                  {Object.entries(scores).map(([label, value]) => {
                    const numeric = Number(value) || 0;
                    return (
                      <div key={label}>
                        <div className="mb-1 flex justify-between text-xs">
                          <span className="text-brand-mid">{label}</span>
                          <span className="font-semibold text-brand-dark">{numeric}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-[#F0EBE0]">
                          <div className="h-full rounded-full bg-brand-dark" style={{ width: `${Math.min(numeric, 100)}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {(selected.report_content || selected.ai_analysis || selected.lifestyle_advice) && (
              <section className="mb-4 rounded-lg border border-brand-border-warm bg-white p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-gold-deep">報告內容</p>
                <p className="whitespace-pre-line text-sm leading-7 text-brand-mid">
                  {selected.report_content || selected.ai_analysis || selected.lifestyle_advice}
                </p>
              </section>
            )}

            {allReports.length > 1 && (
              <section className="rounded-lg border border-brand-border-warm bg-white p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-gold-deep">歷史紀錄</p>
                <div className="grid gap-2">
                  {allReports.map((report) => (
                    <button
                      key={`${report.source}-${report.id}`}
                      type="button"
                      onClick={() => setSelectedId(report.id)}
                      className={`rounded-lg border px-4 py-3 text-left text-sm transition ${
                        selected?.id === report.id
                          ? "border-brand-dark bg-brand-dark text-white"
                          : "border-brand-border-warm bg-brand-surface text-brand-dark"
                      }`}
                    >
                      <span className="block font-semibold">{reportTitle(report)}</span>
                      <span className="mt-1 block text-xs opacity-75">{formatDate(report.created_at)}</span>
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
