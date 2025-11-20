// src/core/hooks/queries/survey/use-survey-details.query.ts

import { useQuery } from '@tanstack/react-query';
import surveyService from '@/services/survey/survey.service';
import { useCurrentLanguage } from '@/core/stores/language.store';

export const useSurveyDetailsQuery = (surveyId: string) => {
  // Get current language from store
  const language = useCurrentLanguage();

  return useQuery({
    queryKey: ['surveys', 'details', surveyId, language],
    queryFn: () => surveyService.getSurveyDetails(surveyId, language),
    enabled: !!surveyId,
  });
};
