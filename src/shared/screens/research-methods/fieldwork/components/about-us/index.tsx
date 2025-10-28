import { cn } from '@/core/utils/cn';
import CustomImageAtom from '@/shared/ui/atoms/custom-image';

const AboutUsSection: React.FC<any> = ({
  questionarySection,
  className,
  imgClassName,
}: any) => {
  return (
    <section className="common-component relative bg-white text-black">
      <div
        className={cn(
          'common-container px-6 py-8 md:px-24 md:py-24 max-w-[1336px]! grid! grid-cols-1 md:grid-cols-2 items-center',
          className
        )}
      >
        <div className="w-full flex flex-col gap-3">
          <h2 className="flex flex-col gap-2">
            <span className='xl:text-lg xxl:text-xl font-medium leading-5 text-custom-grey-2'>{questionarySection.header}</span>
            <div className="w-25 h-0.5 md:h-1 bg-primary rounded"></div>
          </h2>
          <h2 className="w-[80%] md:w-[60%] text-xl xl:text-2xl xxl:text-3xl font-semibold leading-tight">
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
          <p
            className="md:w-[90%] xl:text-lg xxl:text-xl *:pt-2"
            dangerouslySetInnerHTML={{
              __html: questionarySection.description,
            }}
          />
          <ul className={cn('text-base md:text-xl', className)}>
            {questionarySection.list.map((question: string, index: number) => {
              return (
                <li key={index + question} className="flex items-start">
                  <span className="mr-3">•</span>
                  <span>{question}</span>
                </li>
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
          className={cn('hidden md:block', imgClassName)}
        />
      </div>
    </section>
  );
};

export default AboutUsSection;
