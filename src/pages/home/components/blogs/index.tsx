import BlogOrganism from '@/shared/ui/organisms/blog-organism';
import { useContentStore } from '@/core/stores/content.store';
import { ContentType } from '@/core/types/content.type';
import { useBlogData } from '@/core/hooks/use-blog-data';
import { Suspense } from 'react';
import { blogPageData } from './blogs.constant';

// Loading skeleton
const BlogSkeleton: React.FC = () => (
  <div className="bg-primary-lighter py-12">
    <div className="container mx-auto px-4">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-8 animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const BlogsContent: React.FC = () => {
  const { updateContentFilter, clearFilters } = useContentStore();

  const { blogData, loading, error } = useBlogData({
    title: blogPageData.title,
    type: [],
    limit: 4,
  });

  const handleFilterChange = () => {
    updateContentFilter('type', ContentType.BLOG);
  };

  if (loading) return <BlogSkeleton />;

  if (error) {
    return (
      <div className="bg-primary-lighter py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">Failed to load resources</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="hidden gap-4 mb-4">
        <button className='bg-black text-white' onClick={handleFilterChange}>
          Filter Articles
        </button>
        <button className='bg-black text-white' onClick={clearFilters}>
          Clear Filters
        </button>
      </div>
      <BlogOrganism data={blogData} bgColor="bg-primary-lighter" />
    </>
  );
};

const Blogs: React.FC = () => {
  return (
    <Suspense fallback={<BlogSkeleton />}>
      <BlogsContent />
    </Suspense>
  );
};

export default Blogs;

// import React from 'react';
// import { blogPageData } from './blogs.constant';
// import BlogOrganism from '@/shared/ui/organisms/blog-organism';

// const Blogs: React.FC = () => {
//   return <BlogOrganism data={blogPageData} bgColor="bg-primary-lighter" />;
// };

// export default Blogs;
