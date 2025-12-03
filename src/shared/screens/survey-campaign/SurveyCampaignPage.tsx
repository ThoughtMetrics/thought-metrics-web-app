import React, { useEffect, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/core/lib/query-client';
import { AuthProvider, useAuth } from '@/shared/providers/auth-provider';
import { ArrowRight, UserPlus, ClipboardList, Star } from 'lucide-react';
import { survey_campaign_constant } from './survey-campaign-constant';
import { SurveyCampaignIllustrationSquare } from '@/assets';
import CustomImageAtom from '@/shared/ui/atoms/custom-image';
import CustomButtonAtom from '@/shared/ui/atoms/custom-button';

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
      allocatedSurveyId:
        allocatedSurvey || localStorage.getItem('tm_allocated_survey'),
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
    <div className="h-full overflow-hidden bg-linear-to-br from-primary/5 via-white to-secondary/5">
      <section className="common-component w-full h-full relative">
        <div className="absolute w-full h-full flex justify-end md:items-center pt-14 md:p-0">
          <SurveyCampaignIllustrationSquare className="h-[58%] md:h-[90%] w-auto stroke-2 md:stroke-1 stroke-primary" />
        </div>
        <div className="hidden md:flex absolute w-full h-full justify-end pt-18 md:pt-0 md:items-center">
          <div className="pl-[6%] pr-[8%] relative">
            <div className="relative p-18 h-[85%] w-[85%]">
              {survey_campaign_constant.commonIllustration
                ?.industryIllustration && (
                <survey_campaign_constant.commonIllustration.industryIllustration className="absolute w-full h-full transform -translate-y-1/2 -translate-x-1/2 top-1/2 left-2/3" />
              )}
              {survey_campaign_constant.commonIllustration?.illustration2 && (
                <survey_campaign_constant.commonIllustration.illustration2 className="absolute pt-12 left-6 pb-12" />
              )}
              <CustomImageAtom
                src={survey_campaign_constant.heroSection.illustration.img}
                size={
                  survey_campaign_constant.heroSection.illustration.size as any
                }
                aspectRatio={
                  survey_campaign_constant.heroSection.illustration
                    .aspectRatio as any
                }
                shadowOpacity={
                  survey_campaign_constant.heroSection.illustration
                    .shadowOpacity as any
                }
                objectFit={
                  survey_campaign_constant.heroSection.illustration
                    .objectFit as any
                }
                loading={
                  survey_campaign_constant.heroSection.illustration
                    .loading as any
                }
                backgroundColor={
                  survey_campaign_constant.heroSection.illustration
                    .backgroundColor as any
                }
              />
            </div>
          </div>
        </div>
        <div className="z-1 common-container w-full max-w-(--breakpoint-2xl)! md:min-h-[480px] xl:min-h-[580px] wide:min-h-[780px] items-center px-12 pb-8 md:py-10 md:px-24">
          <div className="md:w-[43%] xxl:w-[43%] wide:w-[50%] h-full flex flex-col gap-8 justify-center">
            <h1 className="w-[80%] text-primary text-2xl xl:text-[2.5rem] wide:text-[3rem] font-semibold pt-8 md:pt-0 text-nowrap">
              {survey_campaign_constant.heroSection.title1}{' '}
              <span className="text-black">
                {survey_campaign_constant.heroSection.title2}
              </span>
            </h1>

            <div className="flex flex-col gap-4 md:gap-6">
              {survey_campaign_constant.heroSection.list.map((item, index) => (
                <div className="flex gap-4 items-center" key={index}>
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <span className="text-white text-lg xl:text-[1.3rem] wide:text-[1.7rem] font-medium">
                      {index + 1}
                    </span>
                  </div>
                  <p className="w-full text-black text-lg xl:text-[1.3rem] wide:text-[1.7rem] font-semibold">
                    <span className="text-secondary">{item.label1}</span>{' '}
                    <span>{item.label2}</span>
                  </p>
                </div>
              ))}
            </div>
            <div className="">
              <CustomButtonAtom
                onClick={
                  isLoggedIn ? handleTakeSurveyClick : handleRegisterClick
                }
                className="font-medium text-lg px-10 py-1 xl:text-xl xl:px-14 xl:py-2"
                label={
                  isLoggedIn
                    ? survey_campaign_constant.heroSection.activeActionButton
                        .label
                    : survey_campaign_constant.heroSection.actionButton.label
                }
              />
              <p className="text-sm text-gray-500 mt-2">
                Already have an account?{' '}
                <a
                  href="/login"
                  className="text-primary hover:underline font-medium"
                >
                  Sign in here
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
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
