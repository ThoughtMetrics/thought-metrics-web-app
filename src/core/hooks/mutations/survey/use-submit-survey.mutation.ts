// src/core/hooks/mutations/survey/use-submit-survey.mutation.ts

import { useMutation } from '@tanstack/react-query';
import surveyService from '@/services/survey/survey.service';
import type { ISurveySubmission } from '@/core/types/survey.type';
import { toast } from 'sonner';

export const useSubmitSurveyMutation = () => {
  return useMutation({
    mutationFn: ({
      surveyId,
      submission,
    }: {
      surveyId: string;
      submission: ISurveySubmission;
    }) => surveyService.submitResponse(surveyId, submission),
    onSuccess: () => {
      toast.success(
        'Survey submitted successfully! You will be contacted soon.'
      );
    },
    onError: (error: any) => {
      console.log('Sur Sub: ', JSON.stringify(error.message));

      toast.error(error.message || 'Failed to submit survey');
    },
  });
};
