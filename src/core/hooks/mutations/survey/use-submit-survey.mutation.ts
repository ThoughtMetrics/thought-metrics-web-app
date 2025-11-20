// src/core/hooks/mutations/survey/use-submit-survey.mutation.ts

import { useMutation } from '@tanstack/react-query';
import surveyService from '@/services/survey/survey.service';
import type { ISurveySubmission } from '@/core/types/survey.type';

export const useSubmitSurveyMutation = () => {
  return useMutation({
    mutationFn: ({
      surveyId,
      submission,
    }: {
      surveyId: string;
      submission: ISurveySubmission;
    }) => surveyService.submitResponse(surveyId, submission),
    // Toast messages are handled in the component with translations
  });
};
