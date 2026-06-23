import { getPool, listEventInquiries } from '@queens-banquet/backend';

export async function listInquiries(_request, response) {
  try {
    const pool = getPool();
    const inquiries = await listEventInquiries(pool);

    return response.json({ inquiries });
  } catch (error) {
    console.error('Unable to list inquiries:', error.message);
    return response.status(503).json({ message: 'Unable to load inquiries right now.' });
  }
}
