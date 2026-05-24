// src/pages/line/LineReportsPage.jsx
// 我的報告：Dr. Marvin 深度檢測與官網初篩紀錄

import React, { useEffect, useState } from "react";
import { ArrowLeft, FileText, Stethoscope } from "lucide-react";
import LineMemberLayout from "./LineMemberLayout";

const PRODUCT_NAMES = {
  snow: "雪山植萃",
  lime: "青檸植萃",
  rose: "玫瑰植萃",
  cinna: "桂香植萃",
  berry: "紫莓植萃",
};

function readStoredMember() {
  try {
    const stored = sessionStorage.getItem("line_member");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function reportTitle(report) {
  if (report.source === "website_quick") return report.inflammation_level || "官網初篩";
  return report.health_score != null ? `健康分數 ${report.health_score}` : "Dr. Marvin 深度報告";
}

function productName(id) {
  return PRODUCT_NAMES[id] || id || "雪山植萃";
}

export default function LineReportsPage({ route, go }) {
  const [member, setMember] = useState(readStoredMember);
  const [reports, setReports] = useState([]);
  const [quickReports, setQuickReports] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

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
        const response = await fetch(`/api/member/reports?${params.toString()}`);
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "報告讀取失敗");

        setMember(result.profile);
        sessionStorage.setItem("line_member", JSON.stringify(result.profile));
        setReports(result.reports || []);
        setQuickReports(result.quick_reports || []);
        setSelectedId(result.reports?.[0]?.id || result.quick_reports?.[0]?.id || "");
      } catch (error) {
        console.error("[LineReportsPage] load failed:", error);
        setErrorMsg(error.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [go]);

  const allReports = [...reports, ...quickReports];
  const selected = allReports.find((report) => report.id === selectedId) || allReports[0];
  const scores = selected?.scores || selected?.system_scores || {};

  return (
    <LineMemberLayout route={route} go={go} member={member}>
      <div className="px-4 py-6">
        <button
          type="button"
          onClick={() => go("/line/member-home")}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-brand-dark"
        >
          <ArrowLeft className="h-4 w-4" />
          會員首頁
        </button>

        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-gold-deep">Reports</p>
        <h1 className="mb-2 text-2xl font-semibold text-brand-dark">我的報告</h1>
        <p className="mb-6 text-sm leading-6 text-brand-mid">查看 My Dr. Marvin 深度檢測與官網初篩紀錄。</p>

        {loading && (
          <div className="flex h-56 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-dark border-t-transparent" />
          </div>
        )}

        {!loading && errorMsg && (
          <div className="rounded-lg border border-[#F0CACA] bg-white p-5 text-sm text-brand-error">
            {errorMsg}
          </div>
        )}

        {!loading && !errorMsg && allReports.length === 0 && (
          <div className="rounded-lg border border-brand-border-warm bg-white p-6 text-center">
            <FileText className="mx-auto mb-3 h-8 w-8 text-brand-gold-deep" />
            <p className="text-base font-semibold text-brand-dark">尚無報告</p>
            <p className="mt-2 text-sm leading-6 text-brand-mid">
              完成 My Dr. Marvin 深度檢測後，報告會出現在這裡。
            </p>
            <button
              type="button"
              onClick={() => go("/line/assessment")}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-dark py-4 text-sm font-semibold text-white"
            >
              前往檢測
              <Stethoscope className="h-4 w-4" />
            </button>
          </div>
        )}

        {!loading && !errorMsg && selected && (
          <>
            <section className="mb-4 rounded-lg bg-brand-dark p-5 text-white">
              <p className="mb-1 text-xs text-white/65">
                {selected.source === "dr_marvin" ? "My Dr. Marvin" : "官網初篩"}・{formatDate(selected.created_at)}
              </p>
              <p className="text-2xl font-semibold">{reportTitle(selected)}</p>
              {selected.recommended_product_id && (
                <p className="mt-3 text-sm text-white/80">推薦飲品：{productName(selected.recommended_product_id)}</p>
              )}
              {selected.le_awarded ? (
                <p className="mt-1 text-sm text-white/70">本次獲得：{selected.le_awarded} LE</p>
              ) : null}
            </section>

            {Object.keys(scores).length > 0 && (
              <section className="mb-4 rounded-lg border border-brand-border-warm bg-white p-5">
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-brand-gold-deep">五維健康分數</p>
                <div className="grid gap-3">
                  {Object.entries(scores).map(([label, value]) => {
                    const numeric = Number(value) || 0;
                    return (
                      <div key={label}>
                        <div className="mb-1 flex justify-between text-xs">
                          <span className="text-brand-mid">{label}</span>
                          <span className="font-semibold text-brand-dark">{numeric}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-[#F0EBE0]">
                          <div className="h-full rounded-full bg-brand-dark" style={{ width: `${Math.min(numeric, 100)}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {(selected.report_content || selected.ai_analysis || selected.lifestyle_advice) && (
              <section className="mb-4 rounded-lg border border-brand-border-warm bg-white p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-gold-deep">報告內容</p>
                <p className="whitespace-pre-line text-sm leading-7 text-brand-mid">
                  {selected.report_content || selected.ai_analysis || selected.lifestyle_advice}
                </p>
              </section>
            )}

            {allReports.length > 1 && (
              <section className="rounded-lg border border-brand-border-warm bg-white p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-gold-deep">歷史紀錄</p>
                <div className="grid gap-2">
                  {allReports.map((report) => (
                    <button
                      key={`${report.source}-${report.id}`}
                      type="button"
                      onClick={() => setSelectedId(report.id)}
                      className={`rounded-lg border px-4 py-3 text-left text-sm transition ${
                        selected?.id === report.id
                          ? "border-brand-dark bg-brand-dark text-white"
                          : "border-brand-border-warm bg-brand-surface text-brand-dark"
                      }`}
                    >
                      <span className="block font-semibold">{reportTitle(report)}</span>
                      <span className="mt-1 block text-xs opacity-75">{formatDate(report.created_at)}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </LineMemberLayout>
  );
}
