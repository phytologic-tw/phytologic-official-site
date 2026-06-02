// src/pages/line/LineAssessmentPage.jsx
// My Dr. Marvin 會員深度檢測：25 題動態抽題問卷

import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Loader2, Stethoscope } from "lucide-react";
import LineMemberLayout from "./LineMemberLayout";

const SYSTEM_LABELS = {
  brain_nerve: "大腦神經",
  digestive: "消化黏膜",
  detox_liver: "肝膽排毒",
  blood_sugar_cardio: "血糖心血管",
  endocrine_hormone: "內分泌荷爾蒙",
  muscle_bone: "肌肉骨骼",
  immune: "免疫發炎",
  general: "綜合狀態",
};

function readStoredMember() {
  try {
    const stored = sessionStorage.getItem("line_member");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function normalizeOptions(options) {
  if (Array.isArray(options)) return options;
  if (options?.type === "slider") {
    return Array.from({ length: options.max - options.min + 1 }, (_, index) => {
      const value = options.min + index;
      return { label: `${value} 分`, score: value };
    });
  }
  return [
    { label: "從不發生", score: 0 },
    { label: "偶爾發生", score: 1 },
    { label: "經常發生", score: 2 },
  ];
}

export default function LineAssessmentPage({ route, go }) {
  const [member, setMember] = useState(readStoredMember);
  const [questions, setQuestions] = useState([]);
  const [assessmentSessionId, setAssessmentSessionId] = useState("");
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const answeredCount = Object.keys(answers).length;
  const complete = questions.length > 0 && answeredCount === questions.length;
  const progress = useMemo(
    () => (questions.length ? Math.round((answeredCount / questions.length) * 100) : 0),
    [answeredCount, questions.length]
  );

  useEffect(() => {
    if (!member?.id && !member?.line_user_id) {
      go("/line/entry");
      return;
    }

    let ignore = false;
    async function loadQuestions() {
      setLoading(true);
      setErrorMsg("");
      try {
        const response = await fetch("/api/dr-marvin/questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profile_id: member.id,
            lineUserId: member.line_user_id,
          }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "題庫載入失敗");
        if (ignore) return;

        setQuestions(result.questions || []);
        setAssessmentSessionId(result.assessment_session_id || "");
        setAnswers({});
      } catch (error) {
        if (!ignore) {
          console.error("[LineAssessmentPage] load questions failed:", error);
          setErrorMsg(error.message);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadQuestions();
    return () => {
      ignore = true;
    };
  }, [go, member?.id, member?.line_user_id]);

  async function submitAssessment() {
    if (!member?.line_user_id || !complete || submitting) return;

    setSubmitting(true);
    setErrorMsg("");
    try {
      const payload = questions.map((question) => ({
        id: question.id,
        question_id: question.id,
        system: question.system_category,
        system_category: question.system_category,
        question: question.question_text,
        answer: answers[question.id]?.label,
        score: answers[question.id]?.score,
        assessment_session_id: assessmentSessionId,
      }));

      const response = await fetch("/api/dr-marvin/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lineUserId: member.line_user_id,
          assessmentSessionId,
          answers: payload,
        }),
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
          這次會依照你的年齡、性別與健康關注，抽出 25 題慢性發炎線索題。
        </p>

        <div className="mb-5 h-2 overflow-hidden rounded-full bg-[#EEE7D8]">
          <div className="h-full bg-brand-dark transition-all" style={{ width: `${progress}%` }} />
        </div>

        {loading && (
          <div className="rounded-lg border border-brand-border-warm bg-white p-5 text-sm text-brand-mid">
            <Loader2 className="mb-3 h-5 w-5 animate-spin text-brand-dark" />
            Dr. Marvin 正在為你抽題...
          </div>
        )}

        {!loading && errorMsg && (
          <div className="rounded-lg border border-[#F0CACA] bg-white p-4 text-sm text-brand-error">
            {errorMsg}
          </div>
        )}

        {!loading && !errorMsg && (
          <div className="grid gap-4">
            {questions.map((question, index) => {
              const options = normalizeOptions(question.options);
              return (
                <section key={question.id} className="rounded-lg border border-brand-border-warm bg-white p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold text-brand-gold-deep">Q{index + 1}</p>
                    <span className="rounded-full bg-brand-surface px-3 py-1 text-xs text-brand-mid">
                      {SYSTEM_LABELS[question.system_category] || "身體系統"}
                    </span>
                  </div>
                  <h2 className="mb-3 text-sm font-semibold leading-6 text-brand-dark">{question.question_text}</h2>
                  <div className="grid gap-2">
                    {options.map((option) => {
                      const active = answers[question.id]?.label === option.label;
                      return (
                        <button
                          key={option.label}
                          type="button"
                          onClick={() => setAnswers((current) => ({ ...current, [question.id]: option }))}
                          className={`rounded-lg border px-4 py-3 text-left text-sm transition ${
                            active
                              ? "border-brand-dark bg-brand-dark text-white"
                              : "border-brand-border-warm bg-brand-surface text-brand-dark"
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {!loading && !errorMsg && (
          <button
            type="button"
            disabled={!complete || submitting}
            onClick={submitAssessment}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-dark py-4 text-sm font-semibold text-white transition disabled:opacity-50"
          >
            {submitting ? "生成報告中..." : complete ? "送出 25 題檢測" : `尚有 ${questions.length - answeredCount} 題`}
            {!submitting && (complete ? <Stethoscope className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />)}
          </button>
        )}
      </div>
    </LineMemberLayout>
  );
}
