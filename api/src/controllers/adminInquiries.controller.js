import { getPool, listEventInquiries, updateEventInquiryStatus } from '@queens-banquet/backend';
import { inquiryStatusSchema } from '../schemas/admin.schema.js';

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

export async function updateInquiryStatus(request, response) {
  const parsedBody = inquiryStatusSchema.safeParse(request.body);

  if (!parsedBody.success) {
    return response.status(400).json({
      message: 'Invalid status value.',
      issues: parsedBody.error.flatten().fieldErrors,
    });
  }

  try {
    const pool = getPool();
    const inquiry = await updateEventInquiryStatus(pool, request.params.id, parsedBody.data.status);

    if (!inquiry) {
      return response.status(404).json({ message: 'Inquiry not found.' });
    }

    return response.json({ inquiry });
  } catch (error) {
    console.error('Unable to update inquiry status:', error.message);
    return response.status(503).json({ message: 'Unable to update inquiry status right now.' });
  }
}
