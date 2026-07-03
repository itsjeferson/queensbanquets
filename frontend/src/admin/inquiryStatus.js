export const INQUIRY_STATUSES = ['new', 'contacted', 'confirmed', 'archived'];

const STATUS_META = {
  new: { label: 'New', className: 'status-badge-new' },
  contacted: { label: 'Contacted', className: 'status-badge-contacted' },
  confirmed: { label: 'Confirmed', className: 'status-badge-confirmed' },
  archived: { label: 'Archived', className: 'status-badge-archived' },
};

export function getStatusMeta(status) {
  return STATUS_META[status] ?? STATUS_META.new;
}

export function formatRelativeDate(value) {
  if (!value) {
    return 'No date set';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'No date set';
  }

  const diffMs = date.getTime() - Date.now();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (Math.abs(diffDays) < 1) {
    return 'Today';
  }

  if (Math.abs(diffDays) < 30) {
    return formatter.format(diffDays, 'day');
  }

  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}
