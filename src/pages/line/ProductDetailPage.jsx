import React, { useState } from "react";
import LineMemberLayout from "./LineMemberLayout";

const PRODUCT_DATA = {
  "green-latte": {
    name: "植本綠拿鐵 經典款",
    eng: "Phytologic Green Latte · Classic",
    emoji: "🍵",
    nutrients: [
      { name: "蛋白質", val: "8.4g", pct: 72 },
      { name: "膳食纖維", val: "6.2g", pct: 85 },
      { name: "葉綠素", val: "45mg", pct: 60 },
      { name: "維生素 C", val: "82mg", pct: 90 },
      { name: "鎂", val: "28mg", pct: 40 },
      { name: "鐵", val: "3.1mg", pct: 35 },
    ],
    phytochemicals: [
      { id: "lutein", name: "葉黃素", sub: "Lutein · 護眼營養 · 抗氧化" },
      { id: "anthocyanin", name: "花青素", sub: "Anthocyanin · 循環支持 · 多酚" },
      { id: "egcg", name: "EGCG 兒茶素", sub: "EGCG · 代謝支持 · 抗氧化" },
      { id: "curcumin", name: "薑黃素", sub: "Curcumin · 植物多酚 · 日常保養" },
    ],
    ingredients: ["🍵 抹茶粉", "🌿 螺旋藻", "🌾 大麥草", "🥦 羽衣甘藍", "🍋 檸檬汁", "🌱 薑黃", "🥝 奇異果", "🫐 藍莓萃取"],
    wikiIngredients: [
      { id: "matcha", name: "抹茶", label: "千年植物智慧", emoji: "🍵" },
      { id: "spirulina", name: "螺旋藻", label: "地球最古老的超級食物", emoji: "🌿" },
      { id: "barleygrass", name: "大麥草", label: "文明農耕的生命之草", emoji: "🌾" },
    ],
    formula: [
      {
        title: "🔬 協同增效原理",
        text: "植本綠拿鐵以「葉綠素矩陣」為配方骨架，搭配抗氧化植化素網絡，從日常營養補給支持身體維持穩定節奏。",
      },
      {
        title: "🌡️ 低溫冷凍鎖鮮",
        text: "植萃成分以急速冷凍封存，降低高溫加工對風味與營養活性的影響，每一個冰塊融化都是一份即時補充。",
      },
      {
        title: "⚖️ 植化素比例設計",
        text: "葉黃素、花青素與 EGCG 以多元來源搭配，讓每份綠拿鐵同時提供葉綠素、類胡蘿蔔素與多酚植化素。",
      },
    ],
  },
};

const FALLBACK_PRODUCTS = {
  "energy-boost": { name: "能量植萃 升級版", eng: "Energy Botanical Blend", emoji: "🌺" },
  detox: { name: "植本淨化 排毒力", eng: "Detox Botanical Blend", emoji: "🍃" },
  sleep: { name: "深眠植物飲", eng: "Sleep Botanical Blend", emoji: "🌙" },
};

const TABS = ["營養素", "植化素", "材料", "配方原理", "植本百科"];

function readStoredMember() {
  try {
    const stored = sessionStorage.getItem("line_member");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function getProductId(route = "") {
  return route.match(/^\/line\/encyclopedia\/([^/]+)/)?.[1] || "green-latte";
}

export default function ProductDetailPage({ route, go }) {
  const productId = getProductId(route);
  const [activeTab, setActiveTab] = useState(0);
  const product = PRODUCT_DATA[productId] || { ...PRODUCT_DATA["green-latte"], ...FALLBACK_PRODUCTS[productId] };
  const member = readStoredMember();

  return (
    <LineMemberLayout route={route} go={go} member={member}>
      <div style={{ background: "#F9F5EA", minHeight: "100dvh" }}>
        <BackButton label="植本百科" onClick={() => go("/line/encyclopedia")} />

        <div style={{ background: "#2D5016", padding: "24px 20px 28px" }}>
          <div style={{ fontSize: 56, float: "right", marginTop: -8 }}>{product.emoji}</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "white" }}>{product.name}</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 3 }}>{product.eng}</div>
          <div style={{ clear: "both" }} />
        </div>

        <div style={{ display: "flex", overflowX: "auto", background: "white", borderBottom: "1px solid #E8E8E8", scrollbarWidth: "none" }}>
          {TABS.map((tab, index) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(index)}
              style={{
                flexShrink: 0,
                padding: "12px 14px 10px",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                color: activeTab === index ? "#3D5A30" : "#8A9A6A",
                border: 0,
                borderBottom: activeTab === index ? "2px solid #3D5A30" : "2px solid transparent",
                background: "transparent",
                fontFamily: "'Noto Serif TC', Georgia, serif",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 0 && (
          <div style={{ padding: "16px 20px" }}>
            {product.nutrients.map((item) => (
              <div key={item.name} style={{ display: "flex", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #F0EDE6" }}>
                <span style={{ fontSize: 13, color: "#1A2F15", minWidth: 72 }}>{item.name}</span>
                <div style={{ flex: 1, margin: "0 10px", height: 4, background: "#E8E8E8", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${item.pct}%`, background: "#3D5A30", borderRadius: 999 }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#3D5A30", minWidth: 36, textAlign: "right" }}>{item.val}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 1 && (
          <div style={{ padding: "16px 20px" }}>
            <div style={{ fontSize: 12, color: "#8A9A6A", marginBottom: 12 }}>點擊植化素卡片進入植本百科深度探索</div>
            {product.phytochemicals.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => go(`/line/encyclopedia/${productId}/wiki/${item.id}`)}
                style={pillCardStyle}
              >
                <div style={{ fontSize: 12, fontWeight: 700, color: "#2D5016" }}>{item.name}</div>
                <div style={{ fontSize: 10, color: "#8A9A6A" }}>{item.sub}</div>
                <div style={{ fontSize: 10, color: "#C9A96E", marginTop: 2 }}>📖 查看植本百科 ›</div>
              </button>
            ))}
          </div>
        )}

        {activeTab === 2 && (
          <div style={{ padding: "16px 20px" }}>
            <div style={{ fontSize: 12, color: "#8A9A6A", marginBottom: 12 }}>精選植物原料，每種材料均有植本百科可深度探索</div>
            <div style={{ marginBottom: 16 }}>
              {product.ingredients.map((item) => (
                <span key={item} style={ingredientStyle}>{item}</span>
              ))}
            </div>
            {product.wikiIngredients.map((item) => (
              <WikiCTA
                key={item.id}
                label="植本百科精選介紹"
                name={`${item.emoji} ${item.name} · ${item.label}`}
                onClick={() => go(`/line/encyclopedia/${productId}/wiki/${item.id}`)}
              />
            ))}
          </div>
        )}

        {activeTab === 3 && (
          <div style={{ padding: "16px 20px" }}>
            {product.formula.map((item) => (
              <div key={item.title} style={{ background: "#E8F0E0", borderRadius: 16, padding: "14px 16px", marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#2D5016", marginBottom: 6 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: "#1A2F15", lineHeight: 1.7 }}>{item.text}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 4 && (
          <div style={{ padding: "16px 20px" }}>
            <div style={{ fontSize: 13, color: "#1A2F15", marginBottom: 16, lineHeight: 1.7 }}>
              植本百科收錄本品原料的生命故事，從原產地、植物分類到日常食用方式，探索植物與人體營養的深層連結。
            </div>
            {product.wikiIngredients.map((item) => (
              <WikiCTA
                key={item.id}
                label="植本百科 · 深度探索"
                name={`${item.emoji} ${item.name} · ${item.label}`}
                onClick={() => go(`/line/encyclopedia/${productId}/wiki/${item.id}`)}
              />
            ))}
          </div>
        )}

        <div style={{ height: "calc(16px + env(safe-area-inset-bottom))" }} />
      </div>
    </LineMemberLayout>
  );
}

function BackButton({ label, onClick }) {
  return (
    <button type="button" onClick={onClick} style={backButtonStyle}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3D5A30" strokeWidth="2.5" strokeLinecap="round">
        <path d="M19 12H5M12 5l-7 7 7 7" />
      </svg>
      <span style={{ fontSize: 14, color: "#3D5A30", fontWeight: 600 }}>{label}</span>
    </button>
  );
}

function WikiCTA({ label, name, onClick }) {
  return (
    <button type="button" onClick={onClick} style={wikiCtaStyle}>
      <div style={{ textAlign: "left" }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)" }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "white", marginTop: 2 }}>{name}</div>
      </div>
      <div style={{ fontSize: 20, color: "#C9A96E" }}>›</div>
    </button>
  );
}

const backButtonStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "16px 20px 12px",
  border: 0,
  background: "transparent",
  cursor: "pointer",
  fontFamily: "'Noto Serif TC', Georgia, serif",
};

const pillCardStyle = {
  display: "inline-flex",
  background: "#E8F0E0",
  borderRadius: 8,
  padding: "8px 12px",
  margin: "0 6px 8px 0",
  cursor: "pointer",
  border: 0,
  textAlign: "left",
  fontFamily: "'Noto Serif TC', Georgia, serif",
};

const ingredientStyle = {
  display: "inline-block",
  background: "white",
  border: "1px solid #E0DDD6",
  borderRadius: 999,
  fontSize: 12,
  color: "#1A2F15",
  padding: "5px 12px",
  margin: "0 5px 6px 0",
};

const wikiCtaStyle = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: "#2D5016",
  border: 0,
  borderRadius: 16,
  padding: "14px 18px",
  marginBottom: 8,
  cursor: "pointer",
  fontFamily: "'Noto Serif TC', Georgia, serif",
};
