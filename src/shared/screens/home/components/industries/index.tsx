import React, { useState } from 'react';
import { industryData, type IndustryTabData } from '@/core/constants/page-constants/home-industries-constant';
import { cn } from '@/core/utils/cn';
import { ArrowRed } from '@/assets';
import './industries.style.css';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import CustomButtonAtom from '@/shared/ui/atoms/custom-button';

const Industries: React.FC = () => {
  const [activeTab, setActiveTab] = useState<IndustryTabData>(
    industryData.industries[0]
  );
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [swiperRef, setSwiperRef] = useState<any | null>(null);

  const handleTabClick = (industry: IndustryTabData) => {
    setActiveTab(industry);
  };

  const handleSlideChange = (swiper: any) => {
    setActiveIndex(swiper.activeIndex);
    setActiveTab(industryData.industries[swiper.activeIndex]);
  };

  const handlePrevClick = () => {
    swiperRef?.slidePrev();
  };

  const handleNextClick = () => {
    swiperRef?.slideNext();
  };

  return (
    <section className="common-component bg-white text-black">
      <div className="common-container px-4 py-8 md:px-24 md:py-24 flex-col max-w-[1336px]!">
        <h2 className="md:text-3xl font-semibold leading-tight">
          {industryData.mainTitle}
        </h2>

        <div className="w-full pt-4 md:pt-8 flex gap-3">
          {/* Desktop View - Original Layout */}
          <div className="hidden md:flex w-full gap-3">
            <div
              key={activeTab.title}
              className={cn(
                'border border-black rounded-sm relative flex flex-col',
                'w-[75%] px-12 pt-24 pb-12 gap-28'
              )}
            >
              <div className="flex flex-col gap-6">
                <h3 className={cn('w-[80%] text-xl font-bold animate-fadeIn')}>
                  {activeTab.title}
                </h3>

                <div className="flex gap-6 animate-fadeIn">
                  <div className="w-[40%]">
                    <img
                      src={activeTab.image}
                      alt={activeTab.imageAlt}
                      className="w-full h-full rounded-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1 w-[40%] text-base">
                    <h4 className="font-semibold">{activeTab.subtitle}</h4>
                    <p className="leading-5">{activeTab.description}</p>
                    <ul className="leading-[1.2em] list-disc pl-4 pt-1 space-y-2">
                      {activeTab.bulletPoints.map((point, index) => (
                        <li key={index + point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-between text-base font-bold">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  {activeTab.tabNumber}
                </div>
                <div className="w-fit h-full flex items-center justify-end">
                  <CustomButtonAtom
                    label="See More"
                    path={activeTab.path}
                    className="h-10 px-8 py-2 text-black text-base"
                  />
                </div>
              </div>
            </div>

            <div className="w-[25%] flex flex-col justify-between font-semibold text-lg">
              {industryData.industries.map((industry) => (
                <button
                  key={industry.id}
                  className={`bg-neutral px-2 py-2 rounded hover:bg-primary hover:shadow-md hover:shadow-primary/50 ${
                    activeTab.id === industry.id
                      ? 'bg-primary shadow-md shadow-primary/50'
                      : ''
                  } ${industry.isMobile && 'hidden md:block'}`}
                  onClick={() => handleTabClick(industry)}
                >
                  <span
                    className={`${industry.shortTitle && 'hidden md:block'}`}
                  >
                    {industry.label}
                  </span>
                  {industry.shortTitle && (
                    <span className="md:hidden">{industry.shortTitle}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile View - Swiper Implementation */}
          <div className="md:hidden w-full">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={0}
              slidesPerView={1}
              onSlideChange={handleSlideChange}
              onSwiper={setSwiperRef}
              className="w-full industries-swiper"
            >
              {industryData.industries.map((industry) => (
                <SwiperSlide key={industry.id}>
                  <div
                    className={cn(
                      'border border-black rounded-sm relative flex flex-col',
                      'w-full px-2 py-4 gap-8'
                    )}
                  >
                    <div className="flex flex-col gap-2">
                      <h3 className={cn('w-[80%] text-sm font-semibold')}>
                        {industry.title}
                        <span>: {industry.subtitle}</span>
                      </h3>

                      <div className="flex flex-col gap-6">
                        <div className="w-full">
                          <img
                            src={industry.image}
                            alt={industry.imageAlt}
                            className="w-full h-full aspect-video rounded-sm"
                          />
                        </div>
                        <div className="flex flex-col gap-1 w-[90%] text-sm">
                          <ul className="leading-[1.2em] list-disc pl-4 space-y-2">
                            {industry.bulletPoints.map((point, index) => (
                              <li key={index + point}>{point}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between px-4 text-sm font-bold">
                      <div className="w-7 h-8 rounded-full bg-primary flex items-center justify-center">
                        {industry.tabNumber}
                      </div>
                      <div>
                        <div className="w-fit h-full flex items-center justify-end">
                          <CustomButtonAtom
                            label="See More"
                            path={industry.path}
                            className="h-8 px-4 py-2 text-black text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* Mobile Navigation Controls */}
        <div className="md:hidden flex items-center justify-between py-4">
          <button
            onClick={handlePrevClick}
            disabled={activeIndex === 0}
            className={cn(
              'w-7 h-8 bg-white border border-primary flex items-center justify-center text-primary transition-colors rounded',
              activeIndex !== 0 && 'bg-primary text-white'
            )}
          >
            <ArrowRed className="w-5 h-5 rotate-180 fill-current" />
          </button>
          <div className="text-[.85rem] font-semibold">
            {activeTab.title}: {activeTab.tabNumber}/11
          </div>
          <button
            onClick={handleNextClick}
            disabled={activeIndex === industryData.industries.length - 1}
            className={cn(
              'w-7 h-8 bg-white border border-primary flex items-center justify-center text-primary transition-colors rounded',
              activeIndex !== industryData.industries.length - 1 &&
                'bg-primary text-white'
            )}
          >
            <ArrowRed className="w-5 h-5 fill-current" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Industries;
