import React from 'react';
import ClientRouteGuard from '@/shared/components/guards/ClientRouteGuard';
import ClientSidebar from '@/shared/components/client/ClientSidebar';
import TrackingLinkForm from '@/shared/screens/admin/tracking-links/TrackingLinkForm';

const ClientTrackingLinkFormContent: React.FC = () => (
  <div className="h-full flex bg-gray-50 text-text-dark">
    <ClientSidebar />
    <main className="h-full overflow-y-scroll flex-1 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Create Campaign</h1>
          <p className="text-gray-600">Set up a new tracking link for your campaign</p>
        </div>
        <TrackingLinkForm />
      </div>
    </main>
  </div>
);

export const ClientTrackingLinkForm: React.FC = () => (
  <ClientRouteGuard>
    <ClientTrackingLinkFormContent />
  </ClientRouteGuard>
);

export default ClientTrackingLinkForm;
