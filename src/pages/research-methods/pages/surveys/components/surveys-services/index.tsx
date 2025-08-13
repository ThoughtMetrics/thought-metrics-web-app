import { cn } from '@/core/utils/cn';
import React from 'react';

const BG_COLORS: Record<string, string> = {
  red: 'bg-primary-lighter',
  green: 'bg-custom-green-light',
  blue: 'bg-custom-blue-light',
};

const SurveyServices: React.FC<any> = ({ serviceSection }) => {
  return (
    <section className="common-component bg-white">
      <div className="common-container px-6 py-8 md:px-24 md:py-12 justify-center flex-col !max-w-[var(--breakpoint-2xl)] text-black">
        <h2 className="md:text-lg xl:text-xl xxl:text-2xl font-semibold leading-[1.25] tracking-normal">
          {serviceSection.head}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
          {serviceSection.services.map((service: any, index: number) => {
            return (
              <div
                key={index + service.title}
                className={cn(
                  'w-full p-8 md:p-12 flex flex-col gap-3',
                  index === 2 && 'md:col-span-2 md:px-12 md:py-18',
                  BG_COLORS[service.bgColor]
                )}
              >
                <label className="font-semibold md:text-lg xl:text-xl xxl:text-2xl">
                  {service.title}
                </label>
                <p className="leading-5 text-sm md:text-md xl:text-base xxl:text-lg">
                  {service.description}
                </p>
                <div
                  className={cn(
                    'flex flex-col gap-6 py-4 md:py-8',
                    index === 2 && 'md:flex-row justify-between gap-8'
                  )}
                >
                  {service.items.map((item: any, serviceIndex: number) => {
                    return (
                      <div className="flex items-center gap-4 md:gap-8">
                        {item.icon && (
                          <div className="w-15 h-15 p-2 rounded-full bg-white/50 flex justify-center items-center">
                            <item.icon className="w-12" />
                          </div>
                        )}
                        <div
                          key={serviceIndex + item.label}
                          className="flex flex-col"
                        >
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
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SurveyServices;
