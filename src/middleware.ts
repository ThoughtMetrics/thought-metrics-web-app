/**
 * Astro Middleware
 *
 * Enforces www subdomain redirect and other request processing
 * Runs on every request before rendering the page
 */

import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
  const { url, redirect } = context;

  // CRITICAL: Enforce www subdomain for SEO consistency
  // Redirect thoughtmetrics.com → www.thoughtmetrics.com (301 permanent)
  // This ensures:
  // 1. Consistent canonical URLs across the site
  // 2. Favicon accessible on both domains via redirect
  // 3. Single authoritative domain for Google Search Console

  // Skip redirect for localhost, local IPs, and Vercel preview URLs
  const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  const isLocalIP = /^(\d{1,3}\.){3}\d{1,3}$/.test(url.hostname);
  const isVercelPreview = url.hostname.endsWith('.vercel.app');
  if (isLocalhost || isLocalIP || isVercelPreview) {
    return next();
  }

  // Redirect non-www to www (301 permanent redirect)
  if (!url.hostname.startsWith('www.')) {
    const wwwUrl = new URL(url);
    wwwUrl.hostname = `www.${url.hostname}`;

    // Use 301 (permanent) not 302 (temporary) for SEO
    return redirect(wwwUrl.toString(), 301);
  }

  // Continue to the requested page
  return next();
});
