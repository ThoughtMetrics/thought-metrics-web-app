import React, { useState } from 'react';
import { signUpFormConstant, COUNTRY_STATES_MAP } from '@constants/page-constants/auth-constant';
import { FEATURE_FLAGS } from '@/core/configs/feature-flag-config';
import type {
  RespondentRegistrationFormData,
  RespondentRegistrationFormStore,
} from '@/core/types/respondent-signup.type';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  CheckboxAtom,
  CheckboxOutlineGroupAtom,
  PhoneInputAtom,
  SelectAtom,
  TextInputAtom,
} from '@/shared/ui/atoms/custom-input';
import { COUNTRY_CODES } from '@/core/constants/country-codes';
import FaqOrganism from '@/shared/ui/organisms/faq-organism';
import { useSignUpMutation } from '@/core/hooks/mutations/use-sign-up.mutation';
import { ROUTES } from '@/routes/routeConfig';
import { AuthProvider } from '@/shared/providers/auth-provider';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/core/lib/query-client';
import { useLanguage } from '@/core/hooks/use-language';
import { LanguageToggle } from '@/shared/ui/molecules/language-toggle';

// Destructure constants
const {
  initialFormData,
  participationOptions,
  genders,
  months,
  countries,
  countryCodes,
  defaultCountryCode,
  storeName,
  validationMessages,
  emailRegex,
  formResetDelay,
  ui,
} = signUpFormConstant;

const emailRegexPattern = new RegExp(emailRegex);

// Generate days (1-31) and years (1900-current)
const days = Array.from({ length: 31 }, (_, i) => ({
  value: String(i + 1).padStart(2, '0'),
  label: String(i + 1),
}));
const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => ({
  value: String(currentYear - i),
  label: String(currentYear - i),
}));

// Zustand store implementation
const storeImplementation = (set: any, get: any) => ({
  formData: initialFormData as RespondentRegistrationFormData,
  currentStep: 1,
  isSubmitting: false,
  isSubmitted: false,
  errors: {},
  countryCode: defaultCountryCode,

  updateField: (field: string, value: any) =>
    set(
      (state: RespondentRegistrationFormStore) => {
        const newFormData: any = { ...state.formData };
        if (field.includes('.')) {
          const [parent, child] = field.split('.');
          const parentKey = parent as keyof RespondentRegistrationFormData;
          const currentParent = newFormData[parentKey];
          if (typeof currentParent === 'object' && currentParent !== null) {
            newFormData[parentKey] = {
              ...currentParent,
              [child]: value,
            };
          }
        } else {
          const fieldKey = field as keyof RespondentRegistrationFormData;
          newFormData[fieldKey] = value;
        }

        const newErrors = { ...state.errors };
        delete newErrors[field];

        return {
          ...state,
          formData: newFormData,
          errors: newErrors,
        };
      },
      false,
      `updateField_${field}`
    ),

  updateCountryCode: (code: string) =>
    set({ countryCode: code }, false, 'updateCountryCode'),

  nextStep: () => {
    const { currentStep, validateStep } = get();
    if (validateStep(currentStep)) {
      set({ currentStep: currentStep + 1 }, false, 'nextStep');
    }
  },

  skipStep: () =>
    set(
      (state: RespondentRegistrationFormStore) => ({
        currentStep: state.currentStep + 1,
      }),
      false,
      'skipStep'
    ),

  previousStep: () =>
    set(
      (state: RespondentRegistrationFormStore) => ({
        currentStep: Math.max(1, state.currentStep - 1),
      }),
      false,
      'previousStep'
    ),

  resetForm: () =>
    set(
      {
        formData: initialFormData as RespondentRegistrationFormData,
        currentStep: 1,
        isSubmitting: false,
        isSubmitted: false,
        errors: {},
        countryCode: defaultCountryCode,
      },
      false,
      'resetForm'
    ),

  validateStep: (step: number) => {
    const { formData, countryCode } = get();
    const errors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.firstName.trim())
        errors.firstName = validationMessages.firstName;
      if (!formData.lastName.trim())
        errors.lastName = validationMessages.lastName;
      if (!formData.email.trim())
        errors.email = validationMessages.email.required;
      else if (!emailRegexPattern.test(formData.email))
        errors.email = validationMessages.email.invalid;
      // Phone is optional but must match country-specific length when provided
      if (formData.phone?.trim()) {
        const digits = formData.phone.replace(/\D/g, '');
        const country = COUNTRY_CODES.find((c) => c.code === countryCode);
        const expected = country?.length;
        const valid = expected != null
          ? digits.length === expected
          : digits.length >= 7 && digits.length <= 15;
        if (!valid)
          errors.phone = validationMessages.phone.invalid;
      }
      if (!formData.password.trim())
        errors.password = validationMessages.password;
      if (!formData.confirmPassword.trim())
        errors.confirmPassword = validationMessages.confirmPassword.required;
      else if (formData.password !== formData.confirmPassword)
        errors.confirmPassword = validationMessages.confirmPassword.mismatch;
      // if (
      //   formData.dateOfBirth &&
      //   (!formData.dateOfBirth.month ||
      //     !formData.dateOfBirth.day ||
      //     !formData.dateOfBirth.year)
      // ) {
      //   errors.dateOfBirth = validationMessages.dateOfBirth;
      // }
      if (!formData.termsAccepted)
        errors.termsAccepted = validationMessages.termsAccepted;
      if (!formData.privacyAccepted)
        errors.privacyAccepted = validationMessages.privacyAccepted;
    }

    if (step === 3) {
      // paymentMethod is optional — empty/undefined treated as "skip"
      if (formData.paymentMethod === 'upi') {
        const hasUpiId = formData.payment?.upiId?.trim();
        const hasUpiMobile = formData.payment?.upiMobileNumber?.trim();

        if (!hasUpiId && !hasUpiMobile) {
          errors['payment.upiId'] = 'Enter UPI ID or UPI mobile number';
          errors['payment.upiMobileNumber'] =
            'Enter UPI ID or UPI mobile number';
        }

        if (!formData.payment?.upiFullName?.trim())
          errors['payment.upiFullName'] = 'Full name is required';
      }

      if (formData.paymentMethod === 'bank') {
        if (!formData.payment?.bankAccountNumber?.trim())
          errors['payment.bankAccountNumber'] = 'Account number is required';
        if (!formData.payment?.bankIfscCode?.trim())
          errors['payment.bankIfscCode'] = 'IFSC code is required';
        if (!formData.payment?.bankAccountHolderName?.trim())
          errors['payment.bankAccountHolderName'] =
            'Account holder name is required';
      }

      // Skip case → no validation
    }

    set({ errors }, false, 'validateStep');
    return Object.keys(errors).length === 0;
  },

  submitForm: async (
    onSubmit: (formData: RespondentRegistrationFormData) => Promise<any>
  ) => {
    const { formData } = get();

    set({ isSubmitting: true }, false, 'submitForm_start');

    try {
      const result = await onSubmit(formData);

      set(
        {
          isSubmitting: false,
          isSubmitted: true,
        },
        false,
        'submitForm_success'
      );

      // Check if user came from tracking link and handle redirect
      if (
        typeof window !== 'undefined' &&
        window.ThoughtMetrics?.isFromTrackingLink() &&
        result
      ) {
        window.ThoughtMetrics.onRegistered(
          result.firebaseUid || result._id,
          result.email
        );
        return; // Don't continue - onRegistered handles redirect
      }

      setTimeout(() => {
        get().resetForm();
      }, formResetDelay);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : validationMessages.submitError;
      set(
        {
          isSubmitting: false,
          errors: {
            general: errorMessage,
          },
        },
        false,
        'submitForm_error'
      );
    }
  },
});

// Zustand store with conditional devtools
const useRespondentRegistrationFormStore =
  create<RespondentRegistrationFormStore>()(
    import.meta.env.DEV
      ? devtools(storeImplementation, { name: storeName })
      : storeImplementation
  );

const RespondentSignUpPage: React.FC = () => {
  const signUpMutation = useSignUpMutation();
  const [isNavigating, setIsNavigating] = useState(false);

  // Extract and store tracking parameters from URL on mount
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const linkId = params.get('tm_link_id');
    const allocatedSurvey = params.get('allocated_survey');
    const redirectAfter = params.get('redirect_after');
    const userType = params.get('userType');

    // Store tracking parameters in localStorage for persistence
    if (linkId) {
      localStorage.setItem('tm_link_id', linkId);
    }
    if (allocatedSurvey) {
      localStorage.setItem('tm_allocated_survey', allocatedSurvey);
    }
    if (redirectAfter) {
      localStorage.setItem('tm_redirect_after_signup', redirectAfter);
    }
    if (userType) {
      localStorage.setItem('tm_user_type', userType);
    }
  }, []);

  // Translation hook
  const { translations } = useLanguage();

  // Translated participation options
  const translatedParticipationOptions = React.useMemo(() => {
    return participationOptions.map((option) => ({
      ...option,
      label:
        translations.participationOptions[
          option.id as keyof typeof translations.participationOptions
        ] || option.label,
    }));
  }, [translations]);

  // Translated FAQ data
  const translatedFaqData = React.useMemo(() => {
    const faq = translations.auth.signup.faq;
    return [
      { question: faq.question1, answer: faq.answer1 },
      { question: faq.question2, answer: faq.answer2 },
      { question: faq.question3, answer: faq.answer3 },
      { question: faq.question4, answer: faq.answer4 },
      { question: faq.question5, answer: faq.answer5 },
      { question: faq.question6, answer: faq.answer6 },
      { question: faq.question7, answer: faq.answer7 },
      { question: faq.question8, answer: faq.answer8 },
    ];
  }, [translations.auth.signup.faq]);

  const {
    formData,
    currentStep,
    isSubmitting,
    isSubmitted,
    errors,
    countryCode,
    updateField,
    updateCountryCode,
    nextStep,
    skipStep,
    submitForm,
  } = useRespondentRegistrationFormStore();

  const filteredStates =
    COUNTRY_STATES_MAP[formData.location?.countryOrRegion ?? ''] ?? [];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      updateField(name, checked);
    } else {
      updateField(name, value);
    }
  };

  const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateCountryCode(e.target.value);
  };

  const handleParticipationChange = (selectedValues: string[]) => {
    updateField('participationPreferences', selectedValues);
  };

  const handleZipCodeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField('location.zipCode', e.target.value);
  };

  const handleFirebaseSignUp = async (
    formData: RespondentRegistrationFormData
  ) => {
    // Convert dateOfBirth from {month, day, year} to Date object
    let dateOfBirth: Date | undefined;
    if (
      formData.dateOfBirth?.month &&
      formData.dateOfBirth?.day &&
      formData.dateOfBirth?.year
    ) {
      dateOfBirth = new Date(
        parseInt(formData.dateOfBirth.year),
        parseInt(formData.dateOfBirth.month) - 1, // Month is 0-indexed
        parseInt(formData.dateOfBirth.day)
      );
    }

    const storedUserType = localStorage.getItem('tm_user_type');

    const result = await signUpMutation.mutateAsync({
      type: 'email',
      data: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        dateOfBirth,
        gender: formData.gender,
        location: formData.location,
        participationPreferences: formData.participationPreferences,
        termsAccepted: formData.termsAccepted,
        privacyAccepted: formData.privacyAccepted,
        paymentMethod: formData.paymentMethod,
        payment: formData.payment,
        role: storedUserType ?? 'respondent',
      },
    });

    // If not from tracking link, redirect to survey boards after delay
    if (result && typeof window !== 'undefined' && !window.ThoughtMetrics?.isFromTrackingLink()) {
      setTimeout(() => {
        window.location.href = ROUTES.SURVEY_BOARDS;
      }, 2000);
    }

    // Return result so submitForm can pass it to tracking
    return result;
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signUpMutation.mutateAsync({ type: 'google' });

      // If popup returned a result (localhost), handle redirect
      if (result) {
        setIsNavigating(true);

        // Check if user came from tracking link and handle redirect
        if (
          typeof window !== 'undefined' &&
          window.ThoughtMetrics?.isFromTrackingLink() &&
          (result.firebaseUid || result._id) &&
          result.email
        ) {
          window.ThoughtMetrics.onRegistered(
            result.firebaseUid || result._id || '',
            result.email || ''
          );
          return; // onRegistered handles redirect
        }

        // Otherwise, check for allocated survey or use default
        const allocatedSurveyId = localStorage.getItem('tm_allocated_survey');
        const redirectTo = allocatedSurveyId
          ? `/survey-campaign/${allocatedSurveyId}`
          : localStorage.getItem('tm_redirect_after_signup') || ROUTES.SURVEY_BOARDS;

        // Clean up after use
        if (allocatedSurveyId) {
          localStorage.removeItem('tm_allocated_survey');
        }
        localStorage.removeItem('tm_redirect_after_signup');

        setTimeout(() => {
          window.location.href = redirectTo;
        }, 800);
      }
      // If redirect (production), page will redirect automatically
    } catch (error) {
      console.error('Google sign-up failed:', error);
      setIsNavigating(false);
    }
  };

  /* const handleFacebookSignUp = async () => {
    setSocialAuthLoading('facebook');
    try {
      const result = await signUpMutation.mutateAsync({ type: 'facebook' });
      if (result) {
        window.location.href = ROUTES.SURVEY_BOARDS;
      }
    } catch (error) {
      let errorCode = '';
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        typeof (error as { code?: unknown }).code === 'string'
      ) {
        errorCode = (error as { code: string }).code;
      }
      console.error('Facebook sign-up failed:', error);
      // Check if it's a user cancellation
      if (
        errorCode === 'auth/popup-closed-by-user' ||
        errorCode === 'auth/cancelled-popup-request'
      ) {
        // Immediately re-enable button on cancellation
        setSocialAuthLoading(null);
      } else {
        setSocialAuthLoading(null);
      }
    } finally {
      // Ensure loading state is cleared
      setSocialAuthLoading(null);
    }
  }; */

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 3) {
      void submitForm(handleFirebaseSignUp);
    } else {
      nextStep();
    }
  };

  const handleSkip = () => {
    if (currentStep === 3) {
      void submitForm(handleFirebaseSignUp);
    } else {
      skipStep();
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={{ background: 'var(--surface)' }}>
        <div className="max-w-md w-full text-center rounded-2xl p-10 border border-outline-variant/10" style={{ background: 'var(--surface-container-low)' }}>
          <span className="material-symbols-outlined text-secondary text-5xl mb-4 block">check_circle</span>
          <h2 className="text-2xl font-bold text-on-surface mb-2">
            {translations.auth.signup.welcomeMessage}
          </h2>
          <p className="text-on-surface-variant">
            {translations.auth.signup.accountCreatedSuccess}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Loading Overlay */}
      {isNavigating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="rounded-2xl p-8 max-w-sm mx-4 text-center" style={{ background: 'var(--surface-container-low)' }}>
            <div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-on-surface mb-1">
              {translations.auth.signup.redirecting ?? 'Signing you in…'}
            </h2>
            <p className="text-sm text-on-surface-variant">
              {translations.auth.signup.pleaseWait ?? 'Please wait while we redirect you'}
            </p>
          </div>
        </div>
      )}

      <div className="h-full overflow-y-auto" style={{ background: 'var(--surface)' }}>
        <div className="tm-container max-w-3xl mx-auto py-12 px-6">
          {/* Header row */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-on-surface mb-1">
                {translations.auth.signup.pageTitle}
              </h1>
              <p className="text-on-surface-variant text-sm">
                {translations.auth.signup.registerDescription}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <a href={ROUTES.LOGIN_IN} className="btn-hdr-outline text-sm">Log In</a>
              <LanguageToggle variant="compact" />
            </div>
          </div>

          {/* Google sign up */}
          <div className="mb-8">
            <button
              type="button"
              onClick={() => void handleGoogleSignUp()}
              className="flex items-center justify-center gap-3 py-3 px-5 rounded-xl text-sm font-medium text-on-surface transition-colors"
              style={{ background: 'var(--surface-container)', border: '1px solid color-mix(in srgb, var(--outline-variant) 50%, transparent)' }}
            >
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {translations.auth.signup.continueWithGoogle}
            </button>
          </div>

          {/* Step Indicator */}
          <div className="mb-8 rounded-xl p-4 border border-outline-variant/10" style={{ background: 'var(--surface-container-low)' }}>
            <div className="flex items-center gap-1.5 md:gap-6 overflow-x-auto overflow-y-hidden">
              <div
                className={`shrink-0 flex items-center ${currentStep >= 1 ? 'text-primary' : 'text-on-surface-variant'}`}
              >
                <div className="flex flex-col text-nowrap">
                  <span className="font-medium">
                    {translations.auth.signup.step1}
                  </span>
                  <span className="text-sm">
                    {translations.auth.signup.yourInformation}
                  </span>
                </div>
                {currentStep > 1 && (
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <svg
                className="w-4 h-8 text-on-surface-variant"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 12 38"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M0 5l14 14-14 16"
                />
              </svg>
              <div
                className={`flex items-center ${currentStep >= 2 ? 'text-primary' : 'text-on-surface-variant'}`}
              >
                <div className="flex flex-col text-nowrap">
                  <span className="font-medium">
                    {translations.auth.signup.step2}
                  </span>
                  <span className="text-sm">
                    {translations.auth.signup.preferences}{' '}
                    <span className="text-xs text-on-surface-variant/60">(Optional)</span>
                  </span>
                </div>

                {currentStep > 2 && (
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <svg
                className="w-4 h-8 text-on-surface-variant"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 12 38"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M0 5l14 14-14 16"
                />
              </svg>
              <div
                className={`flex items-center ${currentStep >= 3 ? 'text-primary' : 'text-on-surface-variant'}`}
              >
                <div className="flex flex-col text-nowrap">
                  <span className="font-medium">
                    {translations.auth.signup.step3}
                  </span>
                  <span className="text-sm">
                    {translations.auth.signup.paymentInfo}{' '}
                    <span className="text-xs text-on-surface-variant/60">(Optional)</span>
                  </span>
                </div>
                {currentStep > 3 && (
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <svg
                className="w-4 h-8 text-on-surface-variant"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 12 38"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M0 5l14 14-14 16"
                />
              </svg>
              <div
                className={`flex items-center ${currentStep >= 4 ? 'text-primary' : 'text-on-surface-variant'}`}
              >
                <div className="flex flex-col text-nowrap">
                  <span className="font-medium">
                    {translations.auth.signup.step4}
                  </span>
                  <span className="text-sm">
                    {translations.auth.signup.surveys}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {currentStep === 1 && (
              <>
                <p className="text-xl font-medium tracking-tighter mb-4">
                  {translations.auth.signup.requiredFields}
                </p>

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  <TextInputAtom
                    id="firstName"
                    name="firstName"
                    label={translations.auth.signup.firstName}
                    value={formData.firstName}
                    onChange={handleInputChange}
                    error={errors.firstName}
                    required
                  />
                  <TextInputAtom
                    id="lastName"
                    name="lastName"
                    label={translations.auth.signup.lastName}
                    value={formData.lastName}
                    onChange={handleInputChange}
                    error={errors.lastName}
                    required
                  />
                  {/* Email and Password */}
                  <TextInputAtom
                    id="email"
                    name="email"
                    label={translations.auth.signup.email}
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                    required
                  />
                  <TextInputAtom
                    id="password"
                    name="password"
                    label={translations.auth.signup.password}
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    error={errors.password}
                    required
                  />
                  <TextInputAtom
                    id="confirmPassword"
                    name="confirmPassword"
                    label={translations.auth.signup.confirmPassword}
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    error={errors.confirmPassword}
                    required
                  />
                  {/* Phone */}
                  <PhoneInputAtom
                    id="phone"
                    name="phone"
                    label={translations.auth.signup.phone}
                    value={formData.phone ?? ''}
                    onChange={handleInputChange}
                    countryCode={countryCode}
                    onCountryCodeChange={handleCountryCodeChange}
                    countryCodes={countryCodes}
                  />
                  {/* Gender */}
                  <SelectAtom
                    id="gender"
                    name="gender"
                    label={translations.auth.signup.gender}
                    value={formData.gender ?? ''}
                    onChange={handleInputChange}
                    options={genders}
                    error={errors.gender}
                    placeholder="Select gender"
                  />
                  {/* Location Fields */}
                  {FEATURE_FLAGS.showAddressFields && (
                    <>
                      <TextInputAtom
                        id="doorNumberOrStreetName"
                        name="location.doorNumberOrStreetName"
                        label={translations.auth.signup.doorNumber}
                        value={formData.location?.doorNumberOrStreetName ?? ''}
                        onChange={(e) =>
                          updateField(
                            'location.doorNumberOrStreetName',
                            e.target.value
                          )
                        }
                        error={errors['location.doorNumberOrStreetName']}
                      />
                      <TextInputAtom
                        id="zipCode"
                        name="location.zipCode"
                        label={translations.auth.signup.zipCode}
                        value={formData.location?.zipCode ?? ''}
                        onChange={handleZipCodeInputChange}
                        error={errors['location.zipCode']}
                        placeholder="Enter ZIP/PIN code"
                      />
                      <SelectAtom
                        id="countryOrRegion"
                        name="location.countryOrRegion"
                        label={translations.auth.signup.country}
                        value={formData.location?.countryOrRegion ?? ''}
                        onChange={(e) =>
                          updateField('location.countryOrRegion', e.target.value)
                        }
                        options={countries}
                        error={errors['location.countryOrRegion']}
                        placeholder="Select country/region"
                      />
                      <SelectAtom
                        id="state"
                        name="location.state"
                        label={translations.auth.signup.state}
                        value={formData.location?.state ?? ''}
                        onChange={(e) =>
                          updateField('location.state', e.target.value)
                        }
                        options={filteredStates}
                        error={errors['location.state']}
                        placeholder="Select state"
                      />
                      <TextInputAtom
                        id="district"
                        name="location.district"
                        label={translations.auth.signup.district}
                        value={formData.location?.district ?? ''}
                        onChange={(e) =>
                          updateField('location.district', e.target.value)
                        }
                        error={errors['location.district']}
                      />
                      <TextInputAtom
                        id="city"
                        name="location.city"
                        label={translations.auth.signup.city}
                        value={formData.location?.city ?? ''}
                        onChange={(e) =>
                          updateField('location.city', e.target.value)
                        }
                        error={errors['location.city']}
                      />
                    </>
                  )}
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    {translations.auth.signup.dateOfBirth} (Optional)
                  </label>
                  <div className="grid grid-cols-3 gap-4 w-fit">
                    <SelectAtom
                      id="month"
                      name="dateOfBirth.month"
                      label=""
                      value={formData.dateOfBirth?.month ?? ''}
                      onChange={(e) =>
                        updateField('dateOfBirth.month', e.target.value)
                      }
                      options={months}
                      placeholder="Month"
                    />
                    <SelectAtom
                      id="day"
                      name="dateOfBirth.day"
                      label=""
                      value={formData.dateOfBirth?.day ?? ''}
                      onChange={(e) =>
                        updateField('dateOfBirth.day', e.target.value)
                      }
                      options={days}
                      placeholder="Day"
                    />
                    <SelectAtom
                      id="year"
                      name="dateOfBirth.year"
                      label=""
                      value={formData.dateOfBirth?.year ?? ''}
                      onChange={(e) =>
                        updateField('dateOfBirth.year', e.target.value)
                      }
                      options={years}
                      placeholder="Year"
                    />
                  </div>
                  {errors.dateOfBirth && (
                    <p className="text-sm text-primary">{errors.dateOfBirth}</p>
                  )}
                </div>

                {/* Terms and Privacy */}
                <div className="space-y-4">
                  <CheckboxAtom
                    id="termsAccepted"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleInputChange}
                    error={errors.termsAccepted}
                    customLabelComponent={
                      <div>
                        {translations.auth.signup.termsAccepted}{' '}
                        <a
                          href={ui.checkboxLabels.termsItem.path}
                          className="hover:text-primary underline"
                        >
                          {translations.auth.signup.termsAndConditions}
                        </a>
                      </div>
                    }
                  />

                  <CheckboxAtom
                    id="privacyAccepted"
                    name="privacyAccepted"
                    checked={formData.privacyAccepted}
                    onChange={handleInputChange}
                    customLabelComponent={
                      <div>
                        {translations.auth.signup.privacyAccepted}{' '}
                        <a
                          href={ui.checkboxLabels.privacyItem.path}
                          className="hover:text-primary underline"
                        >
                          {translations.auth.signup.privacyPolicy}
                        </a>{' '}
                        {ui.checkboxLabels.privacyAccepted.suffix}
                      </div>
                    }
                    error={errors.privacyAccepted}
                  />
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <h2 className="text-2xl font-bold text-on-surface mb-4">
                  {translations.auth.signup.participationPreferences}
                </h2>
                <p className="text-on-surface-variant mb-6">
                  {translations.auth.signup.participationDescription}
                </p>

                <CheckboxOutlineGroupAtom
                  label=""
                  options={translatedParticipationOptions}
                  selectedValues={formData.participationPreferences ?? []}
                  onChange={handleParticipationChange}
                  columns={1}
                />
              </>
            )}
            {currentStep === 3 && (
              <>
                <h2 className="text-2xl font-bold text-on-surface mb-4">
                  {translations.auth.signup.payment.title}
                </h2>

                <p className="text-on-surface-variant mb-6">
                  {translations.auth.signup.payment.description}
                </p>

                <SelectAtom
                  id="paymentMethod"
                  name="paymentMethod"
                  label={translations.auth.signup.payment.methodLabel}
                  value={formData.paymentMethod ?? ''}
                  onChange={(e) => updateField('paymentMethod', e.target.value)}
                  options={[
                    {
                      value: 'upi',
                      label: translations.auth.signup.payment.upiPayment,
                    },
                    {
                      value: 'bank',
                      label: translations.auth.signup.payment.bankTransfer,
                    },
                    {
                      value: 'skip',
                      label: translations.auth.signup.payment.skipForNow,
                    },
                  ]}
                  error={errors.paymentMethod}
                  placeholder={
                    translations.auth.signup.payment.methodPlaceholder
                  }
                />

                {formData.paymentMethod === 'upi' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <TextInputAtom
                      id="upiId"
                      name="payment.upiId"
                      label={translations.auth.signup.payment.upi.upiIdLabel}
                      value={formData.payment?.upiId ?? ''}
                      onChange={(e) =>
                        updateField('payment.upiId', e.target.value)
                      }
                      error={errors['payment.upiId']}
                      placeholder={
                        translations.auth.signup.payment.upi.upiIdPlaceholder
                      }
                    />

                    <TextInputAtom
                      id="upiMobileNumber"
                      name="payment.upiMobileNumber"
                      label={translations.auth.signup.payment.upi.mobileLabel}
                      value={formData.payment?.upiMobileNumber ?? ''}
                      onChange={(e) =>
                        updateField('payment.upiMobileNumber', e.target.value)
                      }
                      error={errors['payment.upiMobileNumber']}
                      placeholder={
                        translations.auth.signup.payment.upi.mobilePlaceholder
                      }
                    />

                    <TextInputAtom
                      id="upiFullName"
                      name="payment.upiFullName"
                      label={translations.auth.signup.payment.upi.fullNameLabel}
                      value={formData.payment?.upiFullName ?? ''}
                      onChange={(e) =>
                        updateField('payment.upiFullName', e.target.value)
                      }
                      error={errors['payment.upiFullName']}
                      required
                    />
                  </div>
                )}

                {formData.paymentMethod === 'bank' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <TextInputAtom
                      id="bankAccountNumber"
                      name="payment.bankAccountNumber"
                      label={
                        translations.auth.signup.payment.bank.accountNumberLabel
                      }
                      value={formData.payment?.bankAccountNumber ?? ''}
                      onChange={(e) =>
                        updateField('payment.bankAccountNumber', e.target.value)
                      }
                      error={errors['payment.bankAccountNumber']}
                      required
                    />

                    <TextInputAtom
                      id="bankIfscCode"
                      name="payment.bankIfscCode"
                      label={translations.auth.signup.payment.bank.ifscLabel}
                      value={formData.payment?.bankIfscCode ?? ''}
                      onChange={(e) =>
                        updateField('payment.bankIfscCode', e.target.value)
                      }
                      error={errors['payment.bankIfscCode']}
                      required
                    />

                    <TextInputAtom
                      id="bankAccountHolderName"
                      name="payment.bankAccountHolderName"
                      label={
                        translations.auth.signup.payment.bank.holderNameLabel
                      }
                      value={formData.payment?.bankAccountHolderName ?? ''}
                      onChange={(e) =>
                        updateField(
                          'payment.bankAccountHolderName',
                          e.target.value
                        )
                      }
                      error={errors['payment.bankAccountHolderName']}
                      required
                    />
                  </div>
                )}

                {formData.paymentMethod === 'skip' && (
                  <p className="text-on-surface-variant mt-4">
                    {translations.auth.signup.payment.skipMessage}
                  </p>
                )}
              </>
            )}

            {/* General Error Message */}
            {errors.general && (
              <div className="rounded-xl p-4 flex items-center gap-2 text-sm" style={{ background: 'color-mix(in srgb,var(--error) 10%,transparent)', border: '1px solid color-mix(in srgb,var(--error) 30%,transparent)', color: 'var(--error)' }}>
                <span className="material-symbols-outlined text-base flex-shrink-0">error</span>
                {errors.general}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center gap-4 flex-wrap">
              <button
                type="submit"
                className="btn-primary flex items-center gap-2 py-3 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <><span className="material-symbols-outlined text-xl animate-spin">progress_activity</span>{translations.auth.signup.processing}</>
                ) : (
                  <>{currentStep === 3 ? translations.auth.signup.registerButton : translations.auth.signup.nextButton}<span className="material-symbols-outlined text-xl">arrow_forward</span></>
                )}
              </button>
              {(currentStep === 2 || currentStep === 3) && (
                <button
                  type="button"
                  onClick={handleSkip}
                  disabled={isSubmitting}
                  className="text-sm text-on-surface-variant hover:text-primary underline underline-offset-2 transition-colors disabled:opacity-50"
                >
                  {currentStep === 3 ? 'Skip & Register' : 'Skip this step'}
                </button>
              )}
            </div>
          </form>
          <div className="py-12">
            <FaqOrganism data={translatedFaqData} />
          </div>
        </div>
      </div>
    </>
  );
};

const RespondentSignUpWrapper: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RespondentSignUpPage />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default RespondentSignUpWrapper;
