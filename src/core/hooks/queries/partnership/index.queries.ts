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

      console.debug('Partnership form submitted successfully:', response.data);
    },
    onError: (error: any) => {
      console.error('Partnership form submission failed:', error);

      // Extract error message from API response
      let errorMessage = 'Failed to submit form. Please try again.';

      if (error?.error?.details && Array.isArray(error.error.details)) {
        // Format validation errors nicely
        errorMessage = error.error.details
          .map((detail: any) => detail.message)
          .join('. ');
      } else if (error?.error?.message) {
        errorMessage = error.error.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error('Submission Failed', {
        description: errorMessage,
        duration: 6000,
        action: {
          label: 'Retry',
          onClick: () => {
            console.debug('Retry clicked');
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
    onError: (error: any) => {
      console.error('Partnership update failed:', error);

      let errorMessage = 'Please try again.';
      if (error?.error?.details && Array.isArray(error.error.details)) {
        errorMessage = error.error.details
          .map((detail: any) => detail.message)
          .join('. ');
      } else if (error?.error?.message) {
        errorMessage = error.error.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error('Failed to update partnership', {
        description: errorMessage,
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
    onError: (error: any) => {
      console.error('Partnership deletion failed:', error);

      let errorMessage = 'Please try again.';
      if (error?.error?.message) {
        errorMessage = error.error.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error('Failed to delete partnership', {
        description: errorMessage,
      });
    },
  });
};
