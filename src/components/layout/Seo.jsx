import { useEffect } from "react";
import { SITE_URL } from "../../data/business.js";
export const PAGES = {
  "/": { title: "Aurevex | Regulatory intelligence for compliance teams", desc: "Aurevex turns regulatory documents into structured, owner-assigned obligations with source citations, deadlines and change tracking." },
  "/login": { title: "Sign in | Aurevex", desc: "Sign in to your Aurevex workspace." },
  "/signup": { title: "Create account | Aurevex", desc: "Create an Aurevex account and set up your compliance workspace." },
  "/forgot-password": { title: "Reset password | Aurevex", desc: "Recover access to your Aurevex account." },
  "/privacy": { title: "Privacy Policy | Aurevex", desc: "How Aurevex collects, uses and stores information." },
  "/terms": { title: "Terms of Service | Aurevex", desc: "Terms governing use of the Aurevex website and software." },
};
export function Seo({ path, title, desc, noindex }) {
  useEffect(() => {
    const p = PAGES[path] || {};
    document.title = title || p.title || "Aurevex";
    const set = (sel, attr, val) => { let el = document.head.querySelector(sel); if (!el) { el = document.createElement("meta"); const [k, v] = sel.match(/\[(.+?)="(.+?)"\]/).slice(1); el.setAttribute(k, v); document.head.appendChild(el); } el.setAttribute(attr, val); };
    set('meta[name="description"]', "content", desc || p.desc || "");
    set('meta[name="robots"]', "content", noindex ? "noindex, nofollow" : "index, follow");
    if (SITE_URL) { let l = document.head.querySelector('link[rel="canonical"]'); if (!l) { l = document.createElement("link"); l.rel = "canonical"; document.head.appendChild(l); } l.href = SITE_URL + path; }
  }, [path, title, desc, noindex]);
  return null;
}
