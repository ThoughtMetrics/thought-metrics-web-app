import { IllustrationSquares } from '@/assets';
import { cn } from '@/core/utils/cn';

const ContentHeroSection: React.FC<any> = ({
  heroSection,
  contentClassName,
  titleClassName,
}: any) => {
  return (
    <section className="common-component w-full h-full relative bg-[url('/images/blog_background_image.png')] bg-cover bg-center">
      {/* Opacity overlay */}
      <div className="absolute inset-0 bg-white opacity-50"></div>

      <div className="absolute w-full h-full flex justify-end pt-10 md:p-0 z-10">
        <IllustrationSquares className="h-[17rem] md:h-[98%] w-auto stroke-2 md:stroke-1 stroke-white" />
      </div>
      <div className="hidden md:flex absolute w-full h-full justify-end pt-18 md:pt-0 md:items-center z-10"></div>
      <div className="relative z-20 common-container w-full !max-w-[var(--breakpoint-2xl)] md:min-h-[480px] xl:min-h-[580px] wide:min-h-[780px] items-center p-5 pb-8 md:py-10 md:px-24">
        <div
          className={cn(
            'md:w-[43%] xxl:w-[43%] wide:w-[50%] h-full flex flex-col gap-3 justify-center',
            contentClassName
          )}
        >
          <h1
            className={cn(
              'w-[80%] text-white text-2xl xl:text-[2.5rem] wide:text-[3rem] font-semibold pt-8 md:pt-0',
              titleClassName
            )}
          >
            {heroSection.title}
          </h1>
          <p className="w-full text-white text-lg xl:text-[1.3rem] wide:text-[1.7rem]">
            {heroSection.description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContentHeroSection;
