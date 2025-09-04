import { ArrowRight, ResourcesIllustration } from '@/assets';
import { cn } from '@/core/utils/cn';

const BlogCard: React.FC<any> = ({ blog, className = '' }) => {
  return (
    <article
      className={cn(
        'snap-start snap-always w-[85%] relative shrink-0 backdrop-blur-[40px] overflow-hidden group hover:shadow-xl transition-shadow duration-300 md:w-auto',
        className
      )}
    >
      <ResourcesIllustration className="absolute w-full h-full" />
      {/* Image overlay */}
      <div className="w-full h-full absolute inset-0 overflow-hidden">
        <div
          className="w-full h-full origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-700 ease-out bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${blog.src})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        </div>
      </div>

      {/* Content */}
      <div className="relative p-6 xl:p-5 xxl:px-6 xxl:py-4 flex flex-col">
        <header>
          <span className="text-sm font-medium text-gray-500 group-hover:text-white/80 transition-colors duration-300">
            {blog.type}
          </span>
          <h2 className="font-semibold text-md mt-3 mb-4 leading-tight text-gray-900 group-hover:text-white transition-colors duration-300 line-clamp-2">
            {blog.label}
          </h2>
          <p className="text-md mb-4 text-gray-600 group-hover:text-white/90 transition-colors duration-300 line-clamp-4">
            {blog.description}
          </p>
        </header>

        <a
          href={blog.link}
          className="text-primary group-hover:text-white font-medium text-sm flex items-center justify-between hover:gap-6 transition-all duration-300"
        >
          Read the {blog.type.toLowerCase()}
          <ArrowRight className="w-6 h-6" />
        </a>
      </div>
    </article>
  );
};

export default BlogCard;
