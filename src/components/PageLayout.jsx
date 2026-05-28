import Navbar from './Navbar';
import Footer from './Footer';
import SkipLink from './SkipLink';

export default function PageLayout({ children, className = '' }) {
  return (
    <div className={`min-h-screen bg-cream flex flex-col ${className}`}>
      <SkipLink />
      <Navbar />
      <main id="main-content" className="flex-1 w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}
