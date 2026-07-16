import { z } from 'zod';

export const adminLoginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(4),
});

export const adminPasswordChangeSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, 'Password must be at least 8 characters.'),
  confirmPassword: z.string().min(1),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword'],
});

export const inquiryStatusSchema = z.object({
  status: z.enum(['new', 'contacted', 'confirmed', 'archived']),
});
