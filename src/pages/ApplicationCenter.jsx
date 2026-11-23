import { useEffect, useMemo, useState } from "react";
import { Copy, Download, Printer, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Logo, useToast } from "../components/ui/index.jsx";
import { Seo } from "../components/layout/Seo.jsx";
import { business, aws, stages, features, missingFacts, SITE_URL } from "../data/business.js";
import { generateAnswers, answersAsText } from "../data/aws-answers.js";
import { copy, downloadFile, cx } from "../lib/utils.js";

const CHECKS = ["Website publicly accessible", "Business domain configured", "Business email verified", "Founder identity consistent", "LinkedIn company page created", "Product stage accurate", "AWS account information consistent", "AWS services accurately described", "Application answers reviewed", "Required supporting documents available"];
const SECTIONS = [["overview", "Business Overview"], ["brand", "Brand Assets"], ["linkedin", "LinkedIn Profile Kit"], ["activate", "AWS Activate Application"], ["arch", "AWS Architecture"], ["team", "Founder & Team"], ["info", "Business Information"], ["checklist", "Readiness Checklist"], ["downloads", "Downloads & Exports"]];

export default function ApplicationCenter() {
  const toast = useToast();
  const [answers, setAnswers] = useState(() => generateAnswers());
  const [checks, setChecks] = useState(() => { try { return JSON.parse(localStorage.getItem("aurevex.checklist")) || {}; } catch { return {}; } });
  useEffect(() => { localStorage.setItem("aurevex.checklist", JSON.stringify(checks)); }, [checks]);
  const missing = useMemo(() => missingFacts(), []);
  const cp = async (t, l = "Copied") => { try { await copy(t); toast(l); } catch { toast("Clipboard blocked by the browser", "err"); } };
  const CopyBtn = ({ t, label = "Copy" }) => <button onClick={() => cp(t)} className="btn-ghost px-2.5 py-1.5 text-xs no-print"><Copy className="h-3.5 w-3.5" />{label}</button>;


  const li = business; const overview = linkedinOverview();
  const H = ({ id, children }) => <h2 id={id} className="scroll-mt-6 border-b border-line-2 pb-3 pt-12 text-2xl">{children}</h2>;
  const Row = ({ k, v, copyable = true }) => <div className="flex items-start justify-between gap-4 border-b border-line-2 py-3 text-sm"><div><p className="text-xs text-muted">{k}</p><p className="mt-0.5 whitespace-pre-line text-ink">{v || <span className="text-amber">Needs confirmation</span>}</p></div>{copyable && v && <CopyBtn t={v} />}</div>;
  const fact = (f) => f.value ? `${f.value}${f.verified ? "" : " (unconfirmed)"}` : "";

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[250px_1fr]"><Seo path="/app" title="Company & AWS Activate information | Aurevex" desc="Aurevex company details, AWS architecture and AWS Activate application information." />
      <aside className="no-print hidden bg-ink p-5 text-paper/70 lg:block"><div className="sticky top-5"><Logo dark /><p className="mt-2 text-xs">Company &amp; AWS Activate information</p><nav className="mt-8 space-y-1 text-sm">{SECTIONS.map(([id, l]) => <a key={id} href={`#${id}`} className="block rounded px-3 py-1.5 hover:bg-white/5">{l}</a>)}</nav></div></aside>
      <main className="mx-auto w-full max-w-4xl px-5 pb-24 md:px-10">
        <H id="overview">Business Overview</H>
        {missing.length > 0 && <div className="mt-5 rounded-xl border border-amber/40 bg-amber-soft p-4 text-sm"><p className="flex items-center gap-2 font-semibold text-ink"><AlertTriangle className="h-4 w-4 text-amber" />{missing.length} facts need confirmation before you submit anything</p><ul className="mt-2 space-y-1 text-muted">{missing.map((m) => <li key={m.key}><code className="text-ink">{m.key}</code>: {m.note}{m.value && ` (current: ${m.value})`}</li>)}</ul><p className="mt-2 text-xs text-muted">Edit <code>src/data/business.js</code> and set <code>verified: true</code> once confirmed.</p></div>}
        <Row k="Positioning statement" v={business.positioning} /><Row k="One-sentence description" v={business.oneLiner} /><Row k="Product stage" v={business.stage} /><Row k="Stage summary" v={business.stageSummary} />
        <div className="mt-4 overflow-x-auto"><table className="w-full text-sm"><thead className="text-left text-muted"><tr><th className="py-2">Capability</th><th>Classification</th></tr></thead><tbody className="divide-y divide-line-2">{features.map((f) => <tr key={f.name}><td className="py-2 pr-4"><b className="text-ink">{f.name}</b><span className="block text-xs text-muted">{f.detail}</span></td><td><span className={cx("tag", f.status === "Implemented" ? "bg-teal-soft text-teal" : f.status === "Prototype" ? "bg-amber-soft text-amber" : "bg-blue-soft text-blue")}>{f.status}</span></td></tr>)}</tbody></table></div>

        <H id="brand">Brand Assets</H>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">{[["Logo", "/assets/logo.svg", "aurevex-logo.svg"], ["Transparent mark", "/assets/logo-transparent.svg", "aurevex-mark.svg"], ["Favicon", "/favicon.svg", "favicon.svg"]].map(([l, src, n]) => <div key={l} className="card p-4"><div className="grid h-24 place-items-center rounded bg-paper"><img src={src} alt={l} className="max-h-16" /></div><p className="mt-3 text-sm font-medium">{l}</p><a href={src} download={n} className="btn-ghost mt-2 w-full text-xs"><Download className="h-3.5 w-3.5" />Download SVG</a></div>)}</div>
        <div className="card mt-4 p-4"><img src="/assets/linkedin-banner.svg" alt="LinkedIn banner" className="w-full rounded" /><div className="mt-3 flex flex-wrap gap-2"><a href="/assets/linkedin-banner.svg" download="aurevex-linkedin-banner.svg" className="btn-ghost text-xs"><Download className="h-3.5 w-3.5" />SVG</a><button className="btn-ghost text-xs" onClick={() => svgToPng("/assets/linkedin-banner.svg", 1584, 396, "aurevex-linkedin-banner.png").catch(() => toast("PNG export failed", "err"))}><Download className="h-3.5 w-3.5" />PNG 1584×396</button><button className="btn-ghost text-xs" onClick={() => svgToPng("/assets/logo-transparent.svg", 400, 400, "aurevex-logo-transparent.png")}><Download className="h-3.5 w-3.5" />Transparent logo PNG 400×400</button></div><p className="mt-2 text-xs text-muted">Content sits right of centre to keep clear of LinkedIn's profile-logo overlay (bottom-left).</p></div>
        <div className="mt-4 flex flex-wrap gap-3">{[["Ink", "#0F1B2D"], ["Paper", "#F6F3EC"], ["Teal", "#1F7A6B"], ["Teal light", "#3FB59E"], ["Amber", "#B8741F"], ["Blue", "#2F4A7A"], ["Red", "#B4442F"]].map(([n, c]) => <button key={c} onClick={() => cp(c, `${c} copied`)} className="card flex items-center gap-2 p-2 pr-3 text-xs"><span className="h-8 w-8 rounded border border-line" style={{ background: c }} />{n}<code className="text-muted">{c}</code></button>)}</div>
        <p className="mt-3 text-sm text-muted">Typography: <b className="font-serif text-ink">Fraunces</b> (headings), <b className="text-ink">Inter</b> (UI and body), <b className="font-mono text-ink">IBM Plex Mono</b> (citations and data).</p>

        <H id="linkedin">LinkedIn Profile Kit</H>
        <Row k="Company name" v={li.name} /><Row k="Website" v={SITE_URL || fact(li.domain)} /><Row k="Industry" v={li.linkedinIndustry} /><Row k="Company type" v={li.companyType} /><Row k="Company size" v={fact(li.teamSize)} /><Row k="Founded" v={fact(li.foundedYear)} /><Row k="Headquarters" v={fact(li.headquarters)} />
        <Row k="LinkedIn company page" v={li.linkedinCompany.value} />
        <Row k={`Tagline (${li.linkedinTagline.length}/120)`} v={li.linkedinTagline} /><Row k={`Overview (${overview.length}/2,000)`} v={overview} /><Row k={`Specialties (${li.specialties.length})`} v={li.specialties.join(", ")} />
        

        <H id="activate">AWS Activate Application</H>
        <div className="no-print mt-5 flex flex-wrap gap-2"><button className="btn-primary" onClick={() => cp(answersAsText(), "All answers copied")}><Copy className="h-4 w-4" />Copy All Answers</button><button className="btn-ghost" onClick={() => downloadFile("aurevex-aws-activate-answers.txt", answersAsText())}><Download className="h-4 w-4" />Download Answers</button><button className="btn-ghost" onClick={() => window.print()}><Printer className="h-4 w-4" />Print Summary</button><button className="btn-ghost" onClick={() => { setAnswers(generateAnswers()); toast("Answers regenerated from business record"); }}><RefreshCw className="h-4 w-4" />Regenerate Answers</button><a href="#overview" className="btn-ghost"><AlertTriangle className="h-4 w-4" />Review Missing Information</a></div>
        <div className="mt-5 space-y-4">{answers.map((x) => (
          <div key={x.n} className="card break-inside-avoid p-5">
            <div className="flex flex-wrap items-start justify-between gap-2"><p className="font-semibold text-ink">Q{x.n} — {x.q}</p><span className={cx("tag", x.status.startsWith("Assumed") ? "bg-amber-soft text-amber" : "bg-teal-soft text-teal")}>{x.status}</span></div>
            <div className="mt-3 space-y-1.5">{x.a.map((a) => <div key={a} className="flex items-center justify-between gap-3 rounded-lg bg-paper px-3 py-2 text-sm"><span>{a}</span><CopyBtn t={a} /></div>)}</div>
            {x.key === "q9" && <p className="mt-2 text-xs text-muted">Character count: {x.a[0].length} (limit 30–250)</p>}
            <p className="mt-2 text-sm text-muted"><b className="text-ink">Reason:</b> {x.why}</p>
            {x.issues.map((i) => <p key={i} className="mt-1 flex items-center gap-1.5 text-xs text-amber"><AlertTriangle className="h-3.5 w-3.5" />{i}</p>)}
          </div>))}</div>

        <H id="arch">AWS Architecture</H>
        <ol className="mt-5 grid gap-2 md:grid-cols-5">{stages.map((s, i) => <li key={s.name} className="rounded-xl bg-ink p-4 text-xs text-paper/80"><span className="font-mono text-teal-2">0{i + 1}</span><p className="font-semibold text-paper">{s.name}</p><p className="mt-1 text-teal-2">{s.service}</p></li>)}</ol>
        <p className="mt-4 text-sm"><b>Deployed and verified:</b> {aws.deployed.length ? aws.deployed.map((s) => s.service).join(", ") : "None yet"}</p><p className="text-sm"><b>Being implemented:</b> {aws.inProgress.length ? aws.inProgress.map((s) => s.service).join(", ") : "None yet"}</p>
        <p className="mt-3 text-sm font-semibold">Proposed</p><ul className="mt-1 space-y-1 text-sm text-muted">{aws.proposed.map((s) => <li key={s.service}><b className="text-ink">{s.service}:</b> {s.purpose}</li>)}</ul>
        <p className="mt-3 text-sm font-semibold">Current technology stack</p><ul className="mt-1 list-disc pl-5 text-sm text-muted">{aws.currentStack.map((s) => <li key={s}>{s}</li>)}</ul>

        <H id="team">Founder & Team</H>
        {business.founders.map((f) => <div key={f.name}><Row k="Name" v={f.name} /><Row k="Title" v={f.title} /><Row k="Bio" v={f.bio} /><Row k="LinkedIn" v={fact(f.linkedin)} /></div>)}
        <Row k="Team size" v={fact(business.teamSize)} />

        <H id="info">Business Information (AWS Activate details)</H>
        {[["Company name and website", `${business.name} — ${SITE_URL || fact(business.domain) || "website to confirm"}`], ["One-sentence description", business.oneLiner], ["Primary customers and industry", `Businesses: ${business.customers.join(", ")}. Industry: RegTech / compliance software.`], ["Product stage", business.stage], ["Planned launch date", fact(business.launchDate)], ["Customer interaction channels", "Web browser"], ["AI/ML usage", "Core product: AI interpretation of regulatory text into obligations (Amazon Textract + Amazon Bedrock, being built). Not yet in production."], ["Funding and most recent round", fact(business.funding)], ["Valuation", fact(business.valuation)], ["Technology stack and AWS services", `${aws.currentStack.join("; ")}. Proposed AWS: ${aws.proposed.map((s) => s.service).join(", ")}.`], ["Expected AWS infrastructure spend", fact(business.awsSpend)], ["Planned annual marketing budget", fact(business.marketingSpend)], ["Team size and country", `${fact(business.teamSize)}${business.country.value ? ", " + fact(business.country) : ", country to confirm"}`], ["Goals for the next 6–12 months", business.goals.map((g) => "• " + g).join("\n")]].map(([k, v]) => <Row key={k} k={k} v={v} />)}

        <H id="checklist">Application Readiness Checklist</H>
        <p className="mt-3 text-xs text-muted">Tick an item only when you have the evidence. Saved in this browser.</p>
        <ul className="mt-3 space-y-2">{CHECKS.map((c) => <li key={c}><label className="card flex cursor-pointer items-center gap-3 p-3 text-sm"><input type="checkbox" checked={!!checks[c]} onChange={(e) => setChecks({ ...checks, [c]: e.target.checked })} className="h-4 w-4 accent-teal" />{c}{checks[c] && <CheckCircle2 className="ml-auto h-4 w-4 text-teal" />}</label></li>)}</ul>
        <p className="mt-2 text-sm text-muted">{Object.values(checks).filter(Boolean).length}/{CHECKS.length} complete</p>

        <H id="downloads">Downloads & Exports</H>
        <div className="mt-5 flex flex-wrap gap-2">
          <button className="btn-ghost" onClick={() => downloadFile("aurevex-aws-activate-answers.txt", answersAsText())}><Download className="h-4 w-4" />AWS Activate answers (.txt)</button>
          <button className="btn-ghost" onClick={() => downloadFile("aurevex-linkedin-kit.txt", `Name: ${li.name}\nIndustry: ${li.linkedinIndustry}\nType: ${li.companyType}\nSize: ${fact(li.teamSize)}\nFounded: ${fact(li.foundedYear)}\nLinkedIn page: ${li.linkedinCompany.value}\n\nTagline:\n${li.linkedinTagline}\n\nOverview:\n${overview}\n\nSpecialties:\n${li.specialties.join(", ")}\n`)}><Download className="h-4 w-4" />LinkedIn kit (.txt)</button>
          <button className="btn-ghost" onClick={() => downloadFile("aurevex-business-record.json", JSON.stringify({ business, aws, features }, null, 2), "application/json")}><Download className="h-4 w-4" />Business record (.json)</button>
          <button className="btn-ghost" onClick={() => window.print()}><Printer className="h-4 w-4" />Print everything</button>
        </div>
      </main>
    </div>
  );
}

export function linkedinOverview() {
  return `Aurevex is regulatory intelligence software for compliance, legal and operations teams in regulated industries, including financial services, manufacturing, healthcare and medical devices, logistics and trade, and construction.

Regulations arrive as long documents, but compliance work runs on tasks. Most teams still read amendments by hand, copy requirements into spreadsheets that lose the link to the source clause, and track licence renewals, inspections and filings in scattered calendars. Missed deadlines and unnoticed amendments lead to penalties, findings and stopped operations.

Aurevex turns regulations, permits and guidance into a register of obligations. Each obligation keeps its source citation, department, owner, frequency, due date and the evidence that proves it was done. A single deadline timeline and automatic gap flags (no owner, no evidence, past due) show where work is at risk.

We are building AI obligation drafting and regulatory change comparison on AWS, using Amazon Textract to read documents and Amazon Bedrock to draft obligations and explain what changed between versions. Every AI draft is reviewed by a person against its cited clause before it enters the register.

Aurevex is currently building its initial product.`;
}

async function svgToPng(src, w, h, name) {
  const svg = await (await fetch(src)).text();
  const img = new Image(); img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  await img.decode(); const c = Object.assign(document.createElement("canvas"), { width: w, height: h });
  c.getContext("2d").drawImage(img, 0, 0, w, h);
  const a = Object.assign(document.createElement("a"), { href: c.toDataURL("image/png"), download: name }); a.click();
}
