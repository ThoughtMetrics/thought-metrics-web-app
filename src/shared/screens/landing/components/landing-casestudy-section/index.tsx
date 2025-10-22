import { cn } from '@/core/utils/cn';
import CustomImageAtom from '@/shared/ui/atoms/custom-image';

const LandingCaseStudySection: React.FC<any> = ({
  questionarySection,
  className,
  imgClassName,
}: any) => {
  return (
    <section className="common-component relative bg-white text-black">
      <div
        className={cn(
          'common-container px-6 pt-14 pb-8 md:px-24 md:py-24 !max-w-[1336px] !grid grid-cols-1 md:grid-cols-[50%_48%] gap-[2%] items-end justify-between',
          className
        )}
      >
        <div className="w-full flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <h2 className="text-xl xl:text-3xl xxl:text-4xl font-semibold">
              <span>{questionarySection.label}</span>
            </h2>
            <ul
              className={cn(
                'text-md md:text-base space-y-4 tracking-tight',
                className
              )}
            >
              {questionarySection.list.map((value: string, index: number) => {
                return (
                  <p key={value + index} className="leading-4.5">
                    {value}
                  </p>
                );
              })}
            </ul>
          </div>
          <CustomImageAtom
            src={questionarySection.illustration.img}
            size={questionarySection.illustration.size}
            rounded={questionarySection.illustration.rounded}
            aspectRatio={questionarySection.illustration.aspectRatio}
            objectFit={questionarySection.illustration.objectFit}
            loading={questionarySection.illustration.loading}
            className={cn('md:hidden', imgClassName)}
          />
          <div className="flex flex-col gap-3">
            <label className="font-semibold text-xl md:text-2xl xl:text-3xl wide:text-4xl">
              {questionarySection.subContent.label}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-x-8 gap-y-4">
              {questionarySection.subContent.items.map(
                (item: any, index: number) => {
                  return (
                    <div
                      key={index + item.label}
                      className="flex flex-col w-full"
                    >
                      <div className="shrink-0 w-[3rem] h-[3rem] md:w-[3.75rem] md:h-[3.75rem] rounded-full flex items-center justify-center overflow-hidden p-2 md:p-3">
                        <item.icon className="w-full h-full xl:h-11 xl:w-11 xxl:w-12 xxl:h-12 fill-current text-black" />
                      </div>
                      <div className="flex flex-col">
                        <label className="font-semibold text-md md:text-base">
                          {item.label}
                        </label>
                        <p className="text-sm md:text-md">{item.description}</p>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
        <CustomImageAtom
          src={questionarySection.illustration.img}
          size={questionarySection.illustration.size}
          rounded={questionarySection.illustration.rounded}
          aspectRatio={questionarySection.illustration.aspectRatio}
          objectFit={questionarySection.illustration.objectFit}
          loading={questionarySection.illustration.loading}
          className="w-full hidden md:block !max-h-[45rem] wide:!max-h-[52rem]"
        />
      </div>
    </section>
  );
};

export default LandingCaseStudySection;
