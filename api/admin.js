import { requireAdmin } from "../src/server/admin-utils.js";

const allowedTables = new Set(["partners", "announcements", "gallery_items", "assessment_reports", "contact_submissions"]);

function sanitizeTable(table) {
  if (!allowedTables.has(table)) throw new Error("Unsupported table.");
  return table;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const admin = await requireAdmin(req, res);
  if (!admin) return;
  const supabase = admin.supabase;

  const { action, table, id, payload, bucket, fileName, contentType, base64 } = req.body || {};

  try {
    if (action === "session") {
      return res.status(200).json({ user: admin.user, profile: admin.profile });
    }

    if (action === "list") {
      const target = sanitizeTable(table);
      const { data, error } = await supabase
        .from(target)
        .select("*")
        .order("created_at", { ascending: false, nullsFirst: false })
        .limit(target === "assessment_reports" ? 50 : 500);
      if (error) throw error;
      return res.status(200).json({ data });
    }

    if (action === "insert") {
      const target = sanitizeTable(table);
      if (target === "assessment_reports") {
        return res.status(403).json({ error: "assessment_reports 不允許從後台新增。" });
      }
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
