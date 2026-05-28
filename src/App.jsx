import { Toaster } from '@/components/ui/toaster';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import ScrollToTop from './components/ScrollToTop';
import PageSEO from './components/PageSEO';
import Home from './pages/Home';
import Plays from './pages/Plays';
import Learning from './pages/Learning';
import Support from './pages/Support';
import About from './pages/About';
import Contact from './pages/Contact';
import News from './pages/News';
import NewsArticle from './pages/NewsArticle';
import WatchPage from './pages/WatchPage';
import ShakespeareHubPage from './pages/ShakespeareHubPage';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import { FormModalProvider } from '@/lib/FormModalContext';
import { SeoOverrideProvider } from '@/lib/SeoOverrideContext';
import DonateEdgeTab from './components/DonateEdgeTab';

function App() {
  return (
    <Router>
      <SeoOverrideProvider>
        <FormModalProvider>
          <DonateEdgeTab />
          <ScrollToTop />
          <PageSEO />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/plays" element={<Plays />} />
            <Route path="/learning" element={<Learning />} />
            <Route path="/support" element={<Support />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<NewsArticle />} />
            <Route path="/watch" element={<WatchPage />} />
            <Route path="/on-demand" element={<Navigate to="/watch" replace />} />
            <Route path="/shakespeare-hub" element={<ShakespeareHubPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </FormModalProvider>
      </SeoOverrideProvider>
      <Toaster />
    </Router>
  );
}

export default App;
