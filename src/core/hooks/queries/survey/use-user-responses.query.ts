// src/core/hooks/queries/survey/use-user-responses.query.ts

import { useQuery } from '@tanstack/react-query';
import surveyService from '@/services/survey/survey.service';

export const useUserResponsesQuery = () => {
  return useQuery({
    queryKey: ['surveys', 'user-responses'],
    queryFn: () => surveyService.getUserResponses(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: false, // Don't retry if user is not authenticated
  });
};
