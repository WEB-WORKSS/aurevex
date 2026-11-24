// Canonical business record. Every page, the LinkedIn kit, SEO and the AWS Activate answers read from here.
// `verified: false` values are assumptions or gaps and are tracked in docs/. Never show them as fact.

export const SITE_URL = (import.meta.env?.VITE_SITE_URL || "").replace(/\/$/, "");

export const business = {
  name: "Aurevex",
  legalName: { value: "", verified: false, note: "Registered legal entity name and country of incorporation" },
  domain: { value: "", verified: false, note: "Company domain (e.g. used for VITE_SITE_URL and business email)" },
  email: { value: "", verified: false, note: "Official business email on the company domain" },
  headquarters: { value: "Ilorin, Kwara, Nigeria", verified: true, note: "" },
  country: { value: "Nigeria", verified: true, note: "" },
  foundedYear: { value: "2026", verified: true, note: "" },
  foundedDate: { value: "February 16, 2026", verified: true, note: "" },
  teamSize: { value: "2–10 employees", verified: false, note: "Suggested LinkedIn bracket: confirm actual headcount" },
  linkedinCompany: { value: "https://www.linkedin.com/company/aure-vex", verified: true, note: "" },
  suggestedLinkedinSlug: "aure-vex",
  launchDate: { value: "January 12, 2027", verified: true, note: "Planned launch date set by the founder" },
  funding: { value: "No Funding", verified: false, note: "Confirm no external funding has been raised" },
  valuation: { value: "Less than $1 Million", verified: true, note: "" },
  awsSpend: { value: "75 - 99%", verified: false, note: "Estimate based on the proposed all-AWS production architecture; no AWS spend today" },
  marketingSpend: { value: "< $250,000", verified: false, note: "Confirm planned annual marketing budget" },

  tagline: "Intelligent Compliance. Complete Business Confidence.",
  linkedinTagline: "AI regulatory intelligence that turns regulations into cited, owner-assigned obligations, deadlines and change alerts.",
  oneLiner: "Aurevex turns regulatory documents into structured, owner-assigned obligations with source citations, deadlines and change tracking.",
  positioning:
    "Aurevex is regulatory intelligence software for compliance, legal and operations teams in regulated industries. It turns regulations, permits and guidance into a register of obligations, each tied to its source clause, owner, deadline and required evidence, and shows which obligations are affected when a rule changes.",
  category: "B2B SaaS · Regulatory technology (RegTech)",
  linkedinIndustry: "Software Development",
  companyType: "Privately Held",
  stage: "Ideating/building initial product",
  stageSummary:
    "Aurevex is building its initial product. The website, account system and obligation workspace are working software; AI extraction and change comparison are being built on the proposed AWS architecture.",

  founders: [
    {
      name: "Zulu Akanbi",
      title: "Founder & CEO",
      bio: "Zulu founded Aurevex to give compliance teams a traceable, task-based view of the regulations they answer to, and leads product and engineering.",
      linkedin: { value: "", verified: false, note: "Founder LinkedIn profile URL" },
      photo: "",
    },
  ],

  customers: [
    "Financial institutions",
    "Manufacturers",
    "Healthcare and medical device organisations",
    "Logistics and import/export companies",
    "Construction firms",
    "Corporate legal departments",
    "Regulatory consulting firms",
  ],

  goals: [
    "Build the document ingestion and AI obligation-extraction pipeline on AWS (S3, Textract, Bedrock, Lambda, DynamoDB)",
    "Run working sessions with early-access compliance teams on their own regulatory sources",
    "Release an early-access version with change monitoring, deadline reminders and gap reports",
    "Validate pricing with early-access teams before opening paid plans",
  ],

  traction: [], // verified traction only; none supplied

  specialties: [
    "Regulatory intelligence", "Compliance management", "Obligation management", "Regulatory change management",
    "RegTech", "Compliance automation", "AI document analysis", "Obligation extraction", "Compliance gap analysis",
    "Deadline and licence tracking", "Permit compliance", "Audit readiness", "Evidence management",
    "Legal operations", "Natural language processing", "Enterprise SaaS", "Financial services compliance",
    "Manufacturing compliance", "Healthcare compliance", "Trade compliance",
  ],
};

// Feature classification (Part D2)
export const features = [
  { name: "Obligation register", status: "Implemented", detail: "Create, edit, search, filter, sort and delete obligations with citation, owner, department, frequency, due date and evidence." },
  { name: "Regulatory source library", status: "Implemented", detail: "Record regulations, permits and guidance with version, jurisdiction and scope." },
  { name: "Deadline timeline", status: "Implemented", detail: "All dated obligations in one chronological view with overdue and due-soon states." },
  { name: "Gap analysis", status: "Implemented", detail: "Rule-based flags for obligations with no owner, no evidence recorded or past due." },
  { name: "CSV and printable exports", status: "Implemented", detail: "Export the register to CSV or a print/PDF report." },
  { name: "Activity history", status: "Implemented", detail: "Per-workspace log of creates, edits, status changes and deletions." },
  { name: "AI obligation extraction", status: "Planned", detail: "Amazon Textract + Amazon Bedrock to draft obligations from uploaded documents for reviewer confirmation." },
  { name: "Regulatory change comparison", status: "Prototype", detail: "Clause-by-clause diff shown on the homepage with sample text; automated comparison is planned." },
  { name: "Deadline email reminders", status: "Planned", detail: "Scheduled reminders to owners ahead of due dates." },
];

// AWS classification (Part D3). Nothing is deployed yet.
export const aws = {
  deployed: [],
  inProgress: [],
  proposed: [
    { service: "Amazon S3", purpose: "Stores uploaded regulatory documents, version history and compliance evidence.", stage: "Secure storage" },
    { service: "Amazon Textract", purpose: "Extracts text, tables and forms from scanned regulations and permits.", stage: "Processing" },
    { service: "AWS Lambda", purpose: "Runs document analysis, version comparison and notification workflows.", stage: "Processing" },
    { service: "AWS Step Functions", purpose: "Coordinates the multi-step ingest → extract → review pipeline.", stage: "Processing" },
    { service: "Amazon Bedrock", purpose: "Interprets clauses into draft obligations and explains changes between versions, for human review.", stage: "AI intelligence" },
    { service: "Amazon DynamoDB", purpose: "Stores obligations, deadlines, owners and workspace records.", stage: "Application" },
    { service: "Amazon API Gateway", purpose: "Provides the managed API between the web app and the processing pipeline.", stage: "Application" },
    { service: "Amazon Cognito", purpose: "Manages user identities and workspace access in production.", stage: "Application" },
    { service: "Amazon EventBridge", purpose: "Schedules source checks and deadline reminder events.", stage: "Data collection" },
    { service: "Amazon Simple Email Service", purpose: "Sends deadline reminders and change alerts to obligation owners.", stage: "Application" },
    { service: "Amazon CloudWatch", purpose: "Logs, metrics and alarms for the pipeline.", stage: "Operations" },
  ],
  currentStack: [
    "Vite + React (JavaScript) + Tailwind CSS web application",
    "Supabase Auth and Postgres for accounts, onboarding and workspace data (when configured)",
    "Static hosting with SPA fallback",
  ],
};

export const stages = [
  { name: "Data collection", service: "Amazon EventBridge · upload", role: "Regulations, permits and guidance arrive by upload or scheduled source checks." },
  { name: "Secure storage", service: "Amazon S3", role: "Each document version is stored per workspace, with history kept for comparison." },
  { name: "Processing", service: "Amazon Textract · AWS Lambda", role: "Text and tables are extracted; Lambda functions split documents into clauses." },
  { name: "AI intelligence", service: "Amazon Bedrock", role: "Clauses become draft obligations and change summaries, each with its citation." },
  { name: "Application", service: "Amazon DynamoDB · API Gateway", role: "Reviewers confirm drafts; obligations, owners and deadlines are tracked in the workspace." },
];

export function missingFacts() {
  const out = [];
  const walk = (obj, prefix = "") => {
    for (const [k, v] of Object.entries(obj)) {
      if (v && typeof v === "object" && "verified" in v && !v.verified) out.push({ key: prefix + k, value: v.value, note: v.note });
    }
  };
  walk(business);
  business.founders.forEach((f, i) => walk(f, `founders[${i}].`));
  return out;
}
