// src/core/hooks/queries/survey/use-survey-details.query.ts

import { useQuery } from '@tanstack/react-query';
import surveyService from '@/services/survey/survey.service';

export const useSurveyDetailsQuery = (surveyId: string) => {
  return useQuery({
    queryKey: ['surveys', 'details', surveyId],
    queryFn: () => surveyService.getSurveyDetails(surveyId),
    enabled: !!surveyId,
  });
};
