import { z } from 'zod';

const contactChannelSchema = z.object({
  label: z.string(),
  value: z.string(),
  href: z.string().optional(),
});

const testimonialSchema = z.object({
  quote: z.string(),
  author: z.string(),
  event: z.string(),
  photoUrl: z.string().optional(),
});

export const landingContentSchema = z.object({
  navigationItems: z.array(z.object({ label: z.string(), href: z.string() })),
  brand: z.object({
    name: z.string(),
    owner: z.string(),
    logo: z.string(),
  }),
  heroContent: z.object({
    eyebrow: z.string(),
    title: z.string(),
    copy: z.string(),
    primaryCta: z.string(),
    secondaryCta: z.string(),
  }),
  highlights: z.array(z.object({ value: z.string(), label: z.string() })),
  services: z.array(z.object({ title: z.string(), description: z.string() })),
  galleryMoments: z.array(z.string()),
  packages: z.array(
    z.object({
      name: z.string(),
      price: z.string(),
      features: z.array(z.string()),
      featured: z.boolean().optional(),
    }),
  ),
  experienceContent: z.object({
    panelQuote: z.string(),
    photoUrl: z.string().optional(),
  }),
  experiencePoints: z.array(z.object({ title: z.string(), description: z.string() })),
  testimonials: z.array(testimonialSchema),
  contactChannels: z.array(contactChannelSchema),
  contactContent: z.object({
    eyebrow: z.string(),
    title: z.string(),
    description: z.string(),
    successMessage: z.string(),
  }),
});
