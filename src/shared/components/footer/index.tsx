import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/core/lib/query-client';
import { AuthProvider, useAuth } from '@/shared/providers/auth-provider';
import { footerData } from './footer.constant';
import { LogoWhite } from '@/assets';
import { ROUTES } from '@/routes/routeConfig';

const FooterContent: React.FC = () => {
  const { user } = useAuth();
  // Derive isAuthenticated from user object
  const isAuthenticated = !!user;

  const scrollToTop = () => {
    const rootElement = document.getElementById('full-screen');

    if (rootElement) {
      rootElement.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <footer className="common-component bg-primary text-white relative">
      <div className="common-container flex-col px-6 pt-8 md:px-24 max-w-(--breakpoint-xxl)! items-center w-fit">
        {/* Navigation */}
        <div className="w-full h-full md:flex justify-between grid grid-cols-2 gap-2 md:text-base xxl:text-xl pb-4">
          {/* Brand Section */}
          <div className="col-span-2 w-45 wide:w-48 gap-1 xxl:gap-2 wide:gap-3 flex flex-col md:pb-auto mb-4 md:mb-0 md:mt-4 mr-6">
            <a href={ROUTES.HOME}>
              <LogoWhite className="w-full" />
            </a>
            <div className="flex justify-between">
              {footerData.socialLinks.map((social) => (
                <a
                  href={social.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={social.name}
                >
                  <social.icon className="w-10 wide:w-12" />
                  {/* <img
                    key={social.name}
                    src={social.icon}
                    alt={social.name}
                    className="w-10 wide:w-12"
                  /> */}
                </a>
              ))}
            </div>
          </div>
          {footerData.sections.map((section) => (
            <nav key={section.title} className="flex flex-col gap-1">
              <h4 className="font-semibold m-0">{section.title}</h4>
              <ul className="list-none p-0 m-0 flex flex-col gap-1 xl:gap-1 xxl:gap-1.5 wide:gap-2">
                {section.links.map((link, index) => {
                  let routePath =
                    isAuthenticated && link.label == 'Join Our Panel'
                      ? link.signedInPath
                      : link.path;
                  routePath = routePath ?? '#';
                  return (
                    <li key={link.label}>
                      <a
                        key={index + link.label}
                        href={routePath}
                        className="text-sm md:text-base xxl:text-xl hover:underline cursor-pointer"
                      >
                        {isAuthenticated && link.label == 'Join Our Panel'
                          ? link.signedInLabel
                          : link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          ))}
        </div>
        {/* Divider */}
        <div className="absolute left-0 bottom-10 md:bottom-12 bg-white h-px w-full" />
        {/* Bottom Section */}
        <div className="w-full h-10 md:h-12 flex items-center justify-between">
          <p className="text-sm md:text-base xl:text-xl opacity-80 mb-0.5 md:mb-1">
            {footerData.copyright}
          </p>
          <button
            className="self-end w-14 h-8 md:w-16 wide:h-10 bg-white/50 rounded-t-md flex justify-center items-end cursor-pointer"
            onClick={scrollToTop}
            aria-label="Back to top"
          >
            <footerData.backToTopIcon className="w-6 wide:w-10 mb-1.5 md:mb-1 brightness-1 invert" />
          </button>
        </div>
        {/* <div className="py-3 px-6 md:px-28 xxl:px-60 wide:px-90">
        </div> */}
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