/**
 * Analytics Event Tracking Utilities
 *
 * Provides helper functions to track user interactions via Google Tag Manager (GTM)
 * and Google Analytics 4 (GA4).
 *
 * USAGE:
 * 1. Import the utility functions
 * 2. Call trackEvent() to send custom events to GA4
 * 3. Use data attributes on HTML elements for automatic tracking
 *
 * @example
 * ```tsx
 * import { trackEvent, trackButtonClick } from '@utils/analytics.utils';
 *
 * // Track custom event
 * trackEvent('user_signup', { method: 'google' });
 *
 * // Track button click
 * trackButtonClick('Get Started', 'CTA', '/signup');
 * ```
 */

declare global {
  interface Window {
    dataLayer?: any[];
  }
}

/**
 * Event categories for organizing analytics events
 */
export enum EventCategory {
  BUTTON = 'button_click',
  NAVIGATION = 'navigation',
  FORM = 'form_interaction',
  CTA = 'call_to_action',
  DOWNLOAD = 'file_download',
  SOCIAL = 'social_share',
  VIDEO = 'video_interaction',
  SCROLL = 'scroll_depth',
  ENGAGEMENT = 'user_engagement',
}

/**
 * Event action types
 */
export enum EventAction {
  CLICK = 'click',
  SUBMIT = 'submit',
  SCROLL = 'scroll',
  PLAY = 'play',
  PAUSE = 'pause',
  DOWNLOAD = 'download',
  SHARE = 'share',
  VIEW = 'view',
}

/**
 * Interface for custom event properties
 */
export interface EventProperties {
  category?: string;
  action?: string;
  label?: string;
  value?: number;
  [key: string]: any; // Allow additional custom properties
}

/**
 * Push an event to Google Tag Manager dataLayer
 *
 * @param eventName - Name of the event (e.g., 'button_click', 'form_submit')
 * @param properties - Additional event properties
 *
 * @example
 * ```typescript
 * trackEvent('cta_clicked', {
 *   category: EventCategory.CTA,
 *   label: 'Get Started Button',
 *   value: 1
 * });
 * ```
 */
export const trackEvent = (
  eventName: string,
  properties: EventProperties = {}
): void => {
  if (typeof window === 'undefined') return;

  // Initialize dataLayer if it doesn't exist
  window.dataLayer = window.dataLayer || [];

  // Push event to dataLayer
  window.dataLayer.push({
    event: eventName,
    ...properties,
  });

  // Log in development mode
  if (import.meta.env.DEV) {
    console.log('[Analytics]', eventName, properties);
  }
};

/**
 * Track button clicks with standardized naming
 *
 * @param buttonText - Text content of the button
 * @param category - Button category (CTA, Navigation, etc.)
 * @param destination - URL or action destination (optional)
 *
 * @example
 * ```typescript
 * trackButtonClick('Sign Up', EventCategory.CTA, '/signup');
 * ```
 */
export const trackButtonClick = (
  buttonText: string,
  category: string = EventCategory.BUTTON,
  destination?: string
): void => {
  trackEvent('button_click', {
    category,
    action: EventAction.CLICK,
    label: buttonText,
    button_text: buttonText,
    destination: destination || 'none',
  });
};

/**
 * Track navigation link clicks
 *
 * @param linkText - Text of the link
 * @param linkUrl - Destination URL
 * @param linkType - Type of link (header, footer, sidebar, etc.)
 *
 * @example
 * ```typescript
 * trackNavigationClick('About Us', '/about', 'header');
 * ```
 */
export const trackNavigationClick = (
  linkText: string,
  linkUrl: string,
  linkType: string = 'navigation'
): void => {
  trackEvent('navigation_click', {
    category: EventCategory.NAVIGATION,
    action: EventAction.CLICK,
    label: linkText,
    link_url: linkUrl,
    link_type: linkType,
  });
};

/**
 * Track form submissions
 *
 * @param formName - Name of the form (e.g., 'contact_form', 'signup_form')
 * @param formData - Optional form field data to track
 *
 * @example
 * ```typescript
 * trackFormSubmit('contact_form', { fields: ['name', 'email', 'message'] });
 * ```
 */
export const trackFormSubmit = (
  formName: string,
  formData?: Record<string, any>
): void => {
  trackEvent('form_submit', {
    category: EventCategory.FORM,
    action: EventAction.SUBMIT,
    label: formName,
    form_name: formName,
    ...formData,
  });
};

/**
 * Track form interactions (focus, blur, validation errors)
 *
 * @param formName - Name of the form
 * @param fieldName - Name of the field
 * @param interactionType - Type of interaction (focus, blur, error)
 *
 * @example
 * ```typescript
 * trackFormInteraction('signup_form', 'email', 'validation_error');
 * ```
 */
export const trackFormInteraction = (
  formName: string,
  fieldName: string,
  interactionType: string
): void => {
  trackEvent('form_interaction', {
    category: EventCategory.FORM,
    action: interactionType,
    label: `${formName} - ${fieldName}`,
    form_name: formName,
    field_name: fieldName,
  });
};

/**
 * Track file downloads
 *
 * @param fileName - Name of the downloaded file
 * @param fileType - Type/extension of file (pdf, docx, etc.)
 * @param fileUrl - URL of the file
 *
 * @example
 * ```typescript
 * trackDownload('research_report.pdf', 'pdf', '/downloads/report.pdf');
 * ```
 */
export const trackDownload = (
  fileName: string,
  fileType: string,
  fileUrl: string
): void => {
  trackEvent('file_download', {
    category: EventCategory.DOWNLOAD,
    action: EventAction.DOWNLOAD,
    label: fileName,
    file_name: fileName,
    file_type: fileType,
    file_url: fileUrl,
  });
};

/**
 * Track social media shares
 *
 * @param platform - Social platform (facebook, twitter, linkedin, etc.)
 * @param contentType - Type of content being shared (article, product, etc.)
 * @param contentId - ID or URL of the content
 *
 * @example
 * ```typescript
 * trackSocialShare('twitter', 'article', '/blog/market-research-guide');
 * ```
 */
export const trackSocialShare = (
  platform: string,
  contentType: string,
  contentId: string
): void => {
  trackEvent('social_share', {
    category: EventCategory.SOCIAL,
    action: EventAction.SHARE,
    label: platform,
    platform,
    content_type: contentType,
    content_id: contentId,
  });
};

/**
 * Track scroll depth milestones (25%, 50%, 75%, 100%)
 *
 * @param scrollPercentage - Percentage of page scrolled (25, 50, 75, 100)
 * @param pagePath - Current page path
 *
 * @example
 * ```typescript
 * trackScrollDepth(50, '/blog/article-name');
 * ```
 */
export const trackScrollDepth = (
  scrollPercentage: number,
  pagePath: string
): void => {
  trackEvent('scroll_depth', {
    category: EventCategory.SCROLL,
    action: EventAction.SCROLL,
    label: `${scrollPercentage}%`,
    scroll_percentage: scrollPercentage,
    page_path: pagePath,
  });
};

/**
 * Track video interactions
 *
 * @param videoTitle - Title of the video
 * @param action - Action taken (play, pause, complete)
 * @param currentTime - Current playback time in seconds
 *
 * @example
 * ```typescript
 * trackVideoInteraction('Product Demo', 'play', 0);
 * ```
 */
export const trackVideoInteraction = (
  videoTitle: string,
  action: 'play' | 'pause' | 'complete',
  currentTime: number
): void => {
  trackEvent('video_interaction', {
    category: EventCategory.VIDEO,
    action,
    label: videoTitle,
    video_title: videoTitle,
    video_time: currentTime,
  });
};

/**
 * Track page engagement time
 *
 * @param timeSpent - Time spent on page in seconds
 * @param pagePath - Current page path
 *
 * @example
 * ```typescript
 * trackPageEngagement(120, '/about');
 * ```
 */
export const trackPageEngagement = (
  timeSpent: number,
  pagePath: string
): void => {
  trackEvent('page_engagement', {
    category: EventCategory.ENGAGEMENT,
    action: 'time_on_page',
    label: pagePath,
    time_spent: timeSpent,
    page_path: pagePath,
  });
};

/**
 * Initialize automatic scroll tracking
 * Tracks scroll depth at 25%, 50%, 75%, and 100%
 *
 * Call this once in your app initialization
 *
 * @example
 * ```typescript
 * // In Layout.astro or main component
 * useEffect(() => {
 *   initScrollTracking();
 * }, []);
 * ```
 */
export const initScrollTracking = (): void => {
  if (typeof window === 'undefined') return;

  const scrollMilestones = [25, 50, 75, 100];
  const trackedMilestones = new Set<number>();

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = Math.round((scrollTop / docHeight) * 100);

    scrollMilestones.forEach((milestone) => {
      if (
        scrollPercentage >= milestone &&
        !trackedMilestones.has(milestone)
      ) {
        trackedMilestones.add(milestone);
        trackScrollDepth(milestone, window.location.pathname);
      }
    });
  };

  // Debounce scroll events
  let scrollTimeout: NodeJS.Timeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(handleScroll, 300);
  });
};

/**
 * Attach click tracking to elements with data-track attributes
 *
 * Add these attributes to your HTML elements:
 * - data-track-event: Event name (required)
 * - data-track-category: Event category (optional)
 * - data-track-label: Event label (optional)
 * - data-track-value: Event value (optional)
 *
 * @example
 * ```html
 * <button
 *   data-track-event="button_click"
 *   data-track-category="cta"
 *   data-track-label="Get Started"
 * >
 *   Get Started
 * </button>
 * ```
 *
 * Then call: initAutoTracking();
 */
export const initAutoTracking = (): void => {
  if (typeof window === 'undefined') return;

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const trackableElement = target.closest('[data-track-event]') as HTMLElement;

    if (trackableElement) {
      const eventName = trackableElement.getAttribute('data-track-event');
      const category = trackableElement.getAttribute('data-track-category');
      const label = trackableElement.getAttribute('data-track-label');
      const value = trackableElement.getAttribute('data-track-value');

      if (eventName) {
        trackEvent(eventName, {
          category: category || undefined,
          label: label || undefined,
          value: value ? parseInt(value) : undefined,
          element_text: trackableElement.textContent?.trim() || '',
          element_id: trackableElement.id || undefined,
        });
      }
    }
  });
};

/**
 * Helper to generate consistent button tracking attributes
 *
 * @param label - Button label/text
 * @param category - Event category (CTA, Navigation, etc.)
 * @param destination - Optional destination URL
 *
 * @returns Object with data attributes for button element
 *
 * @example
 * ```tsx
 * <button {...getTrackingAttributes('Sign Up', EventCategory.CTA, '/signup')}>
 *   Sign Up
 * </button>
 * ```
 */
export const getTrackingAttributes = (
  label: string,
  category: string = EventCategory.BUTTON,
  destination?: string
) => ({
  'data-track-event': 'button_click',
  'data-track-category': category,
  'data-track-label': label,
  'data-track-destination': destination || '',
});

/**
 * Track custom conversion events
 *
 * @param conversionName - Name of the conversion (e.g., 'signup_complete', 'purchase')
 * @param conversionValue - Monetary value (optional)
 * @param conversionData - Additional conversion data
 *
 * @example
 * ```typescript
 * trackConversion('purchase', 499, {
 *   currency: 'INR',
 *   transaction_id: 'TXN123',
 *   items: ['premium_plan']
 * });
 * ```
 */
export const trackConversion = (
  conversionName: string,
  conversionValue?: number,
  conversionData?: Record<string, any>
): void => {
  trackEvent(conversionName, {
    category: 'conversion',
    action: 'complete',
    label: conversionName,
    value: conversionValue,
    ...conversionData,
  });
};
