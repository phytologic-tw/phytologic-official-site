// src/pages/line/LineCheckinPage.jsx
// 今日飲用打卡：台灣時區判斷、防重複、積分更新

import React, { useEffect, useState } from "react";
import LineMemberLayout from "./LineMemberLayout";
import { doCheckin, getTaiwanToday } from "../../lib/memberProfile";
import { productOptions } from "../../../data/products";

const FALLBACK_PRODUCT_OPTIONS = productOptions();
const SYMPTOM_OPTIONS = ["疲勞", "睡眠不穩", "腸胃負擔", "水腫", "壓力", "眼睛疲勞"];

function readStoredMember() {
  try {
    const stored = sessionStorage.getItem("line_member");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export default function LineCheckinPage({ route, go }) {
  // 使用 lazy initializer，確保 member 在首次 render 即可用（避免 effect 尚未執行時 handleCheckin guard 失敗）
  const [member, setMember] = useState(readStoredMember);
  const [state, setState] = useState("idle"); // idle | loading | done | already
  const [result, setResult] = useState(null);
  const [products, setProducts] = useState(FALLBACK_PRODUCT_OPTIONS);
  const [form, setForm] = useState({
    drinkProduct: "",
    moodScore: 3,
    energyLevel: 3,
    symptoms: [],
    note: "",
  });

  useEffect(() => {
    const stored = sessionStorage.getItem("line_member");
    if (!stored) { go("/line/entry"); return; }
    const m = JSON.parse(stored);
    setMember(m);
    setForm((current) => ({
      ...current,
      drinkProduct: current.drinkProduct || m.recommended_drink || m.recommended_product || "雪山植萃",
    }));

    // 若今天已打卡（sessionStorage 中的 last_checkin_date 已是今天），直接顯示已完成
    if (m.last_checkin_date === getTaiwanToday()) {
      setState("already");
    }

    fetch("/api/products")
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (Array.isArray(data?.products) && data.products.length > 0) {
          setProducts(data.products.map((product) => product.name));
        }
      })
      .catch(() => {});
  }, [go]);

  async function handleCheckin() {
    if (!member?.id || state === "loading") return;
    setState("loading");

    const res = await doCheckin(member, form);

    if (res.alreadyChecked) {
      // doCheckin 已用前端格式更新 sessionStorage，直接讀回即可（保持格式一致）
      const stored = sessionStorage.getItem("line_member");
      if (stored) setMember(JSON.parse(stored));
      setState("already");
      return;
    }

    if (res.success) {
      // doCheckin 已更新 sessionStorage（normalizeMember 前端格式），讀回最新狀態
      const stored = sessionStorage.getItem("line_member");
      if (stored) setMember(JSON.parse(stored));
      setResult(res);
      setState("done");
    } else {
      setState("idle");
      alert(res.message || "打卡失敗，請稍後再試");
    }
  }

  const drink = member?.recommended_drink || "雪山植萃";
  const previewLe = result?.leAwarded || "10+";

  function updateForm(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggleSymptom(symptom) {
    setForm((current) => {
      const selected = new Set(current.symptoms || []);
      if (selected.has(symptom)) selected.delete(symptom);
      else selected.add(symptom);
      return { ...current, symptoms: Array.from(selected) };
    });
  }

  return (
    <LineMemberLayout route={route} go={go} member={member}>
      <div className="px-4 py-8">

        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-gold-deep">今日飲用</p>
        <h1 className="mb-6 text-2xl font-semibold text-brand-dark">今天喝了嗎？</h1>

        {/* 推薦飲品展示 */}
        <div className="mb-5 rounded-lg border border-brand-border-warm bg-white p-5 text-center">
          <p className="mb-1 text-xs text-brand-gold-deep">今日推薦飲品</p>
          <p className="text-2xl font-semibold text-brand-dark">{drink}</p>
          <p className="mt-2 text-sm text-brand-mid">每一口都是給身體的一次修復</p>
        </div>

        {(state === "idle" || state === "loading") && (
          <div className="mb-5 grid gap-5 rounded-lg border border-brand-border-warm bg-white p-5">
            <Field label="今日飲用">
              <select
                value={form.drinkProduct}
                onChange={(event) => updateForm("drinkProduct", event.target.value)}
                className="w-full rounded-lg border border-brand-border-warm bg-brand-surface px-4 py-3 text-sm text-brand-dark outline-none focus:border-brand-dark"
              >
                {products.map((product) => (
                  <option key={product} value={product}>{product}</option>
                ))}
              </select>
            </Field>

            <ScoreControl
              label="今日心情"
              value={form.moodScore}
              onChange={(value) => updateForm("moodScore", value)}
            />

            <ScoreControl
              label="今日活力"
              value={form.energyLevel}
              onChange={(value) => updateForm("energyLevel", value)}
            />

            <Field label="今日感受">
              <div className="grid grid-cols-2 gap-2">
                {SYMPTOM_OPTIONS.map((symptom) => {
                  const active = form.symptoms.includes(symptom);
                  return (
                    <button
                      key={symptom}
                      type="button"
                      onClick={() => toggleSymptom(symptom)}
                      className={`rounded-lg border px-3 py-2 text-left text-xs transition ${
                        active
                          ? "border-brand-dark bg-brand-dark text-white"
                          : "border-brand-border-warm bg-brand-surface text-brand-dark"
                      }`}
                    >
                      {symptom}
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field label="備註">
              <textarea
                value={form.note}
                onChange={(event) => updateForm("note", event.target.value)}
                rows={3}
                className="w-full resize-none rounded-lg border border-brand-border-warm bg-brand-surface px-4 py-3 text-sm text-brand-dark outline-none focus:border-brand-dark"
                placeholder="今天身體有什麼變化？"
              />
            </Field>
          </div>
        )}

        {/* 打卡積分預告（僅 idle/loading 時顯示，完成後由結果區取代）*/}
        {(state === "idle" || state === "loading") && (
          <div className="mb-6 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg border border-brand-border-warm bg-white py-4">
              <p className="text-lg font-semibold text-brand-dark">+{previewLe}</p>
              <p className="text-[10px] text-brand-gold-deep">生命能量 LE</p>
            </div>
            <div className="rounded-lg border border-brand-border-warm bg-white py-4">
              <p className="text-lg font-semibold text-brand-dark">+3</p>
              <p className="text-[10px] text-brand-gold-deep">健康值</p>
            </div>
            <div className="rounded-lg border border-brand-border-warm bg-white py-4">
              <p className="text-lg font-semibold text-brand-dark">
                {member?.streak_days != null ? member.streak_days + 1 : "?"}
              </p>
              <p className="text-[10px] text-brand-gold-deep">連續天數</p>
            </div>
          </div>
        )}

        {/* 狀態顯示 */}
        {state === "done" && result && (
          <div className="mb-5 rounded-lg border border-[#BFDABC] bg-[#DDEEDB] p-5">
            <p className="mb-1 text-base font-semibold text-[#1E6B43]">✦ 任務完成！</p>
            <p className="text-sm text-[#3E6350]">{result.message}</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-white/60 px-3 py-3 text-center">
                <p className="text-lg font-semibold text-[#1E6B43]">+{result.leAwarded || 10}</p>
                <p className="text-[10px] text-[#3E6350]">生命能量 LE</p>
              </div>
              <div className="rounded-lg bg-white/60 px-3 py-3 text-center">
                <p className="text-lg font-semibold text-[#1E6B43]">LE {result.le}</p>
                <p className="text-[10px] text-[#3E6350]">現有能量</p>
              </div>
              <div className="rounded-lg bg-white/60 px-3 py-3 text-center">
                <p className="text-lg font-semibold text-[#1E6B43]">{result.healthScore}</p>
                <p className="text-[10px] text-[#3E6350]">健康值</p>
              </div>
              <div className="rounded-lg bg-white/60 px-3 py-3 text-center">
                <p className="text-lg font-semibold text-[#1E6B43]">🔥 {result.streakDays} 天</p>
                <p className="text-[10px] text-[#3E6350]">連續打卡</p>
              </div>
            </div>
          </div>
        )}

        {state === "already" && (
          <div className="mb-5 rounded-lg border border-[#BFDABC] bg-[#DDEEDB] p-5 text-center">
            <p className="mb-1 text-base font-semibold text-[#1E6B43]">今天已完成飲用</p>
            <p className="text-sm text-[#3E6350]">明天再回來，讓習慣持續累積</p>
          </div>
        )}

        {/* 打卡按鈕 */}
        {(state === "idle" || state === "loading") && (
          <button
            onClick={handleCheckin}
            disabled={state === "loading"}
            className="w-full rounded-lg bg-brand-dark py-4 text-sm font-semibold text-white transition disabled:opacity-60 active:scale-98"
          >
            {state === "loading" ? "記錄中..." : "今天已飲用，完成打卡"}
          </button>
        )}

        {(state === "done" || state === "already") && (
          <button
            onClick={() => go("/line/member-home")}
            className="mt-3 w-full rounded-lg border border-brand-border-warm bg-white py-4 text-sm font-semibold text-brand-dark transition"
          >
            回到會員首頁
          </button>
        )}

        {/* 品牌文案 */}
        <p className="mt-8 text-center text-xs leading-6 text-[#9A8C68]">
          每一天回來，都是讓自己變好的證據。
        </p>
      </div>
    </LineMemberLayout>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold text-brand-gold-deep">{label}</span>
      {children}
    </label>
  );
}

function ScoreControl({ label, value, onChange }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-brand-gold-deep">{label}</span>
        <span className="text-xs font-semibold text-brand-dark">{value}/5</span>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            type="button"
            onClick={() => onChange(score)}
            className={`h-10 rounded-lg border text-sm font-semibold transition ${
              value === score
                ? "border-brand-dark bg-brand-dark text-white"
                : "border-brand-border-warm bg-brand-surface text-brand-dark"
            }`}
          >
            {score}
          </button>
        ))}
      </div>
    </div>
  );
}
