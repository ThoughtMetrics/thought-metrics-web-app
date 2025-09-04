import { contentKeys } from "@/core/lib/query-keys";
import { useContentStore } from "@/core/stores/content.store";
import { contentService } from "@/services/api/content.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";


// Example mutation for content actions (if you have write permissions)
export const useContentActions = () => {
  const queryClient = useQueryClient();
  const { setSelectedContent } = useContentStore();

  const selectContent = useMutation({
    mutationFn: async (contentId: string) => {
      // Fetch and set selected content
      const response = await contentService.getContentById(contentId);
      return response.data;
    },
    onSuccess: (content) => {
      setSelectedContent(content);
      // Optionally invalidate related queries
      queryClient.invalidateQueries({
        queryKey: contentKeys.related(content.documentId),
      });
    },
  });

  return {
    selectContent,
  };
};
