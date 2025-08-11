import React from 'react';
import { blogPageData } from './blogs.constant';
import BlogCard from '@/shared/ui/molecules/blog-card';

const Blogs: React.FC = () => {
  return (
    <section className="common-component bg-primary-lighter text-black">
      <div className="common-container px-6 pt-8 pb-12 md:px-24 md:pt-18 md:pb-24 !max-w-[1336px] flex-col">
        <h2 className="text-[1.1rem] md:text-3xl font-semibold leading-[1.25] tracking-normal">
          {blogPageData.title}
        </h2>
        <div className="snap-x snap-mandatory scroll-smooth hide-scrollbar h-fit pt-6 flex overflow-x-scroll gap-3 md:overflow-auto md:grid md:grid-cols-4 md:gap-6 md:snap-none">
          {blogPageData.cards.map((card) => (
            <BlogCard blog={card} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blogs;
