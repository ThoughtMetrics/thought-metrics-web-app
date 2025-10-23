# SEO Implementation Guide

This document explains how to implement SEO best practices in Astro pages following **PRO India SEO Guidelines**.

## Table of Contents
1. [Overview](#overview)
2. [SEO Requirements](#seo-requirements)
3. [Implementation](#implementation)
4. [Examples](#examples)
5. [Validation](#validation)
6. [Best Practices](#best-practices)

---

## Overview

All SEO meta tags are now centrally managed through the `SEOHead.astro` component, which automatically generates:

- ✅ Primary meta tags (title, description, keywords)
- ✅ Open Graph tags (for Facebook, LinkedIn sharing)
- ✅ Twitter Card tags (for Twitter sharing)
- ✅ Canonical URLs (prevents duplicate content issues)
- ✅ Robots meta tags (controls search engine crawling)
- ✅ Additional SEO tags (author, language, revisit-after)

**Component Location:** `src/shared/components/SEOHead.astro`

---

## SEO Requirements (From PRO India Guidelines)

### Meta Title
- **Max Length:** 60 characters
- **Requirements:**
  - Must contain targeted keywords related to page content
  - Should be meaningful and explanatory
  - Format: `Page Title - Thought Metrics`

### Meta Description
- **Max Length:** 160 characters
- **Requirements:**
  - Must contain all targeted keywords
  - Should be meaningful and generate curiosity
  - Use user-related terms (not literary style)
  - Should encourage clicks

### Keywords
- Comma-separated list of relevant keywords
- Include variations and related terms
- Focus on user search intent

### Images (for og:image)
- **Size:** 1200 x 630 px (recommended for Open Graph)
- **Alternative:** 600 x 315 px
- **Max file size:** 200 KB
- **Quality:** High quality, relevant to content

---

## Implementation

### Step 1: Define SEO Content in Your Astro Page

```astro
---
import PresentationLayout from '@/layouts/PresentationLayout.astro';
import YourComponent from '@/shared/screens/your-component';

/**
 * SEO Configuration (Following PRO India SEO Guidelines)
 * - Title: Max 60 characters
 * - Description: Max 160 characters
 * - Keywords: Targeted keywords related to page content
 */
const seoContent = {
  title: 'Your Page Title - Thought Metrics', // Count characters!
  description: 'Your compelling description that includes keywords and encourages clicks. Keep it under 160 characters.',
  keywords: 'keyword1, keyword2, keyword3, related term, thought metrics',
  ogImage: '/images/your-og-image.png', // Optional: custom OG image
  ogType: 'website', // or 'article' for blog posts
  canonical: 'https://thoughtmetrics.com/your-page', // Optional: if different from auto-generated
  noindex: false, // Set to true for pages you don't want indexed (e.g., user profiles, login)
  nofollow: false, // Set to true to prevent following links on this page
};
---

<PresentationLayout
  title={seoContent.title}
  description={seoContent.description}
  keywords={seoContent.keywords}
  ogImage={seoContent.ogImage}
  ogType={seoContent.ogType}
  canonical={seoContent.canonical}
  noindex={seoContent.noindex}
  nofollow={seoContent.nofollow}
>
  <YourComponent client:only="react" />
</PresentationLayout>
```

### Step 2: Choose the Right Layout

All layouts support SEO props:
- `PresentationLayout` - Standard pages with header/footer
- `LandingLayout` - Landing pages with special header
- `IntractionLayout` - Auth/interaction pages (login, register, profile)

### Step 3: Character Count Validation

In **development mode**, the SEOHead component automatically warns you if:
- Title exceeds 60 characters
- Description exceeds 160 characters

Check your browser console for warnings like:
```
⚠️ SEO Warning: Title exceeds 60 characters (72): "Your Very Long Title That Goes Over The Limit"
```

---

## Examples

### Example 1: Public Marketing Page

```astro
---
import PresentationLayout from '@/layouts/PresentationLayout.astro';
import ResearchFormWrapper from '@/shared/screens/start-your-research/ResearchFormWrapper';

const seoContent = {
  title: 'Start Your Research - Thought Metrics', // 40 chars ✓
  description: 'Begin your research journey with Thought Metrics. Get expert insights, qualitative and quantitative research services tailored to your business needs.', // 158 chars ✓
  keywords: 'start research, research services, market research, qualitative research, quantitative research, thought metrics',
  ogType: 'website',
};
---

<PresentationLayout
  title={seoContent.title}
  description={seoContent.description}
  keywords={seoContent.keywords}
  ogType={seoContent.ogType}
>
  <ResearchFormWrapper client:only="react" />
</PresentationLayout>
```

### Example 2: User-Specific Page (No Index)

```astro
---
import IntractionLayout from '@/layouts/IntractionLayout.astro';
import EditProfileWrapper from '@/shared/screens/auth/edit-profile';

const seoContent = {
  title: 'Edit Profile - Thought Metrics', // 32 chars ✓
  description: 'Update your profile information, preferences, and account settings on Thought Metrics platform.', // 102 chars ✓
  keywords: 'edit profile, user profile, account settings, update profile, thought metrics profile',
  noindex: true, // ⚠️ Important: Prevent indexing of user-specific pages
};
---

<IntractionLayout
  title={seoContent.title}
  description={seoContent.description}
  keywords={seoContent.keywords}
  noindex={seoContent.noindex}
>
  <EditProfileWrapper client:only="react" />
</IntractionLayout>
```

### Example 3: Blog Post/Article Page

```astro
---
import PresentationLayout from '@/layouts/PresentationLayout.astro';
import BlogPost from '@/shared/screens/blog/BlogPost';

const seoContent = {
  title: 'How to Conduct Market Research - Thought Metrics', // 53 chars ✓
  description: 'Learn the essential steps for conducting effective market research. Our comprehensive guide covers qualitative and quantitative methods for business insights.', // 159 chars ✓
  keywords: 'market research, qualitative research, quantitative research, business insights, research methods',
  ogImage: '/images/blog/market-research-og.png', // Custom blog post image
  ogType: 'article', // ⚠️ Use 'article' for blog posts
  canonical: 'https://thoughtmetrics.com/blog/how-to-conduct-market-research',
};
---

<PresentationLayout
  title={seoContent.title}
  description={seoContent.description}
  keywords={seoContent.keywords}
  ogImage={seoContent.ogImage}
  ogType={seoContent.ogType}
  canonical={seoContent.canonical}
>
  <BlogPost client:load />
</PresentationLayout>
```

---

## Validation

### Tools to Validate SEO

1. **Character Length:**
   - Google Sheets: `=LEN(A1)` formula
   - Online: https://metatags.io/

2. **Social Media Preview:**
   - Facebook: https://developers.facebook.com/tools/debug/
   - Twitter: https://cards-dev.twitter.com/validator
   - LinkedIn: https://www.linkedin.com/post-inspector/

3. **SEO Audit:**
   - Google Search Console
   - Lighthouse (built into Chrome DevTools)

### HTML Output Verification

To verify tags are rendering correctly:

```bash
# View rendered HTML
curl http://localhost:4200/your-page | grep -E "<title>|<meta"

# Or check in browser DevTools > Elements tab > <head>
```

You should see:
```html
<!-- Primary Meta Tags -->
<title>Your Page Title - Thought Metrics</title>
<meta name="title" content="Your Page Title - Thought Metrics">
<meta name="description" content="Your description...">
<meta name="keywords" content="keyword1, keyword2...">
<meta name="robots" content="index, follow">

<!-- Canonical URL -->
<link rel="canonical" href="https://thoughtmetrics.com/your-page">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://thoughtmetrics.com/your-page">
<meta property="og:title" content="Your Page Title - Thought Metrics">
<meta property="og:description" content="Your description...">
<meta property="og:image" content="https://thoughtmetrics.com/og-image.png">
<meta property="og:site_name" content="Thought Metrics">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:url" content="https://thoughtmetrics.com/your-page">
<meta name="twitter:title" content="Your Page Title - Thought Metrics">
<meta name="twitter:description" content="Your description...">
<meta name="twitter:image" content="https://thoughtmetrics.com/og-image.png">
```

---

## Best Practices

### ✅ DO:

1. **Always define seoContent object** in every page
2. **Count characters** before deploying (use comments to track)
3. **Include brand name** in title: `"Page Title - Thought Metrics"`
4. **Write compelling descriptions** that encourage clicks
5. **Use targeted keywords** naturally in title and description
6. **Set noindex=true** for:
   - User profiles
   - Login/register pages
   - Admin pages
   - Thank you pages
   - Internal tools
7. **Use ogType='article'** for blog posts and resources
8. **Provide custom ogImage** for important landing pages and blog posts
9. **Test social sharing** before deploying major pages

### ❌ DON'T:

1. **Don't exceed character limits** (60 for title, 160 for description)
2. **Don't keyword stuff** - write naturally for users
3. **Don't use same title/description** across multiple pages
4. **Don't forget to update SEO** when changing page content
5. **Don't index sensitive pages** (user data, admin, auth)
6. **Don't use low-quality images** for og:image
7. **Don't copy competitor meta tags** - write unique content

### Character Counting Template

Use this in your pages to track character counts:

```astro
const seoContent = {
  title: 'Your Page Title Here - Thought Metrics', // XX chars
  description: 'Your compelling description that includes relevant keywords and encourages users to click through to your page.', // XXX chars
  keywords: 'keyword1, keyword2, keyword3',
};
```

### Page-Specific Guidelines

| Page Type | ogType | noindex | nofollow | Notes |
|-----------|--------|---------|----------|-------|
| Homepage | `website` | `false` | `false` | Most important SEO page |
| Service Pages | `website` | `false` | `false` | Include service keywords |
| Blog Posts | `article` | `false` | `false` | Use custom ogImage |
| Landing Pages | `website` | `false` | `false` | Optimized for conversions |
| Contact/Forms | `website` | `false` | `false` | Include action keywords |
| User Profiles | `website` | `true` | `true` | Don't index personal data |
| Login/Register | `website` | `true` | `true` | No SEO value |
| Thank You | `website` | `true` | `true` | Prevent indexing |

---

## Troubleshooting

### Issue: Description not showing in search results

**Solution:**
- Check character count (max 160)
- Ensure description is meaningful and relevant
- Verify `description` prop is passed correctly through layouts

### Issue: Social sharing shows wrong image

**Solution:**
- Verify ogImage path is absolute URL: `https://thoughtmetrics.com/image.png`
- Check image size: 1200x630px recommended
- Clear social media cache:
  - Facebook: https://developers.facebook.com/tools/debug/
  - LinkedIn: https://www.linkedin.com/post-inspector/

### Issue: Duplicate meta tags in HTML

**Solution:**
- Only use SEOHead component through layouts
- Don't add manual meta tags in page files
- Check browser DevTools for duplicate tags

### Issue: Character count warnings in console

**Solution:**
- Shorten title/description to meet limits
- Use https://metatags.io/ to preview and adjust

---

## Migration Checklist

When updating existing pages to use new SEO system:

- [ ] Define `seoContent` object with all required fields
- [ ] Count characters for title (max 60) and description (max 160)
- [ ] Add inline comments with character counts
- [ ] Include relevant keywords
- [ ] Set appropriate `ogType` (`website` or `article`)
- [ ] Add `noindex: true` for user-specific pages
- [ ] Provide custom `ogImage` for important pages
- [ ] Test in development and check console for warnings
- [ ] Verify rendered HTML includes all SEO tags
- [ ] Test social sharing preview
- [ ] Validate with https://metatags.io/

---

**For Questions or Issues:**
- Check rendered HTML in browser DevTools
- Review this documentation
- Test with online validators
- Consult PRO India SEO Guidelines PDF

**Last Updated:** 2025-10-23
