import React from 'react';
import { ROUTES } from '@/routes/routeConfig';
import type { AuthContext } from './header.constant';
import { headerDropdownData, navigationItems } from './header.constant';

// ── Hamburger button ───────────────────────────────────────────

interface HamburgerProps {
  isOpen: boolean;
  onClick: () => void;
}

export const Hamburger: React.FC<HamburgerProps> = ({ isOpen, onClick }) => (
  <button
    onClick={onClick}
    className={`hamburger ml-auto z-[1001]${isOpen ? ' open' : ''}`}
    aria-label="Toggle menu"
    aria-expanded={isOpen}
  >
    <span /><span /><span />
  </button>
);

// ── Mobile overlay + slide-in panel ───────────────────────────

interface NavMobileProps {
  isOpen: boolean;
  activeAccordion: string | null;
  onAccordion: (item: string) => void;
  onLinkClick: () => void;
  onOverlayClick: () => void;
  auth: AuthContext;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const NavMobile: React.FC<NavMobileProps> = ({
  isOpen,
  activeAccordion,
  onAccordion,
  onLinkClick,
  onOverlayClick,
  auth,
  theme,
  onToggleTheme,
}) => {
  const { isAuthenticated, isAdminUser, isAdminPage, isClient } = auth;

  return (
    <>
      {/* Dark backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[998] md:hidden"
          onClick={onOverlayClick}
          aria-hidden="true"
        />
      )}

      {/* Slide-in panel */}
      <div
        role="dialog"
        aria-label="Mobile navigation"
        aria-modal={isOpen}
        className={`fixed top-0 right-0 z-[1000] h-full w-[300px] flex flex-col md:hidden transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          background: 'var(--surface-container-high)',
          borderLeft: '1px solid var(--glass-border-color)',
        }}
      >
        {/* Nav accordion */}
        <div className="mobile-inner">
          {navigationItems.map(item => {
            const section = headerDropdownData.sections.find(s => s.title === item);
            return (
              <div key={item} className="mobile-nav-item">
                <button
                  className={`mobile-nav-btn${activeAccordion === item ? ' open' : ''}`}
                  onClick={() => section && onAccordion(item)}
                >
                  {item}
                  {section && <span className="mobile-chevron">&#9660;</span>}
                </button>
                {section && (
                  <div className={`mobile-sub${activeAccordion === item ? ' open' : ''}`}>
                    {section.columns
                      .flatMap(col => col.items)
                      .filter(it => it.label)
                      .map((it, idx) => (
                        <a key={idx} href={it.path ?? '#'} onClick={onLinkClick}>
                          {it.label}
                        </a>
                      ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA buttons + theme toggle */}
        <div className="mobile-actions">
          {!isAdminUser && (
            isAuthenticated ? (
              isClient ? (
                <a href={ROUTES.CLIENT} className="mobile-btn-filled">
                  Admin Panel
                </a>
              ) : (
                <a href={ROUTES.SURVEY_BOARDS} className="mobile-btn-filled">
                  Take a Paid Survey
                </a>
              )
            ) : (
              <>
                <a href={`${ROUTES.LOGIN_IN}?userType=respondent`} className="mobile-btn-outline">
                  Join a Paid Survey
                </a>
                <a href={`${ROUTES.LOGIN_IN}?userType=client`} className="mobile-btn-filled">
                  Login
                </a>
              </>
            )
          )}
          {isAdminUser && (
            <a
              href={isAdminPage ? ROUTES.SURVEY_BOARDS : ROUTES.ADMIN}
              className="mobile-btn-outline"
            >
              {isAdminPage ? 'Survey Boards' : 'Admin Panel'}
            </a>
          )}
          <div className="mobile-theme-row">
            <span className="mobile-theme-label">Switch theme</span>
            <button onClick={onToggleTheme} className="theme-toggle-btn" aria-label="Toggle theme">
              <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
