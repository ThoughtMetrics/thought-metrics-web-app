import { IllustrationSquares } from '@/assets';
import CustomImageAtom from '../../atoms/custom-image';
import CustomButtonAtom from '../../atoms/custom-button';

const HeroSection: React.FC<any> = ({ heroSection }: any) => {
  return (
    <section className="common-component w-full h-full relative pt-10 md:pt-0">
      <div className="absolute w-full h-full flex justify-end pt-10 md:p-0">
        <IllustrationSquares className="h-[17rem] md:h-[98%] w-auto stroke-2 md:stroke-1 stroke-primary" />
      </div>
      <div className="absolute w-full h-full flex justify-end pt-18 md:pt-0 md:items-center">
        <div className="pl-[6%] pr-[8%] xxl:pr-[15%] wide:pr-[12%]">
          <CustomImageAtom
            src={heroSection.illustration.img}
            size={heroSection.illustration.size}
            aspectRatio={heroSection.illustration.aspectRatio}
            shadowPosition={heroSection.illustration.shadowPosition}
            shadowOpacity={heroSection.illustration.shadowOpacity}
            objectFit={heroSection.illustration.objectFit}
            loading={heroSection.illustration.loading}
          />
        </div>
      </div>
      <div className="z-1 common-container w-full !max-w-[var(--breakpoint-2xl)] md:min-h-[480px] xl:min-h-[580px] wide:min-h-[780px] items-center p-5 md:p-10 xxl:p-0">
        <div className="md:w-[43%] xxl:w-[37%] wide:w-[50%] h-full flex flex-col gap-3 justify-center">
          <div className="h-[18rem] sm:h-[28rem] md:h-0"></div>
          <h1 className="w-[80%] text-primary text-2xl xl:text-[2.5rem] wide:text-[3rem] font-semibold">
            {heroSection.title}
          </h1>
          <p className="w-full text-black text-lg xl:text-[1.3rem] wide:text-[1.7rem] font-semibold">
            {heroSection.description}
          </p>
          <CustomButtonAtom
            className="font-medium text-lg px-10 py-1 xl:text-xl xl:px-14 xl:py-2"
            label={heroSection.actionLabel}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
