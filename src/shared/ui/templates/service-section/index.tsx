import { cn } from '@/core/utils/cn';
import ServiceCard from '../../molecules/service-card';

const IndustryServiceSection: React.FC<any> = ({ serviceSection }: any) => {
  return (
    <section className="common-component w-full h-full relative bg-white ">
      <div className="common-container px-6 py-10 md:px-24 md:py-28 !max-w-[1336px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {serviceSection.map((service: any, index: number) => (
            <ServiceCard
              service={service}
              index={index}
              className="px-4 py-6 md:px-6 md:py-15 gap-4 md:gap-8"
              iconClassName="p-3"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const ResearchServiceSection: React.FC<any> = ({ serviceSection }: any) => {
  return (
    <section className="common-component w-full h-full relative bg-white text-black">
      <div className="common-container px-6 py-10 md:px-24 md:py-16 !max-w-[1336px] flex-col gap-6">
        {serviceSection.title && (
          <h2 className="text-[1.1rem] md:text-3xl font-semibold leading-[1.25] tracking-normal">
            {serviceSection.title}
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {serviceSection.items.map((service: any, index: number) => (
            <ServiceCard
              service={service}
              index={index}
              className="px-4 py-4 gap-3 hover:bg-primary group"
              iconClassName="w-12 h-12 group-hover:bg-primary-light"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const MarketOpportunitySection: React.FC<any> = ({ serviceSection }: any) => {
  return (
    <section className="common-component w-full h-full relative bg-white text-black">
      <div className="common-container px-6 py-10 md:px-24 md:py-16 !max-w-[1336px] flex-col gap-6">
        {serviceSection.title && (
          <h2 className="text-[1.1rem] md:text-3xl font-semibold leading-[1.25] tracking-normal">
            {serviceSection.title}
          </h2>
        )}
        <div className="grid grid-cols-1 grid-rows-1 md:grid-rows-2 md:grid-cols-3">
          {serviceSection.items.map((service: any, index: number) => (
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
                  {index !== serviceSection.items.length - 1 && (
                    <div
                      className={cn(
                        'absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[90%] h-px bg-black',
                        !service.line4 && 'md:hidden'
                      )}
                    ></div>
                  )}
                  {index !== serviceSection.items.length - 1 && (
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
          ))}
        </div>
      </div>
    </section>
  );
};

const ProductResearchSection: React.FC<any> = ({ serviceSection }: any) => {
  return (
    <section className="common-component w-full h-full relative bg-white text-black">
      <div className="common-container px-6 py-10 md:px-24 md:py-16 !max-w-[1336px] flex-col gap-6">
        <div className="grid grid-cols-1 grid-rows-1 md:grid-rows-2 md:grid-cols-3 gap-4">
          {serviceSection.title && (
            <h2 className="h-full w-[75%] text-[1.1rem] md:text-3xl font-semibold leading-[1.25] tracking-normal flex items-center py-6">
              <span>{serviceSection.title}</span>
            </h2>
          )}
          {serviceSection.items.map((service: any, index: number) => (
            <div className="relative p-2 flex flex-col items-center justify-center">
              <ServiceCard
                service={service}
                index={index}
                className="px-4 py-12 gap-3 w-full h-full"
                iconClassName="absolute -top-6 bg-white w-16 h-16 p-2"
                contentClassName="text-md"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CustomerResearchSection: React.FC<any> = ({ serviceSection }: any) => {
  return (
    <section className="common-component w-full h-full relative bg-white text-black">
      <div className="common-container px-6 py-10 md:px-24 md:py-16 !max-w-[1336px] flex-col gap-6">
        {serviceSection.title && (
          <h2 className="text-[1.1rem] md:text-3xl font-semibold leading-[1.25] tracking-normal">
            {serviceSection.title}
          </h2>
        )}
        <div className="grid grid-cols-1 grid-rows-1 md:grid-rows-2 md:grid-cols-3 gap-4">
          {serviceSection.innerTitle && (
            <h2 className="h-full w-[80%] text-[1.5rem] md:text-3xl font-semibold leading-[1.25] tracking-normal flex items-center py-6">
              <span>{serviceSection.innerTitle}</span>
            </h2>
          )}
          {serviceSection.items.map((service: any, index: number) => (
            <div className="relative p-2 flex flex-col items-center justify-center">
              <ServiceCard
                service={service}
                index={index}
                className="p-4 gap-3 w-full h-full"
                iconClassName="w-12 h-12 p-2"
                contentClassName="text-md"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export {
  IndustryServiceSection,
  ResearchServiceSection,
  MarketOpportunitySection,
  ProductResearchSection,
  CustomerResearchSection,
};
