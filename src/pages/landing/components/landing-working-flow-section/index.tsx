import { StackIllustration } from '@/assets';
import { cn } from '@/core/utils/cn';

const LandingWorkingFlowSection: React.FC<any> = ({
  workingFlowSection,
}: any) => {
  return (
    <section className="common-component w-full h-full bg-custom-grey-1 text-black relative">
      <StackIllustration className="absolute -right-26 md:-right-48 bottom-0 w-[12rem] md:w-[28rem] fill-current text-white mb-8" />
      <div className="common-container px-6 pt-14 pb-8 md:px-24 md:py-24 !max-w-[1336px] flex-col md:gap-18 justify-center">
        <h2 className="w-[50%] md:w-[20%] text-2xl xl:text-3xl xxl:text-4xl font-semibold">
          <span>{workingFlowSection.head}</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-14">
          {workingFlowSection.items.map((item: any, index: number) => {
            return (
              <div
                key={index + item.label}
                className={cn(
                  'flex flex-col p-8 pl-4 md:p-0',
                  index !== workingFlowSection.items.length - 1 &&
                    'md:pr-8 border-b-[1px] border-b-custom-grey-2 md:border-b-0 md:border-r-[1px] md:border-r-custom-grey-2'
                )}
              >
                <h2 className="font-medium text-4xl">{item.sNo}</h2>
                <div className="w-[80%] md:w-auto flex flex-col gap-3">
                  <label className="font-medium text-md md:text-base">
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

export default LandingWorkingFlowSection;
