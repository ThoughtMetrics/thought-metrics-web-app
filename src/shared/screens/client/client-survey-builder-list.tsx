import React from 'react';
import ClientRouteGuard from '@/shared/components/guards/ClientRouteGuard';
import ClientSidebar from '@/shared/components/client/ClientSidebar';
import { SurveyBuilderListContent } from '@/shared/screens/admin/survey-builder/SurveyBuilderList';

export const ClientSurveyBuilderList: React.FC = () => (
  <ClientRouteGuard>
    <SurveyBuilderListContent SidebarComponent={ClientSidebar} />
  </ClientRouteGuard>
);

export default ClientSurveyBuilderList;
