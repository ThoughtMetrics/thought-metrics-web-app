import React from 'react';
import ClientRouteGuard from '@/shared/components/guards/ClientRouteGuard';
import ClientSidebar from '@/shared/components/client/ClientSidebar';
import { SurveyAnalyticsDashboardContent } from '@/shared/screens/admin/survey-analytics-dashboard';

export const ClientSurveyAnalyticsDashboard: React.FC = () => (
  <ClientRouteGuard>
    <SurveyAnalyticsDashboardContent SidebarComponent={ClientSidebar} />
  </ClientRouteGuard>
);

export default ClientSurveyAnalyticsDashboard;
