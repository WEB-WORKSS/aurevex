import { Link } from "react-router-dom";
import { Nav } from "../components/layout/Nav.jsx";
import { Footer } from "../components/layout/Footer.jsx";
import { Seo } from "../components/layout/Seo.jsx";
import HomeSections from "../components/sections/Home.jsx";
import { business } from "../data/business.js";

export function Home() { return <><Seo path="/" /><Nav /><main id="main"><HomeSections /></main><Footer /></>; }

const contact = business.email.verified && business.email.value ? business.email.value : "the contact form on our website";
function Doc({ path, title, updated, children }) {
  return <><Seo path={path} /><Nav /><main id="main" className="wrap max-w-3xl py-16"><h1 className="text-4xl">{title}</h1><p className="mt-2 text-sm text-muted">Last updated {updated}</p><div className="mt-8 space-y-6 text-[0.95rem] leading-relaxed text-text [&_h2]:mt-10 [&_h2]:font-sans [&_h2]:text-lg [&_h2]:font-semibold [&_ul]:list-disc [&_ul]:pl-5">{children}</div></main><Footer /></>;
}

export function Privacy() {
  return <Doc path="/privacy" title="Privacy Policy" updated="18 November 2026">
    <p>This policy explains how Aurevex ("we") handles information when you use our website and software. Aurevex is building its initial product; this policy describes current operations and will be updated as the product changes.</p>
    <h2>Information we collect</h2><ul><li>Account information: name, email address and password (passwords are handled by our authentication provider and are not visible to us).</li><li>Workspace information you enter: workspace and organisation names, industry, company size, regulatory sources and obligations.</li><li>Inquiry form submissions: name, business email, company, company size, use case and message.</li><li>Basic technical data our hosting and authentication providers log, such as IP address and browser type.</li></ul>
    <h2>Why we use it</h2><p>To provide and secure your account and workspace, respond to inquiries, and improve the product. We do not sell personal information.</p>
    <h2>Where it is stored</h2><p>Account and workspace data is stored with our authentication and database provider (Supabase). The local demo workspace is stored only in your browser and never leaves your device. Our planned document-processing pipeline will run on Amazon Web Services; this policy will be updated before it processes customer documents.</p>
    <h2>Third-party services</h2><p>Supabase (authentication and database), our website hosting provider, and Google Fonts (font delivery). Each processes data under its own terms.</p>
    <h2>Retention</h2><p>We keep account and workspace data while your account is active and delete it on request. Inquiry submissions are kept as long as needed to respond and follow up.</p>
    <h2>Your rights</h2><p>You can ask to access, correct, export or delete your personal information. Depending on where you live you may have further rights under local law.</p>
    <h2>Contact</h2><p>Questions about privacy: {contact}.</p>
  </Doc>;
}

export function Terms() {
  return <Doc path="/terms" title="Terms of Service" updated="18 November 2026">
    <p>These terms govern your use of the Aurevex website and software. By creating an account you agree to them.</p>
    <h2>Access and use</h2><p>Aurevex is in development and is provided for evaluation. Features may change or be removed. Paid plans are not yet available; no fees are charged.</p>
    <h2>Your responsibilities</h2><ul><li>Keep your login credentials secure and tell us about unauthorised use.</li><li>Make sure you have the right to upload or enter the content you add.</li><li>Aurevex organises compliance information; it does not provide legal advice. You remain responsible for interpreting and meeting your regulatory obligations.</li></ul>
    <h2>Acceptable use</h2><p>Do not misuse the service, attempt to access other customers' data, interfere with its operation or use it for unlawful purposes.</p>
    <h2>Intellectual property</h2><p>You own the content you enter. We own the Aurevex software, brand and website. You grant us the rights needed to host and process your content to provide the service.</p>
    <h2>Disclaimers</h2><p>The service is provided "as is" without warranties of any kind, including fitness for a particular purpose or that it will be error-free.</p>
    <h2>Liability</h2><p>To the extent permitted by law, Aurevex is not liable for indirect or consequential losses, and our total liability is limited to the amount you paid us in the previous 12 months.</p>
    <h2>Contact</h2><p>Questions about these terms: {contact}.</p>
  </Doc>;
}

export function NotFound() {
  return <><Seo path="/404" title="Page not found | Aurevex" noindex /><Nav /><main id="main" className="wrap grid min-h-[60vh] place-items-center text-center"><div><p className="font-mono text-sm text-teal">404</p><h1 className="mt-2 text-4xl">This page doesn't exist.</h1><Link to="/" className="btn-primary mt-6">Back to home</Link></div></main><Footer /></>;
}
