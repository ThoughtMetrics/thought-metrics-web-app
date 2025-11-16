// src/core/hooks/queries/survey/use-survey-list.query.ts

import { useQuery } from '@tanstack/react-query';
import surveyService from '@/services/survey/survey.service';

export const useSurveyListQuery = (params?: {
  status?: string;
  visibility?: string;
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['surveys', 'list', params],
    queryFn: () => surveyService.listPublicSurveys(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
