import React from 'react';
import ClientRouteGuard from '@/shared/components/guards/ClientRouteGuard';
import ClientSidebar from '@/shared/components/client/ClientSidebar';
import { SurveyBuilderEditorContent } from '@/shared/screens/admin/survey-builder/SurveyBuilderEditor';

interface Props {
  templateId?: string;
}

const ClientSurveyBuilderEditorContent: React.FC<Props> = ({ templateId }) => (
  <SurveyBuilderEditorContent
    templateId={templateId}
    redirectPath="/dashboard/surveys"
    SidebarComponent={ClientSidebar}
  />
);

export const ClientSurveyBuilderEditor: React.FC<Props> = ({ templateId }) => (
  <ClientRouteGuard>
    <ClientSurveyBuilderEditorContent templateId={templateId} />
  </ClientRouteGuard>
);

export default ClientSurveyBuilderEditor;
