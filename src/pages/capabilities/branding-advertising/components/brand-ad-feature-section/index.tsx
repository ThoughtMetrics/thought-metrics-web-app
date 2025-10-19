import { IllustrationSquares1 } from '@/assets';
import { cn } from '@/core/utils/cn';
import { BrandAdFeatureCard } from '@/shared/ui/molecules/feature-card';

const BrandAdFeatureSection: React.FC<any> = ({
  featureSection,
  className,
  cardClassName,
}: any) => {
  return (
    <section className="common-component w-full h-full relative bg-primary text-black brand-ad-component">
      <div className="hidden md:flex absolute xl:w-[10rem] xxl:w-[11rem] wide:w-[13rem] h-fit justify-start items-center md:p-0 z-1 left-0 top-1/2 transform -translate-y-1/2">
        <IllustrationSquares1 className="h-full w-full stroke-2 md:stroke-1 stroke-primary" />
      </div>
      <div className="common-container relative px-6 py-8 md:px-24 md:py-24 !max-w-[1336px] flex-col gap-3 md:gap-12 z-10">
        <div className="flex items-end gap-2 relative">
          <h2 className="text-xl md:text-3xl font-semibold leading-tight md:text-nowrap relative">
            {featureSection.title}
          </h2>
          <div className="hidden md:block bg-black h-0.5 w-full mb-1 -z-2"></div>
        </div>
        {/* Desktop view */}
        <div className="brand-ad-component flex">
          <div
            className={cn(
              'hidden md:grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 relative',
              className
            )}
          >
            {featureSection.items.map((feature: any, index: number) => (
              <BrandAdFeatureCard
                feature={feature}
                index={index}
                className={cn(
                  'px-7 py-6 bg-primary/20 text-black hover:shadow-xl transition-shadow duration-300',
                  index === featureSection.items.length - 1 && 'bg-primary',
                  cardClassName
                )}
              />
            ))}
          </div>
        </div>
        {/* Mobile view */}
        <div
          className={cn(
            'md:hidden flex flex-nowrap shrink-0 overflow-x-scroll hide-scrollbar gap-6',
            className
          )}
        >
          {featureSection.items.map((feature: any, index: number) => (
            <BrandAdFeatureCard
              feature={feature}
              index={index}
              className={cn(
                'px-5 py-4 shrink-0 w-[65%] bg-primary/20 text-black',
                index === featureSection.items.length - 1 && 'bg-primary',
                cardClassName
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandAdFeatureSection;
