import { ROUTES } from '@/routes/routeConfig';
import CustomButtonAtom from '@/shared/ui/atoms/custom-button';
import { unsubscribeConstant } from '@constants/page-constants/auth-constant';
import { CheckboxOutlineGroupAtom } from '@/shared/ui/atoms/custom-input';
import type {
  UnsubscribeFormData,
  UnsubscribeFormStore,
} from '@/core/types/unsubscribe.type';
import { devtools } from 'zustand/middleware';
import { create } from 'zustand';
import { useProfileQuery } from '@/core/hooks/queries/use-profile.query';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/shared/providers/auth-provider';
import { toast } from 'sonner';
import { queryClient } from '@/core/lib/query-client';
import { useUnsubscribeMutation } from '@/core/hooks/mutations/use-unsubscribe.mutation';

// Destructure constants
const {
  initialFormData,
  unsubscribeReasonOptions,
  storeName,
  formResetDelay,
  ui,
} = unsubscribeConstant;

// Zustand store
const useUnsubscribeFormStore = create<UnsubscribeFormStore>()(
  devtools(
    (set) => ({
      formData: initialFormData as UnsubscribeFormData,
      isSubmitting: false,
      isSubmitted: false,

      updateReasons: (reasons: string[]) =>
        set(
          (state) => ({
            formData: { ...state.formData, reasons },
          }),
          false,
          'updateReasons'
        ),

      resetForm: () =>
        set(
          {
            formData: initialFormData as UnsubscribeFormData,
            isSubmitting: false,
            isSubmitted: false,
          },
          false,
          'resetForm'
        ),

      setSubmitting: (isSubmitting: boolean) =>
        set({ isSubmitting }, false, 'setSubmitting'),

      setSubmitted: (isSubmitted: boolean) =>
        set({ isSubmitted }, false, 'setSubmitted'),
    }),
    {
      name: storeName,
    }
  )
);

const UnsubscribePage: React.FC = () => {
  const { data: userProfile } = useProfileQuery();

  const {
    formData,
    isSubmitting,
    isSubmitted,
    updateReasons,
    setSubmitting,
    setSubmitted,
    resetForm,
  } = useUnsubscribeFormStore();

  const { mutate: unsubscribe } = useUnsubscribeMutation();

  const handleReasonChange = (selectedValues: string[]) => {
    updateReasons(selectedValues);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitting(true);

    // Call the API with unsubscribe action and selected reasons
    unsubscribe(formData.reasons, {
      onSuccess: () => {
        setSubmitting(false);
        setSubmitted(true);
        toast.success('Account unsubscribed successfully');

        // Reset form after delay
        setTimeout(() => {
          resetForm();
        }, formResetDelay);
      },
      onError: (error: Error) => {
        setSubmitting(false);
        toast.error(error.message || 'Failed to unsubscribe account. Please try again.');
      },
    });
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
      <div className="common-container px-6 py-8 md:px-24 md:py-12 justify-center flex-col gap-4 md:gap-8 max-w-(--breakpoint-2xl)!">
        <h1 className="text-4xl font-medium">Unsubscribe</h1>
        <p className="text-md md:w-[70%]">
          {ui.description}{' '}
          <a href={ROUTES.CONTACT_US} className="underline ">
            contact us here
          </a>
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
            type="submit"
            label={isSubmitting ? ui.buttons.submitting : ui.buttons.submit}
            className="py-2 px-14"
            disabled={isSubmitting}
          />
        </form>
      </div>
    </div>
  );
};

const UnsubscribeWrapper: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UnsubscribePage />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default UnsubscribeWrapper;
