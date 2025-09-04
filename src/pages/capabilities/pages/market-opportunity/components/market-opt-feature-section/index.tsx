import { ArrowRed, MarketOptFeatureIllustration } from '@/assets';
import { cn } from '@/core/utils/cn';
import { MarketOptFeatureCard } from '@/shared/ui/molecules/feature-card';
const MarketOptFeatureSection: React.FC<any> = ({
  featureSection,
  className,
  cardClassName,
}: any) => {
  return (
    <section className="common-component w-full h-full relative brand-ad-component">
      <div className="common-container relative px-6 py-8 md:px-24 md:py-24 !max-w-[1336px] flex-col gap-12 z-10">
        <div className="flex items-end gap-2 relative">
          <h2 className="w-[85%] md:w-auto text-xl md:text-3xl font-semibold text-black leading-tight text-wrap md:text-nowrap relative">
            {featureSection.title}
          </h2>
          <div className="hidden md:block bg-black h-0.5 w-full mb-1 -z-2"></div>
        </div>
        {/* Desktop view */}
        <div
          className={cn(
            'hidden md:grid grid-cols-1 grid-rows-3 gap-14 md:gap-6',
            className
          )}
        >
          {featureSection.items.map((subitem: any, rowIndex: number) => (
            <div className="grid grid-cols-3 grid-rows-1 gap-6 relative">
              {subitem.map((feature: any, colIndex: number) => (
                <div className="relative w-full h-full z-1 md:px-10 md:py-6">
                  <div className="flex items-center">
                    {feature.isArrow && (
                      <ArrowRed className="w-3 h-4 fill-current text-black" />
                    )}
                    <MarketOptFeatureCard
                      feature={feature}
                      index={rowIndex + colIndex}
                      className={cardClassName}
                    />
                  </div>
                  {colIndex !== subitem.length - 1 && (
                    <line className="absolute w-28 bg-black h-0.25 -right-18 top-1/2" />
                  )}
                </div>
              ))}
              {rowIndex !== featureSection.items.length - 1 && (
                <line className="absolute w-[65%] md:w-[95%] bg-black h-0.25 left-1/2 -bottom-7.5 md:-bottom-3 transform -translate-x-1/2" />
              )}
              {rowIndex !== featureSection.items.length - 1 && (
                <div className="hidden md:block absolute -bottom-[.78rem] right-0">
                  <div className="relative w-10 h-16.5 rounded-tr-xl rounded-br-xl border-y-1 border-r-1 border-black"></div>
                </div>
              )}
              {rowIndex !== 0 && (
                <div className="hidden md:block absolute -top-[.78rem] left-0">
                  <div className="relative w-11.5 h-16.5 border-black border-y-1 border-l-1 rounded-tl-xl rounded-bl-xl"></div>
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Mobile View */}
        <div className="">
          <MarketOptFeatureIllustration className="md:hidden w-full" />
        </div>
      </div>
    </section>
  );
};

export default MarketOptFeatureSection;
