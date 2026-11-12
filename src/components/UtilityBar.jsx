import { SITE } from "../../js/data.js";
import { TicketCheckoutLink } from "./ticketing/TicketCheckoutLink.jsx";

/** Collage-style thin utility strip: secondary portals top-right */
export function UtilityBar() {
  return (
    <div className="orpheum-utility cdc-utility" aria-label="Account links">
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
        </ul>
      </div>
    </div>
  );
}
