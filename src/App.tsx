/* ══════════════════════════════════════════════════════════
 * Wedding Management App — Main Application Shell
 * Sidebar nav on desktop, bottom tab bar on mobile.
 * All state managed via useLocalStorage for persistence.
 * ══════════════════════════════════════════════════════════ */
import React, { useState, useCallback } from 'react';
import {
  Palette, LayoutDashboard, Users, Building2, DollarSign,
  CheckSquare, MapPin, Lightbulb, Image, Settings as SettingsIcon,
  Heart, Menu, X,
} from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import {
  AppPage, ColorScheme, Guest, Vendor, BudgetItem,
  ChecklistTask, DashboardTodo, WeddingSettings,
  VenueLocation, TimeBlock, InspirationImage,
} from './types';

// ── Data defaults ──
import { colorPresets, defaultActiveScheme } from './data/presets';
import { defaultArticles } from './data/articles';
import { defaultChecklist } from './data/checklist';
import {
  sampleGuests, sampleVendors, sampleBudget,
  defaultSettings, sampleDashboardTodos,
  sampleVenues, sampleTimeline,
} from './data/sampleData';

// ── Page components ──
import ColorSchemeVisualizer from './components/ColorScheme/ColorSchemeVisualizer';
import Dashboard from './components/Dashboard/Dashboard';
import GuestManager from './components/Guests/GuestManager';
import VendorManager from './components/Vendors/VendorManager';
import BudgetTracker from './components/Budget/BudgetTracker';
import WeddingChecklist from './components/Checklist/WeddingChecklist';
import VenuePlanner from './components/Venue/VenuePlanner';
import TrendsHub from './components/Trends/TrendsHub';
import InspirationBoard from './components/Inspiration/InspirationBoard';
import Settings from './components/Settings/Settings';

/* ── Navigation items ── */
const navItems: { page: AppPage; label: string; icon: React.ReactNode; mobileLabel: string }[] = [
  { page: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, mobileLabel: 'Home' },
  { page: 'colors', label: 'Color Schemes', icon: <Palette size={20} />, mobileLabel: 'Colors' },
  { page: 'guests', label: 'Guest List', icon: <Users size={20} />, mobileLabel: 'Guests' },
  { page: 'vendors', label: 'Vendors', icon: <Building2 size={20} />, mobileLabel: 'Vendors' },
  { page: 'budget', label: 'Budget', icon: <DollarSign size={20} />, mobileLabel: 'Budget' },
  { page: 'checklist', label: 'Checklist', icon: <CheckSquare size={20} />, mobileLabel: 'Tasks' },
  { page: 'venue', label: 'Venues', icon: <MapPin size={20} />, mobileLabel: 'Venue' },
  { page: 'trends', label: 'Trends & Ideas', icon: <Lightbulb size={20} />, mobileLabel: 'Trends' },
  { page: 'inspiration', label: 'Inspiration', icon: <Image size={20} />, mobileLabel: 'Inspo' },
  { page: 'settings', label: 'Settings', icon: <SettingsIcon size={20} />, mobileLabel: 'Settings' },
];

export default function App() {
  /* ── Navigation state ── */
  const [page, setPage] = useLocalStorage<AppPage>('wedding-page', 'dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ── Persisted app state ── */
  const [settings, setSettings] = useLocalStorage<WeddingSettings>('wedding-settings', defaultSettings);
  const [activeScheme, setActiveScheme] = useLocalStorage<ColorScheme>('wedding-active-scheme', defaultActiveScheme);
  const [savedSchemes, setSavedSchemes] = useLocalStorage<ColorScheme[]>('wedding-saved-schemes', [...colorPresets]);
  const [guests, setGuests] = useLocalStorage<Guest[]>('wedding-guests', sampleGuests);
  const [vendors, setVendors] = useLocalStorage<Vendor[]>('wedding-vendors', sampleVendors);
  const [budgetItems, setBudgetItems] = useLocalStorage<BudgetItem[]>('wedding-budget', sampleBudget);
  const [checklist, setChecklist] = useLocalStorage<ChecklistTask[]>('wedding-checklist', defaultChecklist);
  const [dashTodos, setDashTodos] = useLocalStorage<DashboardTodo[]>('wedding-dash-todos', sampleDashboardTodos);
  const [venues, setVenues] = useLocalStorage<VenueLocation[]>('wedding-venues', sampleVenues);
  const [timeline, setTimeline] = useLocalStorage<TimeBlock[]>('wedding-timeline', sampleTimeline);
  const [bookmarkedArticles, setBookmarkedArticles] = useLocalStorage<string[]>('wedding-bookmarks', []);
  const [inspirationImages, setInspirationImages] = useLocalStorage<InspirationImage[]>('wedding-inspiration', []);

  /* ── Color scheme handlers ── */
  const handleSetActive = useCallback((scheme: ColorScheme) => setActiveScheme(scheme), [setActiveScheme]);
  const handleSaveScheme = useCallback((scheme: ColorScheme) => {
    setSavedSchemes(prev => [...prev, scheme]);
  }, [setSavedSchemes]);
  const handleDeleteScheme = useCallback((id: string) => {
    setSavedSchemes(prev => prev.filter(s => s.id !== id));
    // If the deleted scheme was active, fall back to first preset
    setActiveScheme(prev => prev.id === id ? colorPresets[0] : prev);
  }, [setSavedSchemes, setActiveScheme]);

  /* ── Bookmark toggle ── */
  const toggleBookmark = useCallback((id: string) => {
    setBookmarkedArticles(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  }, [setBookmarkedArticles]);

  /* ── Data export/import/reset ── */
  const exportAll = useCallback((): string => {
    return JSON.stringify({
      settings, activeScheme, savedSchemes, guests, vendors,
      budgetItems, checklist, dashTodos, venues, timeline,
      bookmarkedArticles, inspirationImages,
    }, null, 2);
  }, [settings, activeScheme, savedSchemes, guests, vendors, budgetItems, checklist, dashTodos, venues, timeline, bookmarkedArticles, inspirationImages]);

  const importAll = useCallback((json: string): boolean => {
    try {
      const data = JSON.parse(json);
      if (data.settings) setSettings(data.settings);
      if (data.activeScheme) setActiveScheme(data.activeScheme);
      if (data.savedSchemes) setSavedSchemes(data.savedSchemes);
      if (data.guests) setGuests(data.guests);
      if (data.vendors) setVendors(data.vendors);
      if (data.budgetItems) setBudgetItems(data.budgetItems);
      if (data.checklist) setChecklist(data.checklist);
      if (data.dashTodos) setDashTodos(data.dashTodos);
      if (data.venues) setVenues(data.venues);
      if (data.timeline) setTimeline(data.timeline);
      if (data.bookmarkedArticles) setBookmarkedArticles(data.bookmarkedArticles);
      if (data.inspirationImages) setInspirationImages(data.inspirationImages);
      return true;
    } catch { return false; }
  }, [setSettings, setActiveScheme, setSavedSchemes, setGuests, setVendors, setBudgetItems, setChecklist, setDashTodos, setVenues, setTimeline, setBookmarkedArticles, setInspirationImages]);

  const resetAll = useCallback(() => {
    const keys = [
      'wedding-settings', 'wedding-active-scheme', 'wedding-saved-schemes',
      'wedding-guests', 'wedding-vendors', 'wedding-budget', 'wedding-checklist',
      'wedding-dash-todos', 'wedding-venues', 'wedding-timeline',
      'wedding-bookmarks', 'wedding-inspiration', 'wedding-page',
    ];
    keys.forEach(k => localStorage.removeItem(k));
    window.location.reload();
  }, []);

  /* ── Navigate ── */
  const navigate = (p: AppPage) => {
    setPage(p);
    setSidebarOpen(false);
  };

  /* ── Render active page ── */
  const renderPage = () => {
    switch (page) {
      case 'colors':
        return <ColorSchemeVisualizer activeScheme={activeScheme} savedSchemes={savedSchemes} onSetActive={handleSetActive} onSaveScheme={handleSaveScheme} onDeleteScheme={handleDeleteScheme} />;
      case 'guests':
        return <GuestManager guests={guests} onUpdateGuests={setGuests} />;
      case 'vendors':
        return <VendorManager vendors={vendors} onUpdateVendors={setVendors} />;
      case 'budget':
        return <BudgetTracker totalBudget={settings.totalBudget} budgetItems={budgetItems} onUpdateBudget={setBudgetItems} />;
      case 'checklist':
        return <WeddingChecklist checklist={checklist} onUpdateChecklist={setChecklist} />;
      case 'venue':
        return <VenuePlanner venues={venues} onUpdateVenues={setVenues} timeline={timeline} onUpdateTimeline={setTimeline} />;
      case 'trends':
        return <TrendsHub articles={defaultArticles} bookmarkedIds={bookmarkedArticles} onToggleBookmark={toggleBookmark} />;
      case 'inspiration':
        return <InspirationBoard images={inspirationImages} onUpdateImages={setInspirationImages} activeScheme={activeScheme} />;
      case 'settings':
        return <Settings settings={settings} onUpdateSettings={setSettings} onExportAll={exportAll} onImportAll={importAll} onResetAll={resetAll} />;
      default:
        return <Dashboard settings={settings} guests={guests} vendors={vendors} budgetItems={budgetItems} checklist={checklist} todos={dashTodos} onUpdateTodos={setDashTodos} activeScheme={activeScheme} inspirationImages={inspirationImages} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#FAFAF8] overflow-hidden">
      {/* ══ Sidebar (desktop) ══ */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100 shadow-sm
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-50">
          <div className="flex items-center gap-2.5">
            <Heart size={22} className="text-gold" fill="#C9A96E" />
            <div>
              <h1 className="text-lg font-serif font-bold text-gray-900">{settings.weddingTitle}</h1>
              <p className="text-[11px] text-gray-400">{settings.bride} & {settings.partner}</p>
            </div>
          </div>
          {/* Active color scheme strip */}
          <div className="flex gap-1 mt-3">
            {[activeScheme.primary, activeScheme.secondary, activeScheme.accent, activeScheme.extra].filter(Boolean).map((c, i) => (
              <div key={i} className="flex-1 h-2 first:rounded-l-full last:rounded-r-full color-transition" style={{ background: c }} />
            ))}
          </div>
        </div>

        {/* Nav links */}
        <nav className="p-3 space-y-0.5 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 120px)' }}>
          {navItems.map(({ page: p, label, icon }) => (
            <button
              key={p}
              onClick={() => navigate(p)}
              className={`
                w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                ${page === p
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              {icon}
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* ══ Sidebar overlay (mobile) ══ */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ══ Main Content ══ */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
          <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Heart size={16} className="text-gold" fill="#C9A96E" />
            <span className="text-sm font-serif font-semibold">{settings.weddingTitle}</span>
          </div>
          <div className="w-9" /> {/* spacer */}
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          {renderPage()}
        </div>
      </main>

      {/* ══ Bottom Tab Bar (mobile) ══ */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 lg:hidden mobile-nav z-20">
        <div className="flex justify-around items-center py-1.5">
          {navItems.slice(0, 5).map(({ page: p, icon, mobileLabel }) => (
            <button
              key={p}
              onClick={() => navigate(p)}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors min-w-[52px] ${
                page === p ? 'text-gray-900' : 'text-gray-400'
              }`}
            >
              {icon}
              <span className="text-[10px] font-medium">{mobileLabel}</span>
            </button>
          ))}
          {/* More button — opens sidebar for remaining nav */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-gray-400 min-w-[52px]"
          >
            <Menu size={20} />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
