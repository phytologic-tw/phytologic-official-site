// src/pages/line/LineShopPage.jsx
import React, { useEffect, useState } from "react";
import LineMemberLayout from "./LineMemberLayout";

const PRODUCTS = [
  { id: "white",  name: "雪山植萃", theme: "抗發炎修復・溫和滋補", tags: ["細胞修復", "腸胃支持", "抗氧化"], audience: "高壓、熬夜、腸胃敏感族群", bg: "#F5EFE4", text: "#A98E61" },
  { id: "green",  name: "青檸植萃", theme: "代謝促排・體內環保",    tags: ["腸道促排", "代謝支持", "高纖維"], audience: "代謝緩慢、消化不佳、減重族群", bg: "#DDEEDB", text: "#1E6B43" },
  { id: "rose",   name: "玫瑰植萃", theme: "女性保養・氣色・抗氧化", tags: ["膠原支持", "紅潤氣色", "保水滋潤"], audience: "重視保養、氣色、女性日常", bg: "#F5DDE2", text: "#AA3F57" },
  { id: "gold",   name: "桂香植萃", theme: "運動修復・增肌・代謝引擎", tags: ["運動修復", "電解質", "體態管理"], audience: "健身族、運動愛好者", bg: "#F8E6AD", text: "#B8871B" },
  { id: "purple", name: "紫莓植萃", theme: "護眼・抗氧化・3C族保養", tags: ["3C護眼", "花青素", "高吸收"],   audience: "長時間使用3C、護眼族群", bg: "#E7DDF6", text: "#65439A" },
];

const lineUrl = import.meta.env.VITE_LINE_OA_URL || "https://lin.ee/YpVA4C8";

export default function LineShopPage({ route, go }) {
  const [member, setMember] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("line_member");
    if (stored) setMember(JSON.parse(stored));
  }, []);

  return (
    <LineMemberLayout route={route} go={go} member={member}>
      <div className="px-4 py-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#8B7A4C]">商城</p>
        <h1 className="mb-1 text-2xl font-semibold text-[#123828]">植萃飲品</h1>
        <p className="mb-6 text-sm text-[#49675A]">全植物機能飲，找到最適合你的選擇。</p>

        <div className="space-y-4">
          {PRODUCTS.map((p) => {
            const isRecommended = member?.recommended_drink === p.name;
            return (
              <div
                key={p.id}
                className={`rounded-2xl border p-5 ${isRecommended ? "border-[#123828]" : "border-[#E7DDBF] bg-white"}`}
                style={isRecommended ? { background: p.bg } : {}}
              >
                {isRecommended && (
                  <span className="mb-3 inline-block rounded-full bg-[#123828] px-3 py-1 text-[10px] font-semibold text-white">
                    ✓ 派森推薦給你
                  </span>
                )}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#123828]">{p.name}</h3>
                    <p className="text-sm text-[#49675A]">{p.theme}</p>
                  </div>
                  <span
                    className="rounded-full px-3 py-1 text-[10px] font-semibold"
                    style={{ background: p.bg, color: p.text }}
                  >
                    了解更多
                  </span>
                </div>
                <p className="mt-2 text-xs text-[#8B7A4C]">適合：{p.audience}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.tags.map(t => (
                    <span key={t} className="rounded-full bg-[#F0EBE0] px-3 py-1 text-[10px] text-[#49675A]">{t}</span>
                  ))}
                </div>
                <a
                  href={lineUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 flex w-full items-center justify-center rounded-xl border border-[#D8C99C] bg-white py-3 text-sm font-semibold text-[#123828]"
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
