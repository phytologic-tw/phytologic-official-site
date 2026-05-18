import React from "react";
import { MessageCircle } from "lucide-react";
import LineQRCode from "./LineQRCode";

const lineUrl = import.meta.env.VITE_LINE_OA_URL || import.meta.env.VITE_LINE_OFFICIAL_URL || import.meta.env.VITE_LINE_CTA_URL || "https://lin.ee/YpVA4C8";

export default function UnlockFullReportCard() {
  return (
    <div className="rounded-2xl border border-[#D8C99C]/80 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-[1fr_108px] md:items-center">
        <div>
          <h4 className="text-xl font-semibold text-[#123828]">加入植本邏輯官方 LINE</h4>
          <p className="mt-2 font-medium text-[#1E6B43]">解鎖完整 AI 健康分析報告</p>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#49675A]">加入官方 LINE 後，可獲得更詳細的個人化發炎分析、飲品建議與每日健康提醒。</p>
          <a href={lineUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#06C755] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#05B64D]">
            <MessageCircle className="h-4 w-4" /> 加入官方 LINE
          </a>
        </div>
        <LineQRCode className="mx-auto w-24 md:w-[108px]" />
      </div>
    </div>
  );
}
