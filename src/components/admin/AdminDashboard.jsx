import React, { useEffect, useState } from "react";
import {
  Activity,
  Archive,
  BarChart3,
  Check,
  Download,
  Eye,
  Image as ImageIcon,
  LayoutDashboard,
  Lock,
  Mail,
  Newspaper,
  Pencil,
  Pin,
  Plus,
  Search,
  Settings,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";
import {
  createRecord,
  deleteRecord,
  getAdminSession,
  getDemoSession,
  isFallbackMode,
  listRecords,
  onAdminAuthChange,
  signInAdmin,
  signOutAdmin,
  unlockDemo,
  updateRecord,
  uploadAdminFile,
} from "../../lib/adminData";
import { ADMIN_TABLES } from "../../lib/adminSeed";
import { clearLocal, downloadText, rowsToCSV } from "../../lib/adminStorage";

const logo = "/logo.png";
const inputClass = "w-full rounded-lg border border-[#E2D5B5] bg-white px-4 py-3 text-sm text-brand-dark outline-none focus:border-brand-gold-deep";
const buttonClass = "inline-flex items-center justify-center gap-2 rounded-full bg-brand-dark px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1E6B43] disabled:cursor-not-allowed disabled:bg-[#A9B6AE]";
const ghostClass = "inline-flex items-center justify-center gap-2 rounded-full border border-brand-border-gold bg-white px-4 py-2.5 text-sm font-semibold text-brand-dark transition hover:border-brand-gold-deep hover:bg-brand-surface";
const dangerClass = "inline-flex items-center justify-center gap-2 rounded-full bg-brand-error px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#7C2D22]";

const nav = [
  { label: "Dashboard", title: "總覽儀表板", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "合作夥伴", title: "合作夥伴管理", path: "/admin/partners", icon: Users },
  { label: "最新消息", title: "最新消息管理", path: "/admin/news", icon: Newspaper },
  { label: "精彩剪影", title: "精彩剪影管理", path: "/admin/gallery", icon: ImageIcon },
  { label: "快篩結果", title: "快篩結果查閱", path: "/admin/assessments", icon: Activity },
  { label: "聯絡表單", title: "聯絡表單管理", path: "/admin/contact", icon: Mail },
  { label: "系統設定", title: "系統設定", path: "/admin/settings", icon: Settings },
];

const blankNews = { title: "", category: "品牌活動", summary: "", content: "", cover_image_url: "", status: "draft", is_pinned: false };
const blankGallery = { title: "", type: "photo", category: "活動現場", media_url: "", thumbnail_url: "", description: "", status: "draft" };

function formatDate(value) {
  return value ? new Date(value).toLocaleString("zh-TW", { dateStyle: "short", timeStyle: "short" }) : "-";
}

function matches(item, query, keys) {
  if (!query.trim()) return true;
  const q = query.trim().toLowerCase();
  return keys.some((key) => String(item[key] || "").toLowerCase().includes(q));
}

function exportJSON(table, rows) {
  downloadText(`${table}_${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(rows, null, 2));
}

function exportCSV(table, rows) {
  downloadText(`${table}_${new Date().toISOString().slice(0, 10)}.csv`, rowsToCSV(rows), "text/csv;charset=utf-8");
}

function Notice({ type = "info", children }) {
  const tone = type === "error" ? "border-brand-error-border bg-brand-error-bg text-brand-error" : "border-brand-border-warm bg-white/75 text-brand-mid";
  return <div className={`rounded-lg border p-4 text-sm ${tone}`}>{children}</div>;
}

function StatusBadge({ status }) {
  const tones = {
    pending: "bg-[#F8E6AD] text-[#7B6229]",
    approved: "bg-[#DDEEDB] text-[#1E6B43]",
    rejected: "bg-[#FCEBEB] text-[#A32D2D]",
    published: "bg-[#DDEEDB] text-[#1E6B43]",
    draft: "bg-[#F0EDE5] text-[#6F6B5B]",
    archived: "bg-[#E9E3D3] text-[#5F5641]",
    unread: "bg-[#E7F0FB] text-[#255C90]",
    read: "bg-[#F0EDE5] text-[#6F6B5B]",
  };
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${tones[status] || tones.draft}`}>{status || "-"}</span>;
}

function LevelBadge({ level }) {
  const tones = {
    狀態穩定: "bg-[#DDEEDB] text-[#1E6B43]",
    輕度失衡: "bg-[#F8E6AD] text-[#7B6229]",
    中度警訊: "bg-[#FAEEDA] text-[#854F0B]",
    高度警訊: "bg-[#FCEBEB] text-[#A32D2D]",
  };
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${tones[level] || tones["輕度失衡"]}`}>{level || "-"}</span>;
}

function Modal({ open, onClose, title, children, width = "max-w-2xl" }) {
  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-dark/55 px-4 backdrop-blur-sm" onClick={onClose}>
      <section className={`max-h-[86vh] w-full overflow-hidden rounded-2xl border border-brand-border-warm bg-brand-bg shadow-2xl ${width}`} onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-brand-border-warm bg-white px-6 py-4">
          <h2 className="text-xl font-semibold text-brand-dark">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-brand-surface-2"><X className="h-5 w-5" /></button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-6">{children}</div>
      </section>
    </div>
  );
}

function Field({ label, children }) {
  return <label className="block"><span className="mb-2 block text-sm font-semibold text-[#6F5D35]">{label}</span>{children}</label>;
}

function ImageUpload({ label, value, onChange, bucket, session }) {
  const [busy, setBusy] = useState(false);
  async function select(file) {
    if (!file) return;
    setBusy(true);
    try {
      onChange(await uploadAdminFile(bucket, file, session));
    } catch (error) {
      window.alert(`上傳失敗：${error.message}`);
    }
    setBusy(false);
  }
  return (
    <Field label={label}>
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-brand-border-gold bg-brand-surface px-4 py-5 text-sm text-brand-mid">
        <Upload className="h-4 w-4" /> {busy ? "上傳中..." : "選擇圖片"}
        <input className="hidden" type="file" accept="image/*" onChange={(event) => select(event.target.files?.[0])} />
      </label>
      {value && <img src={value} alt="" className="mt-3 aspect-video w-full rounded-lg border border-brand-border-warm object-cover" />}
    </Field>
  );
}

function RichEditor({ value, onChange }) {
  const add = (left, right = "") => onChange(`${value}${left}${right}`);
  return (
    <div>
      <div className="mb-2 flex gap-2">
        <button type="button" className={ghostClass} onClick={() => add("**粗體**")}>B</button>
        <button type="button" className={ghostClass} onClick={() => add("*斜體*")}>I</button>
        <button type="button" className={ghostClass} onClick={() => add("\n")}>換行</button>
        <button type="button" className={ghostClass} onClick={() => onChange("")}>清除</button>
      </div>
      <textarea className={inputClass} rows="6" value={value} onChange={(event) => onChange(event.target.value)} />
      <p className="mt-2 text-xs text-brand-gold-deep">{value.length} 字</p>
    </div>
  );
}

function AdminTable({ columns, data, actions, emptyText = "目前沒有資料。" }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-brand-border-warm bg-white/85">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-brand-border-warm bg-brand-surface text-[#6F5D35]">
          <tr>{columns.map((column) => <th key={column.key} className="px-4 py-3 font-semibold">{column.label}</th>)}{actions && <th className="px-4 py-3 font-semibold">操作</th>}</tr>
        </thead>
        <tbody>
          {data.length === 0 && <tr><td colSpan={columns.length + 1} className="px-4 py-10 text-center text-brand-gold-deep">{emptyText}</td></tr>}
          {data.map((row) => (
            <tr key={row.id} className="border-b border-[#F0EDE5] align-top hover:bg-brand-surface">
              {columns.map((column) => <td key={column.key} className="px-4 py-3 text-brand-mid">{column.render ? column.render(row[column.key], row) : row[column.key] || "-"}</td>)}
              {actions && <td className="px-4 py-3"><div className="flex flex-wrap gap-2">{actions(row)}</div></td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function useAdminRecords(table, session) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const refresh = async () => {
    if (!session?.isAdmin) return;
    setLoading(true);
    setError("");
    try {
      setItems(await listRecords(table, session, { limit: table === "assessment_reports" ? 500 : 1000 }));
    } catch (requestError) {
      setError(requestError.message);
    }
    setLoading(false);
  };
  useEffect(() => { refresh(); }, [table, session?.mode, session?.isAdmin]);
  return { items, loading, error, refresh, setItems };
}

function Toolbar({ search, setSearch, onExport, children }) {
  return (
    <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-gold-deep" />
        <input value={search} onChange={(event) => setSearch(event.target.value)} className={`${inputClass} pl-10`} placeholder="搜尋..." />
      </div>
      <div className="flex flex-wrap gap-2">{children}<button type="button" className={ghostClass} onClick={onExport}><Download className="h-4 w-4" />匯出</button></div>
    </div>
  );
}

function Login({ onReady, go }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const next = await signInAdmin(email, password);
      if (!next.isAdmin) throw new Error(next.message || "登入成功，但此帳號不是 admin。");
      onReady(next);
      go("/admin/dashboard");
    } catch (requestError) {
      setError(requestError.message);
    }
    setBusy(false);
  }

  function demo() {
    try {
      onReady(unlockDemo(passcode));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-bg px-5 py-12">
      <section className="w-full max-w-md rounded-2xl border border-brand-border-warm bg-white p-8 shadow-xl">
        <img src={logo} alt="植本邏輯 Logo" className="h-14 w-14 object-contain" />
        <h1 className="mt-6 text-3xl font-semibold text-brand-dark">後台管理入口</h1>
        <p className="mt-2 text-sm leading-6 text-brand-mid">正式後台使用 Supabase Auth，並由 profiles.role=admin 控制權限。</p>
        <form onSubmit={submit} className="mt-7 grid gap-4">
          <Field label="Email"><input className={inputClass} type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></Field>
          <Field label="Password"><input className={inputClass} type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></Field>
          <button disabled={busy} className={buttonClass}><Lock className="h-4 w-4" />{busy ? "登入中..." : "登入後台"}</button>
        </form>
        <div className="mt-6 border-t border-brand-border-warm pt-5">
          <Field label="Demo fallback passcode"><input className={inputClass} type="password" value={passcode} onChange={(event) => setPasscode(event.target.value)} placeholder="只在 Supabase 尚未完成時使用" /></Field>
          <button type="button" className={`${ghostClass} mt-3 w-full`} onClick={demo}>使用 localStorage demo</button>
        </div>
        {error && <div className="mt-4"><Notice type="error">{error}</Notice></div>}
      </section>
    </main>
  );
}

function DashboardHome({ session, go }) {
  const [data, setData] = useState({ partners: [], announcements: [], gallery_items: [], assessment_reports: [] });
  useEffect(() => {
    Promise.all(["partners", "announcements", "gallery_items", "assessment_reports"].map((table) => listRecords(table, session)))
      .then(([partners, announcements, gallery_items, assessment_reports]) => setData({ partners, announcements, gallery_items, assessment_reports }))
      .catch(() => {});
  }, [session]);
  const pending = data.partners.filter((item) => item.status === "pending").slice(0, 5);
  const reports = data.assessment_reports.slice(0, 7);
  const stats = [
    ["合作夥伴申請", data.partners.filter((item) => item.status === "pending").length, Users],
    ["已發布公告", data.announcements.filter((item) => item.status === "published").length, Newspaper],
    ["精彩剪影", data.gallery_items.length, ImageIcon],
    ["快篩結果", data.assessment_reports.length, Activity],
  ];
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map(([label, value, Icon]) => <article key={label} className="rounded-lg border border-brand-border-warm bg-white/85 p-5"><Icon className="h-5 w-5 text-brand-gold-deep" /><div className="mt-4 text-3xl font-semibold">{value}</div><div className="mt-1 text-sm text-brand-mid">{label}</div></article>)}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-lg border border-brand-border-warm bg-white/85 p-5">
          <div className="flex items-center justify-between"><h2 className="text-xl font-semibold">待審合作夥伴</h2><button className={ghostClass} onClick={() => go("/admin/partners")}>查看全部</button></div>
          <div className="mt-4 grid gap-3">{pending.map((item) => <div key={item.id} className="rounded-lg bg-brand-surface p-4 text-sm"><b>{item.partner_name}</b><div className="mt-1 text-brand-mid">{item.city} · {item.category} · {formatDate(item.created_at)}</div></div>)}{pending.length === 0 && <p className="text-sm text-brand-gold-deep">目前沒有待審申請。</p>}</div>
        </section>
        <section className="rounded-lg border border-brand-border-warm bg-white/85 p-5">
          <h2 className="text-xl font-semibold">快篩結果近況</h2>
          <div className="mt-4 grid gap-3">{reports.map((item) => <div key={item.id} className="flex items-center justify-between rounded-lg bg-brand-surface p-4 text-sm"><LevelBadge level={item.inflammation_level} /><span>{item.total_score}/35 · {item.age_group || "-"}</span><span>{formatDate(item.created_at)}</span></div>)}{reports.length === 0 && <p className="text-sm text-brand-gold-deep">目前沒有快篩結果。</p>}</div>
        </section>
      </div>
    </div>
  );
}

function PartnersAdmin({ session }) {
  const { items, loading, error, refresh } = useAdminRecords("partners", session);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("pending");
  const [detail, setDetail] = useState(null);
  const filtered = items.filter((item) => item.status === tab && matches(item, query, ["partner_name", "city", "contact_name", "email"]));
  const patch = async (row, status) => { await updateRecord("partners", row.id, { status }, session); refresh(); };
  const remove = async (row) => { if (window.confirm("確定刪除這筆合作夥伴？")) { await deleteRecord("partners", row.id, session); refresh(); } };
  return (
    <section>
      <Toolbar search={query} setSearch={setQuery} onExport={() => exportJSON("partners", items)}>{["pending", "approved", "rejected"].map((s) => <button key={s} className={tab === s ? buttonClass : ghostClass} onClick={() => setTab(s)}>{s}</button>)}</Toolbar>
      {loading && <Notice>合作夥伴資料載入中...</Notice>}{error && <Notice type="error">{error}</Notice>}
      <AdminTable data={filtered} columns={[
        { key: "partner_name", label: "名稱" }, { key: "city", label: "城市" }, { key: "category", label: "類型" }, { key: "contact_name", label: "聯絡人" }, { key: "phone", label: "電話" }, { key: "email", label: "Email" }, { key: "status", label: "狀態", render: (v) => <StatusBadge status={v} /> }, { key: "created_at", label: "申請時間", render: formatDate },
      ]} actions={(row) => [<button key="view" className={ghostClass} onClick={() => setDetail(row)}><Eye className="h-4 w-4" />查看</button>, row.status !== "approved" && <button key="ok" className={ghostClass} onClick={() => patch(row, "approved")}><Check className="h-4 w-4" />Approve</button>, row.status !== "rejected" && <button key="no" className={ghostClass} onClick={() => patch(row, "rejected")}><X className="h-4 w-4" />Reject</button>, <button key="del" className={dangerClass} onClick={() => remove(row)}><Trash2 className="h-4 w-4" />刪除</button>]} />
      <Modal open={Boolean(detail)} onClose={() => setDetail(null)} title="合作夥伴詳細資料">{detail && <pre className="whitespace-pre-wrap rounded-lg bg-white p-4 text-sm leading-7 text-brand-mid">{JSON.stringify(detail, null, 2)}</pre>}</Modal>
    </section>
  );
}

function NewsAdmin({ session }) {
  const { items, loading, error, refresh } = useAdminRecords("announcements", session);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blankNews);
  const filtered = items.filter((item) => matches(item, query, ["title", "category", "summary"]));
  const save = async (event) => {
    event.preventDefault();
    const payload = { ...form, published_at: form.status === "published" ? form.published_at || new Date().toISOString() : null };
    editing ? await updateRecord("announcements", editing.id, payload, session) : await createRecord("announcements", payload, session);
    setEditing(null); setForm(blankNews); refresh();
  };
  const edit = (row) => { setEditing(row); setForm({ ...blankNews, ...row }); };
  const toggle = async (row, patch) => { await updateRecord("announcements", row.id, patch, session); refresh(); };
  const remove = async (row) => { if (window.confirm("確定刪除公告？")) { await deleteRecord("announcements", row.id, session); refresh(); } };
  return (
    <div className="grid gap-6 xl:grid-cols-[390px_1fr]">
      <form onSubmit={save} className="rounded-lg border border-brand-border-warm bg-white/85 p-5">
        <h2 className="text-xl font-semibold">{editing ? "編輯公告" : "新增公告"}</h2>
        <div className="mt-5 grid gap-4">
          <Field label="標題"><input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></Field>
          <Field label="分類"><select className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{["品牌活動", "產品公告", "展會消息", "系統開發"].map((x) => <option key={x}>{x}</option>)}</select></Field>
          <Field label="摘要"><textarea className={inputClass} rows="3" maxLength="100" value={form.summary || ""} onChange={(e) => setForm({ ...form, summary: e.target.value })} /></Field>
          <Field label="內容"><RichEditor value={form.content || ""} onChange={(content) => setForm({ ...form, content })} /></Field>
          <ImageUpload label="封面圖" value={form.cover_image_url} onChange={(cover_image_url) => setForm({ ...form, cover_image_url })} bucket="announcements" session={session} />
          <Field label="狀態"><select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option>draft</option><option>published</option><option>archived</option></select></Field>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(form.is_pinned)} onChange={(e) => setForm({ ...form, is_pinned: e.target.checked })} /> 置頂</label>
          <button className={buttonClass}><Plus className="h-4 w-4" />儲存</button>{editing && <button type="button" className={ghostClass} onClick={() => { setEditing(null); setForm(blankNews); }}>取消</button>}
        </div>
      </form>
      <section><Toolbar search={query} setSearch={setQuery} onExport={() => exportJSON("announcements", items)} />{loading && <Notice>公告載入中...</Notice>}{error && <Notice type="error">{error}</Notice>}<AdminTable data={filtered} columns={[{ key: "is_pinned", label: "置頂", render: (v) => v ? <Pin className="h-4 w-4 text-brand-gold-deep" /> : "-" }, { key: "title", label: "標題" }, { key: "category", label: "分類" }, { key: "status", label: "狀態", render: (v) => <StatusBadge status={v} /> }, { key: "published_at", label: "發布時間", render: formatDate }]} actions={(row) => [<button key="edit" className={ghostClass} onClick={() => edit(row)}><Pencil className="h-4 w-4" />編輯</button>, <button key="pub" className={ghostClass} onClick={() => toggle(row, { status: row.status === "published" ? "draft" : "published", published_at: row.status === "published" ? null : new Date().toISOString() })}>{row.status === "published" ? "取消發布" : "發布"}</button>, <button key="pin" className={ghostClass} onClick={() => toggle(row, { is_pinned: !row.is_pinned })}>{row.is_pinned ? "取消置頂" : "置頂"}</button>, <button key="del" className={dangerClass} onClick={() => remove(row)}><Trash2 className="h-4 w-4" />刪除</button>]} /></section>
    </div>
  );
}

function GalleryAdmin({ session }) {
  const { items, loading, error, refresh } = useAdminRecords("gallery_items", session);
  const [query, setQuery] = useState("");
  const [view, setView] = useState("grid");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blankGallery);
  const filtered = items.filter((item) => matches(item, query, ["title", "category", "description"]));
  const save = async (event) => {
    event.preventDefault();
    const payload = { ...form, published_at: form.status === "published" ? form.published_at || new Date().toISOString() : null };
    editing ? await updateRecord("gallery_items", editing.id, payload, session) : await createRecord("gallery_items", payload, session);
    setEditing(null); setForm(blankGallery); refresh();
  };
  const edit = (row) => { setEditing(row); setForm({ ...blankGallery, ...row }); };
  const remove = async (row) => { if (window.confirm("確定刪除剪影？")) { await deleteRecord("gallery_items", row.id, session); refresh(); } };
  return (
    <div className="grid gap-6 xl:grid-cols-[390px_1fr]">
      <form onSubmit={save} className="rounded-lg border border-brand-border-warm bg-white/85 p-5">
        <h2 className="text-xl font-semibold">{editing ? "編輯剪影" : "新增剪影"}</h2>
        <div className="mt-5 grid gap-4">
          <Field label="標題"><input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></Field>
          <Field label="類型"><select className={inputClass} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="photo">photo</option><option value="video">video</option></select></Field>
          <Field label="分類"><select className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{["活動現場", "消費者體驗", "合作夥伴", "產品製作", "品牌故事"].map((x) => <option key={x}>{x}</option>)}</select></Field>
          {form.type === "photo" ? <ImageUpload label="媒體圖片" value={form.media_url} onChange={(media_url) => setForm({ ...form, media_url, thumbnail_url: media_url })} bucket="gallery" session={session} /> : <Field label="影片 URL"><input className={inputClass} value={form.media_url} onChange={(e) => setForm({ ...form, media_url: e.target.value })} required /></Field>}
          <ImageUpload label="縮圖" value={form.thumbnail_url} onChange={(thumbnail_url) => setForm({ ...form, thumbnail_url })} bucket="gallery" session={session} />
          <Field label="說明"><textarea className={inputClass} rows="4" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
          <Field label="狀態"><select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option>draft</option><option>published</option></select></Field>
          <button className={buttonClass}><Plus className="h-4 w-4" />儲存</button>{editing && <button type="button" className={ghostClass} onClick={() => { setEditing(null); setForm(blankGallery); }}>取消</button>}
        </div>
      </form>
      <section><Toolbar search={query} setSearch={setQuery} onExport={() => exportJSON("gallery_items", items)}><button className={view === "grid" ? buttonClass : ghostClass} onClick={() => setView("grid")}>卡片</button><button className={view === "list" ? buttonClass : ghostClass} onClick={() => setView("list")}>列表</button></Toolbar>{loading && <Notice>剪影載入中...</Notice>}{error && <Notice type="error">{error}</Notice>}{view === "list" ? <AdminTable data={filtered} columns={[{ key: "title", label: "標題" }, { key: "type", label: "類型" }, { key: "category", label: "分類" }, { key: "status", label: "狀態", render: (v) => <StatusBadge status={v} /> }]} actions={(row) => [<button key="edit" className={ghostClass} onClick={() => edit(row)}>編輯</button>, <button key="del" className={dangerClass} onClick={() => remove(row)}>刪除</button>]} /> : <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">{filtered.map((row) => <article key={row.id} className="rounded-lg border border-brand-border-warm bg-white/85 p-4"><img src={row.thumbnail_url || row.media_url || logo} alt="" className="aspect-[4/3] w-full rounded-lg object-cover" /><div className="mt-4 flex items-start justify-between gap-3"><div><h3 className="font-semibold">{row.title}</h3><p className="mt-1 text-sm text-brand-gold-deep">{row.category}</p></div><StatusBadge status={row.status} /></div><div className="mt-4 flex gap-2"><button className={ghostClass} onClick={() => edit(row)}>編輯</button><button className={dangerClass} onClick={() => remove(row)}>刪除</button></div></article>)}</div>}</section>
    </div>
  );
}

function AssessmentsAdmin({ session }) {
  const { items, loading, error, refresh } = useAdminRecords("assessment_reports", session);
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("");
  const [detail, setDetail] = useState(null);
  const filtered = items.filter((item) => (!level || item.inflammation_level === level) && matches(item, query, ["age_group", "gender", "inflammation_level"]));
  const remove = async (row) => { if (window.confirm("確定刪除這筆快篩結果？")) { await deleteRecord("assessment_reports", row.id, session); refresh(); } };
  const distribution = ["狀態穩定", "輕度失衡", "中度警訊", "高度警訊"].map((x) => ({ label: x, count: items.filter((item) => item.inflammation_level === x).length }));
  return (
    <section>
      <div className="mb-5 grid gap-3 rounded-lg border border-brand-border-warm bg-white/85 p-4 md:grid-cols-4">{distribution.map((item) => <div key={item.label}><LevelBadge level={item.label} /><div className="mt-2 h-2 rounded-full bg-[#F0EDE5]"><div className="h-2 rounded-full bg-brand-gold-deep" style={{ width: `${items.length ? (item.count / items.length) * 100 : 0}%` }} /></div><div className="mt-1 text-sm text-brand-mid">{item.count} 筆</div></div>)}</div>
      <Toolbar search={query} setSearch={setQuery} onExport={() => exportCSV("assessment_reports", filtered)}><select className={inputClass} value={level} onChange={(e) => setLevel(e.target.value)}><option value="">全部等級</option>{distribution.map((x) => <option key={x.label}>{x.label}</option>)}</select></Toolbar>
      {loading && <Notice>快篩結果載入中...</Notice>}{error && <Notice type="error">{error}</Notice>}
      <AdminTable data={filtered} columns={[{ key: "inflammation_level", label: "狀態等級", render: (v) => <LevelBadge level={v} /> }, { key: "total_score", label: "總分", render: (v) => `${v ?? "-"}/35` }, { key: "gender", label: "性別" }, { key: "age_group", label: "年齡區間" }, { key: "bmi", label: "BMI" }, { key: "recommended_products", label: "推薦飲品", render: (v) => Array.isArray(v) ? v[0] : "-" }, { key: "has_joined_line", label: "加入 LINE", render: (v) => v ? "已加入" : "未加入" }, { key: "created_at", label: "評估時間", render: formatDate }]} actions={(row) => [<button key="view" className={ghostClass} onClick={() => setDetail(row)}><Eye className="h-4 w-4" />查看報告</button>, <button key="del" className={dangerClass} onClick={() => remove(row)}><Trash2 className="h-4 w-4" />刪除</button>]} />
      <Modal open={Boolean(detail)} onClose={() => setDetail(null)} title="快篩詳細報告" width="max-w-4xl">{detail && <pre className="whitespace-pre-wrap rounded-lg bg-white p-4 text-sm leading-7 text-brand-mid">{JSON.stringify(detail, null, 2)}</pre>}</Modal>
    </section>
  );
}

function ContactAdmin({ session }) {
  const { items, loading, error, refresh } = useAdminRecords("contact_submissions", session);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("unread");
  const [detail, setDetail] = useState(null);
  const filtered = items.filter((item) => (tab === "all" || item.status === tab) && matches(item, query, ["name", "email", "phone", "type", "message"]));
  const patch = async (row, status) => { await updateRecord("contact_submissions", row.id, { status }, session); refresh(); };
  const remove = async (row) => { if (window.confirm("確定刪除聯絡資料？")) { await deleteRecord("contact_submissions", row.id, session); refresh(); } };
  return (
    <section>
      <Toolbar search={query} setSearch={setQuery} onExport={() => exportCSV("contact_submissions", filtered)}>{["unread", "read", "archived", "all"].map((s) => <button key={s} className={tab === s ? buttonClass : ghostClass} onClick={() => setTab(s)}>{s}</button>)}</Toolbar>
      {loading && <Notice>聯絡表單載入中...</Notice>}{error && <Notice type="error">{error}</Notice>}
      <AdminTable data={filtered} columns={[{ key: "status", label: "狀態", render: (v) => <StatusBadge status={v} /> }, { key: "name", label: "姓名" }, { key: "phone", label: "電話" }, { key: "email", label: "Email" }, { key: "type", label: "合作類型" }, { key: "message", label: "摘要", render: (v) => String(v || "").slice(0, 40) }, { key: "created_at", label: "提交時間", render: formatDate }]} actions={(row) => [<button key="view" className={ghostClass} onClick={() => setDetail(row)}>查看</button>, <button key="read" className={ghostClass} onClick={() => patch(row, "read")}>已讀</button>, <button key="arch" className={ghostClass} onClick={() => patch(row, "archived")}><Archive className="h-4 w-4" />封存</button>, <button key="del" className={dangerClass} onClick={() => remove(row)}>刪除</button>]} />
      <Modal open={Boolean(detail)} onClose={() => setDetail(null)} title="聯絡表單內容">{detail && <pre className="whitespace-pre-wrap rounded-lg bg-white p-4 text-sm leading-7 text-brand-mid">{JSON.stringify(detail, null, 2)}</pre>}</Modal>
    </section>
  );
}

function SettingsAdmin({ session }) {
  const fallback = isFallbackMode(session);
  const [settings, setSettings] = useState(() => JSON.parse(window.localStorage.getItem("phytologic_admin_settings") || "{}"));
  function save(next) { setSettings(next); window.localStorage.setItem("phytologic_admin_settings", JSON.stringify(next)); }
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-lg border border-brand-border-warm bg-white/85 p-5">
        <h2 className="text-xl font-semibold">品牌資訊</h2>
        <div className="mt-5 grid gap-4">
          <Field label="品牌名稱"><input className={inputClass} value={settings.brandName || "植本邏輯 PHYTOLOGIC"} onChange={(e) => save({ ...settings, brandName: e.target.value })} /></Field>
          <Field label="官方 LINE URL"><input className={inputClass} value={settings.lineUrl || ""} onChange={(e) => save({ ...settings, lineUrl: e.target.value })} placeholder="可覆蓋環境變數設定" /></Field>
          <Field label="電話"><input className={inputClass} value={settings.phone || "07-223-2301"} onChange={(e) => save({ ...settings, phone: e.target.value })} /></Field>
          <Field label="Email"><input className={inputClass} value={settings.email || "bryan@phytologic.tw"} onChange={(e) => save({ ...settings, email: e.target.value })} /></Field>
        </div>
      </section>
      <section className="rounded-lg border border-brand-border-warm bg-white/85 p-5">
        <h2 className="text-xl font-semibold">後台安全</h2>
        <div className="mt-4 grid gap-3 text-sm leading-7 text-brand-mid">
          <p>目前認證方式：{fallback ? "localStorage demo fallback" : "Supabase Auth + profiles.role=admin"}</p>
          <p>Supabase service role key 不會放在前端。正式 CRUD 由 RLS 與 admin profile 控制。</p>
          <p>VITE_ADMIN_PASSCODE：{import.meta.env.VITE_ADMIN_PASSCODE ? "已設定，僅供 demo fallback" : "未設定"}</p>
        </div>
      </section>
      <section className="rounded-lg border border-brand-border-warm bg-white/85 p-5 lg:col-span-2">
        <h2 className="text-xl font-semibold">資料管理</h2>
        <div className="mt-5 flex flex-wrap gap-2">{ADMIN_TABLES.filter((x) => x !== "profiles").map((table) => <button key={table} className={ghostClass} onClick={async () => exportJSON(table, await listRecords(table, session))}><Download className="h-4 w-4" />匯出 {table}</button>)}</div>
        <div className="mt-5 flex flex-wrap gap-2">{ADMIN_TABLES.filter((x) => x !== "profiles").map((table) => <button key={table} className={dangerClass} onClick={() => window.confirm(`確定清除 local fallback 的 ${table}？`) && clearLocal(table)}><Trash2 className="h-4 w-4" />清除 {table}</button>)}</div>
      </section>
    </div>
  );
}

function Shell({ route, go, session, setSession }) {
  const currentPath = route === "/admin" ? "/admin/dashboard" : route;
  const current = nav.find((item) => item.path === currentPath) || nav[0];
  async function lock() {
    await signOutAdmin();
    setSession(null);
    go("/admin");
  }
  const page = currentPath === "/admin/partners" ? <PartnersAdmin session={session} />
    : currentPath === "/admin/news" ? <NewsAdmin session={session} />
    : currentPath === "/admin/gallery" ? <GalleryAdmin session={session} />
    : currentPath === "/admin/assessments" ? <AssessmentsAdmin session={session} />
    : currentPath === "/admin/contact" ? <ContactAdmin session={session} />
    : currentPath === "/admin/settings" ? <SettingsAdmin session={session} />
    : <DashboardHome session={session} go={go} />;

  return (
    <div className="min-h-screen bg-brand-bg text-brand-dark lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-brand-border-warm bg-brand-dark p-5 text-white lg:min-h-screen lg:border-b-0">
        <div className="flex items-center gap-3"><img src={logo} alt="" className="h-10 w-10 rounded-lg bg-white object-contain" /><div><div className="font-semibold">植本邏輯</div><div className="text-xs tracking-brand-wider text-white/55">ADMIN</div></div></div>
        <nav className="mt-8 grid gap-2">{nav.map((item) => { const Icon = item.icon; const active = current.path === item.path; return <button key={item.path} type="button" onClick={() => go(item.path)} className={`flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm transition ${active ? "bg-white text-brand-dark" : "text-white/78 hover:bg-white/10"}`}><Icon className="h-4 w-4" />{item.label}</button>; })}</nav>
      </aside>
      <main className="min-w-0 p-5 md:p-8">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div><p className="text-sm uppercase tracking-brand-wider text-brand-gold-deep">CMS Admin</p><h1 className="mt-2 text-3xl font-semibold">{current.title}</h1><p className="mt-2 text-sm text-brand-mid">{isFallbackMode(session) ? "目前使用 localStorage demo fallback。" : `已登入：${session.profile?.email || session.user?.email || "admin"}`}</p></div>
          <button className={ghostClass} onClick={lock}><Lock className="h-4 w-4" />鎖定後台</button>
        </header>
        {page}
      </main>
    </div>
  );
}

export default function AdminDashboard({ route, go }) {
  const [session, setSession] = useState(() => getDemoSession());
  const [checking, setChecking] = useState(!getDemoSession());
  useEffect(() => {
    if (session) return;
    getAdminSession().then((next) => {
      setSession(next.isAdmin ? next : null);
      setChecking(false);
    });
  }, [session]);
  useEffect(() => onAdminAuthChange(async (authSession) => {
    if (!authSession) {
      setSession(null);
      setChecking(false);
      return;
    }
    const next = await getAdminSession(authSession);
    setSession(next.isAdmin ? next : null);
    setChecking(false);
  }), []);
  if (checking) return <main className="flex min-h-screen items-center justify-center bg-brand-bg text-brand-mid">後台權限確認中...</main>;
  if (!session?.isAdmin) return <Login onReady={setSession} go={go} />;
  return <Shell route={route} go={go} session={session} setSession={setSession} />;
}
