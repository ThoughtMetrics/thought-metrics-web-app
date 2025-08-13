import React from 'react';
import './surveys-feature.css';
import { ArrowRed } from '@/assets';
import { cn } from '@/core/utils/cn';

const SurveyFeature: React.FC<any> = ({ featureSection }) => {
  return (
    <section className="common-component survey-feature-component">
      <div className="common-container px-6 py-8 md:px-24 md:py-12 justify-center flex-col !max-w-[var(--breakpoint-2xl)] text-black">
        <h2 className="md:text-lg xl:text-xl xxl:text-2xl font-semibold leading-[1.25] tracking-normal">
          {featureSection.title}
        </h2>
        <div className="grid grid-flow-row md:grid-flow-col gap-8 pt-8">
          {featureSection.items.map((item: any, serviceIndex: number) => {
            return (
              <div
                className={cn('flex', 'md:gap-4 md:flex-col', 'gap-3 flex-row')}
              >
                {item.icon && (
                  <div
                    className={cn(
                      'w-full flex gap-2 items-center',
                      'flex-col',
                      'md:h-12 md:flex-row'
                    )}
                  >
                    <item.icon className="h-12 w-15" />
                    {serviceIndex !== featureSection.items.length - 1 && (
                      <>
                        <div className="hidden md:block relative w-full">
                          <line className="absolute bg-black h-0.25 w-full right-0 transform -translate-y-1/2" />
                          <ArrowRed className="absolute w-fit h-3 fill-current text-black right-0 transform -translate-y-1/2" />
                        </div>
                        <div className="md:hidden relative bg-black h-full">
                          <line className="absolute bg-black h-full w-0.25 transform bottom-0 -translate-x-1/2" />
                          <ArrowRed className="absolute rotate-90 h-3 fill-current text-black -bottom-1 transform -translate-x-1/2" />
                        </div>
                      </>
                    )}
                  </div>
                )}
                <div key={serviceIndex + item.label} className="flex flex-col">
                  <label className="font-medium text-sm md:text-md xl:text-base xxl:text-lg">
                    {item.label}
                  </label>
                  <p className="leading-5 text-xs md:text-sm xl:text-md xxl:text-base">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SurveyFeature;
