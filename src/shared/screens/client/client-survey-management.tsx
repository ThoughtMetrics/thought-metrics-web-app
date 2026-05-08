import React from 'react';
import ClientRouteGuard from '@/shared/components/guards/ClientRouteGuard';
import ClientSidebar from '@/shared/components/client/ClientSidebar';
import { SurveyManagementContent } from '@/shared/screens/admin/surveys/SurveyManagement';

export const ClientSurveyManagement: React.FC = () => (
  <ClientRouteGuard>
    <SurveyManagementContent SidebarComponent={ClientSidebar} />
  </ClientRouteGuard>
);

export default ClientSurveyManagement;
