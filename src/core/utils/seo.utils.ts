/**
 * SEO Utilities
 * Following PRO India SEO Guidelines
 *
 * GUIDELINES SUMMARY:
 * - Meta Title: 60 chars max, includes keywords, meaningful
 * - Meta Description: 160 chars max, includes keywords, generates curiosity
 * - URL Slug: lowercase, hyphens, no function words, includes focus keyword
 * - H1: Single H1 per page
 * - Content: Keywords in first 100 words, H2/H3 for subheadings
 * - Images: Keyword-based filename, alt tags, max 200KB
 * - Internal Links: Max 2, dofollow, keyword anchors
 * - External Links: Authoritative sources, mixed dofollow/nofollow
 */

// ============================================
// 1. META TAGS VALIDATION
// ============================================

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
}

export interface SEOValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
}

/**
 * Validates SEO metadata against PRO India guidelines
 * @param metadata - SEO metadata to validate
 * @returns Validation result with warnings and errors
 */
export function validateSEOMetadata(
  metadata: SEOMetadata
): SEOValidationResult {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Title validation (60 chars max)
  if (!metadata.title || metadata.title.trim().length === 0) {
    errors.push('Title is required');
  } else if (metadata.title.length > 60) {
    warnings.push(
      `Title is ${metadata.title.length} characters (recommended: ≤60 chars)`
    );
  } else if (metadata.title.length < 30) {
    warnings.push(
      `Title is ${metadata.title.length} characters (recommended: 30-60 chars for better SEO)`
    );
  }

  // Description validation (160 chars max)
  if (!metadata.description || metadata.description.trim().length === 0) {
    errors.push('Description is required');
  } else if (metadata.description.length > 160) {
    warnings.push(
      `Description is ${metadata.description.length} characters (recommended: ≤160 chars)`
    );
  } else if (metadata.description.length < 120) {
    warnings.push(
      `Description is ${metadata.description.length} characters (recommended: 120-160 chars for better SEO)`
    );
  }

  // Keywords validation
  if (metadata.keywords && metadata.keywords.length > 10) {
    warnings.push(
      `${metadata.keywords.length} keywords provided (recommended: 5-10 keywords)`
    );
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors,
  };
}

/**
 * Logs SEO validation results to console (development only)
 */
export function logSEOValidation(
  metadata: SEOMetadata,
  pageUrl?: string
): void {
  if (process.env.NODE_ENV !== 'development') return;

  const result = validateSEOMetadata(metadata);
  const prefix = pageUrl ? `[SEO: ${pageUrl}]` : '[SEO]';

  if (result.errors.length > 0) {
    console.error(`${prefix} ❌ Errors:`, result.errors);
  }

  if (result.warnings.length > 0) {
    console.warn(`${prefix} ⚠️  Warnings:`, result.warnings);
  }

  if (result.isValid && result.warnings.length === 0) {
    console.debug(`${prefix} ✅ SEO metadata looks good!`);
  }
}

// ============================================
// 2. URL SLUG GENERATION
// ============================================

/**
 * Generates SEO-friendly URL slug from title
 * Following PRO India slug guidelines:
 * - Lowercase only
 * - Hyphens instead of spaces
 * - Remove function words (a, the, and, etc.)
 * - Include focus keyword
 *
 * @param title - Page title
 * @param focusKeyword - Optional focus keyword to ensure inclusion
 * @returns SEO-friendly slug
 *
 * @example
 * generateSlug("The Perfect SEO Guideline")
 * // Returns: "perfect-seo-guideline"
 */
export function generateSlug(title: string, focusKeyword?: string): string {
  // Function words to remove (PRO India guideline)
  const functionWords = [
    'a',
    'an',
    'the',
    'and',
    'or',
    'but',
    'in',
    'on',
    'at',
    'to',
    'for',
    'of',
    'with',
    'by',
  ];

  let slug = title
    .toLowerCase() // Lowercase only
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Remove consecutive hyphens

  // Remove function words from the beginning
  const words = slug.split('-');
  if (functionWords.includes(words[0])) {
    words.shift();
  }

  // Remove function words from the middle
  slug = words
    .filter((word, index) => {
      // Keep first and last words
      if (index === 0 || index === words.length - 1) return true;
      // Remove function words from middle
      return !functionWords.includes(word);
    })
    .join('-');

  // Ensure focus keyword is included
  if (focusKeyword) {
    const keywordSlug = focusKeyword.toLowerCase().replace(/\s+/g, '-');
    if (!slug.includes(keywordSlug)) {
      console.warn(
        `Focus keyword "${focusKeyword}" not found in slug "${slug}"`
      );
    }
  }

  return slug;
}

// ============================================
// 3. IMAGE SEO HELPERS
// ============================================

export interface ImageSEOOptions {
  filename: string;
  alt?: string;
  keyword?: string;
}

/**
 * Generates SEO-friendly image attributes
 * Following PRO India image guidelines:
 * - Filename includes keyword
 * - Alt tag explains image with keyword
 * - Max 200KB size (validate separately)
 *
 * @param options - Image SEO options
 * @returns Validated filename and alt text
 */
export function generateImageSEO(options: ImageSEOOptions): {
  filename: string;
  alt: string;
} {
  const { filename, alt, keyword } = options;

  // Generate SEO-friendly filename
  let seoFilename = filename;
  if (keyword) {
    const keywordSlug = keyword.toLowerCase().replace(/\s+/g, '-');
    const extension = filename.substring(filename.lastIndexOf('.'));
    const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));

    // If keyword not in filename, add it
    if (!nameWithoutExt.toLowerCase().includes(keywordSlug)) {
      seoFilename = `${keywordSlug}-${nameWithoutExt}${extension}`;
    }
  }

  // Generate SEO-friendly alt text
  let seoAlt = alt || '';
  if (keyword && !seoAlt.toLowerCase().includes(keyword.toLowerCase())) {
    seoAlt = `${keyword} - ${seoAlt}`;
  }

  return {
    filename: seoFilename,
    alt: seoAlt,
  };
}

// ============================================
// 4. CONTENT SEO VALIDATORS
// ============================================

/**
 * Checks if keywords appear in first 100 words of content
 * @param content - Page content (HTML or plain text)
 * @param keywords - Keywords to check
 * @returns Array of missing keywords
 */
export function validateKeywordsInFirstWords(
  content: string,
  keywords: string[],
  wordLimit: number = 100
): string[] {
  // Strip HTML tags
  const plainText = content.replace(/<[^>]*>/g, ' ');

  // Get first N words
  const words = plainText.trim().split(/\s+/).slice(0, wordLimit).join(' ');
  const lowerWords = words.toLowerCase();

  // Find missing keywords
  return keywords.filter(
    (keyword) => !lowerWords.includes(keyword.toLowerCase())
  );
}

/**
 * Validates heading structure (single H1, H2/H3 for subheadings)
 * @param html - Page HTML content
 * @returns Validation result
 */
export function validateHeadingStructure(html: string): {
  isValid: boolean;
  h1Count: number;
  issues: string[];
} {
  const h1Matches = html.match(/<h1[^>]*>/gi) || [];
  const h2Matches = html.match(/<h2[^>]*>/gi) || [];
  const h3Matches = html.match(/<h3[^>]*>/gi) || [];

  const issues: string[] = [];

  if (h1Matches.length === 0) {
    issues.push('Missing H1 tag (required: exactly 1 per page)');
  } else if (h1Matches.length > 1) {
    issues.push(
      `Multiple H1 tags found (${h1Matches.length}). Recommended: exactly 1 per page`
    );
  }

  if (h2Matches.length === 0 && h3Matches.length === 0) {
    issues.push(
      'No H2 or H3 subheadings found (recommended for SEO structure)'
    );
  }

  return {
    isValid: h1Matches.length === 1,
    h1Count: h1Matches.length,
    issues,
  };
}

// ============================================
// 5. CHARACTER COUNTER HELPERS
// ============================================

/**
 * Counts characters and provides visual feedback
 * Useful for real-time validation in forms
 */
export function getCharacterCountStatus(
  text: string,
  maxLength: number,
  minLength?: number
): {
  count: number;
  status: 'good' | 'warning' | 'error';
  message: string;
} {
  const count = text.length;

  if (count > maxLength) {
    return {
      count,
      status: 'error',
      message: `${count - maxLength} characters over limit`,
    };
  }

  if (minLength && count < minLength) {
    return {
      count,
      status: 'warning',
      message: `${minLength - count} characters below recommended minimum`,
    };
  }

  return {
    count,
    status: 'good',
    message: `${maxLength - count} characters remaining`,
  };
}

// ============================================
// 6. TRUNCATION HELPERS
// ============================================

/**
 * Truncates text to a maximum length while preserving whole words
 * Adds ellipsis (...) if text is truncated
 *
 * @param text - Text to truncate
 * @param maxLength - Maximum character length (default: 60 for title)
 * @param ellipsis - Whether to add ellipsis (default: true)
 * @returns Truncated text
 *
 * @example
 * truncateText("The Ultimate Guide to SEO Best Practices", 30)
 * // Returns: "The Ultimate Guide to SEO..."
 */
export function truncateText(
  text: string,
  maxLength: number = 60,
  ellipsis: boolean = true
): string {
  if (!text || text.length <= maxLength) {
    return text;
  }

  // Calculate the length we need to keep (accounting for ellipsis)
  const targetLength = ellipsis ? maxLength - 3 : maxLength;

  // Find the last space before the target length to avoid cutting words
  let truncated = text.substring(0, targetLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > 0) {
    truncated = truncated.substring(0, lastSpace);
  }

  return ellipsis ? `${truncated}...` : truncated;
}

/**
 * Truncates SEO title to 60 characters (Google's display limit)
 * Preserves whole words and adds ellipsis
 *
 * @param title - Original title
 * @returns Truncated title
 */
export function truncateSEOTitle(title: string): string {
  return truncateText(title, 60, true);
}

/**
 * Truncates SEO meta description to 160 characters (Google's display limit)
 * Preserves whole words and adds ellipsis
 *
 * @param description - Original description
 * @returns Truncated description
 */
export function truncateSEODescription(description: string): string {
  return truncateText(description, 160, true);
}

/**
 * Optimizes SEO metadata by truncating title and description
 * Returns optimized metadata ready for meta tags
 *
 * @param metadata - Original SEO metadata
 * @returns Optimized SEO metadata
 */
export function optimizeSEOMetadata(metadata: SEOMetadata): SEOMetadata {
  return {
    ...metadata,
    title: truncateSEOTitle(metadata.title),
    description: truncateSEODescription(metadata.description),
  };
}
