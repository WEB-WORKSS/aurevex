import { useState } from "react";
import { Link } from "react-router-dom";
import { FileText, ListChecks, GitCompare, CalendarClock, ShieldAlert, Quote, ArrowRight, Check, Landmark, Factory, HeartPulse, Truck, Linkedin } from "lucide-react";
import { business, stages, aws } from "../../data/business.js";
import { isEmail, cx } from "../../lib/utils.js";
import { submitLead } from "../../lib/store.js";
import { Field, Spinner, SampleBadge } from "../ui/index.jsx";

const Section = ({ id, eyebrow, title, lede, children, className = "" }) => (
  <section id={id} className={cx("scroll-mt-20 py-20 md:py-28", className)}>
    <div className="wrap">
      <div className="max-w-2xl"><p className="eyebrow">{eyebrow}</p><h2 className="mt-3 text-3xl md:text-[2.6rem] leading-tight">{title}</h2>{lede && <p className="mt-4 text-lg text-muted">{lede}</p>}</div>
      <div className="mt-12">{children}</div>
    </div>
  </section>
);

function Hero() {
  const [k, setK] = useState(1);
  const clauses = [
    [1, "(a) Facilities storing more than 250 litres of Category 2 flammable liquids shall maintain an inventory register updated no less than monthly."],
    [2, "(b) Storage areas shall be inspected by a competent person every 90 days, and inspection records retained for three years."],
    [3, "(c) Any change in storage capacity exceeding 20% shall be notified to the authority within 30 days."],
  ];
  const obs = [[1, "§4.2(a)", "EHS", "Maintain flammable-liquid inventory register", "Recurring · monthly"], [2, "§4.2(b)", "Facilities", "Competent-person inspection of storage areas", "Every 90 days"], [3, "§4.2(c)", "Legal", "Notify authority of capacity change above 20%", "Within 30 days of event"]];
  return (
    <section className="relative overflow-hidden pt-14 pb-20 md:pt-20">
      <div className="wrap grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1 text-xs font-medium text-muted"><span className="h-2 w-2 rounded-full bg-teal-2" />Building the initial product · Workspace preview available</p>
          <h1 className="mt-6 text-4xl leading-[1.08] md:text-6xl">Turn regulation into a plan your teams can act on.</h1>
          <p className="mt-6 max-w-xl text-lg text-muted">Aurevex turns regulations, permits and guidance into a register of obligations, each with its source clause, owner, deadline and required evidence, so compliance, legal and operations teams stop rebuilding spreadsheets every time a rule changes.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Link to="/signup" className="btn-primary px-5 py-3 text-base">Get Started <ArrowRight className="h-4 w-4" /></Link><a href="#product" className="btn-ghost px-5 py-3 text-base">Explore Product</a></div>
          <p className="mt-5 text-sm text-faint">For compliance teams in financial services, manufacturing, healthcare, logistics and construction.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-[1.1fr_1fr]" aria-label="A regulatory clause converted into three obligations">
          <div className="card p-5">
            <div className="flex items-center justify-between"><span className="font-mono text-xs text-muted">Chemical Storage Rule · Rev. 2026</span><SampleBadge>Sample</SampleBadge></div>
            <p className="mt-3 font-serif text-lg text-ink">§ 4.2 Storage of flammable liquids</p>
            <div className="mt-3 space-y-2 text-sm leading-relaxed">{clauses.map(([n, t]) => <p key={n} onMouseEnter={() => setK(n)} className={cx("rounded px-1.5 py-1 transition", k === n ? "bg-teal-soft text-ink" : "text-muted")}>{t}</p>)}</div>
          </div>
          <div className="space-y-3">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-teal"><ArrowRight className="h-3.5 w-3.5" />3 obligations</p>
            {obs.map(([n, c, d, t, m]) => (
              <button key={n} onMouseEnter={() => setK(n)} onFocus={() => setK(n)} className={cx("card block w-full p-4 text-left transition", k === n && "border-teal ring-2 ring-teal/20")}>
                <div className="flex justify-between"><span className="font-mono text-xs text-muted">{c}</span><span className="tag bg-blue-soft text-blue">{d}</span></div>
                <p className="mt-2 text-sm font-semibold text-ink">{t}</p><p className="mt-1 text-xs text-muted">{m}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const highlights = [["Clause-level citations", "Every obligation links back to the paragraph it came from."], ["Owner-assigned work", "Each requirement has a department, an owner and the evidence that closes it."], ["One deadline timeline", "Renewals, inspections and filings in one chronological view."], ["Gap flags", "Missing owners, missing evidence and overdue items surface automatically."]];

const feats = [
  { icon: ListChecks, name: "Obligation register", text: "A structured register where every obligation carries its source and clause, department, owner, frequency, due date, risk and required evidence.", benefit: "Auditors and counsel can trace every row to the rule behind it.", ui: ["§4.2(a) · Inventory register · EHS · Monthly", "Art. 12(3) · Device history records · Quality", "Sec. 9 · Customs licence renewal · Trade"] },
  { icon: FileText, name: "Regulatory source library", text: "Record each regulation, permit and guidance note with its version and jurisdiction, and link obligations to it.", benefit: "One place to see which rules the business answers to.", ui: ["Chemical Storage Rule · v4", "Site Environmental Permit EP-221", "Customs Licensing Regulation · 2024"] },
  { icon: CalendarClock, name: "Deadline timeline", text: "Every dated obligation feeds a single timeline with due-soon and overdue states.", benefit: "Renewals stop depending on personal calendars.", ui: ["Overdue · Quarterly emissions report", "6 days · Inventory register", "24 days · Customs licence renewal"] },
  { icon: ShieldAlert, name: "Gap analysis", text: "Obligations with no owner, no recorded evidence or a passed due date are flagged and ranked by risk.", benefit: "Gaps surface before an inspection does.", ui: ["High · No owner assigned", "High · Past due", "Medium · No evidence recorded"] },
  { icon: GitCompare, name: "Regulatory change comparison", text: "When a rule is amended, Aurevex is being built to compare it clause by clause with the version on file and list the obligations each change touches.", benefit: "Review the sentences that changed, not the whole document.", ui: ["§4.2(b) v3 → v4", "every 180 → 90 days", "Affects 2 obligations"], soon: true },
  { icon: Quote, name: "AI obligation drafting", text: "Being built: Amazon Textract and Amazon Bedrock read uploaded documents and draft obligations with citations. A reviewer confirms each draft before it enters the register.", benefit: "Analysts confirm instead of writing from scratch.", ui: ["Draft · Retain inspection records 3 years", "Citation · §4.2(b)", "Awaiting reviewer"], soon: true },
];

const segments = [
  { icon: Landmark, who: "Financial institutions", ch: "Disclosure and conduct rules change often and touch many product documents.", use: "Keep a cited register of obligations per rule, with owners in each business line.", ben: "Clear accountability when a supervisor asks who owns a requirement." },
  { icon: Factory, who: "Manufacturers", ch: "Site permits and chemical, machinery and certification rules carry dozens of recurring conditions.", use: "Track each permit condition as an owned obligation with its inspection or reporting date.", ben: "Fewer missed reports and inspection follow-ups." },
  { icon: HeartPulse, who: "Healthcare & medical devices", ch: "Records retention, licensing and device documentation duties are spread across teams.", use: "Assign each duty to Quality, Facilities or Legal with the evidence that proves it.", ben: "Inspection readiness without a scramble." },
  { icon: Truck, who: "Logistics & trade", ch: "Operator, customs and hazardous-goods licences lapse quietly across jurisdictions.", use: "Put every licence renewal on one timeline with a named owner.", ben: "Shipments aren't stopped by a lapsed licence." },
];

const PRICES = { starter: { m: 29, y: 24 }, growth: { m: 99, y: 79 } };

function Pricing() {
  const [annual, setAnnual] = useState(false);
  const plans = [
    { name: "Starter", key: "starter", for: "For a single compliance lead or small team.", f: ["1 workspace", "Up to 3 members", "Obligation register & source library", "Deadline timeline & gap flags", "CSV and print exports"], cta: ["Get Started", "/signup"] },
    { name: "Growth", key: "growth", hi: true, for: "For compliance teams across several departments or sites.", f: ["Everything in Starter", "Up to 15 members", "Higher document and obligation limits", "AI obligation drafting (when released)", "Change comparison (when released)"], cta: ["Choose Growth", "/signup?plan=growth"] },
    { name: "Enterprise", key: "ent", for: "For organisations with many sites, entities or jurisdictions.", f: ["Custom usage limits", "Organisation controls", "Enterprise onboarding", "Negotiated commercial terms"], cta: ["Contact Sales", "#contact"] },
  ];
  return (
    <Section id="pricing" eyebrow="Pricing" title="Planned pricing, priced for small compliance teams." lede="Paid plans are not open yet. These are proposed launch prices and may change after early-access feedback. Creating an account is free while the product is being built.">
      <div className="mb-8 inline-flex rounded-lg border border-line bg-card p-1 text-sm" role="group" aria-label="Billing interval">
        {[["Monthly", false], ["Annual", true]].map(([l, v]) => <button key={l} aria-pressed={annual === v} onClick={() => setAnnual(v)} className={cx("rounded-md px-4 py-1.5", annual === v ? "bg-ink text-paper" : "text-muted")}>{l}</button>)}
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {plans.map((p) => { const pr = PRICES[p.key]; return (
          <div key={p.name} className={cx("card flex flex-col p-7", p.hi && "border-teal ring-2 ring-teal/30")}>
            <div className="flex items-center justify-between"><h3 className="text-lg font-semibold">{p.name}</h3>{p.hi && <span className="tag bg-teal-soft text-teal">Most teams</span>}</div>
            <p className="mt-1 text-sm text-muted">{p.for}</p>
            <p className="mt-6 font-serif text-4xl text-ink">{pr ? `$${annual ? pr.y : pr.m}` : "Custom"}<span className="font-sans text-sm text-muted">{pr && " /month"}</span></p>
            <p className="mt-1 h-5 text-xs text-muted">{pr && (annual ? `Billed $${pr.y * 12} annually · save $${(pr.m - pr.y) * 12}/yr` : "Billed monthly")}</p>
            <ul className="mt-6 flex-1 space-y-2 text-sm">{p.f.map((f) => <li key={f} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />{f}</li>)}</ul>
            {p.cta[1].startsWith("#") ? <a href={p.cta[1]} className="btn-ghost mt-7">{p.cta[0]}</a> : <Link to={p.cta[1]} className={cx("mt-7", p.hi ? "btn-teal" : "btn-primary")}>{p.cta[0]}</Link>}
          </div>); })}
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3 text-sm">
        {[["Can I pay today?", "No. Checkout isn't enabled until pricing and billing terms are confirmed. You can create an account and use the workspace."], ["What's included right now?", "The obligation register, source library, deadline timeline, gap flags and exports. AI drafting and change comparison are in development."], ["Why per-team pricing?", "AI document processing has real per-document costs; limits keep pricing low for small teams."]].map(([q, a]) => <div key={q}><p className="font-semibold text-ink">{q}</p><p className="mt-1 text-muted">{a}</p></div>)}
      </div>
    </Section>
  );
}

function LeadForm() {
  const [f, setF] = useState({ name: "", email: "", company: "", size: "", useCase: "", message: "" });
  const [err, setErr] = useState({}); const [state, setState] = useState("idle"); const [msg, setMsg] = useState("");
  const on = (k) => (e) => setF({ ...f, [k]: e.target.value });
  async function submit(e) {
    e.preventDefault();
    const er = {};
    if (!f.name.trim()) er.name = "Enter your full name";
    if (!isEmail(f.email)) er.email = "Enter a valid business email";
    if (!f.company.trim()) er.company = "Enter your company";
    if (!f.size) er.size = "Select company size";
    if (!f.useCase) er.useCase = "Select a use case";
    if (f.message.trim().length < 10) er.message = "Tell us a little more (10+ characters)";
    setErr(er); if (Object.keys(er).length) return;
    setState("loading");
    try { await submitLead({ full_name: f.name, email: f.email, company: f.company, company_size: f.size, use_case: f.useCase, message: f.message }); setState("ok"); }
    catch (x) { setState("err"); setMsg(x.message); }
  }
  if (state === "ok") return <div className="card p-8"><h3 className="text-lg font-semibold">Thanks, your message was received.</h3><p className="mt-2 text-muted">We'll reply to {f.email}.</p></div>;
  return (
    <form onSubmit={submit} noValidate className="card grid gap-4 p-6 md:grid-cols-2 md:p-8">
      <Field label="Full Name" id="l-name" error={err.name}><input id="l-name" className="input" value={f.name} onChange={on("name")} autoComplete="name" /></Field>
      <Field label="Business Email" id="l-email" error={err.email}><input id="l-email" type="email" className="input" value={f.email} onChange={on("email")} autoComplete="email" /></Field>
      <Field label="Company" id="l-co" error={err.company}><input id="l-co" className="input" value={f.company} onChange={on("company")} autoComplete="organization" /></Field>
      <Field label="Company Size" id="l-size" error={err.size}><select id="l-size" className="input" value={f.size} onChange={on("size")}><option value="">Select…</option>{["1–10", "11–50", "51–200", "201–1,000", "1,000+"].map((o) => <option key={o}>{o}</option>)}</select></Field>
      <div className="md:col-span-2"><Field label="Primary Use Case" id="l-uc" error={err.useCase}><select id="l-uc" className="input" value={f.useCase} onChange={on("useCase")}><option value="">Select…</option>{["Obligation register", "Licence & permit deadlines", "Regulatory change tracking", "Audit / inspection readiness", "Consulting for clients", "Other"].map((o) => <option key={o}>{o}</option>)}</select></Field></div>
      <div className="md:col-span-2"><Field label="Message" id="l-msg" error={err.message}><textarea id="l-msg" rows={4} className="input" value={f.message} onChange={on("message")} /></Field></div>
      {state === "err" && <p className="md:col-span-2 rounded-lg bg-red-soft px-3 py-2 text-sm text-red" role="alert">{msg}</p>}
      <div className="md:col-span-2"><button className="btn-primary" disabled={state === "loading"}>{state === "loading" && <Spinner />}Send inquiry</button></div>
    </form>
  );
}

export default function HomeSections() {
  const f = business.founders;
  return (
    <>
      <Hero />
      <section aria-label="Product highlights" className="border-y border-line-2 bg-card/60"><div className="wrap grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">{highlights.map(([k, t]) => <div key={k}><p className="font-semibold text-ink">{k}</p><p className="mt-1 text-sm text-muted">{t}</p></div>)}</div></section>

      <Section id="problem" eyebrow="The problem" title="Regulation arrives as prose. Compliance runs on tasks." lede="Someone reads a 140-page amendment, copies requirements into a spreadsheet, emails department heads and hopes the renewal date is in somebody's calendar.">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-line bg-paper-2 p-7"><h3 className="font-semibold">How it works today</h3><ul className="mt-4 space-y-3 text-sm text-muted">{["Specialists spend days turning dense legal text into a list of tasks.", "Spreadsheet registers lose the link to the source clause, so nobody can tell why a row exists.", "Amended rules arrive as whole documents; spotting what changed is slow and error-prone.", "Renewals, inspections and filings sit in different calendars owned by different people. A missed quarterly emissions report or lapsed customs licence has real penalties."].map((t) => <li key={t}>— {t}</li>)}</ul></div>
          <div className="rounded-2xl bg-ink p-7 text-paper/80"><h3 className="font-semibold text-paper">How Aurevex handles it</h3><ul className="mt-4 space-y-3 text-sm">{["Each requirement becomes a discrete obligation with frequency, owner, deadline and evidence.", "Every obligation keeps its citation, so it can be verified in one click.", "Dated obligations feed one timeline; gaps are flagged automatically.", "AI drafting and version comparison, in development, remove the manual reading step."].map((t) => <li key={t} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-2" />{t}</li>)}</ul></div>
        </div>
      </Section>

      <Section id="product" eyebrow="Product" title="One compliance workflow, from rule to evidence." lede="Each capability feeds the next: sources produce obligations, obligations produce deadlines, deadlines and evidence produce gap flags." className="bg-card/50">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {feats.map(({ icon: I, name, text, benefit, ui, soon }) => (
            <article key={name} className="card flex flex-col p-6">
              <div className="flex items-center justify-between"><I className="h-6 w-6 text-teal" />{soon && <span className="tag bg-blue-soft text-blue">In development</span>}</div>
              <h3 className="mt-4 text-lg font-semibold">{name}</h3><p className="mt-2 text-sm text-muted">{text}</p>
              <div className="mt-4 space-y-1.5 rounded-lg border border-line-2 bg-paper p-3 font-mono text-[0.72rem] text-ink-3">{ui.map((u) => <p key={u}>{u}</p>)}</div>
              <p className="mt-4 text-sm font-medium text-ink">{benefit}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-4"><Link to="/signup" className="btn-primary">Try the workspace</Link><span className="text-sm text-muted">Includes a sample manufacturer workspace you can edit.</span></div>
      </Section>

      <Section id="how" eyebrow="How it works" title="From publication to evidence in four steps.">
        <ol className="grid gap-5 md:grid-cols-4">{[["Add your sources", "Record regulations, permits, licences and guidance with version and scope."], ["Capture obligations", "Add obligations with citation, frequency and evidence. AI drafting from documents is being built."], ["Review and assign", "Confirm each obligation against its clause and assign an owner and department."], ["Monitor and evidence", "Track deadlines, record evidence and close gaps before they become findings."]].map(([t, d], i) => <li key={t} className="border-t-2 border-ink pt-5"><span className="font-mono text-sm text-teal">0{i + 1}</span><h3 className="mt-2 font-semibold">{t}</h3><p className="mt-2 text-sm text-muted">{d}</p></li>)}</ol>
      </Section>

      <Section id="solutions" eyebrow="Who it's for" title="Built for teams that answer to regulators." className="bg-card/50">
        <div className="grid gap-5 md:grid-cols-2">{segments.map(({ icon: I, who, ch, use, ben }) => <div key={who} className="card p-6"><I className="h-6 w-6 text-teal" /><h3 className="mt-3 text-lg font-semibold">{who}</h3><dl className="mt-3 space-y-2 text-sm"><div><dt className="inline font-semibold text-ink">Challenge: </dt><dd className="inline text-muted">{ch}</dd></div><div><dt className="inline font-semibold text-ink">With Aurevex: </dt><dd className="inline text-muted">{use}</dd></div><div><dt className="inline font-semibold text-ink">Benefit: </dt><dd className="inline text-muted">{ben}</dd></div></dl></div>)}</div>
      </Section>

      <Section id="technology" eyebrow="Technology" title="How We Use Amazon Web Services" lede="Aurevex's document pipeline is designed as a serverless, event-driven architecture on AWS: regulatory documents are stored and versioned in Amazon S3, read by Amazon Textract, interpreted into draft obligations by Amazon Bedrock and recorded in Amazon DynamoDB for human review. This pipeline is being built; today's workspace runs on a standard web stack.">
        <ol className="grid gap-3 md:grid-cols-5">{stages.map((s, i) => <li key={s.name} className="relative rounded-2xl bg-ink p-5 text-paper/80"><span className="font-mono text-xs text-teal-2">0{i + 1}</span><p className="mt-1 font-semibold text-paper">{s.name}</p><p className="mt-2 text-xs font-medium text-teal-2">{s.service}</p><p className="mt-2 text-xs">{s.role}</p></li>)}</ol>
        <ul className="mt-10 grid gap-x-10 gap-y-3 text-sm md:grid-cols-2">{aws.proposed.map((s) => <li key={s.service}><span className="font-semibold text-ink">{s.service}:</span> <span className="text-muted">{s.purpose}</span></li>)}</ul>
        <p className="mt-8 max-w-3xl text-sm text-muted">Model output is treated as a draft: an obligation enters the register only after a reviewer confirms it against its cited clause. Using AWS does not by itself make Aurevex certified under any security or compliance standard, and we make no such claim.</p>
      </Section>

      <Pricing />

      <Section id="progress" eyebrow="Where we are" title="Building the initial product." lede={business.stageSummary} className="bg-card/50">
        <div className="grid gap-5 md:grid-cols-3">{[["Now", ["Accounts, onboarding and obligation workspace", "Register, timeline, gaps and exports", "AWS architecture defined"]], ["Next", ["Document ingestion on Amazon S3 + Textract", "AI obligation drafting with Amazon Bedrock", "Working sessions with early-access teams"]], ["Then", ["Change comparison between versions", "Deadline reminder emails", "Paid plans after pricing validation"]]].map(([h, l]) => <div key={h} className="card p-6"><p className="eyebrow">{h}</p><ul className="mt-3 space-y-2 text-sm text-muted">{l.map((x) => <li key={x}>• {x}</li>)}</ul></div>)}</div>
      </Section>

      <Section id="team" eyebrow="Team" title="The Team Behind Aurevex">
        <div className="grid gap-5 md:grid-cols-3">{f.map((p) => <div key={p.name} className="card p-6"><div className="grid h-14 w-14 place-items-center rounded-full bg-ink font-serif text-xl text-paper">{p.name.split(" ").map((x) => x[0]).join("")}</div><h3 className="mt-4 text-lg font-semibold">{p.name}</h3><p className="text-sm text-teal">{p.title}</p><p className="mt-3 text-sm text-muted">{p.bio}</p>{p.linkedin.verified && p.linkedin.value && <a href={p.linkedin.value} className="mt-3 inline-flex items-center gap-1.5 text-sm text-blue" rel="noopener"><Linkedin className="h-4 w-4" />LinkedIn</a>}</div>)}</div>
      </Section>

      <Section id="contact" eyebrow="Contact" title="Talk to us about your regulatory sources." lede="Tell us which regulations, permits or licences your team tracks today. Early-access teams help shape the obligation model and reviewer workflow.">
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
          <div className="space-y-3 text-sm text-muted">
            {business.email.verified && business.email.value && <p>Email: <a className="text-ink underline" href={`mailto:${business.email.value}`}>{business.email.value}</a></p>}
            {business.headquarters.verified && business.headquarters.value && <p>Headquarters: {business.headquarters.value}</p>}
            {business.linkedinCompany.verified && business.linkedinCompany.value && <a className="text-blue" href={business.linkedinCompany.value}>LinkedIn</a>}
            <p>Prefer to look first? <Link to="/signup" className="text-ink underline">Create an account</Link> and explore the sample workspace.</p>
          </div>
          <LeadForm />
        </div>
      </Section>
    </>
  );
}
