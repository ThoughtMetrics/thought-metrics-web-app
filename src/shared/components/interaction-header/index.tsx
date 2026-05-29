import React, { useEffect, useState, useRef } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/core/lib/query-client';
import { AuthProvider, useAuth } from '@/shared/providers/auth-provider';
import { Logo } from '@/assets';
import { ROUTES } from '@/routes/routeConfig';
import authService from '@/services/api/auth.service';

const THEME_KEY = 'tm-theme';

const linkCls = 'text-sm font-medium transition-colors hover:underline underline-offset-4';

const InteractionHeaderContent: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, isAdmin } = useAuth();
  const isAuthenticated = !!user;

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY) as 'dark' | 'light' | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem('tm_survey_lock');
      localStorage.removeItem('tm_link_id');
      await authService.signOut();
      window.location.href = ROUTES.HOME;
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="relative h-fit shrink-0">
      <header
        className="relative"
        style={{
          background: 'var(--surface-container-low)',
          borderBottom: '1px solid var(--glass-border-color)',
        }}
      >
        <div className="tm-container">
          <nav className="py-3 flex items-center justify-between w-full">

            {/* Logo */}
            <a href={ROUTES.HOME} className="block w-40">
              <Logo className="w-full h-full" />
            </a>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-6 text-nowrap">
              {!isAdmin && (
                <a href={ROUTES.HOME} className={linkCls} style={{ color: 'var(--on-surface)' }}>Home</a>
              )}
              {!isAdmin && (
                <a href={ROUTES.OUR_PANEL} className={linkCls} style={{ color: 'var(--on-surface)' }}>About Us</a>
              )}
              {isAdmin && (
                <a href="/admin" className={linkCls} style={{ color: 'var(--on-surface)' }}>Admin Panel</a>
              )}
              {isAuthenticated ? (
                <>
                  <a href={ROUTES.EDIT_PROFILE} className={linkCls} style={{ color: 'var(--on-surface)' }}>Edit Profile</a>
                  <button onClick={handleLogout} className={`${linkCls} cursor-pointer`} style={{ color: 'var(--on-surface)' }}>Logout</button>
                </>
              ) : (
                <a href={ROUTES.LOGIN_IN} className="btn-primary text-sm px-6 py-2">Sign In</a>
              )}

              {/* Theme toggle */}
              <button
                onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
                className="theme-toggle-btn"
                aria-label="Toggle theme"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                  {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                </span>
              </button>
            </div>

            {/* Mobile */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
                className="theme-toggle-btn"
                aria-label="Toggle theme"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                  {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                </span>
              </button>

              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-8 h-8 flex flex-col justify-center items-center gap-1.5"
                    aria-label="Toggle menu"
                  >
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="block w-5 h-0.5 transition-all duration-300"
                        style={{ background: 'var(--on-surface)',
                          ...(isDropdownOpen && i === 0 ? { transform: 'rotate(45deg) translateY(8px)' } : {}),
                          ...(isDropdownOpen && i === 1 ? { opacity: 0 } : {}),
                          ...(isDropdownOpen && i === 2 ? { transform: 'rotate(-45deg) translateY(-8px)' } : {}),
                        }}
                      />
                    ))}
                  </button>
                  {isDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-44 rounded-xl py-1 z-50 shadow-2xl border"
                      style={{ background: 'var(--surface-container-low)', borderColor: 'var(--glass-border-color)' }}
                    >
                      <a href={ROUTES.EDIT_PROFILE} onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2.5 text-sm transition-colors"
                        style={{ color: 'var(--on-surface-variant)' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--surface-container)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ''; }}
                      >Edit Profile</a>
                      {isAdmin && (
                        <a href="/admin" onClick={() => setIsDropdownOpen(false)}
                          className="block px-4 py-2.5 text-sm transition-colors"
                          style={{ color: 'var(--on-surface-variant)' }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--surface-container)'; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ''; }}
                        >Admin Panel</a>
                      )}
                      <button
                        onClick={() => { setIsDropdownOpen(false); handleLogout(); }}
                        className="block w-full text-left px-4 py-2.5 text-sm transition-colors"
                        style={{ color: 'var(--on-surface-variant)' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--surface-container)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ''; }}
                      >Logout</button>
                    </div>
                  )}
                </div>
              ) : (
                <a href={ROUTES.LOGIN_IN} className="btn-primary text-sm px-4 py-1.5">Sign In</a>
              )}
            </div>
          </nav>
        </div>
      </header>
    </div>
  );
};

const InteractionHeader: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <InteractionHeaderContent />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default InteractionHeader;
