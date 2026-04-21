import { SITE_URL, GOOGLE_SITE_VERIFICATION, BING_SITE_VERIFICATION } from 'astro:env/server';

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  author: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  socialLinks: string[];
  twitter?: {
    site: string;
    creator: string;
  };
  verification?: {
    google?: string;
    bing?: string;
  };
  authorImage?: string;
  blogImageOverlay?: boolean;
  branding: {
    logo: {
      alt: string;
      imageUrl?: string;
    };
    favicon: {
      svg: string;
    };
    colors: {
      themeColor: string;
      backgroundColor: string;
    };
  };
}

const siteConfig: SiteConfig = {
  name: 'Red Surge Apparel',

  description:
    'Outfit ideas for concerts, parties, and real-life events. Simple guides to help you know exactly what to wear for any situation.',

  // ⚠️ Replace this with your real domain when you have one
  url: SITE_URL || 'https://redsurgeapparel.com',

  ogImage: '/og-default.svg',

  // You can change this to your name later
  author: 'Collin Ste',

  // Optional — replace or remove if you don’t want contact visible
  email: 'contact@redsurgeapparel.com',

  // Optional — update if you want local SEO later
  address: {
    street: '',
    city: 'New York',
    state: 'NY',
    zip: '',
    country: 'United States',
  },

  // Replace with your real socials (or remove ones you don’t use)
  socialLinks: ['https://www.instagram.com/', 'https://www.tiktok.com/', 'https://x.com/'],

  twitter: {
    site: '@redsurge',
    creator: '@redsurge',
  },

  verification: {
    google: GOOGLE_SITE_VERIFICATION,
    bing: BING_SITE_VERIFICATION,
  },

  // Replace if you add a real logo/avatar
  authorImage: '/avatar.svg',

  blogImageOverlay: true,

  branding: {
    logo: {
      alt: 'Red Surge Apparel',
      imageUrl: '/logo.png', // optional — add later if you create one
    },
    favicon: {
      svg: '/favicon.svg',
    },
    colors: {
      themeColor: '#111111', // darker = more fashion/editorial feel
      backgroundColor: '#ffffff',
    },
  },
};

export default siteConfig;
