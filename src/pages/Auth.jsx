import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Info } from "lucide-react";
import { Logo, Field, Spinner } from "../components/ui/index.jsx";
import { Seo } from "../components/layout/Seo.jsx";
import { supabase, supabaseConfigured } from "../lib/supabase.js";
import { useAuth } from "../lib/auth.jsx";
import { isEmail } from "../lib/utils.js";

function Shell({ title, sub, children, path }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <Seo path={path} />
      <aside className="hidden flex-col justify-between bg-ink p-12 text-paper/70 lg:flex">
        <Logo dark />
        <div><p className="font-serif text-3xl leading-snug text-paper">“Every obligation, tied to the clause it came from.”</p><p className="mt-4 text-sm">Register, deadlines and gap flags for compliance, legal and operations teams.</p></div>
        <p className="text-xs">© 2026 Aurevex</p>
      </aside>
      <main id="main" className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden"><Logo /></div>
          <h1 className="mt-8 text-3xl lg:mt-0">{title}</h1><p className="mt-2 text-sm text-muted">{sub}</p>
          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  );
}

function NotConfigured() {
  const { startDemo } = useAuth(); const nav = useNavigate();
  return (
    <div className="rounded-xl border border-amber/30 bg-amber-soft p-4 text-sm text-ink">
      <p className="flex gap-2 font-semibold"><Info className="h-4 w-4 shrink-0 text-amber" />Accounts aren't connected in this build.</p>
      <p className="mt-1 text-muted">Account sign-in needs the Supabase settings in <code>.env</code>. You can still open a local demo workspace stored only in this browser.</p>
      <button type="button" className="btn-primary mt-3 w-full" onClick={() => { startDemo(); nav("/onboarding"); }}>Open local demo workspace</button>
    </div>
  );
}

function Password({ id, value, onChange, autoComplete }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input id={id} type={show ? "text" : "password"} className="input pr-10" value={value} onChange={onChange} autoComplete={autoComplete} />
      <button type="button" onClick={() => setShow(!show)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted" aria-label={show ? "Hide password" : "Show password"}>{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
    </div>
  );
}

const friendly = (m = "") => /invalid login/i.test(m) ? "Email or password is incorrect." : /email not confirmed/i.test(m) ? "Please confirm your email first. Check your inbox." : /already registered/i.test(m) ? "An account with this email already exists. Try signing in." : m || "Something went wrong. Please try again.";

export function Login() {
  const nav = useNavigate(); const { user } = useAuth();
  const [f, setF] = useState({ email: "", password: "", remember: true }); const [err, setErr] = useState({}); const [busy, setBusy] = useState(false); const [msg, setMsg] = useState("");
  useEffect(() => { if (user) nav("/dashboard"); }, [user]);
  async function submit(e) {
    e.preventDefault(); const er = {};
    if (!isEmail(f.email)) er.email = "Enter a valid email"; if (!f.password) er.password = "Enter your password";
    setErr(er); if (Object.keys(er).length || !supabase) return;
    setBusy(true); setMsg("");
    const { error } = await supabase.auth.signInWithPassword({ email: f.email, password: f.password });
    setBusy(false); if (error) return setMsg(friendly(error.message));
    if (!f.remember) sessionStorage.setItem("aurevex.ephemeral", "1");
    nav("/dashboard");
  }
  return (
    <Shell path="/login" title="Welcome back" sub="Sign in to your Aurevex workspace.">
      {!supabaseConfigured ? <NotConfigured /> : (
        <form onSubmit={submit} noValidate className="space-y-4">
          <Field label="Email" id="email" error={err.email}><input id="email" type="email" className="input" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} autoComplete="email" /></Field>
          <Field label="Password" id="pw" error={err.password}><Password id="pw" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} autoComplete="current-password" /></Field>
          <div className="flex items-center justify-between text-sm"><label className="flex items-center gap-2"><input type="checkbox" checked={f.remember} onChange={(e) => setF({ ...f, remember: e.target.checked })} />Remember me</label><Link to="/forgot-password" className="text-teal">Forgot password?</Link></div>
          {msg && <p className="rounded-lg bg-red-soft px-3 py-2 text-sm text-red" role="alert">{msg}</p>}
          <button className="btn-primary w-full" disabled={busy}>{busy && <Spinner />}Sign In</button>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-muted">New to Aurevex? <Link to="/signup" className="font-medium text-ink">Create Account</Link></p>
    </Shell>
  );
}

export function strength(p) { let s = 0; if (p.length >= 8) s++; if (p.length >= 12) s++; if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++; if (/\d/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++; return Math.min(s, 4); }
const SL = ["Too weak", "Weak", "Fair", "Good", "Strong"];

export function Signup() {
  const nav = useNavigate(); const [q] = useSearchParams(); const { user } = useAuth();
  const [f, setF] = useState({ name: "", email: "", password: "", confirm: "", terms: false }); const [err, setErr] = useState({}); const [busy, setBusy] = useState(false); const [msg, setMsg] = useState(""); const [sent, setSent] = useState(false);
  useEffect(() => { if (user) nav("/onboarding"); }, [user]);
  const s = strength(f.password);
  async function submit(e) {
    e.preventDefault(); const er = {};
    if (!f.name.trim()) er.name = "Enter your full name"; if (!isEmail(f.email)) er.email = "Enter a valid work email";
    if (f.password.length < 8 || s < 2) er.password = "Use at least 8 characters with a mix of letters, numbers or symbols";
    if (f.confirm !== f.password) er.confirm = "Passwords don't match"; if (!f.terms) er.terms = "Please accept the Terms and Privacy Policy";
    setErr(er); if (Object.keys(er).length || !supabase) return;
    setBusy(true); setMsg("");
    const { data, error } = await supabase.auth.signUp({ email: f.email, password: f.password, options: { data: { full_name: f.name, plan_interest: q.get("plan") || "" }, emailRedirectTo: location.origin + "/onboarding" } });
    setBusy(false); if (error) return setMsg(friendly(error.message));
    if (data.session) nav("/onboarding"); else setSent(true);
  }
  if (sent) return <Shell path="/signup" title="Check your email" sub={`We sent a confirmation link to ${f.email}. Open it to finish creating your account.`}><Link to="/login" className="btn-ghost w-full">Back to Sign In</Link></Shell>;
  return (
    <Shell path="/signup" title="Create your account" sub="Set up a compliance workspace in a couple of minutes.">
      {!supabaseConfigured ? <NotConfigured /> : (
        <form onSubmit={submit} noValidate className="space-y-4">
          <Field label="Full name" id="name" error={err.name}><input id="name" className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} autoComplete="name" /></Field>
          <Field label="Work email" id="email" error={err.email}><input id="email" type="email" className="input" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} autoComplete="email" /></Field>
          <Field label="Password" id="pw" error={err.password}><Password id="pw" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} autoComplete="new-password" />
            {f.password && <div className="mt-2"><div className="flex gap-1">{[0, 1, 2, 3].map((i) => <span key={i} className={`h-1 flex-1 rounded ${i < s ? (s < 2 ? "bg-red" : s < 3 ? "bg-amber" : "bg-teal") : "bg-line"}`} />)}</div><p className="mt-1 text-xs text-muted">{SL[s]}</p></div>}</Field>
          <Field label="Confirm password" id="pw2" error={err.confirm}><Password id="pw2" value={f.confirm} onChange={(e) => setF({ ...f, confirm: e.target.value })} autoComplete="new-password" /></Field>
          <label className="flex gap-2 text-sm text-muted"><input type="checkbox" checked={f.terms} onChange={(e) => setF({ ...f, terms: e.target.checked })} className="mt-1" /><span>I agree to the <Link to="/terms" className="text-ink underline">Terms of Service</Link> and <Link to="/privacy" className="text-ink underline">Privacy Policy</Link>.</span></label>
          {err.terms && <p className="text-xs text-red">{err.terms}</p>}
          {msg && <p className="rounded-lg bg-red-soft px-3 py-2 text-sm text-red" role="alert">{msg}</p>}
          <button className="btn-primary w-full" disabled={busy}>{busy && <Spinner />}Create Account</button>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-muted">Already have an account? <Link to="/login" className="font-medium text-ink">Sign In</Link></p>
    </Shell>
  );
}

export function ForgotPassword() {
  const [email, setEmail] = useState(""); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false); const [done, setDone] = useState(false);
  async function submit(e) {
    e.preventDefault(); if (!isEmail(email)) return setErr("Enter a valid email"); setErr(""); setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: location.origin + "/reset-password" });
    setBusy(false); if (error) return setErr(friendly(error.message)); setDone(true);
  }
  return (
    <Shell path="/forgot-password" title="Reset your password" sub="Enter your account email and we'll send a reset link.">
      {!supabaseConfigured ? <NotConfigured /> : done ? <p className="rounded-lg bg-teal-soft p-4 text-sm text-ink">If an account exists for {email}, a reset link is on its way. The link expires after a limited time.</p> : (
        <form onSubmit={submit} noValidate className="space-y-4">
          <Field label="Email" id="email" error={err}><input id="email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></Field>
          <button className="btn-primary w-full" disabled={busy}>{busy && <Spinner />}Send reset link</button>
        </form>
      )}
      <p className="mt-6 text-center text-sm"><Link to="/login" className="text-muted">Back to Sign In</Link></p>
    </Shell>
  );
}

export function ResetPassword() {
  const nav = useNavigate(); const [pw, setPw] = useState(""); const [pw2, setPw2] = useState(""); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false); const [ok, setOk] = useState(null);
  useEffect(() => {
    if (!supabase) return;
    const h = new URLSearchParams(location.hash.slice(1));
    if (h.get("error")) { setOk(false); setErr(h.get("error_code") === "otp_expired" ? "This reset link has expired. Request a new one." : "This reset link is invalid."); return; }
    supabase.auth.getSession().then(({ data }) => setOk(Boolean(data.session)));
    const { data } = supabase.auth.onAuthStateChange((ev) => ev === "PASSWORD_RECOVERY" && setOk(true));
    return () => data.subscription.unsubscribe();
  }, []);
  async function submit(e) {
    e.preventDefault(); if (strength(pw) < 2 || pw.length < 8) return setErr("Use a stronger password (8+ characters)"); if (pw !== pw2) return setErr("Passwords don't match");
    setBusy(true); const { error } = await supabase.auth.updateUser({ password: pw }); setBusy(false);
    if (error) return setErr(friendly(error.message)); nav("/dashboard");
  }
  return (
    <Shell path="/reset-password" title="Choose a new password" sub="Set a new password for your account.">
      {!supabaseConfigured ? <NotConfigured /> : ok === false ? (<><p className="rounded-lg bg-red-soft p-3 text-sm text-red">{err || "This reset link is invalid or has expired."}</p><Link to="/forgot-password" className="btn-primary mt-4 w-full">Request a new link</Link></>) : (
        <form onSubmit={submit} className="space-y-4">
          <Field label="New password" id="pw"><Password id="pw" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" /></Field>
          <Field label="Confirm new password" id="pw2" error={err}><Password id="pw2" value={pw2} onChange={(e) => setPw2(e.target.value)} autoComplete="new-password" /></Field>
          <button className="btn-primary w-full" disabled={busy || ok === null}>{busy && <Spinner />}Update password</button>
        </form>
      )}
    </Shell>
  );
}
