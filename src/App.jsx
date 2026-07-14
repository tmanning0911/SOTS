import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AppLayout } from "./layout/AppLayout.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { InnerPage } from "./pages/InnerPage.jsx";
import { FaqPage } from "./pages/FaqPage.jsx";
import { ProductionPage } from "./pages/ProductionPage.jsx";
import { ShopCheckoutPage } from "./pages/ShopCheckoutPage.jsx";
import { ShopPage } from "./pages/ShopPage.jsx";
import { TicketCheckoutPage } from "./pages/TicketCheckoutPage.jsx";
import { TicketsPage } from "./pages/TicketsPage.jsx";
import { AccessTicketsPage } from "./pages/AccessTicketsPage.jsx";
import { MyTicketsPage } from "./pages/MyTicketsPage.jsx";
import { TicketingAdminPage } from "./pages/TicketingAdminPage.jsx";
import { NotFoundPage } from "./pages/NotFoundPage.jsx";
import { NewsArticlePage } from "./pages/NewsArticlePage.jsx";
import { NewsIndexPage } from "./pages/NewsIndexPage.jsx";
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
        {routePair("news/:slug", <NewsArticlePage />)}
        {routePair("news", <NewsIndexPage />)}
        {routePair("productions/:slug", <ProductionPage />)}
        {routePair("tickets/checkout/:performanceId", <TicketCheckoutPage />)}
        {routePair("tickets", <TicketsPage />)}
        {routePair("shop/checkout", <ShopCheckoutPage />)}
        {routePair("shop", <ShopPage />)}
        {routePair("access-your-tickets", <AccessTicketsPage />)}
        {routePair("my-tickets", <MyTicketsPage />)}
        {routePair("admin/ticketing", <TicketingAdminPage />)}
        <Route path="404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
