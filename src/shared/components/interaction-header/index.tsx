import React, { useEffect, useState, useRef } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/core/lib/query-client';
import { AuthProvider, useAuth } from '@/shared/providers/auth-provider';
import { ArrowRed, Logo } from '@/assets';
import { ROUTES } from '@/routes/routeConfig';
import authService from '@/services/api/auth.service';

const InteractionHeaderContent: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, isAdmin } = useAuth();

  // Derive isAuthenticated from user object
  const isAuthenticated = !!user;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await authService.signOut();
      window.location.href = ROUTES.HOME;
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="relative">
      <header className="common-component bg-white">
        <div className="common-container justify-center max-w-(--breakpoint-2xl)!">
          <nav className="px-6 py-3 xxl:px-0 flex items-center justify-between w-full">
            <a href={ROUTES.HOME}>
              <div className="w-45 pt-1">
                <Logo className="w-full h-full" />
              </div>
            </a>
            <div className="hidden md:flex items-center gap-8 text-nowrap">
              {!isAdmin && (
                <a
                  href={ROUTES.HOME}
                  className="text-black font-medium hover:underline underline-offset-4"
                >
                  Home
                </a>
              )}
              {!isAdmin && (
                <a
                  href={ROUTES.OUR_PANEL}
                  className="text-black font-medium hover:underline underline-offset-4"
                >
                  About Us
                </a>
              )}
              {isAdmin && (
                <a
                  href="/admin"
                  className="text-black font-medium hover:underline underline-offset-4"
                >
                  Admin Panel
                </a>
              )}
              {isAuthenticated ? (
                <>
                  <a
                    href={ROUTES.EDIT_PROFILE}
                    className="text-black font-medium hover:underline underline-offset-4"
                  >
                    Edit Profile
                  </a>
                  <button
                    onClick={handleLogout}
                    className="text-black font-medium hover:underline underline-offset-4"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <a href={ROUTES.LOGIN_IN}>
                  <button className="bg-primary text-white text-nowrap w-auto hover:bg-secondary hover:text-white transition-all duration-300 ease-in-out rounded font-medium text-sm md:text-lg px-8 py-1 flex items-center gap-4">
                    <label>Sign In</label>
                    <ArrowRed className="fill-current text-white" />
                  </button>
                </a>
              )}
            </div>
            {isAuthenticated ? (
              <div className="md:hidden relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="relative w-8 h-8 flex flex-col justify-center items-center z-1001"
                  aria-label="Toggle menu"
                >
                  <span
                    className={`block w-6 h-0.5  transition-all duration-300 ease-in-out ${
                      isDropdownOpen
                        ? 'rotate-45 translate-y-1.5 bg-black'
                        : 'bg-gray-800'
                    }`}
                  />
                  <span
                    className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ease-in-out my-1 ${
                      isDropdownOpen ? 'opacity-0' : ''
                    }`}
                  />
                  <span
                    className={`block w-6 h-0.5 transition-all duration-300 ease-in-out ${
                      isDropdownOpen
                        ? '-rotate-45 -translate-y-1.5 bg-black'
                        : 'bg-gray-800'
                    }`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-1000 border border-gray-200">
                    <a
                      href={ROUTES.EDIT_PROFILE}
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Edit Profile
                    </a>
                    {isAdmin && (
                      <a
                        href="/admin"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Admin Panel
                      </a>
                    )}
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="md:hidden bg-primary text-white text-nowrap w-auto hover:bg-secondary hover:text-white transition-all duration-300 ease-in-out rounded font-medium px-6 py-1 flex items-center gap-3">
                <a href={ROUTES.LOGIN_IN}>
                  <label>Sign In</label>
                </a>
                <ArrowRed className="fill-current text-white" />
              </button>
            )}
          </nav>
        </div>
      </header>
    </div>
  );
};

/**
 * InteractionHeader - Separate Astro Island with its own providers
 *
 * IMPORTANT: Has its own AuthProvider because it's rendered as client:only="react"
 * in IntractionLayout.astro, making it a separate island.
 */
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
