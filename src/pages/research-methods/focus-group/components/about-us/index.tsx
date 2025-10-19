import { cn } from '@/core/utils/cn';
import CustomImageAtom from '@/shared/ui/atoms/custom-image';

const AboutUsSection: React.FC<any> = ({
  questionarySection,
  className,
  imgClassName,
}: any) => {
  return (
    <section className="common-component w-full h-full relative bg-white text-black">
      <div
        className={cn(
          'common-container px-6 pt-14 pb-8 md:px-24 md:py-24 !max-w-[1336px] !grid grid-cols-1 md:grid-cols-[43%_40%] items-center justify-between',
          className
        )}
      >
        <div className="w-full flex flex-col gap-3">
          <h2 className="flex flex-col gap-2">
            <span className="xl:text-lg xxl:text-xl font-medium leading-5 text-custom-grey-2">
              {questionarySection.header}
            </span>
            <div className="w-25 h-0.5 md:h-1 bg-primary rounded"></div>
          </h2>
          <h2 className="text-xl xl:text-2xl xxl:text-3xl font-semibold leading-[1.25]">
            <span>{questionarySection.title}</span>
          </h2>
          <CustomImageAtom
            src={questionarySection.illustration.img}
            size={questionarySection.illustration.size}
            rounded={questionarySection.illustration.rounded}
            aspectRatio={questionarySection.illustration.aspectRatio}
            objectFit={questionarySection.illustration.objectFit}
            loading={questionarySection.illustration.loading}
            className={cn('md:hidden', imgClassName)}
          />
          <ul
            className={cn(
              'text-base md:text-lg xxl:text-xl space-y-3',
              className
            )}
          >
            {questionarySection.items.map((facilities: any, index: number) => {
              return (
                <li
                  key={index + facilities.label}
                  className="flex items-start leading-7"
                >
                  <span className="mr-3">•</span>
                  <label>
                    <span className="font-semibold">{facilities.label}</span>
                    <span> {facilities.description}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="hidden md:block w-[80%] xxl:w-[90%]">
          <CustomImageAtom
            src={questionarySection.illustration.img}
            size={questionarySection.illustration.size}
            rounded={questionarySection.illustration.rounded}
            aspectRatio={questionarySection.illustration.aspectRatio}
            objectFit={questionarySection.illustration.objectFit}
            loading={questionarySection.illustration.loading}
          />
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
