import App from "./App.jsx";
import { AuthProvider } from "./lib/auth.jsx";
import { ToastProvider, ErrorBoundary } from "./components/ui/index.jsx";
export default function Root() { return <ErrorBoundary><AuthProvider><ToastProvider><App /></ToastProvider></AuthProvider></ErrorBoundary>; }
