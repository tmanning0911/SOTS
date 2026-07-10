import { NAV_ITEMS } from "../../js/data.js";
import { TicketCheckoutLink } from "./ticketing/TicketCheckoutLink.jsx";

function IconChevron() {
  return (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M1.5 4L6 8L10.5 4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function FeaturedMeta({ meta }) {
  if (!meta) return null;
  const parts = meta.split(/\s*[·|]\s*/);
  const tag = parts[0];
  const rest = parts.slice(1).join(" · ");

  return (
    <p className="orpheum-nav__feature-meta">
      <span className="orpheum-nav__feature-tag">{tag}</span>
      {rest ? <span className="orpheum-nav__feature-sep"> | {rest}</span> : null}
    </p>
  );
}

function NavFeatured({ featured }) {
  if (!featured) return null;
  return (
    <a className="orpheum-nav__feature-card" href={featured.href}>
      <img src={featured.image} alt="" width={280} height={175} loading="lazy" />
      <div className="orpheum-nav__feature-card-body">
        <FeaturedMeta meta={featured.meta} />
        <strong>{featured.title}</strong>
        <span className="orpheum-nav__feature-dates">{featured.dates}</span>
        <span className="orpheum-nav__feature-cta">Learn More &gt;</span>
      </div>
    </a>
  );
}

export function OrpheumNavPanel({ item, isOpen }) {
  if (!item) return null;

  const primaryHref = item.href || item.columns?.[0]?.links?.[0]?.href || "/";

  return (
    <div
      className={`orpheum-nav__panel${isOpen ? " is-open" : ""}`}
      role="region"
      aria-label={item.label}
      aria-hidden={!isOpen}
    >
      <div className="orpheum-nav__panel-shell">
        <a href={primaryHref} className="orpheum-nav__panel-heading">
          {item.label}
          <span className="orpheum-nav__panel-heading-arrow" aria-hidden="true">
            &gt;
          </span>
        </a>

        <div className="orpheum-nav__panel-inner">
          <div className="orpheum-nav__columns">
            {item.columns?.map((col) => {
              const splitCol = col.twoColumn || (col.links?.length ?? 0) >= 6;
              return (
                <div
                  key={col.title}
                  className={`orpheum-nav__col${splitCol ? " orpheum-nav__col--split" : ""}`}
                >
                  <p className="orpheum-nav__panel-title">{col.title}</p>
                  <ul>
                    {col.links?.map((link) => (
                      <li key={link.href + link.label}>
                        <TicketCheckoutLink
                          href={link.href}
                          className="sots-ticket-checkout-link"
                          external={link.external}
                        >
                          {link.label}
                        </TicketCheckoutLink>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}

            {item.venues?.map((venue) => (
              <div key={venue.name} className="orpheum-nav__venues">
                <p className="orpheum-nav__panel-title">Learn About Our Venues</p>
                <a href={venue.href}>
                  <strong>{venue.name}</strong>
                  <span>{venue.address}</span>
                </a>
              </div>
            ))}
          </div>

          {item.featured ? (
            <div className="orpheum-nav__featured">
              <p className="orpheum-nav__panel-title orpheum-nav__panel-title--feature">
                Featured Event
              </p>
              <NavFeatured featured={item.featured} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function OrpheumNav({ open, onToggle }) {
  return (
    <nav className={`orpheum-nav${open ? " is-open" : ""}`} aria-label="Primary navigation">
      <ul className="orpheum-nav__list">
        {NAV_ITEMS.map((item) => {
          const isOpen = open === item.label;
          const primaryHref = item.href || item.columns?.[0]?.links?.[0]?.href || "/";

          return (
            <li key={item.label} className={`orpheum-nav__item${isOpen ? " is-open" : ""}`}>
              <a
                className="orpheum-nav__trigger"
                href={primaryHref}
                aria-expanded={isOpen}
                aria-haspopup="true"
                onClick={(e) => {
                  if (!window.matchMedia("(min-width: 992px)").matches) return;
                  e.preventDefault();
                  e.stopPropagation();
                  onToggle(item.label);
                }}
              >
                {item.label}
                <IconChevron />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
