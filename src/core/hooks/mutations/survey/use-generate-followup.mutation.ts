// src/core/hooks/mutations/survey/use-generate-followup.mutation.ts

import { useMutation } from '@tanstack/react-query';
import surveyService from '@/services/survey/survey.service';

export const useGenerateFollowupMutation = () => {
  return useMutation({
    mutationFn: ({
      surveyId,
      questionId,
      sourceAnswer,
    }: {
      surveyId: string;
      questionId: string;
      sourceAnswer: string;
    }) => surveyService.generateFollowup(surveyId, questionId, sourceAnswer),
  });
};
