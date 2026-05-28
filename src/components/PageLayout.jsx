import Navbar from './Navbar';
import Footer from './Footer';
import EmailSignupBar from './EmailSignupBar';
import SkipLink from './SkipLink';

export default function PageLayout({ children, className = '' }) {
  return (
    <div className={`min-h-screen bg-cream bg-theatre-dots flex flex-col ${className}`}>
      <SkipLink />
      <Navbar />
      <main id="main-content" className="flex-1 w-full" data-nav-zone="light">
        {children}
      </main>
      <EmailSignupBar />
      <Footer />
    </div>
  );
}
