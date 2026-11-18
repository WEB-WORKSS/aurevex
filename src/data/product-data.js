// Fictional sample records for the local demo workspace ("Halden Industrial"). Not customer data.
const off = (d) => { const t = new Date(); t.setDate(t.getDate() + d); return t.toISOString().slice(0, 10); };
const id = (n) => `sample-${n}`;
export const DEPARTMENTS = ["EHS", "Facilities", "Quality", "Legal", "Trade", "Finance", "HR", "IT"];
export const STATUSES = ["Draft", "Open", "In progress", "Met"];
export const FREQUENCIES = ["One-off", "Monthly", "Quarterly", "Every 90 days", "Annual", "Every 3 years", "Ongoing", "Event-triggered", "Per shipment"];
export const RISKS = ["Low", "Medium", "High"];

export const seedSources = () => [
  { id: id("s1"), title: "Chemical Storage Rule", version: "Rev. 2026 (v4)", jurisdiction: "National", type: "Regulation", created_at: new Date().toISOString() },
  { id: id("s2"), title: "Medical Device Records Directive", version: "2025 consolidated", jurisdiction: "Regional", type: "Directive", created_at: new Date().toISOString() },
  { id: id("s3"), title: "Customs Licensing Regulation", version: "2024", jurisdiction: "National", type: "Regulation", created_at: new Date().toISOString() },
  { id: id("s4"), title: "Site Environmental Permit EP-221", version: "Issued 2023", jurisdiction: "Site", type: "Permit", created_at: new Date().toISOString() },
];

export const seedObligations = () => [
  { t: "Maintain flammable-liquid inventory register", src: "Chemical Storage Rule", cl: "§4.2(a)", dept: "EHS", owner: "EHS Manager", due: off(6), freq: "Monthly", st: "In progress", risk: "Medium", ev: "Signed monthly inventory register" },
  { t: "Competent-person inspection of storage areas", src: "Chemical Storage Rule", cl: "§4.2(b)", dept: "Facilities", owner: "Facilities Lead", due: off(21), freq: "Every 90 days", st: "Open", risk: "High", ev: "" },
  { t: "Notify authority of storage capacity change above 20%", src: "Chemical Storage Rule", cl: "§4.2(c)", dept: "Legal", owner: "Compliance Counsel", due: "", freq: "Event-triggered", st: "Met", risk: "Medium", ev: "Notification procedure" },
  { t: "Retain device history records", src: "Medical Device Records Directive", cl: "Art. 12(3)", dept: "Quality", owner: "QA Manager", due: off(45), freq: "Annual", st: "Open", risk: "High", ev: "Records retention policy" },
  { t: "Renew customs operator licence", src: "Customs Licensing Regulation", cl: "Sec. 9", dept: "Trade", owner: "", due: off(24), freq: "Every 3 years", st: "Open", risk: "High", ev: "" },
  { t: "Submit quarterly emissions report", src: "Site Environmental Permit EP-221", cl: "Cond. 7.1", dept: "EHS", owner: "Environmental Officer", due: off(-3), freq: "Quarterly", st: "In progress", risk: "High", ev: "" },
  { t: "Maintain origin documentation for exports", src: "Customs Licensing Regulation", cl: "Sec. 14(2)", dept: "Trade", owner: "Export Coordinator", due: "", freq: "Per shipment", st: "Met", risk: "Low", ev: "Certificates of origin" },
].map((o, i) => ({ ...o, id: id("o" + i), created_at: new Date(Date.now() - i * 1000).toISOString() }));
