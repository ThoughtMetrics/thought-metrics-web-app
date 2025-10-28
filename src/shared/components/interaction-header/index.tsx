import React, { useEffect, useState, useRef } from 'react';
import { ArrowRed, Logo } from '@/assets';
import { ROUTES } from '@/routes/routeConfig';
import { auth } from '@/core/configs/firebase-config';
import authService from '@/services/api/auth.service';

const InteractionHeader: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only set up auth listener on client-side
    if (typeof window === 'undefined') {
      return;
    }

    // Check if auth is available (will be null/undefined during SSR or if Firebase failed to init)
    if (!auth || typeof auth.onAuthStateChanged !== 'function') {
      console.warn('Firebase auth not available in InteractionHeader');
      return;
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

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
              <a
                href={ROUTES.HOME}
                className="text-black font-medium hover:underline underline-offset-4"
              >
                Home
              </a>
              <a
                href={ROUTES.OUR_PANEL}
                className="text-black font-medium hover:underline underline-offset-4"
              >
                About Us
              </a>
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
                <button className="bg-primary text-white text-nowrap w-auto hover:bg-secondary hover:text-white transition-all duration-300 ease-in-out rounded font-medium text-sm md:text-lg px-8 py-1 flex items-center gap-4">
                  <a href={ROUTES.LOGIN_IN}>
                    <label>Sign In</label>
                  </a>
                  <ArrowRed className="fill-current text-white" />
                </button>
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

export default InteractionHeader;
