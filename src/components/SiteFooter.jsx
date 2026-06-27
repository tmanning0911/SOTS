import {
  SITE,
  MEDIA,
  FOOTER_VENUES,
  FOOTER_MAIN,
  FOOTER_SEASON,
  FOOTER_UTILITY,
  SOCIAL_LINKS,
} from "../../js/data.js";
import { useUI } from "../context/UIContext.jsx";
import { SocialIcon } from "./SocialIcon.jsx";

const FOOTER_SOCIAL = SOCIAL_LINKS.filter((social) => social.platform !== "x");

function FooterLink({ link }) {
  const external = link.external || link.href?.startsWith("http");

  return (
    <a
      href={link.href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {link.label}
    </a>
  );
}

function FooterSeasonLink({ link, onAccessTickets }) {
  if (link.action === "accessTickets") {
    return (
      <button type="button" className="orpheum-footer__text-btn" onClick={onAccessTickets}>
        {link.label}
      </button>
    );
  }

  return <FooterLink link={link} />;
}

export function SiteFooter() {
  const { openAccessTickets } = useUI();

  return (
    <footer className="orpheum-footer">
      <div className="orpheum-footer__shell">
        <div className="orpheum-footer__primary">
          <div className="orpheum-footer__brand">
            <a href="/" className="orpheum-footer__logo" aria-label={`${SITE.name} Home`}>
              <img src={MEDIA.logo} alt="" width={188} height={78} />
            </a>

            <div className="orpheum-footer__venues" aria-label="Our venues">
              {FOOTER_VENUES.map((venue, index) => (
                <span key={venue.href} className="orpheum-footer__venue-item">
                  {index > 0 ? <span className="orpheum-footer__venue-divider" aria-hidden="true" /> : null}
                  <a href={venue.href}>{venue.label}</a>
                </span>
              ))}
            </div>
          </div>

          <div className="orpheum-footer__group">
            <h2 className="orpheum-footer__heading">{FOOTER_MAIN.title}</h2>
            <div className="orpheum-footer__group-links">
              {FOOTER_MAIN.columns.map((column, columnIndex) => (
                <ul key={columnIndex}>
                  {column.map((link) => (
                    <li key={link.label}>
                      <FooterLink link={link} />
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>

          <div className="orpheum-footer__season">
            <h2 className="orpheum-footer__heading">{FOOTER_SEASON.title}</h2>
            <ul>
              {FOOTER_SEASON.links.map((link) => (
                <li key={link.label}>
                  <FooterSeasonLink link={link} onAccessTickets={openAccessTickets} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="orpheum-footer__divider" aria-hidden="true" />

        <div className="orpheum-footer__meta">
          <nav className="orpheum-footer__utility" aria-label="Footer utility links">
            <ul>
              {FOOTER_UTILITY.map((link) => (
                <li key={link.label}>
                  <FooterLink link={link} />
                </li>
              ))}
            </ul>
          </nav>

          <div className="orpheum-footer__meta-right">
            <div className="orpheum-footer__meta-badges">
              <div className="orpheum-footer__social" aria-label="Social media">
                {FOOTER_SOCIAL.map((social) => (
                  <a
                    key={social.href}
                    href={social.href}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SocialIcon platform={social.platform} size={15} />
                  </a>
                ))}
              </div>

              <img
                className="orpheum-footer__sta"
                src={MEDIA.staLogo}
                alt="Shakespeare Theatre Association"
                width={64}
                height={24}
                loading="lazy"
              />
            </div>

            <p className="orpheum-footer__tagline">{SITE.tagline}</p>
            <p className="orpheum-footer__education-note">
              Questions about education programs? Contact {SITE.educationDirectorName}:{" "}
              <a href={`mailto:${SITE.educationContact}`}>{SITE.educationContact}</a>
            </p>
            <p className="orpheum-footer__copyright">&copy; 2026 {SITE.name}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
