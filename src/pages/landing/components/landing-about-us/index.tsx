import { cn } from '@/core/utils/cn';
import CustomButtonAtom from '@/shared/ui/atoms/custom-button';
import CustomImageAtom from '@/shared/ui/atoms/custom-image';
import './landing-about-us.css';

const LandingAboutUsSection: React.FC<any> = ({
  aboutUsSection,
  className,
  imgClassName,
}: any) => {
  return (
    <section className="common-component w-full h-full relative text-black landing-about-us-section">
      <div
        className={cn(
          'common-container px-6 pt-14 pb-8 md:px-24 md:py-24 !max-w-[1336px] !grid grid-cols-1 md:grid-cols-[50%_50%] gap-8 items-center justify-between',
          className
        )}
      >
        <CustomImageAtom
          src={aboutUsSection.illustration.img}
          size={aboutUsSection.illustration.size}
          rounded={aboutUsSection.illustration.rounded}
          aspectRatio={aboutUsSection.illustration.aspectRatio}
          objectFit={aboutUsSection.illustration.objectFit}
          loading={aboutUsSection.illustration.loading}
          className="hidden md:block !max-h-[45rem] wide:!max-h-[52rem]"
        />
        <div className="w-full flex flex-col gap-5 text-black">
          <div className="flex flex-col gap-4 md:gap-6">
            <h2 className="flex flex-col gap-2 md:gap-4">
              <span className="text-xl md:text-2xl font-medium leading-5">
                {aboutUsSection.label}
              </span>
              <div className="w-58 h-0.75 bg-primary rounded"></div>
            </h2>
            <p className="w-full md:w-[85%] leading-6 tracking-tight text-lg md:text-xl">
              {aboutUsSection.description}
            </p>
          </div>
          <CustomImageAtom
            src={aboutUsSection.illustration.img}
            size={aboutUsSection.illustration.size}
            rounded={aboutUsSection.illustration.rounded}
            aspectRatio={aboutUsSection.illustration.aspectRatio}
            objectFit={aboutUsSection.illustration.objectFit}
            loading={aboutUsSection.illustration.loading}
            className={cn('md:hidden', imgClassName)}
          />
          <CustomButtonAtom
            className="font-medium text-lg px-10 py-2 xl:text-xl xl:px-10 xl:py-3 bg-secondary hover:bg-custom-blue"
            label={aboutUsSection.actionButton.label}
          />
        </div>
      </div>
    </section>
  );
};

export default LandingAboutUsSection;
