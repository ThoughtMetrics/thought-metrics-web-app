import React from 'react';
import { carouselData } from '@/core/constants/page-constants/home-hero-carousel-constant';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';

// Import custom styles
import './hero-carousel.style.css';
import CustomButtonAtom from '@/shared/ui/atoms/custom-button';

const HeroCarousel: React.FC = () => {
  return (
    <section className="common-component">
      {/* Desktop View */}
      <div className="common-container relative hidden! md:block! w-full">
        <Swiper
          modules={[Pagination, Autoplay, EffectFade]}
          slidesPerView={1}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          pagination={{
            clickable: true,
            el: '.custom-pagination',
            bulletClass: 'custom-bullet',
            bulletActiveClass: 'custom-bullet-active',
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: true,
          }}
          className="w-full min-h-72 xl:min-h-120 xxl:min-h-[38rem] wide:min-h-[45rem]"
        >
          {carouselData.map((item, index) => (
            <SwiperSlide
              key={index + item.label}
              className="flex! items-stretch!"
            >
              <div className="grid grid-cols-[48%_52%] w-full h-full">
                {/* Image Section */}
                <div className="relative h-full w-full flex justify-end items-center">
                  <div className="w-120 xxl:w-fit px-16 xxl:px-[8rem] py-8">
                    <img src={item.src} alt={item.alt} />
                  </div>
                </div>

                {/* Text Section */}
                <div className="flex items-center justify-start">
                  <div className="text-3xl xl:text-4xl xxl:text-[3rem] wide:text-5xl font-bold text-black">
                    {item.label.split('\n').map((line, idx) => (
                      <p key={idx + 'label'}>
                        {line.split('.').flatMap((part, i, arr) => [
                          part,
                          i < arr.length - 1 && (
                            <span key={i + 'label'} className="text-primary">
                              .
                            </span>
                          ),
                        ])}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Pagination */}
        <div className="custom-pagination absolute flex gap-3 justify-center xl:bottom-8! xxl:!bottom-10 wide:!bottom-12 left-1/2 -translate-x-1/2 z-10"></div>
      </div>
      {/* Mobile View */}
      <div className="common-container flex-col gap-4 md:hidden! px-6 py-8 justify-start!">
        <div className="text-3xl font-bold text-black">
          {carouselData[0]?.mobileLabel.split('\n').map((line, idx) => (
            <p key={idx + 'label'}>
              {line.split('.').flatMap((part, i, arr) => [
                part,
                i < arr.length - 1 && (
                  <span key={i + 'label'} className="text-primary">
                    .
                  </span>
                ),
              ])}
            </p>
          ))}
        </div>
        <CustomButtonAtom label={carouselData[0].buttonLabel} />

        <img
          src={carouselData[0].src}
          alt={carouselData[0].alt}
          className="pt-10 w-full h-70 object-contain scale-100 py-0"
        />
      </div>
    </section>
  );
};

export default HeroCarousel;
