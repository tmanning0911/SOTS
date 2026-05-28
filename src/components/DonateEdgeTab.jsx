import { useLocation } from 'react-router-dom';
import { site } from '@/content/site';

/**
 * Fixed donate tab on the right edge — always visible on public pages.
 */
export default function DonateEdgeTab() {
  const { pathname } = useLocation();

  if (pathname.startsWith('/admin')) return null;

  return (
    <a
      href={site.donateUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="donate-edge-tab group"
      aria-label="Donate to Shakespeare on the Sound (opens PayPal in a new tab)"
    >
      <span className="donate-edge-tab__label">Donate</span>
    </a>
  );
}
