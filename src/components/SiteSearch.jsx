import { useEffect, useMemo, useRef, useState } from "react";
import { searchSite } from "../../js/search-index.js";
import { trapFocus } from "../../js/a11y.js";
import { useUI } from "../context/UIContext.jsx";

function IconSearch() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.75" />
      <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function SiteSearch() {
  const { searchOpen, closeSearch } = useUI();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const panelRef = useRef(null);
  const inputRef = useRef(null);

  const results = useMemo(() => searchSite(query, { limit: 8 }), [query]);

  useEffect(() => {
    if (!searchOpen) return undefined;

    setQuery("");
    setActiveIndex(0);
    document.body.classList.add("search-open");
    document.body.style.overflow = "hidden";

    let cleanupFocus;
    const frame = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
      if (panelRef.current) cleanupFocus = trapFocus(panelRef.current);
    });

    return () => {
      window.cancelAnimationFrame(frame);
      cleanupFocus?.();
      document.body.classList.remove("search-open");
      document.body.style.overflow = "";
    };
  }, [searchOpen]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (activeIndex >= results.length) {
      setActiveIndex(Math.max(0, results.length - 1));
    }
  }, [activeIndex, results.length]);

  if (!searchOpen) return null;

  function handleClose() {
    closeSearch();
  }

  function followResult(result) {
    handleClose();
    if (result.external) {
      window.open(result.href, "_blank", "noopener,noreferrer");
      return;
    }
    window.location.href = result.href;
  }

  function handleInputKeyDown(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      handleClose();
      return;
    }

    if (!results.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((current) => Math.min(current + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((current) => Math.max(current - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const result = results[activeIndex];
      if (result) followResult(result);
    }
  }

  return (
    <div className="site-search" role="dialog" aria-modal="true" aria-labelledby="site-search-title">
      <button type="button" className="site-search__backdrop" aria-label="Close search" onClick={handleClose} />
      <div className="site-search__panel" ref={panelRef}>
        <p id="site-search-title" className="site-search__sr-only">
          Search Shakespeare on the Sound
        </p>
        <form
          className="site-search__form"
          onSubmit={(e) => {
            e.preventDefault();
            if (results[activeIndex]) followResult(results[activeIndex]);
          }}
        >
          <label className="site-search__field">
            <span className="site-search__icon">
              <IconSearch />
            </span>
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Search shows, education, tickets, and more…"
              autoComplete="off"
              enterKeyHint="search"
            />
          </label>
          <button type="button" className="site-search__close" aria-label="Close search" onClick={handleClose}>
            &times;
          </button>
        </form>

        <div className="site-search__results" role="listbox" aria-label="Search results">
          {!query.trim() ? (
            <p className="site-search__hint">
              Try searching for <strong>Much Ado</strong>, <strong>tickets</strong>,{" "}
              <strong>summer camps</strong>, or <strong>parking</strong>.
            </p>
          ) : results.length ? (
            results.map((result, index) => (
              <a
                key={`${result.href}-${result.title}`}
                href={result.href}
                className={`site-search__result${index === activeIndex ? " is-active" : ""}`}
                role="option"
                aria-selected={index === activeIndex}
                {...(result.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                onClick={(e) => {
                  e.preventDefault();
                  followResult(result);
                }}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <span className="site-search__result-type">{result.type}</span>
                <strong>{result.title}</strong>
                <span>{result.excerpt}</span>
              </a>
            ))
          ) : (
            <p className="site-search__empty">No results for “{query}”. Try another keyword.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function SearchTrigger({ className = "", label = "Open search" }) {
  const { openSearch } = useUI();

  return (
    <button type="button" className={className} aria-label={label} onClick={openSearch}>
      <IconSearch />
    </button>
  );
}
