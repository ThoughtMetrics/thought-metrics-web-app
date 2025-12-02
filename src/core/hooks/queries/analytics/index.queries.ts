// src/core/hooks/queries/analytics/index.queries.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import analyticsService from '@/services/api/analytics.service';
import trackingLinkService, { type CreateTrackingLinkData } from '@/services/api/tracking-link.service';
import { QueryKeys } from '@/core/lib/query-keys';
import { toast } from 'sonner';

/**
 * Hook to fetch analytics overview data
 */
export const useAnalyticsOverview = () => {
  return useQuery({
    queryKey: QueryKeys.analytics.overview(),
    queryFn: () => analyticsService.getOverview(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to fetch all tracking links
 */
export const useTrackingLinks = () => {
  return useQuery({
    queryKey: QueryKeys.analytics.links(),
    queryFn: () => trackingLinkService.getTrackingLinks(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

/**
 * Hook to fetch recent visitors
 */
export const useVisitors = () => {
  return useQuery({
    queryKey: QueryKeys.analytics.visitors(),
    queryFn: () => analyticsService.getVisitors(),
    staleTime: 1000 * 60 * 1, // 1 minute
  });
};

/**
 * Hook to fetch a single tracking link by ID
 */
export const useTrackingLinkById = (id: string) => {
  return useQuery({
    queryKey: QueryKeys.analytics.linkDetail(id),
    queryFn: () => trackingLinkService.getTrackingLinkById(id),
    enabled: !!id,
  });
};

/**
 * Hook to create a new tracking link
 */
export const useCreateTrackingLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTrackingLinkData) => trackingLinkService.createTrackingLink(data),
    onSuccess: (response) => {
      // Invalidate tracking links list
      queryClient.invalidateQueries({
        queryKey: QueryKeys.analytics.links(),
      });

      toast.success('Tracking Link Created!', {
        description: `Short code: ${response.data.shortCode}`,
        duration: 5000,
      });

      console.debug('Tracking link created successfully:', response.data);
    },
    onError: (error: any) => {
      console.error('Tracking link creation failed:', error);

      const errorMessage = error?.message || 'Failed to create tracking link. Please try again.';

      toast.error('Creation Failed', {
        description: errorMessage,
        duration: 6000,
      });
    },
  });
};

/**
 * Hook to update a tracking link
 */
export const useUpdateTrackingLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTrackingLinkData> }) =>
      trackingLinkService.updateTrackingLink(id, data),
    onSuccess: (response, variables) => {
      // Update specific link in cache
      queryClient.setQueryData(
        QueryKeys.analytics.linkDetail(variables.id),
        response
      );

      // Invalidate links list
      queryClient.invalidateQueries({
        queryKey: QueryKeys.analytics.links(),
      });

      toast.success('Tracking link updated successfully!');
    },
    onError: (error: any) => {
      console.error('Tracking link update failed:', error);
      toast.error('Failed to update tracking link', {
        description: error?.message || 'Please try again.',
      });
    },
  });
};

/**
 * Hook to delete a tracking link
 */
export const useDeleteTrackingLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => trackingLinkService.deleteTrackingLink(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: QueryKeys.analytics.linkDetail(deletedId),
      });

      // Invalidate links list
      queryClient.invalidateQueries({
        queryKey: QueryKeys.analytics.links(),
      });

      toast.success('Tracking link deleted successfully!');
    },
    onError: (error: any) => {
      console.error('Tracking link deletion failed:', error);
      toast.error('Failed to delete tracking link', {
        description: error?.message || 'Please try again.',
      });
    },
  });
};
