import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Dumbbell,
  Eye,
  Heart,
  Leaf,
  Mail,
  MapPin,
  Menu,
  Newspaper,
  Phone,
  ShieldCheck,
  Sparkles,
  Store,
  Users,
  X,
} from "lucide-react";
import HealthAssessment from "./components/HealthAssessment";
import AdminDashboard from "./components/admin/AdminDashboard";
import FloatingLineButton from "./components/line/FloatingLineButton";
import LineQRCode from "./components/line/LineQRCode";
import { handleOpenLine } from "./components/line/lineConfig";
import { isSupabaseConfigured, supabase, supabaseConfigMessage } from "./lib/supabase";

const logo = "/logo.png";
const lineId = "@phytologic";

const products = [
  { id: "white", name: "雪山植萃", english: "Pearl White", colorName: "珍珠白", theme: "修復・抗發炎・溫和滋補", icon: Sparkles, accent: "#F5EFE4", deep: "#A98E61", desc: "鉑金基底液結合蘋果、山藥、銀耳與核桃，為高壓、熬夜、腸胃敏感族群提供溫和植物修復支持。", tags: ["細胞修復", "腸胃支持", "抗氧化", "低負擔"] },
  { id: "green", name: "青檸植萃", english: "Emerald Green", colorName: "翡翠綠", theme: "代謝・腸道促排・體內環保", icon: Leaf, accent: "#DDEEDB", deep: "#1E6B43", desc: "深綠蔬菜、芭樂、檸檬與黑木耳，建構高纖維、天然維生素 C 與微量營養素的代謝促排配方。", tags: ["腸道促排", "代謝支持", "高纖維", "低糖"] },
  { id: "rose", name: "玫瑰植萃", english: "Rose Red", colorName: "玫瑰紅", theme: "女性保養・氣色・抗氧化", icon: Heart, accent: "#F5DDE2", deep: "#AA3F57", desc: "甜菜根、紫甘藍、銀耳、芭樂、百香果、檸檬與玫瑰花瓣，打造女性日常保養與紅潤氣色配方。", tags: ["膠原支持", "紅潤氣色", "保水滋潤", "抗氧化"] },
  { id: "gold", name: "桂香植萃", english: "Golden Yellow", colorName: "金鑽黃", theme: "運動修復・增肌減脂・代謝引擎", icon: Dumbbell, accent: "#F8E6AD", deep: "#B8871B", desc: "甜玉米、香蕉、百香果、薑黃與桂香精釀液，提供運動後能量回補、肌肉修復與抗氧化支持。", tags: ["運動修復", "蛋白質利用", "電解質", "體態管理"] },
  { id: "purple", name: "紫莓植萃", english: "Crystal Purple", colorName: "水晶紫", theme: "護眼・抗氧化・3C族保養", icon: Eye, accent: "#E7DDF6", deep: "#65439A", desc: "藍莓、桑椹、紫薯、紫高麗菜、木鱉果與紅蘿蔔，建構水脂雙溶的護眼抗氧化網路。", tags: ["3C護眼", "花青素", "維生素A先質", "高吸收"] },
];

const colorStories = [
  { color: "珍珠白", title: "保持清楚與清醒", text: "希望未來有一天，還能把自己這一輩子學到的東西，好好地分享給孩子。", card: "#F7F1E7", border: "#FFFFFF", textColor: "#2C4739", muted: "#61756A", number: "#A98E61" },
  { color: "翡翠綠", title: "吃得下，才活得好", text: "代謝與腸胃，是一切修復真正的起點。", card: "#DDEEDB", border: "#BFDABC", textColor: "#123828", muted: "#3E6350", number: "#1E6B43" },
  { color: "玫瑰紅", title: "愛美想帥，是想陪伴更久", text: "不是害怕老，而是希望還能保有好的狀態陪孩子長大。", card: "#F5DDE2", border: "#E9BBC6", textColor: "#67283A", muted: "#8A4F5F", number: "#AA3F57" },
  { color: "金鑽黃", title: "真正的力量", text: "當家人需要你的時候，你還有力氣站在前面。", card: "#F8E6AD", border: "#E6C76B", textColor: "#5D4212", muted: "#7B6229", number: "#B8871B" },
  { color: "水晶紫", title: "看見人生重要的瞬間", text: "想再多看看家人的樣子、世界的風景與人生的回憶。", card: "#E7DDF6", border: "#D4C1EF", textColor: "#3E2866", muted: "#654D86", number: "#65439A" },
];

const homeNews = [
  { date: "2026.05", category: "品牌公告", title: "植本邏輯官方網站籌備啟動", text: "以品牌形象、產品教育、派森與合作加盟為核心，建立完整官方資訊入口。", detail: "官方網站將作為植本邏輯的品牌門面，整合創辦理念、產品教育、派森、加盟合作與最新活動資訊，讓消費者、合作夥伴與加盟主都能快速理解品牌價值。" },
  { date: "2026.07", category: "展會消息", title: "高雄加盟展合作計畫啟動", text: "招募城市合作者、門市加盟與衛星據點，共同推動植物機能飲品進入日常生活。", detail: "高雄加盟展將以試飲體驗、品牌說明、城市合作者洽談與門市模型展示為核心，目標建立可複製、可落地、可擴張的植物機能飲品合作系統。" },
  { date: "COMING", category: "系統開發", title: "LINE會員與AI健康推薦系統", text: "以生活狀態、身體反應與個人化資料，建立每日飲品建議與健康陪伴服務。", detail: "第一階段將以LINE作為會員入口，導入AI超級客服、每日推播、飲品推薦、好運顏色、生活任務與回訪紀錄，讓健康服務變得更輕、更近、更容易持續。" },
];

const philosophyCards = [
  { title: "不是飲料，是食物", text: "每一杯都以每天敢給家人吃為底線，回到植物、營養與身體真正需要的本質。", detail: "植本邏輯的產品不是短暫流行的飲料，而是每天會進入身體、長期被吸收、影響未來十年與二十年的食物。因此我們以家人的標準設計產品，重視食材來源、營養邏輯、風味接受度與長期可持續性。" },
  { title: "三好原則", text: "好喝、好看、好吸收。真正能持續的健康，一定要能融入生活。", detail: "好喝，才能每天持續；好看，才能被願意靠近；好吸收，才真正對身體有意義。植本邏輯把健康產品從『忍耐』變成『享受』，讓機能飲品不只是有效，而是能被長期喜歡。" },
  { title: "三無鐵律", text: "無人工、無化學、無合成。真正重要的人，值得最乾淨的選擇。", detail: "我們拒絕人工香精、化學合成風味與不必要的工業添加，盡可能回到真正從土地長出來的植物本源。因為這不是做給市場看的產品，而是做給家人每天吃的東西。" },
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
  partners: "id, partner_name, city, category, contact_name, description, facebook_url, instagram_url, website_url, created_at",
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
    { label: "品牌理念", path: "/#品牌理念" },
    { label: "產品系列", path: "/#產品系列" },
    { label: "派森", path: "/#physon" },
    { label: "最新消息", path: "/#最新消息" },
    { label: "合作加盟", path: "/#合作加盟" },
    { label: "合作夥伴", path: "/partners" },
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
        <button type="button" onClick={handleOpenLine} className="hidden rounded-full bg-[#06C755] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#06C755]/15 transition hover:bg-[#05B64D] md:block">加入 LINE</button>
        <button type="button" className="lg:hidden" onClick={() => setMenuOpen((v) => !v)}>{menuOpen ? <X /> : <Menu />}</button>
      </div>
      {menuOpen && <div className="border-t border-[#E7DDBF] px-5 py-5 lg:hidden"><div className="grid gap-4">{nav.map((item) => <button key={item.path} type="button" onClick={() => handleNav(item)} className="text-left">{item.label}</button>)}</div></div>}
    </header>
  );
}

function HomePage({ go }) {
  const [activeProduct, setActiveProduct] = useState(products[1]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [infoModal, setInfoModal] = useState(null);
  const [formSent, setFormSent] = useState(false);
  const ActiveIcon = activeProduct.icon;
  const gradient = useMemo(() => ({ background: `radial-gradient(circle at 72% 25%, ${activeProduct.accent} 0%, rgba(255,255,255,.88) 34%, #F9F5EA 78%)` }), [activeProduct]);
  const openPhysonIntro = () => setInfoModal({ eyebrow: "PHYSON SYSTEM", title: "派森｜AI健康系統", text: "派森不是單純的AI聊天工具，而是植本邏輯建立的健康陪伴系統。它會透過生活型態、身體反應、飲用紀錄與健康目標，建立個人化植物機能建議，並透過LINE每日陪伴、提醒與回訪，讓健康真正融入生活。" });

  return (
    <main>
      <section className="relative overflow-hidden px-5 py-20 md:px-8 md:py-28" style={gradient}>
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.08fr_.92fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#D8C99C] bg-white/70 px-4 py-2 text-sm text-[#6C5A2F] shadow-sm"><ShieldCheck className="h-4 w-4" /> 熱愛・尊重・相信</div>
            <h1 className="text-5xl font-semibold leading-tight tracking-tight md:text-7xl">全植物機能飲<br />× AI健康系統</h1>
            <p className="mt-7 max-w-2xl text-xl leading-9 text-[#49675A]">我們不是在販售飲料，而是用自然、科學與愛，守護人生裡真正重要的人。</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <a href="#產品系列" className="rounded-full bg-[#123828] px-7 py-4 font-medium text-white shadow-xl shadow-[#123828]/20 transition hover:bg-[#1E6B43]">探索產品系列</a>
              <button type="button" onClick={openPhysonIntro} className="rounded-full border border-[#B89B5E] bg-white/70 px-7 py-4 font-medium text-[#123828] transition hover:bg-white">了解派森</button>
              <button type="button" onClick={handleOpenLine} className="rounded-full border border-[#06C755] bg-white/75 px-7 py-4 font-semibold text-[#087E3A] transition hover:bg-white">立即加入 LINE</button>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.1 }} className="relative">
            <div className="absolute -inset-8 rounded-[3rem] bg-white/35 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/55 p-7 shadow-2xl shadow-[#123828]/10 backdrop-blur">
              <div className="flex items-center justify-between"><img src={logo} alt="植本邏輯 Logo" className="h-16 w-16 object-contain" /><div className="text-right text-sm tracking-[0.3em] text-[#B89B5E]">PHYTOLOGIC</div></div>
              <div className="mt-16 grid grid-cols-5 gap-3">{products.map((p) => <button key={p.id} type="button" onClick={() => setActiveProduct(p)} className="h-32 rounded-full border border-white/70 shadow-lg transition hover:-translate-y-1" style={{ background: `linear-gradient(180deg, ${p.accent}, ${p.deep})` }} title={p.name} />)}</div>
              <button type="button" onClick={() => setDetailOpen(true)} className="mt-10 w-full rounded-[2rem] bg-[#123828] p-7 text-left text-white shadow-xl shadow-[#123828]/15 transition hover:-translate-y-1">
                <div className="flex items-center gap-4"><div className="rounded-2xl bg-white/10 p-3"><ActiveIcon /></div><div><div className="text-2xl font-semibold">{activeProduct.name}</div><div className="text-sm text-white/60">{activeProduct.theme}</div></div></div>
                <p className="mt-5 leading-7 text-white/80">{activeProduct.desc}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm text-[#D8C99C]">點擊查看完整機能內容 <ArrowRight className="h-4 w-4" /></div>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="品牌理念" className="px-5 py-20 md:px-8">
        <SectionTitle eyebrow="Brand Philosophy" title="六個家庭，重新理解健康之後的人生答案" text="植本邏輯不是從商業開始，而是從家庭、陪伴與健康開始。" />
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[3rem] border border-[#E7DDBF] bg-white/70 shadow-xl shadow-[#123828]/5">
          <div className="grid lg:grid-cols-[1.05fr_.95fr]">
            <div className="p-8 md:p-14">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D8C99C] bg-[#F9F5EA] px-4 py-2 text-sm text-[#8B7A4C]">從國際品牌經理人，到一位父親</div>
              <h3 className="mt-8 text-4xl font-semibold leading-tight text-[#123828] md:text-5xl">有些事情，年輕時不會明白。</h3>
              <div className="mt-8 space-y-6 text-lg leading-9 text-[#49675A]">
                <p>年輕的時候，我們總以為人生最重要的是成功、速度、成績與規模。我們熬夜、應酬、壓力、失眠，把青春與身體投入高速運轉的世界。</p>
                <p>科技讓文明進步了，但人類卻離健康越來越遠。每天長時間盯著螢幕、吃著方便卻失去溫度的食物、過著快速卻疲憊的人生。很多人不是突然病倒，而是慢慢失去了健康。</p>
                <p>五十歲那年，創辦人成為了一位父親。當孩子出生的那一刻，第一次真正思考：「我還有多久能陪他？」</p>
                <p>那一刻開始，健康不再只是身體問題。而是能不能陪孩子長大、陪家人旅行、陪伴愛的人慢慢變老的人生問題。</p>
              </div>
            </div>
            <div className="relative overflow-hidden bg-[#123828] p-8 text-white md:p-14">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at top right, #ffffff 0%, transparent 55%)" }} />
              <div className="relative z-10">
                <div className="text-sm tracking-[0.35em] text-[#D8C99C]">PHYTOLOGIC</div>
                <h3 className="mt-6 text-4xl font-semibold leading-tight">不是能不能賣，<br />而是敢不敢每天給家人吃。</h3>
                <div className="mt-10 space-y-6 text-lg leading-9 text-white/78">
                  <p>植本邏輯開始重新研究植物、營養、人體修復、東方藥食智慧與西方營養學。因為真正重要的問題只有一個：「如果這是我要給家人每天吃的東西，它到底應該長成什麼樣子？」</p>
                  <p>所以我們堅持：無人工、無化學、無合成。真正從土地裡長出來的植物，才有資格成為身體長期吸收的根本。</p>
                  <p>我們不是在販售飲料。我們做的，其實是真正每天會進入人體、長期影響未來十年與二十年的食物。</p>
                </div>
                <div className="mt-10 flex flex-wrap gap-3"><Pill>重視生命</Pill><Pill>尊重自然</Pill><Pill>相信邏輯</Pill></div>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 grid max-w-7xl gap-6 md:grid-cols-3">
          {philosophyCards.map((card) => (
            <button key={card.title} type="button" onClick={() => setInfoModal({ eyebrow: "Brand Philosophy", title: card.title, text: card.detail })} className="rounded-[2rem] border border-[#E2D5B5] bg-white/60 p-8 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#B89B5E] hover:bg-white">
              <h3 className="text-2xl font-semibold">{card.title}</h3>
              <p className="mt-4 leading-8 text-[#49675A]">{card.text}</p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#1E6B43]">查看理念 <ArrowRight className="h-4 w-4" /></div>
            </button>
          ))}
        </div>
      </section>

      <section className="px-5 py-8 md:px-8 md:py-14">
        <div className="mx-auto max-w-7xl rounded-[3rem] border border-[#E7DDBF] bg-[#123828] p-8 text-white md:p-12">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="text-sm tracking-[0.35em] text-[#D8C99C]">LIFE COLORS</div>
              <h2 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">植本邏輯的每一種顏色，<br />都是一種人生願望。</h2>
            </div>
            <p className="max-w-xl text-lg leading-9 text-white/75">我們的產品不是冰冷的商品名稱，而是一位父親、一位丈夫，以及六個家庭對人生最真實的願望。</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {colorStories.map((story, index) => (
              <div key={story.color} className="min-h-[300px] rounded-[2rem] border p-6 shadow-sm transition hover:-translate-y-2" style={{ backgroundColor: story.card, borderColor: story.border, color: story.textColor }}>
                <div className="text-sm font-semibold tracking-[0.25em]" style={{ color: story.number }}>0{index + 1}</div>
                <h3 className="mt-4 text-2xl font-semibold">{story.color}</h3>
                <div className="mt-2 text-lg font-medium" style={{ color: story.textColor }}>{story.title}</div>
                <p className="mt-5 leading-8" style={{ color: story.muted }}>{story.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="產品系列" className="bg-white/45 px-5 py-20 md:px-8">
        <SectionTitle eyebrow="Product System" title="五色植物機能系統" text="每一種顏色，都是一種人生願望；每一款配方，對應一種現代人的身體需求。" />
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-5">
          {products.map((p) => {
            const Icon = p.icon;
            return (
              <button key={p.id} type="button" onClick={() => setActiveProduct(p)} className={`rounded-[2rem] border p-6 text-left shadow-sm transition hover:-translate-y-1 ${activeProduct.id === p.id ? "border-[#B89B5E] bg-white" : "border-[#E7DDBF] bg-white/65"}`}>
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: p.accent, color: p.deep }}><Icon /></div>
                <div className="text-xl font-semibold">{p.name}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.18em] text-[#8B7A4C]">{p.english}</div>
                <p className="mt-4 min-h-[84px] text-sm leading-7 text-[#49675A]">{p.desc}</p>
              </button>
            );
          })}
        </div>
        <button type="button" onClick={() => setDetailOpen(true)} className="mx-auto mt-8 block w-full max-w-7xl rounded-[2.5rem] border border-[#E7DDBF] bg-[#123828] p-8 text-left text-white transition hover:-translate-y-1 hover:shadow-2xl md:p-10">
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <div>
              <div className="text-sm tracking-[0.32em] text-[#D8C99C]">{activeProduct.colorName}</div>
              <h3 className="mt-3 text-4xl font-semibold">{activeProduct.name}</h3>
              <p className="mt-4 text-lg text-white/75">{activeProduct.theme}</p>
            </div>
            <div>
              <p className="leading-8 text-white/78">{activeProduct.desc}</p>
              <div className="mt-6 flex flex-wrap gap-3">{activeProduct.tags.map((tag) => <span key={tag} className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/85">{tag}</span>)}</div>
            </div>
          </div>
        </button>
      </section>

      <section id="physon" className="bg-[#F5F2EB] px-5 py-20 md:px-8">
        <HealthAssessment />
      </section>

      <section id="最新消息" className="bg-white/45 px-5 py-20 md:px-8">
        <SectionTitle eyebrow="News" title="最新消息" text="品牌公告、試飲活動、加盟展消息與健康專欄。" />
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          {homeNews.map((item) => (
            <button key={item.title} type="button" onClick={() => setInfoModal({ eyebrow: `${item.category}｜${item.date}`, title: item.title, text: item.detail })} className="rounded-[2rem] border border-[#E7DDBF] bg-white/70 p-7 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#B89B5E] hover:bg-white">
              <div className="flex items-center justify-between text-sm text-[#8B7A4C]"><span>{item.category}</span><span>{item.date}</span></div>
              <h3 className="mt-5 text-2xl font-semibold">{item.title}</h3>
              <p className="mt-4 leading-7 text-[#49675A]">{item.text}</p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#1E6B43]">閱讀更多 <ArrowRight className="h-4 w-4" /></div>
            </button>
          ))}
        </div>
        <div className="mx-auto mt-8 flex max-w-7xl flex-wrap gap-3">
          <button type="button" onClick={() => go("/news")} className="rounded-full bg-[#123828] px-7 py-3 font-medium text-white transition hover:bg-[#1E6B43]">前往植本公布欄</button>
          <button type="button" onClick={() => go("/gallery")} className="rounded-full border border-[#B89B5E] bg-white/70 px-7 py-3 font-medium text-[#123828] transition hover:bg-white">查看精彩剪影</button>
        </div>
      </section>

      <section id="合作加盟" className="px-5 py-20 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 rounded-[3rem] bg-[#123828] p-8 text-white md:p-12 lg:grid-cols-[1fr_.9fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#D8C99C]">Partnership</p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">讓每一個人活得久，還要活得好精彩。</h2>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-white/75">開放城市合作者、門市加盟、衛星據點、企業健康方案與試飲活動合作。總部提供產品系統、品牌內容、會員系統與營運支持。</p>
            <div className="mt-8 flex flex-wrap gap-3"><Pill>城市合作者</Pill><Pill>門市加盟</Pill><Pill>衛星據點</Pill><Pill>企業方案</Pill></div>
            <button type="button" onClick={() => go("/partners")} className="mt-8 rounded-full bg-white px-7 py-4 font-semibold text-[#123828] transition hover:bg-[#D8C99C]">前往合作夥伴平台</button>
          </div>
          <div className="rounded-[2rem] bg-white/10 p-7">
            <Newspaper className="mb-6 text-[#D8C99C]" />
            <h3 className="text-2xl font-semibold">合作洽談重點</h3>
            <ul className="mt-5 space-y-4 text-white/78"><li>・品牌與產品教育完整建置</li><li>・試飲活動與加盟展轉換流程</li><li>・LINE會員與派森導入</li><li>・產品供應、物流與營運SOP支持</li></ul>
          </div>
        </div>
      </section>

      <section id="聯絡我們" className="bg-white/45 px-5 py-20 md:px-8">
        <SectionTitle eyebrow="Contact" title="聯絡我們" text="歡迎洽詢品牌合作、門市加盟、城市合作者、企業健康方案與試飲活動。" />
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.85fr_1.15fr]">
          <div className="rounded-[2rem] border border-[#E7DDBF] bg-white/70 p-8 shadow-sm">
            <img src={logo} alt="植本邏輯 Logo" className="h-20 w-20 object-contain" />
            <h3 className="mt-6 text-3xl font-semibold">植本邏輯｜PHYTOLOGIC</h3>
            <p className="mt-4 leading-8 text-[#49675A]">重視生命。尊重自然。相信邏輯。</p>
            <div className="mt-8 space-y-4 text-[#355548]"><div className="flex items-center gap-3"><MapPin className="h-5 w-5 text-[#B89B5E]" /> Taiwan</div><div className="flex items-center gap-3"><Mail className="h-5 w-5 text-[#B89B5E]" /> bryan@phytologic.tw</div><div className="flex items-center gap-3"><Phone className="h-5 w-5 text-[#B89B5E]" /> 07-223-2301</div></div>
          </div>
          <form className="rounded-[2rem] border border-[#E7DDBF] bg-white/80 p-8 shadow-sm">
            <div className="grid gap-5 md:grid-cols-2"><input className="rounded-2xl border border-[#E2D5B5] bg-white px-5 py-4 outline-none focus:border-[#B89B5E]" placeholder="姓名" /><input className="rounded-2xl border border-[#E2D5B5] bg-white px-5 py-4 outline-none focus:border-[#B89B5E]" placeholder="電話" /><input className="rounded-2xl border border-[#E2D5B5] bg-white px-5 py-4 outline-none focus:border-[#B89B5E]" placeholder="Email" /><select className="rounded-2xl border border-[#E2D5B5] bg-white px-5 py-4 outline-none focus:border-[#B89B5E]"><option>合作類型</option><option>門市加盟</option><option>城市合作者</option><option>企業健康方案</option><option>試飲活動</option><option>媒體/其他</option></select></div>
            <textarea className="mt-5 min-h-36 w-full rounded-2xl border border-[#E2D5B5] bg-white px-5 py-4 outline-none focus:border-[#B89B5E]" placeholder="請留下您的需求與所在城市" />
            <button type="button" onClick={() => setFormSent(true)} className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#123828] px-8 py-4 font-medium text-white shadow-xl shadow-[#123828]/15 transition hover:bg-[#1E6B43]">{formSent ? "已收到洽詢" : "送出洽詢"} <ArrowRight className="h-4 w-4" /></button>
            {formSent && <p className="mt-4 rounded-2xl bg-[#DDEEDB] px-5 py-4 text-[#1E6B43]">感謝您的洽詢，品牌團隊將儘快與您聯繫。</p>}
          </form>
        </div>
      </section>

      {infoModal && <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#123828]/55 px-5 backdrop-blur-sm" onClick={() => setInfoModal(null)}><div onClick={(event) => event.stopPropagation()} className="w-full max-w-2xl rounded-[2.5rem] border border-white/70 bg-[#F9F5EA] p-8 shadow-2xl"><div className="flex items-start justify-between gap-5"><div><div className="text-sm tracking-[0.25em] text-[#B89B5E]">{infoModal.eyebrow}</div><h3 className="mt-3 text-4xl font-semibold text-[#123828]">{infoModal.title}</h3></div><button type="button" onClick={() => setInfoModal(null)} className="rounded-full bg-white p-3 text-[#123828] shadow"><X /></button></div><p className="mt-8 rounded-[2rem] bg-white/70 p-7 text-lg leading-9 text-[#49675A]">{infoModal.text}</p><button type="button" onClick={() => setInfoModal(null)} className="mt-7 rounded-full bg-[#123828] px-7 py-4 font-medium text-white">我知道了</button></div></div>}
      {detailOpen && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#123828]/55 px-5 backdrop-blur-sm" onClick={() => setDetailOpen(false)}><div onClick={(event) => event.stopPropagation()} className="max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-[2.5rem] border border-white/70 bg-[#F9F5EA] p-8 shadow-2xl"><div className="flex items-start justify-between gap-5"><div><div className="text-sm tracking-[0.32em] text-[#B89B5E]">{activeProduct.colorName}｜{activeProduct.english}</div><h3 className="mt-3 text-4xl font-semibold text-[#123828]">{activeProduct.name}</h3><p className="mt-3 text-lg text-[#49675A]">{activeProduct.theme}</p></div><button type="button" onClick={() => setDetailOpen(false)} className="rounded-full bg-white p-3 text-[#123828] shadow"><X /></button></div><div className="mt-8 rounded-[2rem] p-7" style={{ background: activeProduct.accent }}><p className="text-lg leading-9 text-[#355548]">{activeProduct.desc}</p></div><div className="mt-7 grid gap-4 md:grid-cols-2">{activeProduct.tags.map((tag, index) => <div key={tag} className="rounded-2xl border border-[#E2D5B5] bg-white/75 p-5"><div className="text-sm text-[#B89B5E]">機能重點 0{index + 1}</div><div className="mt-2 text-xl font-semibold text-[#123828]">{tag}</div></div>)}</div><div className="mt-8 flex flex-wrap gap-3"><a href="#聯絡我們" onClick={() => setDetailOpen(false)} className="rounded-full bg-[#123828] px-7 py-4 font-medium text-white">預約試飲 / 洽詢</a><button type="button" onClick={() => setDetailOpen(false)} className="rounded-full border border-[#B89B5E] px-7 py-4 font-medium text-[#123828]">關閉</button></div></div></div>}
    </main>
  );
}

function PartnersPage() {
  const { items: partners, loading, error } = usePublished("partners", "created_at");
  const initialPartnerForm = { partner_name: "", city: "", partner_type: "門市", contact_name: "", phone: "", email: "", description: "", partner_logo: null };
  const samplePartner = {
    partner_name: "植本邏輯 高雄健康據點",
    city: "高雄市",
    category: "健康顧問",
    contact_name: "品牌顧問",
    description: "提供植物機能飲品體驗、健康需求初談與派森 AI 快篩導入服務。",
    isSample: true,
  };
  const [form, setForm] = useState(initialPartnerForm);
  const [formOpen, setFormOpen] = useState(false);
  const [logoPreview, setLogoPreview] = useState("");
  const [notice, setNotice] = useState("");
  const [submitStatus, setSubmitStatus] = useState("idle");
  const displayPartners = partners.length ? partners : [samplePartner];
  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const updateLogo = (event) => {
    const file = event.target.files?.[0] || null;
    update("partner_logo", file);
    if (!file) {
      setLogoPreview("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(String(reader.result || ""));
    reader.readAsDataURL(file);
  };
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
    const { partner_logo: _partnerLogo, partner_type, ...formPayload } = form;
    const { error: insertError } = await supabase.from("partners").insert({ ...formPayload, category: partner_type, status: "pending" });
    if (insertError) {
      setNotice(`送出失敗：${insertError.message}`);
      setSubmitStatus("error");
      return;
    }
    setNotice("已送出合作申請，審核通過後會出現在展示牆。");
    setForm(initialPartnerForm);
    setLogoPreview("");
    setSubmitStatus("success");
  };

  return (
    <main className="bg-[#F9F5EA] px-5 py-16 md:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#B89B5E]">Partners</p>
            <h1 className="text-4xl font-semibold tracking-tight text-[#123828] md:text-6xl">合作夥伴平台</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#49675A]">展示已核准合作夥伴，提供合作申請入口。</p>
          </div>
          <button type="button" onClick={() => setFormOpen((open) => !open)} className="inline-flex w-fit items-center gap-2 rounded-full bg-[#123828] px-7 py-4 font-semibold text-white shadow-xl shadow-[#123828]/15 transition hover:bg-[#1E6B43]">
            申請成為合作夥伴 <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {loading && <div className="mt-10 rounded-2xl border border-[#E7DDBF] bg-white/75 p-7 text-center text-[#49675A]">資料載入中...</div>}
        {error && <div className="mt-10 rounded-2xl border border-[#E8B4A8] bg-[#FFF7F5] p-7 text-center text-[#9A3C2D]">{error}</div>}
        {!loading && !error && partners.length === 0 && <div className="mt-10 rounded-2xl border border-[#E7DDBF] bg-white/75 p-7 text-center text-[#49675A]">目前尚無已核准合作夥伴</div>}

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {displayPartners.map((partner) => (
            <article key={partner.id || partner.partner_name} className="rounded-2xl border border-[#E2D5B5] bg-white/85 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#123828]/8">
              <div className="flex items-start gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-[#D8C99C] bg-[#F5F2EB] text-2xl font-semibold text-[#B89B5E]">
                  {partner.partner_name?.slice(0, 1) || "植"}
                </div>
                <div className="min-w-0">
                  <h2 className="text-2xl font-semibold text-[#123828]">{partner.partner_name}</h2>
                  <div className="mt-3 flex flex-wrap gap-2 text-sm">
                    <span className="rounded-full bg-[#F5F2EB] px-3 py-1 text-[#6C5A2F]">{partner.city}</span>
                    <span className="rounded-full bg-[#DDEEDB] px-3 py-1 text-[#1E6B43]">類型：{partner.category}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 border-t border-[#E7DDBF] pt-5">
                <div className="text-sm text-[#8B7A4C]">聯絡人</div>
                <div className="mt-1 font-semibold text-[#123828]">{partner.contact_name || "合作窗口"}</div>
                <p className="mt-4 min-h-20 leading-8 text-[#49675A]">{partner.description}</p>
              </div>
              <div className="mt-6 flex flex-wrap gap-2 text-sm">
                <a className="rounded-full border border-[#D8C99C] bg-white px-4 py-2 font-medium text-[#123828] transition hover:border-[#B89B5E]" href={partner.website_url || "#合作申請"}>查看據點</a>
                <a className="rounded-full bg-[#123828] px-4 py-2 font-medium text-white transition hover:bg-[#1E6B43]" href={partner.instagram_url || partner.facebook_url || "#合作申請"}>聯繫合作夥伴</a>
                {partner.isSample && <span className="rounded-full bg-[#F5F2EB] px-4 py-2 text-[#8B7A4C]">範例卡片</span>}
              </div>
            </article>
          ))}
        </div>

        {formOpen && (
          <form id="合作申請" onSubmit={submit} className="mx-auto mt-12 max-w-5xl rounded-2xl border border-[#D8C99C] bg-white/90 p-7 shadow-xl shadow-[#123828]/8">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#B89B5E]">Application</p>
                <h2 className="mt-2 text-3xl font-semibold text-[#123828]">合作申請表單</h2>
              </div>
              <button type="button" onClick={() => setFormOpen(false)} className="w-fit rounded-full border border-[#D8C99C] px-5 py-2 text-sm font-medium text-[#123828] transition hover:bg-[#F5F2EB]">收起表單</button>
            </div>
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <label className="rounded-2xl border border-dashed border-[#D8C99C] bg-[#FDFBF6] p-5 md:col-span-2">
                <span className="block text-sm font-medium text-[#8B7A4C]">上傳品牌 Logo 或大頭貼</span>
                <input name="partner_logo" type="file" accept="image/*" onChange={updateLogo} className="mt-3 block w-full text-sm text-[#49675A] file:mr-4 file:rounded-full file:border-0 file:bg-[#123828] file:px-5 file:py-2 file:font-semibold file:text-white" />
                {logoPreview && <img src={logoPreview} alt="合作夥伴 Logo 預覽" className="mt-4 h-24 w-24 rounded-2xl border border-[#E2D5B5] object-cover" />}
              </label>
              <input value={form.partner_name} onChange={(e) => update("partner_name", e.target.value)} className="rounded-2xl border border-[#E2D5B5] bg-white px-5 py-4 outline-none focus:border-[#B89B5E]" placeholder="合作夥伴名稱 *" />
              <input value={form.city} onChange={(e) => update("city", e.target.value)} className="rounded-2xl border border-[#E2D5B5] bg-white px-5 py-4 outline-none focus:border-[#B89B5E]" placeholder="城市 *" />
              <select value={form.partner_type} onChange={(e) => update("partner_type", e.target.value)} className="rounded-2xl border border-[#E2D5B5] bg-white px-5 py-4 outline-none focus:border-[#B89B5E]">
                {["門市", "工作室", "健康顧問", "活動據點"].map((item) => <option key={item}>{item}</option>)}
              </select>
              <input value={form.contact_name} onChange={(e) => update("contact_name", e.target.value)} className="rounded-2xl border border-[#E2D5B5] bg-white px-5 py-4 outline-none focus:border-[#B89B5E]" placeholder="聯絡人 *" />
              <input value={form.phone} onChange={(e) => update("phone", e.target.value)} className="rounded-2xl border border-[#E2D5B5] bg-white px-5 py-4 outline-none focus:border-[#B89B5E]" placeholder="電話 *" />
              <input value={form.email} onChange={(e) => update("email", e.target.value)} className="rounded-2xl border border-[#E2D5B5] bg-white px-5 py-4 outline-none focus:border-[#B89B5E]" placeholder="Email *" />
              <textarea value={form.description} onChange={(e) => update("description", e.target.value)} className="min-h-32 rounded-2xl border border-[#E2D5B5] bg-white px-5 py-4 outline-none focus:border-[#B89B5E] md:col-span-2" placeholder="簡短介紹" />
            </div>
            <button disabled={submitStatus === "loading"} className="mt-5 rounded-full bg-[#123828] px-8 py-4 font-medium text-white transition hover:bg-[#1E6B43] disabled:cursor-not-allowed disabled:bg-[#9FAEA5]">{submitStatus === "loading" ? "送出中..." : "送出合作申請"}</button>
            {notice && <p className={`mt-4 rounded-2xl px-5 py-4 ${submitStatus === "error" || notice.includes("失敗") || notice.includes("尚未設定") ? "bg-[#FFF7F5] text-[#9A3C2D]" : "bg-[#DDEEDB] text-[#1E6B43]"}`}>{notice}</p>}
          </form>
        )}
      </section>
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
            <button type="button" onClick={handleOpenLine} className="mt-3 inline-flex rounded-full bg-[#06C755] px-5 py-2 text-sm font-semibold text-white">立即加入 LINE</button>
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
