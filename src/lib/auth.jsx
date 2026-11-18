import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase, supabaseConfigured } from "./supabase.js";

// Real auth = Supabase. When Supabase is not configured, the app offers an explicit "local demo" session
// stored in this browser only. It is never presented as an account.
const AuthCtx = createContext(null);
const DEMO_KEY = "aurevex.demoSession";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState(supabaseConfigured ? "supabase" : "none");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data }) => { setUser(data.session?.user ?? null); setReady(true); });
      const { data } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
      return () => data.subscription.unsubscribe();
    }
    try { const d = JSON.parse(localStorage.getItem(DEMO_KEY)); if (d) { setUser(d); setMode("demo"); } } catch {}
    setReady(true);
  }, []);

  const startDemo = useCallback(() => {
    const d = { id: "local-demo", email: "demo@local", user_metadata: { full_name: "Demo user" }, demo: true };
    localStorage.setItem(DEMO_KEY, JSON.stringify(d)); setUser(d); setMode("demo");
  }, []);

  const signOut = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    localStorage.removeItem(DEMO_KEY); setUser(null); setMode(supabaseConfigured ? "supabase" : "none");
  }, []);

  return <AuthCtx.Provider value={{ user, ready, mode, isDemo: mode === "demo", startDemo, signOut }}>{children}</AuthCtx.Provider>;
}
export const useAuth = () => useContext(AuthCtx);
