import { Link } from 'react-router-dom';
import { contactPaths, mailtoToContactPath } from '@/lib/contactPaths';

/**
 * Link to the contact form instead of displaying or opening a raw email address.
 */
export default function ContactChannelLink({
  channel = 'general',
  href,
  className = 'text-gold hover:underline font-inter text-sm transition-colors',
  children,
  ...props
}) {
  const to = href?.startsWith('mailto:') ? mailtoToContactPath(href) : contactPaths[channel] || contactPaths.general;

  return (
    <Link to={to} className={className} {...props}>
      {children}
    </Link>
  );
}
