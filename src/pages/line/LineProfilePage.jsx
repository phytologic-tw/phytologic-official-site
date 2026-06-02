// src/pages/line/LineProfilePage.jsx
import React, { useEffect, useState } from "react";
import { CalendarDays, ChevronRight, HeartPulse, Leaf, Sparkles, UserRound } from "lucide-react";
import LineMemberLayout from "./LineMemberLayout";
import { calcTitle } from "../../lib/memberProfile";

const LEVEL_NEXT_LE = { 1: 100, 2: 300, 3: 1000, 4: 1000 };

const FIELD_LABELS = {
  female: "女性",
  male: "男性",
  other: "其他",
};

const SOURCE_LABELS = {
  website: "官方網站",
  referral: "好友推薦",
  ig_ad: "Instagram 廣告",
  fb_ad: "Facebook 廣告",
};

function formatDate(value) {
  if (!value) return "尚未建立";
  try {
    return new Intl.DateTimeFormat("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(value));
  } catch {
    return String(value).slice(0, 10);
  }
}

function sourceLabel(source = "") {
  if (!source) return "一般加入";
  if (SOURCE_LABELS[source]) return SOURCE_LABELS[source];
  if (source.startsWith("event_")) return "活動現場";
  if (source.startsWith("store_")) return "實體門市";
  if (source.startsWith("kol_")) return "合作創作者";
  return source;
}

function normalizeConcerns(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return String(value).split(",").map((item) => item.trim()).filter(Boolean);
}

export default function LineProfilePage({ route, go }) {
  const [member, setMember] = useState(null);
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      const stored = sessionStorage.getItem("line_member");
      if (!stored) {
        go("/line/entry");
        return;
      }

      const cached = JSON.parse(stored);
      setMember(cached);

      if (!cached?.line_user_id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/member?resource=home&lineUserId=${encodeURIComponent(cached.line_user_id)}`);
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "會員資料讀取失敗");
        if (!mounted) return;
        setHomeData(result);
        setMember(result.profile);
        sessionStorage.setItem("line_member", JSON.stringify(result.profile));
      } catch (error) {
        console.error("[LineProfilePage] load failed:", error);
        if (mounted) setErrorMsg(error.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [go]);

  if (!member) return null;

  const levelNumber = member.level_number || Number(String(member.level || "L1").replace("L", "")) || 1;
  const le = member.le_points ?? member.le ?? 0;
  const p = member.p_points ?? member.p ?? 0;
  const cp = member.cp_points ?? member.cp ?? 0;
  const nextLe = LEVEL_NEXT_LE[levelNumber] || 1000;
  const progress = levelNumber >= 4 ? 100 : Math.min((le / nextLe) * 100, 100);
  const remaining = Math.max(nextLe - le, 0);
  const concerns = normalizeConcerns(member.health_concerns);
  const missingFields = homeData?.missing_profile_fields || [];
  const profileCompleted = Boolean(homeData?.profile_completed ?? member.registration_completed_at);

  return (
    <LineMemberLayout route={route} go={go} member={member}>
      <div className="px-4 py-6">
        <div className="mb-6 rounded-2xl border border-brand-border-warm bg-white p-5">
          <div className="flex items-center gap-4">
            {member.picture_url ? (
              <img src={member.picture_url} alt={member.display_name} className="h-16 w-16 rounded-full object-cover" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-dark text-xl font-semibold text-white">
                {(member.display_name || "植")[0]}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold-deep">Account</p>
              <h1 className="truncate text-2xl font-semibold text-brand-dark">{member.display_name || "植本會員"}</h1>
              <p className="text-sm text-brand-mid">{member.level || `L${levelNumber}`} · {member.title || "改變者"}</p>
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex justify-between text-xs text-brand-gold-deep">
              <span>LE 等級進度</span>
              <span>{levelNumber >= 4 ? "最高等級" : `${le} / ${nextLe}`}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#F0EBE0]">
              <div className="h-full rounded-full bg-brand-dark transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-2 text-xs leading-5 text-[#9A8C68]">
              {levelNumber >= 4 ? "你已經抵達目前最高會員身份。" : `再 ${remaining} LE 升級為「${calcTitle(levelNumber + 1)}」。`}
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 rounded-2xl border border-[#E8C0A8] bg-white p-4 text-sm leading-6 text-brand-error">
            {errorMsg}
          </div>
        )}

        {!profileCompleted && (
          <section className="mb-5 rounded-2xl border border-brand-border-gold bg-[#FFF9EA] p-5">
            <p className="text-base font-semibold text-brand-dark">會員建檔尚未完成</p>
            <p className="mt-2 text-sm leading-6 text-brand-mid">
              還差 {missingFields.map((field) => field.label).join("、") || "基本資料"}。補完後會啟動七日計畫，並讓每日洞察更準確。
            </p>
            <button
              type="button"
              onClick={() => go("/line/entry")}
              className="mt-4 rounded-full bg-brand-dark px-5 py-3 text-xs font-semibold text-white"
            >
              完成建檔
            </button>
          </section>
        )}

        <div className="mb-5 grid grid-cols-3 gap-3">
          <MetricCard label="LE" value={le} sub="生命能量" />
          <MetricCard label="CP" value={cp} sub="貢獻點" />
          <MetricCard label="P" value={p} sub="平台點" />
        </div>

        <section className="mb-5 rounded-2xl border border-brand-border-warm bg-white p-5">
          <SectionTitle icon={HeartPulse} label="健康狀態" />
          <div className="grid grid-cols-2 gap-3">
            <InfoRow label="健康分數" value={`${member.health_score || 0} 分`} />
            <InfoRow label="連續打卡" value={`${member.streak_days || 0} 天`} />
            <InfoRow label="總打卡數" value={`${member.total_checkins || 0} 次`} />
            <InfoRow label="最後打卡" value={member.last_checkin_date || "尚未打卡"} />
          </div>
        </section>

        <section className="mb-5 rounded-2xl border border-brand-border-warm bg-white p-5">
          <SectionTitle icon={UserRound} label="個人資料" />
          <div className="space-y-3">
            <DetailLine label="生日" value={member.birth_date || member.birthdate || "尚未填寫"} />
            <DetailLine label="性別" value={FIELD_LABELS[member.gender] || member.gender || "尚未填寫"} />
            <DetailLine label="血型 / 靈數" value={`${member.blood_type || "未填"} / ${member.numerology_number || member.life_number || "未算"}`} />
            <DetailLine label="城市" value={member.city || "尚未填寫"} />
            <DetailLine label="睡眠" value={member.sleep_hours || "尚未填寫"} />
            <DetailLine label="飲食" value={member.diet_pattern || member.diet_type || "尚未填寫"} />
          </div>
          {concerns.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {concerns.map((concern) => (
                <span key={concern} className="rounded-full bg-[#F0EBE0] px-3 py-1 text-xs text-brand-mid">
                  {concern}
                </span>
              ))}
            </div>
          )}
        </section>

        <section className="mb-5 rounded-2xl border border-brand-border-warm bg-white p-5">
          <SectionTitle icon={Leaf} label="推薦與來源" />
          <div className="space-y-3">
            <DetailLine label="推薦飲品" value={member.recommended_drink || member.recommended_product || "尚未推薦"} />
            <DetailLine label="加入來源" value={sourceLabel(member.referral_source)} />
            <DetailLine label="推廣編號" value={member.promoter_id || "無"} />
            <DetailLine label="活動場次" value={member.event_id || "無"} />
            <DetailLine label="加入時間" value={formatDate(member.joined_at || member.created_at)} />
          </div>
        </section>

        <div className="grid gap-3">
          <ActionButton icon={Sparkles} label="重新進行 My Dr. Marvin" onClick={() => go("/line/assessment")} />
          <ActionButton icon={CalendarDays} label="查看最新活動" onClick={() => go("/line/events")} />
        </div>

        {loading && (
          <p className="mt-5 text-center text-xs text-brand-gold-deep">正在同步最新會員資料...</p>
        )}
      </div>
    </LineMemberLayout>
  );
}

function SectionTitle({ icon: Icon, label }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <Icon className="h-5 w-5 text-brand-gold-deep" strokeWidth={1.7} />
      <h2 className="text-base font-semibold text-brand-dark">{label}</h2>
    </div>
  );
}

function MetricCard({ label, value, sub }) {
  return (
    <div className="rounded-2xl border border-brand-border-warm bg-white p-4 text-center">
      <p className="text-[11px] font-semibold text-brand-gold-deep">{label}</p>
      <p className="mt-1 text-xl font-semibold text-brand-dark">{value}</p>
      <p className="mt-1 text-[10px] text-[#9A8C68]">{sub}</p>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="rounded-xl bg-[#F7F4EE] px-3 py-3">
      <p className="text-[10px] text-brand-gold-deep">{label}</p>
      <p className="mt-1 text-sm font-semibold text-brand-dark">{value}</p>
    </div>
  );
}

function DetailLine({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-brand-border-warm/70 pb-3 last:border-b-0 last:pb-0">
      <span className="text-sm text-brand-mid">{label}</span>
      <span className="text-right text-sm font-medium text-brand-dark">{value}</span>
    </div>
  );
}

function ActionButton({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-between rounded-2xl border border-brand-border-gold bg-white px-5 py-4 text-left text-sm font-semibold text-brand-dark"
    >
      <span className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-brand-gold-deep" strokeWidth={1.7} />
        {label}
      </span>
      <ChevronRight className="h-5 w-5 text-brand-gold-deep" strokeWidth={1.7} />
    </button>
  );
}
