const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export async function submitInquiry(payload) {
  if (!API_BASE_URL) {
    return {
      ok: true,
      offline: true,
      message: 'Inquiry captured locally until the API is connected.',
      payload,
    };
  }

  const response = await fetch(`${API_BASE_URL}/inquiries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Unable to submit your inquiry right now.');
  }

  return response.json();
}
