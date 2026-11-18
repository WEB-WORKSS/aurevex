import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Root from "./Root.jsx";
import "./styles/index.css";
const el = document.getElementById("root");
const tree = <StrictMode><BrowserRouter><Root /></BrowserRouter></StrictMode>;
el.dataset.prerendered === location.pathname ? hydrateRoot(el, tree) : createRoot(el).render(tree);
