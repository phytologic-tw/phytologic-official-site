import React from "react";
import { ClipboardCopy, MessageCircle } from "lucide-react";
import LineQRCode from "./LineQRCode";
import { handleOpenLine } from "./lineConfig";

export default function UnlockFullReportCard({ assessmentId = null }) {
  const shortId = assessmentId ? assessmentId.slice(0, 8).toUpperCase() : null;

  const handleCopy = () => {
    if (!shortId) return;
    navigator.clipboard.writeText(shortId).then(() => {
      alert(`報告編號 ${shortId} 已複製到剪貼簿`);
    });
  };

  return (
    <div className="rounded-2xl border border-[#D8C99C]/80 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-[1fr_108px] md:items-center">
        <div>
          <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-[#DDEEDB] px-3 py-1 text-xs font-semibold text-[#1E6B43]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1E6B43]" /> 完整 AI 健康分析已建立
          </div>
          <h4 className="mt-3 text-xl font-semibold text-[#123828]">
            加入植本邏輯官方 LINE，領取完整報告
          </h4>
          <p className="mt-2 text-sm leading-6 text-[#49675A]">
            加入官方 LINE 後，輸入您的報告編號，即可由官方人員或系統協助查詢完整分析。
          </p>

          {shortId && (
            <div className="mt-4 flex items-center gap-3">
              <div className="rounded-xl border border-[#D8C99C] bg-[#F9F5EA] px-4 py-2">
                <span className="block text-[10px] font-semibold uppercase tracking-widest text-[#8B7A4C]">報告編號</span>
                <span className="mt-0.5 block font-mono text-lg font-bold tracking-wider text-[#123828]">{shortId}</span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-xl border border-[#D8C99C] bg-white px-3 py-2 text-sm font-medium text-[#49675A] transition hover:border-[#B89B5E] hover:text-[#123828]"
                aria-label="複製報告編號"
              >
                <ClipboardCopy className="h-4 w-4" /> 複製
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={handleOpenLine}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#06C755] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#05B64D]"
          >
            <MessageCircle className="h-4 w-4" /> 加入官方 LINE 領取完整報告
          </button>

          <p className="mt-3 text-xs text-[#8B7A4C]">
            若您已加入官方 LINE，請直接回到聊天室並輸入報告編號。
          </p>
        </div>
        <LineQRCode className="mx-auto w-24 md:w-[108px]" />
      </div>
    </div>
  );
}
