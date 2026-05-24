// src/pages/line/LineAssessmentPage.jsx
// My Dr. Marvin 會員深度檢測：15 題動態狀態問卷

import React, { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Stethoscope } from "lucide-react";
import LineMemberLayout from "./LineMemberLayout";

const QUESTIONS = [
  { id: "sleep_1", system: "sleep", text: "這週入睡需要多久？", options: [["立即", 0], ["15 分鐘", 1], ["30 分鐘以上", 2], ["超過 1 小時", 3]] },
  { id: "sleep_2", system: "sleep", text: "這週睡醒後的感覺？", options: [["精神飽滿", 0], ["尚可", 1], ["還是疲勞", 2], ["完全沒睡飽", 3]] },
  { id: "sleep_3", system: "sleep", text: "這週情緒起伏或焦慮感？", options: [["完全沒有", 0], ["偶爾", 1], ["常常", 2], ["幾乎每天", 3]] },
  { id: "digestion_1", system: "digestion", text: "這週的消化狀況？", options: [["順暢", 0], ["偶有脹氣", 1], ["常常不適", 2], ["排便不規律", 3]] },
  { id: "digestion_2", system: "digestion", text: "這週飲食中外食比例？", options: [["幾乎自煮", 0], ["約一半", 1], ["以外食為主", 2], ["幾乎全外食", 3]] },
  { id: "digestion_3", system: "digestion", text: "這週有沒有特別想吃甜食或油炸？", options: [["完全沒有", 0], ["偶爾", 1], ["常常", 2], ["強烈渴望", 3]] },
  { id: "muscle_1", system: "musculoskeletal", text: "這週身體痠痛程度？", options: [["沒有", 0], ["輕微", 1], ["明顯", 2], ["影響活動", 3]] },
  { id: "muscle_2", system: "musculoskeletal", text: "這週體力與運動表現？", options: [["良好", 0], ["尚可", 1], ["比平常差", 2], ["明顯下降", 3]] },
  { id: "circulation_1", system: "circulation", text: "這週皮膚狀態？", options: [["明亮有光澤", 0], ["正常", 1], ["偶有暗沉", 2], ["明顯暗沉或出油", 3]] },
  { id: "circulation_2", system: "circulation", text: "這週有沒有水腫感？", options: [["完全沒有", 0], ["偶爾", 1], ["常常", 2], ["每天", 3]] },
  { id: "energy_1", system: "energy", text: "這週整體精神狀態？", options: [["充沛", 0], ["還好", 1], ["容易疲勞", 2], ["嚴重疲勞", 3]] },
  { id: "energy_2", system: "energy", text: "最近是否更容易感冒或過敏？", options: [["完全沒有", 0], ["輕微", 1], ["明顯", 2], ["頻繁", 3]] },
  { id: "energy_3", system: "energy", text: "這週喝水量足夠嗎？", options: [["超過 2L", 0], ["約 1.5L", 1], ["不到 1L", 2], ["幾乎不喝水", 3]] },
  { id: "overall_1", system: "energy", text: "這週最困擾你的身體症狀？", options: [["目前沒有特別困擾", 0], ["疲勞或腦霧", 2], ["腸胃或代謝", 2], ["睡眠或情緒", 2]] },
  { id: "overall_2", system: "energy", text: "這週整體健康感受？", options: [["9–10 分", 0], ["7–8 分", 1], ["5–6 分", 2], ["4 分以下", 3]] },
];

function readStoredMember() {
  try {
    const stored = sessionStorage.getItem("line_member");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export default function LineAssessmentPage({ route, go }) {
  const [member, setMember] = useState(readStoredMember);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const answeredCount = Object.keys(answers).length;
  const complete = answeredCount === QUESTIONS.length;
  const progress = useMemo(() => Math.round((answeredCount / QUESTIONS.length) * 100), [answeredCount]);

  async function submitAssessment() {
    if (!member?.line_user_id || !complete || submitting) return;

    setSubmitting(true);
    setErrorMsg("");
    try {
      const payload = QUESTIONS.map((question) => ({
        id: question.id,
        system: question.system,
        question: question.text,
        answer: answers[question.id]?.label,
        score: answers[question.id]?.score,
      }));

      const response = await fetch("/api/dr-marvin/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineUserId: member.line_user_id, answers: payload }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "檢測失敗");

      if (result.profile) {
        setMember(result.profile);
        sessionStorage.setItem("line_member", JSON.stringify(result.profile));
      }
      go("/line/reports");
    } catch (error) {
      console.error("[LineAssessmentPage] submit failed:", error);
      setErrorMsg(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!member?.line_user_id) {
    go("/line/entry");
    return null;
  }

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

        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-gold-deep">My Dr. Marvin</p>
        <h1 className="mb-2 text-2xl font-semibold text-brand-dark">深度健康檢測</h1>
        <p className="mb-5 text-sm leading-6 text-brand-mid">
          依照這週的身體感受回答，完成後會生成五維健康分數與植萃建議。
        </p>

        <div className="mb-5 h-2 overflow-hidden rounded-full bg-[#EEE7D8]">
          <div className="h-full bg-brand-dark transition-all" style={{ width: `${progress}%` }} />
        </div>

        <div className="grid gap-4">
          {QUESTIONS.map((question, index) => (
            <section key={question.id} className="rounded-lg border border-brand-border-warm bg-white p-4">
              <p className="mb-1 text-xs font-semibold text-brand-gold-deep">Q{index + 1}</p>
              <h2 className="mb-3 text-sm font-semibold leading-6 text-brand-dark">{question.text}</h2>
              <div className="grid gap-2">
                {question.options.map(([label, score]) => {
                  const active = answers[question.id]?.label === label;
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setAnswers((current) => ({ ...current, [question.id]: { label, score } }))}
                      className={`rounded-lg border px-4 py-3 text-left text-sm transition ${
                        active
                          ? "border-brand-dark bg-brand-dark text-white"
                          : "border-brand-border-warm bg-brand-surface text-brand-dark"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {errorMsg && (
          <div className="mt-5 rounded-lg border border-[#F0CACA] bg-white p-4 text-sm text-brand-error">
            {errorMsg}
          </div>
        )}

        <button
          type="button"
          disabled={!complete || submitting}
          onClick={submitAssessment}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-dark py-4 text-sm font-semibold text-white transition disabled:opacity-50"
        >
          {submitting ? "生成報告中..." : complete ? "生成 Dr. Marvin 報告" : `尚有 ${QUESTIONS.length - answeredCount} 題`}
          {!submitting && (complete ? <Stethoscope className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />)}
        </button>
      </div>
    </LineMemberLayout>
  );
}
