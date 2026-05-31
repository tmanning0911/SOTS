import { useLocation } from 'react-router-dom';
import { site } from '@/content/site';

/** Fixed donate tab — right edge on desktop, bottom corner on mobile. */
export default function DonateEdgeTab() {
  const { pathname } = useLocation();

  if (pathname.startsWith('/admin')) return null;

  return (
    <a
      href={site.donateUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="donate-edge-tab"
      aria-label="Donate to Shakespeare on the Sound (opens in a new tab)"
    >
      <span className="donate-edge-tab__label">Donate</span>
    </a>
  );
}
