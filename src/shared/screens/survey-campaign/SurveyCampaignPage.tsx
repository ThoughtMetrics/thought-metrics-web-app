import React, { useEffect, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/core/lib/query-client';
import { AuthProvider, useAuth } from '@/shared/providers/auth-provider';
import { CheckCircle, ArrowRight, UserPlus, ClipboardList, Star } from 'lucide-react';

const SurveyCampaignPageContent: React.FC = () => {
  const { user, isAuthReady } = useAuth();
  const [trackingInfo, setTrackingInfo] = useState<{
    linkId: string | null;
    source: string | null;
    campaign: string | null;
    allocatedSurveyId: string | null;
  }>({ linkId: null, source: null, campaign: null, allocatedSurveyId: null });

  useEffect(() => {
    // Get tracking data from URL params
    const params = new URLSearchParams(window.location.search);
    const linkId = params.get('tm_link_id');
    const source = params.get('utm_source');
    const campaign = params.get('utm_campaign');
    const allocatedSurvey = params.get('allocated_survey');

    // Store in localStorage for persistence
    if (linkId) {
      localStorage.setItem('tm_link_id', linkId);
    }
    if (allocatedSurvey) {
      localStorage.setItem('tm_allocated_survey', allocatedSurvey);
    }

    setTrackingInfo({
      linkId: linkId || localStorage.getItem('tm_link_id'),
      source: source || localStorage.getItem('utm_source'),
      campaign: campaign || localStorage.getItem('utm_campaign'),
      allocatedSurveyId: allocatedSurvey || localStorage.getItem('tm_allocated_survey'),
    });
  }, []);

  const handleRegisterClick = () => {
    // Preserve tracking params when redirecting to signup
    const params = new URLSearchParams(window.location.search);
    const signupUrl = `/sign-up?${params.toString()}`;
    window.location.href = signupUrl;
  };

  const handleTakeSurveyClick = () => {
    // If allocated survey exists, go directly to that survey
    if (trackingInfo.allocatedSurveyId) {
      window.location.href = `/surveys/${trackingInfo.allocatedSurveyId}`;
    } else {
      // Otherwise, go to survey boards
      window.location.href = '/survey-boards';
    }
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
            <Star className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Welcome to Thought Metrics Survey Campaign!
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {isLoggedIn
              ? `Hi ${user?.email || 'there'}! Ready to share your valuable insights?`
              : 'Join our research panel and earn rewards by sharing your opinions.'}
          </p>

          {trackingInfo.campaign && (
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
              Campaign: {trackingInfo.campaign}
            </div>
          )}
        </div>

        {/* Main Action Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          {isLoggedIn ? (
            // Logged In - Take Survey
            <div className="text-center">
              <ClipboardList className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Ready to Take the Survey?
              </h2>
              <p className="text-gray-600 mb-6">
                {trackingInfo.allocatedSurveyId
                  ? 'We have a special survey waiting for you based on this campaign!'
                  : 'Browse available surveys and start earning rewards.'}
              </p>
              <button
                onClick={handleTakeSurveyClick}
                className="inline-flex items-center px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg"
              >
                {trackingInfo.allocatedSurveyId ? 'Start Allocated Survey' : 'Browse Surveys'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          ) : (
            // Not Logged In - Register Now
            <div className="text-center">
              <UserPlus className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Register to Get Started
              </h2>
              <p className="text-gray-600 mb-6">
                Create your free account to access surveys and start earning rewards.
              </p>
              <button
                onClick={handleRegisterClick}
                className="inline-flex items-center px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg"
              >
                Register Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <p className="text-sm text-gray-500 mt-4">
                Already have an account?{' '}
                <a href="/login" className="text-primary hover:underline font-medium">
                  Sign in here
                </a>
              </p>
            </div>
          )}
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Why Join Our Panel?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-lg">💰</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Earn Money</h3>
              <p className="text-gray-600 text-sm">
                Get paid for every survey you complete. Direct UPI or bank transfer.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-lg">🎯</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Relevant Surveys</h3>
              <p className="text-gray-600 text-sm">
                Only receive surveys that match your profile and interests.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-lg">⚡</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Quick & Easy</h3>
              <p className="text-gray-600 text-sm">
                Most surveys take 5-10 minutes. Anytime, anywhere on any device.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            How It Works
          </h2>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {isLoggedIn ? 'Browse Surveys' : 'Sign Up Free'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {isLoggedIn
                    ? 'Choose from available surveys that match your profile.'
                    : 'Create your free account in less than 2 minutes.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Share Your Opinion</h3>
                <p className="text-gray-600 text-sm">
                  Answer questions honestly. Your insights help brands make better decisions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Get Rewarded</h3>
                <p className="text-gray-600 text-sm">
                  Receive payment directly to your UPI or bank account after completion.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Footer */}
        {!isLoggedIn && (
          <div className="text-center mt-8">
            <button
              onClick={handleRegisterClick}
              className="inline-flex items-center px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg"
            >
              Get Started - Register Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const SurveyCampaignPage: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SurveyCampaignPageContent />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default SurveyCampaignPage;
