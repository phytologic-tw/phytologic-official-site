// src/pages/line/LineEventsPage.jsx
import React, { useEffect, useState } from "react";
import { ArrowRight, CalendarDays } from "lucide-react";
import LineMemberLayout from "./LineMemberLayout";
import { listPublicRecords } from "../../lib/adminData";

function formatDate(value) {
  if (!value) return "近期";
  try {
    return new Intl.DateTimeFormat("zh-TW", {
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(value));
  } catch {
    return "近期";
  }
}

function stripHtml(value = "") {
  return String(value).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export default function LineEventsPage({ route, go }) {
  const [member, setMember] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("line_member");
    if (stored) setMember(JSON.parse(stored));

    let mounted = true;
    listPublicRecords("announcements", { limit: 10 })
      .then((items) => {
        if (mounted) setEvents(items);
      })
      .catch((error) => {
        console.error("[LineEventsPage] announcements load failed:", error.message);
        if (mounted) setEvents([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <LineMemberLayout route={route} go={go} member={member}>
      <div className="px-4 py-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-gold-deep">Events</p>
        <h1 className="mb-1 text-2xl font-semibold text-brand-dark">最新活動</h1>
        <p className="mb-6 text-sm text-brand-mid">活動、紅利與公告會先整理在這裡。</p>

        {loading && (
          <div className="flex h-40 items-center justify-center rounded-2xl border border-brand-border-warm bg-white">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-dark border-t-transparent" />
          </div>
        )}

        {!loading && events.length === 0 && (
          <div className="rounded-2xl border border-brand-border-warm bg-white p-6">
            <CalendarDays className="mb-4 h-8 w-8 text-brand-gold-deep" strokeWidth={1.6} />
            <h2 className="mb-2 text-lg font-semibold text-brand-dark">近期活動準備中</h2>
            <p className="text-sm leading-6 text-brand-mid">
              下一波活動公布後，會同步出現在 LINE 會員專區。
            </p>
          </div>
        )}

        {!loading && events.length > 0 && (
          <div className="space-y-4">
            {events.map((event) => {
              const summary = stripHtml(event.excerpt || event.content || "");
              return (
                <article key={event.id} className="rounded-2xl border border-brand-border-warm bg-white p-5">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-[#F0EBE0] px-3 py-1 text-[11px] font-semibold text-brand-gold-deep">
                      {formatDate(event.published_at || event.created_at)}
                    </span>
                    <CalendarDays className="h-5 w-5 text-brand-gold-deep" strokeWidth={1.7} />
                  </div>
                  <h2 className="mb-2 text-lg font-semibold leading-snug text-brand-dark">
                    {event.title || "植本邏輯活動"}
                  </h2>
                  {summary && (
                    <p className="mb-4 line-clamp-3 text-sm leading-6 text-brand-mid">
                      {summary}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => go("/news")}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-brand-border-gold bg-[#F7F4EE] py-3 text-sm font-semibold text-brand-dark"
                  >
                    查看公告
                    <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </LineMemberLayout>
  );
}
