import { useState, useEffect } from 'react';
import { cms } from '@/lib/cms';
import { useNavigate } from 'react-router-dom';
import AdminPlays from '../components/admin/AdminPlays';
import AdminArticles from '../components/admin/AdminArticles';
import AdminLearning from '../components/admin/AdminLearning';
import {
  IconMasks,
  IconQuill,
  IconBookOpen,
  IconExternalLink,
  IconChevronRight,
  IconLogOut,
  IconMenu,
  IconClose,
} from '@/components/icons';

const tabs = [
  { id: 'plays', label: 'Productions', icon: IconMasks },
  { id: 'articles', label: 'News & Articles', icon: IconQuill },
  { id: 'learning', label: 'Learning Programs', icon: IconBookOpen },
];

function AdminSidebar({ activeTab, setActiveTab, user, onLogout, className = '' }) {
  return (
    <aside
      className={`w-full lg:w-64 bg-navy text-white flex flex-col lg:min-h-screen ${className}`}
    >
      <div className="p-5 sm:p-6 border-b border-white/10">
        <p className="text-white/50 text-[10px] tracking-[0.2em] uppercase mb-1">Admin Panel</p>
        <p className="font-playfair text-white text-lg sm:text-xl font-bold uppercase leading-tight">
          Shakespeare
          <br />
          on the Sound
        </p>
      </div>

      <nav className="flex-1 p-3 sm:p-4 space-y-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-inter transition-colors min-h-[44px] ${
                activeTab === tab.id
                  ? 'bg-gold text-navy-deep'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon size={16} />
              {tab.label}
              {activeTab === tab.id && <IconChevronRight size={14} className="ml-auto" />}
            </button>
          );
        })}
      </nav>

      <div className="p-3 sm:p-4 border-t border-white/10 space-y-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-white/60 hover:text-white text-xs font-inter transition-colors"
        >
          <IconExternalLink size={13} />
          View Live Site
        </a>
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-white/60 hover:text-white text-xs font-inter transition-colors"
        >
          <IconLogOut size={13} />
          Sign Out
        </button>
        <div className="px-4 pt-1">
          <p className="text-white/40 text-[10px]">Logged in as</p>
          <p className="text-white/80 text-xs truncate">{user.email}</p>
        </div>
      </div>
    </aside>
  );
}

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('plays');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    cms.admin
      .me()
      .then((u) => {
        setUser(u);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        navigate('/admin/login', { replace: true });
      });
  }, [navigate]);

  const handleLogout = () => {
    cms.admin.logout();
    navigate('/admin/login');
  };

  const selectTab = (id) => {
    setActiveTab(id);
    setMobileNav(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-navy/20 border-t-navy rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col lg:flex-row">
      <div className="hidden lg:block flex-shrink-0">
        <AdminSidebar activeTab={activeTab} setActiveTab={selectTab} user={user} onLogout={handleLogout} />
      </div>

      <main className="flex-1 flex flex-col min-h-screen min-w-0">
        <header className="bg-white border-b border-navy/10 px-4 sm:px-8 py-4 flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="min-w-0">
            <p className="text-[10px] tracking-[0.2em] uppercase text-navy/45 lg:hidden">Admin</p>
            <h1 className="font-playfair text-navy text-xl sm:text-2xl font-bold uppercase truncate">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h1>
            <p className="font-inter text-navy/45 text-xs mt-0.5 hidden sm:block">Season content for shakespeareonthesound.org</p>
          </div>
          <button
            type="button"
            className="lg:hidden w-10 h-10 border border-navy/15 flex items-center justify-center text-navy"
            onClick={() => setMobileNav(true)}
            aria-label="Open admin menu"
          >
            <IconMenu size={20} />
          </button>
        </header>

        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {activeTab === 'plays' && <AdminPlays />}
          {activeTab === 'articles' && <AdminArticles />}
          {activeTab === 'learning' && <AdminLearning />}
        </div>
      </main>

      {mobileNav && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close admin menu"
            onClick={() => setMobileNav(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[min(100%,20rem)] shadow-xl flex flex-col bg-navy">
            <button
              type="button"
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white border border-white/20 z-10"
              onClick={() => setMobileNav(false)}
              aria-label="Close"
            >
              <IconClose size={18} />
            </button>
            <AdminSidebar
              activeTab={activeTab}
              setActiveTab={selectTab}
              user={user}
              onLogout={handleLogout}
              className="h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
