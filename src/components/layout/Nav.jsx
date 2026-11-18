import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, LayoutDashboard, Settings, LogOut, Building2 } from "lucide-react";
import { Logo } from "../ui/index.jsx";
import { useAuth } from "../../lib/auth.jsx";

const links = [["Product", "/#product"], ["Solutions", "/#solutions"], ["How It Works", "/#how"], ["Technology", "/#technology"], ["Pricing", "/#pricing"], ["Team", "/#team"], ["Contact", "/#contact"]];

export function ProfileMenu() {
  const { user, signOut, isDemo } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(); const nav = useNavigate();
  useEffect(() => { const h = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false); document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h); }, []);
  const name = user?.user_metadata?.full_name || user?.email || "Account";
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="flex items-center gap-2 rounded-lg border border-line bg-card px-2.5 py-1.5 text-sm">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-teal text-xs font-bold text-white">{name[0]?.toUpperCase()}</span>
        <span className="hidden max-w-32 truncate sm:inline">{name}</span><ChevronDown className="h-4 w-4 text-muted" />
      </button>
      {open && (
        <div className="card absolute right-0 z-50 mt-2 w-56 p-1.5 text-sm" role="menu">
          {isDemo && <p className="px-3 py-2 text-xs text-amber">Local demo session (this browser only)</p>}
          <Link role="menuitem" className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-paper-2" to="/dashboard" onClick={() => setOpen(false)}><LayoutDashboard className="h-4 w-4" />Dashboard</Link>
          <Link role="menuitem" className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-paper-2" to="/dashboard?view=account" onClick={() => setOpen(false)}><Settings className="h-4 w-4" />Account Settings</Link>
          <Link role="menuitem" className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-paper-2" to="/dashboard?view=workspace" onClick={() => setOpen(false)}><Building2 className="h-4 w-4" />Workspace Settings</Link>
          <button role="menuitem" className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-red hover:bg-red-soft" onClick={async () => { await signOut(); nav("/"); }}><LogOut className="h-4 w-4" />Sign Out</button>
        </div>
      )}
    </div>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const visible = user ? links.filter(([l]) => ["Product", "Solutions", "Pricing"].includes(l)) : links;
  return (
    <header className="sticky top-0 z-40 border-b border-line-2 bg-paper/90 backdrop-blur">
      <a href="#main" className="absolute -left-[999px] top-2 rounded bg-ink px-3 py-2 text-white focus:left-2">Skip to content</a>
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-5 text-sm text-muted lg:flex" aria-label="Primary">
          {visible.map(([l, h]) => <a key={l} href={h} className="hover:text-ink">{l}</a>)}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          {user ? (<><Link to="/dashboard" className="btn-primary">Go to Dashboard</Link><ProfileMenu /></>) : (<><Link to="/login" className="btn-ghost">Sign In</Link><Link to="/signup" className="btn-primary">Get Started</Link></>)}
        </div>
        <button className="rounded-md p-2 lg:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mnav" aria-label={open ? "Close menu" : "Open menu"}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && (
        <nav id="mnav" className="border-t border-line-2 bg-paper px-5 py-4 lg:hidden" aria-label="Mobile">
          <div className="flex flex-col gap-1">
            {visible.map(([l, h]) => <a key={l} href={h} onClick={() => setOpen(false)} className="rounded px-2 py-2 text-ink hover:bg-paper-2">{l}</a>)}
            <div className="mt-3 flex gap-2">
              {user ? <Link to="/dashboard" className="btn-primary flex-1">Go to Dashboard</Link> : (<><Link to="/login" className="btn-ghost flex-1">Sign In</Link><Link to="/signup" className="btn-primary flex-1">Get Started</Link></>)}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
