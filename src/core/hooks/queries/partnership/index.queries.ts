// src/core/hooks/queries/partnership/index.queries.ts

import { QueryKeys } from '@/core/lib/query-keys';
import type { PartnershipFormData } from '@/core/types/partnership-form.type';
import partnershipService from '@/services/api/partnership.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

/**
 * Hook for submitting partnership form with toast notifications
 */
export const useSubmitPartnership = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PartnershipFormData) =>
      partnershipService.submitPartnershipForm(data),
    onSuccess: (response) => {
      // Invalidate and refetch partnership list queries
      queryClient.invalidateQueries({
        queryKey: QueryKeys.partnership.lists(),
      });

      // Show success toast
      toast.success('Partnership Request Submitted!', {
        description: "Thank you for your interest. We'll get back to you soon.",
        duration: 5000,
      });

      console.log('Partnership form submitted successfully:', response.data);
    },
    onError: (error) => {
      console.error('Partnership form submission failed:', error);

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
 * Hook for updating partnership with toast notifications
 */
export const useUpdatePartnership = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<PartnershipFormData>;
    }) => partnershipService.updatePartnership(id, data),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(
        QueryKeys.partnership.detail(variables.id),
        response
      );

      queryClient.invalidateQueries({
        queryKey: QueryKeys.partnership.lists(),
      });

      toast.success('Partnership updated successfully!');
    },
    onError: (error) => {
      console.error('Partnership update failed:', error);
      toast.error('Failed to update partnership', {
        description:
          error instanceof Error ? error.message : 'Please try again.',
      });
    },
  });
};

/**
 * Hook for deleting partnership with toast notifications
 */
export const useDeletePartnership = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => partnershipService.deletePartnership(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({
        queryKey: QueryKeys.partnership.detail(deletedId),
      });

      queryClient.invalidateQueries({
        queryKey: QueryKeys.partnership.lists(),
      });

      toast.success('Partnership deleted successfully!');
    },
    onError: (error) => {
      console.error('Partnership deletion failed:', error);
      toast.error('Failed to delete partnership', {
        description:
          error instanceof Error ? error.message : 'Please try again.',
      });
    },
  });
};
