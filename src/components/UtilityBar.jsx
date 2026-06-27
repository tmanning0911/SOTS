import { useEffect, useRef, useState } from "react";
import { UTILITY_LEFT, UTILITY_LINKS } from "../../js/data.js";
import { useUI } from "../context/UIContext.jsx";
import { SearchTrigger } from "./SiteSearch.jsx";

function IconChevron({ open }) {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className={`orpheum-utility__chevron${open ? " is-open" : ""}`}
    >
      <path d="M1.5 4L6 8L10.5 4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function UtilityDropdown({ link, open, setOpen }) {
  const isOpen = open === link.label;

  return (
    <li className={`orpheum-utility__item has-dropdown${isOpen ? " is-open" : ""}`}>
      <button
        type="button"
        className="orpheum-utility__trigger"
        aria-expanded={isOpen}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(isOpen ? null : link.label);
        }}
      >
        {link.label}
        <IconChevron open={isOpen} />
      </button>
      <ul className="orpheum-utility__dropdown">
        {link.children.map((child) => (
          <li key={child.href}>
            <a
              href={child.href}
              {...(child.external ? { target: "_blank", rel: "noopener" } : {})}
            >
              {child.label}
            </a>
          </li>
        ))}
      </ul>
    </li>
  );
}

export function UtilityBar() {
  const [open, setOpen] = useState(null);
  const barRef = useRef(null);
  const { openAccessTickets } = useUI();

  useEffect(() => {
    function onDocClick(e) {
      if (barRef.current && !barRef.current.contains(e.target)) setOpen(null);
    }
    function onKeyDown(e) {
      if (e.key === "Escape") setOpen(null);
    }

    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div className="orpheum-utility" aria-label="Quick links" ref={barRef}>
      <div className="orpheum-utility__inner">
        <ul className="orpheum-utility__left">
          {UTILITY_LEFT.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
        <ul className="orpheum-utility__right">
          {UTILITY_LINKS.map((link) =>
            link.children ? (
              <UtilityDropdown key={link.label} link={link} open={open} setOpen={setOpen} />
            ) : link.action === "access-tickets" ? (
              <li
                key={link.label}
                className={link.highlight ? "orpheum-utility__item is-highlight" : "orpheum-utility__item"}
              >
                <button type="button" className="orpheum-utility__trigger" onClick={openAccessTickets}>
                  {link.label}
                </button>
              </li>
            ) : (
              <li
                key={link.label}
                className={link.highlight ? "orpheum-utility__item is-highlight" : "orpheum-utility__item"}
              >
                <a
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noopener" } : {})}
                >
                  {link.label}
                </a>
              </li>
            )
          )}
          <li className="orpheum-utility__search">
            <SearchTrigger className="orpheum-utility__search-btn" label="Search site" />
          </li>
        </ul>
      </div>
    </div>
  );
}
