import { Routes, Route } from "react-router-dom";
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
import { MahjongNightPage } from "./pages/MahjongNightPage.jsx";
import { GalaPage } from "./pages/GalaPage.jsx";
import { EventsPage } from "./pages/EventsPage.jsx";
import { EducationEventsPage } from "./pages/EducationEventsPage.jsx";
import { DonatePage } from "./pages/DonatePage.jsx";
import { ProgramAdsSponsorshipsPage } from "./pages/ProgramAdsSponsorshipsPage.jsx";
import { PageMeta } from "./hooks/usePageMeta.js";
import { INNER_PAGES, hrefToRoutePath } from "../js/pages-data.js";

const CUSTOM_INNER_HREFS = new Set([
  "/support/donate/",
  "/support/program-ads-sponsorships/",
  "/education/events/",
  "/support/events/",
]);

function InnerPageRoute({ page }) {
  return (
    <>
      <PageMeta path={page.href} />
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
        {INNER_PAGES.filter((page) => !CUSTOM_INNER_HREFS.has(page.href)).flatMap((page) => {
          const path = hrefToRoutePath(page.href);
          if (page.faq) {
            return routePair(
              path,
              <>
                <PageMeta path={page.href} />
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
        {routePair("events/mahjong-night", <MahjongNightPage />)}
        {routePair("events/much-ado-about-something", <GalaPage />)}
        {routePair("events", <EventsPage />)}
        {routePair("education/events", <EducationEventsPage />)}
        {routePair("support/donate", <DonatePage />)}
        {routePair("support/program-ads-sponsorships", <ProgramAdsSponsorshipsPage />)}
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
