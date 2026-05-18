import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Dumbbell,
  Eye,
  Heart,
  Leaf,
  Menu,
  Newspaper,
  ShieldCheck,
  Sparkles,
  Store,
  Users,
  X,
} from "lucide-react";
import HealthAssessment from "./components/HealthAssessment";
import AdminDashboard from "./components/admin/AdminDashboard";
import FloatingLineButton from "./components/line/FloatingLineButton";
import LineCTA from "./components/line/LineCTA";
import LineQRCode from "./components/line/LineQRCode";
import { isSupabaseConfigured, supabase, supabaseConfigMessage } from "./lib/supabase";

const logo = "/logo.png";
const lineUrl = import.meta.env.VITE_LINE_OA_URL || import.meta.env.VITE_LINE_OFFICIAL_URL || import.meta.env.VITE_LINE_CTA_URL || "https://lin.ee/YpVA4C8";
const lineId = "@phytologic";

const products = [
  { id: "white", name: "雪山植萃", english: "Pearl White", colorName: "珍珠白", theme: "修復・抗發炎・溫和滋補", icon: Sparkles, accent: "#F5EFE4", deep: "#A98E61", desc: "鉑金基底液結合蘋果、山藥、銀耳與核桃，為高壓、熬夜、腸胃敏感族群提供溫和植物修復支持。", tags: ["細胞修復", "腸胃支持", "抗氧化", "低負擔"] },
  { id: "green", name: "青檸植萃", english: "Emerald Green", colorName: "翡翠綠", theme: "代謝・腸道促排・體內環保", icon: Leaf, accent: "#DDEEDB", deep: "#1E6B43", desc: "深綠蔬菜、芭樂、檸檬與黑木耳，建構高纖維、天然維生素 C 與微量營養素的代謝促排配方。", tags: ["腸道促排", "代謝支持", "高纖維", "低糖"] },
  { id: "rose", name: "玫瑰植萃", english: "Rose Red", colorName: "玫瑰紅", theme: "女性保養・氣色・抗氧化", icon: Heart, accent: "#F5DDE2", deep: "#AA3F57", desc: "甜菜根、紫甘藍、銀耳、芭樂、百香果、檸檬與玫瑰花瓣，打造女性日常保養與紅潤氣色配方。", tags: ["膠原支持", "紅潤氣色", "保水滋潤", "抗氧化"] },
  { id: "gold", name: "桂香植萃", english: "Golden Yellow", colorName: "金鑽黃", theme: "運動修復・增肌減脂・代謝引擎", icon: Dumbbell, accent: "#F8E6AD", deep: "#B8871B", desc: "甜玉米、香蕉、百香果、薑黃與桂香精釀液，提供運動後能量回補、肌肉修復與抗氧化支持。", tags: ["運動修復", "蛋白質利用", "電解質", "體態管理"] },
  { id: "purple", name: "紫莓植萃", english: "Crystal Purple", colorName: "水晶紫", theme: "護眼・抗氧化・3C族保養", icon: Eye, accent: "#E7DDF6", deep: "#65439A", desc: "藍莓、桑椹、紫薯、紫高麗菜、木鱉果與紅蘿蔔，建構水脂雙溶的護眼抗氧化網路。", tags: ["3C護眼", "花青素", "維生素A先質", "高吸收"] },
];

function DataState({ loading, error, empty, children }) {
  if (loading) {
    return <div className="rounded-2xl border border-[#E7DDBF] bg-white/75 p-7 text-center text-[#49675A]">資料載入中...</div>;
  }
  if (error) {
    return <div className="rounded-2xl border border-[#E8B4A8] bg-[#FFF7F5] p-7 text-center text-[#9A3C2D]">{error}</div>;
  }
  if (empty) {
    return <div className="rounded-2xl border border-[#E7DDBF] bg-white/75 p-7 text-center text-[#49675A]">{children || "目前尚無公開資料。"}</div>;
  }
  return null;
}

function SectionTitle({ eyebrow, title, text }) {
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#B89B5E]">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-[#123828] md:text-5xl">{title}</h2>
      {text && <p className="mt-5 text-base leading-8 text-[#49675A] md:text-lg">{text}</p>}
    </div>
  );
}

function Pill({ children }) {
  return <span className="rounded-full border border-[#D8C99C]/70 bg-white/70 px-4 py-2 text-sm text-[#355548] shadow-sm">{children}</span>;
}

function useRoute() {
  const [route, setRoute] = useState(window.location.pathname);
  useEffect(() => {
    const onPop = () => setRoute(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  const go = (path) => {
    window.history.pushState({}, "", path);
    setRoute(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return [route, go];
}

const publicSelectColumns = {
  partners: "id, partner_name, city, category, description, facebook_url, instagram_url, website_url, created_at",
  announcements: "id, title, category, summary, content, cover_image_url, published_at, is_pinned, created_at",
  gallery_items: "id, title, type, category, media_url, thumbnail_url, description, published_at, created_at",
};

function usePublished(table, order = "published_at") {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState(isSupabaseConfigured ? "" : supabaseConfigMessage);
  useEffect(() => {
    let ignore = false;
    async function load() {
      if (!supabase) return;
      setLoading(true);
      setError("");
      const status = table === "partners" ? "approved" : "published";
      let query = supabase.from(table).select(publicSelectColumns[table] || "*").eq("status", status);
      if (table === "announcements") {
        query = query.order("is_pinned", { ascending: false }).order("published_at", { ascending: false, nullsFirst: false });
      } else {
        query = query.order(order, { ascending: false, nullsFirst: false });
      }
      const response = await query;
      if (ignore) return;
      if (response.error) {
        setError(`Supabase 讀取失敗：${response.error.message}`);
        setItems([]);
      } else {
        setItems(response.data || []);
      }
      setLoading(false);
    }
    load();
    return () => {
      ignore = true;
    };
  }, [table, order]);
  return { items, loading, error };
}

function Header({ route, go }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = [
    { label: "首頁", path: "/" },
    { label: "AI健康分析", path: "/#physon" },
    { label: "合作夥伴", path: "/partners" },
    { label: "植本公布欄", path: "/news" },
    { label: "精彩剪影", path: "/gallery" },
  ];
  const handleNav = (item) => {
    setMenuOpen(false);
    if (item.path.includes("#")) {
      go("/");
      window.setTimeout(() => document.querySelector(item.path.slice(1))?.scrollIntoView({ behavior: "smooth" }), 80);
      return;
    }
    go(item.path);
  };
  return (
    <header className="sticky top-0 z-50 border-b border-[#E7DDBF] bg-[#F9F5EA]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <button type="button" onClick={() => go("/")} className="flex items-center gap-3 text-left">
          <img src={logo} alt="植本邏輯 PHYTOLOGIC Logo" className="h-10 w-10 object-contain" />
          <span>
            <span className="block text-lg font-semibold tracking-[0.18em]">植本邏輯</span>
            <span className="block text-xs tracking-[0.24em] text-[#7D8D7F]">PHYTOLOGIC</span>
          </span>
        </button>
        <nav className="hidden items-center gap-7 text-sm text-[#355548] lg:flex">
          {nav.map((item) => <button key={item.path} type="button" onClick={() => handleNav(item)} className={`transition hover:text-[#B89B5E] ${route === item.path ? "text-[#B89B5E]" : ""}`}>{item.label}</button>)}
        </nav>
        <a href={lineUrl} target="_blank" rel="noreferrer" className="hidden rounded-full bg-[#06C755] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#06C755]/15 transition hover:bg-[#05B64D] md:block">加入 LINE</a>
        <button type="button" className="lg:hidden" onClick={() => setMenuOpen((v) => !v)}>{menuOpen ? <X /> : <Menu />}</button>
      </div>
      {menuOpen && <div className="border-t border-[#E7DDBF] px-5 py-5 lg:hidden"><div className="grid gap-4">{nav.map((item) => <button key={item.path} type="button" onClick={() => handleNav(item)} className="text-left">{item.label}</button>)}</div></div>}
    </header>
  );
}

function HomePage({ go }) {
  const [activeProduct, setActiveProduct] = useState(products[1]);
  const ActiveIcon = activeProduct.icon;
  const entrances = [
    { title: "AI健康分析", text: "派森依基本資料與發炎指數問卷，產生個人化初步建議。", icon: Activity, action: () => document.querySelector("#physon")?.scrollIntoView({ behavior: "smooth" }) },
    { title: "合作夥伴", text: "探索門市、健身房、美容、醫療保健與社群合作據點。", icon: Store, action: () => go("/partners") },
    { title: "最新活動 / 精彩剪影", text: "查看品牌活動、試飲現場、健康文章與品牌故事。", icon: Newspaper, action: () => go("/news") },
  ];

  return (
    <main>
      <section className="relative overflow-hidden px-5 py-16 md:px-8 md:py-24" style={{ background: `radial-gradient(circle at 72% 25%, ${activeProduct.accent} 0%, rgba(255,255,255,.88) 34%, #F9F5EA 78%)` }}>
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#D8C99C] bg-white/70 px-4 py-2 text-sm text-[#6C5A2F] shadow-sm"><ShieldCheck className="h-4 w-4" /> 熱愛・尊重・相信</div>
            <h1 className="text-5xl font-semibold leading-tight tracking-tight md:text-7xl">全植物機能飲<br />× AI健康系統</h1>
            <p className="mt-7 max-w-2xl text-xl leading-9 text-[#49675A]">植本邏輯把品牌官網升級為 AI 健康體驗、LINE 會員導流、合作夥伴平台與品牌內容平台。</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <button type="button" onClick={() => document.querySelector("#physon")?.scrollIntoView({ behavior: "smooth" })} className="rounded-full bg-[#123828] px-7 py-4 font-medium text-white shadow-xl shadow-[#123828]/20 transition hover:bg-[#1E6B43]">開始 AI 健康分析</button>
              <a href={lineUrl} target="_blank" rel="noreferrer" className="rounded-full border border-[#06C755] bg-white/75 px-7 py-4 font-semibold text-[#087E3A] transition hover:bg-white">立即加入 LINE</a>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.75 }} className="relative">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/60 p-6 shadow-2xl shadow-[#123828]/10 backdrop-blur">
              <div className="flex items-center justify-between"><img src={logo} alt="植本邏輯 Logo" className="h-14 w-14 object-contain" /><div className="text-right text-sm tracking-[0.3em] text-[#B89B5E]">PHYTOLOGIC</div></div>
              <div className="mt-10 grid grid-cols-5 gap-3">{products.map((p) => <button key={p.id} type="button" onClick={() => setActiveProduct(p)} className="h-28 rounded-full border border-white/70 shadow-lg transition hover:-translate-y-1" style={{ background: `linear-gradient(180deg, ${p.accent}, ${p.deep})` }} title={p.name} />)}</div>
              <div className="mt-8 rounded-[1.5rem] bg-[#123828] p-6 text-white shadow-xl shadow-[#123828]/15">
                <div className="flex items-center gap-4"><div className="rounded-2xl bg-white/10 p-3"><ActiveIcon /></div><div><div className="text-2xl font-semibold">{activeProduct.name}</div><div className="text-sm text-white/60">{activeProduct.theme}</div></div></div>
                <p className="mt-5 leading-7 text-white/80">{activeProduct.desc}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-5 py-14 md:px-8">
        <div className="mx-auto max-w-7xl"><LineCTA /></div>
      </section>

      <section className="bg-white/50 px-5 py-16 md:px-8">
        <SectionTitle eyebrow="Website Entry" title="三大核心入口" text="讓訪客從健康分析、合作平台與品牌內容自然進入會員旅程。" />
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {entrances.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.title} type="button" onClick={item.action} className="rounded-2xl border border-[#E7DDBF] bg-white/75 p-7 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#B89B5E] hover:bg-white">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#123828] text-[#D8C99C]"><Icon className="h-6 w-6" /></div>
                <h3 className="text-2xl font-semibold">{item.title}</h3>
                <p className="mt-4 leading-7 text-[#49675A]">{item.text}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#1E6B43]">進入 <ArrowRight className="h-4 w-4" /></div>
              </button>
            );
          })}
        </div>
      </section>

      <section id="products" className="px-5 py-20 md:px-8">
        <SectionTitle eyebrow="Product System" title="五色植物機能系統" text="每一種顏色，對應一種現代人的身體需求。" />
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-5">
          {products.map((p) => {
            const Icon = p.icon;
            return (
              <button key={p.id} type="button" onClick={() => setActiveProduct(p)} className={`rounded-2xl border p-6 text-left shadow-sm transition hover:-translate-y-1 ${activeProduct.id === p.id ? "border-[#B89B5E] bg-white" : "border-[#E7DDBF] bg-white/60"}`}>
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: p.accent, color: p.deep }}><Icon /></div>
                <div className="text-xl font-semibold">{p.name}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.18em] text-[#8B7A4C]">{p.english}</div>
                <p className="mt-4 min-h-[112px] text-sm leading-7 text-[#49675A]">{p.desc}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section id="physon" className="bg-[#F5F2EB] px-5 py-20 md:px-8">
        <HealthAssessment />
      </section>

      <section className="px-5 py-20 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 rounded-[2rem] bg-[#123828] p-8 text-white md:p-12 lg:grid-cols-[1fr_.9fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#D8C99C]">Partnership</p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">讓植物機能飲進入更多日常場景。</h2>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-white/75">開放城市合作者、門市加盟、衛星據點、企業健康方案與試飲活動合作。</p>
            <div className="mt-8 flex flex-wrap gap-3"><Pill>城市合作者</Pill><Pill>門市加盟</Pill><Pill>衛星據點</Pill><Pill>企業方案</Pill></div>
          </div>
          <button type="button" onClick={() => go("/partners")} className="rounded-2xl bg-white/10 p-7 text-left transition hover:bg-white/15">
            <Users className="mb-6 text-[#D8C99C]" />
            <h3 className="text-2xl font-semibold">前往合作夥伴平台</h3>
            <p className="mt-4 leading-8 text-white/70">查看合作夥伴展示牆，或提交合作申請。</p>
          </button>
        </div>
      </section>
    </main>
  );
}

function PartnersPage() {
  const { items: partners, loading, error } = usePublished("partners", "created_at");
  const [form, setForm] = useState({ partner_name: "", city: "", category: "門市", contact_name: "", phone: "", email: "", facebook_url: "", instagram_url: "", website_url: "", description: "" });
  const [notice, setNotice] = useState("");
  const [submitStatus, setSubmitStatus] = useState("idle");
  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const submit = async (event) => {
    event.preventDefault();
    setNotice("");
    if (!form.partner_name || !form.city || !form.contact_name || !form.phone || !form.email) {
      setNotice("請先完成必填欄位。");
      return;
    }
    if (!supabase) {
      setNotice(supabaseConfigMessage);
      return;
    }
    setSubmitStatus("loading");
    const { error: insertError } = await supabase.from("partners").insert({ ...form, status: "pending" });
    if (insertError) {
      setNotice(`送出失敗：${insertError.message}`);
      setSubmitStatus("error");
      return;
    }
    setNotice("已送出合作申請，審核通過後會出現在展示牆。");
    setForm({ partner_name: "", city: "", category: "門市", contact_name: "", phone: "", email: "", facebook_url: "", instagram_url: "", website_url: "", description: "" });
    setSubmitStatus("success");
  };

  return (
    <main className="px-5 py-16 md:px-8">
      <SectionTitle eyebrow="Partners" title="合作夥伴平台" text="展示已核准合作夥伴，並提供合作申請入口。" />
      <DataState loading={loading} error={error} empty={!loading && !error && partners.length === 0}>目前尚無已核准合作夥伴。</DataState>
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
        {partners.map((partner) => (
          <article key={partner.id || partner.partner_name} className="rounded-2xl border border-[#E7DDBF] bg-white/75 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3 text-sm text-[#8B7A4C]"><span>{partner.city}</span><span>{partner.category}</span></div>
            <h3 className="mt-4 text-2xl font-semibold">{partner.partner_name}</h3>
            <p className="mt-4 min-h-20 leading-7 text-[#49675A]">{partner.description}</p>
            <div className="mt-6 flex flex-wrap gap-2 text-sm">
              {partner.facebook_url && <a className="rounded-full border border-[#D8C99C] px-4 py-2" href={partner.facebook_url}>FB</a>}
              {partner.instagram_url && <a className="rounded-full border border-[#D8C99C] px-4 py-2" href={partner.instagram_url}>IG</a>}
              {partner.website_url && <a className="rounded-full border border-[#D8C99C] px-4 py-2" href={partner.website_url}>Website</a>}
            </div>
          </article>
        ))}
      </div>
      <form onSubmit={submit} className="mx-auto mt-12 max-w-5xl rounded-2xl border border-[#E7DDBF] bg-white/80 p-7 shadow-sm">
        <h3 className="text-3xl font-semibold">合作申請表單</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <input value={form.partner_name} onChange={(e) => update("partner_name", e.target.value)} className="rounded-2xl border border-[#E2D5B5] px-5 py-4 outline-none focus:border-[#B89B5E]" placeholder="partner_name 合作夥伴名稱 *" />
          <input value={form.city} onChange={(e) => update("city", e.target.value)} className="rounded-2xl border border-[#E2D5B5] px-5 py-4 outline-none focus:border-[#B89B5E]" placeholder="city 城市 *" />
          <select value={form.category} onChange={(e) => update("category", e.target.value)} className="rounded-2xl border border-[#E2D5B5] px-5 py-4 outline-none focus:border-[#B89B5E]">
            {["門市", "健身房", "美容", "醫療保健", "社群合作", "其他"].map((item) => <option key={item}>{item}</option>)}
          </select>
          <input value={form.contact_name} onChange={(e) => update("contact_name", e.target.value)} className="rounded-2xl border border-[#E2D5B5] px-5 py-4 outline-none focus:border-[#B89B5E]" placeholder="contact_name 聯絡人 *" />
          <input value={form.phone} onChange={(e) => update("phone", e.target.value)} className="rounded-2xl border border-[#E2D5B5] px-5 py-4 outline-none focus:border-[#B89B5E]" placeholder="phone 電話 *" />
          <input value={form.email} onChange={(e) => update("email", e.target.value)} className="rounded-2xl border border-[#E2D5B5] px-5 py-4 outline-none focus:border-[#B89B5E]" placeholder="email *" />
          <input value={form.facebook_url} onChange={(e) => update("facebook_url", e.target.value)} className="rounded-2xl border border-[#E2D5B5] px-5 py-4 outline-none focus:border-[#B89B5E]" placeholder="facebook_url" />
          <input value={form.instagram_url} onChange={(e) => update("instagram_url", e.target.value)} className="rounded-2xl border border-[#E2D5B5] px-5 py-4 outline-none focus:border-[#B89B5E]" placeholder="instagram_url" />
          <input value={form.website_url} onChange={(e) => update("website_url", e.target.value)} className="rounded-2xl border border-[#E2D5B5] px-5 py-4 outline-none focus:border-[#B89B5E] md:col-span-2" placeholder="website_url" />
          <textarea value={form.description} onChange={(e) => update("description", e.target.value)} className="min-h-32 rounded-2xl border border-[#E2D5B5] px-5 py-4 outline-none focus:border-[#B89B5E] md:col-span-2" placeholder="description 合作簡介" />
        </div>
        <button disabled={submitStatus === "loading"} className="mt-5 rounded-full bg-[#123828] px-8 py-4 font-medium text-white transition hover:bg-[#1E6B43] disabled:cursor-not-allowed disabled:bg-[#9FAEA5]">{submitStatus === "loading" ? "送出中..." : "送出合作申請"}</button>
        {notice && <p className={`mt-4 rounded-2xl px-5 py-4 ${submitStatus === "error" || notice.includes("失敗") || notice.includes("尚未設定") ? "bg-[#FFF7F5] text-[#9A3C2D]" : "bg-[#DDEEDB] text-[#1E6B43]"}`}>{notice}</p>}
      </form>
    </main>
  );
}

function NewsPage() {
  const { items: news, loading, error } = usePublished("announcements");
  const sorted = useMemo(() => [...news].sort((a, b) => Number(b.is_pinned) - Number(a.is_pinned)), [news]);
  return (
    <main className="px-5 py-16 md:px-8">
      <SectionTitle eyebrow="News" title="植本公布欄" text="品牌活動、試飲活動、加盟說明會、合作公告與健康文章。" />
      <DataState loading={loading} error={error} empty={!loading && !error && sorted.length === 0}>目前尚無已發布公告。</DataState>
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
        {sorted.map((item) => (
          <article key={item.id || item.title} className="rounded-2xl border border-[#E7DDBF] bg-white/75 p-7 shadow-sm">
            <div className="flex items-center justify-between text-sm text-[#8B7A4C]"><span>{item.category}</span><span>{item.is_pinned ? "置頂" : item.published_at}</span></div>
            {item.cover_image_url && <img src={item.cover_image_url} alt="" className="mt-5 aspect-[16/10] w-full rounded-xl object-cover" />}
            <h3 className="mt-5 text-2xl font-semibold">{item.title}</h3>
            <p className="mt-4 leading-7 text-[#49675A]">{item.summary}</p>
            <p className="mt-5 text-sm leading-7 text-[#7D8D7F]">{item.content}</p>
          </article>
        ))}
      </div>
    </main>
  );
}

function GalleryPage() {
  const { items, loading, error } = usePublished("gallery_items");
  return (
    <main className="px-5 py-16 md:px-8">
      <SectionTitle eyebrow="Gallery" title="精彩剪影" text="活動現場、消費者體驗、合作夥伴、產品製作與品牌故事。" />
      <DataState loading={loading} error={error} empty={!loading && !error && items.length === 0}>目前尚無已發布剪影。</DataState>
      <div className="mx-auto columns-1 gap-5 space-y-5 md:columns-2 xl:columns-3 max-w-7xl">
        {items.map((item, index) => (
          <article key={item.id || item.title} className="break-inside-avoid overflow-hidden rounded-2xl border border-[#E7DDBF] bg-white/80 shadow-sm">
            {item.type === "video" ? (
              <div className="aspect-video bg-[#123828] p-6 text-white">影片：{item.media_url}</div>
            ) : (
              <img src={item.thumbnail_url || item.media_url || "/logo.png"} alt={item.title} className={`w-full object-cover ${index % 3 === 0 ? "aspect-[4/5]" : "aspect-[4/3]"}`} />
            )}
            <div className="p-6">
              <div className="text-sm text-[#8B7A4C]">{item.category}</div>
              <h3 className="mt-2 text-2xl font-semibold">{item.title}</h3>
              <p className="mt-3 leading-7 text-[#49675A]">{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

function Footer({ go }) {
  return (
    <footer className="border-t border-[#E7DDBF] px-5 py-10 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <div className="text-sm text-[#49675A]">
          <div>© 2026 植本邏輯 PHYTOLOGIC. All rights reserved.</div>
          <div className="mt-2 tracking-[0.28em]">熱愛・尊重・相信</div>
        </div>
        <div className="grid gap-4 rounded-2xl border border-[#E7DDBF] bg-white/70 p-4 md:grid-cols-[88px_1fr] md:items-center">
          <LineQRCode className="w-24" />
          <div>
            <div className="text-sm text-[#8B7A4C]">官方 LINE</div>
            <div className="mt-1 font-semibold text-[#123828]">{lineId}</div>
            <a href={lineUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex rounded-full bg-[#06C755] px-5 py-2 text-sm font-semibold text-white">立即加入 LINE</a>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-7xl border-t border-[#E7DDBF]/70 pt-5 text-right">
        <button type="button" onClick={() => go("/admin")} className="text-xs text-[#9A8C68] transition hover:text-[#123828]">管理入口</button>
      </div>
    </footer>
  );
}

export default function PhytologicWebsite() {
  const [route, go] = useRoute();
  const isAdminRoute = route === "/admin" || route.startsWith("/admin/");
  const page = isAdminRoute ? <AdminDashboard route={route} go={go} /> : route === "/partners" ? <PartnersPage /> : route === "/news" ? <NewsPage /> : route === "/gallery" ? <GalleryPage /> : <HomePage go={go} />;
  return (
    <div className="min-h-screen bg-[#F9F5EA] text-[#123828]">
      {!isAdminRoute && <Header route={route} go={go} />}
      {page}
      {!isAdminRoute && <Footer go={go} />}
      {!isAdminRoute && <FloatingLineButton />}
    </div>
  );
}
