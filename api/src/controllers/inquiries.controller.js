import { inquirySchema } from '../schemas/inquiry.schema.js';
import { queueInquiry } from '../services/inquiry.service.js';

export async function createInquiry(request, response) {
  const parsedInquiry = inquirySchema.safeParse(request.body);

  if (!parsedInquiry.success) {
    return response.status(400).json({
      message: 'Invalid inquiry request.',
      issues: parsedInquiry.error.flatten().fieldErrors,
    });
  }

  const inquiry = await queueInquiry(parsedInquiry.data);

  return response.status(202).json({
    message: 'Inquiry accepted.',
    inquiry,
  });
}
