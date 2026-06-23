import { createEventInquiry, getPool } from '@queens-banquet/backend';
import { inquirySchema } from '../schemas/inquiry.schema.js';

export async function createInquiry(request, response) {
  const parsedInquiry = inquirySchema.safeParse(request.body);

  if (!parsedInquiry.success) {
    return response.status(400).json({
      message: 'Invalid inquiry request.',
      issues: parsedInquiry.error.flatten().fieldErrors,
    });
  }

  try {
    const pool = getPool();
    const inquiry = await createEventInquiry(parsedInquiry.data, pool);

    return response.status(201).json({
      message: 'Inquiry received.',
      inquiry,
    });
  } catch (error) {
    console.error('Unable to save inquiry:', error.message);
    return response.status(503).json({
      message: 'Unable to submit your inquiry right now.',
    });
  }
}
