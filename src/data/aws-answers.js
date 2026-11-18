import { business, aws } from "./business.js";
import { OPTIONS } from "./aws-options.js";

const b = business;
const v = (f) => (f.verified ? "Verified" : "Assumed — Confirm Before Submission");

export const Q9_TEXT =
  "Aurevex is AI regulatory intelligence software helping compliance teams turn regulations into cited, owner-assigned obligations and deadlines. We are building it on AWS with Amazon Textract and Amazon Bedrock.";

export function generateAnswers() {
  const qs = [
    { n: 1, q: "Top 3 ways AWS can help you", key: "q1", multi: true,
      a: ["Launching products faster", "Building scalable architecture", "Reducing burn rate"],
      why: "Pre-launch: the priority is shipping the extraction pipeline, on an architecture that scales with document volume, at low early cost.", status: "Recommended" },
    { n: 2, q: "AWS services to learn more about", key: "q2", multi: true,
      a: ["Amazon Bedrock", "Amazon Textract", "Amazon S3", "AWS Lambda", "AWS Step Functions", "Amazon DynamoDB", "Amazon API Gateway", "Amazon Cognito", "Amazon Simple Email Service", "Amazon Cloudwatch", "AWS Identity & Access", "AWS CloudFormation", "AWS Budgets", "AWS Cost Explorer"],
      why: "Matches the proposed architecture. Amazon EventBridge is part of the design but is not an option in the supplied list.", status: "Recommended" },
    { n: 3, q: "AWS tech topics to follow", key: "q3", multi: true,
      a: ["AI & machine learning", "Serverless", "Security", "AWS cost management"],
      why: "AI extraction is core, the pipeline is serverless, customer documents are sensitive, and cost control matters pre-revenue.", status: "Recommended" },
    { n: 4, q: "What type of customers do you primarily serve?", key: "q4", multi: true,
      a: ["Regulation Technology (RegTech)", "Compliance", "SaaS", "Artificial Intelligence (AI)", "Enterprise Software", "Financial Services", "Manufacturing"],
      why: "RegTech/Compliance is the category; Financial Services and Manufacturing are the strongest early verticals. If single-select, choose Regulation Technology (RegTech).", status: "Recommended" },
    { n: 5, q: "Primary target customers", key: "q5", a: ["Businesses"], why: "B2B software sold to compliance, legal and operations teams.", status: "Recommended" },
    { n: 6, q: "Current product stage", key: "q6", a: [b.stage], why: "The workspace and accounts work, but AI extraction is not built and there are no released customers.", status: "Recommended" },
    { n: 7, q: "How customers interact with the product", key: "q7", multi: true, a: ["Web browser"], why: "Web application only. No mobile app or public API exists or is in active development.", status: "Recommended" },
    { n: 8, q: "Does your product use AI/ML?", key: "q8", a: [OPTIONS.q8[0]], why: "AI interpretation of regulatory text into obligations is the core product (being built).", status: "Recommended" },
    { n: 9, q: "What are you building?", key: "q9", a: [Q9_TEXT], text: true, why: "Names the company, category, customer, benefit and technology; states AWS as being built, not deployed.", status: "Recommended" },
    { n: 10, q: "Planned product launch date", key: "q10", a: [b.launchDate.value], text: true, why: "No launch has happened. Proposed date about 3–4 months out.", status: v(b.launchDate) },
    { n: 11, q: "Most recent funding round", key: "q11", a: [b.funding.value], why: "No funding has been reported. Leave funding date fields blank.", status: v(b.funding) },
    { n: 12, q: "Latest valuation", key: "q12", a: [b.valuation.value], why: "No priced round reported.", status: v(b.valuation) },
    { n: 13, q: "Percentage of spend on AWS", key: "q13", a: [b.awsSpend.value], why: "The production architecture is entirely AWS; current hosting/auth tools are minor. Choose \"I'm not sure\" if you can't defend this.", status: v(b.awsSpend) },
    { n: 14, q: "Annual marketing spend", key: "q14", a: [b.marketingSpend.value], why: "Early-stage, founder-led outreach. Confirm the actual budget.", status: v(b.marketingSpend) },
  ];
  return qs.map((x) => ({ ...x, issues: validate(x) }));
}

export function validate(x) {
  const issues = [];
  const opts = OPTIONS[x.key];
  if (opts) x.a.forEach((a) => { if (!opts.includes(a)) issues.push(`"${a}" is not an exact option`); });
  if (x.key === "q1" && x.a.length !== 3) issues.push("Q1 needs exactly three selections");
  if (x.key === "q2" && x.a.length > 20) issues.push("Q2 allows at most 20");
  if (x.key === "q3" && (x.a.length < 3 || x.a.length > 6)) issues.push("Q3 needs 3–6");
  if (x.key === "q9") { const l = x.a[0].length; if (l < 30 || l > 250) issues.push(`Q9 is ${l} characters (30–250)`); }
  if (x.key === "q11") issues.push("Round labels beyond No Funding / Pre-seed / Seed must be checked on the live form");
  return issues;
}

export function answersAsText() {
  return generateAnswers()
    .map((x) => `Q${x.n} — ${x.q}\nSelected Answer:\n${x.a.map((a) => (x.multi ? "- " + a : a)).join("\n")}\nReason: ${x.why}${x.key === "q9" ? `\nCharacter Count: ${x.a[0].length}` : ""}\nVerification Status: ${x.status}\n`)
    .join("\n");
}

export const awsServiceSummary = aws.proposed.map((s) => `${s.service}: ${s.purpose}`);
