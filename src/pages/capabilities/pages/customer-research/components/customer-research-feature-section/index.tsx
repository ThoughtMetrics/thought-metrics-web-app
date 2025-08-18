import { cn } from '@/core/utils/cn';
import { BrandAdFeatureCard } from '@/shared/ui/molecules/feature-card';

const CustomerResearchFeatureSection: React.FC<any> = ({
  featureSection,
  className,
  featureClassName,
}: any) => {
  return (
    <section className="common-component w-full h-full relative text-black brand-ad-component">
      <div
        className={cn(
          'common-container relative px-6 py-8 md:px-24 md:py-24 !max-w-[1336px] flex-col gap-12 z-10',
          className
        )}
      >
        <div className="flex items-end gap-2 relative">
          <div className="w-fit text-xl md:text-3xl font-semibold leading-tight relative">
            <p
              className="text-nowrap"
              dangerouslySetInnerHTML={{
                __html: featureSection.title,
              }}
            />
          </div>
          <div className="hidden md:block bg-black h-0.5 w-full mb-1 -z-2"></div>
        </div>

        {/* Desktop view */}
        <div
          className={cn(
            'hidden md:grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8',
            className
          )}
        >
          {featureSection.items.map((feature: any, index: number) => (
            <BrandAdFeatureCard
              feature={feature}
              index={index}
              className={cn('px-7 py-8', featureClassName)}
              contentClassName="md:gap-16 xl:gap-16 xxl:gap-16"
            />
          ))}
        </div>
        {/* Mobile view */}
        <div
          className={cn(
            'md:hidden flex flex-nowrap shrink-0 overflow-x-scroll hide-scrollbar gap-8',
            className
          )}
        >
          {featureSection.items.map((feature: any, index: number) => (
            <BrandAdFeatureCard
              feature={feature}
              index={index}
              className={cn('px-5 py-6 shrink-0 w-[65%]', featureClassName)}
              contentClassName="gap-14"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerResearchFeatureSection;
