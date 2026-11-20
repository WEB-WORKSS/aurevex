import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Logo, Field, Spinner } from "../components/ui/index.jsx";
import { Seo } from "../components/layout/Seo.jsx";
import { useAuth } from "../lib/auth.jsx";
import { createStore } from "../lib/store.js";

const INDUSTRIES = ["Financial services", "Manufacturing", "Healthcare / medical devices", "Logistics / import & export", "Construction", "Corporate legal", "Regulatory consulting", "Other"];
export default function Onboarding() {
  const { user } = useAuth(); const store = useMemo(() => createStore(user), [user]); const nav = useNavigate();
  const [step, setStep] = useState(1); const [busy, setBusy] = useState(false); const [msg, setMsg] = useState(""); const [err, setErr] = useState({});
  const [f, setF] = useState({ name: "", organization: "", industry: "", size: "", use_case: "", jurisdictions: "", source_count: "", priority: "" });
  useEffect(() => { store.getWorkspace().then((w) => w?.onboarded && nav("/dashboard", { replace: true })).catch(() => {}); }, [store]);
  const on = (k) => (e) => setF({ ...f, [k]: e.target.value });
  function next(e) { e.preventDefault(); const er = {}; ["name", "organization", "industry", "size", "use_case"].forEach((k) => !f[k] && (er[k] = "Required")); setErr(er); if (!Object.keys(er).length) setStep(2); }
  async function finish(e) { e.preventDefault(); setBusy(true); setMsg(""); try { await store.saveWorkspace({ ...f, onboarded: true }); await store.log(`Workspace "${f.name}" created`); setStep(3); } catch (x) { setMsg(x.message || "Couldn't save your workspace."); } setBusy(false); }
  const Sel = ({ k, opts }) => <select id={k} className="input" value={f[k]} onChange={on(k)}><option value="">Select…</option>{opts.map((o) => <option key={o}>{o}</option>)}</select>;
  return (
    <div className="min-h-screen px-5 py-10"><Seo path="/onboarding" title="Set up your workspace | Aurevex" noindex />
      <div className="mx-auto max-w-lg"><Logo />
        <ol className="mt-8 flex gap-2 text-xs" aria-label="Progress">{["Workspace", "Personalize", "Open"].map((s, i) => <li key={s} className={`flex-1 border-t-2 pt-2 ${step > i ? "border-teal text-ink" : "border-line text-faint"}`}>{i + 1}. {s}</li>)}</ol>
        <div className="card mt-6 p-7">
          {step === 1 && <form onSubmit={next} className="space-y-4" noValidate><h1 className="text-2xl">Set up your workspace</h1>
            <Field label="Workspace name" id="name" error={err.name}><input id="name" className="input" value={f.name} onChange={on("name")} placeholder="e.g. Group Compliance" /></Field>
            <Field label="Organization name" id="organization" error={err.organization}><input id="organization" className="input" value={f.organization} onChange={on("organization")} /></Field>
            <Field label="Industry" id="industry" error={err.industry}><Sel k="industry" opts={INDUSTRIES} /></Field>
            <Field label="Company size" id="size" error={err.size}><Sel k="size" opts={["1–10", "11–50", "51–200", "201–1,000", "1,000+"]} /></Field>
            <Field label="Primary use case" id="use_case" error={err.use_case}><Sel k="use_case" opts={["Obligation register", "Licence & permit deadlines", "Regulatory change tracking", "Audit / inspection readiness", "Consulting for clients"]} /></Field>
            <button className="btn-primary w-full">Continue</button></form>}
          {step === 2 && <form onSubmit={finish} className="space-y-4"><h1 className="text-2xl">Tailor Aurevex</h1><p className="text-sm text-muted">Optional. Helps us set up views that fit your regulatory load.</p>
            <Field label="Jurisdictions you report to" id="jurisdictions"><input id="jurisdictions" className="input" value={f.jurisdictions} onChange={on("jurisdictions")} placeholder="e.g. UK, EU, Nigeria" /></Field>
            <Field label="Regulatory sources you track today" id="source_count"><Sel k="source_count" opts={["Under 10", "10–50", "50–200", "200+"]} /></Field>
            <Field label="Top priority" id="priority"><Sel k="priority" opts={["Never miss a renewal or filing", "Know who owns each requirement", "Keep up with rule changes", "Be ready for audits"]} /></Field>
            {msg && <p className="rounded bg-red-soft p-2 text-sm text-red">{msg}</p>}
            <div className="flex gap-2"><button type="button" className="btn-ghost" onClick={() => setStep(1)}>Back</button><button className="btn-primary flex-1" disabled={busy}>{busy && <Spinner />}Finish setup</button></div></form>}
          {step === 3 && <div className="text-center"><CheckCircle2 className="mx-auto h-12 w-12 text-teal" /><h1 className="mt-4 text-2xl">{f.name} is ready</h1><p className="mt-2 text-sm text-muted">{store.remote ? "Your workspace is saved to your account." : "Local demo: saved in this browser only."}{store.remote ? "" : " It starts with sample obligations you can edit or delete."}</p><button className="btn-primary mt-6 w-full" onClick={() => nav("/dashboard")}>Open Workspace</button></div>}
        </div>
      </div>
    </div>
  );
}
