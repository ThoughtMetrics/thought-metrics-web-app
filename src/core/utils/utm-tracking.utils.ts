/**
 * UTM Tracking Utilities
 *
 * Handles UTM parameter tracking from tracking links
 * Only tracks when UTM parameters are present in URL (indicating a tracking link was used)
 */

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  tracking_id?: string;
}

/**
 * Get UTM parameters from current URL
 * Returns null if no UTM parameters found (not from a tracking link)
 */
export const getUTMParams = (): UTMParams | null => {
  if (typeof window === 'undefined') return null;

  const params = new URLSearchParams(window.location.search);
  const utmParams: UTMParams = {};
  let hasUTM = false;

  // Extract UTM parameters
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'tracking_id'];

  utmKeys.forEach((key) => {
    const value = params.get(key);
    if (value) {
      utmParams[key as keyof UTMParams] = value;
      hasUTM = true;
    }
  });

  // Only return if at least one UTM parameter exists (from tracking link)
  return hasUTM ? utmParams : null;
};

/**
 * Check if current page load is from a tracking link
 */
export const isFromTrackingLink = (): boolean => {
  const utmParams = getUTMParams();
  return utmParams !== null;
};

/**
 * Store UTM parameters in sessionStorage for persistence across pages
 * Only stores if UTM params exist (from tracking link)
 */
export const storeUTMParams = (): void => {
  if (typeof window === 'undefined') return;

  const utmParams = getUTMParams();

  if (utmParams) {
    sessionStorage.setItem('utm_params', JSON.stringify(utmParams));
    sessionStorage.setItem('utm_timestamp', Date.now().toString());

    if (import.meta.env.DEV) {
      console.debug('[UTM Tracking] Stored UTM params:', utmParams);
    }
  }
};

/**
 * Get stored UTM parameters from sessionStorage
 * Returns null if not from a tracking link or expired (24 hours)
 */
export const getStoredUTMParams = (): UTMParams | null => {
  if (typeof window === 'undefined') return null;

  const stored = sessionStorage.getItem('utm_params');
  const timestamp = sessionStorage.getItem('utm_timestamp');

  if (!stored || !timestamp) return null;

  // Check if expired (24 hours)
  const age = Date.now() - parseInt(timestamp);
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours

  if (age > maxAge) {
    clearUTMParams();
    return null;
  }

  return JSON.parse(stored);
};

/**
 * Clear stored UTM parameters
 */
export const clearUTMParams = (): void => {
  if (typeof window === 'undefined') return;

  sessionStorage.removeItem('utm_params');
  sessionStorage.removeItem('utm_timestamp');
};

/**
 * Append UTM parameters to a URL if they exist
 * Useful for maintaining tracking context across internal navigation
 */
export const appendUTMParams = (url: string): string => {
  const utmParams = getStoredUTMParams() || getUTMParams();

  if (!utmParams) return url;

  const urlObj = new URL(url, window.location.origin);

  Object.entries(utmParams).forEach(([key, value]) => {
    if (value) {
      urlObj.searchParams.set(key, value);
    }
  });

  return urlObj.toString();
};

/**
 * Initialize UTM tracking on page load
 * Call this in your root component or layout
 */
export const initUTMTracking = (): void => {
  if (typeof window === 'undefined') return;

  // Store UTM params if present
  storeUTMParams();

  // Log tracking status in dev mode
  if (import.meta.env.DEV) {
    const fromTracking = isFromTrackingLink();
    console.debug('[UTM Tracking] From tracking link:', fromTracking);

    if (fromTracking) {
      const params = getUTMParams();
      console.debug('[UTM Tracking] Parameters:', params);
    }
  }
};

/**
 * Get tracking context for API calls
 * Returns UTM params only if from a tracking link
 */
export const getTrackingContext = (): UTMParams | null => {
  return getStoredUTMParams() || getUTMParams();
};
