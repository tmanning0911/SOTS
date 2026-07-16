import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { extractMailtoAddress, resolveContactRecipient } from "../../js/contact-recipients.js";

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [accessTicketsOpen, setAccessTicketsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ open: false, target: null });
  const [boardApplicationOpen, setBoardApplicationOpen] = useState(false);

  const openAccessTickets = useCallback(() => setAccessTicketsOpen(true), []);
  const closeAccessTickets = useCallback(() => setAccessTicketsOpen(false), []);
  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const openBoardApplication = useCallback(() => setBoardApplicationOpen(true), []);
  const closeBoardApplication = useCallback(() => setBoardApplicationOpen(false), []);

  const openContactForm = useCallback((target = {}) => {
    const recipient = resolveContactRecipient(target.to || target.email || "");
    setContactForm({
      open: true,
      target: {
        to: recipient.email,
        toLabel: target.toLabel || recipient.label,
        form: target.form || recipient.form,
        requested: target.requested || recipient.requested || null,
      },
    });
  }, []);

  const closeContactForm = useCallback(() => {
    setContactForm({ open: false, target: null });
  }, []);

  useEffect(() => {
    function onKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // Any leftover mailto: links → contact form instead of the mail client
  useEffect(() => {
    function onClick(e) {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = e.target.closest?.("a[href^='mailto:']");
      if (!anchor) return;
      const email = extractMailtoAddress(anchor.getAttribute("href"));
      if (!email) return;
      e.preventDefault();
      openContactForm({ to: email });
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [openContactForm]);

  const value = useMemo(
    () => ({
      accessTicketsOpen,
      openAccessTickets,
      closeAccessTickets,
      searchOpen,
      openSearch,
      closeSearch,
      contactFormOpen: contactForm.open,
      contactFormTarget: contactForm.target,
      openContactForm,
      closeContactForm,
      boardApplicationOpen,
      openBoardApplication,
      closeBoardApplication,
    }),
    [
      accessTicketsOpen,
      openAccessTickets,
      closeAccessTickets,
      searchOpen,
      openSearch,
      closeSearch,
      contactForm.open,
      contactForm.target,
      openContactForm,
      closeContactForm,
      boardApplicationOpen,
      openBoardApplication,
      closeBoardApplication,
    ],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within UIProvider");
  return ctx;
}
