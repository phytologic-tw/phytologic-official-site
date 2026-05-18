import { isSupabaseConfigured, supabase, supabaseConfigMessage } from "./supabase";
import { getAllLocal, insertLocal, removeLocal, seedLocalIfEmpty, updateLocal } from "./adminStorage";

export const TABLE_LABELS = {
  partners: "合作夥伴",
  announcements: "最新消息",
  gallery_items: "精彩剪影",
  assessment_reports: "快篩結果",
  contact_submissions: "聯絡表單",
  profiles: "管理員",
};

const orderColumn = {
  announcements: "published_at",
  gallery_items: "published_at",
};

function normalizeRole(role) {
  return String(role || "").trim().toLowerCase();
}

export function isFallbackMode(adminSession) {
  return !isSupabaseConfigured || adminSession?.mode === "local";
}

export async function getAdminSession(sessionOverride = null) {
  seedLocalIfEmpty();
  if (!isSupabaseConfigured || !supabase) {
    return { mode: "local", isAdmin: false, user: null, message: supabaseConfigMessage };
  }

  const session = sessionOverride || (await supabase.auth.getSession()).data?.session || null;
  const { data: userData, error: userError } = await supabase.auth.getUser();
  const user = userData?.user || session?.user || null;
  if (userError && !user) return { mode: "supabase", isAdmin: false, user: null, message: userError.message };
  if (!user) return { mode: "supabase", isAdmin: false, user: null, message: "" };

  const { data, error } = await supabase.from("profiles").select("id, email, full_name, role").eq("id", user.id).maybeSingle();
  if (error) return { mode: "supabase", isAdmin: false, user, profile: null, message: `profiles 讀取失敗：${error.message}` };

  const role = normalizeRole(data?.role);
  if (!data) {
    return {
      mode: "supabase",
      isAdmin: false,
      user,
      profile: null,
      message: `找不到此登入者的 profile。請確認 profiles.id 等於 Auth user id：${user.id}`,
    };
  }

  return {
    mode: "supabase",
    isAdmin: role === "admin",
    user,
    profile: { ...data, role },
    message: role === "admin" ? "" : `此帳號尚未具備 admin 權限。目前 role：${data.role || "空白"}`,
  };
}

export async function signInAdmin(email, password) {
  if (!supabase) return getAdminSession();
  window.sessionStorage.removeItem("phytologic_admin_demo_unlocked");
  const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  if (error) throw error;
  return getAdminSession(data?.session || null);
}

export async function signOutAdmin() {
  if (supabase) await supabase.auth.signOut();
  window.sessionStorage.removeItem("phytologic_admin_demo_unlocked");
}

export function onAdminAuthChange(callback) {
  if (!supabase) return () => {};
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    setTimeout(() => callback(session), 0);
  });
  return () => data.subscription.unsubscribe();
}

export function unlockDemo(passcode) {
  const expected = import.meta.env.VITE_ADMIN_PASSCODE || "";
  if (!expected) throw new Error("尚未設定 VITE_ADMIN_PASSCODE，無法使用 demo fallback。");
  if (passcode !== expected) throw new Error("Demo 密碼不正確。");
  window.sessionStorage.setItem("phytologic_admin_demo_unlocked", "true");
  return { mode: "local", isAdmin: true, user: null, profile: { role: "demo" }, message: "Demo fallback" };
}

export function getDemoSession() {
  if (isSupabaseConfigured) return null;
  return window.sessionStorage.getItem("phytologic_admin_demo_unlocked") === "true"
    ? { mode: "local", isAdmin: true, user: null, profile: { role: "demo" }, message: "Demo fallback" }
    : null;
}

export async function listRecords(table, adminSession, options = {}) {
  if (isFallbackMode(adminSession)) {
    let items = getAllLocal(table);
    if (options.publicOnly) {
      const status = table === "partners" ? "approved" : "published";
      items = items.filter((item) => item.status === status);
    }
    return [...items].sort((a, b) => String(b.created_at || "").localeCompare(String(a.created_at || "")));
  }

  let query = supabase.from(table).select("*");
  if (options.publicOnly) {
    const status = table === "partners" ? "approved" : "published";
    query = query.eq("status", status);
  }
  const column = orderColumn[table] || "created_at";
  const { data, error } = await query.order(column, { ascending: false, nullsFirst: false }).limit(options.limit || 500);
  if (error) throw error;
  return data || [];
}

export async function createRecord(table, payload, adminSession) {
  if (isFallbackMode(adminSession)) return insertLocal(table, payload);
  const { data, error } = await supabase.from(table).insert(payload).select("*").single();
  if (error) throw error;
  return data;
}

export async function updateRecord(table, id, payload, adminSession) {
  if (isFallbackMode(adminSession)) return updateLocal(table, id, payload);
  const { data, error } = await supabase.from(table).update(payload).eq("id", id).select("*").single();
  if (error) throw error;
  return data;
}

export async function deleteRecord(table, id, adminSession) {
  if (isFallbackMode(adminSession)) return removeLocal(table, id);
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw error;
}

export async function uploadAdminFile(bucket, file, adminSession) {
  if (!file) return "";
  if (isFallbackMode(adminSession)) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = `${Date.now()}-${safeName}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw error;
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

export async function submitPublicRecord(table, payload) {
  const fallback = () => insertLocal(table, payload);
  if (!supabase) return fallback();
  const { error } = await supabase.from(table).insert(payload);
  if (error) {
    console.warn(`Supabase ${table} insert failed; stored in local fallback.`, error.message);
    return fallback();
  }
  return payload;
}

export async function listPublicRecords(table, options = {}) {
  return listRecords(table, null, { ...options, publicOnly: true });
}
