import { createContext, useContext, useState, useCallback, useEffect, Component } from "react";
import { Link } from "react-router-dom";
import { X, Loader2 } from "lucide-react";
import { cx } from "../../lib/utils.js";

export function Logo({ dark = false, className = "" }) {
  return (
    <Link to="/" className={cx("inline-flex items-center gap-2.5", className)} aria-label="Aurevex home">
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill={dark ? "#F6F3EC" : "#0F1B2D"} />
        <path d="M9.2 24 16 8.2 22.8 24" fill="none" stroke={dark ? "#0F1B2D" : "#F6F3EC"} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12.4 18.4h7.2" stroke={dark ? "#1F7A6B" : "#3FB59E"} strokeWidth="2.6" strokeLinecap="round" />
      </svg>
      <span className={cx("font-serif text-xl font-medium", dark ? "text-paper" : "text-ink")}>Aurevex</span>
    </Link>
  );
}

export function Spinner({ className = "h-4 w-4" }) { return <Loader2 className={cx("animate-spin", className)} aria-hidden="true" />; }

export function Field({ label, error, hint, id, children }) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red" role="alert">{error}</p>}
    </div>
  );
}

export function Modal({ open, onClose, title, children, wide }) {
  useEffect(() => {
    if (!open) return;
    const k = (e) => e.key === "Escape" && onClose();
    addEventListener("keydown", k); return () => removeEventListener("keydown", k);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={title} className={cx("card max-h-[90vh] w-full overflow-auto p-6", wide ? "max-w-2xl" : "max-w-md")}>
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="rounded p-1 text-muted hover:bg-paper-2" aria-label="Close"><X className="h-5 w-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

const ToastCtx = createContext(() => {});
export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const push = useCallback((text, tone = "ok") => {
    const id = Math.random(); setItems((s) => [...s, { id, text, tone }]);
    setTimeout(() => setItems((s) => s.filter((t) => t.id !== id)), 3500);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed bottom-4 right-4 z-[60] space-y-2" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className={cx("rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lift", t.tone === "err" ? "bg-red" : "bg-ink")}>{t.text}</div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
export const useToast = () => useContext(ToastCtx);

export class ErrorBoundary extends Component {
  state = { err: null };
  static getDerivedStateFromError(err) { return { err }; }
  render() {
    if (this.state.err) return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        <div><h1 className="text-3xl">Something went wrong.</h1><p className="mt-2 text-muted">Please reload the page.</p>
        <button className="btn-primary mt-6" onClick={() => location.reload()}>Reload</button></div>
      </div>
    );
    return this.props.children;
  }
}

export function SampleBadge({ children = "Sample data" }) {
  return <span className="tag bg-amber-soft text-amber">{children}</span>;
}
