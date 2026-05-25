// src/pages/line/LineReferralPage.jsx
import React, { useMemo, useState } from "react";
import { Check, Copy, Share2, UsersRound } from "lucide-react";
import LineMemberLayout from "./LineMemberLayout";

const LINE_OA_ID = "@phytologic";
const LINE_ADD_URL = "https://line.me/R/ti/p/@phytologic";

function readStoredMember() {
  try {
    const stored = sessionStorage.getItem("line_member");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function buildReferralCode(member) {
  if (member?.referral_code) return member.referral_code;
  const seed = String(member?.id || member?.line_user_id || "PHYTO").replace(/[^a-zA-Z0-9]/g, "");
  return `P_MEMBER_${seed.slice(-6).toUpperCase().padStart(6, "0")}`;
}

export default function LineReferralPage({ route, go }) {
  const [member] = useState(readStoredMember);
  const [copied, setCopied] = useState(false);

  const referralCode = useMemo(() => buildReferralCode(member), [member]);
  const referralUrl = `${LINE_ADD_URL}?ref=${encodeURIComponent(referralCode)}&src=referral`;
  const shareText = `我正在用植本邏輯建立每日健康習慣。加入 LINE 後可以做 My Dr. Marvin 健康檢測：${referralUrl}`;
  const lineShareUrl = `https://line.me/R/share?text=${encodeURIComponent(shareText)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  if (!member) {
    go("/line/entry");
    return null;
  }

  return (
    <LineMemberLayout route={route} go={go} member={member}>
      <div className="px-4 py-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-gold-deep">Referral</p>
        <h1 className="mb-1 text-2xl font-semibold text-brand-dark">推薦好友</h1>
        <p className="mb-6 text-sm leading-6 text-brand-mid">
          把植本邏輯分享給在意健康的人。好友加入後，來源會被記錄在會員系統中。
        </p>

        <section className="mb-5 rounded-2xl border border-brand-border-warm bg-white p-5 text-center">
          <UsersRound className="mx-auto mb-4 h-10 w-10 text-brand-gold-deep" strokeWidth={1.6} />
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-gold-deep">Your Code</p>
          <p className="break-all text-2xl font-semibold text-brand-dark">{referralCode}</p>
          <p className="mt-3 text-xs leading-5 text-brand-mid">
            好友完成會員建檔後，系統會自動檢查並發放推薦 CP；活動與門市來源仍由後台人工核對。
          </p>
        </section>

        <section className="mb-5 rounded-2xl border border-brand-border-warm bg-white p-5">
          <p className="mb-3 text-sm font-semibold text-brand-dark">推薦連結</p>
          <div className="break-all rounded-xl bg-[#F7F4EE] px-4 py-3 text-xs leading-5 text-brand-mid">
            {referralUrl}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={copyLink}
              className="flex items-center justify-center gap-2 rounded-xl border border-brand-border-gold bg-white py-3 text-sm font-semibold text-brand-dark"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "已複製" : "複製"}
            </button>
            <a
              href={lineShareUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-brand-dark py-3 text-sm font-semibold text-white"
            >
              <Share2 className="h-4 w-4" />
              分享
            </a>
          </div>
        </section>

        <section className="rounded-2xl border border-brand-border-warm bg-white p-5">
          <p className="mb-4 text-sm font-semibold text-brand-dark">目前狀態</p>
          <div className="grid grid-cols-2 gap-3">
            <StatusTile label="LINE ID" value={LINE_OA_ID} />
            <StatusTile label="來源標記" value="referral" />
            <StatusTile label="推廣類型" value="member" />
            <StatusTile label="CP 結算" value="建檔後自動檢查" />
          </div>
        </section>
      </div>
    </LineMemberLayout>
  );
}

function StatusTile({ label, value }) {
  return (
    <div className="rounded-xl bg-[#F7F4EE] px-3 py-3">
      <p className="text-[10px] text-brand-gold-deep">{label}</p>
      <p className="mt-1 break-all text-sm font-semibold text-brand-dark">{value}</p>
    </div>
  );
}
