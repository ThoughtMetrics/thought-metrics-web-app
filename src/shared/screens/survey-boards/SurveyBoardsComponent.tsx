// src/shared/screens/survey-boards/SurveyBoardsComponent.tsx
import React from 'react';
import { useProfileQuery } from '@/core/hooks/queries/use-profile.query';
import { useSurveyListQuery } from '@/core/hooks/queries/survey/use-survey-list.query';
import { useUserResponsesQuery } from '@/core/hooks/queries/survey/use-user-responses.query';
import { queryClient } from '@/core/lib/query-client';
import { ROUTES } from '@/routes/routeConfig';
import type { ISurvey } from '@/core/types/survey.type';
import { SurveyResponseStatus } from '@/core/types/survey.type';
import { INDUSTRY_FILTERS } from '@/core/constants/survey.constants';
import { AuthProvider } from '@/shared/providers/auth-provider';
import { SelectAtom } from '@/shared/ui/atoms/custom-input';
import { QueryClientProvider } from '@tanstack/react-query';

const SurveyBoardsSection: React.FC = () => {
  const [selectedIndustry, setSelectedIndustry] = React.useState('all');
  const { data: userProfile } = useProfileQuery();
  const { data: surveysData, isLoading } = useSurveyListQuery({
    status: 'published',
    visibility: 'public',
    limit: 100,
  });
  const { data: userResponsesData } = useUserResponsesQuery();

  const surveys = surveysData?.data || [];
  const userResponses = userResponsesData?.data || [];

  // Create a set of submitted survey IDs for quick lookup
  const submittedSurveyIds = React.useMemo(() => {
    return new Set(
      userResponses
        .filter((response) => response.status === SurveyResponseStatus.SUBMITTED)
        .map((response) => response.surveyId)
    );
  }, [userResponses]);

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

  const handleSurveyClick = (surveyId: string, isSubmitted: boolean) => {
    if (isSubmitted) {
      return; // Do nothing if survey is already submitted
    }
    window.location.href = `/survey-boards/${surveyId}`;
  };

  return (
    <div className="common-component bg-white text-black! h-full overflow-y-scroll">
      <div className="common-container px-6 py-8 md:px-24 md:py-12 flex flex-col gap-6 max-w-(--breakpoint-2xl)!">
        {/* Welcome Section */}
        <div className="bg-custom-grey-1 px-8 py-6 md:px-18 md:py-12 rounded-lg">
          <h1 className="text-3xl md:text-6xl font-medium mb-6">
            Welcome,{' '}
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
              Verify/update your profile
            </span>
          </label>
          <p className="mt-6 md:mt-12 text-sm md:text-lg">
            Start seeing if you pre-qualify for a study by filling out the
            survey at the link(s) below.
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
            options={INDUSTRY_FILTERS}
          />
        </div>
        {/* Survey Grid */}
        {isLoading ? (
          <div className="flex w-full h-64 justify-center items-center">
            <div className="text-lg text-custom-grey-3">Loading surveys...</div>
          </div>
        ) : filteredSurveys.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
            {filteredSurveys.map((survey: ISurvey) => {
              // Extract metadata with safe fallbacks
              const metadata = survey.metadata || {};
              const industry = survey.industry || 'General';
              const timeToComplete = metadata.timeToComplete || 15;
              const surveyId = survey.surveyId || `TM-${survey.id}`;

              // Parse price - backend returns string like "90.00"
              const price =
                typeof survey.price === 'string'
                  ? parseFloat(survey.price)
                  : survey.price || 0;

              // Check if user has submitted this survey
              const isSubmitted = submittedSurveyIds.has(survey.id);

              return (
                <div
                  key={survey.id}
                  onClick={() => handleSurveyClick(survey.id, isSubmitted)}
                  className={`border-2 border-custom-grey-2 rounded-lg overflow-hidden transition-all flex flex-col justify-between h-full ${
                    isSubmitted
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
                        {timeToComplete} min
                      </span>
                    </div>
                    <div className="flex justify-between items-end gap-4">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                        {industry}
                      </span>
                      <span
                        className={`inline-block px-3 py-1 rounded text-xs font-medium ${
                          isSubmitted
                            ? 'bg-gray-200 text-gray-700'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {isSubmitted
                          ? 'Submitted'
                          : survey.status === 'published'
                            ? 'Available'
                            : survey.status}
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
                ? 'No Surveys Available Yet'
                : 'No Surveys Available for Selected Industry'}
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
