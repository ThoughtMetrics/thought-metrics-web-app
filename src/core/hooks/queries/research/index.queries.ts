// src/core/hooks/queries/research/index.queries.ts

import { QueryKeys } from '@/core/lib/query-keys';
import type { ResearchFormData } from '@/core/types/start-research-item.type';
import researchService from '@/services/api/research.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

/**
 * Hook for submitting research form with toast notifications
 */
export const useSubmitResearch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ResearchFormData) =>
      researchService.submitResearchForm(data),
    onSuccess: (response) => {
      // Invalidate and refetch research list queries
      queryClient.invalidateQueries({
        queryKey: QueryKeys.research.lists(),
      });

      // Show success toast
      toast.success('Research Request Submitted!', {
        description: "Thank you! We'll get back to you soon with a proposal.",
        duration: 5000,
      });

      console.log('Research form submitted successfully:', response.data);
    },
    onError: (error) => {
      console.error('Research form submission failed:', error);

      // Show error toast with specific message
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to submit form. Please try again.';

      toast.error('Submission failed', {
        description: errorMessage,
        duration: 6000,
        action: {
          label: 'Retry',
          onClick: () => {
            // You can add retry logic here if needed
            console.log('Retry clicked');
          },
        },
      });
    },
    retry: 1,
    retryDelay: 2000,
  });
};

/**
 * Hook for updating research with toast notifications
 */
export const useUpdateResearch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ResearchFormData>;
    }) => researchService.updateResearch(id, data),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(
        QueryKeys.research.detail(variables.id),
        response
      );

      queryClient.invalidateQueries({
        queryKey: QueryKeys.research.lists(),
      });

      toast.success('Research updated successfully!');
    },
    onError: (error) => {
      console.error('Research update failed:', error);
      toast.error('Failed to update research', {
        description:
          error instanceof Error ? error.message : 'Please try again.',
      });
    },
  });
};

/**
 * Hook for deleting research with toast notifications
 */
export const useDeleteResearch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => researchService.deleteResearch(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({
        queryKey: QueryKeys.research.detail(deletedId),
      });

      queryClient.invalidateQueries({
        queryKey: QueryKeys.research.lists(),
      });

      toast.success('Research deleted successfully!');
    },
    onError: (error) => {
      console.error('Research deletion failed:', error);
      toast.error('Failed to delete research', {
        description:
          error instanceof Error ? error.message : 'Please try again.',
      });
    },
  });
};
