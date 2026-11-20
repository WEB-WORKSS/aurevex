// Prerenders public marketing routes to static HTML so content is crawlable, then writes sitemap.xml.
import fs from "node:fs"; import path from "node:path"; import { pathToFileURL } from "node:url";
const dist = path.resolve("dist"); const tpl = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const { render, PAGES } = await import(pathToFileURL(path.resolve("dist-ssr/entry-server.js")).href);
const SITE = (process.env.VITE_SITE_URL || "").replace(/\/$/, "");
const routes = ["/", "/privacy", "/terms", "/login", "/signup", "/forgot-password"];
const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
for (const r of routes) {
  const p = PAGES[r]; let html = tpl.replace("<!--app-->", render(r)).replace('<div id="root">', `<div id="root" data-prerendered="${r}">`)
    .replace(/<title>.*?<\/title>/, `<title>${esc(p.title)}</title>`).replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${esc(p.desc)}" />`);
  const head = [`<meta property="og:type" content="website" />`, `<meta property="og:site_name" content="Aurevex" />`, `<meta property="og:title" content="${esc(p.title)}" />`, `<meta property="og:description" content="${esc(p.desc)}" />`, `<meta name="twitter:card" content="summary_large_image" />`, `<meta name="twitter:title" content="${esc(p.title)}" />`, `<meta name="twitter:description" content="${esc(p.desc)}" />`];
  if (SITE) head.push(`<link rel="canonical" href="${SITE}${r}" />`, `<meta property="og:url" content="${SITE}${r}" />`, `<meta property="og:image" content="${SITE}/assets/linkedin-banner.svg" />`);
  if (r === "/") head.push(`<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", name: "Aurevex", description: p.desc, ...(SITE && { url: SITE, logo: SITE + "/assets/logo.svg" }), founder: { "@type": "Person", name: "Akanbi Zulu", jobTitle: "Founder & CEO" } })}</script>`);
  html = html.replace("<!--seo-->", head.join("\n"));
  const out = r === "/" ? path.join(dist, "index.html") : path.join(dist, r.slice(1), "index.html");
  fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, html);
}
// SPA fallback for private routes: unrendered shell, noindex
fs.writeFileSync(path.join(dist, "200.html"), tpl.replace("<!--seo-->", '<meta name="robots" content="noindex" />').replace("<!--app-->", ""));
if (SITE) fs.writeFileSync(path.join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${["/", "/privacy", "/terms"].map((r) => `  <url><loc>${SITE}${r}</loc></url>`).join("\n")}\n</urlset>\n`);
else console.warn("VITE_SITE_URL not set: sitemap.xml and canonical URLs skipped.");
fs.rmSync("dist-ssr", { recursive: true, force: true });
console.log("Prerendered", routes.length, "routes");
