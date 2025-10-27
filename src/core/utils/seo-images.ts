/**
 * SEO Images Utility
 *
 * PURPOSE: Handle optimized image URLs for SEO meta tags in Docker/SSR builds
 *
 * WHY THIS IS NEEDED:
 * - Astro optimizes images and adds hash to filenames (e.g., image.abc123.png)
 * - Hardcoded paths like '/og-image.png' won't work after build
 * - This utility provides the correct, optimized URLs
 *
 * USAGE:
 * ```typescript
 * import { getOptimizedImageUrl } from '@utils/seo-images';
 *
 * // Get optimized URL for an image
 * const ogImageUrl = await getOptimizedImageUrl('og-default.png');
 * // Returns: /_astro/og-default.abc123.png
 * ```
 */

import type { ImageMetadata } from 'astro';

/**
 * Get optimized image URL for SEO meta tags
 *
 * @param imageName - The filename of the image in src/assets/images/ (e.g., 'og-default.png')
 * @returns The optimized URL with hash, or null if not found
 */
export async function getOptimizedImageUrl(
  imageName: string
): Promise<string | null> {
  // Use Vite's import.meta.glob to import all images
  const images = import.meta.glob<{ default: ImageMetadata }>(
    '/src/assets/images/*.{jpeg,jpg,png,gif,webp}',
    { eager: true }
  );

  // Find the image by name
  const imagePath = `/src/assets/images/${imageName}`;
  const imageModule = images[imagePath];

  if (!imageModule) {
    console.warn(`SEO image not found: ${imageName}`);
    return null;
  }

  // Return the optimized src URL
  return imageModule.default.src;
}

/**
 * Check if a value is an ImageMetadata object
 *
 * @param value - The value to check
 * @returns True if value is ImageMetadata
 */
export function isImageMetadata(value: unknown): value is ImageMetadata {
  return (
    typeof value === 'object' &&
    value !== null &&
    'src' in value &&
    'width' in value &&
    'height' in value &&
    'format' in value
  );
}

/**
 * Get SEO image URL from various input types
 *
 * @param image - Can be ImageMetadata, string URL, or image filename
 * @param fallbackImageName - Fallback image name if primary fails
 * @returns The optimized image URL
 */
export async function getSEOImageUrl(
  image: ImageMetadata | string | undefined,
  fallbackImageName: string = 'og-default.png'
): Promise<string> {
  // If it's ImageMetadata, return the src directly
  if (isImageMetadata(image)) {
    return image.src;
  }

  // If it's a string URL (http/https), return as-is
  if (typeof image === 'string' && (image.startsWith('http://') || image.startsWith('https://'))) {
    return image;
  }

  // If it's a filename, try to get optimized URL
  if (typeof image === 'string') {
    const optimizedUrl = await getOptimizedImageUrl(image);
    if (optimizedUrl) {
      return optimizedUrl;
    }
  }

  // Fallback to default image
  const fallbackUrl = await getOptimizedImageUrl(fallbackImageName);
  if (fallbackUrl) {
    return fallbackUrl;
  }

  // Last resort: return a placeholder
  return '/placeholder-og.png';
}
