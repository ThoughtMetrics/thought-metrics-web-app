import React, { useEffect, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/core/lib/query-client';
import { AuthProvider, useAuth } from '@/shared/providers/auth-provider';
import { CheckCircle, ArrowRight, Gift, ClipboardList } from 'lucide-react';

const SurveyCampaignPage: React.FC = () => {
  const { user } = useAuth();
  const [trackingInfo, setTrackingInfo] = useState<{
    linkId: string | null;
    source: string | null;
    campaign: string | null;
  }>({ linkId: null, source: null, campaign: null });
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ThoughtMetrics) {
      const isTracked = window.ThoughtMetrics.isFromTrackingLink();
      const utmParams = window.ThoughtMetrics.getUTMParams();

      console.debug('[SurveyCampaign] Access check:', {
        isFromTrackingLink: isTracked,
        trackingLinkId: utmParams.tm_link_id,
      });

      // Restrict access - only allow via tracking link
      if (!isTracked || !utmParams.tm_link_id) {
        console.debug('[SurveyCampaign] Access denied - no tracking link detected, redirecting to home');
        window.location.href = '/';
        return;
      }

      setTrackingInfo({
        linkId: utmParams.tm_link_id,
        source: utmParams.utm_source,
        campaign: utmParams.utm_campaign,
      });
      setIsCheckingAccess(false);
    } else {
      // If ThoughtMetrics is not available, deny access
      console.debug('[SurveyCampaign] Access denied - ThoughtMetrics not available');
      window.location.href = '/';
    }
  }, []);

  // Show loading while checking access
  if (isCheckingAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  const handleRegisterClick = () => {
    // Redirect to signup if not authenticated
    if (!user) {
      window.location.href = '/sign-up';
    } else {
      // If already authenticated, go to the onboarding survey
      window.location.href = '/survey-campaign/TM-ONBOARD-001';
    }
  };

  return (
    <div className="h-full overflow-y-scroll bg-linear-to-br from-primary/5 via-white to-secondary/5">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Welcome to Thought Metrics!
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {user?.displayName
              ? `Thank you for your interest, ${user?.displayName}!`
              : 'Thank you for your interest in joining our research panel!'}
          </p>

          {trackingInfo.campaign && (
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
              Campaign: {trackingInfo.campaign}
            </div>
          )}
        </div>

        {/* Call-to-Action Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 mb-6">
            {user
              ? 'Complete your profile to start earning rewards!'
              : 'Register now to share your opinion and earn rewards!'}
          </p>
          <button
            onClick={handleRegisterClick}
            className="inline-flex items-center px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg"
          >
            {user ? 'Complete Your Profile' : 'Register Now'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <ClipboardList className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Share Your Opinion
                </h3>
                <p className="text-gray-600 text-sm">
                  Complete surveys and help brands make better decisions.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Gift className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Earn Rewards
                </h3>
                <p className="text-gray-600 text-sm">
                  Get paid for your time through UPI or bank transfer.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-lg">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Register & Complete Profile
              </h3>
              <p className="text-gray-600 text-sm">
                Sign up and tell us about your interests and preferences.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-lg">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Take Surveys
              </h3>
              <p className="text-gray-600 text-sm">
                Receive survey invitations based on your profile.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-lg">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Get Paid
              </h3>
              <p className="text-gray-600 text-sm">
                Earn money for each completed survey directly to your account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SurveyCampaignWrapper: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SurveyCampaignPage />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default SurveyCampaignWrapper;

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
