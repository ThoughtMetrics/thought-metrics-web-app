import { cn } from '@/core/utils/cn';
import BentoGridCard, { type BentoCardSize } from '../../atoms/bento-grid-card';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

interface BlogItem {
  id: number;
  type: string;
  category: string;
  label: string;
  description: string;
  link: string;
  src: string;
  publishedDate?: string | null;
}

interface BentoGridOrganismProps {
  items: BlogItem[];
  bgColor?: string;
  className?: string;
  titleClassName?: string;
  title?: string;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
}

// Pattern for bento grid layout - repeats every 8 cards
// This creates the asymmetric visual pattern
const BENTO_PATTERN: BentoCardSize[] = [
  'wide', // 0: Tall on left
  'medium', // 1: Medium top right
  'tall', // 2: Medium
  'tall', // 3: Tall on far right
  'wide', // 4: Medium below tall
  'wide', // 5: Wide in center
  'medium', // 6: Wide at bottom
];

const BentoGridOrganism: React.FC<BentoGridOrganismProps> = ({
  items,
  bgColor = 'bg-white',
  className,
  titleClassName,
  title,
  onLoadMore,
  hasMore = false,
  isLoading = false,
}) => {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Infinite scroll observer
  useEffect(() => {
    if (!onLoadMore || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          onLoadMore();
        }
      },
      {
        root: null,
        rootMargin: '400px', // Trigger 400px before reaching the bottom
        threshold: 0,
      }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [onLoadMore, hasMore, isLoading]);

  const getCardSize = (index: number): BentoCardSize => {
    return BENTO_PATTERN[index % BENTO_PATTERN.length];
  };

  // Format published date
  const formatDate = (dateString?: string | null): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Split items: first 15 for bento grid (1 hero + 14 cards), rest for list view
  const bentoItems = items.slice(0, 15);
  const listItems = items.slice(15);
  const [firstItem, ...remainingBentoItems] = bentoItems;

  return (
    <section className={`common-component text-black ${bgColor}`}>
      <div
        className={cn(
          'common-container px-6 pt-8 pb-12 md:px-24 md:pt-18 md:pb-24 !max-w-[1336px] flex-col',
          className
        )}
      >
        {title && (
          <div className="flex justify-between items-center w-full mb-6">
            <h2
              className={cn(
                'text-[1.1rem] md:text-3xl font-semibold leading-[1.25] tracking-normal',
                titleClassName
              )}
            >
              {title}
            </h2>
          </div>
        )}

        {/* Bento Grid Layout - First 15 Items */}
        {bentoItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[200px]">
            <BentoGridCard blog={firstItem} size="full" />
            {remainingBentoItems.map((blog, index) => (
              <BentoGridCard
                key={`${blog.id}-${index}`}
                blog={blog}
                size={getCardSize(index)}
              />
            ))}
          </div>
        )}

        {/* List View - Remaining Items */}
        {listItems.length > 0 && (
          <div className="mt-8 md:mt-12">
            <div className="grid grid-cols-1 gap-4">
              {listItems.map((blog) => (
                <Link
                  key={blog.id}
                  to={blog.link}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 hover:text-primary transition-colors">
                      {blog.label}
                    </h3>
                    {blog.publishedDate && (
                      <p className="text-sm text-gray-500">
                        {formatDate(blog.publishedDate)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <span className="px-3 py-1 bg-gray-100 rounded-full">
                      {blog.type}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-pulse flex space-x-4">
              <div className="h-3 w-3 bg-primary rounded-full animate-bounce"></div>
              <div className="h-3 w-3 bg-primary rounded-full animate-bounce delay-100"></div>
              <div className="h-3 w-3 bg-primary rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}

        {/* Intersection observer trigger */}
        {hasMore && <div ref={loadMoreRef} className="h-4" />}

        {/* End of content message */}
        {!hasMore && items.length > 0 && (
          <div className="text-center py-8 text-gray-500">
            No more articles to load
          </div>
        )}

        {/* Empty state */}
        {!isLoading && items.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No articles found
          </div>
        )}
      </div>
    </section>
  );
};

export default BentoGridOrganism;
