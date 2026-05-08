import React from 'react';
import ClientRouteGuard from '@/shared/components/guards/ClientRouteGuard';
import ClientSidebar from '@/shared/components/client/ClientSidebar';
import { CampaignsManagementContent } from '@/shared/screens/admin/campaigns/CampaignsManagement';

export const ClientCampaignsManagement: React.FC = () => (
  <ClientRouteGuard>
    <CampaignsManagementContent SidebarComponent={ClientSidebar} />
  </ClientRouteGuard>
);

export default ClientCampaignsManagement;
