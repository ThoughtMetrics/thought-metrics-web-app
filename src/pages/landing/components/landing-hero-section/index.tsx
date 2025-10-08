import { IllustrationSquares2 } from '@/assets';
import CustomButtonAtom from '@/shared/ui/atoms/custom-button';
import type React from 'react';
import '../../landing.style.css';
import { useEffect, useState } from 'react';
import { auth } from '@/core/configs/firebase-config';

const LandingHeroSection: React.FC<any> = ({ heroSection, faqId }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);
  return (
    <section className="common-component w-full h-full relative md:pt-0 landing_hero_section">
      <div className="absolute top-0 w-full h-full bg-primary/65" />
      <div className="hidden md:flex absolute w-full h-[95%] justify-end top-1/2 transform -translate-y-1/2">
        <IllustrationSquares2 className="h-full w-auto stroke-1 stroke-primary" />
      </div>
      <div className="z-1 common-container w-full !max-w-[var(--breakpoint-2xl)] md:min-h-[480px] xl:min-h-[580px] wide:min-h-[780px] items-center p-5 md:p-10 xxl:p-0 relative">
        <div className="md:hidden absolute w-full h-[95%] flex justify-end top-1/2 transform -translate-y-1/2">
          <IllustrationSquares2 className="h-full w-auto stroke-1.75 stroke-primary" />
        </div>
        <div className="md:w-[43%] xxl:w-[50%] h-full flex flex-col gap-10 justify-center">
          <div className="flex flex-col gap-6 text-white">
            <div className="flex flex-col gap-4">
              <h2 className="flex flex-col gap-2">
                <span className="text-sm md:text-base">{heroSection.head}</span>
                <div className="w-45 h-0.25 md:h-0.5 bg-white rounded"></div>
              </h2>
              <p className="md:w-[83.5%] text-3xl md:text-5xl font-semibold">
                {heroSection.label}
              </p>
            </div>
            <p className="w-full text-lg xl:text-[1.3rem] wide:text-lg font-semibold">
              {heroSection.description}
            </p>
          </div>
          <div className="flex gap-5 w-[90%] md:w-[85%] z-1">
            <div className="max-w-[13rem] w-full">
              <CustomButtonAtom
                path={
                  isAuthenticated
                    ? heroSection.signButton.signedInPath
                    : heroSection.signButton.path
                }
                className="font-semibold py-1 xl:py-2 px-6 text-lg xl:text-xl bg-secondary hover:bg-custom-blue w-full"
                label={
                  isAuthenticated
                    ? heroSection.signButton.signedInLabel
                    : heroSection.signButton.label
                }
              />
            </div>
            {heroSection.faqButton && (
              <a href={`#${faqId}`} className="w-full max-w-[13rem]">
                <button className="rounded-md text-nowrap px-6 hover:text-white transition-all duration-300 ease-in-out font-semibold py-1 xl:py-2 text-lg xl:text-xl border-secondary bg-white text-secondary hover:bg-custom-blue w-full border-2">
                  {heroSection.faqButton.label}
                </button>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHeroSection;
