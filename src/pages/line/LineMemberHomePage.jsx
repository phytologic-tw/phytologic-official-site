// src/pages/line/LineMemberHomePage.jsx
// 會員首頁 v3：Mobile-First 4-Zone 設計

import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  Bell,
  ChevronDown,
  ChevronUp,
  FileText,
  Share2,
  ShoppingBag,
  Stethoscope,
  UserRound,
} from "lucide-react";
import LineMemberLayout from "./LineMemberLayout";

// ── 靜態資料 ──────────────────────────────────────────────

const PRIMARY_ACTIONS = [
  { id: "missions", label: "任務中心", sub: "打卡 · 任務 · 拿獎勵", emoji: "🎯", path: "/line/missions" },
  { id: "reports", label: "我的報告", sub: "查看健康趨勢", icon: FileText, path: "/line/reports" },
  { id: "assessment", label: "Dr. Marvin", sub: "深度健康檢測", icon: Stethoscope, path: "/line/assessment" },
  { id: "encyclopedia", label: "植本百科", sub: "食材 × 植化素", emoji: "📖", path: "/line/encyclopedia", primaryIcon: true },
  { id: "shop", label: "植萃商城", sub: "健康好物選購", icon: ShoppingBag, path: "/line/shop" },
  { id: "profile", label: "我的帳戶", sub: "個人資訊管理", icon: UserRound, path: "/line/profile" },
  { id: "referral", label: "推薦好友", sub: "邀請好友一起健康", icon: Share2, path: "/line/referral" },
  { id: "news", label: "最新活動", sub: "活動與優惠資訊", icon: Bell, path: "/line/events" },
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

const DAILY_QUOTES = [
  "靜水流深，最深的改變往往悄然發生。",
  "身體是靈魂最忠誠的夥伴，善待它。",
  "每一天都是開始的機會，不是重來。",
  "植物用時間積累力量，你也是。",
  "知道自己需要什麼，是最高的智慧。",
  "慢慢來，比較快。",
  "你的健康，是給未來自己最好的禮物。",
];

const DIET_TIPS = [
  "深綠色蔬菜護持循環能量，今日多一份。",
  "多喝常溫水，讓代謝保持流動。",
  "納豆、味噌等發酵食物滋養腸道菌群。",
  "彩虹飲食：五色蔬果各取一種。",
  "早餐補充蛋白質，穩定全天血糖曲線。",
  "咀嚼二十下，讓身體從容接收食物。",
  "薑黃與黑胡椒同食，吸收效果更好。",
];

const OUTFIT_VIBES = [
  "大地色系，讓你穩穩紮根。",
  "霧藍或水綠，呼應今日的靜定。",
  "暖橙或磚紅，啟動身體的熱量感。",
  "白與米白，為今日留一片空白。",
  "深森綠，與植物頻率共鳴。",
  "裸膚色，最接近身體本質的選擇。",
  "黑與金，留住今日的收斂之力。",
];

const CARD_IDS = ["health", "number", "outfit", "plant", "diet", "quote", "task"];

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

// ── 主元件 ────────────────────────────────────────────────

export default function LineMemberHomePage({ route, go }) {
  const [member, setMember]               = useState(readStoredMember);
  const [homeData, setHomeData]           = useState(null);
  const [loading, setLoading]             = useState(true);
  const [carouselIdx, setCarouselIdx]     = useState(0);
  const [sevenExpanded, setSevenExpanded] = useState(false);
  const [sessionSeed]                     = useState(Math.random);
  const carouselRef                       = useRef(null);

  // session-stable card shuffle
  const cardOrder = useMemo(() => {
    return [...CARD_IDS].sort((a, b) => {
      const ia = CARD_IDS.indexOf(a);
      const ib = CARD_IDS.indexOf(b);
      return Math.sin(sessionSeed * (ia + 1) * 9301) - Math.sin(sessionSeed * (ib + 1) * 9301);
    });
  }, [sessionSeed]);

  // ── Data fetching（保留原始邏輯）────────────────────────
  useEffect(() => {
    async function load() {
      const storedMember = readStoredMember();
      if (!storedMember?.line_user_id) { go("/line/entry"); return; }
      setMember(storedMember);
      setLoading(true);
      try {
        const params = new URLSearchParams({ lineUserId: storedMember.line_user_id });
        const response = await fetch(`/api/member/home?${params.toString()}`);
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
                  cur ? { ...cur, daily_insight: ins.daily_insight, daily_insight_generated: true } : cur
                );
                if (ins.profile) {
                  setMember(ins.profile);
                  sessionStorage.setItem("line_member", JSON.stringify(ins.profile));
                }
              })
              .catch(() => {});
          }
        }
      } catch {
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
  const hasCheckedIn = homeData?.has_checked_in_today ?? false;
  const sevenDay     = homeData?.seven_day_plan;
  const showSevenDay = sevenDay && (sevenDay.current_day ?? 0) > 0 && (sevenDay.current_day ?? 0) <= 7;
  const plantName    = profile?.recommended_drink || "今日植萃";
  const inspiration  = homeData?.daily_insight || "";
  const streakDays   = profile?.streak_days ?? 0;
  const dayOfWeek    = new Date().getDay();

  function handleCarouselScroll() {
    const el = carouselRef.current;
    if (!el || !el.firstElementChild) return;
    const cardWidth = el.firstElementChild.offsetWidth + 12;
    const idx = Math.round(el.scrollLeft / cardWidth);
    setCarouselIdx(Math.min(Math.max(idx, 0), CARD_IDS.length - 1));
  }

  // ── Zone 2 card renderer ──────────────────────────────
  function renderCard(cardId) {
    const base = {
      flex: "0 0 calc(100% - 40px)",
      minWidth: "calc(100% - 40px)",
      scrollSnapAlign: "start",
      borderRadius: "14px",
      padding: "14px 16px",
      height: "112px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    };
    const lbl = { fontSize: "10px", letterSpacing: "0.06em", margin: 0 };

    switch (cardId) {
      case "health":
        return (
          <div key="health" style={{ ...base, background: "linear-gradient(135deg,#2D5016 55%,#3D5A30 100%)" }}>
            <p style={{ ...lbl, color: "rgba(255,255,255,0.6)" }}>今日健康</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: "3px" }}>
              <span style={{ fontSize: "36px", fontWeight: 700, color: "#fff", lineHeight: 1 }}>
                {healthScore ?? "--"}
              </span>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>分</span>
            </div>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.75)", margin: 0, lineHeight: 1.4 }}>
              {streakDays > 0 ? `已連續打卡 ${streakDays} 天 🌱` : "開始你的健康之旅"}
            </p>
          </div>
        );

      case "number":
        return (
          <div key="number" style={{ ...base, background: "#fff" }}>
            <p style={{ ...lbl, color: "#8A9A6A" }}>今日數字</p>
            <span style={{ fontSize: "40px", fontWeight: 700, color: "#2D5016", lineHeight: 1 }}>
              {lifeNumber ?? "?"}
            </span>
            <p style={{ fontSize: "11px", color: "#5A6A4A", margin: 0, lineHeight: 1.4 }}>
              {lifeNumber
                ? (NUMEROLOGY_MSG[lifeNumber] || "今日能量充沛，把握身體的節奏。")
                : "完成健康評估後解鎖生命靈數"}
            </p>
          </div>
        );

      case "outfit":
        return (
          <div key="outfit" style={{ ...base, background: "linear-gradient(135deg,#D8B07A,#C9A96E)" }}>
            <p style={{ ...lbl, color: "rgba(255,255,255,0.75)" }}>今日穿搭</p>
            <span style={{ fontSize: "28px", lineHeight: 1 }}>👗</span>
            <p style={{ fontSize: "12px", fontWeight: 600, color: "#1A2F15", margin: 0, lineHeight: 1.4 }}>
              {OUTFIT_VIBES[dayOfWeek % 7]}
            </p>
          </div>
        );

      case "plant":
        return (
          <div key="plant" style={{ ...base, background: "linear-gradient(135deg,#3D5A30,#2D5016)" }}>
            <p style={{ ...lbl, color: "rgba(255,255,255,0.6)" }}>今日植物</p>
            <p style={{ fontSize: "18px", fontWeight: 700, color: "#C9A96E", margin: 0, lineHeight: 1.3 }}>
              {plantName}
            </p>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.4 }}>
              {inspiration || "植物的力量，從今日開始積累。"}
            </p>
          </div>
        );

      case "diet":
        return (
          <div key="diet" style={{ ...base, background: "#F5F0E8", border: "1px solid rgba(201,169,110,0.3)" }}>
            <p style={{ ...lbl, color: "#8A9A6A" }}>今日飲食</p>
            <span style={{ fontSize: "26px", lineHeight: 1 }}>🥗</span>
            <p style={{ fontSize: "12px", color: "#3D5A30", margin: 0, lineHeight: 1.4 }}>
              {DIET_TIPS[dayOfWeek % 7]}
            </p>
          </div>
        );

      case "quote":
        return (
          <div key="quote" style={{ ...base, background: "#1A2F15", justifyContent: "center", gap: "6px" }}>
            <p style={{ ...lbl, color: "rgba(201,169,110,0.7)" }}>今日一句話</p>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#fff", lineHeight: 1.7, margin: 0, textAlign: "center" }}>
              「{DAILY_QUOTES[dayOfWeek % 7]}」
            </p>
          </div>
        );

      case "task":
        return (
          <div key="task" style={{ ...base, background: hasCheckedIn ? "#E8F0E0" : "#fff", border: "1px solid #E0E9D8" }}>
            <p style={{ ...lbl, color: "#8A9A6A" }}>今日任務</p>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "22px" }}>{hasCheckedIn ? "✅" : "📋"}</span>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#1A2F15" }}>
                {hasCheckedIn ? "今日打卡完成！" : "尚未完成今日打卡"}
              </span>
            </div>
            {!hasCheckedIn ? (
              <button
                type="button"
                onClick={() => go("/line/checkin")}
                style={{
                  background: "#2D5016", border: "none", borderRadius: "999px",
                  color: "#fff", fontSize: "11px", padding: "5px 16px",
                  cursor: "pointer", alignSelf: "flex-start",
                  fontFamily: "'Noto Serif TC', Georgia, serif",
                }}
              >
                立即打卡
              </button>
            ) : (
              <p style={{ fontSize: "11px", color: "#5A6A4A", margin: 0 }}>
                {streakDays > 0 ? `連續 ${streakDays} 天 🎉` : "繼續保持！"}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  }

  // ── Loading ───────────────────────────────────────────
  if (loading) {
    return (
      <LineMemberLayout route={route} go={go} member={member}>
        <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            width: "28px", height: "28px", borderRadius: "50%",
            border: "2.5px solid #2D5016", borderTopColor: "transparent",
            animation: "phyto-spin 0.8s linear infinite",
          }} />
        </div>
      </LineMemberLayout>
    );
  }

  // ── Main render ───────────────────────────────────────
  return (
    <LineMemberLayout route={route} go={go} member={profile}>
      <style>{`
        .phyto-carousel-wrap { overflow: hidden; padding-left: 20px; }
        .phyto-carousel {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding-right: 20px;
          -webkit-overflow-scrolling: touch;
        }
        .phyto-carousel::-webkit-scrollbar { display: none }
        .phyto-carousel-dots {
          display: flex;
          justify-content: center;
          gap: 6px;
          padding: 10px 0 4px;
        }
        .phyto-carousel-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #C8C0B0;
          transition: background 0.2s, width 0.2s;
          flex-shrink: 0;
          display: block;
        }
        .phyto-carousel-dot.active {
          background: #3D5A30;
          width: 18px;
          border-radius: 999px;
        }
        @keyframes phyto-spin { to { transform: rotate(360deg) } }
      `}</style>

      <div style={{ padding: "12px 20px 24px", display: "flex", flexDirection: "column", gap: "12px" }}>

        {/* ── Zone 1 — Health Overview ─────────────────── */}
        <div style={{
          background: "#2D5016", borderRadius: "16px", padding: "14px 18px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexShrink: 0,
        }}>
          <div>
            <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.55)", margin: "0 0 2px" }}>
              {getGreeting()}，{displayName} 的健康分數
            </p>
            <div style={{ display: "flex", alignItems: "baseline", gap: "3px" }}>
              <span style={{ fontSize: "44px", fontWeight: 700, color: "#fff", lineHeight: 1 }}>
                {healthScore ?? "--"}
              </span>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginLeft: "2px" }}>/ 100</span>
            </div>
            <button
              type="button"
              onClick={() => go("/line/reports")}
              style={{
                marginTop: "8px",
                background: "none", border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "999px", color: "rgba(255,255,255,0.8)",
                fontSize: "10px", padding: "3px 10px",
                cursor: "pointer",
                fontFamily: "'Noto Serif TC', Georgia, serif",
              }}
            >
              查看完整報告
            </button>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.55)", margin: "0 0 4px" }}>今日推薦植萃</p>
            <p style={{ fontSize: "15px", fontWeight: 700, color: "#C9A96E", margin: "0 0 10px", lineHeight: 1.3, maxWidth: "100px" }}>
              {plantName}
            </p>
            <button
              type="button"
              onClick={() => go("/line/reports")}
              style={{
                background: "rgba(201,169,110,0.15)", border: "1px solid rgba(201,169,110,0.4)",
                borderRadius: "999px", color: "#C9A96E",
                fontSize: "11px", padding: "4px 12px",
                cursor: "pointer",
                fontFamily: "'Noto Serif TC', Georgia, serif",
              }}
            >
              五維分析 ›
            </button>
          </div>
        </div>

        {/* ── Zone 2 — Daily Inspiration Carousel ──────── */}
        <div style={{ flexShrink: 0, margin: "0 -20px" }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "0 20px", marginBottom: "8px",
          }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#1A2F15" }}>今日植本靈感</span>
            <span style={{ fontSize: "11px", color: "#8A9A6A" }}>{carouselIdx + 1} / {CARD_IDS.length}</span>
          </div>

          <div className="phyto-carousel-wrap">
            <div
              ref={carouselRef}
              onScroll={handleCarouselScroll}
              className="phyto-carousel"
            >
              {cardOrder.map((id) => renderCard(id))}
            </div>
          </div>

          <div className="phyto-carousel-dots">
            {CARD_IDS.map((_, i) => (
              <span
                key={i}
                className={`phyto-carousel-dot ${i === carouselIdx ? "active" : ""}`}
              />
            ))}
          </div>
        </div>

        {/* ── Zone 3 — Quick Actions (2×4) ── */}
        <div style={{ flexShrink: 0 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {PRIMARY_ACTIONS.map((action) => {
              const Icon = action.icon;
              const isDone = action.id === "missions" && hasCheckedIn;
              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => !isDone && go(action.path)}
                  style={{
                    background: "#fff", borderRadius: "14px",
                    padding: "14px 12px",
                    border: "none",
                    cursor: isDone ? "default" : "pointer",
                    display: "flex", alignItems: "center", gap: "10px",
                    opacity: isDone ? 0.65 : 1,
                    pointerEvents: isDone ? "none" : "auto",
                  }}
                >
                  <div style={{
                    width: "38px", height: "38px", borderRadius: "10px",
                    background: action.primaryIcon ? "var(--color-primary, #2D5016)" : "#E8F0E0", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: action.primaryIcon ? "#fff" : "#3D5A30",
                  }}>
                    {isDone
                      ? <span style={{ fontSize: "18px" }}>✅</span>
                      : action.emoji
                      ? <span style={{ fontSize: "18px" }}>{action.emoji}</span>
                      : <Icon size={18} strokeWidth={1.8} />
                    }
                  </div>
                  <div style={{ minWidth: 0, textAlign: "left" }}>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: "#1A2F15", margin: "0 0 2px", lineHeight: 1.2 }}>
                      {action.label}
                    </p>
                    <p style={{ fontSize: "10px", color: "#8A9A6A", margin: 0, lineHeight: 1.3 }}>
                      {isDone ? "今日已打卡 ✓" : action.sub}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Zone 4 — 7-Day Plan (collapsed by default) ─ */}
        {showSevenDay && (
          <div style={{ background: "#fff", borderRadius: "16px", overflow: "hidden", flexShrink: 0 }}>
            <button
              type="button"
              onClick={() => setSevenExpanded((v) => !v)}
              style={{
                width: "100%", padding: "14px 16px",
                background: "none", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "18px" }}>🌱</span>
                <div style={{ textAlign: "left" }}>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "#1A2F15", margin: 0, lineHeight: 1.2 }}>
                    七日健康啟動計畫
                  </p>
                  <p style={{ fontSize: "11px", color: "#8A9A6A", margin: "2px 0 0", lineHeight: 1.2 }}>
                    第 {sevenDay.current_day} 天・進度 {sevenDay.current_day} / 7
                  </p>
                </div>
              </div>
              {sevenExpanded
                ? <ChevronUp size={16} color="#8A9A6A" />
                : <ChevronDown size={16} color="#8A9A6A" />
              }
            </button>

            {sevenExpanded && (
              <div style={{ padding: "0 16px 14px" }}>
                <div style={{ height: "4px", background: "#E0E0E0", borderRadius: "999px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", background: "#3D5A30", borderRadius: "999px",
                    width: `${(sevenDay.current_day / 7) * 100}%`,
                    transition: "width 0.6s ease",
                  }} />
                </div>
                <p style={{ fontSize: "11px", color: "#5A6A4A", marginTop: "10px", lineHeight: 1.5 }}>
                  再完成 {7 - sevenDay.current_day} 天即可領取三倍能量獎勵 🎁
                </p>
                <button
                  type="button"
                  onClick={() => go("/line/missions")}
                  style={{
                    marginTop: "8px",
                    background: "#2D5016", border: "none", borderRadius: "999px",
                    color: "#fff", fontSize: "12px", padding: "6px 18px",
                    cursor: "pointer",
                    fontFamily: "'Noto Serif TC', Georgia, serif",
                  }}
                >
                  查看計畫 ›
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </LineMemberLayout>
  );
}
