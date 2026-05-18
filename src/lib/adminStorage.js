import { ADMIN_TABLES, adminSeed } from "./adminSeed";

const PREFIX = "phytologic_admin_";

function now() {
  return new Date().toISOString();
}

function withDefaults(item) {
  return {
    id: crypto.randomUUID(),
    created_at: now(),
    ...item,
  };
}

export function getAllLocal(table) {
  const raw = window.localStorage.getItem(PREFIX + table);
  return raw ? JSON.parse(raw) : [];
}

export function setAllLocal(table, items) {
  window.localStorage.setItem(PREFIX + table, JSON.stringify(items));
}

export function seedLocalIfEmpty() {
  ADMIN_TABLES.forEach((table) => {
    if (getAllLocal(table).length === 0 && adminSeed[table]?.length) {
      setAllLocal(table, adminSeed[table].map(withDefaults));
    }
  });
}

export function insertLocal(table, payload) {
  const item = withDefaults(payload);
  setAllLocal(table, [item, ...getAllLocal(table)]);
  return item;
}

export function updateLocal(table, id, payload) {
  const items = getAllLocal(table).map((item) => (item.id === id ? { ...item, ...payload, updated_at: now() } : item));
  setAllLocal(table, items);
  return items.find((item) => item.id === id) || null;
}

export function removeLocal(table, id) {
  setAllLocal(table, getAllLocal(table).filter((item) => item.id !== id));
}

export function clearLocal(table) {
  window.localStorage.removeItem(PREFIX + table);
}

export function downloadText(filename, text, type = "application/json") {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportLocalJSON(table) {
  downloadText(`${table}_${now().slice(0, 10)}.json`, JSON.stringify(getAllLocal(table), null, 2));
}

export function rowsToCSV(rows) {
  if (!rows.length) return "";
  const keys = Object.keys(rows[0]);
  const escape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  return [keys.join(","), ...rows.map((row) => keys.map((key) => escape(Array.isArray(row[key]) ? row[key].join("、") : row[key])).join(","))].join("\n");
}
