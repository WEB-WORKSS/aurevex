import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import Root from "./Root.jsx";
export const render = (url) => renderToString(<StaticRouter location={url}><Root /></StaticRouter>);
export { PAGES } from "./components/layout/Seo.jsx";
