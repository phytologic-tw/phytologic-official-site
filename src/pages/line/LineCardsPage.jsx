// src/pages/line/LineCardsPage.jsx
// 植本卡牌：食衣住行育樂六向度每日抽卡

import React, { useMemo, useState } from "react";
import { ArrowLeft, BookOpen, ChevronRight, Loader2 } from "lucide-react";
import LineMemberLayout from "./LineMemberLayout";

const CATEGORIES = [
  { id: "food", label: "食", title: "今日飲食能量", hint: "點擊抽取", detailTitle: "今日飲食建議" },
  { id: "clothing", label: "衣", title: "今日穿搭頻率", hint: "點擊抽取", detailTitle: "今日穿搭建議" },
  { id: "home", label: "住", title: "今日居家場域", hint: "點擊抽取", detailTitle: "今日居家建議" },
  { id: "travel", label: "行", title: "今日行動能量", hint: "點擊抽取", detailTitle: "今日行動建議" },
  { id: "learning", label: "育", title: "今日學習養分", hint: "點擊抽取", detailTitle: "今日學習建議" },
  { id: "leisure", label: "樂", title: "今日愉悅能量", hint: "點擊抽取", detailTitle: "今日休閒建議" },
];

const NUMBER_SUBTITLES = {
  1: "開創啟動能量",
  2: "聆聽協調能量",
  3: "表達創造能量",
  4: "穩定落地能量",
  5: "流動更新能量",
  6: "照顧滋養能量",
  7: "靈性探索能量",
  8: "力量整合能量",
  9: "完成釋放能量",
};

function readStoredMember() {
  try {
    const stored = sessionStorage.getItem("line_member");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function getTaiwanToday() {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Taipei" }).format(new Date());
}

function getTodayStorageKey() {
  return `cards_${new Date().toDateString()}`;
}

function readStoredCards() {
  try {
    return JSON.parse(sessionStorage.getItem(getTodayStorageKey()) || "{}");
  } catch {
    return {};
  }
}

function persistCards(cards) {
  sessionStorage.setItem(getTodayStorageKey(), JSON.stringify(cards));
}

function formatTodayLabel() {
  return new Intl.DateTimeFormat("zh-TW", {
    timeZone: "Asia/Taipei",
    month: "numeric",
    day: "numeric",
  }).format(new Date());
}

function splitAdvice(text = "") {
  if (!text) return ["今日能量整理中"];
  if (text.length <= 8) return [text];
  return [text.slice(0, 8), text.slice(8, 16)].filter(Boolean);
}

function PlantIcon({ category }) {
  const common = {
    width: 62,
    height: 82,
    viewBox: "0 0 62 82",
    fill: "none",
    stroke: "rgba(255,255,255,0.62)",
    strokeWidth: 1.6,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  const shapes = {
    food: (
      <>
        <path d="M31 69V29" />
        <path d="M31 45C20 43 16 36 15 27c9 1 16 5 16 18Z" />
        <path d="M31 38c10-2 15-9 16-18-9 1-16 6-16 18Z" />
        <path d="M23 69c0-8-5-13-12-15" />
        <path d="M39 69c0-8 5-13 12-15" />
      </>
    ),
    clothing: (
      <>
        <path d="M15 68 47 14" />
        <path d="M20 60h27" />
        <path d="M25 51h17" />
        <path d="M30 42h8" />
        <path d="M19 28c8 1 16 7 19 18" />
      </>
    ),
    home: (
      <>
        <path d="M13 56c10-8 26-8 36 0" />
        <path d="M18 63c8 6 18 6 26 0" />
        <path d="M25 48c0-11 4-22 7-31 4 9 7 20 7 31" />
        <path d="M24 32c-8-1-12-6-13-13 8 1 13 5 13 13Z" />
      </>
    ),
    travel: (
      <>
        <path d="M13 66c16-10 2-22 18-32 12-8 12-18 6-24" />
        <path d="M36 18c8-1 13 3 16 10-9 2-15-1-16-10Z" />
        <path d="M24 45c-7 0-12-3-15-9 8-2 13 1 15 9Z" />
      </>
    ),
    learning: (
      <>
        <path d="M31 69V37" />
        <path d="M31 37c-8-1-14-8-14-17 9 0 14 7 14 17Z" />
        <path d="M31 37c8-1 14-8 14-17-9 0-14 7-14 17Z" />
        <path d="M20 68c2-8 7-13 11-15 4 2 9 7 11 15" />
      </>
    ),
    leisure: (
      <>
        <path d="M31 42c7-7 7-17 0-24-7 7-7 17 0 24Z" />
        <path d="M31 42c9 0 16-6 18-15-10-1-17 5-18 15Z" />
        <path d="M31 42c-9 0-16-6-18-15 10-1 17 5 18 15Z" />
        <path d="M31 42v27" />
        <path d="M20 69h22" />
      </>
    ),
  };

  return <svg {...common}>{shapes[category]}</svg>;
}

export default function LineCardsPage({ route, go }) {
  const [member] = useState(readStoredMember);
  const [cards, setCards] = useState(readStoredCards);
  const [drawingCategory, setDrawingCategory] = useState("");
  const [flipping, setFlipping] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const today = getTaiwanToday();
  const drawnCount = useMemo(() => CATEGORIES.filter((item) => cards[item.id]).length, [cards]);
  const selectedMeta = CATEGORIES.find((item) => item.id === selectedCategory);
  const selectedCard = selectedCategory ? cards[selectedCategory] : null;

  if (!member?.line_user_id) {
    go("/line/entry");
    return null;
  }

  async function drawCard(category) {
    if (cards[category]) {
      setSelectedCategory(category);
      return;
    }

    setErrorMsg("");
    setDrawingCategory(category);
    setFlipping(category);

    try {
      const response = await fetch("/api/member?resource=card-draw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-line-user-id": member.line_user_id,
        },
        body: JSON.stringify({ category, date: today }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || "抽卡失敗");

      const normalized = {
        category,
        number: result.drawn_number,
        drawn_number: result.drawn_number,
        short_advice: result.short_advice || "今日能量正在整理",
        full_advice: result.full_advice || "今日建議正在整理中。",
        numerology_ref: result.numerology_ref || {},
        ai_generated: Boolean(result.ai_generated),
      };
      const nextCards = { ...cards, [category]: normalized };
      setCards(nextCards);
      persistCards(nextCards);
      setSelectedCategory(category);
    } catch (error) {
      console.error("[LineCardsPage] draw failed:", error);
      setErrorMsg("抽卡暫時失敗，請稍後再試。");
    } finally {
      setDrawingCategory("");
      window.setTimeout(() => setFlipping(""), 560);
    }
  }

  return (
    <LineMemberLayout route={route} go={go} member={member}>
      <style>{`
        .plant-card-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          padding: 20px;
        }
        .plant-card-flip-container {
          aspect-ratio: 3 / 4;
          perspective: 800px;
        }
        .plant-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .plant-card-inner.flipped {
          transform: rotateY(180deg);
        }
        .plant-card-side {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 14px;
          overflow: hidden;
        }
        .plant-card-front {
          transform: rotateY(180deg);
        }
        .plant-card-back {
          background: #2D5016;
          border: 1px solid rgba(201,169,110,0.35);
          color: #FFFFFF;
        }
        .plant-card-back::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            repeating-linear-gradient(0deg, rgba(201,169,110,0.06) 0px, rgba(201,169,110,0.06) 1px, transparent 1px, transparent 20px),
            repeating-linear-gradient(60deg, rgba(201,169,110,0.06) 0px, rgba(201,169,110,0.06) 1px, transparent 1px, transparent 20px);
        }
      `}</style>

      <header style={{ height: 56, padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button
          type="button"
          onClick={() => go("/line/member-home")}
          style={{ border: 0, background: "transparent", display: "inline-flex", alignItems: "center", gap: 6, color: "#1A2F15", fontSize: 13, fontWeight: 600 }}
        >
          <ArrowLeft size={17} />
          返回
        </button>
        <h1 style={{ margin: 0, fontSize: 16, color: "#1A2F15", fontWeight: 700 }}>植本卡牌</h1>
        <span style={{ fontSize: 12, color: "#8A9A6A" }}>今日 {formatTodayLabel()}</span>
      </header>

      <section style={{ padding: "0 20px 10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <p style={{ margin: 0, fontSize: 13, color: "#5A6A4A" }}>
            今日已抽 <strong style={{ color: "#C9A96E" }}>{drawnCount}</strong> / 6 張
          </p>
          <p style={{ margin: 0, fontSize: 11, color: "#8A9A6A" }}>每日零時更新</p>
        </div>
        <div style={{ marginTop: 10, height: 4, borderRadius: 999, background: "#E5DDCC", overflow: "hidden" }}>
          <div style={{ width: `${(drawnCount / 6) * 100}%`, height: "100%", borderRadius: 999, background: "#3D5A30", transition: "width 0.3s ease" }} />
        </div>
      </section>

      {errorMsg ? (
        <div style={{ margin: "0 20px", border: "1px solid #F0CACA", borderRadius: 12, padding: 12, color: "#A34848", background: "#FFF" }}>
          {errorMsg}
        </div>
      ) : null}

      <section className="plant-card-grid">
        {CATEGORIES.map((item) => {
          const card = cards[item.id];
          const isLoading = drawingCategory === item.id;
          const isFlipped = Boolean(card) || flipping === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => drawCard(item.id)}
              disabled={isLoading}
              className="plant-card-flip-container"
              style={{ border: 0, padding: 0, background: "transparent", cursor: "pointer", fontFamily: "'Noto Serif TC', Georgia, serif" }}
            >
              <div className={`plant-card-inner ${isFlipped ? "flipped" : ""}`}>
                <div className="plant-card-side plant-card-back" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 9 }}>
                  <div style={{ position: "relative", zIndex: 1 }}>
                    {isLoading ? <Loader2 size={30} className="animate-spin" color="rgba(255,255,255,0.72)" /> : <PlantIcon category={item.id} />}
                  </div>
                  <p style={{ position: "relative", zIndex: 1, margin: 0, fontSize: 16, color: "#FFFFFF", fontWeight: 700 }}>{item.label}</p>
                  <p style={{ position: "relative", zIndex: 1, margin: 0, fontSize: 10, color: "rgba(255,255,255,0.62)" }}>{isLoading ? "抽取中" : "點擊抽取 ↓"}</p>
                </div>
                <div className="plant-card-side plant-card-front" style={{ background: "#FFFFFF", border: "1px solid rgba(201,169,110,0.28)", padding: "14px 12px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                  <p style={{ margin: 0, alignSelf: "flex-start", fontSize: 10, color: "#8A9A6A" }}>{item.label}</p>
                  <p style={{ margin: "8px 0 2px", fontSize: 44, fontWeight: 700, color: "#C9A96E", lineHeight: 1 }}>{card?.number || "?"}</p>
                  <p style={{ margin: 0, fontSize: 11, color: "#8A9A6A" }}>{NUMBER_SUBTITLES[card?.number] || "今日能量"}</p>
                  <div style={{ margin: "8px 0", minHeight: 40 }}>
                    {splitAdvice(card?.short_advice).map((line) => (
                      <p key={line} style={{ margin: 0, fontSize: 12, color: "#1A2F15", lineHeight: 1.55 }}>{line}</p>
                    ))}
                  </div>
                  <p style={{ margin: "auto 0 0", fontSize: 10, color: "#3D5A30", display: "inline-flex", alignItems: "center", gap: 3 }}>
                    查看詳細 <ChevronRight size={11} />
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </section>

      <section
        style={{
          margin: "0 20px 24px",
          borderRadius: "18px 18px 0 0",
          background: "#FFFFFF",
          border: "1px solid rgba(138,154,106,0.2)",
          transform: selectedCard ? "translateY(0)" : "translateY(14px)",
          opacity: selectedCard ? 1 : 0,
          pointerEvents: selectedCard ? "auto" : "none",
          transition: "transform 0.25s ease, opacity 0.25s ease",
          overflow: "hidden",
        }}
      >
        {selectedCard && selectedMeta ? (
          <div style={{ padding: "12px 18px 18px" }}>
            <div style={{ width: 42, height: 4, borderRadius: 999, background: "#D8D0C0", margin: "0 auto 16px" }} />
            <p style={{ margin: 0, fontSize: 13, color: "#8A9A6A" }}>
              {selectedMeta.label} · 第 {selectedCard.number} 號
            </p>
            <h2 style={{ margin: "8px 0 12px", fontSize: 20, fontWeight: 700, color: "#1A2F15" }}>{selectedMeta.detailTitle}</h2>
            <p style={{ margin: 0, whiteSpace: "pre-line", fontSize: 14, lineHeight: 1.8, color: "#3D5A30" }}>
              {selectedCard.full_advice}
            </p>
            <div style={{ marginTop: 16, borderTop: "1px solid #EFE7D8", paddingTop: 12 }}>
              <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 700, color: "#1A2F15" }}>基於你的健康資料</p>
              <p style={{ margin: 0, fontSize: 12, lineHeight: 1.7, color: "#8A9A6A" }}>
                生命靈數 {selectedCard.numerology_ref?.life_number || "未設定"} · 今日流日數字 {selectedCard.numerology_ref?.day_number || selectedCard.number}
              </p>
            </div>
            <button
              type="button"
              onClick={() => go("/line/encyclopedia")}
              style={{ marginTop: 16, width: "100%", border: 0, borderRadius: 999, background: "#2D5016", color: "#FFFFFF", padding: "12px 16px", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              <BookOpen size={15} />
              前往植本百科了解更多
            </button>
          </div>
        ) : null}
      </section>
    </LineMemberLayout>
  );
}
