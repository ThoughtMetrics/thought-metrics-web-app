import { cn } from '@/core/utils/cn';
import { ourPanel } from './our-panel.constant';
import './our-panel.css';
import CustomImageAtom from '@/shared/ui/atoms/custom-image';
import ServiceCard from '@/shared/ui/molecules/service-card';
import CustomButtonAtom from '@/shared/ui/atoms/custom-button';
import { PageTitle } from '@/shared/components/page-title';
const OurPanel: React.FC = () => {
  return (
    <div className="text-black">
      {/* Section 1 */}
      <section className="common-component w-full h-full relative bg-[url('/images/background_image_8_1_m.png')] md:bg-[url('/images/background_image_8_1.png')] our-panel-container">
        <div className="absolute top-0 right-0 md:min-h-[360px] xl:min-h-[480px] wide:min-h-[580px] w-[50%] flex justify-center md:items-center">
          <div className="pr-[8rem] xxl:pr-[8rem] wide:pr-[16rem]">
            <CustomImageAtom
              src={ourPanel.heroSection.illustration.img}
              aspectRatio={ourPanel.heroSection.illustration.aspectRatio}
              objectFit={ourPanel.heroSection.illustration.objectFit}
              loading={ourPanel.heroSection.illustration.loading}
              className="hidden md:block md:!h-[16rem] md:!w-[34rem] xl:!h-[19.5rem] xl:!w-[40rem] xxl:!h-[19.5rem] xxl:!w-[39em] wide:!h-[22rem] wide:!w-[44em]"
            />
          </div>
        </div>
        <div className="common-container p-5 md:p-10 xxl:p-0 !max-w-[var(--breakpoint-2xl)] flex-col pb-28">
          <div className="md:w-[28%] xl:w-[37%] wide:w-[40%] h-full flex flex-col gap-3 justify-center md:min-h-[360px] xl:min-h-[480px] wide:min-h-[580px]">
            <PageTitle className='w-32'/>
            <h2 className="w-full text-xl md:text-2xl xl:text-3xl xxl:text-4xl md:leading-8 xl:leading-11">
              <span>{ourPanel.heroSection.title}</span>
            </h2>
            <CustomImageAtom
              src={ourPanel.heroSection.illustration.img}
              aspectRatio={ourPanel.heroSection.illustration.aspectRatio}
              objectFit={ourPanel.heroSection.illustration.objectFit}
              loading={ourPanel.heroSection.illustration.loading}
              className="md:hidden !h-[10.5rem] w-full"
            />
            <p
              className="xl:w-[90%] text-text-dark xl:text-lg xxl:text-xl [&>*]:pt-2"
              dangerouslySetInnerHTML={{
                __html: ourPanel.heroSection.description,
              }}
            />
          </div>
          <div className="grid grid-cols-1 grid-rows-1 md:grid-rows-2 md:grid-cols-3 md:pb-26 xl:pb-34 xxl:pb-38">
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
        </div>
      </section>
      {/* Section 2 */}
      <section className="common-component w-full h-full relative bg-[url('/images/background_image_8_2_m.png')] md:bg-[url('/images/background_image_8_2.png')] our-panel-container">
        <div className="common-container p-5 md:p-10 xxl:p-0 !max-w-[var(--breakpoint-2xl)] flex-col">
          <div className="flex flex-col gap-6 items-center xxl:py-8">
            <label className="font-semibold text-xl md:text-2xl xl:text-3xl wide:text-4xl">
              Our Coverage
            </label>
            <p className="md:w-[50%] font-semibold text-sm md:text-lg xl:text-xl text-center">
              We bring extensive experience in sourcing high-quality research
              participants across a wide range of sectors.
            </p>
            <div className="h-0.25 w-[14rem] md:w-[20rem] bg-black my-4"></div>
          </div>
          <div className="shrink-0 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4 px-4 py-8 md:p-8">
            {ourPanel.aboutUsSection.items.map((item: any, index: number) => {
              return (
                <div
                  key={index + item.label}
                  className="flex flex-col gap-3 w-full md:h-[14rem]"
                >
                  <div className="shrink-0 w-[3rem] h-[3rem] md:w-[3.75rem] md:h-[3.75rem] bg-primary/20 rounded-full flex items-center justify-center overflow-hidden p-2 md:p-3">
                    <item.icon className="w-full h-full xl:h-11 xl:w-11 xxl:w-12 xxl:h-12 fill-current text-black" />
                  </div>
                  <div className="flex flex-col gap-3">
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
      </section>
      {/* Section 3 */}
      <section className="common-component w-full h-full relative z-1 bg-white px-6 pt-14 pb-8 md:p-0 text-black">
        <div
          className={cn(
            'common-container !max-w-[1336px] !grid grid-cols-1 md:grid-cols-2 items-center justify-between'
          )}
        >
          <div className="w-full flex flex-col gap-3 md:pl-10 md:py-14">
            <h2 className="flex flex-col gap-2">
              <span className="xl:text-lg xxl:text-xl font-medium leading-5 text-custom-grey-2">
                {ourPanel.caseStudySection.head}
              </span>
              <div className="w-25 h-0.5 md:h-1 bg-primary rounded"></div>
            </h2>
            <h2 className="w-[70%] md:w-[45%] text-xl xl:text-2xl xxl:text-3xl font-semibold leading-[1.25]">
              <span>{ourPanel.caseStudySection.title}</span>
            </h2>
            <img
              src="/images/our_panel_3.png"
              className="md:hidden w-full h-fit"
            />
            <ul className="md:w-[77.5%] md:text-lg space-y-2 py-6">
              {ourPanel.caseStudySection.list.map((value: string) => {
                return <p className="leading-7">{value}</p>;
              })}
            </ul>
            <p
              className="md:w-[83.5%] text-lg md:text-xl leading-6 md:leading-7"
              dangerouslySetInnerHTML={{
                __html: ourPanel.caseStudySection.description,
              }}
            />
            <div className="py-4">
              <CustomButtonAtom
                label={ourPanel.caseStudySection.actionButton.label}
                className="font-medium px-12 py-2 md:px-18 md:py-3 md:text-xl"
              />
            </div>
          </div>
        </div>
        <div className="absolute h-full w-full !grid grid-cols-1 md:grid-cols-2 -z-1">
          <div className="col-span-1"></div>
          <div className="col-span-1 hidden md:block place-self-end self-center">
            <CustomImageAtom
              src={ourPanel.caseStudySection.illustration.img}
              size={ourPanel.caseStudySection.illustration.size}
              aspectRatio={ourPanel.caseStudySection.illustration.aspectRatio}
              objectFit={ourPanel.caseStudySection.illustration.objectFit}
              loading={ourPanel.caseStudySection.illustration.loading}
              rounded="none"
              className="!h-[28rem] !w-[60rem] wide:!h-[32rem] wide:!w-[50rem]"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurPanel;
