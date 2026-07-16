import { useEffect, useState, useRef } from 'react';
import {
  changeAdminPassword,
  clearAdminToken,
  fetchAdminAnalytics,
  fetchAdminInquiries,
  fetchCurrentAdmin,
  getStoredAdminToken,
  loginAdmin,
  storeAdminToken,
} from '../api/admin.js';
import { isApiEnabled } from '../api/content.js';
import { useLandingContent } from '../content/LandingContentContext.jsx';
import AdminPhotoField from './AdminPhotoField.jsx';
import AdminToastStack from './AdminToast.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';
import InquiriesPanel from './InquiriesPanel.jsx';
import { formatRelativeDate, getStatusMeta } from './inquiryStatus.js';
import ThemeToggle from '../components/ThemeToggle.jsx';
import { useTheme } from '../theme/ThemeContext.jsx';
import PageLoader from '../components/PageLoader.jsx';
import './admin.css';
import {
  BriefcaseBusiness,
  Eye,
  FileText,
  Inbox,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  MessageSquareQuote,
  Package,
  Plus,
  RotateCcw,
  Save,
  Settings,
  Trash2,
  UserRound,
  X,
} from 'lucide-react';

const ADMIN_SESSION_KEY = 'queens-banquet-admin-session';
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL ?? 'queensbanquet07@gmail.com';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? 'marou-admin';
const SECTION_LOAD_MS = 420;
const AUTH_LOAD_MS = 900;

const sidebarItems = [
  { id: 'overview', label: 'Dashboard', iconName: 'dashboard', group: 'Work' },
  { id: 'inquiries', label: 'Bookings', iconName: 'calendar_month', group: 'Work' },
  { id: 'experience', label: 'About', iconName: 'info', group: 'Site content' },
  { id: 'services', label: 'Services', iconName: 'room_service', group: 'Site content' },
  { id: 'packages', label: 'Packages', iconName: 'inventory_2', group: 'Site content' },
  { id: 'testimonials', label: 'Testimonials', iconName: 'reviews', group: 'Site content' },
  { id: 'contact', label: 'Contact', iconName: 'contact_page', group: 'Site content' },
  { id: 'brand', label: 'Settings', iconName: 'settings', group: 'Site content' },
];

const pageTitles = {
  overview: 'Dashboard',
  inquiries: 'Bookings',
  experience: 'About content',
  services: 'Services content',
  packages: 'Packages content',
  testimonials: 'Testimonials content',
  contact: 'Contact content',
  brand: 'Settings',
};

function AdminApp() {
  const { content, setContent, resetContent, isHydrating } = useLandingContent();
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => window.localStorage.getItem(ADMIN_SESSION_KEY) === 'active',
  );
  const [activeSection, setActiveSection] = useState('overview');
  const [draft, setDraft] = useState(content);
  const [toasts, setToasts] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [bootLoading, setBootLoading] = useState(true);
  const [sectionLoading, setSectionLoading] = useState(false);
  const [sectionLoadingLabel, setSectionLoadingLabel] = useState('Loading section');
  const [authLoading, setAuthLoading] = useState(false);
  const [authLoadingLabel, setAuthLoadingLabel] = useState('Signing in');
  const sectionTimerRef = useRef(null);
  const authTimerRef = useRef(null);

  function pushToast(type, message) {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, type, message }]);
    window.setTimeout(() => dismissToast(id), 5000);
  }

  function dismissToast(id) {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }

  function requestConfirm(dialog) {
    setConfirmDialog(dialog);
  }

  useEffect(() => {
    setDraft(content);
  }, [content]);

  useEffect(() => {
    const timer = window.setTimeout(() => setBootLoading(false), 750);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (sectionTimerRef.current) window.clearTimeout(sectionTimerRef.current);
      if (authTimerRef.current) window.clearTimeout(authTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isApiEnabled()) {
      return undefined;
    }

    const token = getStoredAdminToken();

    if (!token) {
      return undefined;
    }

    let cancelled = false;

    fetchCurrentAdmin(token)
      .then(() => {
        if (!cancelled) {
          window.localStorage.setItem(ADMIN_SESSION_KEY, 'active');
          setIsAuthenticated(true);
        }
      })
      .catch(() => {
        clearAdminToken();
        window.localStorage.removeItem(ADMIN_SESSION_KEY);
        setIsAuthenticated(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!sidebarOpen) {
      return undefined;
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setSidebarOpen(false);
      }
    }

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [sidebarOpen]);

  function selectSection(sectionId) {
    if (sectionId === activeSection) {
      setSidebarOpen(false);
      return;
    }

    setSidebarOpen(false);
    setSectionLoadingLabel(`Loading ${pageTitles[sectionId] || 'section'}`);
    setSectionLoading(true);
    if (sectionTimerRef.current) {
      window.clearTimeout(sectionTimerRef.current);
    }
    sectionTimerRef.current = window.setTimeout(() => {
      setActiveSection(sectionId);
      setSectionLoading(false);
    }, SECTION_LOAD_MS);
  }

  function handleLoginSuccess() {
    setAuthLoadingLabel('Opening dashboard');
    setAuthLoading(true);
    if (authTimerRef.current) {
      window.clearTimeout(authTimerRef.current);
    }
    authTimerRef.current = window.setTimeout(() => {
      window.localStorage.setItem(ADMIN_SESSION_KEY, 'active');
      setIsAuthenticated(true);
      setActiveSection('overview');
      setAuthLoading(false);
    }, AUTH_LOAD_MS);
  }

  function handleLogout() {
    requestConfirm({
      title: 'Sign out?',
      message: 'Are you sure, you want to logout?',
      confirmLabel: 'Logout',
      variant: 'logout',
      onConfirm: () => {
        setAuthLoadingLabel('Signing out');
        setAuthLoading(true);
        if (authTimerRef.current) {
          window.clearTimeout(authTimerRef.current);
        }
        authTimerRef.current = window.setTimeout(() => {
          window.localStorage.removeItem(ADMIN_SESSION_KEY);
          clearAdminToken();
          setIsAuthenticated(false);
          setSidebarOpen(false);
          setAuthLoading(false);
        }, AUTH_LOAD_MS);
      },
    });
  }

  function updateDraft(updater) {
    setDraft((current) => {
      const nextDraft = structuredClone(current);
      updater(nextDraft);
      return nextDraft;
    });
  }

  async function saveChanges() {
    setIsSaving(true);

    try {
      await setContent(draft);
      pushToast(
        'success',
        isApiEnabled() && getStoredAdminToken()
          ? 'Saved to the database. Open landing pages update automatically while npm run dev is running.'
          : 'Saved locally. Open landing pages update automatically while npm run dev is running.',
      );
    } catch (error) {
      pushToast('error', error.message ?? 'Unable to save changes right now.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleReset() {
    requestConfirm({
      title: 'Reset all content?',
      message: 'This restores every landing page section to its default text and images. This cannot be undone.',
      confirmLabel: 'Reset content',
      variant: 'danger',
      onConfirm: async () => {
        try {
          const defaultContent = await resetContent();
          setDraft(defaultContent);
          pushToast(
            'success',
            isApiEnabled() && getStoredAdminToken()
              ? 'Content was reset in the database and on open landing pages.'
              : 'Local content was reset and open landing pages updated automatically.',
          );
        } catch (error) {
          pushToast('error', error.message ?? 'Unable to reset content right now.');
        }
      },
    });
  }

  if (!isAuthenticated) {
    return (
      <>
        <PageLoader
          visible={bootLoading || authLoading || isHydrating}
          label={
            authLoading
              ? authLoadingLabel
              : isHydrating
                ? 'Loading workspace'
                : 'Opening admin portal'
          }
        />
        {!bootLoading && !authLoading ? (
          <AdminLogin onLoginSuccess={handleLoginSuccess} brand={content.brand} />
        ) : null}
      </>
    );
  }

  const activeItem = sidebarItems.find((item) => item.id === activeSection);
  const ownerName = draft.brand?.owner || 'Marou Madrid';

  return (
    <>
      <PageLoader
        visible={bootLoading || authLoading}
        label={authLoading ? authLoadingLabel : 'Opening dashboard'}
      />
      {/* Mobile top navigation bar — single row */}
      <div className="md:hidden h-14 bg-background border-b border-outline-variant flex items-center justify-between gap-2 px-3 sm:px-4 sticky top-0 z-40 pt-[env(safe-area-inset-top)]">
        <button
          className="text-on-surface hover:text-primary p-2 flex items-center shrink-0"
          type="button"
          aria-expanded={sidebarOpen}
          aria-controls="admin-sidebar"
          aria-label={sidebarOpen ? 'Close admin menu' : 'Open admin menu'}
          onClick={() => setSidebarOpen((current) => !current)}
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <strong className="text-on-surface tracking-tight font-headline-md text-sm sm:text-base truncate min-w-0 flex-1 text-center px-1">
          Queen&apos;s Banquet
        </strong>
        <div className="flex items-center gap-1 shrink-0">
          <button
            className="relative text-on-surface-variant hover:text-primary transition-colors flex items-center p-2"
            type="button"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
          </button>
          <ThemeToggle compact />
        </div>
      </div>

      <div className="admin-shell min-h-dvh bg-background text-on-surface flex overflow-x-clip">
        {/* Left Side Navigation Menu */}
        <aside
          className={`fixed left-0 top-0 h-dvh bg-surface-container border-r border-outline-variant flex flex-col py-6 sm:py-container-padding z-50 transition-transform duration-300 overflow-y-auto overscroll-contain md:translate-x-0 md:w-sidebar-width ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          id="admin-sidebar"
          style={{ width: 'min(280px, 88vw)' }}
        >
          <div className="px-4 sm:px-6 mb-8 sm:mb-10 flex justify-between items-start gap-3">
            <div className="min-w-0">
              <h1 className="font-headline-md text-xl sm:text-headline-md text-primary tracking-tight truncate">Queen's Banquet</h1>
              <p className="font-label-caps text-label-caps text-on-surface-variant mt-1 text-[11px]">LUXURY CONCIERGE</p>
            </div>
            <button
              className="md:hidden text-on-surface-variant hover:text-primary flex items-center shrink-0"
              type="button"
              aria-label="Close admin menu"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <nav className="flex-1 px-2 space-y-6 pb-4" aria-label="Admin sections">
            {(() => {
              // Group sidebar items by their group
              const groups = sidebarItems.reduce((acc, item) => {
                acc[item.group] ??= [];
                acc[item.group].push(item);
                return acc;
              }, {});

              return Object.entries(groups).map(([groupName, items]) => (
                <div key={groupName} className="space-y-1">
                  <p className="px-4 mb-2 font-label-caps text-label-caps text-primary uppercase tracking-widest text-[11px] font-semibold">
                    {groupName}
                  </p>
                  <div className="space-y-1">
                    {items.map((item) => {
                      const isActive = activeSection === item.id;
                      return (
                        <button
                          key={item.id}
                          className={`w-full flex items-center gap-3 py-2 text-left transition-colors duration-200 hover:text-primary ${
                            isActive ? 'sidebar-item-active font-semibold' : 'sidebar-item-inactive'
                          }`}
                          type="button"
                          onClick={() => selectSection(item.id)}
                        >
                          <span
                            className="material-symbols-outlined text-[20px]"
                            style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                          >
                            {item.iconName}
                          </span>
                          <span className="font-title-sm text-title-sm">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ));
            })()}
          </nav>

          <div className="px-4 sm:px-6 mt-auto pb-[max(1rem,env(safe-area-inset-bottom))]">
            <button
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-surface-container-high border border-outline-variant hover:brightness-110 transition-all text-left"
              type="button"
              onClick={handleLogout}
              title="Sign out"
            >
              <img
                className="w-10 h-10 rounded-full object-cover border border-primary shrink-0"
                alt=""
                src={draft?.adminProfile?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8q5SWUZ4h09Vxw_oq6GXDpVnokXQWGWrfwwiCPcSAtB5LVDyctBoZ9wMz24nmZ6JXuy91YoYKgPHrCWoBbWFvXKRfV8UwhIr7CrEn2YrLmmhB6s-60YLU9c7zdJj4FLe8ommixgSsN5j15ZbMdeBfB-OrIxAn9jEYgphZSVl93BEtQHUc5XRB299yAzjy-7GpfU3lc5b8y4FlA7pWCeqfHT07NHopkuTvvBlSxFKkWhj_1WG4R-O1MBpWnVyAfPF74ZG-xFfvImuM'}
              />
              <div className="flex-1 min-w-0">
                <p className="font-title-sm text-title-sm text-on-surface truncate">{draft?.adminProfile?.displayName || 'Admin'}</p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter truncate">Premium Access • Sign Out</p>
              </div>
            </button>
          </div>
        </aside>

        {/* Sidebar Backdrop for Mobile Drawer */}
        {sidebarOpen ? (
          <button
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            type="button"
            aria-label="Close admin menu"
            onClick={() => setSidebarOpen(false)}
          />
        ) : null}

        {/* Main Work Area Container */}
        <div className="flex-1 md:ml-sidebar-width min-h-dvh flex flex-col min-w-0 w-full">
          {/* Desktop TopNavBar — hidden on mobile (mobile uses the sticky bar above) */}
          <header className="hidden md:flex h-16 bg-background border-b border-outline-variant items-center justify-between gap-3 px-6 lg:px-container-padding sticky top-0 z-30">
            <div className="flex items-center flex-1 min-w-0 max-w-md">
              <div className="relative w-full">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
                <input
                  className="w-full bg-transparent border-none border-b border-outline-variant focus:border-primary focus:ring-0 text-sm py-2 pl-10 transition-all placeholder:text-on-surface-variant/50 text-on-surface"
                  placeholder="Search inquiries..."
                  type="text"
                />
              </div>
            </div>
            <div className="flex items-center gap-4 lg:gap-6 shrink-0">
              <ThemeToggle compact />
              <button className="relative text-on-surface-variant hover:text-primary transition-colors flex items-center" type="button" aria-label="Notifications">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full" />
              </button>
              <button className="text-on-surface-variant hover:text-primary transition-colors flex items-center" type="button" aria-label="Help">
                <span className="material-symbols-outlined">help</span>
              </button>
              <div className="h-8 w-px bg-outline-variant" />
              <div className="flex items-center gap-3 cursor-pointer group">
                <span className="font-title-sm text-title-sm group-hover:text-primary transition-colors text-on-surface whitespace-nowrap">Concierge Desk</span>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary flex items-center">expand_more</span>
              </div>
            </div>
          </header>

          {/* Main workspace container */}
          <main className="relative flex-1 p-4 sm:p-6 lg:p-container-padding bg-background overflow-y-auto overflow-x-clip">
            <PageLoader
              visible={sectionLoading}
              variant="overlay"
              label={sectionLoadingLabel}
            />
            {/* Section heading header block */}
            <header className="mb-6 sm:mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6">
              <div className="min-w-0">
                <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-2 text-[11px]">
                  <span>Admin</span>
                  <span className="mx-2">/</span>
                  <span>{activeItem?.label ?? 'Dashboard'}</span>
                </p>
                <h2 className="font-headline-md text-on-surface font-bold text-2xl sm:text-3xl text-balance">
                  {activeSection === 'overview' ? 'Executive Overview' : pageTitles[activeSection]}
                </h2>
                <p className="text-on-surface-variant font-body-sm max-w-2xl mt-1 text-pretty">
                  {activeSection === 'overview'
                    ? 'Manage your premium banquet operations and real-time inquiries with absolute precision.'
                    : activeSection === 'brand'
                    ? 'Manage your admin profile, brand identity, hero copy, and account security.'
                    : `Update and customize the ${activeItem?.label} section elements in real time.`}
                </p>
              </div>

              {/* Action Buttons for Editors */}
              <div className="flex flex-wrap items-stretch sm:items-center gap-2 sm:gap-3 w-full lg:w-auto">
                <a
                  className="border border-outline-variant text-on-surface px-4 sm:px-6 py-2 font-label-caps text-label-caps hover:border-primary transition-all flex items-center justify-center gap-2 text-xs flex-1 sm:flex-none"
                  href="/"
                >
                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                  <span className="whitespace-nowrap">View site</span>
                </a>
                {activeSection !== 'overview' && activeSection !== 'inquiries' ? (
                  <>
                    <button
                      className="border border-outline-variant text-on-surface px-4 sm:px-6 py-2 font-label-caps text-label-caps hover:border-primary transition-all flex items-center justify-center gap-2 text-xs flex-1 sm:flex-none"
                      type="button"
                      onClick={handleReset}
                    >
                      <span className="material-symbols-outlined text-[18px]">restore</span>
                      <span className="whitespace-nowrap">Reset</span>
                    </button>
                    <button
                      className="bg-primary text-on-primary px-4 sm:px-6 py-2 font-label-caps text-label-caps hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-xs flex-1 sm:flex-none sm:min-w-[8.5rem]"
                      type="button"
                      onClick={saveChanges}
                      disabled={isSaving}
                    >
                      <span className="material-symbols-outlined text-[18px]">save</span>
                      <span className="whitespace-nowrap">{isSaving ? 'Saving...' : 'Save'}</span>
                    </button>
                  </>
                ) : null}
              </div>
            </header>

            {/* Active view */}
            <div
              className={`admin-content-view min-w-0 transition-opacity duration-300 ${
                sectionLoading ? 'opacity-40 pointer-events-none' : 'opacity-100'
              }`}
            >
              {activeSection === 'overview' ? (
                <Overview content={draft} onNavigate={selectSection} />
              ) : null}
              {activeSection === 'inquiries' ? <InquiriesPanel pushToast={pushToast} /> : null}
              {activeSection === 'brand' ? (
                <BrandHeroEditor draft={draft} updateDraft={updateDraft} pushToast={pushToast} />
              ) : null}
              {activeSection === 'experience' ? (
                <ExperienceEditor draft={draft} updateDraft={updateDraft} requestConfirm={requestConfirm} />
              ) : null}
              {activeSection === 'contact' ? (
                <ContactEditor draft={draft} updateDraft={updateDraft} requestConfirm={requestConfirm} />
              ) : null}
              {activeSection === 'services' ? (
                <ServicesEditor draft={draft} updateDraft={updateDraft} requestConfirm={requestConfirm} />
              ) : null}
              {activeSection === 'packages' ? (
                <PackagesEditor draft={draft} updateDraft={updateDraft} requestConfirm={requestConfirm} />
              ) : null}
              {activeSection === 'testimonials' ? (
                <TestimonialsEditor draft={draft} updateDraft={updateDraft} requestConfirm={requestConfirm} />
              ) : null}
            </div>
          </main>
        </div>
      </div>
      <AdminToastStack toasts={toasts} onDismiss={dismissToast} />
      <ConfirmDialog dialog={confirmDialog} onCancel={() => setConfirmDialog(null)} />
    </>
  );
}

function AdminLogin({ onLoginSuccess, brand }) {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setCredentials((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (isApiEnabled()) {
        const result = await loginAdmin(credentials);
        storeAdminToken(result.token);
        onLoginSuccess();
        return;
      }

      if (credentials.email === ADMIN_EMAIL && credentials.password === ADMIN_PASSWORD) {
        onLoginSuccess();
        return;
      }

      setError('Invalid admin email or password.');
    } catch (loginError) {
      setError(loginError.message ?? 'Invalid admin email or password.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="admin-login-page bg-background text-on-surface">
      <section
        className="admin-login-hero"
        style={{ backgroundImage: "url('/luxury_banquet_login.png')" }}
        aria-hidden="true"
      >
        <div className="admin-login-hero-overlay" />
        <div className="admin-login-hero-copy">
          <h2 className="font-headline-md text-[clamp(1.75rem,3vw,2.25rem)] text-white font-bold leading-tight font-display text-balance">
            Secure Access to the Executive Suite
          </h2>
          <div className="w-20 h-0.5 bg-[#d4af37]" />
          <p className="text-white/75 text-sm leading-relaxed font-body text-pretty">
            Authorized personnel only. Access to the Queen&apos;s Banquet administrative dashboard requires multi-factor authentication and high-level security clearance.
          </p>
        </div>
      </section>

      <section
        className="admin-login-mobile-banner md:hidden"
        style={{ backgroundImage: "url('/luxury_banquet_login.png')" }}
        aria-hidden="true"
      >
        <div className="space-y-2 text-center">
          <p className="text-[#d4af37] text-[10px] font-bold uppercase tracking-[0.18em]">
            Queen&apos;s Banquet
          </p>
          <h2 className="font-display text-white text-lg font-semibold leading-snug text-balance">
            Administrative Access
          </h2>
        </div>
      </section>

      <section className="admin-login-form-panel">
        <div className="admin-login-theme-toggle">
          <ThemeToggle />
        </div>

        <div className="admin-login-form-inner">
          <div className="admin-login-brand-row">
            <span className="material-symbols-outlined text-primary text-2xl shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
              crown
            </span>
            <span className="text-primary font-display">
              Queen&apos;s Banquet
            </span>
          </div>

          <div className="admin-login-heading">
            <h1>Administrative Login</h1>
            <p>Enter your credentials to manage the portfolio.</p>
          </div>

          <form className="admin-login-form" onSubmit={handleSubmit}>
            <div className="admin-login-field">
              <label htmlFor="admin-login-email">Corporate Email</label>
              <input
                id="admin-login-email"
                name="email"
                type="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="administrator@queensbanquet.com"
                required
                autoComplete="username"
              />
            </div>

            <div className="admin-login-field">
              <label htmlFor="admin-login-password">Access Token</label>
              <div className="admin-login-password-wrap">
                <input
                  id="admin-login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="admin-login-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {error ? <p className="admin-login-error">{error}</p> : null}

            <button className="admin-login-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="admin-login-links">
              <span>Forgot Credentials?</span>
              <span>Request Access</span>
            </div>
          </form>
        </div>

        <div className="admin-login-footer">
          <span className="material-symbols-outlined text-primary text-sm shrink-0">verified_user</span>
          <span>Multi-Factor Authentication Enabled</span>
        </div>
      </section>
    </main>
  );
}

const defaultMockInquiries = [
  {
    id: 'mock-1',
    coupleName: 'Elizabeth Windsor',
    coordinationNeed: 'ROYAL SIGNATURE',
    preferredMeetingDate: 'Oct 12, 2024',
    status: 'approved',
  },
  {
    id: 'mock-2',
    coupleName: 'Julian Aster',
    coordinationNeed: 'SOVEREIGN',
    preferredMeetingDate: 'Oct 14, 2024',
    status: 'pending',
  },
  {
    id: 'mock-3',
    coupleName: 'Catherine Halloway',
    coordinationNeed: 'HEIRLOOM',
    preferredMeetingDate: 'Oct 15, 2024',
    status: 'approved',
  },
  {
    id: 'mock-4',
    coupleName: 'Marcus Sterling',
    coordinationNeed: 'ROYAL SIGNATURE',
    preferredMeetingDate: 'Oct 16, 2024',
    status: 'pending',
  },
];

function Overview({ content, onNavigate }) {
  const { resolvedTheme } = useTheme();
  const [inquiries, setInquiries] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(isApiEnabled());
  const sparklineRef = useRef(null);
  const analyticsChartRef = useRef(null);

  useEffect(() => {
    if (!isApiEnabled()) {
      setIsLoading(false);
      return undefined;
    }

    const token = getStoredAdminToken();
    if (!token) {
      setIsLoading(false);
      return undefined;
    }

    let cancelled = false;
    Promise.all([
      fetchAdminInquiries(token).catch(() => []),
      fetchAdminAnalytics(token).catch(() => null),
    ]).then(([inquiriesData, analyticsData]) => {
      if (!cancelled) {
        setInquiries(inquiriesData ?? []);
        setAnalytics(analyticsData);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!window.Chart) return undefined;

    let sparkChart = null;
    let mainChart = null;

    if (sparklineRef.current) {
      const sparkCtx = sparklineRef.current.getContext('2d');
      sparkChart = new window.Chart(sparkCtx, {
        type: 'line',
        data: {
          labels: [1, 2, 3, 4, 5, 6, 7],
          datasets: [{
            data: [12, 19, 15, 25, 22, 30, 32],
            borderColor: '#d4af37',
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4,
            fill: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { x: { display: false }, y: { display: false } }
        }
      });
    }

    if (analyticsChartRef.current) {
      const mainCtx = analyticsChartRef.current.getContext('2d');
      const gradient = mainCtx.createLinearGradient(0, 0, 0, 300);
      gradient.addColorStop(0, 'rgba(212, 175, 55, 0.2)');
      gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');

      mainChart = new window.Chart(mainCtx, {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'RSVP Submissions',
            data: [45, 62, 55, 80, 75, 95, 110],
            borderColor: '#d4af37',
            borderWidth: 3,
            pointBackgroundColor: '#d4af37',
            pointBorderColor: resolvedTheme === 'dark' ? '#16130b' : '#fbf9f9',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 8,
            tension: 0.3,
            fill: true,
            backgroundColor: gradient
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: resolvedTheme === 'dark' ? '#2a2a2a' : '#e3e2e2' },
              ticks: { color: resolvedTheme === 'dark' ? '#d0c5af' : '#5f5e5e', font: { family: 'Inter', size: 10 } }
            },
            x: {
              grid: { display: false },
              ticks: { color: resolvedTheme === 'dark' ? '#d0c5af' : '#5f5e5e', font: { family: 'Inter', size: 10 } }
            }
          }
        }
      });
    }

    return () => {
      if (sparkChart) sparkChart.destroy();
      if (mainChart) mainChart.destroy();
    };
  }, [isLoading, resolvedTheme]);

  const list = inquiries ?? [];
  const inquiriesToShow = list.length > 0 ? list : defaultMockInquiries;
  const recent = [...inquiriesToShow]
    .sort((a, b) => new Date(b.createdAt || b.preferredMeetingDate || 0) - new Date(a.createdAt || a.preferredMeetingDate || 0))
    .slice(0, 4);

  const totalInquiriesCount = list.length > 0 ? list.length : 320;

  function formatShortDate(value) {
    if (!value) return 'Date TBD';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function getPackageStyle(packageName) {
    const name = (packageName || '').toUpperCase();
    if (name.includes('SIGNATURE')) {
      return 'bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40';
    }
    if (name.includes('SOVEREIGN')) {
      return 'bg-tertiary-container/20 text-tertiary-container border border-tertiary-container/40';
    }
    if (name.includes('HEIRLOOM')) {
      return 'bg-[#d4af37]/60 text-on-primary border border-[#d4af37]';
    }
    return 'bg-outline-variant/20 text-on-surface-variant border border-outline-variant/40';
  }

  return (
    <div className="grid grid-cols-12 gap-3 sm:gap-4 lg:gap-bento-gap auto-rows-auto md:auto-rows-[200px] text-on-surface">
      {/* Primary Metric Card */}
      <div className="col-span-12 md:col-span-4 bento-card p-4 sm:p-6 flex flex-col justify-between rounded-xl min-h-[160px]">
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0">
            <p className="font-label-caps text-label-caps text-primary uppercase text-[11px]">Total RSVP Inquiries</p>
            <h3 className="font-display-lg-mobile text-on-surface mt-2 text-2xl md:text-3xl font-bold">{totalInquiriesCount}</h3>
          </div>
          <div className="p-2 bg-primary/10 rounded-lg flex items-center shrink-0">
            <span className="material-symbols-outlined text-primary">mail</span>
          </div>
        </div>
        <div className="mt-4 flex-1 flex flex-col justify-end">
          <div className="h-10 w-full">
            <canvas ref={sparklineRef} className="w-full h-full"></canvas>
          </div>
          <p className="text-xs text-on-surface-variant mt-2 flex items-center gap-1">
            <span className="text-primary font-semibold">+12%</span> from last week
          </p>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="col-span-12 md:col-span-8 bento-card p-4 sm:p-6 rounded-xl flex flex-col justify-between min-h-[200px]">
        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3 mb-4">
          <p className="font-label-caps text-label-caps text-primary uppercase text-[11px]">RSVP Submissions (Weekly View)</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-[10px] border border-outline text-on-surface rounded-full hover:border-primary" type="button">Week</button>
            <button className="px-3 py-1 text-[10px] border border-primary text-primary rounded-full" type="button">Month</button>
          </div>
        </div>
        <div className="flex-1 relative min-h-[110px]">
          <canvas ref={analyticsChartRef} className="w-full h-full"></canvas>
        </div>
      </div>

      {/* Real-time Inquiries Table */}
      <div className="col-span-12 bento-card rounded-xl overflow-hidden flex flex-col h-auto md:row-span-2 min-w-0">
        <div className="p-4 sm:p-6 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-surface-container">
          <h4 className="font-headline-md text-lg sm:text-headline-md text-on-surface">Active Inquiries</h4>
          <button
            className="bg-primary text-on-primary px-4 sm:px-6 py-2 font-label-caps text-label-caps hover:brightness-110 transition-all text-xs w-full sm:w-auto"
            onClick={() => onNavigate?.('inquiries')}
            type="button"
          >
            Export Report
          </button>
        </div>
        <div className="overflow-x-auto flex-1 -mx-0">
          <table className="w-full text-left min-w-[640px]">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low">
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-label-caps text-label-caps text-on-surface-variant text-[11px]">Guest Name</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-label-caps text-label-caps text-on-surface-variant text-[11px]">Package</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-label-caps text-label-caps text-on-surface-variant text-[11px]">Date</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-label-caps text-label-caps text-on-surface-variant text-[11px]">Status</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-label-caps text-label-caps text-on-surface-variant text-[11px] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {recent.map((inquiry) => {
                const initials = (inquiry.coupleName || 'Guest')
                  .split(/\s+/)
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((n) => n[0]?.toUpperCase() ?? '')
                  .join('');
                const isApproved = (inquiry.status || '').toLowerCase() === 'approved';

                return (
                  <tr className="hover:bg-surface-container-high/50 transition-colors" key={inquiry.id}>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-outline-variant flex items-center justify-center text-xs font-bold text-on-surface shrink-0">
                          {initials || 'EW'}
                        </div>
                        <span className="font-title-sm text-on-surface truncate max-w-[10rem] sm:max-w-none">{inquiry.coupleName || 'Elizabeth Windsor'}</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${getPackageStyle(inquiry.coordinationNeed)}`}>
                        {(inquiry.coordinationNeed || 'ROYAL SIGNATURE').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-on-surface-variant whitespace-nowrap">
                      {formatShortDate(inquiry.preferredMeetingDate || inquiry.eventDate)}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <span className={`flex items-center gap-1.5 text-xs ${isApproved ? 'text-primary' : 'text-on-surface-variant'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isApproved ? 'bg-primary animate-pulse' : 'bg-on-surface-variant'}`}></span>
                        {isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                      <button
                        className="material-symbols-outlined text-on-surface-variant hover:text-primary inline-flex items-center justify-end"
                        onClick={() => onNavigate?.('inquiries')}
                        type="button"
                        aria-label="Open inquiry"
                      >
                        more_vert
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Secondary Metric */}
      <div className="col-span-12 sm:col-span-6 bento-card p-4 sm:p-6 rounded-xl relative overflow-hidden group min-h-[140px]">
        <div className="relative z-10 flex flex-col justify-between h-full">
          <p className="font-label-caps text-label-caps text-primary uppercase text-[11px]">Venue Availability</p>
          <h3 className="font-headline-md text-display-lg-mobile text-on-surface mt-2 text-2xl sm:text-3xl font-bold">84%</h3>
          <div className="w-full bg-outline-variant h-1 rounded-full mt-4 overflow-hidden">
            <div className="bg-primary h-full transition-all duration-1000" style={{ width: '84%' }}></div>
          </div>
        </div>
        <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-[120px]">castle</span>
        </div>
      </div>

      {/* Tertiary Metric */}
      <div className="col-span-12 sm:col-span-6 bento-card p-4 sm:p-6 rounded-xl relative overflow-hidden group min-h-[140px]">
        <div className="relative z-10 flex flex-col justify-between h-full">
          <p className="font-label-caps text-label-caps text-primary uppercase text-[11px]">Average Inquiry Time</p>
          <h3 className="font-headline-md text-display-lg-mobile text-on-surface mt-2 text-2xl sm:text-3xl font-bold">12.4m</h3>
          <p className="text-xs text-on-surface-variant mt-auto">Exceeding concierge standard by 2m</p>
        </div>
        <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-[120px]">timer</span>
        </div>
      </div>
    </div>
  );
}

function BrandHeroEditor({ draft, updateDraft, pushToast }) {
  const avatarSrc = draft?.adminProfile?.avatar || null;
  const displayName = draft?.adminProfile?.displayName || 'Admin';
  const role = draft?.adminProfile?.role || 'Luxury Concierge';
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const fileRef = useRef(null);

  const passwordsMatch = Boolean(newPassword && confirmPassword && newPassword === confirmPassword);
  const canSubmitPassword = Boolean(
    currentPassword
    && newPassword.length >= 8
    && passwordsMatch
    && !isUpdatingPassword,
  );

  async function handlePasswordUpdate(event) {
    event.preventDefault();
    setPasswordMessage('');
    setPasswordError('');

    if (!currentPassword) {
      setPasswordError('Enter your current password.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setIsUpdatingPassword(true);

    try {
      if (!isApiEnabled()) {
        throw new Error('Connect the API to update your password.');
      }

      const token = getStoredAdminToken();
      const result = await changeAdminPassword(
        {
          currentPassword,
          newPassword,
          confirmPassword,
        },
        token,
      );

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordMessage(result.message || 'Password updated successfully.');
      pushToast?.('success', 'Password updated successfully.');
    } catch (error) {
      const message = error.message ?? 'Unable to update password.';
      setPasswordError(message);
      pushToast?.('error', message);
    } finally {
      setIsUpdatingPassword(false);
    }
  }

  async function handleAvatarUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { window.alert('Please choose an image file.'); return; }
    if (file.size > 2 * 1024 * 1024) { window.alert('Please choose an image under 2MB.'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      updateDraft((next) => {
        next.adminProfile ??= {};
        next.adminProfile.avatar = reader.result;
      });
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  }

  function removeAvatar() {
    updateDraft((next) => {
      next.adminProfile ??= {};
      next.adminProfile.avatar = '';
    });
  }

  return (
    <div className="space-y-8 text-on-surface">

      {/* ── SECTION 1: Admin Profile ── */}
      <div className="bento-card bg-surface-container-low border border-outline-variant rounded-xl p-5 sm:p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-primary text-[20px]">manage_accounts</span>
          <span className="font-label-caps text-label-caps text-primary uppercase text-[11px] tracking-[0.12em]">Admin Profile</span>
        </div>
        <p className="text-on-surface-variant text-xs mb-8">Manage your public-facing identity across the dashboard and sidebar.</p>

        <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-stretch md:items-start">
          {/* Avatar Upload Zone */}
          <div className="flex flex-col items-center gap-4 shrink-0 w-full md:w-auto">
            <div className="relative group">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border-2 border-primary shadow-lg"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-surface-container-high border-2 border-dashed border-outline-variant flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant text-[40px]">person</span>
                </div>
              )}
              <button
                type="button"
                className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                onClick={() => fileRef.current?.click()}
              >
                <span className="material-symbols-outlined text-white text-2xl">photo_camera</span>
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleAvatarUpload} />
            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                className="border border-outline-variant text-on-surface px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider hover:border-primary transition-all"
                onClick={() => fileRef.current?.click()}
              >
                Upload Photo
              </button>
              {avatarSrc ? (
                <button
                  type="button"
                  className="border border-outline-variant text-on-surface-variant px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider hover:border-red-400 hover:text-red-400 transition-all"
                  onClick={removeAvatar}
                >
                  Remove
                </button>
              ) : null}
            </div>
            <p className="text-[10px] text-on-surface-variant text-center">JPG, PNG or WebP · Max 2MB</p>
          </div>

          {/* Profile Text Fields */}
          <div className="admin-profile-fields flex-1 min-w-0 w-full grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <div className="admin-field min-w-0">
              <span>Display name</span>
              <input
                type="text"
                value={displayName}
                placeholder="Admin"
                onChange={(e) => updateDraft((next) => { next.adminProfile ??= {}; next.adminProfile.displayName = e.target.value; })}
              />
            </div>
            <div className="admin-field min-w-0">
              <span>Role / Title</span>
              <input
                type="text"
                value={role}
                placeholder="Luxury Concierge"
                onChange={(e) => updateDraft((next) => { next.adminProfile ??= {}; next.adminProfile.role = e.target.value; })}
              />
            </div>
            <div className="admin-field min-w-0 md:col-span-2">
              <span>Contact email</span>
              <input
                type="email"
                value={draft?.adminProfile?.email || ''}
                placeholder="admin@queensbanquet.com"
                onChange={(e) => updateDraft((next) => { next.adminProfile ??= {}; next.adminProfile.email = e.target.value; })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 2: Brand Identity ── */}
      <div className="bento-card bg-surface-container-low border border-outline-variant rounded-xl p-5 sm:p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-primary text-[20px]">shield</span>
          <span className="font-label-caps text-label-caps text-primary uppercase text-[11px] tracking-[0.12em]">Brand Identity</span>
        </div>
        <p className="text-on-surface-variant text-xs mb-8">Core business information displayed across the site.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminField
            label="Business name"
            value={draft.brand.name}
            onChange={(value) => updateDraft((next) => { next.brand.name = value; })}
          />
          <AdminField
            label="Owner name"
            value={draft.brand.owner}
            onChange={(value) => updateDraft((next) => { next.brand.owner = value; })}
          />
          <div className="admin-field col-span-1 md:col-span-2">
            <span>Tagline / Motto</span>
            <input
              type="text"
              value={draft.brand?.tagline || ''}
              placeholder="Luxury Concierge"
              onChange={(e) => updateDraft((next) => { next.brand.tagline = e.target.value; })}
            />
          </div>
        </div>
      </div>

      {/* ── SECTION 3: Hero Content ── */}
      <div className="bento-card bg-surface-container-low border border-outline-variant rounded-xl p-5 sm:p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-primary text-[20px]">newspaper</span>
          <span className="font-label-caps text-label-caps text-primary uppercase text-[11px] tracking-[0.12em]">Hero Content</span>
        </div>
        <p className="text-on-surface-variant text-xs mb-8">Controls the top hero banner text on the public landing page.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminField
            label="Hero eyebrow"
            value={draft.heroContent.eyebrow}
            onChange={(value) => updateDraft((next) => { next.heroContent.eyebrow = value; })}
          />
          <AdminField
            label="Hero title"
            value={draft.heroContent.title}
            onChange={(value) => updateDraft((next) => { next.heroContent.title = value; })}
          />
          <div className="md:col-span-2">
            <AdminTextarea
              label="Hero paragraph"
              value={draft.heroContent.copy}
              onChange={(value) => updateDraft((next) => { next.heroContent.copy = value; })}
            />
          </div>
        </div>
      </div>

      {/* ── SECTION 4: Account Security ── */}
      <div className="bento-card bg-surface-container-low border border-outline-variant rounded-xl p-5 sm:p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-primary text-[20px]">lock</span>
          <span className="font-label-caps text-label-caps text-primary uppercase text-[11px] tracking-[0.12em]">Account Security</span>
        </div>
        <p className="text-on-surface-variant text-xs mb-8">
          Update your administrative login password. Use a unique password of at least 8 characters.
        </p>

        <form className="space-y-6" onSubmit={handlePasswordUpdate}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="admin-field md:col-span-2">
              <span>Current password</span>
              <div className="relative">
                <input
                  type={showCurrentPw ? 'text' : 'password'}
                  className="w-full pr-10"
                  value={currentPassword}
                  placeholder="Enter current password"
                  autoComplete="current-password"
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    setPasswordError('');
                    setPasswordMessage('');
                  }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                  onClick={() => setShowCurrentPw(!showCurrentPw)}
                  aria-label={showCurrentPw ? 'Hide current password' : 'Show current password'}
                >
                  <span className="material-symbols-outlined text-[18px]">{showCurrentPw ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <div className="admin-field">
              <span>New password</span>
              <div className="relative">
                <input
                  type={showNewPw ? 'text' : 'password'}
                  className="w-full pr-10"
                  value={newPassword}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setPasswordError('');
                    setPasswordMessage('');
                  }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                  onClick={() => setShowNewPw(!showNewPw)}
                  aria-label={showNewPw ? 'Hide new password' : 'Show new password'}
                >
                  <span className="material-symbols-outlined text-[18px]">{showNewPw ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <div className="admin-field">
              <span>Confirm new password</span>
              <div className="relative">
                <input
                  type={showConfirmPw ? 'text' : 'password'}
                  className="w-full pr-10"
                  value={confirmPassword}
                  placeholder="Repeat new password"
                  autoComplete="new-password"
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordError('');
                    setPasswordMessage('');
                  }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                  onClick={() => setShowConfirmPw(!showConfirmPw)}
                  aria-label={showConfirmPw ? 'Hide confirm password' : 'Show confirm password'}
                >
                  <span className="material-symbols-outlined text-[18px]">{showConfirmPw ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>
          </div>

          {newPassword && newPassword.length < 8 ? (
            <p className="text-on-surface-variant text-xs">New password must be at least 8 characters.</p>
          ) : null}
          {newPassword && confirmPassword && !passwordsMatch ? (
            <p className="text-red-400 text-xs">Passwords do not match.</p>
          ) : null}
          {passwordsMatch ? (
            <p className="text-green-400 text-xs">Passwords match. Click Update password to save.</p>
          ) : null}
          {passwordError ? <p className="text-red-400 text-xs">{passwordError}</p> : null}
          {passwordMessage ? <p className="text-green-400 text-xs">{passwordMessage}</p> : null}

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <button
              type="submit"
              className="bg-primary text-on-primary px-6 py-3 font-label-caps text-label-caps text-xs hover:brightness-110 transition-all disabled:opacity-50 inline-flex items-center justify-center gap-2 w-full sm:w-auto"
              disabled={!canSubmitPassword}
            >
              <span className="material-symbols-outlined text-[18px]">lock_reset</span>
              {isUpdatingPassword ? 'Updating...' : 'Update password'}
            </button>
            <p className="text-[11px] text-on-surface-variant">
              This updates your login credentials only — not the site content Save button.
            </p>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-outline-variant flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="material-symbols-outlined text-primary text-[18px] shrink-0">verified_user</span>
          <span className="text-xs text-on-surface-variant flex-1 min-w-[12rem]">Multi-Factor Authentication is active for this account.</span>
          <span className="text-[10px] font-semibold text-primary uppercase tracking-wider sm:ml-auto">Enabled</span>
        </div>
      </div>

    </div>
  );
}

function ExperienceEditor({ draft, updateDraft, requestConfirm }) {
  const [editingImageIdx, setEditingImageIdx] = useState(null);
  const [tempImageUrl, setTempImageUrl] = useState('');

  const narrativeTitle = draft.experienceContent?.narrativeTitle ?? 'A Tradition of Regal Hospitality';
  const narrativeBody = draft.experienceContent?.panelQuote ?? '';
  const missionStatement = draft.experienceContent?.mission ?? 'To redefine the pinnacle of hospitality through unwavering discretion and artistic execution.';
  
  const defaultImages = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAMTcUNp7jCrgV7ocK2k3RA_nkwQw7bwZECylvdftl4ZVQJvryXNaOlIoEsnLYVVbQtLLPY0LG4dHzOPM91uKcrj5F6CMxenP8SrSM-8xeJ9FbJwl7AJX8Pj98Cp4YKxA3zpl3xM2W-rhZbix468wso7QQeTFfzu-VNTdjLDNYVn9HmorLGZ_Y4BjU2JhrMSy88-x4g80aMF4u5eDIvmTjyOHACppTn7E--N-QB0EDborobf8MTy0ENKJi0yvmnwV6MXJQ4aC5Ov1Gy',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBR7CPp4WcTb2Ri7H2mQWHLSrruQD4PijRCdi2TgnQvWHeidZiKa7haHo8OyDYRTCPXWK-ehhLnojqDhVCmyBCYGQEx2ff2zBynNMZZy_bd_K44Ef9XaicDt6mxE5An_ylRrYWrqzGbPoGJGJbYYsz9oToj_bQgqPovEqGO4dk7DoPsW27YgHLp--AsNbQbNuYtzjX7EVN_xAwaJaWPyWXO7yxGoOAlA8bkosjwQNrvRGn9t8dfWF5XgVNxZYIdT8yr_-d5IU4Tn64R',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBBCe_2Ltl3OKYM6-lZBxpvimZN4LbEUT8Mh5Gb-obqoKJLnmUw06IHrH5qnWXtthsFt2D-wr7Jns4czk7MTPR7h77eutABVPfSP01dasaTCxdRpqEJPrqcs5zTBgnELsob5a50bPJ2AxUBumEFbT1mb0la_k5wG4kY95FiABvr1GPXOG_Gy7NjsUr3S2BYPLTMkGRgwfSSNghPC4J9Lr0SXPx2ll0QeHDnMvng0SESTwxZgUxsBoIHHHNjVr-9_bzI1-g98ZuNtWrt',
  ];
  const brandImages = draft.experienceContent?.brandImages ?? defaultImages;

  const wordCount = narrativeBody.trim().split(/\s+/).filter(Boolean).length;

  const defaultIcons = ['verified', 'visibility_off', 'palette', 'diamond'];

  function openEditImage(idx) {
    setEditingImageIdx(idx);
    setTempImageUrl(brandImages[idx] ?? '');
  }

  function saveImage() {
    updateDraft((next) => {
      next.experienceContent ??= { panelQuote: '', photoUrl: '' };
      next.experienceContent.brandImages ??= [...brandImages];
      next.experienceContent.brandImages[editingImageIdx] = tempImageUrl;
    });
    setEditingImageIdx(null);
  }

  return (
    <div className="space-y-bento-gap text-on-surface">
      {/* BENTO GRID SYSTEM */}
      <div className="grid grid-cols-12 gap-bento-gap">
        {/* HEADER INTRO */}
        <div className="col-span-12 md:col-span-8 bento-card bg-surface-container-low border border-outline-variant p-5 sm:p-6 lg:p-8 flex flex-col justify-between rounded-xl">
          <div>
            <span className="font-label-caps text-label-caps text-primary uppercase block mb-4 text-[11px]">Core Identity</span>
            <h3 className="admin-core-identity-title text-on-background mb-6 font-bold font-display">
              Crafting Legacies of Unparalleled Luxury.
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl text-pretty">
              The About section is the digital soul of Queen&apos;s Banquet. Here, we manage the narrative that transforms service into an experience, and a mission into a standard of excellence.
            </p>
          </div>
        </div>

        {/* QUICK ACTIONS / STATUS */}
        <div className="col-span-12 md:col-span-4 bento-card bg-surface-container-low border border-outline-variant p-5 sm:p-6 lg:p-8 relative overflow-hidden rounded-xl">
          <div className="relative z-10">
            <span className="font-label-caps text-label-caps text-primary uppercase block mb-6 text-[11px]">Status</span>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">Live Status</span>
                <span className="flex items-center gap-2 text-primary font-bold">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span> Published
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">Last Edited</span>
                <span className="text-on-surface">Oct 24, 2023</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">Editor</span>
                <span className="text-on-surface">E. Carrington</span>
              </div>
            </div>
          </div>
        </div>

        {/* BRAND STORY EDITOR */}
        <div className="col-span-12 md:col-span-9 bento-card bg-surface-container-low border border-outline-variant p-5 sm:p-6 lg:p-8 rounded-xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h4 className="font-headline-md text-headline-md text-on-surface font-bold text-xl">Brand Story</h4>
              <p className="text-on-surface-variant text-sm mt-1">The founding narrative and heritage of the banquet services.</p>
            </div>
          </div>
          <div className="space-y-8">
            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-primary uppercase text-[11px] block">Narrative Title</label>
              <input
                className="w-full bg-transparent border-none border-b border-outline-variant focus:border-primary focus:ring-0 py-4 text-on-background font-headline-md text-headline-md text-xl"
                type="text"
                value={narrativeTitle}
                onChange={(e) =>
                  updateDraft((next) => {
                    next.experienceContent ??= { panelQuote: '', photoUrl: '' };
                    next.experienceContent.narrativeTitle = e.target.value;
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-primary uppercase text-[11px] block">Long-form Content</label>
              <textarea
                className="w-full bg-surface-container-highest border-none p-6 text-on-surface-variant focus:ring-1 focus:ring-primary focus:outline-none leading-relaxed text-sm"
                rows="8"
                value={narrativeBody}
                onChange={(e) =>
                  updateDraft((next) => {
                    next.experienceContent ??= { panelQuote: '', photoUrl: '' };
                    next.experienceContent.panelQuote = e.target.value;
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* STATS / KPI */}
        <div className="col-span-12 md:col-span-3 bento-card bg-surface-container-low border border-outline-variant p-5 sm:p-6 lg:p-8 flex flex-col justify-between group rounded-xl">
          <div>
            <span className="material-symbols-outlined text-primary mb-4 text-3xl">history_edu</span>
            <h5 className="font-headline-md text-headline-md text-on-surface text-base">Word Count</h5>
            <p className="text-display-lg text-display-lg text-primary mt-2 text-4xl font-bold">{wordCount}</p>
          </div>
          <div className="mt-8 pt-8 border-t border-outline-variant">
            <p className="text-on-surface-variant text-sm italic">"Precision in prose reflects precision in service."</p>
          </div>
        </div>

        {/* MISSION STATEMENT */}
        <div className="col-span-12 md:col-span-5 bento-card bg-surface-container-low border border-outline-variant p-5 sm:p-6 lg:p-8 rounded-xl flex flex-col justify-between">
          <div>
            <span className="font-label-caps text-label-caps text-primary uppercase block mb-6 text-[11px]">Mission & Values</span>
            <div className="space-y-6">
              <div className="p-6 bg-surface-container-highest border-l-2 border-primary">
                <label className="text-[10px] text-primary uppercase tracking-widest block mb-2 font-semibold">Active Mission</label>
                <p className="text-on-surface italic font-headline-md leading-snug text-sm">"{missionStatement}"</p>
              </div>
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[11px] block">Edit Statement</label>
                <input
                  className="w-full bg-transparent border-none border-b border-outline-variant focus:border-primary focus:ring-0 py-2 text-on-background text-sm"
                  placeholder="Update mission statement..."
                  type="text"
                  value={missionStatement}
                  onChange={(e) =>
                    updateDraft((next) => {
                      next.experienceContent ??= { panelQuote: '', photoUrl: '' };
                      next.experienceContent.mission = e.target.value;
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* BRAND PHOTOGRAPHY */}
        <div className="col-span-12 md:col-span-7 bento-card bg-surface-container-low border border-outline-variant p-0 overflow-hidden flex flex-col rounded-xl">
          <div className="p-8 pb-4 flex justify-between items-center">
            <div>
              <h4 className="font-headline-md text-headline-md text-on-surface font-bold text-xl">Brand Photography</h4>
              <p className="text-on-surface-variant text-sm">Visual assets that define the brand aesthetic.</p>
            </div>
          </div>
          <div className="flex-grow grid grid-cols-3 gap-1 p-1 bg-surface-container-low">
            {brandImages.map((src, idx) => (
              <div
                key={idx}
                className="aspect-square relative group overflow-hidden cursor-pointer bg-surface-container-highest flex items-center justify-center"
                onClick={() => openEditImage(idx)}
              >
                <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="" src={src} />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-2xl">edit</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CORE VALUES GRID */}
        <div className="col-span-12 bento-card bg-surface-container-low border border-outline-variant p-5 sm:p-6 lg:p-8 rounded-xl">
          <div className="admin-section-toolbar mb-8">
            <div className="admin-section-toolbar__copy min-w-0">
              <h4 className="font-headline-md text-headline-md text-on-surface font-bold text-xl">Core Values Portfolio</h4>
              <p className="text-on-surface-variant text-sm mt-1">Configure core values displayed on the landing page.</p>
            </div>
            <button
              className="admin-section-toolbar__action border border-primary text-primary px-4 py-2 font-label-caps text-label-caps text-xs hover:bg-primary hover:text-on-primary transition-all inline-flex items-center justify-center gap-2"
              type="button"
              onClick={() =>
                updateDraft((next) => {
                  next.experiencePoints ??= [];
                  next.experiencePoints.push({
                    title: 'New Value',
                    description: 'Description of the value.',
                    iconName: 'diamond',
                  });
                })
              }
            >
              <span className="material-symbols-outlined text-sm">add</span> Add Value
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-bento-gap">
            {draft.experiencePoints.map((item, index) => {
              const defaultIcon = defaultIcons[index % defaultIcons.length];
              const currentIcon = item.iconName || defaultIcon;

              return (
                <div className="p-6 bg-surface-container-highest border border-outline-variant hover:border-primary transition-colors flex flex-col justify-between" key={index}>
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="material-symbols-outlined text-primary text-2xl">{currentIcon}</span>
                      <button
                        className="text-on-surface-variant hover:text-red-400 p-1 flex items-center"
                        type="button"
                        onClick={() =>
                          requestConfirm({
                            message: `Remove this core value point? This cannot be undone.`,
                            confirmLabel: 'Remove',
                            onConfirm: () =>
                              updateDraft((next) => {
                                next.experiencePoints.splice(index, 1);
                              }),
                          })
                        }
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] text-primary uppercase block font-semibold">Title</label>
                      <input
                        className="w-full bg-transparent border-none border-b border-outline-variant focus:border-primary focus:ring-0 py-1 text-on-surface font-semibold text-xs"
                        type="text"
                        value={item.title}
                        onChange={(e) =>
                          updateDraft((next) => {
                            next.experiencePoints[index].title = e.target.value;
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] text-primary uppercase block font-semibold">Icon Name</label>
                      <input
                        className="w-full bg-transparent border-none border-b border-outline-variant focus:border-primary focus:ring-0 py-1 text-on-surface text-xs font-mono"
                        type="text"
                        value={currentIcon}
                        onChange={(e) =>
                          updateDraft((next) => {
                            next.experiencePoints[index].iconName = e.target.value;
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] text-primary uppercase block font-semibold">Description</label>
                      <textarea
                        className="w-full bg-transparent border-none border-b border-outline-variant focus:border-primary focus:ring-0 py-1 text-on-surface-variant text-xs leading-relaxed"
                        rows="2"
                        value={item.description}
                        onChange={(e) =>
                          updateDraft((next) => {
                            next.experiencePoints[index].description = e.target.value;
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* INLINE IMAGE EDIT MODAL */}
      {editingImageIdx !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-surface-container border border-outline-variant p-5 sm:p-6 lg:p-8 max-w-lg w-full rounded-xl">
            <h4 className="font-headline-md text-headline-md text-on-surface text-lg font-bold mb-2">Edit Image URL</h4>
            <p className="text-on-surface-variant text-xs mb-6">Enter a public image URL to update this brand photography slot.</p>
            <input
              className="w-full bg-surface-container-highest border border-outline-variant p-3 text-on-surface rounded-lg mb-6 text-xs focus:ring-1 focus:ring-primary focus:outline-none font-mono"
              type="text"
              value={tempImageUrl}
              onChange={(e) => setTempImageUrl(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button
                className="border border-outline-variant text-on-surface px-6 py-2 font-label-caps text-label-caps text-xs hover:border-primary transition-all"
                onClick={() => setEditingImageIdx(null)}
              >
                Cancel
              </button>
              <button
                className="bg-primary text-on-primary px-6 py-2 font-label-caps text-label-caps text-xs hover:brightness-110 transition-all"
                onClick={saveImage}
              >
                Apply URL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ContactEditor({ draft, updateDraft, requestConfirm }) {
  const eyebrowVal = draft.contactContent?.eyebrow ?? 'Schedule a date';
  const titleVal = draft.contactContent?.title ?? 'Book a coordination meeting with Marou.';
  const descVal = draft.contactContent?.description ?? '';
  const successVal = draft.contactContent?.successMessage ?? "Thank you. Your meeting request is ready for Queen's Banquet Events.";

  return (
    <div className="space-y-bento-gap text-on-surface">
      {/* 12-COLUMN SPLIT BENTO GRID */}
      <div className="grid grid-cols-12 gap-bento-gap">
        {/* LEFT PANEL: BOOKING FORM COPY */}
        <div className="col-span-12 lg:col-span-7 bento-card bg-surface-container-low border border-outline-variant p-5 sm:p-6 lg:p-8 rounded-xl flex flex-col justify-between">
          <div>
            <div className="mb-8">
              <span className="font-label-caps text-label-caps text-primary uppercase block mb-4 text-[11px]">Booking Form Configuration</span>
              <h3 className="font-headline-md text-headline-md text-on-surface font-bold text-xl">Landing Page Form Details</h3>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] text-primary uppercase block font-semibold">Booking Eyebrow</label>
                <input
                  className="w-full bg-transparent border-none border-b border-outline-variant focus:border-primary focus:ring-0 py-2 text-on-background text-sm"
                  type="text"
                  value={eyebrowVal}
                  onChange={(e) =>
                    updateDraft((next) => {
                      next.contactContent ??= {};
                      next.contactContent.eyebrow = e.target.value;
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-primary uppercase block font-semibold">Booking Title</label>
                <textarea
                  className="admin-field-text w-full bg-transparent border-none border-b border-outline-variant focus:border-primary focus:ring-0 py-2 text-on-background text-sm font-semibold resize-y min-h-[2.75rem]"
                  rows="2"
                  value={titleVal}
                  onChange={(e) =>
                    updateDraft((next) => {
                      next.contactContent ??= {};
                      next.contactContent.title = e.target.value;
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-primary uppercase block font-semibold">Booking Description</label>
                <textarea
                  className="admin-field-text w-full bg-transparent border-none border-b border-outline-variant focus:border-primary focus:ring-0 py-2 text-on-surface-variant text-xs leading-relaxed"
                  rows="4"
                  value={descVal}
                  onChange={(e) =>
                    updateDraft((next) => {
                      next.contactContent ??= {};
                      next.contactContent.description = e.target.value;
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-primary uppercase block font-semibold">Success Confirmation Message</label>
                <textarea
                  className="admin-field-text w-full bg-transparent border-none border-b border-outline-variant focus:border-primary focus:ring-0 py-2 text-on-background text-xs resize-y min-h-[2.5rem]"
                  rows="2"
                  value={successVal}
                  onChange={(e) =>
                    updateDraft((next) => {
                      next.contactContent ??= {};
                      next.contactContent.successMessage = e.target.value;
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: CONTACT CHANNELS SIDEPANEL */}
        <div className="col-span-12 lg:col-span-5 bento-card bg-surface-container-low border border-outline-variant p-5 sm:p-6 lg:p-8 rounded-xl flex flex-col justify-between h-auto">
          <div>
            <div className="admin-section-toolbar mb-8">
              <div className="admin-section-toolbar__copy min-w-0">
                <span className="font-label-caps text-label-caps text-primary uppercase block mb-2 sm:mb-4 text-[11px]">Concierge Channels</span>
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold text-xl">Direct Communications</h3>
              </div>
              <button
                className="admin-section-toolbar__action border border-primary text-primary px-3 py-2 font-label-caps text-label-caps text-[10px] hover:bg-primary hover:text-on-primary transition-all inline-flex items-center justify-center gap-1"
                type="button"
                onClick={() =>
                  updateDraft((next) => {
                    next.contactChannels ??= [];
                    next.contactChannels.push({ label: 'New Line', value: '', href: '' });
                  })
                }
              >
                <span className="material-symbols-outlined text-[12px]">add</span> Add Line
              </button>
            </div>

            <div className="space-y-6 max-h-[480px] overflow-y-auto pr-2">
              {draft.contactChannels.map((channel, index) => (
                <div key={index} className="p-4 bg-surface-container border border-outline-variant relative rounded-lg space-y-4 group">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-primary uppercase font-bold tracking-wider">Channel #{index + 1}</span>
                    <button
                      className="text-on-surface-variant hover:text-red-400 p-0.5 flex items-center"
                      type="button"
                      onClick={() =>
                        requestConfirm({
                          message: `Remove the "${channel.label || 'contact'}" channel? This cannot be undone.`,
                          confirmLabel: 'Remove',
                          onConfirm: () =>
                            updateDraft((next) => {
                              next.contactChannels.splice(index, 1);
                            }),
                        })
                      }
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                    <div className="space-y-1 min-w-0">
                      <label className="text-[9px] text-primary uppercase block font-semibold">Label</label>
                      <input
                        className="admin-field-text w-full bg-transparent border-none border-b border-outline-variant focus:border-primary focus:ring-0 py-0.5 text-on-surface font-semibold text-xs text-[16px] sm:text-xs"
                        type="text"
                        value={channel.label}
                        onChange={(e) =>
                          updateDraft((next) => {
                            next.contactChannels[index].label = e.target.value;
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <label className="text-[9px] text-primary uppercase block font-semibold">Display Value</label>
                      <input
                        className="admin-field-text w-full bg-transparent border-none border-b border-outline-variant focus:border-primary focus:ring-0 py-0.5 text-on-surface text-xs text-[16px] sm:text-xs"
                        type="text"
                        value={channel.value}
                        onChange={(e) =>
                          updateDraft((next) => {
                            next.contactChannels[index].value = e.target.value;
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] text-primary uppercase block font-semibold">Action Link (tel:, mailto:, URL)</label>
                    <input
                      className="w-full bg-transparent border-none border-b border-outline-variant focus:border-primary focus:ring-0 py-0.5 text-on-surface-variant text-xs font-mono"
                      type="text"
                      value={channel.href ?? ''}
                      onChange={(e) =>
                        updateDraft((next) => {
                          next.contactChannels[index].href = e.target.value;
                        })
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ServicesEditor({ draft, updateDraft, requestConfirm }) {
  const [editingImageIdx, setEditingImageIdx] = useState(null);
  const [tempImageUrl, setTempImageUrl] = useState('');

  const heroTitle = draft.servicesContent?.heroTitle ?? 'Elite Craftsmanship. Absolute Privacy.';
  const heroCopy = draft.servicesContent?.heroCopy ?? "Our services are designed for the world's most discerning patrons. Each selection represents a fusion of logistical perfection and aesthetic grace, managed by your dedicated banquet concierge.";

  function openEditImage(idx, currentUrl) {
    setEditingImageIdx(idx);
    setTempImageUrl(currentUrl || '');
  }

  function saveImage() {
    updateDraft((next) => {
      next.services[editingImageIdx].image = tempImageUrl;
    });
    setEditingImageIdx(null);
  }

  return (
    <div className="space-y-bento-gap text-on-surface">
      {/* HERO INTRO EDIT BENTO */}
      <div className="grid grid-cols-12 gap-bento-gap">
        <div className="col-span-12 bento-card bg-surface-container-low border border-outline-variant p-5 sm:p-6 lg:p-8 rounded-xl space-y-6">
          <div>
            <span className="font-label-caps text-label-caps text-primary uppercase block mb-4 text-[11px]">Services Catalog Header</span>
            <h3 className="font-headline-md text-headline-md text-on-surface text-lg font-bold">Catalog Hero Intro</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-bento-gap">
            <div className="space-y-2 min-w-0">
              <label className="text-[10px] text-primary uppercase block font-semibold">Hero Title</label>
              <textarea
                className="admin-field-text w-full bg-transparent border-none border-b border-outline-variant focus:border-primary focus:ring-0 py-2 text-on-background font-headline-md text-[clamp(1.05rem,3.5vw,1.25rem)] font-semibold resize-y min-h-[2.75rem]"
                rows="2"
                value={heroTitle}
                onChange={(e) =>
                  updateDraft((next) => {
                    next.servicesContent ??= {};
                    next.servicesContent.heroTitle = e.target.value;
                  })
                }
              />
            </div>
            <div className="space-y-2 min-w-0">
              <label className="text-[10px] text-primary uppercase block font-semibold">Hero Copy Description</label>
              <textarea
                className="admin-field-text w-full bg-transparent border-none border-b border-outline-variant focus:border-primary focus:ring-0 py-2 text-on-surface-variant text-sm leading-relaxed"
                rows="3"
                value={heroCopy}
                onChange={(e) =>
                  updateDraft((next) => {
                    next.servicesContent ??= {};
                    next.servicesContent.heroCopy = e.target.value;
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* SERVICES DYNAMIC BENTO GRID */}
      <div className="admin-section-toolbar mb-4 mt-8">
        <div className="admin-section-toolbar__copy min-w-0">
          <h4 className="font-headline-md text-headline-md text-on-surface font-bold text-xl">Catalog Items</h4>
          <p className="text-on-surface-variant text-sm mt-1">Configure individual service detail blocks, images, and prices.</p>
        </div>
        <button
          className="admin-section-toolbar__action border border-primary text-primary px-4 py-2 font-label-caps text-label-caps text-xs hover:bg-primary hover:text-on-primary transition-all inline-flex items-center justify-center gap-2"
          type="button"
          onClick={() =>
            updateDraft((next) => {
              next.services ??= [];
              next.services.push({
                title: 'New Service',
                description: 'Describe this service details.',
                price: '$1,000',
                eyebrow: 'SERVICE CATEGORY',
                iconName: 'concierge',
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDprGtCMWxcp49dTgCOSZkLB7GcGLTKs3w7YrgXucy8g2ilZZ8T-xo8itgObyBGhgP7QNDJ825QRDKgFSrkKC04YxD6dlDjrIIdIZZndPmhH2gghee_dfo8OQGB16CP5wSQBirgaVEPxAJblI1ion5bgmoPXoIQJ-BxAhN450iagZy-KAWj625ZefB4tokWehU_QbiSCfHKGZ9rDWQb_KN8cDhU_D8H-VAQcfwKn0rheniQ81kNQKq3kA5IGWVKV1Qon-ppxAq7Eivn',
                colSpan: 'col-span-6',
              });
            })
          }
        >
          <span className="material-symbols-outlined text-sm">add</span> Add Service Card
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-bento-gap">
        {draft.services.map((item, index) => {
          const colSpan = item.colSpan || 'col-span-6';
          const eyebrowVal = item.eyebrow || 'SERVICE DETAIL';
          const priceVal = item.price || '$1,500';
          const iconVal = item.iconName || 'concierge';
          const imageVal = item.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDprGtCMWxcp49dTgCOSZkLB7GcGLTKs3w7YrgXucy8g2ilZZ8T-xo8itgObyBGhgP7QNDJ825QRDKgFSrkKC04YxD6dlDjrIIdIZZndPmhH2gghee_dfo8OQGB16CP5wSQBirgaVEPxAJblI1ion5bgmoPXoIQJ-BxAhN450iagZy-KAWj625ZefB4tokWehU_QbiSCfHKGZ9rDWQb_KN8cDhU_D8H-VAQcfwKn0rheniQ81kNQKq3kA5IGWVKV1Qon-ppxAq7Eivn';

          return (
            <div
              key={index}
              className={`admin-service-card ${colSpan} bg-surface-container-low border border-outline-variant p-4 sm:p-6 rounded-xl relative bento-card-glow transition-all duration-300 flex flex-col justify-between min-w-0`}
            >
              {/* IMAGE SLOT WITH EDIT OVERLAY IF NOT SPAN 3 */}
              {colSpan !== 'col-span-3' && (
                <div className="mb-4 overflow-hidden h-40 bg-surface-container relative group rounded-lg">
                  <img className="w-full h-full object-cover grayscale transition-all duration-500" alt="" src={imageVal} />
                  <div
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                    onClick={() => openEditImage(index, imageVal)}
                  >
                    <span className="material-symbols-outlined text-white text-2xl">edit_square</span>
                  </div>
                </div>
              )}

              {/* CARD DETAILS FORM */}
              <div className="space-y-4">
                <div className="flex justify-between items-center gap-2">
                  <div className="flex-1">
                    <label className="text-[9px] text-primary uppercase block font-semibold">Eyebrow</label>
                    <input
                      className="w-full bg-transparent border-none border-b border-outline-variant focus:border-primary focus:ring-0 py-0.5 text-primary font-bold text-xs uppercase"
                      type="text"
                      value={eyebrowVal}
                      onChange={(e) =>
                        updateDraft((next) => {
                          next.services[index].eyebrow = e.target.value;
                        })
                      }
                    />
                  </div>
                  <div className="w-12">
                    <label className="text-[9px] text-primary uppercase block font-semibold">Icon</label>
                    <input
                      className="w-full bg-transparent border-none border-b border-outline-variant focus:border-primary focus:ring-0 py-0.5 text-on-surface text-xs font-mono"
                      type="text"
                      value={iconVal}
                      onChange={(e) =>
                        updateDraft((next) => {
                          next.services[index].iconName = e.target.value;
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] text-primary uppercase block font-semibold">Service Title</label>
                    <input
                      className="w-full bg-transparent border-none border-b border-outline-variant focus:border-primary focus:ring-0 py-0.5 text-on-surface font-semibold text-sm"
                      type="text"
                      value={item.title}
                      onChange={(e) =>
                        updateDraft((next) => {
                          next.services[index].title = e.target.value;
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-primary uppercase block font-semibold">Bento Width</label>
                    <select
                      className="w-full bg-surface-container-highest border-none focus:ring-1 focus:ring-primary focus:outline-none py-0.5 text-on-surface text-xs rounded"
                      value={colSpan}
                      onChange={(e) =>
                        updateDraft((next) => {
                          next.services[index].colSpan = e.target.value;
                        })
                      }
                    >
                      <option value="col-span-3">Span 3 (Small Square)</option>
                      <option value="col-span-4">Span 4 (Standard Vertical)</option>
                      <option value="col-span-6">Span 6 (Medium)</option>
                      <option value="col-span-8">Span 8 (Large Featured)</option>
                      <option value="col-span-12">Span 12 (Full Width)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] text-primary uppercase block font-semibold">Description</label>
                  <textarea
                    className="w-full bg-transparent border-none border-b border-outline-variant focus:border-primary focus:ring-0 py-0.5 text-on-surface-variant text-xs leading-relaxed"
                    rows="2"
                    value={item.description}
                    onChange={(e) =>
                      updateDraft((next) => {
                        next.services[index].description = e.target.value;
                      })
                    }
                  />
                </div>
              </div>

              {/* CARD FOOTER INFO */}
              <div className="mt-4 pt-4 border-t border-outline-variant/30 flex justify-between items-center">
                <div className="flex-1">
                  <label className="text-[9px] text-primary uppercase block font-semibold">Pricing Tag</label>
                  <input
                    className="w-full bg-transparent border-none border-b border-outline-variant focus:border-primary focus:ring-0 py-0.5 text-primary text-sm font-semibold"
                    type="text"
                    value={priceVal}
                    onChange={(e) =>
                      updateDraft((next) => {
                        next.services[index].price = e.target.value;
                      })
                    }
                  />
                </div>
                <button
                  className="text-on-surface-variant hover:text-red-400 p-1 flex items-center self-end"
                  type="button"
                  onClick={() =>
                    requestConfirm({
                      message: `Remove "${item.title || 'service'}" card? This cannot be undone.`,
                      confirmLabel: 'Remove',
                      onConfirm: () =>
                        updateDraft((next) => {
                          next.services.splice(index, 1);
                        }),
                    })
                  }
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* INLINE IMAGE EDIT MODAL */}
      {editingImageIdx !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-surface-container border border-outline-variant p-5 sm:p-6 lg:p-8 max-w-lg w-full rounded-xl">
            <h4 className="font-headline-md text-headline-md text-on-surface text-lg font-bold mb-2">Edit Image URL</h4>
            <p className="text-on-surface-variant text-xs mb-6">Enter a public image URL to update this service catalog card.</p>
            <input
              className="w-full bg-surface-container-highest border border-outline-variant p-3 text-on-surface rounded-lg mb-6 text-xs focus:ring-1 focus:ring-primary focus:outline-none font-mono"
              type="text"
              value={tempImageUrl}
              onChange={(e) => setTempImageUrl(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button
                className="border border-outline-variant text-on-surface px-6 py-2 font-label-caps text-label-caps text-xs hover:border-primary transition-all"
                onClick={() => setEditingImageIdx(null)}
              >
                Cancel
              </button>
              <button
                className="bg-primary text-on-primary px-6 py-2 font-label-caps text-label-caps text-xs hover:brightness-110 transition-all"
                onClick={saveImage}
              >
                Apply URL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PackagesEditor({ draft, updateDraft, requestConfirm }) {
  const defaultTiers = ['Tier I', 'Tier II', 'Tier III', 'Tier IV', 'Tier V'];

  return (
    <div className="space-y-bento-gap text-on-surface">
      {/* HEADER BAR */}
      <div className="admin-section-toolbar mb-8">
        <div className="admin-section-toolbar__copy min-w-0">
          <span className="text-primary font-label-caps text-label-caps uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-2 sm:mb-4 block text-[11px]">Event Tiers</span>
          <h2 className="font-headline-md text-[clamp(1.4rem,5vw,1.875rem)] leading-tight text-on-surface font-bold text-balance">
            Tiered Luxury Experiences
          </h2>
        </div>
        <button
          className="admin-section-toolbar__action bg-primary text-on-primary px-5 sm:px-8 py-3 font-label-caps text-label-caps inline-flex items-center justify-center gap-2 hover:bg-primary-container transition-all text-xs"
          type="button"
          onClick={() =>
            updateDraft((next) => {
              next.packages ??= [];
              next.packages.push({
                name: 'New Package',
                price: '$10,000',
                features: [{ text: 'Bespoke coordination service', included: true }],
                featured: false,
              });
            })
          }
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          CREATE NEW TIER
        </button>
      </div>

      {/* BENTO GRID LAYOUT FOR PACKAGES */}
      <div className="grid grid-cols-12 gap-bento-gap">
        {draft.packages.map((item, index) => {
          const isFeatured = item.featured === true;
          const tierLabel = defaultTiers[index % defaultTiers.length];

          return (
            <div
              key={index}
              className={`col-span-12 lg:col-span-4 bg-surface-container border ${
                isFeatured ? 'border-primary shadow-[0_0_30px_rgba(212,175,55,0.05)]' : 'border-outline-variant'
              } p-5 sm:p-6 lg:p-8 group hover:border-primary transition-all duration-300 flex flex-col relative rounded-xl`}
            >
              {isFeatured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-6 py-1 font-label-caps text-[10px] tracking-[0.2em] uppercase rounded-full">
                  Most Distinguished
                </div>
              )}

              <div className="mb-8 flex justify-between items-start gap-3 min-w-0">
                <div className="min-w-0 flex-1">
                  <p className="text-primary font-label-caps text-label-caps uppercase tracking-widest mb-2 text-[10px]">{tierLabel}</p>
                  <div className="flex gap-2 items-center min-w-0">
                    <input
                      className="admin-field-text bg-transparent border-none border-b border-outline-variant focus:border-primary focus:ring-0 py-0.5 text-on-surface font-headline-md text-[clamp(1.15rem,4vw,1.5rem)] font-bold w-full min-w-0"
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        updateDraft((next) => {
                          next.packages[index].name = e.target.value;
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    className={`p-1 flex items-center rounded ${isFeatured ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}
                    type="button"
                    title="Toggle featured status"
                    onClick={() =>
                      updateDraft((next) => {
                        next.packages[index].featured = !next.packages[index].featured;
                      })
                    }
                  >
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  </button>
                  <button
                    className="text-on-surface-variant hover:text-red-400 p-1 flex items-center"
                    type="button"
                    onClick={() =>
                      requestConfirm({
                        message: `Remove the "${item.name || 'package'}" package tier? This cannot be undone.`,
                        confirmLabel: 'Remove',
                        onConfirm: () =>
                          updateDraft((next) => {
                            next.packages.splice(index, 1);
                          }),
                      })
                    }
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>

              {/* FEATURES EDIT LIST */}
              <div className="space-y-4 flex-1">
                <span className="text-[10px] text-primary font-label-caps uppercase tracking-widest block font-semibold">Included Features</span>
                <div className="space-y-3">
                  {(item.features ?? []).map((feature, fIdx) => {
                    const featureText = typeof feature === 'string' ? feature : feature.text;
                    const isIncluded = typeof feature === 'string' ? true : feature.included !== false;

                    return (
                      <div className="admin-package-feature flex items-start gap-2 min-w-0" key={fIdx}>
                        <button
                          type="button"
                          className="flex items-center shrink-0 mt-0.5"
                          onClick={() =>
                            updateDraft((next) => {
                              const feat = next.packages[index].features[fIdx];
                              if (typeof feat === 'string') {
                                next.packages[index].features[fIdx] = { text: feat, included: false };
                              } else {
                                feat.included = !feat.included;
                              }
                            })
                          }
                        >
                          <span className={`material-symbols-outlined text-[18px] ${isIncluded ? 'text-primary' : 'text-on-surface-variant/40'}`}>
                            {isIncluded ? 'check_circle' : 'cancel'}
                          </span>
                        </button>
                        <input
                          className="admin-field-text min-w-0 flex-1 bg-transparent border-none border-b border-transparent hover:border-outline-variant focus:border-primary focus:ring-0 py-0.5 text-xs text-on-surface-variant"
                          type="text"
                          value={featureText}
                          onChange={(e) =>
                            updateDraft((next) => {
                              const feat = next.packages[index].features[fIdx];
                              if (typeof feat === 'string') {
                                next.packages[index].features[fIdx] = { text: e.target.value, included: true };
                              } else {
                                feat.text = e.target.value;
                              }
                            })
                          }
                        />
                        <button
                          className="admin-package-feature__remove text-on-surface-variant hover:text-red-400 p-0.5 flex items-center shrink-0"
                          type="button"
                          onClick={() =>
                            updateDraft((next) => {
                              next.packages[index].features.splice(fIdx, 1);
                            })
                          }
                        >
                          <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
                <button
                  className="text-xs text-primary hover:text-primary-container flex items-center gap-1 mt-2 font-semibold"
                  type="button"
                  onClick={() =>
                    updateDraft((next) => {
                      next.packages[index].features ??= [];
                      next.packages[index].features.push({ text: 'New feature amenity', included: true });
                    })
                  }
                >
                  <span className="material-symbols-outlined text-xs">add</span> Add Amenity
                </button>
              </div>

              {/* FOOTER INVESTMENT */}
              <div className="mt-8 pt-6 border-t border-outline-variant">
                <div className="flex justify-between items-baseline mb-4">
                  <span className="text-on-surface-variant font-label-caps text-label-caps uppercase text-[10px]">Investment</span>
                  <div className="flex items-center gap-1 justify-end w-3/4">
                    <input
                      className="bg-transparent border-none border-b border-outline-variant focus:border-primary focus:ring-0 py-0.5 text-right font-headline-md text-xl text-primary font-bold w-full"
                      type="text"
                      value={item.price}
                      onChange={(e) =>
                        updateDraft((next) => {
                          next.packages[index].price = e.target.value;
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ANALYTICS & CUSTOMIZATION BENTOS */}
      <div className="grid grid-cols-12 gap-bento-gap mt-8">
        <div className="col-span-12 lg:col-span-8 bg-surface-container border border-outline-variant p-5 sm:p-6 lg:p-8 flex flex-col md:flex-row gap-8 items-center rounded-xl">
          <div className="md:w-1/3">
            <div className="w-full aspect-square border border-outline-variant p-1">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBRsgl5vwuerPoJHsWbHYMERGKGQPno1XZCzJ0A4H8o9WCSs6GboRUXejOGQYMiHwFHh89_poQ_frJkHO2HvEi6FY0AjrR1qtj2ZnSijsD-JvrU5gGpwBCVM_XysifeJ9o-VXZXhDXiZVXQvnPo6FVQcWi0Po-tlJlSpQ5NbpmNgRtE7ZBgHgfaPOri3A8_KFCL8cNXLOsF8Sg7mLN30AdZpKx0J8QjiFyQG8ZJuZWZqW_9SNxGAuJyyHLlNC39daRy7BZ2RNbzGRHx')",
                }}
              ></div>
            </div>
          </div>
          <div className="md:w-2/3">
            <h4 className="font-headline-md text-2xl mb-4 font-bold text-on-surface">Tier Performance Analytics</h4>
            <p className="text-body-md text-on-surface-variant mb-6 text-sm">
              The Heirloom package remains your most selected offering, accounting for 62% of revenue this quarter. Consider seasonal adjustments to the Royal Signature menu to increase boutique conversions.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
              <div>
                <p className="font-label-caps text-[10px] text-primary uppercase">Revenue</p>
                <p className="font-headline-md text-xl font-bold text-on-surface">$1.2M</p>
              </div>
              <div>
                <p className="font-label-caps text-[10px] text-primary uppercase">Active Events</p>
                <p className="font-headline-md text-xl font-bold text-on-surface">14</p>
              </div>
              <div>
                <p className="font-label-caps text-[10px] text-primary uppercase">Margin</p>
                <p className="font-headline-md text-xl font-bold text-on-surface">42%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-surface-container-highest p-8 flex flex-col justify-center border border-outline-variant rounded-xl">
          <h4 className="font-headline-md text-xl mb-6 font-bold text-on-surface">Tier Customization</h4>
          <ul className="space-y-4">
            <li>
              <button className="w-full flex items-center justify-between group text-left" type="button">
                <span className="text-body-md text-on-surface text-sm">Modify Global Add-ons</span>
                <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">chevron_right</span>
              </button>
            </li>
            <li>
              <button className="w-full flex items-center justify-between group text-left" type="button">
                <span className="text-body-md text-on-surface text-sm">Update Seasonal Pricing</span>
                <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">chevron_right</span>
              </button>
            </li>
            <li>
              <button className="w-full flex items-center justify-between group text-left" type="button">
                <span className="text-body-md text-on-surface text-sm">Manage Vendor Tiers</span>
                <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">chevron_right</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function TestimonialsEditor({ draft, updateDraft, requestConfirm }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  
  // Modal states for adding/editing a testimonial
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null); // null means creating new
  const [formData, setFormData] = useState({
    author: '',
    quote: '',
    event: '',
    rating: 5,
    photoUrl: '',
    featured: false,
  });

  const list = draft.testimonials || [];
  
  // Filter list
  const filtered = list.filter((t) => {
    // Search
    const matchesSearch =
      (t.author || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.quote || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.event || '').toLowerCase().includes(searchQuery.toLowerCase());
      
    // Tab
    if (activeTab === 'PUBLISHED') return matchesSearch && t.featured === true;
    if (activeTab === 'ARCHIVED') return matchesSearch && t.featured === false;
    return matchesSearch;
  });

  function openEdit(index) {
    const t = list[index];
    setEditIndex(index);
    setFormData({
      author: t.author || '',
      quote: t.quote || '',
      event: t.event || '',
      rating: t.rating ?? 5,
      photoUrl: t.photoUrl || '',
      featured: t.featured === true,
    });
    setIsEditing(true);
  }

  function openCreate() {
    setEditIndex(null);
    setFormData({
      author: '',
      quote: '',
      event: '',
      rating: 5,
      photoUrl: '',
      featured: false,
    });
    setIsEditing(true);
  }

  function saveTestimonial() {
    updateDraft((next) => {
      next.testimonials ??= [];
      if (editIndex === null) {
        next.testimonials.push({ ...formData });
      } else {
        next.testimonials[editIndex] = { ...formData };
      }
    });
    setIsEditing(false);
  }

  // Count statistics
  const totalReach = 4.9;
  const featuredCount = list.filter((t) => t.featured).length;
  const pendingCount = 3;

  return (
    <div className="space-y-bento-gap text-on-surface">
      {/* TOP HEADER BAR */}
      <div className="admin-section-toolbar admin-section-toolbar--search mb-8">
        <div className="admin-section-toolbar__search relative min-w-0 flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-sm pointer-events-none">search</span>
          <input
            className="w-full max-w-full bg-surface-container-low border-none text-on-surface placeholder:text-outline-variant font-body-sm text-body-sm pl-10 pr-4 py-2.5 focus:ring-1 focus:ring-primary focus:outline-none rounded-lg text-[16px]"
            placeholder="Search reviews..."
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          className="admin-section-toolbar__action bg-primary text-on-primary px-4 sm:px-6 py-2.5 font-label-caps text-label-caps text-xs hover:brightness-110 transition-all inline-flex items-center justify-center gap-2 shrink-0"
          onClick={openCreate}
          type="button"
          aria-label="Add new testimonial"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          <span className="admin-testimonial-add-label">NEW TESTIMONIAL</span>
        </button>
      </div>

      {/* STATISTICS BENTO HEADER */}
      <div className="grid grid-cols-12 gap-bento-gap mb-8">
        <div className="col-span-12 lg:col-span-4 bento-card bg-surface-container-low border border-outline-variant p-6 flex flex-col justify-between h-40 rounded-xl">
          <span className="font-label-caps text-label-caps text-primary uppercase text-[11px]">Total Reach</span>
          <div className="flex items-end justify-between">
            <span className="font-display-lg text-display-lg text-on-surface text-4xl font-bold">{totalReach}</span>
            <div className="flex space-x-0.5 mb-2">
              {[1, 2, 3, 4].map((star) => (
                <span key={star} className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              ))}
              <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>
            </div>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">Based on 142 client responses</p>
        </div>

        <div className="col-span-12 lg:col-span-4 bento-card bg-surface-container-low border border-outline-variant p-6 flex flex-col justify-between h-40 rounded-xl">
          <span className="font-label-caps text-label-caps text-primary uppercase text-[11px]">Featured Live</span>
          <span className="font-display-lg text-display-lg text-on-surface text-4xl font-bold">{featuredCount}</span>
          <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">Displayed on website hero gallery</p>
        </div>

        <div className="col-span-12 lg:col-span-4 bento-card bg-surface-container-low border border-outline-variant p-6 flex flex-col justify-between h-40 overflow-hidden relative rounded-xl">
          <div className="z-10 relative h-full flex flex-col justify-between">
            <span className="font-label-caps text-label-caps text-primary uppercase text-[11px]">Pending Review</span>
            <span className="font-display-lg text-display-lg text-on-surface text-4xl font-bold">{pendingCount}</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">Submissions requiring approval</p>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10">
            <span className="material-symbols-outlined text-8xl">verified</span>
          </div>
        </div>
      </div>

      {/* SOPHISTICATED LIST LAYOUT */}
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-6 px-4">
          <h3 className="font-headline-md text-headline-md text-on-surface font-bold text-lg">Recent Feedback</h3>
          <div className="flex space-x-4">
            {['ALL', 'PUBLISHED', 'ARCHIVED'].map((tab) => (
              <button
                key={tab}
                className={`font-label-caps text-label-caps text-[11px] pb-1 border-b ${
                  activeTab === tab ? 'text-primary border-primary' : 'text-on-surface-variant border-transparent hover:text-on-surface'
                } transition-colors`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {filtered.map((item, idx) => {
          const mainIndex = list.findIndex((x) => x.author === item.author && x.quote === item.quote);
          const isFeatured = item.featured === true;
          const initials = (item.author || 'Client')
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((n) => n[0]?.toUpperCase() ?? '')
            .join('');

          return (
            <div
              key={idx}
              className="bento-card bg-surface-container-low border border-outline-variant p-6 flex flex-col md:flex-row items-start md:items-center gap-6 relative rounded-xl hover:border-primary transition-all duration-300"
            >
              <div className="w-16 h-16 flex-shrink-0 bg-surface-container-highest overflow-hidden border border-outline-variant rounded-lg flex items-center justify-center">
                {item.photoUrl ? (
                  <img className="w-full h-full object-cover transition-all duration-500" alt={item.author || 'Client'} src={item.photoUrl} />
                ) : (
                  <span className="font-display-lg text-primary text-xl font-bold">{initials}</span>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h4 className="font-title-sm text-title-sm text-on-surface uppercase tracking-wider text-sm font-semibold">{item.author || 'Clarissa Van Der Berg'}</h4>
                  <div className="flex text-primary">
                    {Array.from({ length: 5 }).map((_, sIdx) => {
                      const currentRating = item.rating ?? 5;
                      const fill = sIdx < currentRating;
                      return (
                        <span
                          key={sIdx}
                          className="material-symbols-outlined text-sm"
                          style={{ fontVariationSettings: fill ? "'FILL' 1" : "'FILL' 0" }}
                        >
                          star
                        </span>
                      );
                    })}
                  </div>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant italic text-sm">
                  "{item.quote}"
                </p>
                <p className="text-[10px] text-outline font-label-caps mt-2 uppercase tracking-tighter">
                  Event: {item.event || 'Winter Solstice Gala'}
                </p>
              </div>

              <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                <div className="flex items-center gap-3">
                  <span className="font-label-caps text-[10px] text-outline uppercase tracking-widest">Featured</span>
                  <button
                    className={`w-11 h-5 bg-outline-variant relative cursor-pointer transition-colors duration-300 rounded-full ${
                      isFeatured ? 'bg-primary' : 'bg-surface-variant'
                    }`}
                    onClick={() =>
                      updateDraft((next) => {
                        const targetIdx = mainIndex >= 0 ? mainIndex : idx;
                        next.testimonials[targetIdx].featured = !next.testimonials[targetIdx].featured;
                      })
                    }
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                        isFeatured ? 'translate-x-6' : ''
                      }`}
                    ></span>
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    className="p-2 border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-all rounded-lg"
                    onClick={() => openEdit(mainIndex >= 0 ? mainIndex : idx)}
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                  </button>
                  <button
                    className="p-2 border border-outline-variant text-on-surface-variant hover:border-red-400 hover:text-red-400 transition-all rounded-lg"
                    onClick={() =>
                      requestConfirm({
                        message: `Remove the testimonial from "${item.author || 'this client'}"? This cannot be undone.`,
                        confirmLabel: 'Remove',
                        onConfirm: () =>
                          updateDraft((next) => {
                            next.testimonials.splice(mainIndex >= 0 ? mainIndex : idx, 1);
                          }),
                      })
                    }
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* EDIT MODAL DIALOG */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-surface-container border border-outline-variant p-5 sm:p-6 lg:p-8 max-w-lg w-full rounded-xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div>
              <h4 className="font-headline-md text-headline-md text-on-surface text-lg font-bold">
                {editIndex === null ? 'Create Testimonial' : 'Edit Testimonial'}
              </h4>
              <p className="text-on-surface-variant text-xs mt-1">Configure client details, quotes, ratings, and photos.</p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-primary uppercase block font-semibold">Client Name</label>
                  <input
                    className="w-full bg-surface-container-highest border border-outline-variant p-2.5 text-on-surface rounded-lg text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-primary uppercase block font-semibold">Event Name & Date</label>
                  <input
                    className="w-full bg-surface-container-highest border border-outline-variant p-2.5 text-on-surface rounded-lg text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                    type="text"
                    value={formData.event}
                    onChange={(e) => setFormData({ ...formData, event: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-primary uppercase block font-semibold">Star Rating (1-5)</label>
                <select
                  className="w-full bg-surface-container-highest border border-outline-variant p-2.5 text-on-surface rounded-lg text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                >
                  <option value={1}>1 Star</option>
                  <option value={2}>2 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={5}>5 Stars</option>
                </select>
              </div>

              <div className="space-y-2 rounded-lg border border-outline-variant bg-surface-container-low p-3">
                <label className="text-[10px] text-primary uppercase block font-semibold">Client Photo</label>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  Upload a portrait of the client. This photo appears on the landing page testimonials.
                </p>
                {formData.photoUrl ? (
                  <div className="flex items-center gap-3">
                    <img
                      src={formData.photoUrl}
                      alt=""
                      className="w-16 h-16 rounded-lg object-cover border border-outline-variant"
                    />
                    <button
                      type="button"
                      className="border border-outline-variant text-on-surface px-3 py-1.5 font-label-caps text-[10px] hover:border-primary transition-all rounded-lg"
                      onClick={() => setFormData({ ...formData, photoUrl: '' })}
                    >
                      Remove photo
                    </button>
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg border border-dashed border-outline-variant bg-surface-container-highest flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-surface-variant text-[28px]">person</span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="space-y-1 block min-w-0">
                    <span className="text-[10px] text-on-surface-variant uppercase font-semibold">Photo URL</span>
                    <input
                      className="w-full bg-surface-container-highest border border-outline-variant p-2.5 text-on-surface rounded-lg text-xs focus:ring-1 focus:ring-primary focus:outline-none font-mono"
                      type="url"
                      placeholder="https://example.com/photo.jpg"
                      value={typeof formData.photoUrl === 'string' && formData.photoUrl.startsWith('data:') ? '' : formData.photoUrl}
                      onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                    />
                  </label>
                  <label className="space-y-1 block">
                    <span className="text-[10px] text-on-surface-variant uppercase font-semibold">Upload photo</span>
                    <span className="flex items-center justify-center gap-2 w-full min-h-[38px] bg-surface-container-highest border border-outline-variant rounded-lg text-xs font-semibold text-on-surface cursor-pointer hover:border-primary transition-colors">
                      <span className="material-symbols-outlined text-[18px]">upload</span>
                      Choose image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (!file) return;
                          if (!file.type.startsWith('image/')) {
                            window.alert('Please choose an image file.');
                            event.target.value = '';
                            return;
                          }
                          if (file.size > 2 * 1024 * 1024) {
                            window.alert('Please choose an image under 2MB.');
                            event.target.value = '';
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = () => {
                            setFormData((current) => ({ ...current, photoUrl: reader.result }));
                          };
                          reader.onerror = () => {
                            window.alert('Unable to upload this image. Please try another file.');
                          };
                          reader.readAsDataURL(file);
                          event.target.value = '';
                        }}
                      />
                    </span>
                  </label>
                </div>
                <p className="text-[10px] text-on-surface-variant">JPG, PNG, or WebP up to 2MB.</p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-primary uppercase block font-semibold">Client Quote</label>
                <textarea
                  className="w-full bg-surface-container-highest border border-outline-variant p-3 text-on-surface rounded-lg text-xs focus:ring-1 focus:ring-primary focus:outline-none leading-relaxed"
                  rows="3"
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                className="border border-outline-variant text-on-surface px-6 py-2 font-label-caps text-label-caps text-xs hover:border-primary transition-all rounded-lg"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                className="bg-primary text-on-primary px-6 py-2 font-label-caps text-label-caps text-xs hover:brightness-110 transition-all rounded-lg"
                onClick={saveTestimonial}
              >
                Save Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EditableCards({
  items,
  fields,
  updateDraft,
  path,
  textareaFields = ['description'],
  createItem,
  requestConfirm,
  itemLabel = 'item',
}) {
  return (
    <>
      <div className="admin-list-editor">
        {items.map((item, index) => (
          <div className="admin-inline-card" key={`${path}-${index}`}>
            {fields.map((field) => {
              const FieldComponent = textareaFields.includes(field) ? AdminTextarea : AdminField;
              return (
                <FieldComponent
                  key={field}
                  label={field}
                  value={item[field] ?? ''}
                  onChange={(value) => updateDraft((next) => { next[path][index][field] = value; })}
                />
              );
            })}
            <button
              className="admin-danger-button"
              type="button"
              onClick={() =>
                requestConfirm({
                  message: `Remove this ${itemLabel}? This cannot be undone.`,
                  confirmLabel: 'Remove',
                  onConfirm: () => updateDraft((next) => { next[path].splice(index, 1); }),
                })
              }
            >
              <Trash2 aria-hidden="true" size={15} strokeWidth={1.6} />
              Remove item
            </button>
          </div>
        ))}
      </div>
      {createItem ? (
        <button
          className="admin-secondary-button admin-add-button"
          type="button"
          onClick={() => updateDraft((next) => { next[path].push(createItem()); })}
        >
          <Plus aria-hidden="true" size={17} strokeWidth={1.6} />
          Add item
        </button>
      ) : null}
    </>
  );
}

function EditorHeading({ title, description, icon: Icon = FileText }) {
  return (
    <div className="admin-section-heading">
      <p>Content editor</p>
      <h2>
        <Icon aria-hidden="true" size={22} strokeWidth={1.5} />
        {title}
      </h2>
      <span>{description}</span>
    </div>
  );
}

function AdminField({ label, value, onChange }) {
  return (
    <label className="admin-field">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function AdminTextarea({ label, value, onChange }) {
  return (
    <label className="admin-field admin-field-wide">
      {label}
      <textarea value={value} rows="4" onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

export default AdminApp;
