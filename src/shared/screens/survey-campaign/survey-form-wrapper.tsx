import React, { useEffect, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/core/lib/query-client';
import { AuthProvider, useAuth } from '@/shared/providers/auth-provider';
import { CheckCircle, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import OnboardingSurveyForm from './onboarding-survey-form';

interface SurveyFormWrapperProps {
  surveyId: string;
}

const SurveyFormPage: React.FC<SurveyFormWrapperProps> = ({ surveyId }) => {
  const { user } = useAuth();
  const [surveyData, setSurveyData] = useState<any>(null);
  const [surveyTemplate, setSurveyTemplate] = useState<any>(null);
  const [isLoadingSurvey, setIsLoadingSurvey] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [trackingInfo, setTrackingInfo] = useState<{
    linkId: string | null;
    source: string | null;
    campaign: string | null;
  }>({ linkId: null, source: null, campaign: null });

  // Check if user came from tracking link and enforce access restriction
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Try ThoughtMetrics external script first (reads current URL params)
    let resolvedLinkId: string | null = null;
    if (window.ThoughtMetrics) {
      resolvedLinkId = window.ThoughtMetrics.getUTMParams().tm_link_id;
    }
    // Fallback: localStorage (present after post-login redirect when URL params are gone)
    if (!resolvedLinkId) {
      resolvedLinkId = localStorage.getItem('tm_link_id');
    }

    if (!resolvedLinkId) {
      console.debug('[SurveyForm] Access denied - no tracking link in URL or localStorage');
      window.location.href = '/';
      return;
    }

    setTrackingInfo({
      linkId: resolvedLinkId,
      source: window.ThoughtMetrics?.getUTMParams().utm_source ?? null,
      campaign: window.ThoughtMetrics?.getUTMParams().utm_campaign ?? null,
    });
    setIsCheckingAccess(false);
  }, [surveyId]);

  // Fetch survey
  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        setIsLoadingSurvey(true);
        setError(null);

        // Fetch survey by ID
        const surveyResponse = await fetch(`/api/v1/surveys/${surveyId}`, {
          credentials: 'include',
        });

        if (!surveyResponse.ok) {
          throw new Error('Failed to load survey');
        }

        const surveyResult = await surveyResponse.json();
        const survey = surveyResult.data;

        setSurveyData(survey);

        // Fetch template
        const templateResponse = await fetch(
          `/api/v1/survey-templates/${survey.templateMongoId}`,
          {
            credentials: 'include',
          }
        );

        if (!templateResponse.ok) {
          throw new Error('Failed to load survey template');
        }

        const templateResult = await templateResponse.json();
        setSurveyTemplate(templateResult.data);
      } catch (err) {
        console.error('Error loading survey:', err);
        setError(err instanceof Error ? err.message : 'Failed to load survey');
      } finally {
        setIsLoadingSurvey(false);
      }
    };

    fetchSurvey();
  }, [surveyId]);

  const handleSubmitSuccess = () => {
    setIsCompleted(true);
    // Track completion
    if (typeof window !== 'undefined' && window.ThoughtMetrics) {
      window.ThoughtMetrics.track('onboarding_survey_completed', {
        surveyId,
        linkId: trackingInfo.linkId,
      });
    }
  };

  const handleSubmitError = (errorMsg: string) => {
    setError(errorMsg);
  };

  // Access check loading state
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

  // Loading state
  if (isLoadingSurvey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your survey...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <a
            href="/survey-boards"
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90"
          >
            Go to Survey Boards
            <ArrowRight className="w-5 h-5 ml-2" />
          </a>
        </div>
      </div>
    );
  }

  // Success state
  if (isCompleted) {
    return (
      <div className="min-h-screen bg-linear-to-br from-primary/5 via-white to-secondary/5">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Thank You for Completing Your Profile!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Your preferences have been saved. We'll now match you with surveys
              that fit your interests.
            </p>
            <a
              href="/survey-boards"
              className="inline-flex items-center px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg"
            >
              Start Taking Surveys
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Check if survey template loaded
  if (!surveyTemplate) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-primary/5 via-white to-secondary/5">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {surveyTemplate.translations?.en?.label || surveyTemplate.label}
          </h1>
          <p className="text-lg text-gray-600">
            {surveyTemplate.translations?.en?.description ||
              surveyTemplate.description}
          </p>
          <p className="text-sm text-gray-500 mt-4">
            {surveyTemplate.translations?.en?.instructions ||
              'This helps us match you with the best survey opportunities'}
          </p>
          {trackingInfo.campaign && (
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
              Campaign: {trackingInfo.campaign}
            </div>
          )}
        </div>

        {/* Survey Form */}
        <OnboardingSurveyForm
          template={surveyTemplate}
          surveyId={surveyData.id}
          userId={user?.uid}
          userEmail={user?.email || undefined}
          userName={user?.displayName || undefined}
          onSubmitSuccess={handleSubmitSuccess}
          onSubmitError={handleSubmitError}
        />
      </div>
    </div>
  );
};

const SurveyFormWrapper: React.FC<SurveyFormWrapperProps> = ({ surveyId }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SurveyFormPage surveyId={surveyId} />
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
