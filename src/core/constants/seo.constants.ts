import type { SchemaConfig } from '@/core/utils/schema-builder';

/**
 * Global SEO Configuration
 * Used across the site for structured data and schema.org markup
 */
export const seoConfig: SchemaConfig = {
  siteUrl: 'https://www.thoughtmetrics.com',
  siteName: 'Thought Metrics',
  logoUrl: 'https://www.thoughtmetrics.com/_astro/thought-metrics.4Gz3WWqy.png',
  socialProfiles: [
    'https://www.linkedin.com/company/the-thought-metrics-company',
    'https://www.instagram.com/thethoughtmetricscompany',
    'https://www.facebook.com/people/Thought-Metrics/61581686835321',
  ],
};

/**
 * Default SEO Content
 * Used as fallback when pages don't specify their own SEO metadata
 */
export const seoContent = {
  title: 'Thought Metrics',
  description:
    'Leading customer research and market intelligence platform delivering actionable insights for data-driven business decisions.',
  keywords:
    'market research, customer insights, data analytics, business intelligence',
  ogImage:
    'https://www.thoughtmetrics.com/src/images/research_methods_fieldwork_1.png',
  canonicalUrl: 'https://www.thoughtmetrics.com',
};

/**
 * Sitemap Configuration Constants
 *
 * Contains all sitemap-related configuration including:
 * - Pages to exclude from sitemap
 * - Custom pages to include (e.g., dynamic routes from CMS)
 * - Priority and change frequency settings
 */

/**
 * URL patterns to exclude from sitemap
 * These pages should not be indexed by search engines
 */
export const SITEMAP_EXCLUDE_PATTERNS = [
  '/admin',
  '/dashboard',
  '/edit-profile',
  '/unsubscribe',
  '/api',
  '/not-found',
  '/_',
];

/**
 * Custom pages to include in sitemap
 * These are typically dynamic routes that need explicit inclusion
 *
 * Resource pages with their slugs
 */
export const SITEMAP_CUSTOM_PAGES = [
  'https://www.thoughtmetrics.com/resources/boosting-client-loyalty-with-brand-perception',
  'https://www.thoughtmetrics.com/resources/brand-insights-that-matter',
  'https://www.thoughtmetrics.com/resources/brand-awareness-uncovered-know-your-impact',
  'https://www.thoughtmetrics.com/resources/sharpen-your-story-with-message-testing',
  'https://www.thoughtmetrics.com/resources/crafting-an-effective-competitive-landscape-strategy',
  'https://www.thoughtmetrics.com/resources/decoding-your-market-the-gtm-research-edge',
  'https://www.thoughtmetrics.com/resources/step-in-smart-a-deep-dive-into-market-entry-research',
  'https://www.thoughtmetrics.com/resources/blueprint-for-success-navigating-market-feasibility',
  'https://www.thoughtmetrics.com/resources/uncovering-consumer-preferences',
  'https://www.thoughtmetrics.com/resources/from-basics-to-business-solutions',
  'https://www.thoughtmetrics.com/resources/a-comprehensive-guide-to-product-validation',
  'https://www.thoughtmetrics.com/resources/partnering-with-a-ux-research-agency',
  'https://www.thoughtmetrics.com/resources/the-customer-journey-research-process',
  'https://www.thoughtmetrics.com/resources/turning-customers-loyal-for-life',
  'https://www.thoughtmetrics.com/resources/the-nuances-of-customer-satisfaction',
  'https://www.thoughtmetrics.com/resources/understanding-your-audience',
  'https://www.thoughtmetrics.com/resources/key-elements-of-pricing-research',
];

/**
 * Sitemap priority values
 * Priority range: 0.0 to 1.0
 */
export const SITEMAP_PRIORITY = {
  HIGH: 0.8, // Important pages like resources, main sections
  NORMAL: 0.5, // Standard pages
  LOW: 0.3, // Less important pages
} as const;

/**
 * Change frequency values for different page types
 */
export const SITEMAP_CHANGE_FREQUENCY = {
  RESOURCES: 'weekly' as const,
  STANDARD: 'monthly' as const,
} as const;
