import { Link } from "react-router-dom";
import { Logo } from "../ui/index.jsx";
import { business } from "../../data/business.js";
export function Footer() {
  const li = business.linkedinCompany; const em = business.email;
  return (
    <footer className="bg-ink text-paper/70">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div><Logo dark /><p className="mt-4 max-w-sm text-sm">{business.oneLiner}</p></div>
        <nav className="grid grid-cols-2 gap-2 text-sm" aria-label="Footer">
          {[["Product", "/#product"], ["Solutions", "/#solutions"], ["Technology", "/#technology"], ["Pricing", "/#pricing"], ["Team", "/#team"], ["Contact", "/#contact"]].map(([l, h]) => <a key={l} href={h} className="hover:text-paper">{l}</a>)}
        </nav>
        <div className="space-y-2 text-sm">
          <Link to="/privacy" className="block hover:text-paper">Privacy Policy</Link>
          <Link to="/terms" className="block hover:text-paper">Terms of Service</Link>
          {li.verified && li.value && <a href={li.value} className="block hover:text-paper" rel="noopener">LinkedIn</a>}
          {em.verified && em.value && <a href={`mailto:${em.value}`} className="block hover:text-paper">{em.value}</a>}
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs">© 2026 Aurevex</div>
    </footer>
  );
}
