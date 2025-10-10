import { useProfileQuery } from '@/core/hooks/queries/use-profile.query';
import { ROUTES } from '@/routes/routeConfig';
import { SelectAtom } from '@/shared/ui/atoms/custom-input';
import { useNavigate } from 'react-router-dom';
const SurveyPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: userProfile } = useProfileQuery();

  return (
    <div className="common-component bg-white text-black h-full">
      <div className="common-container px-6 py-8 md:px-24 md:py-12 justify-center flex-col gap-6 !max-w-[var(--breakpoint-2xl)]">
        <div className="bg-custom-grey-1 px-8 py-6 md:px-18 md:py-12 rounded-lg">
          <h1 className="text-3xl md:text-6xl font-medium mb-6">
            Welcome,{' '}
            {userProfile?.profile?.displayName ??
              userProfile?.profile?.firstName}
          </h1>
          <label className="flex flex-col md:flex-row gap-6 relative font-medium text-md md:text-2xl w-fit">
            <span className="">{userProfile?.profile?.phone}</span>
            <span
              className="underline"
              onClick={() => {
                void navigate(ROUTES.EDIT_PROFILE);
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
        <div className="w-fit">
          <SelectAtom
            id={''}
            name={'Select Survey'}
            label={''}
            value={''}
            onChange={() => { /* empty */ }}
            options={[{ value: '10', label: '10 Filters Selected' }]}
          />
        </div>
        <div className="flex w-full h-full justify-center items-center">
          <div>No Survey Yet</div>
        </div>
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-8 justify-between">
          {[1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="border-1 border-custom-grey-2 rounded-lg w-full h-52"
            >
              <div className="h-26 bg-custom-grey-1 border-b-1 border-custom-grey-2 px-4 py-3 rounded-t-lg">
                <label className="font-medium">
                  Respondent background information.
                </label>
              </div>
              <div className="h-26 px-4 py-3">
                <p>Rs. 50 for 30 minutes.</p>
              </div>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default SurveyPage;
