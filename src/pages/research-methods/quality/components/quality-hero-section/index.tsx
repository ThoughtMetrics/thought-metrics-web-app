import { cn } from '@/core/utils/cn';
import './quality-hero-section.css';
import { PageTitle } from '@/shared/components/page-title';

const QualityHeroSection: React.FC<any> = ({
  heroSection,
  contentClassName,
  titleClassName,
}: any) => {
  return (
    <section className="common-component w-full h-full relative quality-hero-component">
      <div className="absolute top-0 w-full h-full flex justify-end pt-14 md:pt-6">
        <div className="w-[12rem] h-[14rem] md:w-fit md:h-fit">
          <heroSection.illustrationComponent className="w-full h-full" />
        </div>
      </div>
      <div className="z-1 common-container flex-col justify-start h-fit !max-w-[var(--breakpoint-2xl)] px-6 md:px-24 text-black">
        <div
          className={cn(
            'shrink-0 md:w-[43%] xxl:w-[37%] wide:w-[50%] h-full flex flex-col gap-3 justify-center',
            contentClassName
          )}
        >
          <div className="h-[18rem] md:h-18"></div>
          <PageTitle />
          <h1
            className={cn(
              'w-[80%] md:w-[95%] wide:w-[80%] text-2xl md:text-4xl font-medium',
              titleClassName
            )}
          >
            {heroSection.title}
          </h1>
          <p className="w-full wide:w-[80%] text-md md:text-base">
            {heroSection.description}
          </p>
        </div>
        <div className="shrink-0 grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-y-6 md:gap-y-12 py-12 md:py-24">
          {heroSection.items.map((item: any, index: number) => {
            return (
              <div
                key={index + item.label}
                className="flex md:flex-col gap-3 w-full h-full"
              >
                <div className="h-full md:w-full relative">
                  <div className="shrink-0 bg-primary rounded-full w-12 h-12 md:w-14 md:h-14 flex items-center justify-center">
                    <label className="font-bold">{item.sNo}</label>
                    <line
                      className={cn(
                        'hidden absolute -z-1 bg-black h-[1px] w-[110%] left-0 transform -translate-y-1/2',
                        index % 3 !== 2 && 'md:block'
                      )}
                    />
                    <line
                      className={cn(
                        'md:hidden absolute bg-black h-[125%] w-[1px] top-0 -z-1 transform -translate-x-1/2',
                        index === heroSection.items.length - 1 && 'hidden'
                      )}
                    />
                  </div>
                </div>
                <div className="w-[75%] flex flex-col gap-3">
                  <label className="font-semibold text-md md:text-base">
                    {item.label}
                  </label>
                  <p className="text-sm md:text-md">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default QualityHeroSection;
