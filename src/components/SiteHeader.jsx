import { SITE } from "../../js/data.js";
import { useNav } from "../context/NavContext.jsx";
import { BrandMark } from "./BrandMark.jsx";
import { CollageNav } from "./CollageNav.jsx";
import { SearchTrigger } from "./SiteSearch.jsx";

function IconMenu() {
  return (
    <svg className="orpheum-header__menu-icon" width="24" height="18" viewBox="0 0 24 18" fill="none" aria-hidden="true">
      <path d="M2 2.5h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M2 9h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M2 15.5h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function SiteHeader() {
  const { openMenu } = useNav();

  return (
    <div className="orpheum-header__inner cdc-header__inner">
      <a href="/" className="orpheum-header__logo cdc-header__logo" aria-label={`${SITE.name} Home`}>
        <BrandMark />
      </a>

      <CollageNav />

      <div className="orpheum-header__actions cdc-header__actions">
        <SearchTrigger className="orpheum-header__search cdc-header__search" label="Search site" />
        <a href="/support/donate/" className="cdc-btn cdc-header__donate">
          Donate
        </a>
        <button
          type="button"
          className="orpheum-header__menu cdc-header__menu"
          aria-label="Open menu"
          onClick={openMenu}
        >
          <IconMenu />
          <span className="cdc-header__menu-label">Menu</span>
        </button>
      </div>
    </div>
  );
}
