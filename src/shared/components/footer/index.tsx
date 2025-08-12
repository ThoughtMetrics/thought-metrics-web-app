import React from 'react';
import { footerData } from './footer.constant';
import { LogoWhite } from '@/assets';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    const rootElement = document.getElementById('root');

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
    <footer className="common-component bg-primary pb-12 xl:pb-16 pt-4 xl:pt-6 xxl:pt-8 wide:pt-10 text-white relative">
      <div className="common-container justify-center px-6 flex-col md:flex-row gap-6 xl:gap-8 xxl:gap-10">
        {/* Brand Section */}
        <div className="w-45 wide:w-48 gap-1 xxl:gap-2 wide:gap-3 flex flex-col md:pb-auto">
          <LogoWhite className="w-full" />
          <div className="flex justify-between">
            {footerData.socialLinks.map((social) => (
              <img
                key={social.name}
                src={social.icon}
                alt={social.name}
                className="w-10 wide:w-12"
              />
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-2 md:flex gap-2 xxl:gap-3 wide:gap-4 text-md xxl:text-base wide:text-lg">
          {footerData.sections.map((section) => (
            <nav key={section.title} className="flex flex-col gap-1">
              <h4 className="font-semibold m-0">{section.title}</h4>
              <ul className="list-none p-0 m-0 flex flex-col gap-1 xl:gap-1 xxl:gap-1.5 wide:gap-2">
                {section.links.map((link, index) => (
                  <li key={link.label}>
                    <Link
                      viewTransition={true}
                      key={index + link.label}
                      to={'path' in link ? link.path : '#'}
                      className="text-xxs xl:text-sm xxl:text-lg hover:underline cursor-pointer tracking-wider"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="common-component absolute w-full bottom-0 left-0">
          <div className="relative common-container !justify-start overflow-hidden border-t border-white py-3 px-6 md:px-28 xxl:px-60 wide:px-90">
            <p className="text-xs xxl:text-sm wide:text-base opacity-80 m-0">
              {footerData.copyright}
            </p>
            <button
              className="w-14 h-10 wide:w-15 wide:h-11 bg-white/50 border-none rounded-md flex justify-center cursor-pointer absolute bottom-[-6px] right-8 md:right-21 xxl:right-50 wide:right-92"
              onClick={scrollToTop}
              aria-label="Back to top"
            >
              <img
                src={footerData.backToTopIcon}
                alt="Back to top"
                className="w-6 wide:w-10 brightness-1 invert"
              />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
