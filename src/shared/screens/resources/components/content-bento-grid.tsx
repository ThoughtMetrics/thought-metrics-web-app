import { useInfiniteBlogContentsQuery } from '@/core/hooks/queries/use-infinite-blog-contents.query';
import BentoGridOrganism from '@/shared/ui/organisms/bento-grid-organism';

const ContentBentoGrid: React.FC = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteBlogContentsQuery({
      pageSize: 12,
    });

  // Flatten all pages into a single array of blog items
  const allItems = data?.pages.flatMap((page) => page) ?? [];

  return (
    <BentoGridOrganism
      items={allItems}
      bgColor="bg-white"
      onLoadMore={() => void fetchNextPage()}
      hasMore={hasNextPage}
      isLoading={isLoading || isFetchingNextPage}
    />
  );
};

export default ContentBentoGrid;
