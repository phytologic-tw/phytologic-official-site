// src/pages/line/LineAnalysisPage.jsx
// LINE 健康分析頁：讀取會員最近的 assessment_reports

import React, { useEffect, useState } from "react";
import LineMemberLayout from "./LineMemberLayout";
import { supabase } from "../../lib/supabase";

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function firstRecommendedProduct(report) {
  const products = report?.recommended_products;
  if (Array.isArray(products)) {
    const first = products[0];
    return typeof first === "string" ? first : first?.name || first?.title || "雪山植萃";
  }
  return report?.recommended_product || "雪山植萃";
}

export default function LineAnalysisPage({ route, go }) {
  const [member, setMember] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function load() {
      const stored = sessionStorage.getItem("line_member");
      if (!stored) {
        go("/line/entry");
        return;
      }

      const nextMember = JSON.parse(stored);
      setMember(nextMember);

      if (!supabase || !nextMember.line_user_id) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("assessment_reports")
        .select("id,created_at,inflammation_level,recommended_products,recommended_product,system_scores,ai_analysis,lifestyle_advice")
        .eq("line_user_id", nextMember.line_user_id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        console.error("[LineAnalysisPage] reports load failed:", error);
        setErrorMsg("健康分析資料讀取失敗，請稍後再試。");
      } else {
        setReports(data || []);
      }
      setLoading(false);
    }

    load();
  }, [go]);

  const latest = reports[0];
  const systemScores = latest?.system_scores || {};

  return (
    <LineMemberLayout route={route} go={go} member={member}>
      <div className="px-4 py-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-gold-deep">Analysis</p>
        <h1 className="mb-1 text-2xl font-semibold text-brand-dark">健康分析</h1>
        <p className="mb-6 text-sm text-brand-mid">查看你的派森 AI 快篩結果與飲品建議。</p>

        {loading && (
          <div className="flex h-56 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-dark border-t-transparent" />
          </div>
        )}

        {!loading && errorMsg && (
          <div className="rounded-2xl border border-[#F0CACA] bg-white p-5 text-center">
            <p className="text-sm font-semibold text-brand-error">連線異常</p>
            <p className="mt-2 text-sm leading-6 text-brand-mid">{errorMsg}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-full bg-brand-dark px-6 py-3 text-sm font-semibold text-white"
            >
              重新嘗試
            </button>
          </div>
        )}

        {!loading && !errorMsg && reports.length === 0 && (
          <div className="rounded-2xl border border-brand-border-warm bg-white p-6 text-center">
            <p className="text-base font-semibold text-brand-dark">尚無快篩紀錄</p>
            <p className="mt-2 text-sm leading-6 text-brand-mid">
              完成派森 AI 健康快篩後，結果會同步顯示在這裡。
            </p>
            <button
              onClick={() => go("/line/assessment")}
              className="mt-5 w-full rounded-2xl bg-brand-dark py-4 text-sm font-semibold text-white"
            >
              前往健康快篩
            </button>
          </div>
        )}

        {!loading && !errorMsg && latest && (
          <>
            <div className="mb-4 rounded-2xl bg-brand-dark p-5 text-white">
              <p className="mb-1 text-xs text-white/65">最新報告・{formatDate(latest.created_at)}</p>
              <p className="text-2xl font-semibold">{latest.inflammation_level || "健康特質待建立"}</p>
              <p className="mt-3 text-sm text-white/80">推薦飲品：{firstRecommendedProduct(latest)}</p>
            </div>

            {latest.ai_analysis && (
              <div className="mb-4 rounded-2xl border border-brand-border-warm bg-white p-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-gold-deep">AI Insight</p>
                <p className="text-sm leading-7 text-brand-mid">
                  {latest.ai_analysis.length > 240 ? `${latest.ai_analysis.slice(0, 240)}...` : latest.ai_analysis}
                </p>
              </div>
            )}

            {latest.lifestyle_advice && (
              <div className="mb-4 rounded-2xl border border-brand-border-warm bg-white p-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-gold-deep">Lifestyle</p>
                <p className="text-sm leading-7 text-brand-mid">{latest.lifestyle_advice}</p>
              </div>
            )}

            {Object.keys(systemScores).length > 0 && (
              <div className="mb-4 rounded-2xl border border-brand-border-warm bg-white p-5">
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-brand-gold-deep">System Scores</p>
                <div className="space-y-3">
                  {Object.entries(systemScores).map(([label, value]) => {
                    const numericValue = Number(value) || 0;
                    return (
                      <div key={label}>
                        <div className="mb-1 flex justify-between text-xs">
                          <span className="text-brand-mid">{label}</span>
                          <span className="font-semibold text-brand-dark">{numericValue}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-[#F0EBE0]">
                          <div
                            className="h-full rounded-full bg-brand-dark"
                            style={{ width: `${Math.min(numericValue, 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {reports.length > 1 && (
              <div className="rounded-2xl border border-brand-border-warm bg-white p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-gold-deep">History</p>
                <div className="divide-y divide-brand-border-warm">
                  {reports.slice(1).map((report) => (
                    <div key={report.id} className="flex items-center justify-between py-3 text-sm">
                      <span className="text-brand-mid">{formatDate(report.created_at)}</span>
                      <span className="font-semibold text-brand-dark">{report.inflammation_level || "已完成"}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </LineMemberLayout>
  );
}
