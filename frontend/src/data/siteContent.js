export const navigationItems = [
  { label: 'HOME', href: '#top' },
  { label: 'ABOUT US', href: '#about' },
  { label: 'PACKAGES', href: '#packages' },
  { label: 'TESTIMONIALS', href: '#testimonials' },
  { label: 'CONTACT', href: '#contact' },
];

export const brand = {
  name: "QUEEN'S BANQUET EVENTS",
  owner: 'Marou Madrid',
  logo: '/queens-banquet-logo.svg',
};

export const heroContent = {
  eyebrow: 'CURATORS OF THE EXTRAORDINARY',
  title: 'Where Heritage Meets Timeless Splendor',
  copy: 'Crafting bespoke experiences for the world\'s most discerning hosts. From royal weddings to elite corporate galas.',
  primaryCta: 'DISCOVER THE SERVICES',
  secondaryCta: 'REQUEST ACCESS',
};

export const highlights = [
  { value: '320+', label: 'Royal Events' },
  { value: '15', label: 'Global Awards' },
  { value: '100%', label: 'Exclusivity' },
];

export const services = [
  {
    title: 'Wedding Planning',
    description: 'Transforming visions into matrimonial masterpieces with a dedicated concierge for every detail.',
    type: 'wedding-planning',
    image: '/queens-banquet-logo.svg' // Placeholder or we'll render custom graphics
  },
  {
    title: 'Event Design',
    description: 'Bespoke event themes, custom centerpieces, ambient styling, and elegant decor orchestration.',
    type: 'event-design',
    image: '/queens-banquet-logo.svg'
  },
  {
    title: 'Banquet Logistics',
    description: 'Flawless seating management, artisanal menu synchronization, and white-glove server coordination.',
    type: 'banquet-logistics',
    image: '/queens-banquet-logo.svg'
  },
  {
    title: 'Luxury Venues',
    description: 'Meticulous venue scouting, private estate buyouts, and historical castle event logistics.',
    type: 'luxury-venues',
    image: '/queens-banquet-logo.svg'
  },
];



export const packages = [
  {
    name: 'THE SOVEREIGN',
    price: 'Refined Intimacy',
    features: [
      { text: 'Up to 100 distinguished guests', included: true },
      { text: 'Artisanal menu curation by Chef de Cuisine', included: true },
      { text: 'Floral styling & ambient lighting design', included: true },
      { text: '24/7 Personal Concierge', included: false },
    ],
  },
  {
    name: 'THE HEIRLOOM',
    price: 'Grand Tradition',
    features: [
      { text: 'Up to 300 distinguished guests', included: true },
      { text: 'Premium wine & spirit sommelier pairing', included: true },
      { text: 'Live orchestral or ensemble coordination', included: true },
      { text: 'Dedicated event manager for duration', included: true },
    ],
    featured: true,
  },
  {
    name: 'ROYAL SIGNATURE',
    price: 'Infinite Horizon',
    features: [
      { text: 'Unlimited guest capacity', included: true },
      { text: 'Global venue scouting & buyout assistance', included: true },
      { text: 'Custom theatrical production & decor', included: true },
      { text: '24/7 Elite white-glove concierge', included: true },
    ],
  },
];

export const experienceContent = {
  panelQuote: 'Discretion, grandeur, and silent execution behind the most prestigious celebrations.',
  photoUrl: '/queens-banquet-logo.svg', // Will render waxes seal image
};

export const experiencePoints = [
  {
    title: 'OUR HERITAGE',
    description: 'Founded on the principles of discretion and grandeur, Queen\'s Banquet Events has been the silent architect behind the most prestigious celebrations for over three decades.'
  },
  {
    title: 'OUR PHILOSOPHY',
    description: 'Our philosophy is simple: we believe that every event is a living tapestry, woven from the threads of heritage, contemporary design, and unparalleled hospitality. We don\'t just plan events; we curate legacies.'
  }
];

export const testimonials = [
  {
    quote: 'An orchestration of pure magic. Every detail was handled with a level of discretion and artistry that is simply unmatched in the industry.',
    author: 'THE DUCHESS OF ESSEX',
    event: 'Mayfair, London',
    rating: 5,
    photoUrl: '',
  },
  {
    quote: 'The gold standard of elegance. Our gala was not just an event; it was a masterpiece that our guests are still talking about months later.',
    author: 'AURELIA & JULIAN',
    event: 'Villa d\'Este, Lake Como',
    rating: 5,
    photoUrl: '',
  },
  {
    quote: 'Their ability to transform a heritage estate into a contemporary wonderland while respecting its history is truly a rare gift.',
    author: 'MAXIMILIAN VON BERG',
    event: 'Bavarian Alps',
    rating: 5,
    photoUrl: '',
  },
  {
    quote: 'From the first consultation to the final farewell, every moment felt curated with intention. Guests still ask who created such an unforgettable evening.',
    author: 'ISABELLA & THOMAS REID',
    event: 'Cotswolds Manor, England',
    rating: 5,
    photoUrl: '',
  },
  {
    quote: 'A rare blend of precision and warmth. Our corporate celebration felt like a private soirée — refined, seamless, and entirely memorable.',
    author: 'HELENA MARQUETTE',
    event: 'Singapore Ballroom Gala',
    rating: 5,
    photoUrl: '',
  },
];

export const contactChannels = [
  { label: 'Owner', value: 'Marou Madrid' },
  { label: 'Viber', value: '09177677812', href: 'tel:+639177677812' },
  { label: 'Mobile', value: '09260843884', href: 'tel:+639260843884' },
  { label: 'Landline', value: '046 489 3887', href: 'tel:+63464893887' },
  { label: 'Email', value: 'queensbanquet07@gmail.com', href: 'mailto:queensbanquet07@gmail.com' },
];

export const contactContent = {
  eyebrow: 'Schedule a date',
  title: 'Book a coordination meeting with Marou.',
  description:
    'Request a meeting date through the form below. Share your wedding or event details so Marou can prepare the right coordination guidance.',
  successMessage: "Thank you. Your meeting request is ready for Queen's Banquet Events.",
};

export const footerContent = {
  tagline: 'Elegant weddings, refined receptions, and memorable family celebrations.',
  address: '156 Ligas 1, Bacoor, 4102 Cavite',
  mapsUrl: 'https://maps.app.goo.gl/z3Qhx3zKZwcXGXMt8',
};

export const defaultLandingContent = {
  navigationItems,
  brand,
  heroContent,
  highlights,
  services,

  packages,
  experienceContent,
  experiencePoints,
  testimonials,
  contactChannels,
  contactContent,
  footerContent,
};
