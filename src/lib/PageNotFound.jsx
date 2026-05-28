import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname.substring(1);

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-6 pt-28">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="font-playfair text-7xl text-navy/20">404</h1>
        <h2 className="font-playfair text-2xl text-navy font-bold uppercase">Page Not Found</h2>
        <p className="font-inter text-navy/70 text-sm">
          The page &ldquo;{pageName}&rdquo; could not be found.
        </p>
        <Link to="/" className="btn-navy">
          Go Home
        </Link>
      </div>
      </div>
      <Footer />
    </div>
  );
}
