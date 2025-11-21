// src/shared/screens/survey-boards/SurveyBoardsComponent.tsx
import React from 'react';
import { useProfileQuery } from '@/core/hooks/queries/use-profile.query';
import { useSurveyListQuery } from '@/core/hooks/queries/survey/use-survey-list.query';
import { queryClient } from '@/core/lib/query-client';
import { ROUTES } from '@/routes/routeConfig';
import type { ISurvey } from '@/core/types/survey.type';
import { SurveyResponseStatus } from '@/core/types/survey.type';
import { INDUSTRY_FILTERS } from '@/core/constants/survey.constants';
import { AuthProvider } from '@/shared/providers/auth-provider';
import { SelectAtom } from '@/shared/ui/atoms/custom-input';
import { QueryClientProvider } from '@tanstack/react-query';
import { LanguageToggle } from '@/shared/ui/molecules/language-toggle';
import { useLanguage } from '@/core/hooks/use-language';
import { getIndustryLabel } from '@/core/utils/industry-translator';

const SurveyBoardsSection: React.FC = () => {
  const [selectedIndustry, setSelectedIndustry] = React.useState('all');
  const { data: userProfile } = useProfileQuery();
  const { data: surveysData, isLoading } = useSurveyListQuery({
    status: 'published',
    visibility: 'public',
    limit: 100,
  });

  // Translation hook
  const { translations } = useLanguage();

  const surveys = surveysData?.data || [];

  // Translated industry filters
  const translatedIndustryFilters = React.useMemo(() => {
    return INDUSTRY_FILTERS.map(filter => ({
      value: filter.value,
      label: getIndustryLabel(filter.label, translations.industries)
    }));
  }, [translations.industries]);

  // Filter surveys by selected industry
  const filteredSurveys = React.useMemo(() => {
    if (selectedIndustry === 'all') {
      return surveys;
    }
    return surveys.filter((survey: ISurvey) => {
      const industry = survey.industry || '';
      return industry === selectedIndustry;
    });
  }, [surveys, selectedIndustry]);

  const handleSurveyClick = (survey: ISurvey) => {
    // Check if user has already submitted or response is completed
    if (survey.userResponse?.isCompleted) {
      return; // Do nothing if survey is already completed (submitted/approved/declined)
    }

    // Use surveyId (TM-xxx format) instead of database UUID for user-friendly URLs
    const surveyIdentifier = survey.surveyId || survey.id;

    // If user has a draft, they can resume
    if (survey.userResponse?.canUpdate) {
      window.location.href = `/survey-boards/${surveyIdentifier}?resume=true`;
    } else {
      // Start new survey
      window.location.href = `/survey-boards/${surveyIdentifier}`;
    }
  };

  return (
    <div className="common-component bg-white text-black! h-full overflow-y-scroll">
      <div className="common-container px-6 py-8 md:px-24 md:py-12 flex flex-col gap-6 max-w-(--breakpoint-2xl)!">
        {/* Language Toggle - Top Right */}
        <div className="flex justify-end">
          <LanguageToggle variant="inline" />
        </div>

        {/* Welcome Section */}
        <div className="bg-custom-grey-1 px-8 py-6 md:px-18 md:py-12 rounded-lg">
          <h1 className="text-3xl md:text-6xl font-medium mb-6">
            {translations.surveyBoard.welcome},{' '}
            {userProfile?.profile?.displayName ??
              userProfile?.profile?.firstName}
          </h1>
          <label className="flex flex-col md:flex-row gap-6 relative font-medium text-md md:text-2xl w-fit">
            <span className="">{userProfile?.profile?.phone}</span>
            {userProfile?.profile?.phone && (
              <div className="hidden md:block absolute h-full w-px bg-black left-22 md:left-34"></div>
            )}
            <span
              className="underline cursor-pointer"
              onClick={() => {
                window.location.href = ROUTES.EDIT_PROFILE;
              }}
            >
              {translations.surveyBoard.verifyProfile}
            </span>
          </label>
          <p className="mt-6 md:mt-12 text-sm md:text-lg">
            {translations.surveyBoard.startMessage}
          </p>
        </div>
        {/* Filter Section */}
        <div className="w-fit">
          <SelectAtom
            id="survey-filter"
            name="Select Industry"
            label=""
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            options={translatedIndustryFilters}
          />
        </div>
        {/* Survey Grid */}
        {isLoading ? (
          <div className="flex w-full h-64 justify-center items-center">
            <div className="text-lg text-custom-grey-3">{translations.common.loading}</div>
          </div>
        ) : filteredSurveys.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
            {filteredSurveys.map((survey: ISurvey) => {
              // Extract metadata with safe fallbacks
              const metadata = survey.metadata || {};
              const industry = survey.industry || 'General';
              const timeToComplete = metadata.timeToComplete || 15;
              // surveyId should always be provided by backend (e.g., TM-AD001)
              const surveyId = survey.surveyId || survey.id;

              // Parse price - backend returns string like "90.00"
              const price =
                typeof survey.price === 'string'
                  ? parseFloat(survey.price)
                  : survey.price || 0;

              // Check survey status based on userResponse
              const hasResponded = survey.userResponse?.hasResponded || false;
              const isCompleted = survey.userResponse?.isCompleted || false;
              const canUpdate = survey.userResponse?.canUpdate || false;
              const responseStatus = survey.userResponse?.status;

              // Determine status badge text and style
              const getStatusInfo = () => {
                if (!hasResponded) {
                  return { text: translations.surveyBoard.available, bgColor: 'bg-green-100', textColor: 'text-green-800' };
                }
                if (canUpdate && responseStatus === SurveyResponseStatus.DRAFT) {
                  return { text: translations.surveyBoard.draft, bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' };
                }
                if (responseStatus === SurveyResponseStatus.SUBMITTED) {
                  return { text: translations.surveyBoard.submitted, bgColor: 'bg-custom-grey-3', textColor: 'text-grey-800' };
                }
                if (responseStatus === SurveyResponseStatus.APPROVED) {
                  return { text: translations.surveyBoard.approved, bgColor: 'bg-gray-200', textColor: 'text-gray-700' };
                }
                if (responseStatus === SurveyResponseStatus.DECLINED) {
                  return { text: translations.surveyBoard.declined, bgColor: 'bg-red-100', textColor: 'text-red-800' };
                }
                return { text: survey.status || 'Published', bgColor: 'bg-gray-100', textColor: 'text-gray-700' };
              };

              const statusInfo = getStatusInfo();

              return (
                <div
                  key={survey.surveyId || survey.id}
                  onClick={() => handleSurveyClick(survey)}
                  className={`border-2 border-custom-grey-2 rounded-lg overflow-hidden transition-all flex flex-col justify-between h-full ${
                    isCompleted
                      ? 'opacity-60 cursor-not-allowed bg-gray-50'
                      : 'hover:border-primary cursor-pointer hover:shadow-lg'
                  }`}
                >
                  {/* Header */}
                  <div className="h-24 bg-custom-grey-1 border-b-2 border-custom-grey-2 px-4 py-3 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-base text-black line-clamp-2 flex-1">
                        {survey.label}
                      </h3>
                    </div>
                    <span className="text-sm text-custom-text-dark font-medium">
                      {surveyId}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="px-4 py-4 space-y-14">
                    <div className="flex justify-between items-center">
                      <p className="text-base md:text-lg text-black font-semibold">
                        ₹{price.toFixed(2)}
                      </p>
                      <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                        {timeToComplete} {translations.surveyBoard.minutes}
                      </span>
                    </div>
                    <div className="flex justify-between items-start gap-4 flex-col">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                        {getIndustryLabel(industry, translations.industries)}
                      </span>
                      <span
                        className={`inline-block px-3 py-1 rounded text-xs font-medium ${statusInfo.bgColor} ${statusInfo.textColor}`}
                      >
                        {statusInfo.text}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex w-full h-64 justify-center items-center">
            <div className="text-lg text-custom-grey-3">
              {selectedIndustry === 'all'
                ? translations.surveyBoard.noSurveys
                : translations.surveyBoard.noSurveysForIndustry}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SurveyBoardsWrapper: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SurveyBoardsSection />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default SurveyBoardsWrapper;
