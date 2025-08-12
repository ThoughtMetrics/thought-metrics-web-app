import { cn } from '@/core/utils/cn';
import BlogCard from '../../molecules/blog-card';

const BlogOrganism: React.FC<any> = ({ data, bgColor, className }) => {
  return (
    <section
      className={`common-component text-black ${bgColor}`}
    >
      <div
        className={cn(
          'common-container px-6 pt-8 pb-12 md:px-24 md:pt-18 md:pb-24 !max-w-[1336px] flex-col',
          className
        )}
      >
        <h2 className="text-[1.1rem] md:text-3xl font-semibold leading-[1.25] tracking-normal">
          {data.title}
        </h2>
        <div className="snap-x snap-mandatory scroll-smooth hide-scrollbar h-fit pt-6 flex overflow-x-scroll gap-3 md:overflow-auto md:grid md:grid-cols-4 md:gap-6 md:snap-none">
          {data.items.map((blog: any) => (
            <BlogCard blog={blog} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogOrganism;
