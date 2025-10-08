import { ArrowRight, ResourcesIllustration } from '@/assets';
import { cn } from '@/core/utils/cn';
import { Link } from 'react-router-dom';

export type BentoCardSize =
  | 'small'
  | 'medium'
  | 'large'
  | 'wide'
  | 'tall'
  | 'full';

interface BentoGridCardProps {
  blog: {
    id: number;
    type: string;
    category: string;
    label: string;
    description: string;
    link: string;
    src: string;
  };
  size?: BentoCardSize;
  className?: string;
}

const sizeClasses: Record<BentoCardSize, string> = {
  small: 'md:col-span-1 md:row-span-1',
  medium: 'md:col-span-1 md:row-span-1',
  large: 'md:col-span-2 md:row-span-2',
  full: 'md:col-span-4 md:row-span-2',
  wide: 'md:col-span-2 md:row-span-1',
  tall: 'md:col-span-1 md:row-span-2',
};

const BentoGridCard: React.FC<BentoGridCardProps> = ({
  blog,
  size = 'medium',
  className = '',
}) => {
  return (
    <Link
      to={blog.link}
      className={cn(
        'relative backdrop-blur-[40px] overflow-hidden group min-h-[280px] md:min-h-0',
        sizeClasses[size],
        className
      )}
    >
      <article className="h-full w-full group-hover:scale-[1.02] transition-transform duration-300 ease-in-out relative flex flex-col">
        <ResourcesIllustration className="absolute w-full h-full" />

        {/* Image overlay */}
        <div className="w-full h-full absolute inset-0">
          <div
            className="w-full h-full origin-bottom scale-y-100 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${blog.src})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          </div>
        </div>

        {/* Content */}
        <div className="relative h-full p-6 xl:p-5 xxl:px-6 xxl:py-4 flex flex-col">
          <header className="flex-1">
            <span className="text-sm font-medium text-white/80">
              {blog.type}
            </span>
            <h2
              className={cn(
                'font-semibold text-md mt-3 mb-4 leading-tight text-white',
                size === 'large' || size === 'full' || size === 'tall' ? 'line-clamp-3' : 'line-clamp-1'
              )}
            >
              {blog.label}
            </h2>
            <p
              className={cn(
                'text-md mb-4 text-white/90',
                size === 'large' || size === 'tall'
                  ? 'line-clamp-6'
                  : 'line-clamp-2'
              )}
            >
              {blog.description}
            </p>
          </header>

          <div className="text-primary font-medium text-sm flex items-center justify-between">
            Read the {blog.type.toLowerCase()}
            <ArrowRight className="w-6 h-6" />
          </div>
        </div>
      </article>
      <div className="absolute bottom-0 left-0 right-0 h-1 w-0 group-hover:w-full transition-all duration-300 bg-primary"></div>
    </Link>
  );
};

export default BentoGridCard;
