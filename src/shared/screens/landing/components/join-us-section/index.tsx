import CustomButtonAtom from '@/shared/ui/atoms/custom-button';
import type React from 'react';
import '../../landing.style.css';
import { StackIllustration } from '@/assets';

const LandingJoinUsSection: React.FC<any> = ({ joinUsSection }) => {
  return (
    <section className="common-component relative landing-join-us-section py-18 md:py-24 !grid grid-cols-1 md:grid-cols-[55%_45%] justify-items-end">
      <div className=""></div>
      <div className="top-0 w-[90%] md:w-full h-full bg-primary/84 px-8 py-18 md:px-16 md:py-24 relative rounded-l-2xl">
        <StackIllustration className="absolute right-0 bottom-0 h-fit w-[6rem] md:w-[8rem] fill-current text-white my-6 mx-4" />
        <div className="w-full flex flex-col gap-4 text-black">
          <div className="flex flex-col gap-4 md:gap-4">
            <h2 className="flex flex-col gap-2 md:gap-4">
              <span className="w-[10rem] md:w-[12rem] text-xl md:text-2xl font-semibold">
                {joinUsSection.label}
              </span>
              <div className="w-42 md:w-58 h-0.75 bg-white rounded"></div>
            </h2>
            <p className="w-[16rem] md:w-[18rem] leading-6 tracking-tight text-lg md:text-xl">
              {joinUsSection.description}
            </p>
          </div>
          <CustomButtonAtom
            className="font-medium text-base md:text-lg px-6 py-2 xl:text-xl xl:px-10 xl:py-2 bg-secondary hover:bg-custom-blue"
            label={joinUsSection.actionButton.label}
            path={joinUsSection.actionButton.path}
          />
        </div>
      </div>
    </section>
  );
};

export default LandingJoinUsSection;
