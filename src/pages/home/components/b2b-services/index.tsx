import React from 'react';
import { contentSecondData } from './b2bservices.constant';
import { ArrowRight } from '@/assets';
import { Link } from 'react-router-dom';

const B2BServices: React.FC = () => {
  return (
    <section className="common-component bg-neutral">
      <div className="common-container px-6 py-8 md:px-24 md:py-12 justify-center flex-col !max-w-[var(--breakpoint-2xl)]">
        <h2 className="text-[1.1rem] md:text-3xl font-semibold leading-[1.25] text-black tracking-normal md:w-[85%]">
          {contentSecondData.mainTitle}
        </h2>
        {/* Desktop View */}
        <div className="hidden md:grid grid-cols-1 w-full md:grid-cols-3 md:grid-rows-2 gap-3 pt-6 text-black">
          {/* Service 1 */}
          <Link to={contentSecondData.services[0].path} viewTransition={true}>
            <div className="relative col-span-1 bg-success rounded-md flex flex-col justify-center py-9 px-12 overflow-hidden group hover:shadow-xl transition-shadow duration-300">
              {(() => {
                const IllustrationSlope =
                  contentSecondData.services[0].illustration;
                return IllustrationSlope ? (
                  <IllustrationSlope
                    className={contentSecondData.services[0].className}
                  />
                ) : null;
              })()}
              <div className="flex flex-col justify-between h-[18rem]">
                <div className="w-[72%] flex flex-col gap-2 z-1">
                  <h3 className="w-[90%] leading-[1.2] font-semibold">
                    {contentSecondData.services[0].title}
                  </h3>
                  <p className="tracking-tight leading-[1.2]">
                    {contentSecondData.services[0].description}
                  </p>
                </div>
                <ArrowRight className="fill-current group-hover:text-[#AACF75]" />
              </div>
            </div>
          </Link>

          {/* Service 2 */}
          <Link
            to={contentSecondData.services[1].path}
            viewTransition={true}
            className="relative col-span-2 bg-gradient-to-r from-custom-violet to-white rounded-md flex flex-col py-9 px-12 overflow-hidden group hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex flex-col justify-between h-[18rem]">
              <div className="w-[52%] flex flex-col gap-2">
                <h3 className="w-[50%] leading-[1.2] font-semibold">
                  {contentSecondData.services[1].title}
                </h3>
                <p className="tracking-tight leading-[1.2]">
                  {contentSecondData.services[1].description}
                </p>
                <div
                  className="py-2"
                  aria-label={`Learn more about ${contentSecondData.services[1].title}`}
                ></div>
              </div>
              <ArrowRight className="fill-current group-hover:text-[#BA9CF3]" />
            </div>
            {(() => {
              const DoorPerson = contentSecondData.services[1].illustration;
              return DoorPerson ? (
                <DoorPerson
                  className={contentSecondData.services[1].className}
                />
              ) : null;
            })()}
          </Link>

          {/* Service 3 */}
          <Link
            to={contentSecondData.services[2].path}
            viewTransition={true}
            className="relative col-span-2 bg-gradient-to-r from-custom-grey-1 to-white rounded-md flex flex-col justify-center py-9 px-12 overflow-hidden group hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex flex-col justify-between h-[14rem]">
              <div className="w-[60%] flex flex-col gap-2">
                <h3 className="w-[35%] leading-[1.2] font-semibold">
                  {contentSecondData.services[2].title}
                </h3>
                <p className="tracking-tight leading-[1.2]">
                  {contentSecondData.services[2].description}
                </p>
                <div
                  className="py-2"
                  aria-label={`Learn more about ${contentSecondData.services[2].title}`}
                ></div>
              </div>
              <ArrowRight />
            </div>
            {(() => {
              const Spiral = contentSecondData.services[2].illustration;
              return Spiral ? (
                <Spiral className={contentSecondData.services[2].className} />
              ) : null;
            })()}
          </Link>

          {/* Service 4 */}
          <Link
            to={contentSecondData.services[3].path}
            viewTransition={true}
            className="relative col-span-1 bg-custom-pink rounded-md flex flex-col justify-center py-9 px-12 overflow-hidden group hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex flex-col justify-between h-[14rem]">
              <div className="w-[95%] flex flex-col gap-2">
                <h3 className="leading-[1.2] font-semibold">
                  {contentSecondData.services[3].title}
                </h3>
                <p className="tracking-tight leading-[1.2]">
                  {contentSecondData.services[3].description}
                </p>
                <div
                  className="py-2"
                  aria-label={`Learn more about ${contentSecondData.services[3].title}`}
                ></div>
              </div>
              <ArrowRight className="fill-current group-hover:text-[#F1959E]" />
            </div>
            {(() => {
              const BoxCluster = contentSecondData.services[3].illustration;
              return BoxCluster ? (
                <>
                  <BoxCluster
                    className={contentSecondData.services[3].className}
                  />
                  <BoxCluster
                    className={contentSecondData.services[3].className1}
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
                {contentSecondData.services[0].title}
              </h3>
              <p className="text-sm tracking-tight leading-[1.2]">
                {contentSecondData.services[0].description}
              </p>
              <div className="py-2">
                <ArrowRight />
              </div>
            </div>
          </div>
          <div className="shrink-0 w-70 h-80 relative col-span-1 bg-gradient-to-r from-custom-violet to-white rounded-md flex flex-col justify-center py-10 px-7">
            <div className="w-full flex flex-col gap-2 z-1">
              <h3 className="w-[90%] leading-[1.2] font-semibold">
                {contentSecondData.services[1].title}
              </h3>
              <p className="text-sm tracking-tight leading-[1.2]">
                {contentSecondData.services[1].description}
              </p>
              <div className="py-2">
                <ArrowRight />
              </div>
            </div>
          </div>
          <div className="shrink-0 w-70 h-80 relative col-span-1 bg-gradient-to-r from-custom-grey-1 to-white rounded-md flex flex-col justify-center py-10 px-7">
            <div className="w-full flex flex-col gap-2 z-1">
              <h3 className="w-[90%] leading-[1.2] font-semibold">
                {contentSecondData.services[2].title}
              </h3>
              <p className="text-sm tracking-tight leading-[1.2]">
                {contentSecondData.services[2].description}
              </p>
              <div className="py-2">
                <ArrowRight />
              </div>
            </div>
          </div>
          <div className="shrink-0 w-70 h-80 relative col-span-1 bg-custom-pink rounded-md flex flex-col justify-center py-10 px-7">
            <div className="w-full flex flex-col gap-2 z-1">
              <h3 className="w-[90%] leading-[1.2] font-semibold">
                {contentSecondData.services[3].title}
              </h3>
              <p className="text-sm tracking-tight leading-[1.2]">
                {contentSecondData.services[3].description}
              </p>
              <div className="py-2">
                <ArrowRight />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default B2BServices;
