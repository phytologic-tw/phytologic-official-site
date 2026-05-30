// src/pages/line/LineMemberHomePage.jsx
// 會員首頁重構 v2：Zone 1–6 單頁設計

import React, { useEffect, useState, useRef } from "react";
import {
  Bell,
  ClipboardCheck,
  FileText,
  Gift,
  Share2,
  ShoppingBag,
  Stethoscope,
  UserRound,
} from "lucide-react";
import LineMemberLayout from "./LineMemberLayout";

// ── 靜態資料 ──────────────────────────────────────────────

const ACTION_ICONS = {
  checkin:    ClipboardCheck,
  reports:    FileText,
  assessment: Stethoscope,
  shop:       ShoppingBag,
  tasks:      Gift,
  profile:    UserRound,
  referral:   Share2,
  news:       Bell,
};

const QUICK_ACTIONS = [
  { id: "checkin",    label: "今日打卡",      sub: "完成打卡・拿能量",   path: "/line/checkin"    },
  { id: "reports",   label: "我的報告",      sub: "查看健康趨勢",       path: "/line/reports"    },
  { id: "assessment",label: "Dr. Marvin",    sub: "深度健康檢測",       path: "/line/assessment" },
  { id: "shop",      label: "植萃商城",      sub: "健康好物選購",       path: "/line/shop"       },
  { id: "tasks",     label: "任務中心",      sub: "任務拿獎勵",         path: "/line/missions"   },
  { id: "profile",   label: "我的帳戶",      sub: "個人資訊管理",       path: "/line/profile"    },
  { id: "referral",  label: "推薦好友",      sub: "邀請好友一起健康",   path: "/line/referral"   },
  { id: "news",      label: "最新活動",      sub: "活動與優惠資訊",     path: "/line/news"       },
];

const FIVE_DIMS = [
  { icon: "⚡", label: "能量指數", key: "energy_score"      },
  { icon: "🌙", label: "睡眠指數", key: "sleep_score"       },
  { icon: "🔄", label: "消化指數", key: "digestion_score"   },
  { icon: "💧", label: "循環指數", key: "circulation_score" },
  { icon: "💪", label: "肌力指數", key: "muscle_score"      },
];

const NUMEROLOGY_MSG = {
  1: "開創力強，今日適合發起新的健康習慣。",
  2: "直覺敏銳，傾聽身體細微的訊號。",
  3: "創意充沛，用喜歡的方式補充能量。",
  4: "穩定踏實，今日建立一個小日常儀式。",
  5: "能量充沛，挑戰一個身體的新可能。",
  6: "責任感強，今日給自己最溫柔的照顧。",
  7: "深度思考，靜下來感受身體真實需求。",
  8: "執行力佳，將健康計畫化為具體行動。",
  9: "收穫期，感恩身體每天默默的支持。",
};

// ── 工具函式 ──────────────────────────────────────────────

function readStoredMember() {
  try {
    const s = sessionStorage.getItem("line_member");
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

function getGreeting() {
  const h = parseInt(
    new Intl.DateTimeFormat("zh-TW", {
      timeZone: "Asia/Taipei",
      hour: "numeric",
      hour12: false,
    }).format(new Date()),
    10
  );
  if (h >= 5 && h < 12) return "早安";
  if (h >= 12 && h < 18) return "午安";
  return "晚安";
}

// ── SVG 弧形儀表板 ────────────────────────────────────────

function GaugeSVG({ score }) {
  const arcLen = 110;
  const filled = score != null ? (Math.min(score, 100) / 100) * arcLen : 0;
  return (
    <svg viewBox="0 0 100 60" width="80" height="48">
      <path
        d="M15,55 A35,35 0 0,1 85,55"
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M15,55 A35,35 0 0,1 85,55"
        fill="none"
        stroke="white"
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={arcLen}
        strokeDashoffset={arcLen - filled}
      />
    </svg>
  );
}

// ── 主元件 ────────────────────────────────────────────────

export default function LineMemberHomePage({ route, go }) {
  const [member, setMember]           = useState(readStoredMember);
  const [homeData, setHomeData]       = useState(null);
  const [loading, setLoading]         = useState(true);
  const [errorMsg, setErrorMsg]       = useState("");
  const [carouselIdx, setCarouselIdx] = useState(0);
  const carouselRef                   = useRef(null);

  // ── Data fetching（保留原始邏輯）────────────────────────
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

        // 先確認回應為 JSON（ok = 2xx）再解析，避免 HTML 404 拋 SyntaxError
        if (response.ok) {
          const result = await response.json();
          setHomeData(result);
          setMember(result.profile);
          sessionStorage.setItem("line_member", JSON.stringify(result.profile));

          if (!result.daily_insight_generated) {
            fetch("/api/dr-marvin/insight", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ lineUserId: storedMember.line_user_id }),
            })
              .then((r) => (r.ok ? r.json() : null))
              .then((ins) => {
                if (!ins?.daily_insight) return;
                setHomeData((cur) =>
                  cur
                    ? { ...cur, daily_insight: ins.daily_insight, daily_insight_generated: true }
                    : cur
                );
                if (ins.profile) {
                  setMember(ins.profile);
                  sessionStorage.setItem("line_member", JSON.stringify(ins.profile));
                }
              })
              .catch(() => {});
          }
        }
      } catch (err) {
        // 網路錯誤（CORS、DNS 等）— 靜默降級，頁面以 sessionStorage 資料渲染
        console.warn("[LineMemberHomePage] API unavailable, using cached data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [go]);

  // ── Derived values ────────────────────────────────────
  const profile      = homeData?.profile || member;
  const displayName  = profile?.display_name || profile?.line_display_name || "會員";
  const healthScore  = profile?.health_score ?? null;
  const lifeNumber   = profile?.life_number || profile?.numerology_number;
  const scores       = homeData?.scores || profile?.scores || null;
  const hasCheckedIn = homeData?.has_checked_in_today ?? false;
  const sevenDay     = homeData?.seven_day_plan;
  const showSevenDay = sevenDay && (sevenDay.current_day ?? 0) > 0 && (sevenDay.current_day ?? 0) <= 7;
  const plantName    = profile?.recommended_drink || "今日植萃";
  const inspiration  = homeData?.daily_insight || "今日好好照顧自己";
  const totalCards   = 1 + (lifeNumber ? 1 : 0);

  function handleScroll() {
    if (!carouselRef.current) return;
    const el  = carouselRef.current;
    const idx = Math.round(el.scrollLeft / (el.scrollWidth / totalCards));
    setCarouselIdx(Math.min(Math.max(idx, 0), totalCards - 1));
  }

  // ── Loading ───────────────────────────────────────────
  if (loading) {
    return (
      <LineMemberLayout route={route} go={go} member={member}>
        <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center" }}>
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: "#2D5016 transparent transparent transparent" }} />
        </div>
      </LineMemberLayout>
    );
  }

  // ── Error ─────────────────────────────────────────────
  if (errorMsg) {
    return (
      <LineMemberLayout route={route} go={go} member={member}>
        <div style={{ padding: "20px" }}>
          <div style={{
            borderRadius: "16px", border: "1px solid #F0CACA",
            background: "#fff", padding: "20px", textAlign: "center",
          }}>
            <p style={{ fontSize: "14px", color: "#B91C1C", fontWeight: 600, marginBottom: "8px" }}>載入失敗</p>
            <p style={{ fontSize: "12px", color: "#8A9A6A" }}>{errorMsg}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                marginTop: "16px", background: "#2D5016", color: "#fff",
                border: "none", borderRadius: "999px", padding: "10px 24px",
                fontSize: "13px", cursor: "pointer",
                fontFamily: "'Noto Serif TC', Georgia, serif",
              }}
            >
              重新嘗試
            </button>
          </div>
        </div>
      </LineMemberLayout>
    );
  }

  // ── Main render ───────────────────────────────────────
  return (
    <LineMemberLayout route={route} go={go} member={profile}>
      <style>{`.phyto-carousel::-webkit-scrollbar{display:none}`}</style>

      <div style={{ padding: "12px 20px 16px", display: "flex", flexDirection: "column", gap: "12px" }}>

        {/* Zone 2 — 問候區 */}
        <div style={{ flexShrink: 0 }}>
          <h1 style={{
            fontSize: "24px", fontWeight: 700, color: "#1A2F15",
            lineHeight: 1.3, margin: 0,
          }}>
            {displayName}&ensp;{getGreeting()}！
          </h1>
          <p style={{ fontSize: "12px", color: "#8A9A6A", marginTop: "4px", lineHeight: 1.5 }}>
            持續累積健康能量，讓生活更有光彩 ✨
          </p>
        </div>

        {/* Zone 3 — 健康分數大卡 */}
        <div style={{
          background: "#2D5016", borderRadius: "16px", padding: "16px 20px 12px",
          flexShrink: 0,
        }}>
          {/* 上半部 */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.65)", margin: 0 }}>今日健康分數 ⓘ</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginTop: "4px" }}>
                <span style={{ fontSize: "48px", fontWeight: 700, color: "#fff", lineHeight: 1 }}>
                  {healthScore != null ? healthScore : "--"}
                </span>
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>分 / 100</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
              <GaugeSVG score={healthScore} />
              <button
                type="button"
                onClick={() => go("/line/reports")}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.4)",
                  borderRadius: "999px", color: "#fff",
                  fontSize: "11px", padding: "4px 12px",
                  cursor: "pointer",
                  fontFamily: "'Noto Serif TC', Georgia, serif",
                }}
              >
                查看完整報告 ›
              </button>
            </div>
          </div>

          {/* 下半部 — 五維指數 */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(5, 1fr)",
            borderTop: "1px solid rgba(255,255,255,0.15)",
            marginTop: "12px", paddingTop: "10px",
          }}>
            {FIVE_DIMS.map((dim, i) => (
              <div
                key={dim.key}
                style={{
                  textAlign: "center", padding: "0 2px",
                  borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.15)" : "none",
                }}
              >
                <div style={{ fontSize: "13px", lineHeight: 1.2 }}>{dim.icon}</div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "#fff", lineHeight: 1.3, marginTop: "2px" }}>
                  {scores?.[dim.key] ?? "--"}
                </div>
                <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.6)", marginTop: "1px", lineHeight: 1.3 }}>
                  {dim.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Zone 4 — 今日植本靈感 */}
        <div style={{ flexShrink: 0, margin: "0 -20px" }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "0 20px", marginBottom: "10px",
          }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#1A2F15" }}>今日植本靈感</span>
            <button
              type="button"
              onClick={() => go("/line/shop")}
              style={{ background: "none", border: "none", fontSize: "12px", color: "#8A9A6A", cursor: "pointer", padding: 0 }}
            >
              更多靈感 ›
            </button>
          </div>

          {/* 橫向滑動卡片 */}
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="phyto-carousel"
            style={{
              display: "flex", gap: "12px",
              overflowX: "auto", scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none", msOverflowStyle: "none",
              paddingLeft: "20px", paddingRight: "20px",
            }}
          >
            {/* Card A — 今日植萃 */}
            <div style={{
              width: "calc(100% - 40px)", flexShrink: 0,
              scrollSnapAlign: "start",
              background: "linear-gradient(135deg, #2D5016 55%, #3D5A30 100%)",
              borderRadius: "16px", padding: "16px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              minHeight: "148px",
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.6)", marginBottom: "4px", letterSpacing: "0.06em" }}>
                  今日植萃
                </p>
                <p style={{ fontSize: "20px", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: "6px" }}>
                  {plantName}
                </p>
                <p style={{
                  fontSize: "11px", color: "rgba(255,255,255,0.75)",
                  lineHeight: 1.6, marginBottom: "12px",
                  display: "-webkit-box", WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical", overflow: "hidden",
                }}>
                  {inspiration}
                </p>
                <button
                  type="button"
                  onClick={() => go("/line/shop")}
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.35)",
                    borderRadius: "999px", color: "#fff",
                    fontSize: "11px", padding: "5px 14px",
                    cursor: "pointer",
                    fontFamily: "'Noto Serif TC', Georgia, serif",
                  }}
                >
                  了解更多
                </button>
              </div>
              <div style={{
                width: "60px", height: "60px", borderRadius: "12px",
                background: "rgba(255,255,255,0.1)", marginLeft: "12px", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "26px",
              }}>
                🌿
              </div>
            </div>

            {/* Card B — 今日數字（有生命靈數時顯示）*/}
            {lifeNumber && (
              <div style={{
                width: "calc(100% - 40px)", flexShrink: 0,
                scrollSnapAlign: "start",
                background: "#fff", borderRadius: "16px", padding: "16px",
                display: "flex", flexDirection: "column", justifyContent: "center",
                minHeight: "148px",
              }}>
                <p style={{ fontSize: "10px", color: "#8A9A6A", marginBottom: "4px", letterSpacing: "0.06em" }}>
                  今日數字
                </p>
                <p style={{ fontSize: "52px", fontWeight: 700, color: "#2D5016", lineHeight: 1 }}>
                  {lifeNumber}
                </p>
                <p style={{ fontSize: "12px", color: "#8A9A6A", marginTop: "8px", lineHeight: 1.6 }}>
                  {NUMEROLOGY_MSG[lifeNumber] || "今日能量充沛，把握身體的節奏。"}
                </p>
              </div>
            )}
          </div>

          {/* Dot indicator */}
          {totalCards > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "8px", padding: "0 20px" }}>
              {Array.from({ length: totalCards }).map((_, i) => (
                <span
                  key={i}
                  style={{
                    width: i === carouselIdx ? "16px" : "6px",
                    height: "6px",
                    borderRadius: "999px",
                    background: i === carouselIdx ? "#2D5016" : "#C9A96E",
                    transition: "all 0.3s ease",
                    display: "block",
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Zone 5 — 快捷功能 */}
        <div style={{ flexShrink: 0 }}>
          <p style={{ fontSize: "14px", fontWeight: 600, color: "#1A2F15", marginBottom: "10px" }}>快捷功能</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
            {QUICK_ACTIONS.map((action) => {
              const Icon  = ACTION_ICONS[action.id] || ClipboardCheck;
              const isDone = action.id === "checkin" && hasCheckedIn;
              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => !isDone && go(action.path)}
                  style={{
                    background: "#fff", borderRadius: "12px",
                    padding: "10px 4px 8px",
                    border: "none", cursor: isDone ? "default" : "pointer",
                    display: "flex", flexDirection: "column", alignItems: "center",
                    opacity: isDone ? 0.65 : 1,
                    pointerEvents: isDone ? "none" : "auto",
                  }}
                >
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "10px",
                    background: "#E8F0E0",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#3D5A30", fontSize: "16px",
                  }}>
                    {isDone
                      ? "✓"
                      : <Icon size={18} strokeWidth={1.8} />
                    }
                  </div>
                  <p style={{
                    fontSize: "11px", fontWeight: 700, color: "#1A2F15",
                    marginTop: "6px", lineHeight: 1.2, textAlign: "center",
                    margin: "6px 0 2px",
                  }}>
                    {action.label}
                  </p>
                  <p style={{
                    fontSize: "9px", color: "#8A9A6A",
                    lineHeight: 1.3, textAlign: "center", margin: 0,
                  }}>
                    {isDone ? "今日已完成 ✓" : action.sub}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Zone 6 — 七日健康啟動計畫（條件顯示）*/}
        {showSevenDay && (
          <div style={{
            background: "#fff", borderRadius: "16px", padding: "14px 16px",
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: "20px", flexShrink: 0 }}>🌱</span>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "#1A2F15", lineHeight: 1.3, margin: 0 }}>
                    七日健康啟動計畫
                  </p>
                  <p style={{ fontSize: "11px", color: "#8A9A6A", marginTop: "2px", lineHeight: 1.3, margin: "2px 0 0" }}>
                    第 {sevenDay.current_day} 天・再完成 {7 - sevenDay.current_day} 天領取 3 倍能量
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => go("/line/missions")}
                style={{ background: "none", border: "none", fontSize: "12px", color: "#C9A96E", cursor: "pointer", padding: 0, flexShrink: 0 }}
              >
                查看進度 ›
              </button>
            </div>
            <div style={{
              height: "4px", background: "#E0E0E0", borderRadius: "999px",
              marginTop: "10px", overflow: "hidden",
            }}>
              <div style={{
                height: "100%", background: "#3D5A30", borderRadius: "999px",
                width: `${(sevenDay.current_day / 7) * 100}%`,
                transition: "width 0.6s ease",
              }} />
            </div>
          </div>
        )}

      </div>
    </LineMemberLayout>
  );
}
