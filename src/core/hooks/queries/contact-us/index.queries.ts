// src/core/hooks/contact-us/index.queries.ts

import { QueryKeys } from '@/core/lib/query-keys';
import type { ContactFormData } from '@/core/types/contact-us.type';
import contactUsService from '@/services/api/contact-us.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

/**
 * Hook for submitting contact form with toast notifications
 */
export const useSubmitContactForm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ContactFormData) =>
      contactUsService.submitContactForm(data),
    onSuccess: (response) => {
      // Invalidate and refetch contact list queries
      queryClient.invalidateQueries({
        queryKey: QueryKeys.contactUs.lists(),
      });

      // Show success toast
      toast.success('Message sent successfully!', {
        description: "We'll get back to you soon.",
        duration: 5000,
      });

      console.log('Contact form submitted successfully:', response.data);
    },
    onError: (error) => {
      console.error('Contact form submission failed:', error);

      // Show error toast with specific message
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to send message. Please try again.';

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
 * Hook for updating contact with toast notifications
 */
export const useUpdateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ContactFormData>;
    }) => contactUsService.updateContactUs(id, data),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(
        QueryKeys.contactUs.detail(variables.id),
        response
      );

      queryClient.invalidateQueries({
        queryKey: QueryKeys.contactUs.lists(),
      });

      toast.success('Contact updated successfully!');
    },
    onError: (error) => {
      console.error('Contact update failed:', error);
      toast.error('Failed to update contact', {
        description:
          error instanceof Error ? error.message : 'Please try again.',
      });
    },
  });
};

/**
 * Hook for deleting contact with toast notifications
 */
export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => contactUsService.deleteContactUs(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({
        queryKey: QueryKeys.contactUs.detail(deletedId),
      });

      queryClient.invalidateQueries({
        queryKey: QueryKeys.contactUs.lists(),
      });

      toast.success('Contact deleted successfully!');
    },
    onError: (error) => {
      console.error('Contact deletion failed:', error);
      toast.error('Failed to delete contact', {
        description:
          error instanceof Error ? error.message : 'Please try again.',
      });
    },
  });
};
