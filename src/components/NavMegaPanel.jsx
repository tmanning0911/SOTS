import { Link } from 'react-router-dom';
import OptimizedImage from './OptimizedImage';
import CtaLink from './CtaLink';

function MegaLink({ link, onNavigate, dark }) {
  const className = `block py-1.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm ${
    dark ? 'hover:bg-white/5' : 'hover:bg-navy/5'
  }`;

  const inner = (
    <>
      <span
        className={`font-inter text-sm font-medium transition-colors group-hover:text-gold ${
          dark ? 'text-white/90' : 'text-navy'
        }`}
      >
        {link.label}
      </span>
      {link.description && (
        <span className={`block font-inter text-xs mt-0.5 ${dark ? 'text-white/45' : 'text-navy/50'}`}>
          {link.description}
        </span>
      )}
    </>
  );

  if (link.external || link.path?.startsWith('http') || link.path?.startsWith('tel:')) {
    return (
      <li>
        <CtaLink href={link.path} className={className} onClick={onNavigate}>
          {inner}
        </CtaLink>
      </li>
    );
  }

  return (
    <li>
      <Link to={link.path} className={className} onClick={onNavigate}>
        {inner}
      </Link>
    </li>
  );
}

export default function NavMegaPanel({ item, dark, onNavigate }) {
  if (!item.groups?.length) return null;

  return (
    <div
      className={`nav-mega-panel ${dark ? 'nav-mega-panel-dark' : 'nav-mega-panel-light'}`}
      role="menu"
    >
      <div className="nav-mega-grid">
        {item.groups.map((group) => (
          <div key={group.title}>
            <p className="nav-mega-heading">{group.title}</p>
            <ul className="space-y-1">
              {group.links.map((link) => (
                <MegaLink key={link.path + link.label} link={link} onNavigate={onNavigate} dark={dark} />
              ))}
            </ul>
          </div>
        ))}

        {item.featured && (
          <div className="nav-mega-featured">
            <Link
              to={item.featured.path}
              className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              onClick={onNavigate}
            >
              <div className="relative aspect-[16/10] overflow-hidden mb-3">
                <OptimizedImage
                  src={item.featured.image}
                  alt={item.featured.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  wrapperClassName="absolute inset-0 w-full h-full"
                />
              </div>
              <span className="nav-mega-featured-tag">{item.featured.tag}</span>
              <p className="nav-mega-featured-title">{item.featured.title}</p>
              <p className="nav-mega-featured-date">{item.featured.date}</p>
              <span className="nav-mega-featured-cta">Learn More →</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
