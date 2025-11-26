/**
 * Schema.org Structured Data Builder
 *
 * Provides utilities to create rich structured data for Google search results:
 * - Organization schema with social profiles
 * - WebSite schema with SearchAction (enables Google Sitelinks)
 * - BreadcrumbList schema for page hierarchy
 * - Article/BlogPosting schema for content pages
 *
 * These schemas help Google understand your site structure and display
 * enhanced search results including sitelinks, breadcrumbs, and rich cards.
 */

import type { BreadcrumbItem } from '@/core/types/breadcrumb-item.type';

export interface SchemaConfig {
  siteUrl: string;
  siteName: string;
  logoUrl?: string;
  socialProfiles?: string[];
}

/**
 * Organization Schema
 * Defines your company's identity, logo, and social media presence
 * Required for Google Knowledge Graph and enhanced brand search results
 */
export function buildOrganizationSchema(config: SchemaConfig) {
  return {
    '@type': 'Organization',
    '@id': `${config.siteUrl}/#organization`,
    name: config.siteName,
    url: config.siteUrl,
    logo: config.logoUrl
      ? {
          '@type': 'ImageObject',
          '@id': `${config.siteUrl}/#logo`,
          url: config.logoUrl,
          width: '512',
          height: '512',
        }
      : undefined,
    sameAs: config.socialProfiles || [],
  };
}

/**
 * WebSite Schema with SearchAction
 * Enables Google to show a search box in search results
 * Critical for getting sitelinks to appear in branded search results
 */
export function buildWebSiteSchema(config: SchemaConfig) {
  return {
    '@type': 'WebSite',
    '@id': `${config.siteUrl}/#website`,
    url: config.siteUrl,
    name: config.siteName,
    publisher: {
      '@id': `${config.siteUrl}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${config.siteUrl}/resources?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * WebPage Schema
 * Defines a standard webpage with its relationship to the site
 */
export function buildWebPageSchema(config: SchemaConfig, pageUrl: string, pageName?: string) {
  return {
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: pageName,
    isPartOf: {
      '@id': `${config.siteUrl}/#website`,
    },
    about: {
      '@id': `${config.siteUrl}/#organization`,
    },
  };
}

/**
 * BreadcrumbList Schema
 * Shows the page's position in your site hierarchy
 * Google displays this as breadcrumb navigation in search results
 */
export function buildBreadcrumbSchema(
  breadcrumbs: BreadcrumbItem[],
  siteUrl: string
) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.label,
      item: `${siteUrl}${breadcrumb.path}`,
    })),
  };
}

/**
 * Article/BlogPosting Schema
 * Rich content markup for blog posts and articles
 * Enables Google to show enhanced article cards with images, dates, and author
 */
export interface ArticleSchemaParams {
  siteUrl: string;
  pageUrl: string;
  title: string;
  description: string;
  imageUrl?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  keywords?: string[];
}

export function buildArticleSchema(params: ArticleSchemaParams) {
  return {
    '@type': 'Article',
    '@id': `${params.pageUrl}#article`,
    headline: params.title,
    description: params.description,
    image: params.imageUrl
      ? {
          '@type': 'ImageObject',
          url: params.imageUrl,
        }
      : undefined,
    datePublished: params.datePublished,
    dateModified: params.dateModified || params.datePublished,
    author: {
      '@type': 'Organization',
      '@id': `${params.siteUrl}/#organization`,
      name: params.author || 'Thought Metrics',
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${params.siteUrl}/#organization`,
    },
    keywords: params.keywords,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': params.pageUrl,
    },
  };
}

/**
 * Build complete @graph structured data
 * Combines multiple schema types into a single JSON-LD @graph
 * This is the recommended approach by Google for multiple schema types
 */
export function buildGraphSchema(schemas: Record<string, any>[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': schemas.filter(Boolean), // Remove undefined schemas
  };
}

/**
 * Homepage Schema
 * Complete structured data for the homepage with Organization, WebSite, and WebPage
 */
export function buildHomepageSchema(config: SchemaConfig) {
  return buildGraphSchema([
    buildOrganizationSchema(config),
    buildWebSiteSchema(config),
    buildWebPageSchema(config, config.siteUrl, config.siteName),
  ]);
}

/**
 * Standard Page Schema
 * For regular pages with Organization, WebSite, WebPage, and Breadcrumbs
 */
export function buildStandardPageSchema(
  config: SchemaConfig,
  pageUrl: string,
  pageName: string,
  breadcrumbs?: BreadcrumbItem[]
) {
  const schemas: Record<string, any>[] = [
    buildOrganizationSchema(config),
    buildWebSiteSchema(config),
    buildWebPageSchema(config, pageUrl, pageName),
  ];

  if (breadcrumbs && breadcrumbs.length > 1) {
    schemas.push(buildBreadcrumbSchema(breadcrumbs, config.siteUrl));
  }

  return buildGraphSchema(schemas);
}

/**
 * Article Page Schema
 * For blog posts and articles with full article markup
 */
export function buildArticlePageSchema(
  config: SchemaConfig,
  articleParams: ArticleSchemaParams,
  breadcrumbs?: BreadcrumbItem[]
) {
  const schemas: Record<string, any>[] = [
    buildOrganizationSchema(config),
    buildWebSiteSchema(config),
    buildArticleSchema(articleParams),
  ];

  if (breadcrumbs && breadcrumbs.length > 1) {
    schemas.push(buildBreadcrumbSchema(breadcrumbs, config.siteUrl));
  }

  return buildGraphSchema(schemas);
}
