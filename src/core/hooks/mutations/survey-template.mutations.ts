// src/core/hooks/mutations/survey-template.mutations.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import surveyService from '@/services/survey/survey.service';
import { QueryKeys } from '@/core/lib/query-keys';
import { useSurveyBuilderStore } from '@/core/stores/survey-builder.store';
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
      useSurveyBuilderStore.setState({ isDirty: false });
      // Toast and redirect are handled by the caller (handleSave vs handlePublishClick)
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
      useSurveyBuilderStore.setState({ isDirty: false });
    },
    onError: (e: Error) => toast.error(e.message),
    retry: 1,
  });
};

export const useDeleteSurveyInstance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (surveyId: string) => surveyService.deleteSurveyInstance(surveyId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QueryKeys.surveysAdmin.lists() });
      toast.success('Survey deleted');
    },
    onError: (e: Error) => toast.error(e.message),
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
      useSurveyBuilderStore.setState({ isDirty: false });
      // Redirect and success feedback handled by PublishSurveyModal success step
    },
    onError: (e: Error) => toast.error(e.message),
  });
};

export const useSaveSurveyDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ISurveyPublishRequest) => surveyService.saveSurveyAsDraft(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QueryKeys.surveysAdmin.lists() });
      toast.success('Saved as draft');
      useSurveyBuilderStore.setState({ isDirty: false });
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
      useSurveyBuilderStore.setState({ isDirty: false });
    },
    onError: (e: Error) => toast.error(e.message),
  });
};

export const useSaveDraftContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      content,
    }: {
      id: string;
      content: { questions?: any[]; translations?: any; settings?: any };
    }) => surveyService.saveDraftContent(id, content),
    onSuccess: (response, { id }) => {
      if (response?.data) {
        queryClient.setQueryData(QueryKeys.surveyTemplates.detail(id), response);
      }
      void queryClient.invalidateQueries({ queryKey: QueryKeys.surveyTemplates.detail(id) });
      useSurveyBuilderStore.setState({ isDirty: false });
    },
    onError: (e: Error) => toast.error(e.message),
  });
};

export const useDiscardDraftContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => surveyService.discardDraftContent(id),
    onSuccess: (response, id) => {
      // Immediately write the fresh template (no draftContent) into the cache so that
      // any navigation back to the editor sees clean data without waiting for a refetch.
      if (response?.data) {
        queryClient.setQueryData(QueryKeys.surveyTemplates.detail(id), response);
      }
      void queryClient.invalidateQueries({ queryKey: QueryKeys.surveyTemplates.detail(id) });
    },
    onError: (e: Error) => toast.error(e.message),
  });
};

