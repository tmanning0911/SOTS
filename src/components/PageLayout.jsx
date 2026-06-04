import Navbar from './Navbar';
import Footer from './Footer';
import EmailSignupBar from './EmailSignupBar';
import { HomeFooterUtility } from './home';
import SkipLink from './SkipLink';

export default function PageLayout({ children, className = '', hideEmailBar = false }) {
  return (
    <div className={`min-h-screen bg-white flex flex-col ${className}`}>
      <SkipLink />
      <Navbar />
      <main
        id="main-content"
        className="flex-1 w-full min-w-0 pb-[max(5rem,calc(4.75rem+env(safe-area-inset-bottom,0px)))] md:pb-0 md:pr-[3.25rem] lg:pr-0"
      >
        {children}
      </main>
      {!hideEmailBar && <EmailSignupBar />}
      <HomeFooterUtility />
      <Footer />
    </div>
  );
}
