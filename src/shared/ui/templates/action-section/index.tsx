import CustomButtonAtom from '../../atoms/custom-button';

const IndustryActionSection: React.FC<any> = ({ actionSection }: any) => {
  return (
    <section className="common-component w-full h-full relative bg-gradient-to-r from-custom-blue-lighter to-custom-grey-4">
      <actionSection.illustration className="absolute -right-26 md:-right-48 -bottom-28 w-[12rem] md:w-[28rem]" />
      <div className="z-1 common-container w-full !max-w-[var(--breakpoint-2xl)] !grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-0 px-6 md:px-24 pt-10">
        <div className="flex flex-col items-start justify-center gap-6">
          <h1 className="w-full xl:w-[75%] wide:w-[85%] text-black text-2xl xl:text-[2.5rem] wide:text-[3rem] font-semibold">
            {actionSection.title}
          </h1>
          <CustomButtonAtom
            className="font-medium text-lg px-10 py-1 xl:text-xl xl:px-14 xl:py-2"
            label={actionSection.actionLabel}
          />
        </div>
        <div className="flex xxl:items-center xxl:justify-center w-[80%] md:w-full">
          <img src={actionSection.img} />
        </div>
      </div>
    </section>
  );
};

const CapabilityActionSection: React.FC<any> = ({ actionSection }: any) => {
  return (
    <section className="common-component w-full h-full relative bg-secondary-light">
      <actionSection.illustration className="absolute h-full -right-40 md:-right-75 xl:-right-65 xxl:-right-50 -bottom-20 md:bottom-0 w-[16rem] md:w-[26rem] fill-current text-white" />
      <div className="z-1 common-container w-full !max-w-[var(--breakpoint-2xl)] !grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-0 px-6 md:px-24 pt-10">
        <div className="hidden md:flex xxl:items-center xxl:justify-center w-[80%] md:w-full">
          <img src={actionSection.img} />
        </div>
        <div className="flex flex-col items-start justify-center gap-6">
          <h1 className="w-full xl:w-[75%] wide:w-[80%] text-black text-2xl xl:text-[2.5rem] wide:text-[3rem] font-semibold">
            {actionSection.title}
          </h1>
          <CustomButtonAtom
            className="font-medium text-lg px-10 py-1 xl:text-xl xl:px-14 xl:py-2"
            label={actionSection.actionLabel}
          />
        </div>
        <div className="flex md:hidden xxl:items-center xxl:justify-center w-[80%] md:w-full">
          <img src={actionSection.img} />
        </div>
      </div>
    </section>
  );
};

const ResearchMethodActionSection: React.FC<any> = ({ actionSection }: any) => {
  return (
    <section className="common-component w-full h-full bg-gradient-to-r from-custom-blue-lighter to-custom-grey-4">
      <div className="z-1 common-container w-full !max-w-[var(--breakpoint-2xl)] !grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-0 px-6 md:px-24 pt-10">
        <div className="flex flex-col items-start justify-center gap-6">
          <h1 className="w-[90%] xl:w-[85%] xxl:w-[80%] wide:w-[96%] text-black text-2xl xl:text-[2.5rem] wide:text-[3rem] font-semibold">
            {actionSection.title}
          </h1>
          <CustomButtonAtom
            className="font-medium text-lg px-10 py-1 xl:text-xl xl:px-14 xl:py-2"
            label={actionSection.actionLabel}
          />
        </div>
        <div className="h-full w-full flex justify-center relative z-1">
          <img src={actionSection.img} className='w-[10rem] h-[18rem] md:w-[15rem] md:h-[26rem]'/>
          <actionSection.illustration className="absolute bottom-0 w-[18rem] h-[15rem] md:w-[28rem] md:h-[25rem] fill-current text-white -z-1" />
        </div>
      </div>
    </section>
  );
};

export {
  CapabilityActionSection,
  IndustryActionSection,
  ResearchMethodActionSection,
};
