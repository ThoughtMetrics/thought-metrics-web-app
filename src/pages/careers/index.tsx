import { RedTickIcon } from '@/assets';
import { careers } from './careers.constant';
import CustomImageAtom from '@/shared/ui/atoms/custom-image';
const Careers: React.FC = () => {
  return (
    <section className="common-component w-full h-full relative text-black">
      <div className="common-container !max-w-[var(--breakpoint-2xl)] flex-col px-6 py-10 md:px-24 md:py-28">
        <div className="h-full flex flex-col gap-3">
          <h2 className="w-full text-2xl xl:text-3xl xxl:text-4xl font-semibold">
            <span>{careers.heroSection.head}</span>
          </h2>
          <p className="tracking-tight md:w-[49%] lg:w-[51%] xl:w-[51%]">
            {careers.heroSection.description}
          </p>
          <CustomImageAtom
            src={careers.heroSection.illustration.img}
            size="full"
            objectFit={careers.heroSection.illustration.objectFit}
            loading={careers.heroSection.illustration.loading}
            rounded="none"
            className="!w-full !h-full"
          />
        </div>
        <div className="pt-8 flex flex-col gap-6">
          <h2 className="w-full text-2xl xl:text-3xl xxl:text-4xl font-semibold text-end tracking-tighter">
            <span>{careers.aboutUsSection.head}</span>
          </h2>
          <div className="shrink-0 grid grid-cols-1 md:grid-cols-3 md:gap-x-28 gap-y-8 md:gap-y-18 md:py-8 pb-8">
            {careers.aboutUsSection.items.map((item, index: number) => {
              return (
                <div
                  key={index + item.label}
                  className="flex flex-col gap-3 w-full"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-2 items-center">
                      <label className="font-semibold text-md md:text-base">
                        {item.label}
                      </label>
                      <RedTickIcon />
                    </div>
                    <p className="text-sm md:text-md">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="absolute left-0 top-0 w-full h-full flex justify-center items-end">
          <div className="max-w-[var(--breakpoint-2xl)] w-full">
            <div className="ml-6 md:ml-24 mb-60 md:mb-78 h-1.5 md:h-2 w-[95%] lg:w-[97%] xxl:w-[110%] wide:w-[120%] bg-gradient-to-r from-secondary to-primary" />
          </div>
        </div>
        <div className="flex flex-col gap-6 pt-8 md:pt-12">
          <h2 className="w-full text-2xl xl:text-3xl xxl:text-4xl font-semibold text-start tracking-tighter">
            <span>{careers.feedbackSection.head}</span>
          </h2>
          <p className="tracking-tight md:w-[49%] lg:w-[51%] xl:w-[51%] md:text-lg">
            {careers.feedbackSection.description}
          </p>
          <label className="font-medium md:text-xl">
            {careers.feedbackSection.email}
          </label>
        </div>
      </div>
    </section>
  );
};

export default Careers;
