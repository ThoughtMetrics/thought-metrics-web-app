# Advanced SEO Implementation Guide

## Overview

This guide explains how to implement advanced SEO features including structured data (Schema.org), Google Sitelinks, and rich search results for the Thought Metrics website.

## Table of Contents

1. [Key Features](#key-features)
2. [Getting Started](#getting-started)
3. [Schema Builders](#schema-builders)
4. [Implementation Examples](#implementation-examples)
5. [Testing Your Implementation](#testing-your-implementation)
6. [Best Practices](#best-practices)

---

## Key Features

### What's Been Implemented

- **Organization Schema** - Defines your company identity, logo, and social profiles
- **WebSite Schema with SearchAction** - Enables Google search box and sitelinks in search results
- **BreadcrumbList Schema** - Shows page hierarchy in Google search results
- **Article Schema** - Rich cards for blog posts with images, dates, and authors
- **@graph Approach** - Combines multiple schemas efficiently (recommended by Google)

### Why This Matters

These implementations help Google:
- Display **sitelinks** in branded searches (like "Pricing", "Integrations" shown in your reference)
- Show **breadcrumb navigation** in search results
- Create **rich article cards** for your blog content
- Understand your **site structure** better
- Display your **company information** in Knowledge Graph

---

## Getting Started

### 1. Configure Your SEO Settings

Update `src/core/constants/seo.constants.ts` with your company information:

```typescript
export const seoConfig: SchemaConfig = {
  siteUrl: 'https://www.thoughtmetrics.com',
  siteName: 'Thought Metrics',
  logoUrl: 'https://www.thoughtmetrics.com/logo.png', // Use actual logo URL
  socialProfiles: [
    'https://www.linkedin.com/company/thoughtmetrics',
    'https://twitter.com/thoughtmetrics',
    'https://www.facebook.com/thoughtmetrics',
    // Add all your social media profiles
  ],
};
```

**Important:** Add your real social media URLs! These appear in Google's Knowledge Graph.

---

## Schema Builders

The `src/core/utils/schema-builder.ts` provides reusable functions to create structured data.

### Available Builders

#### 1. `buildHomepageSchema(config)`

Creates complete structured data for your homepage.

**Includes:**
- Organization schema
- WebSite schema with SearchAction (critical for sitelinks!)
- WebPage schema

**Usage:**
```typescript
import { buildHomepageSchema } from '@/core/utils/schema-builder';
import { seoConfig } from '@/core/constants/seo.constants';

const structuredData = buildHomepageSchema(seoConfig);
```

---

#### 2. `buildStandardPageSchema(config, pageUrl, pageName, breadcrumbs?)`

For regular pages with breadcrumb navigation.

**Parameters:**
- `config` - Your SEO configuration
- `pageUrl` - Full URL of the page
- `pageName` - Page title
- `breadcrumbs` - Optional array of breadcrumb items

**Usage:**
```typescript
import { buildStandardPageSchema } from '@/core/utils/schema-builder';
import { seoConfig } from '@/core/constants/seo.constants';
import { generateBreadcrumbsFromPath } from '@/routes/routeConfig';

const breadcrumbs = generateBreadcrumbsFromPath(Astro.url.pathname);
const structuredData = buildStandardPageSchema(
  seoConfig,
  'https://www.thoughtmetrics.com/industries/fmcg',
  'FMCG Industry Research',
  breadcrumbs
);
```

---

#### 3. `buildArticlePageSchema(config, articleParams, breadcrumbs?)`

For blog posts and articles with rich content markup.

**Parameters:**
- `config` - Your SEO configuration
- `articleParams` - Article metadata (title, description, image, dates, etc.)
- `breadcrumbs` - Optional breadcrumb items

**Usage:**
```typescript
import { buildArticlePageSchema } from '@/core/utils/schema-builder';
import { seoConfig } from '@/core/constants/seo.constants';

const structuredData = buildArticlePageSchema(
  seoConfig,
  {
    siteUrl: seoConfig.siteUrl,
    pageUrl: 'https://www.thoughtmetrics.com/resources/market-research-guide',
    title: 'Complete Guide to Market Research',
    description: 'Learn everything about market research...',
    imageUrl: 'https://www.thoughtmetrics.com/images/guide.jpg',
    datePublished: '2024-01-15',
    dateModified: '2024-02-20',
    author: 'Thought Metrics Team',
    keywords: ['market research', 'guide', 'insights'],
  },
  breadcrumbs
);
```

---

## Implementation Examples

### Example 1: Homepage (Already Implemented)

```astro
---
// src/pages/index.astro
import PresentationLayout from '@layouts/PresentationLayout.astro';
import { seoConfig } from '@/core/constants/seo.constants';
import { buildHomepageSchema } from '@/core/utils/schema-builder';

const seoContent = {
  title: 'Thought Metrics | User Driven Market Research',
  description: 'Full-service market research firm...',
  keywords: 'market research, AI insights, focus groups',
};

// Build homepage schema with Organization, WebSite, and WebPage
const structuredData = buildHomepageSchema(seoConfig);
---

<PresentationLayout
  title={seoContent.title}
  description={seoContent.description}
  keywords={seoContent.keywords}
  structuredData={structuredData}
>
  <!-- Page content -->
</PresentationLayout>
```

---

### Example 2: Industry Page with Breadcrumbs

```astro
---
// src/pages/industries/fmcg.astro
import PresentationLayout from '@layouts/PresentationLayout.astro';
import { seoConfig } from '@/core/constants/seo.constants';
import { buildStandardPageSchema } from '@/core/utils/schema-builder';
import { generateBreadcrumbsFromPath } from '@/routes/routeConfig';

const seoContent = {
  title: 'FMCG Market Research | Thought Metrics',
  description: 'Expert market research services for FMCG industry...',
};

// Generate breadcrumbs: Home > Industries > FMCG
const breadcrumbs = generateBreadcrumbsFromPath(Astro.url.pathname);

// Build structured data with breadcrumbs
const pageUrl = new URL(Astro.url.pathname, seoConfig.siteUrl).href;
const structuredData = buildStandardPageSchema(
  seoConfig,
  pageUrl,
  'FMCG Industry Research',
  breadcrumbs
);
---

<PresentationLayout
  title={seoContent.title}
  description={seoContent.description}
  structuredData={structuredData}
>
  <!-- Page content -->
</PresentationLayout>
```

---

### Example 3: Blog/Resource Article Page

```astro
---
// src/pages/resources/[slug].astro
import PresentationLayout from '@layouts/PresentationLayout.astro';
import { seoConfig } from '@/core/constants/seo.constants';
import { buildArticlePageSchema } from '@/core/utils/schema-builder';
import { generateBreadcrumbsFromPath } from '@/routes/routeConfig';

// Fetch article data from CMS
const { slug } = Astro.params;
const article = await contentService.getContentBySlug(slug);

const seoContent = {
  title: article.title,
  description: article.description,
  keywords: article.tags.join(', '),
};

// Generate breadcrumbs
const breadcrumbs = generateBreadcrumbsFromPath(Astro.url.pathname);

// Build article schema
const pageUrl = new URL(Astro.url.pathname, seoConfig.siteUrl).href;
const structuredData = buildArticlePageSchema(
  seoConfig,
  {
    siteUrl: seoConfig.siteUrl,
    pageUrl,
    title: article.title,
    description: article.description,
    imageUrl: article.image,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: article.author || 'Thought Metrics',
    keywords: article.tags,
  },
  breadcrumbs
);
---

<PresentationLayout
  title={seoContent.title}
  description={seoContent.description}
  keywords={seoContent.keywords}
  ogImage={article.image}
  ogType="article"
  structuredData={structuredData}
>
  <!-- Article content -->
</PresentationLayout>
```

---

## Testing Your Implementation

### 1. Google Rich Results Test

Test your structured data:
1. Visit: https://search.google.com/test/rich-results
2. Enter your page URL or paste the HTML
3. Check for errors and warnings

### 2. Schema Markup Validator

Validate your schema:
1. Visit: https://validator.schema.org/
2. Paste your page URL or structured data JSON
3. Fix any validation errors

### 3. Google Search Console

Monitor your search performance:
1. Submit your sitemap in Search Console
2. Check "Enhancements" section for structured data issues
3. Monitor "Experience" for page experience metrics

### 4. Local Testing

View the structured data in your page source:

```bash
# Start dev server
yarn dev

# Open any page and view source
# Look for <script type="application/ld+json">
# Verify the JSON structure
```

---

## Best Practices

### 1. Social Media Profiles

✅ **DO:**
- Add ALL your active social media profiles to `seoConfig.socialProfiles`
- Use official company pages (not personal profiles)
- Keep URLs consistent (use HTTPS)

❌ **DON'T:**
- Link to inactive or outdated profiles
- Mix company and personal profiles
- Forget to update when changing social handles

---

### 2. Breadcrumbs

✅ **DO:**
- Use breadcrumbs on all pages deeper than homepage
- Keep breadcrumb labels concise and descriptive
- Maintain consistent hierarchy

❌ **DON'T:**
- Skip breadcrumbs on important pages
- Create overly long breadcrumb chains (>5 levels)
- Use generic labels like "Page" or "Item"

---

### 3. Article/Blog Posts

✅ **DO:**
- Always include `datePublished` and `dateModified`
- Use high-quality feature images (1200x630px minimum)
- Add relevant keywords array
- Keep headlines under 110 characters

❌ **DON'T:**
- Use placeholder dates or missing dates
- Omit images from article schema
- Keyword stuff
- Duplicate content across articles

---

### 4. Logo and Images

✅ **DO:**
- Use square logo (1:1 ratio, 512x512px minimum)
- Host images on same domain
- Use absolute URLs for all images
- Optimize image file sizes

❌ **DON'T:**
- Use external CDN URLs for logos
- Forget to update `logoUrl` in config
- Use low-resolution images
- Link to images that might change/move

---

### 5. SearchAction (Important for Sitelinks!)

The `SearchAction` in WebSite schema helps Google understand your search functionality.

**Current Implementation:**
```typescript
potentialAction: {
  '@type': 'SearchAction',
  target: {
    '@type': 'EntryPoint',
    urlTemplate: `${config.siteUrl}/resources?search={search_term_string}`,
  },
  'query-input': 'required name=search_term_string',
}
```

✅ **Update this** if you add site-wide search functionality
✅ **Keep the URL pattern** consistent with your actual search implementation

---

## How Google Sitelinks Work

### What Are Sitelinks?

Sitelinks are the additional links that appear under your main search result (like "Pricing", "Integrations" in your screenshot).

### How to Get Them

1. **Structured Data** ✅ (Already implemented)
   - Organization schema
   - WebSite schema with SearchAction
   - Clear site structure

2. **Site Architecture**
   - Clear navigation
   - Important pages linked from homepage
   - Consistent internal linking
   - Descriptive anchor text

3. **Quality Content**
   - Each page has unique, valuable content
   - Clear page titles (H1)
   - Well-written meta descriptions

4. **User Signals**
   - Users frequently visit certain pages
   - Low bounce rates on important pages
   - Good user engagement metrics

5. **Time & Trust**
   - Google needs time to crawl your site
   - Build authority and backlinks
   - Maintain consistent content quality

### Important Notes

- ⚠️ **Google automatically chooses sitelinks** - you can't force specific pages
- ⏱️ **Takes time** - usually weeks to months for new sites
- 🏷️ **Branded searches only** - typically shows for "Thought Metrics" or "ThoughtMetrics"
- 🔧 **Can demote** - Use Google Search Console to demote unwanted sitelinks

---

## Updating Pages

### Quick Checklist

When adding SEO to a new page:

- [ ] Import required utilities from `schema-builder.ts` and `seo.constants.ts`
- [ ] Choose appropriate schema builder (homepage/standard/article)
- [ ] Generate breadcrumbs if applicable
- [ ] Build structured data object
- [ ] Pass `structuredData` prop to layout component
- [ ] Add proper title, description, keywords
- [ ] Include OG image
- [ ] Test with Rich Results Test

---

## Common Issues & Solutions

### Issue: Structured Data Not Appearing

**Solution:**
1. Check browser dev tools → View Page Source
2. Search for `<script type="application/ld+json">`
3. Verify JSON is present and valid
4. Check for JavaScript errors in console

### Issue: Validation Errors

**Solution:**
1. Use Schema.org validator
2. Check for missing required fields
3. Ensure all URLs are absolute (not relative)
4. Verify date formats (ISO 8601: YYYY-MM-DD)

### Issue: No Sitelinks After Weeks

**Solution:**
1. Verify structured data is correct
2. Submit sitemap to Search Console
3. Check site navigation is clear
4. Ensure important pages are linked from homepage
5. Build more backlinks and authority
6. Be patient - can take 2-3 months

---

## Next Steps

1. **Update Logo URL** in `seo.constants.ts` with actual logo
2. **Add Social Profiles** to `seoConfig.socialProfiles`
3. **Apply to Key Pages**:
   - Industry pages
   - Capability pages
   - Research method pages
   - Resource/blog pages
4. **Submit Sitemap** to Google Search Console
5. **Monitor Performance** in Search Console
6. **Test All Pages** with Rich Results Test

---

## Resources

- [Google Search Central - Structured Data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [Schema.org Documentation](https://schema.org/)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)
- [Google Search Console](https://search.google.com/search-console)

---

## Support

For questions or issues with SEO implementation:
1. Check this guide first
2. Review Google's official documentation
3. Test with validation tools
4. Check Search Console for specific errors

---

**Last Updated:** November 2025
**Maintained by:** Development Team
