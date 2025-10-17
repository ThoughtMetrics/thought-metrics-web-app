import BlogOrganism from '@/shared/ui/organisms/blog-organism';
import { useContentStore } from '@/core/stores/content.store';
import { ContentType } from '@/core/types/content.type';
import BlogSkeleton from '@/shared/components/blog-skeleton';

interface BlogData {
  title: string;
  items: {
    id: number;
    type: string;
    category: string;
    label: string;
    description: string;
    link: string;
    src: string;
  }[];
}

interface BlogsProps {
  blogData?: BlogData | null;
}

const Blogs: React.FC<BlogsProps> = ({ blogData }) => {
  const { updateContentFilter, clearFilters } = useContentStore();

  const handleFilterChange = () => {
    updateContentFilter('type', ContentType.BLOG);
  };

  // If no blog data provided (SSR failed or not available), show skeleton
  if (!blogData) {
    return <BlogSkeleton />;
  }

  return (
    <>
      <div className="hidden gap-4 mb-4">
        <button className="bg-black text-white" onClick={handleFilterChange}>
          Filter Articles
        </button>
        <button className="bg-black text-white" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>
      <BlogOrganism data={blogData} bgColor="bg-primary-lighter" />
    </>
  );
};

export default Blogs;
