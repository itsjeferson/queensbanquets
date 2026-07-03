import { useEffect, useMemo, useState } from 'react';
import { Inbox, Mail, Phone, Search } from 'lucide-react';
import { fetchAdminInquiries, getStoredAdminToken, updateAdminInquiryStatus } from '../api/admin.js';
import { isApiEnabled } from '../api/content.js';
import { INQUIRY_STATUSES, formatRelativeDate, getStatusMeta } from './inquiryStatus.js';

const FILTERS = [{ id: 'all', label: 'All' }, ...INQUIRY_STATUSES.map((status) => ({
  id: status,
  label: getStatusMeta(status).label,
}))];

function formatDate(value) {
  if (!value) {
    return 'Not set';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Not set';
  }

  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function InquiriesPanel({ pushToast }) {
  const [inquiries, setInquiries] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const apiReady = isApiEnabled();

  useEffect(() => {
    if (!apiReady) {
      setIsLoading(false);
      return undefined;
    }

    const token = getStoredAdminToken();

    if (!token) {
      setIsLoading(false);
      return undefined;
    }

    let cancelled = false;
    setIsLoading(true);

    fetchAdminInquiries(token)
      .then((data) => {
        if (!cancelled) {
          setInquiries(data);
          setLoadError('');
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setLoadError(error.message ?? 'Unable to load inquiries.');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [apiReady]);

  const filteredInquiries = useMemo(() => {
    const list = inquiries ?? [];
    const term = searchTerm.trim().toLowerCase();

    return list.filter((inquiry) => {
      const matchesStatus = statusFilter === 'all' || (inquiry.status ?? 'new') === statusFilter;

      if (!matchesStatus) {
        return false;
      }

      if (!term) {
        return true;
      }

      return [inquiry.coupleName, inquiry.email, inquiry.phone]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(term));
    });
  }, [inquiries, searchTerm, statusFilter]);

  const statusCounts = useMemo(() => {
    const counts = { all: (inquiries ?? []).length };
    INQUIRY_STATUSES.forEach((status) => {
      counts[status] = (inquiries ?? []).filter((inquiry) => (inquiry.status ?? 'new') === status).length;
    });
    return counts;
  }, [inquiries]);

  async function handleStatusChange(inquiry, nextStatus) {
    const previousStatus = inquiry.status;

    setInquiries((current) =>
      current.map((item) => (item.id === inquiry.id ? { ...item, status: nextStatus } : item)),
    );

    try {
      const token = getStoredAdminToken();
      await updateAdminInquiryStatus(inquiry.id, nextStatus, token);
      pushToast?.('success', `Marked ${inquiry.coupleName}'s inquiry as ${getStatusMeta(nextStatus).label.toLowerCase()}.`);
    } catch (error) {
      setInquiries((current) =>
        current.map((item) => (item.id === inquiry.id ? { ...item, status: previousStatus } : item)),
      );
      pushToast?.('error', error.message ?? 'Unable to update inquiry status.');
    }
  }

  return (
    <section className="admin-panel">
      <div className="admin-section-heading">
        <p>Booking inquiries</p>
        <h2>
          <Inbox aria-hidden="true" size={26} strokeWidth={1.5} />
          Manage meeting requests
        </h2>
        <span>Review, search, and track the status of couples requesting a coordination meeting.</span>
      </div>

      {!apiReady ? (
        <div className="admin-empty-state">
          <strong>Connect the API to manage inquiries</strong>
          <span>
            Set <code>VITE_API_BASE_URL</code> and sign in with a database-backed admin account to view and
            update live booking requests here.
          </span>
        </div>
      ) : (
        <>
          <div className="admin-inquiries-toolbar">
            <div className="admin-search-field">
              <Search aria-hidden="true" size={18} strokeWidth={1.8} />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name, email, or phone"
                aria-label="Search inquiries"
              />
            </div>
            <div className="admin-filter-chips" role="group" aria-label="Filter by status">
              {FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  className={statusFilter === filter.id ? 'active' : ''}
                  onClick={() => setStatusFilter(filter.id)}
                >
                  {filter.label} ({statusCounts[filter.id] ?? 0})
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="admin-empty-state">
              <strong>Loading inquiries…</strong>
              <span>Fetching the latest booking requests.</span>
            </div>
          ) : loadError ? (
            <div className="admin-empty-state">
              <strong>Unable to load inquiries</strong>
              <span>{loadError}</span>
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="admin-empty-state">
              <strong>No matching inquiries</strong>
              <span>
                {inquiries && inquiries.length > 0
                  ? 'Try a different search term or status filter.'
                  : 'New meeting requests submitted from the landing page will appear here.'}
              </span>
            </div>
          ) : (
            <div className="admin-inquiries-table">
              <div className="admin-inquiry-row admin-inquiry-row-head" aria-hidden="true">
                <span>Couple</span>
                <span>Contact</span>
                <span>Meeting date</span>
                <span>Event date</span>
                <span>Guests</span>
                <span>Status</span>
              </div>

              {filteredInquiries.map((inquiry) => (
                <div className="admin-inquiry-row" key={inquiry.id}>
                  <div className="admin-inquiry-primary">
                    <strong>{inquiry.coupleName}</strong>
                    <span>{inquiry.coordinationNeed || 'Coordination inquiry'}</span>
                  </div>

                  <div className="admin-inquiry-contact">
                    {inquiry.email ? (
                      <a href={`mailto:${inquiry.email}`}>
                        <Mail aria-hidden="true" size={13} strokeWidth={1.8} style={{ marginRight: '0.35rem' }} />
                        {inquiry.email}
                      </a>
                    ) : null}
                    {inquiry.phone ? (
                      <a href={`tel:${inquiry.phone}`}>
                        <Phone aria-hidden="true" size={13} strokeWidth={1.8} style={{ marginRight: '0.35rem' }} />
                        {inquiry.phone}
                      </a>
                    ) : null}
                  </div>

                  <div className="admin-inquiry-meta admin-inquiry-meta-primary">
                    <strong>{formatDate(inquiry.preferredMeetingDate)}</strong>
                    Submitted {formatRelativeDate(inquiry.createdAt)}
                  </div>

                  <div className="admin-inquiry-meta admin-inquiry-meta-secondary">
                    <strong>{formatDate(inquiry.eventDate)}</strong>
                    Event date
                  </div>

                  <div className="admin-inquiry-meta admin-inquiry-meta-secondary">
                    <strong>{inquiry.estimatedGuests ?? '—'}</strong>
                    guests
                  </div>

                  <select
                    className="admin-status-select"
                    value={inquiry.status ?? 'new'}
                    onChange={(event) => handleStatusChange(inquiry, event.target.value)}
                    aria-label={`Update status for ${inquiry.coupleName}`}
                  >
                    {INQUIRY_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {getStatusMeta(status).label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default InquiriesPanel;
