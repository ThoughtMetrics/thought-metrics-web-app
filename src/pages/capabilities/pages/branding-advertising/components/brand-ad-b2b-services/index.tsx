import { ArrowRight } from '@/assets';
import React from 'react';
import { Link } from 'react-router-dom';
const BrandAdB2BServices: React.FC<any> = ({ b2bServiceSection }) => {
  return (
    <section className="common-component bg-white">
      <div className="common-container px-6 py-8 md:px-24 md:py-12 justify-center flex-col !max-w-[var(--breakpoint-2xl)]">
        {/* Desktop View */}
        <div className="hidden md:grid grid-cols-1 w-full md:grid-cols-3  md:grid-rows-2 gap-3 pt-6 text-black">
          {/* Service 1 */}
          <Link
            to="#"
            className="relative col-span-1 bg-success rounded-md flex flex-col justify-center pb-18 pt-24 px-12 overflow-hidden group hover:shadow-xl transition-shadow duration-300"
          >
            {(() => {
              const IllustrationSlope =
                b2bServiceSection.services[0].illustration;
              return IllustrationSlope ? (
                <IllustrationSlope
                  className={b2bServiceSection.services[0].className}
                />
              ) : null;
            })()}
            <div className="flex flex-col justify-between h-[12rem]">
              <div className="w-[88%] flex flex-col gap-2 z-1">
                <h3 className="leading-[1.2] font-semibold">
                  {b2bServiceSection.services[0].title}
                </h3>
                <p className="tracking-tight leading-[1.2]">
                  {b2bServiceSection.services[0].description}
                </p>
              </div>
              <ArrowRight className="fill-current group-hover:text-[#AACF75]" />
            </div>
          </Link>

          {/* Service 2 */}
          <Link
            to="#"
            className="relative col-span-2 bg-gradient-to-r from-custom-violet to-white rounded-md flex flex-col justify-center pb-18 pt-24 px-12 overflow-hidden group hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex flex-col justify-between h-[12rem]">
              <div className="w-[40%] flex flex-col gap-2">
                <h3 className="leading-[1.2] font-semibold">
                  {b2bServiceSection.services[1].title}
                </h3>
                <p className="tracking-tight leading-[1.2]">
                  {b2bServiceSection.services[1].description}
                </p>
              </div>
              <ArrowRight className="fill-current group-hover:text-[#BA9CF3]" />
            </div>
            {(() => {
              const DoorPerson = b2bServiceSection.services[1].illustration;
              return DoorPerson ? (
                <DoorPerson
                  className={b2bServiceSection.services[1].className}
                />
              ) : null;
            })()}
          </Link>

          {/* Service 3 */}
          <Link
            to="#"
            className="relative col-span-2 bg-gradient-to-r from-custom-grey-1 to-white rounded-md flex flex-col justify-center pb-18 pt-24 px-12 overflow-hidden group hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex flex-col justify-between h-[12rem]">
              <div className="w-[40%] flex flex-col gap-2">
                <h3 className="leading-[1.2] font-semibold">
                  {b2bServiceSection.services[2].title}
                </h3>
                <p className="tracking-tight leading-[1.2]">
                  {b2bServiceSection.services[2].description}
                </p>
              </div>
              <ArrowRight />
            </div>
            {(() => {
              const Spiral = b2bServiceSection.services[2].illustration;
              return Spiral ? (
                <Spiral className={b2bServiceSection.services[2].className} />
              ) : null;
            })()}
          </Link>

          {/* Service 4 */}
          <Link
            to="#"
            className="relative col-span-1 bg-custom-pink rounded-md flex flex-col justify-center pb-18 pt-24 px-12 overflow-hidden group hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex flex-col justify-between h-[12rem]">
              <div className="w-[90%] flex flex-col gap-2">
                <h3 className="leading-[1.2] font-semibold">
                  {b2bServiceSection.services[3].title}
                </h3>
                <p className="tracking-tight leading-[1.2]">
                  {b2bServiceSection.services[3].description}
                </p>
              </div>
              <ArrowRight className="fill-current group-hover:text-[#F1959E]" />
            </div>
            {(() => {
              const BoxCluster = b2bServiceSection.services[3].illustration;
              return BoxCluster ? (
                <>
                  <BoxCluster
                    className={b2bServiceSection.services[3].className}
                  />
                  <BoxCluster
                    className={b2bServiceSection.services[3].className1}
                  />
                </>
              ) : null;
            })()}
          </Link>
        </div>

        {/* Mobile View */}
        <div className="w-full h-auto flex overflow-y-hidden overflow-x-scroll md:hidden gap-3 pt-6 text-black">
          <div className="shrink-0 w-70 h-80 relative col-span-1 bg-success rounded-md flex flex-col justify-center py-10 px-7">
            <div className="w-full flex flex-col gap-2 z-1">
              <h3 className="w-[90%] leading-[1.2] font-semibold">
                {b2bServiceSection.services[0].title}
              </h3>
              <p className="text-sm tracking-tight leading-[1.2]">
                {b2bServiceSection.services[0].description}
              </p>
              <div className="absolute bottom-0.5 right-0.5 w-[72px] h-[38px] rounded-tl-lg rounded-br-md bg-primary text-white border-none flex items-center justify-center">
                <img
                  src="/icons/right-arrow-white.svg"
                  alt="Read more"
                  className="w-[35px] h-[35px]"
                />
              </div>
            </div>
          </div>
          <div className="shrink-0 w-70 h-80 relative col-span-1 bg-gradient-to-r from-custom-violet to-white rounded-md flex flex-col justify-center py-10 px-7">
            <div className="w-full flex flex-col gap-2 z-1">
              <h3 className="w-[90%] leading-[1.2] font-semibold">
                {b2bServiceSection.services[1].title}
              </h3>
              <p className="text-sm tracking-tight leading-[1.2]">
                {b2bServiceSection.services[1].description}
              </p>
              <div className="absolute bottom-0.5 right-0.5 w-[72px] h-[38px] rounded-tl-lg rounded-br-md bg-primary text-white border-none flex items-center justify-center">
                <img
                  src="/icons/right-arrow-white.svg"
                  alt="Read more"
                  className="w-[35px] h-[35px]"
                />
              </div>
            </div>
          </div>
          <div className="shrink-0 w-70 h-80 relative col-span-1 bg-gradient-to-r from-custom-grey-1 to-white rounded-md flex flex-col justify-center py-10 px-7">
            <div className="w-full flex flex-col gap-2 z-1">
              <h3 className="w-[90%] leading-[1.2] font-semibold">
                {b2bServiceSection.services[2].title}
              </h3>
              <p className="text-sm tracking-tight leading-[1.2]">
                {b2bServiceSection.services[2].description}
              </p>
              <div className="absolute bottom-0.5 right-0.5 w-[72px] h-[38px] rounded-tl-lg rounded-br-md bg-primary text-white border-none flex items-center justify-center">
                <img
                  src="/icons/right-arrow-white.svg"
                  alt="Read more"
                  className="w-[35px] h-[35px]"
                />
              </div>
            </div>
          </div>
          <div className="shrink-0 w-70 h-80 relative col-span-1 bg-custom-pink rounded-md flex flex-col justify-center py-10 px-7">
            <div className="w-full flex flex-col gap-2 z-1">
              <h3 className="w-[90%] leading-[1.2] font-semibold">
                {b2bServiceSection.services[3].title}
              </h3>
              <p className="text-sm tracking-tight leading-[1.2]">
                {b2bServiceSection.services[3].description}
              </p>
              <div className="absolute bottom-0.5 right-0.5 w-[72px] h-[38px] rounded-tl-lg rounded-br-md bg-primary text-white border-none flex items-center justify-center">
                <img
                  src="/icons/right-arrow-white.svg"
                  alt="Read more"
                  className="w-[35px] h-[35px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandAdB2BServices;
