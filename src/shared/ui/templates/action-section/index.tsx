import CustomButtonAtom from '../../atoms/custom-button';

const IndustryActionSection: React.FC<any> = ({ actionSection }: any) => {
  return (
    <section className="common-component relative bg-linear-to-r from-custom-blue-lighter to-custom-grey-4">
      <actionSection.illustration className="absolute -right-26 md:-right-48 -bottom-28 w-48 md:w-md" />
      <div className="z-1 common-container w-full max-w-(--breakpoint-2xl)! grid! grid-cols-1 md:grid-cols-2 gap-10 md:gap-0 px-6 md:px-24 pt-10">
        <div className="flex flex-col items-start justify-center gap-6">
          <h1 className="w-full xl:w-[75%] wide:w-[85%] text-black text-2xl xl:text-[2.5rem] wide:text-[3rem] font-medium">
            {actionSection.title}
          </h1>
          <CustomButtonAtom
            className="font-medium text-lg px-10 py-1 xl:text-xl xl:px-14 xl:py-2"
            path={actionSection.actionButton.path}
            label={actionSection.actionButton.label}
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
    <section className="common-component relative bg-primary-lighter">
      <actionSection.illustration className="absolute h-full -right-40 md:-right-75 xl:-right-65 xxl:-right-50 -bottom-20 md:bottom-0 w-[16rem] md:w-104 fill-current text-primary" />
      <div className="z-1 common-container w-full max-w-(--breakpoint-2xl)! grid! grid-cols-1 md:grid-cols-2 gap-10 md:gap-0 px-6 md:px-24 pt-10">
        <div className="hidden md:flex xxl:items-center xxl:justify-center w-[80%] md:w-full">
          <img src={actionSection.img} />
        </div>
        <div className="flex flex-col items-start justify-center gap-6">
          <h1 className="w-full xl:w-[75%] wide:w-[80%] text-black text-2xl xl:text-[2.5rem] wide:text-[3rem] font-medium">
            {actionSection.title}
          </h1>
          <CustomButtonAtom
            className="font-medium text-lg px-10 py-1 xl:text-xl xl:px-14 xl:py-2"
            path={actionSection.actionButton.path}
            label={actionSection.actionButton.label}
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
    <section className="common-component bg-linear-to-r from-custom-blue-lighter to-custom-grey-4">
      <div className="z-1 common-container w-full max-w-(--breakpoint-2xl)! grid! grid-cols-1 md:grid-cols-2 gap-10 md:gap-0 px-6 md:px-24 pt-10">
        <div className="flex flex-col items-start justify-center gap-6">
          <h1 className="w-[90%] xl:w-[85%] xxl:w-[80%] wide:w-[96%] text-black text-2xl xl:text-[2.5rem] font-medium">
            {actionSection.title}
          </h1>
          <CustomButtonAtom
            path={actionSection.actionButton.path}
            className="font-medium text-lg px-10 py-1 xl:text-xl xl:px-14 xl:py-2"
            label={actionSection.actionButton.label}
          />
        </div>
        <div className="h-full w-full flex justify-center relative z-1">
          <img
            src={actionSection.img}
            className="w-40 h-72 md:w-60 md:h-104"
          />
          <actionSection.illustration className="absolute bottom-0 w-72 h-60 md:w-md md:h-100 fill-current text-white -z-1" />
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
