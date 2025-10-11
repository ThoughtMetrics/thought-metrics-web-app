import { ROUTES } from '@/routes/routeConfig';
import CustomButtonAtom from '@/shared/ui/atoms/custom-button';
import { Link } from 'react-router-dom';
import { unsubscribeConstant } from './constant';
import { CheckboxOutlineGroupAtom } from '@/shared/ui/atoms/custom-input';
import type {
  UnsubscribeFormData,
  UnsubscribeFormStore,
} from '@/core/types/unsubscribe.type';
import { devtools } from 'zustand/middleware';
import { create } from 'zustand';
import { useProfileQuery } from '@/core/hooks/queries/use-profile.query';

// Destructure constants
const {
  initialFormData,
  unsubscribeReasonOptions,
  storeName,
  validationMessages,
  formResetDelay,
  apiSimulationDelay,
  ui,
} = unsubscribeConstant;

// Zustand store
const useUnsubscribeFormStore = create<UnsubscribeFormStore>()(
  devtools(
    (set, get) => ({
      formData: initialFormData as UnsubscribeFormData,
      isSubmitting: false,
      isSubmitted: false,
      errors: {},
      updateField: (field, value) =>
        set(
          (state) => {
            return {
              formData: { ...state.formData, [field]: value },
              errors: { ...state.errors, [field]: undefined },
            };
          },
          false,
          `updateField_${field}`
        ),

      resetForm: () =>
        set(
          {
            formData: initialFormData as UnsubscribeFormData,
            isSubmitting: false,
            isSubmitted: false,
            errors: {},
          },
          false,
          'resetForm'
        ),

      validateStep: (step) => {
        const { formData } = get();
        const errors: Record<string, string> = {};

        if (step === 1) {
          if (!formData.reasons || formData.reasons.length === 0)
            errors.reason = validationMessages.reasons;
        }

        set({ errors }, false, 'validateStep');
        return Object.keys(errors).length === 0;
      },

      submitForm: async () => {
        const { formData } = get();

        set({ isSubmitting: true }, false, 'submitForm_start');

        try {
          await new Promise((resolve) =>
            setTimeout(resolve, apiSimulationDelay)
          );

          console.log('Registration form submitted:', formData);

          set(
            {
              isSubmitting: false,
              isSubmitted: true,
            },
            false,
            'submitForm_success'
          );

          setTimeout(() => {
            get().resetForm();
          }, formResetDelay);
        } catch {
          set(
            {
              isSubmitting: false,
              errors: { general: validationMessages.submitError },
            },
            false,
            'submitForm_error'
          );
        }
      },
    }),
    {
      name: storeName,
    }
  )
);

const UnsubscribePage: React.FC = () => {
  const { data: userProfile } = useProfileQuery();

  const { formData, isSubmitting, isSubmitted, updateField, submitForm } =
    useUnsubscribeFormStore();

  const handleReasonChange = (selectedValues: string[]) => {
    updateField('reasons', selectedValues);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submitForm();
  };

  if (isSubmitted) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white">
        <div className="text-center py-12">
          <div className="mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-black mb-2">
            {ui.successMessage.title}
          </h2>
          <p className="text-gray-600">{ui.successMessage.description}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="common-component text-black bg-white flex-col h-[calc(100vh-7.25rem)]">
      <div className="common-container px-6 py-8 md:px-24 md:py-12 justify-center flex-col gap-4 md:gap-8 !max-w-[var(--breakpoint-2xl)]">
        <h1 className="text-4xl font-medium">Unsubscribe</h1>
        <p className="text-md md:w-[70%]">
          {ui.description}{' '}
          <Link to={ROUTES.CONTACT_US} className="underline ">
            contact us here
          </Link>
          , if you prefer.
        </p>
        <p>
          <span className="font-medium">Your Email: </span>
          <span>{userProfile?.email}</span>
        </p>
        <p>Please let us know you would like to change.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <CheckboxOutlineGroupAtom
            label=""
            options={unsubscribeReasonOptions}
            selectedValues={formData.reasons}
            onChange={handleReasonChange}
            columns={1}
          />
          {/* Submit Button */}
          <CustomButtonAtom
            label={isSubmitting ? ui.buttons.submitting : ui.buttons.submit}
            className="py-2 px-14"
            disabled={!isSubmitting}
          />
        </form>
      </div>
    </div>
  );
};

export default UnsubscribePage;
