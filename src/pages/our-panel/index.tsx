import { cn } from '@/core/utils/cn';
import { ourPanel } from './our-panel.constant';
import './our-panel.css';
import CustomImageAtom from '@/shared/ui/atoms/custom-image';
import ServiceCard from '@/shared/ui/molecules/service-card';
const OurPanel: React.FC = () => {
  return (
    <div className="text-black [&>div]:common-component">
      {/* Section 1 */}
      <div className="section-1">
        <div className="common-container px-6 py-8 md:px-24 md:py-24 !max-w-[1336px] w-full h-full">
          <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 items-center">
            <div className="w-full flex flex-col gap-3">
              <h2 className="w-[80%] md:w-[60%] text-xl xl:text-2xl xxl:text-3xl font-semibold leading-[1.25]">
                <span>{ourPanel.heroSection.title}</span>
              </h2>
              <CustomImageAtom
                src={ourPanel.heroSection.illustration.img}
                size={ourPanel.heroSection.illustration.size}
                //   rounded={ourPanel.heroSection.illustration.rounded}
                aspectRatio={ourPanel.heroSection.illustration.aspectRatio}
                objectFit={ourPanel.heroSection.illustration.objectFit}
                loading={ourPanel.heroSection.illustration.loading}
                className="md:hidden h-[65%] w-full"
              />
              <p
                className="md:w-[90%] text-text-dark font-medium xl:text-lg xxl:text-xl [&>*]:pt-2"
                dangerouslySetInnerHTML={{
                  __html: ourPanel.heroSection.description,
                }}
              />
            </div>
            <CustomImageAtom
              src={ourPanel.heroSection.illustration.img}
              size={ourPanel.heroSection.illustration.size}
              // rounded={ourPanel.heroSection.illustration.rounded}
              aspectRatio={ourPanel.heroSection.illustration.aspectRatio}
              objectFit={ourPanel.heroSection.illustration.objectFit}
              loading={ourPanel.heroSection.illustration.loading}
              className="hidden md:block h-[65%] w-full"
            />
          </div>

          <div className="grid grid-cols-1 grid-rows-1 md:grid-rows-2 md:grid-cols-3">
            {ourPanel.serviceSection.items.map(
              (service: any, index: number) => (
                <div className="relative p-2 flex flex-col items-center justify-center">
                  <ServiceCard
                    service={service}
                    index={index}
                    className="px-4 py-12 gap-3 w-full h-full"
                    iconClassName="w-12 h-12 p-0"
                    contentClassName={
                      service.isActive === true
                        ? 'w-full h-[10rem] md:h-full justify-center items-center'
                        : ''
                    }
                  />
                  <div className="absolute top-0 w-full h-full">
                    <div className="relative w-full h-full">
                      {service.line1 && (
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-[90%] w-px bg-black"></div>
                      )}
                      {service.line2 && (
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[90%] h-px bg-black"></div>
                      )}
                      <div
                        className={cn(
                          'absolute right-0 top-1/2 transform -translate-y-1/2  h-[90%] w-px bg-black',
                          !service.line3 && 'md:hidden'
                        )}
                      ></div>
                      {index !== ourPanel.serviceSection.items.length - 1 && (
                        <div
                          className={cn(
                            'absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[90%] h-px bg-black',
                            !service.line4 && 'md:hidden'
                          )}
                        ></div>
                      )}
                      {index !== ourPanel.serviceSection.items.length - 1 && (
                        <div
                          className={cn(
                            'absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-primary rounded-full',
                            !service.point && 'md:hidden'
                          )}
                        ></div>
                      )}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
          <div className="shrink-0 grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-y-6 md:gap-y-12 py-12 md:py-24">
            {ourPanel.aboutUsSection.items.map((item: any, index: number) => {
              return (
                <div
                  key={index + item.label}
                  className="flex md:flex-col gap-3 w-full h-full"
                >
                  <div className="h-full md:w-full relative">
                    <div className="shrink-0 bg-primary rounded-full w-12 h-12 md:w-14 md:h-14 flex items-center justify-center">
                      <item.icon className="w-8" />
                    </div>
                  </div>
                  <div className="w-[75%] flex flex-col gap-3">
                    <label className="font-semibold text-md md:text-base">
                      {item.label}
                    </label>
                    <p className="text-sm md:text-md">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Section 2 */}
      <div className=""></div>
    </div>
  );
};

export default OurPanel;
