import Navbar from './Navbar';
import Footer from './Footer';
import EmailSignupBar from './EmailSignupBar';
import SkipLink from './SkipLink';

export default function PageLayout({ children, className = '', preFooter = false }) {
  return (
    <div className={`min-h-screen bg-white flex flex-col ${className}`}>
      <SkipLink />
      <Navbar />
      <main
        id="main-content"
        className="flex-1 w-full min-w-0 pb-[calc(4.75rem+env(safe-area-inset-bottom,0px))] md:pb-0"
      >
        {children}
      </main>
      {preFooter && <EmailSignupBar />}
      <Footer preFooter={!preFooter} />
    </div>
  );
}
