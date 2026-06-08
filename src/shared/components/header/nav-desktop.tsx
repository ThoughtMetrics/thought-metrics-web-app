import React from 'react';
import { ROUTES } from '@/routes/routeConfig';
import type { AuthContext, NavSection } from './header.constant';
import { navigationItems } from './header.constant';

// ── Desktop nav buttons ────────────────────────────────────────

interface NavButtonsProps {
  activeDropdown: string | null;
  activePage: string | null;
  onHover: (item: string) => void;
  onLeave: () => void;
}

export const NavButtons: React.FC<NavButtonsProps> = ({ activeDropdown, activePage, onHover, onLeave }) => (
  <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
    {navigationItems.map(item => (
      <button
        key={item}
        className={[
          'nav-btn',
          (activeDropdown === item || (!activeDropdown && activePage === item)) ? 'active' : '',
          activeDropdown === item ? 'dropdown-open' : '',
        ].filter(Boolean).join(' ')}
        onMouseEnter={() => onHover(item)}
        onMouseLeave={onLeave}
      >
        {item} <span className="nav-chevron">&#9660;</span>
      </button>
    ))}
  </div>
);

// ── Desktop CTAs + theme toggle ────────────────────────────────

interface DesktopActionsProps {
  auth: AuthContext;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const DesktopActions: React.FC<DesktopActionsProps> = ({ auth, theme, onToggleTheme }) => {
  const { isAuthenticated, isAdminUser, isAdminPage, isSurveyBoardsPage, isClient } = auth;

  return (
    <div className="hidden md:flex items-center gap-2 flex-shrink-0">
      {!isAdminUser && (
        isAuthenticated ? (
          isClient ? (
            <a href={ROUTES.CLIENT} className="btn-hdr-filled">
              Admin Panel
            </a>
          ) : (
            <a href={ROUTES.SURVEY_BOARDS} className="btn-hdr-filled">
              Take a Paid Survey
            </a>
          )
        ) : (
          <>
            <a href={`${ROUTES.LOGIN_IN}?userType=respondent`} className="btn-hdr-outline">
              Join a Paid Survey
            </a>
            <a href={`${ROUTES.LOGIN_IN}?userType=client`} className="btn-hdr-filled">
              Login
            </a>
          </>
        )
      )}
      {isAdminUser && (
        <a
          href={isAdminPage ? ROUTES.SURVEY_BOARDS : ROUTES.ADMIN}
          className="btn-hdr-outline"
        >
          {isAdminPage ? 'Survey Boards' : 'Admin Panel'}
        </a>
      )}
      <button onClick={onToggleTheme} className="theme-toggle-btn" aria-label="Toggle theme">
        <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>
          {theme === 'dark' ? 'light_mode' : 'dark_mode'}
        </span>
      </button>
    </div>
  );
};

// ── Mega dropdown panel ────────────────────────────────────────

interface MegaDropdownProps {
  section: NavSection | undefined;
  onEnter: () => void;
  onLeave: () => void;
  onLinkClick: () => void;
}

export const MegaDropdown: React.FC<MegaDropdownProps> = ({
  section,
  onEnter,
  onLeave,
  onLinkClick,
}) => (
  <div
    className="hdr-dropdown absolute left-0 right-0 z-[999] hidden md:block"
    onMouseEnter={onEnter}
    onMouseLeave={onLeave}
  >
    <div className="mega-inner">
      {section?.columns.map((col, colIdx) => (
        <div key={colIdx} className="mega-col">
          {col.title && <div className="mega-col-title">{col.title}</div>}
          {col.items
            .filter(it => it.label)
            .map((it, itIdx) => (
              <a
                key={itIdx}
                href={it.path ?? '#'}
                className="mega-link"
                onClick={onLinkClick}
              >
                {it.label}
              </a>
            ))}
        </div>
      ))}
    </div>
  </div>
);
