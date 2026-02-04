// src/core/hooks/queries/survey/use-survey-list.query.ts

import { useQuery } from '@tanstack/react-query';
import surveyService from '@/services/survey/survey.service';
import { useCurrentLanguage } from '@/core/stores/language.store';

export const useSurveyListQuery = (params?: {
  status?: string;
  visibility?: string;
  type?: string;
  page?: number;
  limit?: number;
  search?: string;
}) => {
  // Get current language from store
  const language = useCurrentLanguage();

  // Include language in params
  const queryParams = {
    ...params,
    lang: language
  };

  return useQuery({
    queryKey: ['surveys', 'list', queryParams],
    queryFn: () => surveyService.listPublicSurveys(queryParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
