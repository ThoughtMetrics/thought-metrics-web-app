// src/core/hooks/mutations/survey/use-edit-survey-response.mutation.ts

import { useMutation } from '@tanstack/react-query';
import surveyService from '@/services/survey/survey.service';
import type { ISurveySubmission } from '@/core/types/survey.type';

export const useEditSurveyResponseMutation = () => {
  return useMutation({
    mutationFn: ({
      surveyId,
      submission,
    }: {
      surveyId: string;
      submission: ISurveySubmission;
    }) => surveyService.editMyResponse(surveyId, submission),
  });
};
