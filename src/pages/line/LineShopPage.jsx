// src/pages/line/LineShopPage.jsx
import React, { useEffect, useState } from "react";
import LineMemberLayout from "./LineMemberLayout";
import { PRODUCTS as PRODUCT_CATALOG } from "../../../data/products";

const FALLBACK_PRODUCTS = PRODUCT_CATALOG.map((product) => ({
  ...product,
  bg: product.bg_color,
  text: product.text_color,
}));

const lineUrl = import.meta.env.VITE_LINE_OA_URL || "https://lin.ee/YpVA4C8";

export default function LineShopPage({ route, go }) {
  const [member, setMember] = useState(null);
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);

  useEffect(() => {
    const stored = sessionStorage.getItem("line_member");
    if (stored) setMember(JSON.parse(stored));

    fetch("/api/products")
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (Array.isArray(data?.products) && data.products.length > 0) {
          setProducts(data.products.map((product) => ({
            ...product,
            bg: product.bg_color,
            text: product.text_color,
          })));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <LineMemberLayout route={route} go={go} member={member}>
      <div className="px-4 py-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-gold-deep">商城</p>
        <h1 className="mb-1 text-2xl font-semibold text-brand-dark">植萃飲品</h1>
        <p className="mb-6 text-sm text-brand-mid">全植物機能飲，找到最適合你的選擇。</p>

        <div className="space-y-4">
          {products.map((p) => {
            const isRecommended = member?.recommended_drink === p.name;
            return (
              <div
                key={p.id}
                className={`rounded-2xl border p-5 ${isRecommended ? "border-brand-dark" : "border-brand-border-warm bg-white"}`}
                style={isRecommended ? { background: p.bg } : {}}
              >
                {isRecommended && (
                  <span className="mb-3 inline-block rounded-full bg-brand-dark px-3 py-1 text-[10px] font-semibold text-white">
                    ✓ Dr. Marvin 推薦給你
                  </span>
                )}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-brand-dark">{p.name}</h3>
                    <p className="text-sm text-brand-mid">{p.theme}</p>
                  </div>
                  <span
                    className="rounded-full px-3 py-1 text-[10px] font-semibold"
                    style={{ background: p.bg, color: p.text }}
                  >
                    了解更多
                  </span>
                </div>
                <p className="mt-2 text-xs text-brand-gold-deep">適合：{p.audience}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.tags.map(t => (
                    <span key={t} className="rounded-full bg-[#F0EBE0] px-3 py-1 text-[10px] text-brand-mid">{t}</span>
                  ))}
                </div>
                <a
                  href={lineUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 flex w-full items-center justify-center rounded-xl border border-brand-border-gold bg-white py-3 text-sm font-semibold text-brand-dark"
                >
                  洽詢門市 / 加入官方 LINE
                </a>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-xs leading-6 text-[#9A8C68]">
          不是在販售飲料<br />而是用自然、科學與愛，守護人生裡真正重要的人。
        </p>
      </div>
    </LineMemberLayout>
  );
}
