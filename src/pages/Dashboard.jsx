import { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { LayoutGrid, ListChecks, FileText, CalendarClock, ShieldAlert, History, Settings, Search, Plus, Download, Printer, Pencil, Trash2, Bell, ArrowUpDown, LogOut, Menu } from "lucide-react";
import { Logo, Modal, Field, Spinner, useToast, SampleBadge } from "../components/ui/index.jsx";
import { ProfileMenu } from "../components/layout/Nav.jsx";
import { Seo } from "../components/layout/Seo.jsx";
import { useAuth } from "../lib/auth.jsx";
import { createStore } from "../lib/store.js";
import { DEPARTMENTS, STATUSES, FREQUENCIES, RISKS } from "../data/product-data.js";
import { daysUntil, fmtDate, toCSV, downloadFile, cx } from "../lib/utils.js";

const VIEWS = [["overview", "Overview", LayoutGrid], ["obligations", "Obligations", ListChecks], ["sources", "Sources", FileText], ["deadlines", "Deadlines", CalendarClock], ["gaps", "Gaps", ShieldAlert], ["activity", "Activity", History], ["workspace", "Settings", Settings]];
const stTone = { Draft: "bg-paper-2 text-muted", Open: "bg-blue-soft text-blue", "In progress": "bg-amber-soft text-amber", Met: "bg-teal-soft text-teal" };
const riskTone = { High: "text-red", Medium: "text-amber", Low: "text-muted" };
const gapsOf = (o) => o.st === "Met" ? [] : [!o.owner && "No owner assigned", !o.ev && "No evidence recorded", o.due && daysUntil(o.due) < 0 && "Past due"].filter(Boolean);
const EMPTY = { t: "", src: "", cl: "", dept: "", owner: "", due: "", freq: "One-off", st: "Open", risk: "Medium", ev: "", notes: "" };

function ObligationForm({ initial, sources, onSave, onCancel }) {
  const [f, setF] = useState({ ...EMPTY, ...initial }); const [err, setErr] = useState({}); const [busy, setBusy] = useState(false);
  const on = (k) => (e) => setF({ ...f, [k]: e.target.value });
  async function submit(e) { e.preventDefault(); const er = {}; if (f.t.trim().length < 4) er.t = "Describe the obligation"; if (!f.dept) er.dept = "Choose a department"; setErr(er); if (Object.keys(er).length) return; setBusy(true); try { await onSave(f); } finally { setBusy(false); } }
  const S = ({ k, opts, allowEmpty }) => <select id={k} className="input" value={f[k]} onChange={on(k)}>{allowEmpty && <option value="">—</option>}{opts.map((o) => <option key={o}>{o}</option>)}</select>;
  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2" noValidate>
      <div className="sm:col-span-2"><Field label="Obligation" id="t" error={err.t}><input id="t" className="input" value={f.t} onChange={on("t")} /></Field></div>
      <Field label="Source" id="src"><S k="src" opts={sources.map((s) => s.title)} allowEmpty /></Field>
      <Field label="Clause / citation" id="cl"><input id="cl" className="input" value={f.cl} onChange={on("cl")} placeholder="§4.2(b)" /></Field>
      <Field label="Department" id="dept" error={err.dept}><S k="dept" opts={DEPARTMENTS} allowEmpty /></Field>
      <Field label="Owner" id="owner"><input id="owner" className="input" value={f.owner} onChange={on("owner")} /></Field>
      <Field label="Frequency" id="freq"><S k="freq" opts={FREQUENCIES} /></Field>
      <Field label="Next due date" id="due"><input id="due" type="date" className="input" value={f.due} onChange={on("due")} /></Field>
      <Field label="Status" id="st"><S k="st" opts={STATUSES} /></Field>
      <Field label="Risk" id="risk"><S k="risk" opts={RISKS} /></Field>
      <div className="sm:col-span-2"><Field label="Evidence recorded" id="ev" hint="Leave empty if nothing is on file yet"><input id="ev" className="input" value={f.ev} onChange={on("ev")} /></Field></div>
      <div className="sm:col-span-2"><Field label="Notes" id="notes"><textarea id="notes" rows={2} className="input" value={f.notes || ""} onChange={on("notes")} /></Field></div>
      <div className="flex justify-end gap-2 sm:col-span-2"><button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button><button className="btn-primary" disabled={busy}>{busy && <Spinner />}Save obligation</button></div>
    </form>
  );
}

export default function Dashboard() {
  const { user, isDemo, signOut } = useAuth(); const toast = useToast(); const nav = useNavigate();
  const store = useMemo(() => createStore(user), [user]);
  const [params, setParams] = useSearchParams(); const view = params.get("view") || "overview";
  const [ws, setWs] = useState(null); const [obs, setObs] = useState([]); const [srcs, setSrcs] = useState([]); const [act, setAct] = useState([]);
  const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const [q, setQ] = useState(""); const [fd, setFd] = useState(""); const [fs, setFs] = useState(""); const [sort, setSort] = useState({ k: "due", dir: 1 });
  const [edit, setEdit] = useState(null); const [detail, setDetail] = useState(null); const [del, setDel] = useState(null); const [srcModal, setSrcModal] = useState(false); const [side, setSide] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { const [w, o, s, a] = await Promise.all([store.getWorkspace(), store.list("obligations"), store.list("sources"), store.list("activity")]); if (!w) return nav("/onboarding"); setWs(w); setObs(o); setSrcs(s); setAct(a); }
    catch (x) { setError(x.message || "Couldn't load your workspace."); }
    setLoading(false);
  }, [store]);
  useEffect(() => { load(); }, [load]);
  const go = (v) => { setParams({ view: v }); setSide(false); };
  const refreshAct = async () => setAct(await store.list("activity"));

  async function saveOb(f) {
    try {
      if (f.id) { const { id, created_at, user_id, ...rest } = f; const r = await store.update("obligations", id, rest); setObs((s) => s.map((x) => (x.id === id ? r : x))); await store.log(`Updated "${f.t}"`); toast("Obligation updated"); }
      else { const r = await store.insert("obligations", f); setObs((s) => [r, ...s]); await store.log(`Added "${f.t}"`); toast("Obligation added"); }
      setEdit(null); refreshAct();
    } catch (x) { toast(x.message || "Couldn't save", "err"); }
  }
  async function confirmDelete() { try { await store.remove("obligations", del.id); setObs((s) => s.filter((x) => x.id !== del.id)); await store.log(`Deleted "${del.t}"`); toast("Obligation deleted"); refreshAct(); } catch (x) { toast(x.message, "err"); } setDel(null); setDetail(null); }
  async function setStatus(o, st) { try { const r = await store.update("obligations", o.id, { st }); setObs((s) => s.map((x) => (x.id === o.id ? r : x))); setDetail(r); await store.log(`"${o.t}" → ${st}`); toast(`Marked ${st}`); refreshAct(); } catch (x) { toast(x.message, "err"); } }

  const filtered = useMemo(() => {
    const t = q.toLowerCase();
    return obs.filter((o) => (!fd || o.dept === fd) && (!fs || o.st === fs) && (!t || [o.t, o.src, o.cl, o.owner].join(" ").toLowerCase().includes(t)))
      .sort((a, b) => { const k = sort.k; const av = a[k] || (k === "due" ? "9999" : ""), bv = b[k] || (k === "due" ? "9999" : ""); return av < bv ? -sort.dir : av > bv ? sort.dir : 0; });
  }, [obs, q, fd, fs, sort]);
  const gaps = obs.flatMap((o) => gapsOf(o).map((g) => ({ o, g }))).sort((a, b) => RISKS.indexOf(b.o.risk) - RISKS.indexOf(a.o.risk));
  const dated = obs.filter((o) => o.due && o.st !== "Met").sort((a, b) => a.due.localeCompare(b.due));
  const notif = dated.filter((o) => daysUntil(o.due) <= 14);
  const cols = [{ key: "t", label: "Obligation" }, { key: "src", label: "Source" }, { key: "cl", label: "Clause" }, { key: "dept", label: "Department" }, { key: "owner", label: "Owner" }, { key: "freq", label: "Frequency" }, { key: "due", label: "Due" }, { key: "st", label: "Status" }, { key: "risk", label: "Risk" }, { key: "ev", label: "Evidence" }];
  const exportCSV = () => { downloadFile(`aurevex-obligations-${new Date().toISOString().slice(0, 10)}.csv`, toCSV(filtered, cols), "text/csv"); toast("CSV exported"); };

  const Th = ({ k, children }) => <th className="px-3 py-2 text-left font-medium"><button className="inline-flex items-center gap-1" onClick={() => setSort({ k, dir: sort.k === k ? -sort.dir : 1 })}>{children}<ArrowUpDown className="h-3 w-3" /></button></th>;
  const Due = ({ o }) => { const d = daysUntil(o.due); if (d == null) return <span className="text-muted">{o.freq}</span>; return <span className={d < 0 ? "text-red" : d <= 14 ? "text-amber" : ""}>{fmtDate(o.due)}<span className="block text-xs text-muted">{d < 0 ? `${-d}d overdue` : d === 0 ? "today" : `in ${d}d`}</span></span>; };

  if (loading) return <div className="grid min-h-screen place-items-center"><Spinner className="h-6 w-6 text-teal" /></div>;
  if (error) return <div className="grid min-h-screen place-items-center p-6 text-center"><div><p className="text-red">{error}</p><button className="btn-primary mt-4" onClick={load}>Retry</button></div></div>;

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]"><Seo path="/dashboard" title="Dashboard | Aurevex" noindex />
      <aside className={cx("no-print fixed inset-y-0 left-0 z-40 w-60 flex-col bg-ink p-4 text-paper/70 lg:static lg:flex", side ? "flex" : "hidden")}>
        <Logo dark />
        <div className="mt-6 rounded-lg bg-white/5 px-3 py-2"><p className="text-xs text-paper/50">Workspace</p><p className="truncate text-sm font-medium text-paper">{ws.name}</p><p className="truncate text-xs">{ws.organization}</p></div>
        <nav className="mt-6 flex-1 space-y-1 text-sm" aria-label="Workspace">{VIEWS.map(([k, l, I]) => <button key={k} onClick={() => go(k)} className={cx("flex w-full items-center gap-2.5 rounded-md px-3 py-2", view === k ? "bg-white/10 text-paper" : "hover:bg-white/5")}><I className="h-4 w-4" />{l}{k === "gaps" && gaps.length > 0 && <span className="ml-auto rounded bg-red px-1.5 text-xs text-white">{gaps.length}</span>}</button>)}</nav>
        <button onClick={async () => { await signOut(); nav("/"); }} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-white/5"><LogOut className="h-4 w-4" />Sign out</button>
      </aside>
      <div className="min-w-0">
        <header className="no-print sticky top-0 z-30 flex items-center gap-3 border-b border-line-2 bg-paper/95 px-4 py-3 backdrop-blur md:px-6">
          <button className="lg:hidden" onClick={() => setSide(!side)} aria-label="Toggle sidebar"><Menu /></button>
          <div className="relative max-w-md flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" /><input className="input pl-9" placeholder="Search obligations, clauses, owners" value={q} onChange={(e) => { setQ(e.target.value); if (view !== "obligations") go("obligations"); }} aria-label="Search obligations" /></div>
          {isDemo && <SampleBadge>Local demo</SampleBadge>}
          <details className="relative"><summary className="relative list-none cursor-pointer rounded-md p-2 hover:bg-paper-2" aria-label="Notifications"><Bell className="h-5 w-5" />{notif.length > 0 && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red" />}</summary>
            <div className="card absolute right-0 z-50 mt-2 w-72 p-3 text-sm"><p className="mb-2 font-semibold">Due within 14 days</p>{notif.length ? notif.map((o) => <button key={o.id} onClick={() => setDetail(o)} className="block w-full rounded px-2 py-1.5 text-left hover:bg-paper-2">{o.t}<span className="block text-xs text-muted">{fmtDate(o.due)}</span></button>) : <p className="text-muted">Nothing due soon.</p>}</div></details>
          <ProfileMenu />
        </header>

        <main id="main" className="p-4 md:p-8">
          {view === "overview" && (<>
            <h1 className="text-3xl">Overview</h1><p className="mt-1 text-sm text-muted">{ws.organization} · {ws.industry}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[["Obligations", obs.length, "obligations"], ["Met", obs.filter((o) => o.st === "Met").length, "obligations"], ["Due in 30 days", dated.filter((o) => daysUntil(o.due) <= 30 && daysUntil(o.due) >= 0).length, "deadlines"], ["Open gaps", gaps.length, "gaps"]].map(([l, n, v]) => <button key={l} onClick={() => go(v)} className="card p-5 text-left hover:border-teal"><p className="text-sm text-muted">{l}</p><p className="mt-1 font-serif text-3xl text-ink">{n}</p></button>)}</div>
            <div className="mt-6 grid gap-6 xl:grid-cols-2">
              <div className="card p-5"><h2 className="font-sans text-base font-semibold">Completion by department</h2>{DEPARTMENTS.filter((d) => obs.some((o) => o.dept === d)).map((d) => { const all = obs.filter((o) => o.dept === d), met = all.filter((o) => o.st === "Met").length, p = Math.round((met / all.length) * 100); return <button key={d} onClick={() => { setFd(d); go("obligations"); }} className="mt-3 block w-full text-left"><div className="flex justify-between text-sm"><span>{d}</span><span className="text-muted">{met}/{all.length}</span></div><div className="mt-1 h-2 rounded bg-paper-2"><div className="h-2 rounded bg-teal" style={{ width: p + "%" }} /></div></button>; })}{!obs.length && <p className="mt-3 text-sm text-muted">No obligations yet.</p>}</div>
              <div className="card p-5"><h2 className="font-sans text-base font-semibold">Next deadlines</h2><ul className="mt-3 divide-y divide-line-2 text-sm">{dated.slice(0, 5).map((o) => <li key={o.id}><button onClick={() => setDetail(o)} className="flex w-full justify-between gap-3 py-2.5 text-left"><span>{o.t}</span><Due o={o} /></button></li>)}{!dated.length && <li className="py-2 text-muted">No dated obligations.</li>}</ul></div>
            </div>
          </>)}

          {view === "obligations" && (<>
            <div className="flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-3xl">Obligations</h1><p className="mt-1 text-sm text-muted">{filtered.length} of {obs.length}</p></div>
              <div className="no-print flex flex-wrap gap-2"><button className="btn-ghost" onClick={exportCSV}><Download className="h-4 w-4" />CSV</button><button className="btn-ghost" onClick={() => window.print()}><Printer className="h-4 w-4" />PDF</button><button className="btn-primary" onClick={() => setEdit({})}><Plus className="h-4 w-4" />New obligation</button></div></div>
            <div className="no-print mt-4 flex flex-wrap gap-2"><select className="input w-auto" value={fd} onChange={(e) => setFd(e.target.value)} aria-label="Filter by department"><option value="">All departments</option>{DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}</select><select className="input w-auto" value={fs} onChange={(e) => setFs(e.target.value)} aria-label="Filter by status"><option value="">All statuses</option>{STATUSES.map((d) => <option key={d}>{d}</option>)}</select>{(fd || fs || q) && <button className="btn-ghost" onClick={() => { setFd(""); setFs(""); setQ(""); }}>Clear</button>}</div>
            {filtered.length ? (
              <div className="card mt-4 overflow-x-auto"><table className="w-full min-w-[760px] text-sm"><thead className="border-b border-line-2 text-muted"><tr><Th k="t">Obligation</Th><Th k="dept">Department</Th><Th k="owner">Owner</Th><Th k="due">Due</Th><Th k="st">Status</Th><Th k="risk">Risk</Th><th className="no-print" /></tr></thead>
                <tbody className="divide-y divide-line-2">{filtered.map((o) => <tr key={o.id} className="hover:bg-paper/60"><td className="px-3 py-3"><button className="text-left font-medium text-ink hover:underline" onClick={() => setDetail(o)}>{o.t}</button><span className="block font-mono text-xs text-muted">{o.src} {o.cl}</span></td><td className="px-3">{o.dept}</td><td className="px-3">{o.owner || <span className="text-red">Unassigned</span>}</td><td className="px-3"><Due o={o} /></td><td className="px-3"><span className={cx("tag", stTone[o.st])}>{o.st}</span></td><td className={cx("px-3 font-medium", riskTone[o.risk])}>{o.risk}</td><td className="no-print px-3 text-right"><button className="rounded p-1.5 hover:bg-paper-2" aria-label={`Edit ${o.t}`} onClick={() => setEdit(o)}><Pencil className="h-4 w-4" /></button><button className="rounded p-1.5 text-red hover:bg-red-soft" aria-label={`Delete ${o.t}`} onClick={() => setDel(o)}><Trash2 className="h-4 w-4" /></button></td></tr>)}</tbody></table></div>
            ) : <div className="card mt-4 p-10 text-center"><p className="font-semibold">{obs.length ? "No obligations match these filters." : "No obligations yet."}</p><p className="mt-1 text-sm text-muted">Add an obligation with its source clause, owner and due date.</p><button className="btn-primary mt-4" onClick={() => setEdit({})}><Plus className="h-4 w-4" />New obligation</button></div>}
          </>)}

          {view === "sources" && (<>
            <div className="flex items-end justify-between"><div><h1 className="text-3xl">Regulatory sources</h1><p className="mt-1 text-sm text-muted">Regulations, permits and guidance your obligations come from. Document upload and AI extraction are in development.</p></div><button className="btn-primary" onClick={() => setSrcModal(true)}><Plus className="h-4 w-4" />Add source</button></div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">{srcs.map((s) => { const n = obs.filter((o) => o.src === s.title).length; return <div key={s.id} className="card p-5"><div className="flex justify-between"><span className="tag bg-blue-soft text-blue">{s.type}</span><button aria-label={`Delete ${s.title}`} className="text-muted hover:text-red" onClick={async () => { await store.remove("sources", s.id); setSrcs((x) => x.filter((y) => y.id !== s.id)); toast("Source removed"); }}><Trash2 className="h-4 w-4" /></button></div><p className="mt-3 font-semibold text-ink">{s.title}</p><p className="text-sm text-muted">{s.version} · {s.jurisdiction}</p><button className="mt-3 text-sm text-teal" onClick={() => { setQ(s.title); go("obligations"); }}>{n} obligation{n === 1 ? "" : "s"} →</button></div>; })}{!srcs.length && <p className="text-muted">No sources yet.</p>}</div>
          </>)}

          {view === "deadlines" && (<><h1 className="text-3xl">Deadlines</h1><ol className="mt-6 space-y-3 border-l-2 border-line pl-6">{dated.map((o) => { const d = daysUntil(o.due); return <li key={o.id} className="relative"><span className={cx("absolute -left-[31px] top-4 h-3 w-3 rounded-full", d < 0 ? "bg-red" : d <= 14 ? "bg-amber" : "bg-teal")} /><button onClick={() => setDetail(o)} className="card flex w-full flex-wrap justify-between gap-2 p-4 text-left"><span><span className="font-medium text-ink">{o.t}</span><span className="block text-xs text-muted">{o.dept} · {o.owner || "Unassigned"} · {o.freq}</span></span><Due o={o} /></button></li>; })}{!dated.length && <p className="text-muted">No open dated obligations.</p>}</ol></>)}

          {view === "gaps" && (<><h1 className="text-3xl">Gap analysis</h1><p className="mt-1 text-sm text-muted">Rule-based checks: owner, evidence and due date for every obligation that isn't met.</p><div className="mt-6 space-y-3">{gaps.map(({ o, g }, i) => <div key={o.id + i} className="card flex flex-wrap items-center justify-between gap-3 p-4"><div><span className={cx("text-xs font-semibold uppercase", riskTone[o.risk])}>{o.risk} · {g}</span><p className="font-medium text-ink">{o.t}</p><p className="font-mono text-xs text-muted">{o.src} {o.cl}</p></div><button className="btn-ghost" onClick={() => setEdit(o)}>Resolve</button></div>)}{!gaps.length && <div className="card p-8 text-center text-muted">No gaps found.</div>}</div></>)}

          {view === "activity" && (<><h1 className="text-3xl">Activity</h1><ul className="card mt-6 divide-y divide-line-2 text-sm">{act.map((a) => <li key={a.id} className="flex justify-between gap-3 px-4 py-3"><span>{a.text}</span><span className="text-xs text-muted">{new Date(a.created_at).toLocaleString()}</span></li>)}{!act.length && <li className="px-4 py-6 text-muted">No activity yet.</li>}</ul></>)}

          {(view === "workspace" || view === "account") && <SettingsView ws={ws} setWs={setWs} store={store} user={user} isDemo={isDemo} toast={toast} />}
        </main>
      </div>

      <Modal open={Boolean(edit)} onClose={() => setEdit(null)} title={edit?.id ? "Edit obligation" : "New obligation"} wide>{edit && <ObligationForm initial={edit} sources={srcs} onSave={saveOb} onCancel={() => setEdit(null)} />}</Modal>
      <Modal open={Boolean(detail)} onClose={() => setDetail(null)} title={detail?.t || ""} wide>{detail && (<div className="text-sm">
        <dl className="grid grid-cols-2 gap-3">{[["Source", detail.src || "—"], ["Clause", detail.cl || "—"], ["Department", detail.dept], ["Owner", detail.owner || "Unassigned"], ["Frequency", detail.freq], ["Due", fmtDate(detail.due)], ["Risk", detail.risk], ["Evidence", detail.ev || "None recorded"]].map(([k, v]) => <div key={k}><dt className="text-xs text-muted">{k}</dt><dd className="font-medium text-ink">{v}</dd></div>)}</dl>
        {detail.notes && <p className="mt-4 rounded bg-paper-2 p-3">{detail.notes}</p>}
        {gapsOf(detail).length > 0 && <p className="mt-4 text-red">Gaps: {gapsOf(detail).join(", ")}</p>}
        <div className="mt-5 flex flex-wrap gap-2"><span className="self-center text-muted">Status:</span>{STATUSES.map((s) => <button key={s} onClick={() => setStatus(detail, s)} className={cx("tag", detail.st === s ? stTone[s] + " ring-2 ring-ink/20" : "bg-paper-2 text-muted")}>{s}</button>)}</div>
        <div className="mt-6 flex justify-end gap-2"><button className="btn-ghost text-red" onClick={() => setDel(detail)}><Trash2 className="h-4 w-4" />Delete</button><button className="btn-primary" onClick={() => { setEdit(detail); setDetail(null); }}><Pencil className="h-4 w-4" />Edit</button></div>
      </div>)}</Modal>
      <Modal open={Boolean(del)} onClose={() => setDel(null)} title="Delete obligation?"><p className="text-sm text-muted">“{del?.t}” will be removed permanently from this workspace.</p><div className="mt-6 flex justify-end gap-2"><button className="btn-ghost" onClick={() => setDel(null)}>Cancel</button><button className="btn-danger" onClick={confirmDelete}>Delete</button></div></Modal>
      <SourceModal open={srcModal} onClose={() => setSrcModal(false)} onSave={async (s) => { try { const r = await store.insert("sources", s); setSrcs((x) => [r, ...x]); await store.log(`Added source "${s.title}"`); toast("Source added"); setSrcModal(false); refreshAct(); } catch (x) { toast(x.message, "err"); } }} />
    </div>
  );
}

function SourceModal({ open, onClose, onSave }) {
  const [f, setF] = useState({ title: "", version: "", jurisdiction: "", type: "Regulation" }); const [e, setE] = useState("");
  return <Modal open={open} onClose={onClose} title="Add regulatory source"><form className="space-y-3" onSubmit={(ev) => { ev.preventDefault(); if (!f.title.trim()) return setE("Enter a title"); onSave(f); setF({ title: "", version: "", jurisdiction: "", type: "Regulation" }); }}>
    <Field label="Title" id="s-t" error={e}><input id="s-t" className="input" value={f.title} onChange={(x) => setF({ ...f, title: x.target.value })} /></Field>
    <Field label="Type" id="s-ty"><select id="s-ty" className="input" value={f.type} onChange={(x) => setF({ ...f, type: x.target.value })}>{["Regulation", "Directive", "Permit", "Licence", "Guidance", "Standard"].map((o) => <option key={o}>{o}</option>)}</select></Field>
    <Field label="Version" id="s-v"><input id="s-v" className="input" value={f.version} onChange={(x) => setF({ ...f, version: x.target.value })} /></Field>
    <Field label="Jurisdiction" id="s-j"><input id="s-j" className="input" value={f.jurisdiction} onChange={(x) => setF({ ...f, jurisdiction: x.target.value })} /></Field>
    <div className="flex justify-end gap-2"><button type="button" className="btn-ghost" onClick={onClose}>Cancel</button><button className="btn-primary">Add source</button></div></form></Modal>;
}

function SettingsView({ ws, setWs, store, user, isDemo, toast }) {
  const [f, setF] = useState(ws); const [busy, setBusy] = useState(false);
  return (<><h1 className="text-3xl">Settings</h1>
    <div className="mt-6 grid gap-6 xl:grid-cols-2">
      <form className="card space-y-3 p-6" onSubmit={async (e) => { e.preventDefault(); setBusy(true); try { setWs(await store.saveWorkspace(f)); toast("Workspace saved"); } catch (x) { toast(x.message, "err"); } setBusy(false); }}>
        <h2 className="font-sans text-base font-semibold">Workspace</h2>
        <Field label="Workspace name" id="w-n"><input id="w-n" className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
        <Field label="Organization" id="w-o"><input id="w-o" className="input" value={f.organization} onChange={(e) => setF({ ...f, organization: e.target.value })} /></Field>
        <button className="btn-primary" disabled={busy}>{busy && <Spinner />}Save</button>
      </form>
      <div className="card p-6 text-sm"><h2 className="font-sans text-base font-semibold">Account</h2>
        {isDemo ? (<><p className="mt-2 text-muted">You're in a local demo. Data is stored in this browser only and isn't an account.</p><button className="btn-ghost mt-4" onClick={() => { store.resetLocal(); location.href = "/onboarding"; }}>Reset demo data</button></>) : (<><p className="mt-2">Signed in as <b>{user.email}</b></p><Link to="/forgot-password" className="btn-ghost mt-4">Change password</Link></>)}
      </div>
    </div></>);
}
