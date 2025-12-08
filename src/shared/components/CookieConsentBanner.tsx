import React, { useEffect, useState } from 'react';
import { cn } from '@/core/utils/cn';

const COOKIE_CONSENT_KEY = 'tm_cookie_consent';
const COOKIE_CONSENT_EXPIRY = 365; // days

interface CookieConsentBannerProps {
  className?: string;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setIsVisible(true);
    } else {
      // Enable analytics if consent was previously given
      enableAnalytics();
    }
  }, []);

  const handleAccept = () => {
    // Store consent with expiry date
    const consentData = {
      accepted: true,
      timestamp: new Date().toISOString(),
      expiresAt: new Date(
        Date.now() + COOKIE_CONSENT_EXPIRY * 24 * 60 * 60 * 1000
      ).toISOString(),
    };

    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentData));

    // Enable analytics
    enableAnalytics();

    // Hide banner
    setIsVisible(false);
  };

  const handleDecline = () => {
    // Store declined consent
    const consentData = {
      accepted: false,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentData));

    // Disable analytics
    disableAnalytics();

    // Hide banner
    setIsVisible(false);
  };

  const enableAnalytics = () => {
    // Enable Google Tag Manager dataLayer
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'cookie_consent_update',
        cookie_consent: 'granted',
      });

      // Update GTM consent mode
      if ((window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'granted',
          ad_storage: 'granted',
          functionality_storage: 'granted',
          personalization_storage: 'granted',
        });
      }
    }
  };

  const disableAnalytics = () => {
    // Disable Google Tag Manager
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'cookie_consent_update',
        cookie_consent: 'denied',
      });

      // Update GTM consent mode
      if ((window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'denied',
          ad_storage: 'denied',
          functionality_storage: 'denied',
          personalization_storage: 'denied',
        });
      }
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      id="cookie-consent-banner"
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-gray-200 shadow-lg',
        className
      )}
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent banner"
    >
      <div className="container mx-auto px-4 py-4 md:px-6 md:py-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Message */}
          <div className="flex-1">
            <p className="text-sm md:text-base text-gray-700">
              Our website uses cookies to give you the best and most relevant
              experience. By clicking on accept, you give your consent to the
              use of cookies as per our{' '}
              <a
                href="/privacy-policy"
                className="text-primary hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                privacy policy
              </a>
              .
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={handleDecline}
              className="flex-1 md:flex-initial px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors duration-200"
              aria-label="Decline cookies"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 md:flex-initial px-6 py-2 text-sm font-medium text-white bg-primary hover:bg-secondary rounded transition-colors duration-200"
              aria-label="Accept cookies"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
