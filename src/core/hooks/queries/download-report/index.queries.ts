// src/core/hooks/queries/download-report/index.queries.ts

import { QueryKeys } from '@/core/lib/query-keys';
import type { DownloadReportFormData } from '@/core/types/report-download-form.type';
import downloadReportService from '@/services/api/download-report.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

/**
 * Hook for submitting download report form with toast notifications
 */
export const useSubmitDownloadReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DownloadReportFormData) =>
      downloadReportService.submitDownloadReportForm(data),
    onSuccess: (response) => {
      // Invalidate and refetch download report list queries
      queryClient.invalidateQueries({
        queryKey: QueryKeys.downloadReport.lists(),
      });

      // Show success toast
      toast.success('Report Download Requested!', {
        description: 'Your report will be sent to your email shortly.',
        duration: 5000,
      });

      console.log(
        'Download report form submitted successfully:',
        response.data
      );
    },
    onError: (error: any) => {
      console.error('Download report form submission failed:', error);

      // Show error toast with specific message
      const errorMessage = error
        ? error.details.error.message
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
 * Hook for updating download report with toast notifications
 */
export const useUpdateDownloadReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<DownloadReportFormData>;
    }) => downloadReportService.updateDownloadReport(id, data),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(
        QueryKeys.downloadReport.detail(variables.id),
        response
      );

      queryClient.invalidateQueries({
        queryKey: QueryKeys.downloadReport.lists(),
      });

      toast.success('Download report updated successfully!');
    },
    onError: (error: any) => {
      console.error('Download report update failed:', error);
      toast.error('Failed to update download report', {
        description: error ? error.details.error.message : 'Please try again.',
      });
    },
  });
};

/**
 * Hook for deleting download report with toast notifications
 */
export const useDeleteDownloadReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => downloadReportService.deleteDownloadReport(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({
        queryKey: QueryKeys.downloadReport.detail(deletedId),
      });

      queryClient.invalidateQueries({
        queryKey: QueryKeys.downloadReport.lists(),
      });

      toast.success('Download report deleted successfully!');
    },
    onError: (error: any) => {
      console.error('Download report deletion failed:', error);
      toast.error('Failed to delete download report', {
        description: error ? error.details.error.message : 'Please try again.',
      });
    },
  });
};
