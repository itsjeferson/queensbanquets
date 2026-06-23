const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

function buildHeaders(token) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export function isApiEnabled() {
  return Boolean(API_BASE_URL);
}

export async function fetchLandingContent() {
  if (!API_BASE_URL) {
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/content`);

  if (!response.ok) {
    throw new Error('Unable to load landing content.');
  }

  const data = await response.json();
  return data.content;
}

export async function saveLandingContent(content, token) {
  if (!API_BASE_URL) {
    return { offline: true, content };
  }

  const response = await fetch(`${API_BASE_URL}/admin/content`, {
    method: 'PUT',
    headers: buildHeaders(token),
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error('Unable to save landing content.');
  }

  return response.json();
}

export async function resetLandingContentRemote(token) {
  if (!API_BASE_URL) {
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/admin/content/reset`, {
    method: 'POST',
    headers: buildHeaders(token),
  });

  if (!response.ok) {
    throw new Error('Unable to reset landing content.');
  }

  return response.json();
}
