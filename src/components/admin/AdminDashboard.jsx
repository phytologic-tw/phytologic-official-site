import React, { useEffect, useMemo, useState } from "react";

const adminPasscode = import.meta.env.VITE_ADMIN_PASSCODE || "";

const emptyAnnouncement = {
  category: "品牌活動",
  title: "",
  summary: "",
  content: "",
  cover_image_url: "",
  status: "draft",
  is_pinned: false,
};

const emptyGalleryItem = {
  title: "",
  type: "image",
  category: "活動現場",
  media_url: "",
  thumbnail_url: "",
  description: "",
  status: "draft",
};

const inputClass = "w-full rounded-2xl border border-[#E2D5B5] bg-white px-4 py-3 text-[#123828] outline-none focus:border-[#B89B5E]";
const buttonClass = "rounded-full bg-[#123828] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1E6B43] disabled:cursor-not-allowed disabled:bg-[#9FAEA5]";
const ghostButtonClass = "rounded-full border border-[#B89B5E] bg-white/70 px-5 py-3 text-sm font-semibold text-[#123828] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60";

function getStoredPasscode() {
  return window.sessionStorage.getItem("phytologic_admin_passcode") || "";
}

async function adminRequest(body) {
  const response = await fetch("/api/admin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-passcode": getStoredPasscode(),
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error || "Admin request failed");
  return data.data;
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function AdminNotice({ type = "info", children }) {
  const tone = type === "error" ? "border-[#E8B4A8] bg-[#FFF7F5] text-[#9A3C2D]" : "border-[#D8C99C] bg-white/75 text-[#49675A]";
  return <div className={`rounded-2xl border p-4 text-sm ${tone}`}>{children}</div>;
}

function AdminField({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[#8B7A4C]">{label}</span>
      {children}
    </label>
  );
}

function useAdminTable(table) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminRequest({ action: "list", table });
      setItems(data || []);
    } catch (requestError) {
      setError(requestError.message);
      setItems([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, [table]);

  return { items, loading, error, refresh };
}

function PasscodeGate({ onUnlock }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const submit = (event) => {
    event.preventDefault();
    if (!adminPasscode) {
      setError("尚未設定 VITE_ADMIN_PASSCODE。");
      return;
    }
    if (value !== adminPasscode) {
      setError("密碼不正確。");
      return;
    }
    window.sessionStorage.setItem("phytologic_admin_unlocked", "true");
    window.sessionStorage.setItem("phytologic_admin_passcode", value);
    onUnlock();
  };

  return (
    <main className="px-5 py-16 md:px-8">
      <div className="mx-auto max-w-xl rounded-2xl border border-[#E7DDBF] bg-white/80 p-7 shadow-sm">
        <p className="text-sm uppercase tracking-[0.3em] text-[#B89B5E]">Temporary Admin</p>
        <h1 className="mt-3 text-3xl font-semibold text-[#123828]">後台管理入口</h1>
        <p className="mt-4 leading-7 text-[#49675A]">目前使用臨時 passcode gate。後續會改為 Supabase Auth、LINE Login 與 RBAC。</p>
        <form onSubmit={submit} className="mt-7 space-y-4">
          <AdminField label="管理密碼">
            <input type="password" value={value} onChange={(event) => setValue(event.target.value)} className={inputClass} placeholder="輸入 VITE_ADMIN_PASSCODE" />
          </AdminField>
          <button className={buttonClass}>進入後台</button>
          {error && <AdminNotice type="error">{error}</AdminNotice>}
        </form>
      </div>
    </main>
  );
}

function AdminShell({ route, go, children }) {
  const tabs = [
    { path: "/admin/partners", label: "合作夥伴" },
    { path: "/admin/news", label: "公告" },
    { path: "/admin/gallery", label: "精彩剪影" },
    { path: "/admin/assessments", label: "評估報告" },
  ];
  return (
    <main className="px-5 py-10 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#B89B5E]">CMS Admin</p>
            <h1 className="mt-2 text-3xl font-semibold text-[#123828] md:text-4xl">植本邏輯後台</h1>
            <p className="mt-3 text-sm text-[#49675A]">臨時管理入口；service role 與 Claude key 都不進前端。</p>
          </div>
          <button type="button" onClick={() => { window.sessionStorage.removeItem("phytologic_admin_unlocked"); window.sessionStorage.removeItem("phytologic_admin_passcode"); window.location.assign("/admin"); }} className={ghostButtonClass}>鎖定後台</button>
        </div>
        <div className="mb-8 flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button key={tab.path} type="button" onClick={() => go(tab.path)} className={(route === tab.path || (route === "/admin" && tab.path === "/admin/partners")) ? buttonClass : ghostButtonClass}>{tab.label}</button>
          ))}
        </div>
        {children}
      </div>
    </main>
  );
}

function PartnersAdmin() {
  const { items, loading, error, refresh } = useAdminTable("partners");
  const [busyId, setBusyId] = useState("");
  const grouped = useMemo(() => ({
    pending: items.filter((item) => item.status === "pending"),
    approved: items.filter((item) => item.status === "approved"),
    rejected: items.filter((item) => item.status === "rejected"),
  }), [items]);

  const updateStatus = async (id, status) => {
    setBusyId(id);
    try {
      await adminRequest({ action: "update", table: "partners", id, payload: { status } });
      await refresh();
    } catch (requestError) {
      window.alert(`更新失敗：${requestError.message}`);
    }
    setBusyId("");
  };

  const remove = async (id) => {
    if (!window.confirm("確定刪除這筆資料？")) return;
    setBusyId(id);
    try {
      await adminRequest({ action: "delete", table: "partners", id });
      await refresh();
    } catch (requestError) {
      window.alert(`刪除失敗：${requestError.message}`);
    }
    setBusyId("");
  };

  if (loading) return <AdminNotice>合作夥伴資料載入中...</AdminNotice>;
  if (error) return <AdminNotice type="error">合作夥伴讀取失敗：{error}</AdminNotice>;

  return (
    <div className="grid gap-6">
      {["pending", "approved", "rejected"].map((status) => (
        <section key={status} className="rounded-2xl border border-[#E7DDBF] bg-white/75 p-5">
          <h2 className="text-2xl font-semibold capitalize text-[#123828]">{status}</h2>
          <div className="mt-5 grid gap-4">
            {grouped[status].length === 0 && <p className="text-sm text-[#7D8D7F]">目前沒有資料。</p>}
            {grouped[status].map((partner) => (
              <div key={partner.id} className="grid gap-4 rounded-2xl border border-[#E2D5B5] bg-[#FDFBF6] p-4 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="text-sm leading-7 text-[#49675A]">
                  <div className="text-lg font-semibold text-[#123828]">{partner.partner_name}</div>
                  <div>{partner.city} · {partner.created_at ? new Date(partner.created_at).toLocaleString("zh-TW") : ""}</div>
                  <div className="break-all">IG {partner.instagram_url || "-"} · FB {partner.facebook_url || "-"} · Web {partner.website_url || "-"}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {partner.status !== "approved" && <button disabled={busyId === partner.id} onClick={() => updateStatus(partner.id, "approved")} className={buttonClass}>Approve</button>}
                  {partner.status !== "rejected" && <button disabled={busyId === partner.id} onClick={() => updateStatus(partner.id, "rejected")} className={ghostButtonClass}>Reject</button>}
                  <button disabled={busyId === partner.id} onClick={() => remove(partner.id)} className="rounded-full bg-[#9A3C2D] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function AnnouncementsAdmin() {
  const { items, loading, error, refresh } = useAdminTable("announcements");
  const [form, setForm] = useState(emptyAnnouncement);
  const [editingId, setEditingId] = useState("");
  const [saving, setSaving] = useState(false);

  const edit = (item) => {
    setEditingId(item.id);
    setForm({
      category: item.category || "品牌活動",
      title: item.title || "",
      summary: item.summary || "",
      content: item.content || "",
      cover_image_url: item.cover_image_url || "",
      status: item.status || "draft",
      is_pinned: Boolean(item.is_pinned),
    });
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    const payload = { ...form, published_at: form.status === "published" ? new Date().toISOString() : null };
    try {
      await adminRequest(editingId ? { action: "update", table: "announcements", id: editingId, payload } : { action: "insert", table: "announcements", payload });
      setEditingId("");
      setForm(emptyAnnouncement);
      await refresh();
    } catch (requestError) {
      window.alert(`儲存失敗：${requestError.message}`);
    }
    setSaving(false);
  };

  const remove = async (id) => {
    if (!window.confirm("確定刪除公告？")) return;
    try {
      await adminRequest({ action: "delete", table: "announcements", id });
      await refresh();
    } catch (requestError) {
      window.alert(`刪除失敗：${requestError.message}`);
    }
  };

  const toggle = async (item, patch) => {
    try {
      await adminRequest({ action: "update", table: "announcements", id: item.id, payload: patch });
      await refresh();
    } catch (requestError) {
      window.alert(`更新失敗：${requestError.message}`);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <form onSubmit={save} className="rounded-2xl border border-[#E7DDBF] bg-white/80 p-5">
        <h2 className="text-2xl font-semibold">{editingId ? "編輯公告" : "新增公告"}</h2>
        <div className="mt-5 grid gap-4">
          <AdminField label="Category"><input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass} /></AdminField>
          <AdminField label="Title"><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} required /></AdminField>
          <AdminField label="Summary"><textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} className={inputClass} rows="3" /></AdminField>
          <AdminField label="Content"><textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className={inputClass} rows="5" /></AdminField>
          <AdminField label="Cover Image URL"><input value={form.cover_image_url} onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })} className={inputClass} /></AdminField>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Status"><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}><option>draft</option><option>published</option></select></AdminField>
            <label className="flex items-center gap-3 pt-8 text-sm text-[#49675A]"><input type="checkbox" checked={form.is_pinned} onChange={(e) => setForm({ ...form, is_pinned: e.target.checked })} /> 置頂</label>
          </div>
          <div className="flex flex-wrap gap-3">
            <button disabled={saving} className={buttonClass}>{saving ? "儲存中..." : "儲存"}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(""); setForm(emptyAnnouncement); }} className={ghostButtonClass}>取消</button>}
          </div>
        </div>
      </form>
      <section className="rounded-2xl border border-[#E7DDBF] bg-white/75 p-5">
        <h2 className="text-2xl font-semibold">公告列表</h2>
        {loading && <AdminNotice>公告載入中...</AdminNotice>}
        {error && <AdminNotice type="error">公告讀取失敗：{error}</AdminNotice>}
        <div className="mt-5 grid gap-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-[#E2D5B5] bg-[#FDFBF6] p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="text-sm text-[#8B7A4C]">{item.category} · {item.status} {item.is_pinned ? "· pinned" : ""}</div>
                  <h3 className="mt-1 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#49675A]">{item.summary}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => edit(item)} className={ghostButtonClass}>Edit</button>
                  <button onClick={() => toggle(item, { status: item.status === "published" ? "draft" : "published", published_at: item.status === "published" ? null : new Date().toISOString() })} className={ghostButtonClass}>{item.status === "published" ? "Unpublish" : "Publish"}</button>
                  <button onClick={() => toggle(item, { is_pinned: !item.is_pinned })} className={ghostButtonClass}>{item.is_pinned ? "Unpin" : "Pin"}</button>
                  <button onClick={() => remove(item.id)} className="rounded-full bg-[#9A3C2D] px-5 py-3 text-sm font-semibold text-white">Delete</button>
                </div>
              </div>
            </div>
          ))}
          {!loading && items.length === 0 && <p className="text-sm text-[#7D8D7F]">目前沒有公告。</p>}
        </div>
      </section>
    </div>
  );
}

function GalleryAdmin() {
  const { items, loading, error, refresh } = useAdminTable("gallery_items");
  const [form, setForm] = useState(emptyGalleryItem);
  const [editingId, setEditingId] = useState("");
  const [uploading, setUploading] = useState(false);

  const save = async (event) => {
    event.preventDefault();
    const payload = { ...form, type: form.type === "image" ? "photo" : "video", published_at: form.status === "published" ? new Date().toISOString() : null };
    try {
      await adminRequest(editingId ? { action: "update", table: "gallery_items", id: editingId, payload } : { action: "insert", table: "gallery_items", payload });
      setEditingId("");
      setForm(emptyGalleryItem);
      await refresh();
    } catch (requestError) {
      window.alert(`儲存失敗：${requestError.message}`);
    }
  };

  const upload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const folder = file.type.startsWith("video/") ? "videos" : "images";
      const path = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
      const base64 = await fileToBase64(file);
      const data = await adminRequest({ action: "upload", bucket: "gallery", fileName: path, contentType: file.type, base64 });
      setForm((prev) => ({ ...prev, media_url: data.publicUrl, thumbnail_url: file.type.startsWith("image/") ? data.publicUrl : prev.thumbnail_url, type: file.type.startsWith("video/") ? "video" : "image" }));
    } catch (requestError) {
      window.alert(`上傳失敗：${requestError.message}`);
    }
    setUploading(false);
  };

  const edit = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title || "",
      type: item.type === "photo" ? "image" : "video",
      category: item.category || "活動現場",
      media_url: item.media_url || "",
      thumbnail_url: item.thumbnail_url || "",
      description: item.description || "",
      status: item.status || "draft",
    });
  };

  const remove = async (id) => {
    if (!window.confirm("確定刪除剪影？")) return;
    try {
      await adminRequest({ action: "delete", table: "gallery_items", id });
      await refresh();
    } catch (requestError) {
      window.alert(`刪除失敗：${requestError.message}`);
    }
  };

  const togglePublish = async (item) => {
    const nextStatus = item.status === "published" ? "draft" : "published";
    try {
      await adminRequest({ action: "update", table: "gallery_items", id: item.id, payload: { status: nextStatus, published_at: nextStatus === "published" ? new Date().toISOString() : null } });
      await refresh();
    } catch (requestError) {
      window.alert(`更新失敗：${requestError.message}`);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <form onSubmit={save} className="rounded-2xl border border-[#E7DDBF] bg-white/80 p-5">
        <h2 className="text-2xl font-semibold">{editingId ? "編輯剪影" : "新增剪影"}</h2>
        <div className="mt-5 grid gap-4">
          <AdminField label="Upload"><input type="file" accept="image/*,video/mp4" onChange={(e) => upload(e.target.files?.[0])} className={inputClass} />{uploading && <p className="mt-2 text-sm text-[#8B7A4C]">上傳中...</p>}</AdminField>
          <AdminField label="Title"><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} required /></AdminField>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Type"><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={inputClass}><option value="image">image</option><option value="video">video</option></select></AdminField>
            <AdminField label="Status"><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}><option>draft</option><option>published</option></select></AdminField>
          </div>
          <AdminField label="Category"><input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass} /></AdminField>
          <AdminField label="Media URL"><input value={form.media_url} onChange={(e) => setForm({ ...form, media_url: e.target.value })} className={inputClass} required /></AdminField>
          <AdminField label="Thumbnail URL"><input value={form.thumbnail_url} onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })} className={inputClass} /></AdminField>
          <AdminField label="Description"><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} rows="4" /></AdminField>
          <div className="flex flex-wrap gap-3">
            <button className={buttonClass}>儲存</button>
            {editingId && <button type="button" onClick={() => { setEditingId(""); setForm(emptyGalleryItem); }} className={ghostButtonClass}>取消</button>}
          </div>
        </div>
      </form>
      <section className="rounded-2xl border border-[#E7DDBF] bg-white/75 p-5">
        <h2 className="text-2xl font-semibold">剪影列表</h2>
        {loading && <AdminNotice>剪影載入中...</AdminNotice>}
        {error && <AdminNotice type="error">剪影讀取失敗：{error}</AdminNotice>}
        <div className="mt-5 grid gap-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-[#E2D5B5] bg-[#FDFBF6] p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="text-sm text-[#8B7A4C]">{item.category} · {item.type} · {item.status}</div>
                  <h3 className="mt-1 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 break-all text-sm leading-6 text-[#49675A]">{item.media_url}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => edit(item)} className={ghostButtonClass}>Edit</button>
                  <button onClick={() => togglePublish(item)} className={ghostButtonClass}>{item.status === "published" ? "Unpublish" : "Publish"}</button>
                  <button onClick={() => remove(item.id)} className="rounded-full bg-[#9A3C2D] px-5 py-3 text-sm font-semibold text-white">Delete</button>
                </div>
              </div>
            </div>
          ))}
          {!loading && items.length === 0 && <p className="text-sm text-[#7D8D7F]">目前沒有剪影。</p>}
        </div>
      </section>
    </div>
  );
}

function AssessmentsAdmin() {
  const { items, loading, error } = useAdminTable("assessment_reports");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.trim().toLowerCase();
    return items.filter(
      (item) =>
        item.id?.toLowerCase().startsWith(q) ||
        item.id?.toLowerCase().includes(q)
    );
  }, [items, search]);

  return (
    <div className="grid gap-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#123828]">派森評估報告</h2>
          <p className="mt-1 text-sm text-[#8B7A4C]">顯示最新 50 筆，可依報告編號搜尋。此頁面唯讀，不提供刪除與修改。</p>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="輸入報告編號搜尋..."
          className={inputClass + " max-w-xs"}
        />
      </div>

      {loading && <AdminNotice>評估報告載入中...</AdminNotice>}
      {error && <AdminNotice type="error">評估報告讀取失敗：{error}</AdminNotice>}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-2xl border border-[#E7DDBF] bg-white/80">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E7DDBF] text-left text-[#8B7A4C]">
                <th className="px-5 py-4 font-semibold">報告編號</th>
                <th className="px-5 py-4 font-semibold">建立時間</th>
                <th className="px-5 py-4 font-semibold">年齡 / 性別</th>
                <th className="px-5 py-4 font-semibold">發炎等級</th>
                <th className="px-5 py-4 font-semibold">總分</th>
                <th className="px-5 py-4 font-semibold">推薦飲品</th>
                <th className="px-5 py-4 font-semibold">已加入 LINE</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-[#8B7A4C]">
                    {search ? "找不到符合的報告。" : "目前沒有評估報告。"}
                  </td>
                </tr>
              )}
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-[#F0EDE5] transition hover:bg-[#FDFBF6]">
                  <td className="px-5 py-4">
                    <span className="font-mono font-semibold text-[#123828]">
                      {item.id?.slice(0, 8).toUpperCase()}
                    </span>
                    <span className="ml-2 text-xs text-[#8B7A4C]">{item.id?.slice(8, 16)}</span>
                  </td>
                  <td className="px-5 py-4 text-[#49675A]">
                    {item.created_at
                      ? new Date(item.created_at).toLocaleString("zh-TW", {
                          month: "2-digit", day: "2-digit",
                          hour: "2-digit", minute: "2-digit",
                        })
                      : "—"}
                  </td>
                  <td className="px-5 py-4 text-[#49675A]">
                    {item.age_group || "—"}／{item.gender || "—"}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      item.inflammation_level === "健康綠燈" ? "bg-[#DDEEDB] text-[#1E6B43]"
                      : item.inflammation_level === "輕度發炎" ? "bg-[#F8E6AD] text-[#7B6229]"
                      : item.inflammation_level === "中度發炎" ? "bg-[#F5DDE2] text-[#AA3F57]"
                      : "bg-[#E7DDF6] text-[#65439A]"
                    }`}>
                      {item.inflammation_level || "—"}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-semibold text-[#123828]">{item.total_score ?? "—"}</td>
                  <td className="px-5 py-4 text-[#49675A]">
                    {Array.isArray(item.recommended_products)
                      ? item.recommended_products.join("、")
                      : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      item.has_joined_line ? "bg-[#DDEEDB] text-[#1E6B43]" : "bg-[#F0EDE5] text-[#8B7A4C]"
                    }`}>
                      {item.has_joined_line ? "已加入" : "未加入"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard({ route, go }) {
  const [unlocked, setUnlocked] = useState(() => window.sessionStorage.getItem("phytologic_admin_unlocked") === "true");

  if (!unlocked) return <PasscodeGate onUnlock={() => setUnlocked(true)} />;

  const page = route === "/admin/news"
    ? <AnnouncementsAdmin />
    : route === "/admin/gallery"
      ? <GalleryAdmin />
      : route === "/admin/assessments"
        ? <AssessmentsAdmin />
        : <PartnersAdmin />;

  return <AdminShell route={route === "/admin" ? "/admin/partners" : route} go={go}>{page}</AdminShell>;
}
