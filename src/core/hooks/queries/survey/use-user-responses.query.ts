// src/core/hooks/queries/survey/use-user-responses.query.ts

import { useQuery } from '@tanstack/react-query';
import surveyService from '@/services/survey/survey.service';

/**
 * @deprecated This hook is no longer needed. User response status is now included
 * in the survey list response via the userResponse field. Use useSurveyListQuery instead.
 */
export const useUserResponsesQuery = () => {
  return useQuery({
    queryKey: ['surveys', 'user-responses'],
    queryFn: () => surveyService.getUserResponses(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: false, // Don't retry if user is not authenticated
  });
};
