const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
export const ADMIN_TOKEN_KEY = 'queens-banquet-admin-token';

function buildHeaders(token) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export function getStoredAdminToken() {
  return window.localStorage.getItem(ADMIN_TOKEN_KEY) ?? '';
}

export function storeAdminToken(token) {
  window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  window.localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export async function loginAdmin(credentials) {
  if (!API_BASE_URL) {
    return { offline: true };
  }

  const response = await fetch(`${API_BASE_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Invalid admin email or password.' }));
    throw new Error(error.message ?? 'Invalid admin email or password.');
  }

  return response.json();
}

export async function fetchCurrentAdmin(token) {
  if (!API_BASE_URL || !token) {
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/admin/me`, {
    headers: buildHeaders(token),
  });

  if (!response.ok) {
    throw new Error('Admin session expired.');
  }

  return response.json();
}

export async function fetchAdminInquiries(token) {
  if (!API_BASE_URL || !token) {
    return [];
  }

  const response = await fetch(`${API_BASE_URL}/admin/inquiries`, {
    headers: buildHeaders(token),
  });

  if (!response.ok) {
    throw new Error('Unable to load inquiries.');
  }

  const data = await response.json();
  return data.inquiries ?? [];
}

export async function updateAdminInquiryStatus(id, status, token) {
  if (!API_BASE_URL || !token) {
    throw new Error('Connect the API to manage inquiries.');
  }

  const response = await fetch(`${API_BASE_URL}/admin/inquiries/${id}/status`, {
    method: 'PATCH',
    headers: buildHeaders(token),
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unable to update inquiry status.' }));
    throw new Error(error.message ?? 'Unable to update inquiry status.');
  }

  const data = await response.json();
  return data.inquiry;
}
