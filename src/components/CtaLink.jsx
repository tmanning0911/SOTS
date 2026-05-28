import { Link } from 'react-router-dom';

/**
 * Renders mailto, external, in-app, or plain anchors from a single href string.
 */
export default function CtaLink({ href, className, children, ...props }) {
  if (!href || href === '#') {
    return (
      <span className={className} {...props}>
        {children}
      </span>
    );
  }

  if (href.startsWith('mailto:') || href.startsWith('tel:')) {
    return (
      <a href={href} className={className} {...props}>
        {children}
      </a>
    );
  }

  if (href.startsWith('http://') || href.startsWith('https://')) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...props}>
        {children}
      </a>
    );
  }

  if (href.startsWith('/')) {
    return (
      <Link to={href} className={className} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  );
}
