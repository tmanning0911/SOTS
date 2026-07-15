import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "lenis/dist/lenis.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import "../css/brand.css";
import "../css/styles.css";
import "../css/polish.css";
import "../css/responsive.css";
import "../css/home.css";
import "../css/inner-pages.css";
import "../css/ticketing.css";
import "../css/tickets-page.css";
import "../css/checkout.css";
import "../css/shop.css";
import "../css/mahjong-night.css";
import "../css/news.css";
import "../css/a11y.css";
import "./tailwind.css";

import App from "./App.jsx";
import { NavProvider } from "./context/NavContext.jsx";
import { UIProvider } from "./context/UIContext.jsx";
import { PatronProvider } from "./context/PatronProvider.jsx";
import { ShopProvider } from "./context/ShopProvider.jsx";
import { TicketProvider } from "./context/TicketProvider.jsx";
import { initA11y } from "../js/a11y.js";
import { initPolish, refreshScroll } from "./polish.js";

function mountApp() {
  initA11y();

  const rootEl = document.getElementById("root");
  if (!rootEl) {
    console.error("SOTS: #root mount point missing");
    return;
  }

  createRoot(rootEl).render(
    <StrictMode>
      <BrowserRouter>
        <NavProvider>
          <UIProvider>
            <TicketProvider>
              <PatronProvider>
                <ShopProvider>
                  <App />
                </ShopProvider>
              </PatronProvider>
            </TicketProvider>
          </UIProvider>
        </NavProvider>
      </BrowserRouter>
    </StrictMode>,
  );

  initPolish();
  requestAnimationFrame(() => {
    setTimeout(refreshScroll, 100);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountApp, { once: true });
} else {
  mountApp();
}
