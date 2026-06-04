import React, { useState } from "react";
import { activeProducts, findProductById, PRODUCTS as PRODUCT_CATALOG } from "../../../data/products";
import LineMemberLayout from "./LineMemberLayout";

const PRODUCT_EMOJI = {
  white_gold_base: "🥛",
  snow: "🤍",
  lime: "🌿",
  rose: "🌹",
  cinna: "🟡",
  berry: "🫐",
  platinum: "⚪",
};

const TABS = ["定位", "材料", "注意", "推薦"];

function readStoredMember() {
  try {
    const stored = sessionStorage.getItem("line_member");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function getProductId(route = "") {
  return route.match(/^\/line\/encyclopedia\/([^/]+)/)?.[1] || "snow";
}

function findProduct(id) {
  const products = activeProducts(PRODUCT_CATALOG);
  return findProductById(id, products)
    || products.find((product) => product.metadata?.canonical_id === id)
    || products.find((product) => product.slug === id)
    || products[0];
}

function safetyItems(product) {
  const notes = product?.metadata?.safety_notes || {};
  return [
    ...(notes.absolute_avoid || []).map((text) => ({ label: "避免", text })),
    ...(notes.relative_caution || []).map((text) => ({ label: "注意", text })),
    ...(notes.consult_professional || []).map((text) => ({ label: "確認", text })),
  ];
}

export default function ProductDetailPage({ route, go }) {
  const productId = getProductId(route);
  const product = findProduct(productId);
  const member = readStoredMember();
  const [activeTab, setActiveTab] = useState(0);
  const role = product.metadata?.product_role;
  const price = product.metadata?.price;
  const isBase = role === "base_carrier";

  return (
    <LineMemberLayout route={route} go={go} member={member}>
      <div style={{ background: "#F9F5EA", minHeight: "100dvh" }}>
        <BackButton label="植本百科" onClick={() => go("/line/encyclopedia")} />

        <div style={{ background: product.text_color || "#2D5016", padding: "24px 20px 28px" }}>
          <div style={{ fontSize: 54, float: "right", marginTop: -8 }}>{PRODUCT_EMOJI[product.id] || "🌱"}</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "white" }}>{product.name}</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.72)", marginTop: 4 }}>{product.theme}</div>
          <div style={{ clear: "both" }} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14 }}>
            {(product.tags || []).slice(0, 3).map((tag) => (
              <span key={tag} style={heroChipStyle}>{tag}</span>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", overflowX: "auto", background: "white", borderBottom: "1px solid #E8E8E8", scrollbarWidth: "none" }}>
          {TABS.map((tab, index) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(index)}
              style={{
                flex: 1,
                minWidth: 72,
                padding: "12px 14px 10px",
                fontSize: 12,
                fontWeight: 700,
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
          <ContentBlock>
            <p style={eyebrowStyle}>商品定位</p>
            <h2 style={titleStyle}>{product.description}</h2>
            <p style={textStyle}>{product.line_summary}</p>
            <div style={infoGridStyle}>
              <InfoCard label="色系" value={product.color_name || "-"} />
              <InfoCard label="角色" value={isBase ? "基礎載體" : role === "advanced_base" ? "進階商品" : "功能植萃"} />
              <InfoCard label="適合" value={product.audience || "-"} />
              <InfoCard label="價格" value={price?.unit_price ? `NT$${price.unit_price} / 份` : "不單獨販售"} />
            </div>
          </ContentBlock>
        )}

        {activeTab === 1 && (
          <ContentBlock>
            <p style={eyebrowStyle}>核心材料</p>
            <div style={{ marginTop: 10 }}>
              {(product.ingredients || []).map((item) => (
                <span key={item} style={ingredientStyle}>{item}</span>
              ))}
            </div>
            <p style={{ ...textStyle, marginTop: 14 }}>
              正式營養數據需待送驗完成後更新；目前僅以商品資料庫 V2 的原料與定位資訊呈現。
            </p>
          </ContentBlock>
        )}

        {activeTab === 2 && (
          <ContentBlock>
            <p style={eyebrowStyle}>飲用注意</p>
            {safetyItems(product).length ? (
              safetyItems(product).map((item) => (
                <div key={`${item.label}-${item.text}`} style={warningCardStyle}>
                  <span style={warningLabelStyle}>{item.label}</span>
                  <span style={{ fontSize: 12, color: "#1A2F15", lineHeight: 1.6 }}>{item.text}</span>
                </div>
              ))
            ) : (
              <p style={textStyle}>目前無特別注意事項；若有慢性病、孕期、特殊藥物或飲食限制，仍建議先與專業人員確認。</p>
            )}
          </ContentBlock>
        )}

        {activeTab === 3 && (
          <ContentBlock>
            <p style={eyebrowStyle}>Dr. Marvin 推薦邏輯</p>
            <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
              {(product.best_for || []).map((item) => (
                <div key={item} style={pillCardStyle}>{item}</div>
              ))}
            </div>
            <p style={{ ...textStyle, marginTop: 14 }}>
              {isBase
                ? "白金基底液是五色植萃共同載體，不作為快篩或深度分析的主推薦商品。"
                : "Dr. Marvin 會依會員問卷、健康線索與注意事項，將此商品作為主推或副推候選。"}
            </p>
          </ContentBlock>
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

function ContentBlock({ children }) {
  return <div style={{ padding: "18px 20px" }}>{children}</div>;
}

function InfoCard({ label, value }) {
  return (
    <div style={{ background: "white", borderRadius: 12, padding: "12px 14px", border: "1px solid #EEE8D8" }}>
      <div style={{ fontSize: 10, color: "#8A9A6A", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#1A2F15", lineHeight: 1.45 }}>{value}</div>
    </div>
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

const heroChipStyle = {
  background: "rgba(255,255,255,0.14)",
  borderRadius: 999,
  padding: "4px 10px",
  fontSize: 10,
  fontWeight: 700,
  color: "rgba(255,255,255,0.86)",
};

const eyebrowStyle = {
  fontSize: 11,
  fontWeight: 800,
  color: "#8A6F32",
  letterSpacing: 1.2,
  marginBottom: 8,
};

const titleStyle = {
  fontSize: 18,
  fontWeight: 800,
  color: "#1A2F15",
  lineHeight: 1.45,
  margin: 0,
};

const textStyle = {
  fontSize: 13,
  color: "#53675A",
  lineHeight: 1.8,
  marginTop: 12,
};

const infoGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 10,
  marginTop: 16,
};

const ingredientStyle = {
  display: "inline-block",
  background: "white",
  border: "1px solid #E0DDD6",
  borderRadius: 999,
  fontSize: 12,
  color: "#1A2F15",
  padding: "6px 12px",
  margin: "0 6px 8px 0",
};

const warningCardStyle = {
  display: "flex",
  alignItems: "flex-start",
  gap: 10,
  background: "white",
  border: "1px solid #EEE8D8",
  borderRadius: 12,
  padding: "12px 14px",
  marginBottom: 8,
};

const warningLabelStyle = {
  flexShrink: 0,
  background: "#F0EBE0",
  color: "#8A6F32",
  borderRadius: 999,
  padding: "3px 8px",
  fontSize: 10,
  fontWeight: 800,
};

const pillCardStyle = {
  background: "white",
  border: "1px solid #EEE8D8",
  borderRadius: 12,
  padding: "12px 14px",
  fontSize: 13,
  color: "#1A2F15",
  fontWeight: 700,
};
