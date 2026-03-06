// src/core/hooks/mutations/survey-template.mutations.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import surveyService from '@/services/survey/survey.service';
import { QueryKeys } from '@/core/lib/query-keys';
import type {
  ISurveyTemplateCreateRequest,
  ISurveyTemplateUpdateRequest,
  ISurveyPublishRequest,
  ISurveyUpdateRequest,
} from '@/core/types/survey-builder.type';

export const useCreateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ISurveyTemplateCreateRequest) => surveyService.createTemplate(data),
    onSuccess: (res) => {
      void queryClient.invalidateQueries({ queryKey: QueryKeys.surveyTemplates.lists() });
      toast.success('Template created');
      if (res.data?._id) {
        window.location.href = `/admin/survey-builder/${res.data._id}`;
      }
    },
    onError: (e: Error) => toast.error(e.message),
    retry: 1,
  });
};

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ISurveyTemplateUpdateRequest }) =>
      surveyService.updateTemplate(id, data),
    onSuccess: (res, { id }) => {
      if (res.data) {
        queryClient.setQueryData(QueryKeys.surveyTemplates.detail(id), res);
      }
      void queryClient.invalidateQueries({ queryKey: QueryKeys.surveyTemplates.lists() });
      toast.success('Saved');
    },
    onError: (e: Error) => toast.error(e.message),
    retry: 1,
  });
};

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => surveyService.deleteTemplate(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: QueryKeys.surveyTemplates.detail(id) });
      void queryClient.invalidateQueries({ queryKey: QueryKeys.surveyTemplates.lists() });
      toast.success('Deleted');
    },
    onError: (e: Error) => toast.error(e.message),
  });
};

export const usePublishSurvey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ISurveyPublishRequest) => surveyService.publishSurvey(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QueryKeys.surveysAdmin.lists() });
      toast.success('Survey published');
      window.location.href = '/admin/surveys';
    },
    onError: (e: Error) => toast.error(e.message),
  });
};

export const useUpdateSurveyInstance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ISurveyUpdateRequest }) =>
      surveyService.updateSurveyInstance(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QueryKeys.surveysAdmin.lists() });
      toast.success('Survey updated');
    },
    onError: (e: Error) => toast.error(e.message),
  });
};

export const useDuplicateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await surveyService.getTemplate(id);
      if (!res.data) throw new Error('Template not found');
      const { _id, ...rest } = res.data as any;
      const cloned: ISurveyTemplateCreateRequest = {
        name: `${rest.name} (Copy)`,
        translations: rest.translations,
        questions: (rest.questions ?? []).map(({ id: _qid, ...q }: any) => q),
        settings: rest.settings,
      };
      return surveyService.createTemplate(cloned);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QueryKeys.surveyTemplates.lists() });
      toast.success('Template duplicated');
    },
    onError: (e: Error) => toast.error(e.message),
  });
};
