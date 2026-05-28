import { useLocation, Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { images } from '@/content/images';

export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname.substring(1) || 'this page';

  return (
    <PageLayout>
      <div
        className="relative flex-1 flex items-center justify-center min-h-[70vh] page-gutter grain-overlay"
        style={{
          backgroundImage: `linear-gradient(hsl(220 48% 11% / 0.88), hsl(220 48% 11% / 0.92)), url(${images.backgrounds.theatre})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-md w-full text-center space-y-6 relative z-[1] py-16">
          <p className="font-display text-white/15 text-[8rem] sm:text-[10rem] leading-none font-semibold select-none">
            404
          </p>
          <h1 className="font-display text-white text-2xl sm:text-3xl font-semibold uppercase -mt-16 sm:-mt-20">
            Page Not Found
          </h1>
          <p className="font-inter text-white/60 text-sm">
            We couldn&apos;t find &ldquo;{pageName}&rdquo;. Perhaps it moved with the season.
          </p>
          <div className="btn-stack-mobile justify-center pt-2">
            <Link to="/" className="btn-primary">
              Go Home
            </Link>
            <Link to="/plays" className="btn-secondary">
              Productions
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
