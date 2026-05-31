import Navbar from './Navbar';
import Footer from './Footer';
import EmailSignupBar from './EmailSignupBar';
import SkipLink from './SkipLink';

export default function PageLayout({ children, className = '', preFooter = false }) {
  return (
    <div className={`min-h-screen bg-white flex flex-col ${className}`}>
      <SkipLink />
      <Navbar />
      <main id="main-content" className="flex-1 w-full">
        {children}
      </main>
      {preFooter && <EmailSignupBar />}
      <Footer preFooter={!preFooter} />
    </div>
  );
}
