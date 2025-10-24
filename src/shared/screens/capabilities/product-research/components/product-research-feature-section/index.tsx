import { cn } from '@/core/utils/cn';

const ProductResearchFeatureSection: React.FC<any> = ({
  featureSection,
  className,
  featureClassName,
}: any) => {
  return (
    <section className="common-component relative brand-ad-component text-black">
      <div
        className={cn(
          'common-container relative px-6 py-8 md:px-24 md:py-24 !max-w-[1336px] flex-col gap-12 z-10',
          className
        )}
      >
        <div className="flex items-end relative">
          <div className="w-full md:w-[50%] text-xl md:text-3xl font-semibold leading-tight relative">
            <p
              className="text-wrap"
              dangerouslySetInnerHTML={{
                __html: featureSection.title,
              }}
            />
          </div>
          <div className="hidden md:block bg-black h-0.5 w-full mb-1 -z-2"></div>
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-8 md:gap-y-5">
          {featureSection.items.map((feature: any, index: number) => (
            <div
              className={cn('grid grid-cols-[25%_73%] md:grid-cols-[15%_84%]', featureClassName)}
              key={index + feature.title}
            >
              <div className="w-[3.5rem] h-[3.5rem] md:w-[4.25rem] md:h-[4.25rem] bg-primary/20 rounded-full flex items-center justify-center overflow-hidden p-4">
                <feature.icon className="w-full h-full xl:h-11 xl:w-11 xxl:w-12 xxl:h-12 fill-current text-black" />
              </div>
              <div className="w-full flex flex-col text-sm md:text-base">
                <label htmlFor={index + feature.title} className="font-bold">
                  {feature.title}
                </label>
                <p className='indent-1'>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductResearchFeatureSection;
