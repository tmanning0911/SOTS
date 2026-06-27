import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AppLayout } from "./layout/AppLayout.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { InnerPage } from "./pages/InnerPage.jsx";
import { FaqPage } from "./pages/FaqPage.jsx";
import { ProductionPage } from "./pages/ProductionPage.jsx";
import { NotFoundPage } from "./pages/NotFoundPage.jsx";
import { INNER_PAGES, hrefToRoutePath } from "../js/pages-data.js";

function PageTitle({ title }) {
  const location = useLocation();
  useEffect(() => {
    if (title) document.title = `${title} - Shakespeare on the Sound`;
  }, [title, location.pathname]);
  return null;
}

function InnerPageRoute({ page }) {
  return (
    <>
      <PageTitle title={page.title} />
      <InnerPage page={page} />
    </>
  );
}

function routePair(path, element) {
  return [
    <Route key={path} path={path} element={element} />,
    <Route key={`${path}/`} path={`${path}/`} element={element} />,
  ];
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        {INNER_PAGES.flatMap((page) => {
          const path = hrefToRoutePath(page.href);
          if (page.faq) {
            return routePair(
              path,
              <>
                <PageTitle title={page.title} />
                <FaqPage />
              </>
            );
          }
          return routePair(path, <InnerPageRoute page={page} />);
        })}
        {routePair("productions/:slug", <ProductionPage />)}
        <Route path="404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
