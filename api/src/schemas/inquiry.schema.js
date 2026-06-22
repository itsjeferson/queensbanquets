import { z } from 'zod';

export const inquirySchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  eventDate: z.string().optional(),
  guests: z.coerce.number().int().positive().optional(),
  message: z.string().trim().max(2000).optional(),
});
