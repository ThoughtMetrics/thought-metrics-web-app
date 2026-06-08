import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/core/lib/query-client';
import { AuthProvider, useAuth } from '@/shared/providers/auth-provider';
import { footerData } from './footer.constant';
import { ROUTES } from '@/routes/routeConfig';

const LinkedInSVG = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const XSvg = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18 }}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const VimeoSVG = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18 }}>
    <path d="M22 7.42c-.09 2.01-1.49 4.76-4.2 8.26C15.03 19.3 12.6 21 10.5 21c-1.26 0-2.33-1.16-3.2-3.49L5.6 11.8C4.97 9.46 4.3 8.3 3.6 8.3c-.16 0-.7.33-1.63.98L1 8.05c1.03-.9 2.04-1.81 3.03-2.71 1.37-1.18 2.39-1.8 3.07-1.86 1.61-.15 2.6.95 2.97 3.3.4 2.53.68 4.1.83 4.7.46 2.1.97 3.14 1.52 3.14.43 0 1.08-.68 1.95-2.04.86-1.36 1.32-2.4 1.38-3.1.12-1.17-.34-1.76-1.38-1.76-.49 0-1 .11-1.52.34.99-3.25 2.9-4.83 5.72-4.74 2.08.06 3.06 1.42 2.93 4.09z" />
  </svg>
);

const socialIcons: Record<string, React.FC> = {
  LinkedIn: LinkedInSVG,
  Twitter: XSvg,
  Vimeo: VimeoSVG,
};

const FooterContent: React.FC = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  const scrollToTop = () => {
    const rootElement = document.getElementById('full-screen');
    if (rootElement) {
      rootElement.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer
      aria-label="Site footer"
      style={{
        background: 'var(--surface-container-lowest)',
        borderTop: '1px solid var(--glass-border-color)',
        paddingTop: 56,
      }}
    >
      <div className="tm-container">

        {/* ── Top grid: brand + 4 nav columns ── */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: 32,
            paddingBottom: 40,
          }}
        >

          {/* Brand column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 160, maxWidth: 220 }}>

            {/* Logo mark + wordmark */}
            <a href={ROUTES.HOME} style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {/* Dark-mode mark */}
                <svg
                  className="footer-mark-dark"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 100 100"
                  width={24}
                  height={24}
                  aria-hidden="true"
                  style={{ flexShrink: 0 }}
                >
                  <defs>
                    <linearGradient id="gradDarkFt" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#adc7ff" />
                      <stop offset="100%" stopColor="#4a8eff" />
                    </linearGradient>
                  </defs>
                  <rect x="20" y="15" width="68" height="16" fill="url(#gradDarkFt)" />
                  <rect x="12" y="33" width="68" height="16" fill="#9fd8ff" />
                  <rect x="20" y="51" width="68" height="16" fill="url(#gradDarkFt)" />
                  <rect x="12" y="69" width="68" height="16" fill="#9fd8ff" />
                </svg>
                {/* Light-mode mark */}
                <svg
                  className="footer-mark-light"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 100 100"
                  width={24}
                  height={24}
                  aria-hidden="true"
                  style={{ flexShrink: 0 }}
                >
                  <defs>
                    <linearGradient id="gradLightFt" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#005bc0" />
                      <stop offset="100%" stopColor="#004493" />
                    </linearGradient>
                  </defs>
                  <rect x="20" y="15" width="68" height="16" fill="url(#gradLightFt)" />
                  <rect x="12" y="33" width="68" height="16" fill="#006685" />
                  <rect x="20" y="51" width="68" height="16" fill="url(#gradLightFt)" />
                  <rect x="12" y="69" width="68" height="16" fill="#006685" />
                </svg>
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    letterSpacing: '-0.025em',
                    color: 'var(--on-surface)',
                    lineHeight: 1,
                  }}
                >
                  ThoughtMetrics
                </span>
              </div>
            </a>

            {/* Tagline */}
            <p style={{ fontSize: 13, color: 'var(--on-surface-variant)', lineHeight: 1.6, margin: 0 }}>
              Building the most transparent and agile research network in India.
            </p>

            {/* Social buttons */}
            <div style={{ display: 'flex', gap: 8 }}>
              {footerData.socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 8,
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    color: 'var(--on-surface-variant)',
                    transition: 'border-color 0.2s, background 0.2s',
                    flexShrink: 0,
                  }}
                >
                  {React.createElement(socialIcons[social.name] ?? LinkedInSVG)}
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {footerData.sections.map((section) => (
            <nav key={section.title} aria-label={section.title} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color: 'var(--secondary)',
                  marginBottom: 4,
                }}
              >
                {section.title}
              </div>
              {section.links.map((link, index) => {
                let routePath = isAuthenticated && link.label === 'Join Our Panel' ? link.signedInPath : link.path;
                routePath = routePath ?? '#';
                const label = isAuthenticated && link.label === 'Join Our Panel' ? link.signedInLabel : link.label;
                return (
                  <a
                    key={index + link.label}
                    href={routePath}
                    style={{
                      fontSize: 14,
                      color: 'var(--on-surface-variant)',
                      lineHeight: 1.5,
                      textDecoration: 'none',
                      transition: 'color 0.15s',
                      fontWeight: link.isBold ? 600 : undefined,
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--on-surface)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--on-surface-variant)'; }}
                  >
                    {label}
                  </a>
                );
              })}
            </nav>
          ))}
        </div>

        {/* ── Bottom bar: copyright + back-to-top ── */}
        <div
          style={{
            borderTop: '1px solid var(--glass-border-color)',
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <p style={{ fontSize: 13, color: 'var(--on-surface-variant)', opacity: 0.6, margin: 0 }}>
            {footerData.copyright}
          </p>
          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            style={{
              width: 52,
              height: 30,
              background: 'var(--surface-container-high)',
              border: '1px solid var(--glass-border-color)',
              borderBottom: 'none',
              borderRadius: '6px 6px 0 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              alignSelf: 'flex-end',
              transition: 'background 0.2s',
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: 16, height: 16, color: 'var(--on-surface-variant)' }}
            >
              <polyline points="18,15 12,9 6,15" />
            </svg>
          </button>
        </div>

      </div>
    </footer>
  );
};

/**
 * Footer - Separate Astro Island with its own providers
 *
 * IMPORTANT: Has its own AuthProvider because it's rendered as client:only="react"
 * in PresentationLayout.astro, making it a separate island.
 */
const Footer: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FooterContent />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default Footer;
