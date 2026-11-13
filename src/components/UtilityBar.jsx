import { SITE } from "../../js/data.js";
import { TicketCheckoutLink } from "./ticketing/TicketCheckoutLink.jsx";
import { SearchTrigger } from "./SiteSearch.jsx";

/** Collage-style utility strip: portals + search + Donate top-right */
export function UtilityBar() {
  return (
    <nav className="orpheum-utility cdc-utility" aria-label="Account links">
      <div className="orpheum-utility__inner cdc-utility__inner">
        <ul className="cdc-utility__right">
          <li>
            <TicketCheckoutLink href={SITE.accountUrl} className="cdc-utility__link">
              My Tickets
            </TicketCheckoutLink>
          </li>
          <li>
            <a className="cdc-utility__link" href="/about/contact/">
              Contact
            </a>
          </li>
          <li>
            <SearchTrigger className="orpheum-header__search cdc-header__search cdc-utility__search" label="Search site" />
          </li>
          <li>
            <a href="/support/donate/" className="cdc-btn cdc-utility__donate">
              Donate
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
