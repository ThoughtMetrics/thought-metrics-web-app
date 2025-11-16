// src/core/hooks/mutations/survey/use-save-draft.mutation.ts

import { useMutation } from '@tanstack/react-query';
import surveyService from '@/services/survey/survey.service';
import type { ISurveySubmission } from '@/core/types/survey.type';
import { toast } from 'sonner';

export const useSaveDraftMutation = () => {
  return useMutation({
    mutationFn: ({ surveyId, submission }: { surveyId: string; submission: ISurveySubmission }) =>
      surveyService.saveDraft(surveyId, submission),
    onSuccess: () => {
      toast.success('Draft saved successfully!');
    },
    onError: (error: any) => {
      toast.error(error.details.error.message || 'Failed to save draft');
    },
  });
};
