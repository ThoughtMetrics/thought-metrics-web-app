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

export default BlogSkeleton;
