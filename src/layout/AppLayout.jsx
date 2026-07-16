import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SiteChrome } from "../components/SiteChrome.jsx";
import { MobileNav } from "../components/MobileNav.jsx";
import { SiteFooter } from "../components/SiteFooter.jsx";
import { MobileDock } from "../components/MobileDock.jsx";
import { HomeQuickBar } from "../components/HomeQuickBar.jsx";
import { AccessTicketsModal } from "../components/AccessTicketsModal.jsx";
import { BoardApplicationModal } from "../components/BoardApplicationModal.jsx";
import { ContactFormModal } from "../components/ContactFormModal.jsx";
import { SiteSearch } from "../components/SiteSearch.jsx";
import { useUI } from "../context/UIContext.jsx";
import { refreshScroll, initInnerPageMotion, resetInnerPageMotion, resetHomePageMotion, enableCheckoutScrollMode, disableCheckoutScrollMode } from "../polish.js";

function isCheckoutPath(pathname) {
  return /\/checkout(\/|$)/.test(pathname);
}

export function AppLayout() {
  const location = useLocation();
  const isHome = location.pathname === "/" || location.pathname === "";
  const isCheckout = isCheckoutPath(location.pathname);
  const {
    accessTicketsOpen,
    closeAccessTickets,
    contactFormOpen,
    contactFormTarget,
    closeContactForm,
    boardApplicationOpen,
    closeBoardApplication,
  } = useUI();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle("page-home", isHome);
    document.body.classList.toggle("page-inner", !isHome && !isCheckout);
    document.body.classList.toggle("page-checkout", isCheckout);
  }, [isHome, isCheckout]);

  useEffect(() => {
    if (isCheckout) {
      enableCheckoutScrollMode();
      return () => disableCheckoutScrollMode();
    }
    return undefined;
  }, [isCheckout]);

  useEffect(() => {
    if (isHome || isCheckout) {
      resetInnerPageMotion();
      return undefined;
    }

    resetHomePageMotion();
    initInnerPageMotion();
    requestAnimationFrame(() => setTimeout(refreshScroll, 80));
    return () => resetInnerPageMotion();
  }, [location.pathname, isHome, isCheckout]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>

      <SiteChrome isHome={isHome} />

      <MobileNav />

      <main id="main">
        <Outlet />
      </main>

      {!isCheckout ? <SiteFooter /> : null}
      {isHome ? <HomeQuickBar /> : isCheckout ? null : <MobileDock />}
      <AccessTicketsModal open={accessTicketsOpen} onClose={closeAccessTickets} />
      <ContactFormModal open={contactFormOpen} target={contactFormTarget} onClose={closeContactForm} />
      <BoardApplicationModal open={boardApplicationOpen} onClose={closeBoardApplication} />
      <SiteSearch />
    </>
  );
}
