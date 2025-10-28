import { ourPanelConstants } from './our-panel.constant';
import CustomImageAtom from '@/shared/ui/atoms/custom-image';
import CustomButtonAtom from '@/shared/ui/atoms/custom-button';

const OurPanelSection: React.FC = () => {
  const pageContent = ourPanelConstants;
  return (
    <section className="common-component bg-white">
      <div className="z-1 common-container w-full max-w-(--breakpoint-2xl)! py-8 px-6 md:p-24 grid! grid-cols-1 md:grid-cols-[40%_60%] gap-12 md:gap-24">
        <div className="hidden md:flex w-full h-full items-center justify-center xl:pt-14 wide:pt-0">
          <CustomImageAtom
            src={pageContent.illustration.img}
            size={pageContent.illustration.size as any}
            aspectRatio={pageContent.illustration.aspectRatio as any}
            shadowPosition={pageContent.illustration.shadowPosition as any}
            shadowOpacity={pageContent.illustration.shadowOpacity as any}
            objectFit={pageContent.illustration.objectFit as any}
            loading={pageContent.illustration.loading as any}
          />
        </div>
        <div className="w-full h-full flex flex-col gap-6 md:pr-28">
          <h1 className="w-[80%] font-semibold text-primary text-xl xl:text-3xl wide:text-4xl">
            {pageContent.head}
          </h1>
          <h1 className="font-semibold text-black xl:text-2xl wide:text-3xl">
            {pageContent.title}
          </h1>
          <div className="md:hidden w-full h-full flex items-center justify-center xl:pt-14 wide:pt-0">
            <CustomImageAtom
              src={pageContent.illustration.img}
              size={pageContent.illustration.size as any}
              aspectRatio={pageContent.illustration.aspectRatio as any}
              shadowPosition={pageContent.illustration.shadowPosition as any}
              shadowOpacity={pageContent.illustration.shadowOpacity as any}
              objectFit={pageContent.illustration.objectFit as any}
              loading={pageContent.illustration.loading as any}
            />
          </div>
          <p
            className="w-full text-black text-sm xl:text-md wide:text-lg"
            dangerouslySetInnerHTML={{
              __html: pageContent.description,
            }}
          />
          <CustomButtonAtom
            path={pageContent.actionButton.path}
            className="p-3 font-medium text-md xl:text-xl"
            label={pageContent.actionButton.label}
          />
        </div>
      </div>
    </section>
  );
};

export default OurPanelSection;
