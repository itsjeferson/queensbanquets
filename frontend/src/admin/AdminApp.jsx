import { useEffect, useState } from 'react';
import {
  clearAdminToken,
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
import './admin.css';
import {
  BarChart3,
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
  Star,
  Trash2,
  UserRound,
  X,
} from 'lucide-react';

const ADMIN_SESSION_KEY = 'queens-banquet-admin-session';
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL ?? 'queensbanquet07@gmail.com';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? 'marou-admin';

const sidebarItems = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'inquiries', label: 'Booking Inquiries', icon: Inbox },
  { id: 'brand', label: 'Brand & Hero', icon: Settings },
  { id: 'experience', label: "Marou's Experience", icon: FileText },
  { id: 'contact', label: 'Contact Details', icon: UserRound },
  { id: 'services', label: 'Coordination Services', icon: BriefcaseBusiness },
  { id: 'packages', label: 'Packages', icon: Package },
  { id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote },
];

function AdminApp() {
  const { content, setContent, resetContent } = useLandingContent();
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => window.localStorage.getItem(ADMIN_SESSION_KEY) === 'active',
  );
  const [activeSection, setActiveSection] = useState('overview');
  const [draft, setDraft] = useState(content);
  const [toasts, setToasts] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
    setActiveSection(sectionId);
    setSidebarOpen(false);
  }

  function handleLoginSuccess() {
    window.localStorage.setItem(ADMIN_SESSION_KEY, 'active');
    setIsAuthenticated(true);
  }

  function handleLogout() {
    window.localStorage.removeItem(ADMIN_SESSION_KEY);
    clearAdminToken();
    setIsAuthenticated(false);
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
    return <AdminLogin onLoginSuccess={handleLoginSuccess} brand={content.brand} />;
  }

  const activeItem = sidebarItems.find((item) => item.id === activeSection);

  return (
    <>
    <div className="admin-shell">
      <aside className={`admin-sidebar theme-dark${sidebarOpen ? ' is-open' : ''}`} id="admin-sidebar">
        <div className="admin-brand">
          <img src={draft.brand.logo} alt="" />
          <div>
            <strong>{draft.brand.owner}</strong>
            <span className="admin-role-badge">
              <Star aria-hidden="true" size={12} strokeWidth={0} fill="currentColor" />
              Super Admin
            </span>
          </div>
          <button
            className="admin-sidebar-close"
            type="button"
            aria-label="Close admin menu"
            onClick={() => setSidebarOpen(false)}
          >
            <X aria-hidden="true" size={18} strokeWidth={1.7} />
          </button>
        </div>

        <nav className="admin-nav" aria-label="Admin sections">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                className={activeSection === item.id ? 'active' : ''}
                key={item.id}
                type="button"
                onClick={() => selectSection(item.id)}
              >
                <Icon aria-hidden="true" size={16} strokeWidth={1.6} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <button className="admin-ghost-button" type="button" onClick={handleLogout}>
          <LogOut aria-hidden="true" size={18} strokeWidth={1.6} />
          Logout
        </button>
      </aside>

      {sidebarOpen ? (
        <button
          className="admin-sidebar-backdrop"
          type="button"
          aria-label="Close admin menu"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <main className="admin-main">
        <div className="admin-mobile-bar">
          <button
            className="admin-menu-toggle"
            type="button"
            aria-expanded={sidebarOpen}
            aria-controls="admin-sidebar"
            aria-label={sidebarOpen ? 'Close admin menu' : 'Open admin menu'}
            onClick={() => setSidebarOpen((current) => !current)}
          >
            <Menu aria-hidden="true" size={20} strokeWidth={1.7} />
          </button>
          <strong>{draft.brand.name}</strong>
        </div>

        <header className="admin-topbar">
          <div>
            <p className="admin-breadcrumb">
              <span>Admin</span>
              <span>/</span>
              <span>{activeItem?.label ?? 'Dashboard'}</span>
            </p>
            <h1>Landing Page Manager</h1>
          </div>
          <div className="admin-actions">
            <a className="admin-secondary-button" href="/">
              <Eye aria-hidden="true" size={18} strokeWidth={1.6} />
              View Site
            </a>
            <button className="admin-secondary-button" type="button" onClick={handleReset}>
              <RotateCcw aria-hidden="true" size={18} strokeWidth={1.6} />
              Reset Content
            </button>
            <button className="admin-primary-button" type="button" onClick={saveChanges} disabled={isSaving}>
              <Save aria-hidden="true" size={18} strokeWidth={1.6} />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </header>

        {activeSection === 'overview' ? <Overview content={draft} /> : null}
        {activeSection === 'inquiries' ? <InquiriesPanel pushToast={pushToast} /> : null}
        {activeSection === 'brand' ? <BrandHeroEditor draft={draft} updateDraft={updateDraft} /> : null}
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
      </main>
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
    <main className="admin-login-page">
      <section className="admin-login-brand theme-dark">
        <img src={brand?.logo ?? '/queens-banquet-logo.svg'} alt="" />
        <p>Queen's Banquet Events</p>
        <h1>Admin Dashboard</h1>
        <span>
          Manage your landing page content and booking inquiries in one calm,
          organized place.
        </span>
      </section>

      <form className="admin-login-card" onSubmit={handleSubmit}>
        <p>Restricted access</p>
        <h1>Sign in</h1>
        <label>
          Admin email
          <input
            name="email"
            type="email"
            value={credentials.email}
            onChange={handleChange}
            placeholder="queensbanquet07@gmail.com"
            required
          />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Enter admin password"
            required
          />
        </label>
        <button className="admin-primary-button" type="submit" disabled={isSubmitting}>
          <LogIn aria-hidden="true" size={18} strokeWidth={1.6} />
          {isSubmitting ? 'Signing in...' : 'Login'}
        </button>
        {error ? <span className="admin-login-error">{error}</span> : null}
        <small>
          {isApiEnabled()
            ? 'Sign in with your admin account stored in PostgreSQL.'
            : 'Temporary local login until the API and database are connected.'}
        </small>
      </form>
    </main>
  );
}

function Overview({ content }) {
  const [inquiries, setInquiries] = useState(null);

  useEffect(() => {
    if (!isApiEnabled()) {
      return undefined;
    }

    const token = getStoredAdminToken();

    if (!token) {
      return undefined;
    }

    let cancelled = false;

    fetchAdminInquiries(token)
      .then((data) => {
        if (!cancelled) {
          setInquiries(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setInquiries(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const cards = [
    { label: 'Coordination services', value: content.services.length, icon: BriefcaseBusiness },
    { label: 'Packages', value: content.packages.length, icon: Package },
    { label: 'Testimonials', value: content.testimonials.length, icon: MessageSquareQuote },
    { label: 'Contact channels', value: content.contactChannels.length, icon: BarChart3 },
  ];

  if (inquiries !== null) {
    cards.unshift({ label: 'Meeting requests', value: inquiries.length, icon: FileText });
  }

  const recentInquiries = (inquiries ?? []).slice(0, 5);

  return (
    <section className="admin-panel">
      <div className="admin-section-heading">
        <p>Overview</p>
        <h2>Manage what visitors see on the landing page.</h2>
      </div>
      <div className="admin-stat-grid">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.label}>
              <span className="admin-stat-icon">
                <Icon aria-hidden="true" size={20} strokeWidth={1.7} />
              </span>
              <strong>{card.value}</strong>
              <span>{card.label}</span>
            </article>
          );
        })}
      </div>

      <div className="admin-section-heading">
        <p>Latest activity</p>
        <h2 style={{ fontSize: '1.4rem' }}>Recent booking inquiries</h2>
      </div>

      {inquiries === null ? (
        <div className="admin-empty-state">
          <strong>No live inquiries feed yet</strong>
          <span>Connect the API and sign in to see booking requests as they arrive.</span>
        </div>
      ) : recentInquiries.length === 0 ? (
        <div className="admin-empty-state">
          <strong>No inquiries yet</strong>
          <span>New meeting requests submitted from the landing page will appear here.</span>
        </div>
      ) : (
        <div className="admin-preview-list">
          {recentInquiries.map((inquiry) => {
            const meta = getStatusMeta(inquiry.status);
            return (
              <div className="admin-preview-row" key={inquiry.id}>
                <div>
                  <strong>{inquiry.coupleName}</strong>
                  <small>
                    {inquiry.coordinationNeed || 'Coordination inquiry'} &middot;{' '}
                    {formatRelativeDate(inquiry.createdAt)}
                  </small>
                </div>
                <span className={`status-badge ${meta.className}`}>{meta.label}</span>
              </div>
            );
          })}
        </div>
      )}

      <div className="admin-note">
        <h3>Admin access</h3>
        <p>
          This page is intentionally hidden from the landing page. Marou can open it by typing
          <code> http://localhost:5174/admin </code>
          while the local dev server is running.
        </p>
      </div>
    </section>
  );
}

function BrandHeroEditor({ draft, updateDraft }) {
  return (
    <section className="admin-panel">
      <EditorHeading
        title="Brand & hero"
        description="Update the main business details and first section."
        icon={Settings}
      />
      <div className="admin-form-grid">
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
        <AdminTextarea
          label="Hero paragraph"
          value={draft.heroContent.copy}
          onChange={(value) => updateDraft((next) => { next.heroContent.copy = value; })}
        />
      </div>
    </section>
  );
}

function ExperienceEditor({ draft, updateDraft, requestConfirm }) {
  return (
    <section className="admin-panel">
      <EditorHeading
        title="Marou's coordination experience"
        description="Edit the featured panel quote, circular portrait photo, and experience cards."
      />

      <div className="admin-form-grid">
        <AdminTextarea
          label="Featured panel quote"
          value={draft.experienceContent?.panelQuote ?? ''}
          onChange={(value) =>
            updateDraft((next) => {
              next.experienceContent ??= { panelQuote: '', photoUrl: '' };
              next.experienceContent.panelQuote = value;
            })
          }
        />
        <AdminPhotoField
          label="Featured panel portrait"
          value={draft.experienceContent?.photoUrl ?? ''}
          onChange={(value) =>
            updateDraft((next) => {
              next.experienceContent ??= { panelQuote: '', photoUrl: '' };
              next.experienceContent.photoUrl = value;
            })
          }
        />
      </div>

      <EditableCards
        items={draft.experiencePoints}
        fields={['title', 'description']}
        updateDraft={updateDraft}
        path="experiencePoints"
        itemLabel="experience highlight"
        requestConfirm={requestConfirm}
        createItem={() => ({
          title: 'New experience highlight',
          description: 'Describe this coordination strength.',
        })}
      />
    </section>
  );
}

function ContactEditor({ draft, updateDraft, requestConfirm }) {
  return (
    <section className="admin-panel">
      <EditorHeading
        title="Contact details"
        description="Edit direct contact channels and booking copy."
        icon={UserRound}
      />
      <div className="admin-form-grid">
        <AdminField
          label="Booking eyebrow"
          value={draft.contactContent.eyebrow}
          onChange={(value) => updateDraft((next) => { next.contactContent.eyebrow = value; })}
        />
        <AdminField
          label="Booking title"
          value={draft.contactContent.title}
          onChange={(value) => updateDraft((next) => { next.contactContent.title = value; })}
        />
        <AdminTextarea
          label="Booking description"
          value={draft.contactContent.description}
          onChange={(value) => updateDraft((next) => { next.contactContent.description = value; })}
        />
      </div>

      <div className="admin-list-editor">
        {draft.contactChannels.map((channel, index) => (
          <div className="admin-inline-card" key={`${channel.label}-${index}`}>
            <AdminField
              label="Label"
              value={channel.label}
              onChange={(value) => updateDraft((next) => { next.contactChannels[index].label = value; })}
            />
            <AdminField
              label="Value"
              value={channel.value}
              onChange={(value) => updateDraft((next) => { next.contactChannels[index].value = value; })}
            />
            <AdminField
              label="Link"
              value={channel.href ?? ''}
              onChange={(value) => updateDraft((next) => { next.contactChannels[index].href = value; })}
            />
            <button
              className="admin-danger-button"
              type="button"
              onClick={() =>
                requestConfirm({
                  message: `Remove the "${channel.label || 'contact'}" contact channel? This cannot be undone.`,
                  onConfirm: () => updateDraft((next) => { next.contactChannels.splice(index, 1); }),
                })
              }
            >
              <Trash2 aria-hidden="true" size={15} strokeWidth={1.6} />
              Remove contact
            </button>
          </div>
        ))}
      </div>
      <button
        className="admin-secondary-button admin-add-button"
        type="button"
        onClick={() =>
          updateDraft((next) => {
            next.contactChannels.push({ label: 'New contact', value: '', href: '' });
          })
        }
      >
        <Plus aria-hidden="true" size={17} strokeWidth={1.6} />
        Add contact channel
      </button>
    </section>
  );
}

function ServicesEditor({ draft, updateDraft, requestConfirm }) {
  return (
    <section className="admin-panel">
      <EditorHeading
        title="Coordination services"
        description="Edit the service cards shown on the page."
        icon={BriefcaseBusiness}
      />
      <EditableCards
        items={draft.services}
        fields={['title', 'description']}
        updateDraft={updateDraft}
        path="services"
        itemLabel="service"
        requestConfirm={requestConfirm}
        createItem={() => ({ title: 'New coordination service', description: 'Describe this service.' })}
      />
    </section>
  );
}

function PackagesEditor({ draft, updateDraft, requestConfirm }) {
  return (
    <section className="admin-panel">
      <EditorHeading title="Packages" description="Edit package names, tiers, and feature lists." icon={Package} />
      <div className="admin-list-editor">
        {draft.packages.map((item, index) => (
          <div className="admin-inline-card" key={`${item.name}-${index}`}>
            <AdminField
              label="Name"
              value={item.name}
              onChange={(value) => updateDraft((next) => { next.packages[index].name = value; })}
            />
            <AdminField
              label="Tier"
              value={item.price}
              onChange={(value) => updateDraft((next) => { next.packages[index].price = value; })}
            />
            <AdminTextarea
              label="Features, one per line"
              value={item.features.join('\n')}
              onChange={(value) =>
                updateDraft((next) => {
                  next.packages[index].features = value.split('\n').filter(Boolean);
                })
              }
            />
            <button
              className="admin-danger-button"
              type="button"
              onClick={() =>
                requestConfirm({
                  message: `Remove the "${item.name || 'package'}" package? This cannot be undone.`,
                  onConfirm: () => updateDraft((next) => { next.packages.splice(index, 1); }),
                })
              }
            >
              <Trash2 aria-hidden="true" size={15} strokeWidth={1.6} />
              Remove package
            </button>
          </div>
        ))}
      </div>
      <button
        className="admin-secondary-button admin-add-button"
        type="button"
        onClick={() =>
          updateDraft((next) => {
            next.packages.push({
              name: 'New package',
              price: 'Custom',
              features: ['Add package feature'],
            });
          })
        }
      >
        <Plus aria-hidden="true" size={17} strokeWidth={1.6} />
        Add package
      </button>
    </section>
  );
}

function TestimonialsEditor({ draft, updateDraft, requestConfirm }) {
  return (
    <section className="admin-panel">
      <EditorHeading
        title="Testimonials"
        description="Edit client quotes, labels, and photos using an online URL or uploaded image."
        icon={MessageSquareQuote}
      />

      <div className="admin-list-editor">
        {draft.testimonials.map((testimonial, index) => (
          <div className="admin-inline-card" key={`testimonial-${index}`}>
            <AdminTextarea
              label="Quote"
              value={testimonial.quote}
              onChange={(value) => updateDraft((next) => { next.testimonials[index].quote = value; })}
            />
            <AdminField
              label="Author"
              value={testimonial.author}
              onChange={(value) => updateDraft((next) => { next.testimonials[index].author = value; })}
            />
            <AdminField
              label="Event"
              value={testimonial.event}
              onChange={(value) => updateDraft((next) => { next.testimonials[index].event = value; })}
            />
            <AdminPhotoField
              label="Client photo"
              value={testimonial.photoUrl ?? ''}
              onChange={(value) => updateDraft((next) => { next.testimonials[index].photoUrl = value; })}
            />
            <button
              className="admin-danger-button"
              type="button"
              onClick={() =>
                requestConfirm({
                  message: `Remove the testimonial from "${testimonial.author || 'this client'}"? This cannot be undone.`,
                  onConfirm: () => updateDraft((next) => { next.testimonials.splice(index, 1); }),
                })
              }
            >
              <Trash2 aria-hidden="true" size={15} strokeWidth={1.6} />
              Remove testimonial
            </button>
          </div>
        ))}
      </div>

      <button
        className="admin-secondary-button admin-add-button"
        type="button"
        onClick={() =>
          updateDraft((next) => {
            next.testimonials.push({
              quote: 'Add a client testimonial.',
              author: 'Client name',
              event: 'Event type',
              photoUrl: '',
            });
          })
        }
      >
        <Plus aria-hidden="true" size={17} strokeWidth={1.6} />
        Add testimonial
      </button>
    </section>
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
        <Icon aria-hidden="true" size={26} strokeWidth={1.5} />
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
