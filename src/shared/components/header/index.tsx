import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/core/lib/query-client';
import { AuthProvider, useAuth } from '@/shared/providers/auth-provider';
import { Logo } from '@/assets';
import { ROUTES } from '@/routes/routeConfig';
import type { AuthContext } from './header.constant';
import { useHeaderTheme } from './use-header-theme';
import { useDropdown } from './use-dropdown';
import { useMobileMenu } from './use-mobile-menu';
import { NavButtons, DesktopActions, MegaDropdown } from './nav-desktop';
import { Hamburger, NavMobile } from './nav-mobile';

function getActivePage(path: string): string | null {
  if (path.startsWith('/research-methods')) return 'Research Methods';
  if (path.startsWith('/capabilities'))     return 'Capabilities';
  if (path.startsWith('/industries'))       return 'Industries';
  if (path.startsWith('/resources') || path === '/our-panel' || path === '/respondent-landing')
    return 'Resources';
  return null;
}

const HeaderContent: React.FC = () => {
  const { isAdmin, isSuperAdmin, isFieldIncharge, user } = useAuth();
  const { theme, toggle: toggleTheme } = useHeaderTheme();
  const dropdown = useDropdown();
  const mobile = useMobileMenu();

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const activePage = getActivePage(currentPath);
  const auth: AuthContext = {
    isAuthenticated:  !!user,
    isAdminUser:      isAdmin || isSuperAdmin || isFieldIncharge,
    isAdminPage:      currentPath.startsWith('/admin'),
    isSurveyBoardsPage: currentPath.startsWith('/survey-boards'),
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">

      {/* Glass nav bar */}
      <nav className="glass-nav w-full">
        <div className="tm-container flex justify-between items-center py-[10px]">

          <a href={ROUTES.HOME} className="flex-shrink-0 mr-2" aria-label="ThoughtMetrics home">
            <Logo className="w-36" />
          </a>

          <NavButtons
            activeDropdown={dropdown.activeDropdown}
            activePage={activePage}
            onHover={dropdown.open}
            onLeave={dropdown.startClose}
          />

          <DesktopActions
            auth={auth}
            theme={theme}
            onToggleTheme={toggleTheme}
          />

          <Hamburger isOpen={mobile.isOpen} onClick={mobile.toggle} />

        </div>
      </nav>

      {/* Desktop mega dropdown — shown only when a nav item is active */}
      {dropdown.isOpen && (
        <MegaDropdown
          section={dropdown.activeSection}
          onEnter={dropdown.cancelClose}
          onLeave={dropdown.close}
          onLinkClick={dropdown.close}
        />
      )}

      {/* Mobile overlay + slide-in panel */}
      <NavMobile
        isOpen={mobile.isOpen}
        activeAccordion={mobile.activeAccordion}
        onAccordion={mobile.onAccordion}
        onLinkClick={mobile.close}
        onOverlayClick={mobile.toggle}
        auth={auth}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

    </div>
  );
};

const Header: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <HeaderContent />
    </AuthProvider>
  </QueryClientProvider>
);

export default Header;
