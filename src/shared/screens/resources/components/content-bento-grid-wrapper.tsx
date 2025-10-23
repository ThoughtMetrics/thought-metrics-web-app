import { QueryClientProvider } from '@tanstack/react-query';
import ContentBentoGrid from './content-bento-grid';
import { queryClient } from '@/core/lib/query-client';

const ContentBentoGridWrapper: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ContentBentoGrid />
    </QueryClientProvider>
  );
};

export default ContentBentoGridWrapper;
