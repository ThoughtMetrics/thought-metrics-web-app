import { cn } from '@/core/utils/cn';
import BlogCard from '../../molecules/blog-card';
import { ArrowRed } from '@/assets';

const BlogOrganism: React.FC<any> = ({
  data,
  bgColor,
  className,
  titleClassName,
}) => {
  return (
    <section className={`common-component text-black ${bgColor}`}>
      <div
        className={cn(
          'common-container px-6 pt-8 pb-12 md:px-24 md:pt-18 md:pb-24 !max-w-[1336px] flex-col',
          className
        )}
      >
        <div className="flex justify-between items-center w-full">
          <h2
            className={cn(
              'text-[1.1rem] md:text-3xl font-semibold leading-[1.25] tracking-normal',
              titleClassName
            )}
          >
            {data.title}
          </h2>

          {data.categoryPath && (
            <ArrowRed
              className={`fill-current text-primary w-6 h-6 md:w-8 md:h-8 transition-transform duration-300 ease-in-out`}
            />
          )}
        </div>
        <div className="snap-x snap-mandatory scroll-smooth hide-scrollbar h-fit pt-6 flex overflow-x-scroll gap-3 md:overflow-auto md:grid md:grid-cols-4 md:gap-6 md:snap-none">
          {data.items.map((blog: any, index: number) => (
            <BlogCard key={index + blog.id} blog={blog} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogOrganism;
