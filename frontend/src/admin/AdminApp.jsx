import { useState } from 'react';
import {
  BarChart3,
  BriefcaseBusiness,
  Eye,
  FileText,
  LayoutDashboard,
  LogIn,
  LogOut,
  MessageSquareQuote,
  Package,
  Plus,
  RotateCcw,
  Save,
  Settings,
  Trash2,
  UserRound,
} from 'lucide-react';
import { useLandingContent } from '../content/LandingContentContext.jsx';
import AdminPhotoField from './AdminPhotoField.jsx';
import './admin.css';

const ADMIN_SESSION_KEY = 'queens-banquet-admin-session';
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL ?? 'queensbanquet07@gmail.com';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? 'marou-admin';

const sidebarItems = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
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
  const [status, setStatus] = useState('');

  function handleLoginSuccess() {
    window.localStorage.setItem(ADMIN_SESSION_KEY, 'active');
    setIsAuthenticated(true);
  }

  function handleLogout() {
    window.localStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAuthenticated(false);
  }

  function updateDraft(updater) {
    setDraft((current) => {
      const nextDraft = structuredClone(current);
      updater(nextDraft);
      return nextDraft;
    });
    setStatus('');
  }

  function saveChanges() {
    setContent(draft);
    setStatus('Saved. Open landing pages update automatically while npm run dev is running.');
  }

  function handleReset() {
    const defaultContent = resetContent();
    setDraft(defaultContent);
    setStatus('Local content was reset and open landing pages updated automatically.');
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img src={draft.brand.logo} alt="" />
          <div>
            <span>Admin</span>
            <strong>{draft.brand.name}</strong>
          </div>
        </div>

        <nav className="admin-nav" aria-label="Admin sections">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                className={activeSection === item.id ? 'active' : ''}
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
              >
                <Icon aria-hidden="true" size={18} strokeWidth={1.6} />
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

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <p>Hidden admin page</p>
            <h1>Landing Page Manager</h1>
          </div>
          <div className="admin-actions">
            <a className="admin-secondary-button" href="/">
              <Eye aria-hidden="true" size={18} strokeWidth={1.6} />
              View Site
            </a>
            <button className="admin-secondary-button" type="button" onClick={handleReset}>
              <RotateCcw aria-hidden="true" size={18} strokeWidth={1.6} />
              Reset Local Content
            </button>
            <button className="admin-primary-button" type="button" onClick={saveChanges}>
              <Save aria-hidden="true" size={18} strokeWidth={1.6} />
              Save Changes
            </button>
          </div>
        </header>

        {status ? <p className="admin-status">{status}</p> : null}

        {activeSection === 'overview' ? <Overview content={draft} /> : null}
        {activeSection === 'brand' ? <BrandHeroEditor draft={draft} updateDraft={updateDraft} /> : null}
        {activeSection === 'experience' ? (
          <ExperienceEditor draft={draft} updateDraft={updateDraft} />
        ) : null}
        {activeSection === 'contact' ? <ContactEditor draft={draft} updateDraft={updateDraft} /> : null}
        {activeSection === 'services' ? <ServicesEditor draft={draft} updateDraft={updateDraft} /> : null}
        {activeSection === 'packages' ? <PackagesEditor draft={draft} updateDraft={updateDraft} /> : null}
        {activeSection === 'testimonials' ? (
          <TestimonialsEditor draft={draft} updateDraft={updateDraft} />
        ) : null}
      </main>
    </div>
  );
}

function AdminLogin({ onLoginSuccess }) {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setCredentials((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (credentials.email === ADMIN_EMAIL && credentials.password === ADMIN_PASSWORD) {
      onLoginSuccess();
      return;
    }

    setError('Invalid admin email or password.');
  }

  return (
    <main className="admin-login-page">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <img src="/queens-banquet-logo.svg" alt="Queen's Banquet Events" />
        <p>Queen's Banquet Events</p>
        <h1>Admin Login</h1>
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
        <button className="admin-primary-button" type="submit">
          <LogIn aria-hidden="true" size={18} strokeWidth={1.6} />
          Login
        </button>
        {error ? <span className="admin-login-error">{error}</span> : null}
        <small>Temporary local login. Replace with backend authentication before launch.</small>
      </form>
    </main>
  );
}

function Overview({ content }) {
  const cards = [
    { label: 'Coordination services', value: content.services.length, icon: BriefcaseBusiness },
    { label: 'Packages', value: content.packages.length, icon: Package },
    { label: 'Testimonials', value: content.testimonials.length, icon: MessageSquareQuote },
    { label: 'Contact channels', value: content.contactChannels.length, icon: BarChart3 },
  ];

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
              <Icon aria-hidden="true" size={23} strokeWidth={1.6} />
              <strong>{card.value}</strong>
              <span>{card.label}</span>
            </article>
          );
        })}
      </div>
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
      <EditorHeading title="Brand & hero" description="Update the main business details and first section." />
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

function ExperienceEditor({ draft, updateDraft }) {
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
        createItem={() => ({
          title: 'New experience highlight',
          description: 'Describe this coordination strength.',
        })}
      />
    </section>
  );
}

function ContactEditor({ draft, updateDraft }) {
  return (
    <section className="admin-panel">
      <EditorHeading title="Contact details" description="Edit direct contact channels and booking copy." />
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
              onClick={() => updateDraft((next) => { next.contactChannels.splice(index, 1); })}
            >
              <Trash2 aria-hidden="true" size={17} strokeWidth={1.6} />
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

function ServicesEditor({ draft, updateDraft }) {
  return (
    <section className="admin-panel">
      <EditorHeading title="Coordination services" description="Edit the service cards shown on the page." />
      <EditableCards
        items={draft.services}
        fields={['title', 'description']}
        updateDraft={updateDraft}
        path="services"
        createItem={() => ({ title: 'New coordination service', description: 'Describe this service.' })}
      />
    </section>
  );
}

function PackagesEditor({ draft, updateDraft }) {
  return (
    <section className="admin-panel">
      <EditorHeading title="Packages" description="Edit package names, tiers, and feature lists." />
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
              onClick={() => updateDraft((next) => { next.packages.splice(index, 1); })}
            >
              <Trash2 aria-hidden="true" size={17} strokeWidth={1.6} />
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

function TestimonialsEditor({ draft, updateDraft }) {
  return (
    <section className="admin-panel">
      <EditorHeading
        title="Testimonials"
        description="Edit client quotes, labels, and photos using an online URL or uploaded image."
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
              onClick={() => updateDraft((next) => { next.testimonials.splice(index, 1); })}
            >
              <Trash2 aria-hidden="true" size={17} strokeWidth={1.6} />
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

function EditableCards({ items, fields, updateDraft, path, textareaFields = ['description'], createItem }) {
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
              onClick={() => updateDraft((next) => { next[path].splice(index, 1); })}
            >
              <Trash2 aria-hidden="true" size={17} strokeWidth={1.6} />
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

function EditorHeading({ title, description }) {
  return (
    <div className="admin-section-heading">
      <p>Content editor</p>
      <h2>
        <FileText aria-hidden="true" size={26} strokeWidth={1.5} />
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
