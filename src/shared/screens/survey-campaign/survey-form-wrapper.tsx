import React, { useEffect, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/core/lib/query-client';
import { AuthProvider } from '@/shared/providers/auth-provider';
import { UserRouteGuard } from '@/shared/components/guards/UserRouteGuard';
import { SurveyDetailSection } from '@/shared/screens/survey-boards/SurveyDetailComponent';

interface SurveyFormWrapperProps {
  surveyId: string;
}

const SurveyCampaignPage: React.FC<SurveyFormWrapperProps> = ({ surveyId }) => {
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let resolvedLinkId: string | null = null;
    if (window.ThoughtMetrics) {
      resolvedLinkId = window.ThoughtMetrics.getUTMParams().tm_link_id;
    }
    if (!resolvedLinkId) {
      resolvedLinkId = localStorage.getItem('tm_link_id');
    }

    if (!resolvedLinkId) {
      window.location.href = '/';
      return;
    }

    setIsCheckingAccess(false);
  }, [surveyId]);

  if (isCheckingAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  return <SurveyDetailSection surveyId={surveyId} />;
};

const SurveyFormWrapper: React.FC<SurveyFormWrapperProps> = ({ surveyId }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserRouteGuard>
          <SurveyCampaignPage surveyId={surveyId} />
        </UserRouteGuard>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default SurveyFormWrapper;

declare global {
  interface Window {
    ThoughtMetrics?: {
      track: (eventName: string, data?: Record<string, any>) => void;
      identify: (userId: string, traits?: Record<string, any>) => void;
      onRegistered: (userId: string, email: string) => void;
      getVisitorId: () => string;
      getSessionId: () => string;
      getTrackingLinkId: () => string | null;
      isFromTrackingLink: () => boolean;
      getUTMParams: () => {
        utm_source: string | null;
        utm_medium: string | null;
        utm_campaign: string | null;
        utm_term: string | null;
        utm_content: string | null;
        tm_link_id: string | null;
        ref: string | null;
      };
      getPostSignupRedirect: () => string;
      flush: () => void;
    };
  }
}
