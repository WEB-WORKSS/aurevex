export const cx = (...c) => c.filter(Boolean).join(" ");
export const isEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim());
export const DAY = 864e5;
export const daysUntil = (iso) => { if (!iso) return null; const t = new Date(); t.setHours(0,0,0,0); return Math.round((new Date(iso + "T00:00:00") - t) / DAY); };
export const fmtDate = (iso) => (iso ? new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—");
export function downloadFile(name, content, type = "text/plain") {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = Object.assign(document.createElement("a"), { href: url, download: name }); a.click(); setTimeout(() => URL.revokeObjectURL(url), 500);
}
export function toCSV(rows, cols) {
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [cols.map((c) => esc(c.label)).join(","), ...rows.map((r) => cols.map((c) => esc(r[c.key])).join(","))].join("\n");
}
export async function copy(text) { await navigator.clipboard.writeText(text); }
