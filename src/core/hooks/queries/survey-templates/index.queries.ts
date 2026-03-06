// src/core/hooks/queries/survey-templates/index.queries.ts

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import surveyService from '@/services/survey/survey.service';
import { QueryKeys } from '@/core/lib/query-keys';
import type { ISurvey, ISurveyTemplate } from '@/core/types/survey.type';
import type { ApiResponse } from '@/services/api/api.service';

export const useTemplatesQuery = (
  queryOptions?: Partial<UseQueryOptions<ApiResponse<ISurveyTemplate[]>>>
) =>
  useQuery({
    queryKey: QueryKeys.surveyTemplates.list(),
    queryFn: () => surveyService.listTemplates(),
    ...queryOptions,
  });

export const useTemplateQuery = (
  id: string | null | undefined,
  queryOptions?: Partial<UseQueryOptions<ApiResponse<ISurveyTemplate>>>
) =>
  useQuery({
    queryKey: QueryKeys.surveyTemplates.detail(id!),
    queryFn: () => surveyService.getTemplate(id!),
    enabled: !!id,
    ...queryOptions,
  });

export const useAdminSurveysQuery = (
  params?: { status?: string; page?: number; limit?: number },
  queryOptions?: Partial<UseQueryOptions<ApiResponse<ISurvey[]>>>
) =>
  useQuery({
    queryKey: QueryKeys.surveysAdmin.list(params ?? {}),
    queryFn: () => surveyService.listSurveysAdmin(params),
    ...queryOptions,
  });
