// Workspace data layer. Supabase tables (RLS by owner) when configured; browser localStorage for the explicit local demo.
import { supabase } from "./supabase.js";
import { seedObligations, seedSources } from "../data/product-data.js";

const LS = "aurevex.demoData";
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()));

function loadLocal() {
  try { const d = JSON.parse(localStorage.getItem(LS)); if (d) return d; } catch {}
  const d = { workspace: null, obligations: seedObligations(), sources: seedSources(), activity: [] };
  localStorage.setItem(LS, JSON.stringify(d)); return d;
}
const saveLocal = (d) => localStorage.setItem(LS, JSON.stringify(d));

export function createStore(user) {
  const remote = Boolean(supabase && user && !user.demo);
  return {
    remote,
    async getWorkspace() {
      if (!remote) return loadLocal().workspace;
      const { data, error } = await supabase.from("workspaces").select("*").eq("user_id", user.id).maybeSingle();
      if (error) throw error; return data;
    },
    async saveWorkspace(ws) {
      if (!remote) { const d = loadLocal(); d.workspace = { ...ws, id: d.workspace?.id || uid() }; saveLocal(d); return d.workspace; }
      const { data, error } = await supabase.from("workspaces").upsert({ ...ws, user_id: user.id }, { onConflict: "user_id" }).select().single();
      if (error) throw error; return data;
    },
    async list(table) {
      if (!remote) return loadLocal()[table] || [];
      const { data, error } = await supabase.from(table).select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      if (error) throw error; return data;
    },
    async insert(table, row) {
      const rec = { ...row, id: uid(), created_at: new Date().toISOString() };
      if (!remote) { const d = loadLocal(); d[table] = [rec, ...(d[table] || [])]; saveLocal(d); return rec; }
      const { data, error } = await supabase.from(table).insert({ ...row, user_id: user.id }).select().single();
      if (error) throw error; return data;
    },
    async update(table, id, patch) {
      if (!remote) { const d = loadLocal(); d[table] = d[table].map((r) => (r.id === id ? { ...r, ...patch } : r)); saveLocal(d); return d[table].find((r) => r.id === id); }
      const { data, error } = await supabase.from(table).update(patch).eq("id", id).eq("user_id", user.id).select().single();
      if (error) throw error; return data;
    },
    async remove(table, id) {
      if (!remote) { const d = loadLocal(); d[table] = d[table].filter((r) => r.id !== id); saveLocal(d); return; }
      const { error } = await supabase.from(table).delete().eq("id", id).eq("user_id", user.id);
      if (error) throw error;
    },
    async log(text) { try { await this.insert("activity", { text }); } catch {} },
    resetLocal() { localStorage.removeItem(LS); },
  };
}

export async function submitLead(lead) {
  if (!supabase) throw new Error("The inquiry form isn't connected to a backend in this build yet.");
  const { error } = await supabase.from("leads").insert(lead);
  if (error) throw new Error("We couldn't send your message. Please try again.");
}
