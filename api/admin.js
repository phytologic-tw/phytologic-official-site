import { createClient } from "@supabase/supabase-js";

const allowedTables = new Set(["partners", "announcements", "gallery_items"]);

function getAdminClient() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) return null;
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function requireAdmin(req, res) {
  const expected = process.env.ADMIN_PASSCODE || process.env.VITE_ADMIN_PASSCODE;
  const provided = req.headers["x-admin-passcode"];
  if (!expected) {
    res.status(500).json({ error: "Missing ADMIN_PASSCODE or VITE_ADMIN_PASSCODE on server." });
    return false;
  }
  if (!provided || provided !== expected) {
    res.status(401).json({ error: "Invalid admin passcode." });
    return false;
  }
  return true;
}

function sanitizeTable(table) {
  if (!allowedTables.has(table)) throw new Error("Unsupported table.");
  return table;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!requireAdmin(req, res)) return;

  const supabase = getAdminClient();
  if (!supabase) return res.status(500).json({ error: "Missing Supabase server configuration." });

  const { action, table, id, payload, bucket, fileName, contentType, base64 } = req.body || {};

  try {
    if (action === "list") {
      const target = sanitizeTable(table);
      const order = target === "partners" ? "created_at" : "created_at";
      const { data, error } = await supabase.from(target).select("*").order(order, { ascending: false, nullsFirst: false });
      if (error) throw error;
      return res.status(200).json({ data });
    }

    if (action === "insert") {
      const target = sanitizeTable(table);
      const { data, error } = await supabase.from(target).insert(payload).select("*").single();
      if (error) throw error;
      return res.status(200).json({ data });
    }

    if (action === "update") {
      const target = sanitizeTable(table);
      const { data, error } = await supabase.from(target).update(payload).eq("id", id).select("*").single();
      if (error) throw error;
      return res.status(200).json({ data });
    }

    if (action === "delete") {
      const target = sanitizeTable(table);
      const { error } = await supabase.from(target).delete().eq("id", id);
      if (error) throw error;
      return res.status(200).json({ data: { id } });
    }

    if (action === "upload") {
      if (bucket !== "gallery" && bucket !== "announcements") throw new Error("Unsupported bucket.");
      if (!fileName || !contentType || !base64) throw new Error("Missing upload payload.");
      const fileBuffer = Buffer.from(base64, "base64");
      const { error } = await supabase.storage.from(bucket).upload(fileName, fileBuffer, {
        contentType,
        upsert: true,
      });
      if (error) throw error;
      const publicUrl = supabase.storage.from(bucket).getPublicUrl(fileName).data.publicUrl;
      return res.status(200).json({ data: { publicUrl } });
    }

    return res.status(400).json({ error: "Unsupported action." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
