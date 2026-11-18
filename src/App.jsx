import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Home, Privacy, Terms, NotFound } from "./pages/Public.jsx";
import { Login, Signup, ForgotPassword, ResetPassword } from "./pages/Auth.jsx";
import { useAuth } from "./lib/auth.jsx";
import { Spinner } from "./components/ui/index.jsx";
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const Onboarding = lazy(() => import("./pages/Onboarding.jsx"));
const ApplicationCenter = lazy(() => import("./pages/ApplicationCenter.jsx"));

const Load = () => <div className="grid min-h-screen place-items-center"><Spinner className="h-6 w-6 text-teal" /></div>;
function Protected({ children }) { const { user, ready } = useAuth(); if (!ready) return <Load />; return user ? children : <Navigate to="/login" replace />; }

export default function App() {
  return (
    <Suspense fallback={<Load />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/onboarding" element={<Protected><Onboarding /></Protected>} />
        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
        <Route path="/app" element={<ApplicationCenter />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
