// src/pages/line/LineTasksPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Check, ClipboardCheck, FileText, Leaf, Medal, Sparkles, Trophy } from "lucide-react";
import LineMemberLayout from "./LineMemberLayout";
import { getCheckinHistory, getTaiwanToday } from "../../lib/memberProfile";

const TASK_LABELS = [
  "建立角色",
  "第一次深測",
  "讀懂報告",
  "選定植萃",
  "邀請同行",
  "穩定累積",
  "解鎖身份",
];

const FALLBACK_SEVEN_DAY_PLAN = [
  { day: 1, title: "建立角色", action: "完成會員建檔，讓 Dr. Marvin 認識你的基本節奏。", path: "/line/profile" },
  { day: 2, title: "第一次深測", action: "完成 My Dr. Marvin，取得五維健康分數。", path: "/line/assessment" },
  { day: 3, title: "讀懂報告", action: "查看個人報告，確認目前最需要照顧的系統。", path: "/line/reports" },
  { day: 4, title: "選定植萃", action: "依推薦飲品建立第一個固定補充節奏。", path: "/line/shop" },
  { day: 5, title: "邀請同行", action: "分享推薦連結，讓一位重要的人一起開始。", path: "/line/referral" },
  { day: 6, title: "穩定累積", action: "完成今日飲用打卡，觀察心情與活力變化。", path: "/line/checkin" },
  { day: 7, title: "解鎖身份", action: "完成七日啟動，拿到第一個健康身份徽章。", path: "/line/tasks" },
];

function getPastDates(days) {
  const today = new Date(`${getTaiwanToday()}T00:00:00+08:00`);
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - index);
    return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Taipei" }).format(date);
  }).reverse();
}

export default function LineTasksPage({ route, go }) {
  const [member, setMember] = useState(null);
  const [home, setHome] = useState(null);
  const [checkinDates, setCheckinDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [claimingTaskId, setClaimingTaskId] = useState("");
  const [notice, setNotice] = useState("");

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

      try {
        const [history, homeResponse] = await Promise.all([
          getCheckinHistory(cached.id, 14),
          cached.line_user_id
            ? fetch(`/api/member?resource=home&lineUserId=${encodeURIComponent(cached.line_user_id)}`)
            : Promise.resolve(null),
        ]);

        if (!mounted) return;
        setCheckinDates(history.map((item) => item.checkin_date));

        if (homeResponse) {
          const result = await homeResponse.json();
          if (!homeResponse.ok) throw new Error(result.error || "任務資料讀取失敗");
          setHome(result);
          setMember(result.profile);
          sessionStorage.setItem("line_member", JSON.stringify(result.profile));
        }
      } catch (error) {
        console.error("[LineTasksPage] load failed:", error);
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

  const dateSet = useMemo(() => new Set(checkinDates), [checkinDates]);

  if (loading || !member) {
    return (
      <LineMemberLayout route={route} go={go} member={member}>
        <div className="flex h-64 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-dark border-t-transparent" />
        </div>
      </LineMemberLayout>
    );
  }

  const completedDays = Math.min(member.streak_days || 0, 7);
  const allDone = completedDays >= 7;
  const todayDone = Boolean(home?.has_checked_in_today || dateSet.has(getTaiwanToday()));
  const reportsCount = home?.reports_count || 0;
  const profileComplete = Boolean(home?.profile_completed ?? (member.registration_completed_at || (member.birth_date && member.gender && member.health_concerns)));
  const sevenDates = getPastDates(7);
  const weeklyCheckins = sevenDates.filter((date) => dateSet.has(date)).length;
  const sevenDayPlan = home?.seven_day_plan?.days?.length ? home.seven_day_plan.days : FALLBACK_SEVEN_DAY_PLAN;
  const currentPlanDay = home?.seven_day_plan?.current_day || Math.min(completedDays + 1, 7);
  const currentPlan = sevenDayPlan[currentPlanDay - 1] || sevenDayPlan[0];
  const taskStatusMap = new Map((home?.tasks || []).map((task) => [task.id, task]));

  async function claimTask(taskId) {
    if (!member?.line_user_id || claimingTaskId) return;
    setClaimingTaskId(taskId);
    setErrorMsg("");
    setNotice("");

    try {
      const response = await fetch("/api/member?resource=home", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineUserId: member.line_user_id, taskId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "任務領獎失敗");

      if (result.profile) {
        setMember(result.profile);
        sessionStorage.setItem("line_member", JSON.stringify(result.profile));
      }

      setHome((current) => {
        if (!current) return current;
        const tasks = (current.tasks || []).map((task) => (
          task.id === taskId
            ? { ...task, claimed: true, claimed_at: result.claim?.claimed_at || result.task?.claimed_at || new Date().toISOString() }
            : task
        ));
        return {
          ...current,
          profile: result.profile || current.profile,
          tasks,
          task_claims: result.claim ? [...(current.task_claims || []), result.claim] : current.task_claims,
        };
      });

      const le = result.claim?.le_awarded || 0;
      const cp = result.claim?.cp_awarded || 0;
      setNotice(`已領取任務獎勵：${le} LE${cp ? `、${cp} CP` : ""}`);
    } catch (error) {
      console.error("[LineTasksPage] claim failed:", error);
      setErrorMsg(error.message);
    } finally {
      setClaimingTaskId("");
    }
  }

  const dailyTasks = [
    {
      id: "checkin",
      label: "完成今日飲用打卡",
      desc: "記錄飲品、心情與活力，累積 LE。",
      done: todayDone,
      action: () => go("/line/checkin"),
      Icon: ClipboardCheck,
      claim: taskStatusMap.get("daily_checkin"),
    },
    {
      id: "assessment",
      label: "完成 My Dr. Marvin",
      desc: "取得五維健康分數與推薦飲品。",
      done: reportsCount > 0 || Boolean(member.last_report_id),
      action: () => go("/line/assessment"),
      Icon: FileText,
      claim: taskStatusMap.get("dr_marvin_complete"),
    },
    {
      id: "profile",
      label: "完善會員資料",
      desc: "生日、血型與健康偏好會影響個人化洞察。",
      done: profileComplete,
      action: () => go("/line/profile"),
      Icon: Leaf,
      claim: taskStatusMap.get("profile_complete"),
    },
  ];

  const weeklyTasks = [
    { label: "本週完成 3 次打卡", value: weeklyCheckins, target: 3, claim: taskStatusMap.get("weekly_3_checkins") },
    { label: "本週完成 5 次打卡", value: weeklyCheckins, target: 5, claim: taskStatusMap.get("weekly_5_checkins") },
    { label: "維持七日啟動進度", value: completedDays, target: 7, claim: taskStatusMap.get("seven_day_complete") },
  ];

  const badges = [
    { label: "啟動者", unlocked: completedDays >= 1, desc: "完成第一次打卡" },
    { label: "穩定者", unlocked: completedDays >= 3, desc: "連續三天打卡" },
    { label: "七日實踐者", unlocked: allDone, desc: "完成七日啟動" },
  ];

  return (
    <LineMemberLayout route={route} go={go} member={member}>
      <div className="px-4 py-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-gold-deep">Tasks</p>
        <h1 className="mb-1 text-2xl font-semibold text-brand-dark">任務中心</h1>
        <p className="mb-6 text-sm text-brand-mid">把健康變成每天都做得到的小行動。</p>

        {errorMsg && (
          <div className="mb-4 rounded-2xl border border-[#E8C0A8] bg-white p-4 text-sm leading-6 text-brand-error">
            {errorMsg}
          </div>
        )}

        {notice && (
          <div className="mb-4 rounded-2xl border border-[#BFDABC] bg-[#DDEEDB] p-4 text-sm leading-6 text-[#1E6B43]">
            {notice}
          </div>
        )}

        <section className="mb-5 rounded-2xl border border-brand-border-warm bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold-deep">7 Day Start</p>
              <h2 className="text-lg font-semibold text-brand-dark">七日啟動計畫</h2>
            </div>
            <Trophy className="h-7 w-7 text-brand-gold-deep" strokeWidth={1.6} />
          </div>
          <div className="mb-3 grid grid-cols-7 gap-1.5">
            {TASK_LABELS.map((label, index) => {
              const done = index < completedDays;
              const current = index === completedDays && !allDone;
              return (
                <div key={label} className="text-center">
                  <div
                    className={`flex h-9 items-center justify-center rounded-xl text-xs font-semibold ${
                      done
                        ? "bg-brand-dark text-white"
                        : current
                        ? "border border-brand-border-gold bg-white text-brand-dark"
                        : "bg-[#F0EBE0] text-[#9A8C68]"
                    }`}
                  >
                    {done ? <Check className="h-4 w-4" strokeWidth={2} /> : index + 1}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-sm leading-6 text-brand-mid">
            {allDone ? "七日啟動已完成，接下來維持每週穩定打卡。" : `${currentPlan.title}：${currentPlan.action}`}
          </p>
        </section>

        <section className="mb-5">
          <SectionHeader icon={Leaf} title="七日路徑" />
          <div className="space-y-3">
            {sevenDayPlan.map((item) => {
              const done = item.day <= completedDays;
              const current = item.day === currentPlanDay && !allDone;
              return (
                <button
                  key={item.day}
                  type="button"
                  onClick={() => go(item.path)}
                  className={`w-full rounded-2xl border p-4 text-left ${
                    done
                      ? "border-[#BFDABC] bg-[#DDEEDB]"
                      : current
                      ? "border-brand-border-gold bg-[#FFF9EA]"
                      : "border-brand-border-warm bg-white"
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-brand-dark">Day {item.day} · {item.title}</p>
                    <span className="text-xs font-semibold text-brand-gold-deep">
                      {done ? "完成" : current ? "今日" : "待啟動"}
                    </span>
                  </div>
                  <p className="text-xs leading-5 text-brand-mid">{item.action}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mb-5">
          <SectionHeader icon={Sparkles} title="今日任務" />
          <div className="space-y-3">
            {dailyTasks.map(({ id, label, desc, done, action, Icon, claim }) => (
              <TaskCard
                key={id}
                label={label}
                desc={desc}
                done={done}
                onClick={action}
                Icon={Icon}
                claim={claim}
                claiming={claimingTaskId === claim?.id}
                onClaim={() => claimTask(claim.id)}
              />
            ))}
          </div>
        </section>

        <section className="mb-5">
          <SectionHeader icon={Medal} title="週任務" />
          <div className="space-y-3">
            {weeklyTasks.map((task) => (
              <ProgressTask
                key={task.label}
                {...task}
                claiming={claimingTaskId === task.claim?.id}
                onClaim={() => claimTask(task.claim.id)}
              />
            ))}
          </div>
        </section>

        <section>
          <SectionHeader icon={Trophy} title="徽章" />
          <div className="grid grid-cols-3 gap-3">
            {badges.map((badge) => (
              <div
                key={badge.label}
                className={`rounded-2xl border p-4 text-center ${
                  badge.unlocked
                    ? "border-brand-border-gold bg-[#F7F4EE]"
                    : "border-brand-border-warm bg-white opacity-60"
                }`}
              >
                <Medal className={`mx-auto mb-2 h-6 w-6 ${badge.unlocked ? "text-brand-gold-deep" : "text-[#9A8C68]"}`} strokeWidth={1.7} />
                <p className="text-xs font-semibold text-brand-dark">{badge.label}</p>
                <p className="mt-1 text-[10px] leading-4 text-brand-mid">{badge.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </LineMemberLayout>
  );
}

function SectionHeader({ icon: Icon, title }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <Icon className="h-5 w-5 text-brand-gold-deep" strokeWidth={1.7} />
      <h2 className="text-base font-semibold text-brand-dark">{title}</h2>
    </div>
  );
}

function TaskCard({ label, desc, done, onClick, Icon, claim, claiming, onClaim }) {
  const canClaim = claim?.eligible && !claim?.claimed;
  const rewardText = claim ? `${claim.le_reward || 0} LE${claim.cp_reward ? ` / ${claim.cp_reward} CP` : ""}` : "";

  return (
    <div
      className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left ${
        done ? "border-[#BFDABC] bg-[#DDEEDB]" : "border-brand-border-warm bg-white"
      }`}
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${done ? "bg-[#1E6B43]" : "bg-brand-dark"}`}>
        {done ? <Check className="h-5 w-5 text-white" strokeWidth={2} /> : <Icon className="h-5 w-5 text-white" strokeWidth={1.8} />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-brand-dark">{label}</p>
        <p className="mt-1 text-xs leading-5 text-brand-mid">{desc}</p>
        {rewardText && <p className="mt-1 text-[11px] font-semibold text-brand-gold-deep">獎勵 {rewardText}</p>}
      </div>
      {claim?.claimed ? (
        <span className="text-xs font-semibold text-brand-gold-deep">已領取</span>
      ) : canClaim ? (
        <button
          type="button"
          onClick={onClaim}
          disabled={claiming}
          className="rounded-full bg-brand-dark px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
        >
          {claiming ? "領取中" : "領取"}
        </button>
      ) : (
        <button type="button" onClick={onClick} className="text-xs font-semibold text-brand-gold-deep">
          {done ? "待領取" : "前往"}
        </button>
      )}
    </div>
  );
}

function ProgressTask({ label, value, target, claim, claiming, onClaim }) {
  const done = value >= target;
  const progress = Math.min((value / target) * 100, 100);
  const canClaim = claim?.eligible && !claim?.claimed;
  const rewardText = claim ? `${claim.le_reward || 0} LE${claim.cp_reward ? ` / ${claim.cp_reward} CP` : ""}` : "";

  return (
    <div className="rounded-2xl border border-brand-border-warm bg-white p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-brand-dark">{label}</p>
        <p className="text-xs text-brand-gold-deep">{Math.min(value, target)} / {target}</p>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#F0EBE0]">
        <div className={`h-full rounded-full ${done ? "bg-[#1E6B43]" : "bg-brand-dark"}`} style={{ width: `${progress}%` }} />
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold text-brand-gold-deep">{rewardText ? `獎勵 ${rewardText}` : "完成後解鎖獎勵"}</p>
        {claim?.claimed ? (
          <span className="text-xs font-semibold text-brand-gold-deep">已領取</span>
        ) : canClaim ? (
          <button
            type="button"
            onClick={onClaim}
            disabled={claiming}
            className="rounded-full bg-brand-dark px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
          >
            {claiming ? "領取中" : "領取"}
          </button>
        ) : (
          <span className="text-xs text-brand-mid">尚未完成</span>
        )}
      </div>
    </div>
  );
}
