import React, { useState } from 'react';
import { signUpFormConstant } from '../../core/constants/page-constants/auth-constant';
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
import { ArrowRed, FacebookOutlineIcon, GoogleOutlineIcon } from '@/assets';
import FaqOrganism from '@/shared/ui/organisms/faq-organism';
import { useSignUpMutation } from '@/core/hooks/mutations/use-sign-up.mutation';
import { ROUTES } from '@/routes/routeConfig';
import { LoaderOverlay } from '@/shared/ui/atoms/loader';

// Destructure constants
const {
  initialFormData,
  participationOptions,
  genders,
  months,
  states,
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
    const { formData } = get();
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
      if (!formData.password.trim())
        errors.password = validationMessages.password;
      if (!formData.confirmPassword.trim())
        errors.confirmPassword = validationMessages.confirmPassword.required;
      else if (formData.password !== formData.confirmPassword)
        errors.confirmPassword = validationMessages.confirmPassword.mismatch;
      if (!formData.location?.doorNumberOrStreetName?.trim())
        errors['location.doorNumberOrStreetName'] =
          validationMessages.doorNumberOrStreetName;
      if (!formData.location?.city?.trim())
        errors['location.city'] = validationMessages.city;
      if (!formData.location?.state?.trim())
        errors['location.state'] = validationMessages.state;
      if (!formData.location?.countryOrRegion?.trim())
        errors['location.countryOrRegion'] = validationMessages.countryOrRegion;
      if (!formData.location?.zipCode?.trim())
        errors['location.zipCode'] = validationMessages.zipCode;
      if (!formData.gender?.trim()) errors.gender = validationMessages.gender;
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

    set({ errors }, false, 'validateStep');
    return Object.keys(errors).length === 0;
  },

  submitForm: async (
    onSubmit: (formData: RespondentRegistrationFormData) => Promise<void>
  ) => {
    const { formData } = get();

    set({ isSubmitting: true }, false, 'submitForm_start');

    try {
      await onSubmit(formData);

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
  const [socialAuthLoading, setSocialAuthLoading] = useState<
    'google' | 'facebook' | null
  >(null);

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
    submitForm,
  } = useRespondentRegistrationFormStore();

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
      },
    });

    if (result) {
      setTimeout(() => {
        window.location.href = ROUTES.SURVEY_PAGE;
      }, 2000);
    }
  };

  const handleGoogleSignUp = async () => {
    setSocialAuthLoading('google');
    try {
      const result = await signUpMutation.mutateAsync({ type: 'google' });
      if (result) {
        window.location.href = ROUTES.SURVEY_PAGE;
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
      console.error('Google sign-up failed:', error);
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
  };

  const handleFacebookSignUp = async () => {
    setSocialAuthLoading('facebook');
    try {
      const result = await signUpMutation.mutateAsync({ type: 'facebook' });
      if (result) {
        window.location.href = ROUTES.SURVEY_PAGE;
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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 2) {
      void submitForm(handleFirebaseSignUp);
    } else {
      nextStep();
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md text-center bg-white rounded-lg shadow-lg p-8">
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {ui.successMessage.title}
          </h2>
          <p className="text-gray-600">{ui.successMessage.description}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <LoaderOverlay
        isVisible={socialAuthLoading !== null}
        message={
          socialAuthLoading === 'google'
            ? 'Signing in with Google...'
            : socialAuthLoading === 'facebook'
              ? 'Signing in with Facebook...'
              : 'Loading...'
        }
      />
      <div className="common-component bg-white text-black">
        <div className="common-container px-6 py-8 md:px-24 md:py-12 justify-center flex-col !max-w-[var(--breakpoint-2xl)]">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-medium tracking-tighter text-gray-900 mb-2">
              {ui.pageTitle}
            </h1>
            <a
              href="#"
              className="text-black font-medium hover:font-semibold underline text-sm"
            >
              {ui.whyRegister}
            </a>
            <p className="text-black mt-2 text-sm">{ui.registerDescription}</p>
          </div>

          {/* Social Login Buttons */}
          <div className="mb-8 space-y-3 grid grid-cols-1 w-full md:w-fit">
            <button
              type="button"
              onClick={() => void handleFacebookSignUp()}
              disabled={socialAuthLoading !== null}
              className="relative col-span-1 flex items-center pl-4 pr-12 py-2 bg-[#1877F2] text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FacebookOutlineIcon className="w-5 h-5 mr-8" />
              <div className="left-13 absolute w-0.25 h-full bg-white"></div>
              {socialAuthLoading === 'facebook'
                ? 'Signing in...'
                : ui.socialButtons.facebook}
            </button>
            <button
              type="button"
              onClick={() => void handleGoogleSignUp()}
              disabled={socialAuthLoading !== null}
              className="relative col-span-1 flex items-center pl-4 pr-12 py-2 bg-[#DB4437] text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <GoogleOutlineIcon className="w-5 h-5 mr-8" />
              <div className="left-13 absolute w-0.25 h-full bg-white"></div>
              {socialAuthLoading === 'google'
                ? 'Signing in...'
                : ui.socialButtons.google}
            </button>
          </div>

          {/* Step Indicator */}
          <div className="mb-8 bg-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-1.5 md:gap-6">
              <div
                className={`flex items-center ${currentStep >= 1 ? 'text-primary' : 'text-black'}`}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{ui.steps.step1.number}</span>
                  <span className="text-sm">{ui.steps.step1.title}</span>
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
                className="w-4 h-8 text-black"
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
                className={`flex items-center ${currentStep >= 2 ? 'text-primary' : 'text-black'}`}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{ui.steps.step2.number}</span>
                  <span className="text-sm">{ui.steps.step2.title}</span>
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
                className="w-4 h-8 text-black"
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
                className={`flex items-center ${currentStep >= 3 ? 'text-primary' : 'text-black'}`}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{ui.steps.step3.number}</span>
                  <span className="text-sm">{ui.steps.step3.title}</span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {currentStep === 1 && (
              <>
                <p className="text-xl font-medium tracking-tighter mb-4">
                  {ui.notes.requiredFields}
                </p>

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  <TextInputAtom
                    id="firstName"
                    name="firstName"
                    label={ui.fieldLabels.firstName}
                    value={formData.firstName}
                    onChange={handleInputChange}
                    error={errors.firstName}
                    required
                  />
                  <TextInputAtom
                    id="lastName"
                    name="lastName"
                    label={ui.fieldLabels.lastName}
                    value={formData.lastName}
                    onChange={handleInputChange}
                    error={errors.lastName}
                    required
                  />
                  {/* Email and Password */}
                  <TextInputAtom
                    id="email"
                    name="email"
                    label={ui.fieldLabels.email}
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                    required
                  />
                  <TextInputAtom
                    id="password"
                    name="password"
                    label={ui.fieldLabels.password}
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    error={errors.password}
                    required
                  />
                  <TextInputAtom
                    id="confirmPassword"
                    name="confirmPassword"
                    label={ui.fieldLabels.confirmPassword}
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
                    label={ui.fieldLabels.phone}
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
                    label={ui.fieldLabels.gender}
                    value={formData.gender ?? ''}
                    onChange={handleInputChange}
                    options={genders}
                    error={errors.gender}
                    placeholder="Select gender"
                  />
                  {/* Location Fields */}
                  <TextInputAtom
                    id="doorNumberOrStreetName"
                    name="location.doorNumberOrStreetName"
                    label={ui.fieldLabels.doorNumberOrStreetName}
                    value={formData.location?.doorNumberOrStreetName ?? ''}
                    onChange={(e) =>
                      updateField(
                        'location.doorNumberOrStreetName',
                        e.target.value
                      )
                    }
                    error={errors['location.doorNumberOrStreetName']}
                    required
                  />
                  <TextInputAtom
                    id="city"
                    name="location.city"
                    label={ui.fieldLabels.city}
                    value={formData.location?.city ?? ''}
                    onChange={(e) =>
                      updateField('location.city', e.target.value)
                    }
                    error={errors['location.city']}
                    required
                  />
                  <TextInputAtom
                    id="district"
                    name="location.district"
                    label={ui.fieldLabels.district}
                    value={formData.location?.district ?? ''}
                    onChange={(e) =>
                      updateField('location.district', e.target.value)
                    }
                    error={errors['location.district']}
                  />
                  <SelectAtom
                    id="state"
                    name="location.state"
                    label={ui.fieldLabels.state}
                    value={formData.location?.state ?? ''}
                    onChange={(e) =>
                      updateField('location.state', e.target.value)
                    }
                    options={states}
                    error={errors['location.state']}
                    required
                    placeholder="Select state"
                  />
                  <SelectAtom
                    id="countryOrRegion"
                    name="location.countryOrRegion"
                    label={ui.fieldLabels.countryOrRegion}
                    value={formData.location?.countryOrRegion ?? ''}
                    onChange={(e) =>
                      updateField('location.countryOrRegion', e.target.value)
                    }
                    options={countries}
                    error={errors['location.countryOrRegion']}
                    required
                    placeholder="Select country/region"
                  />
                  <TextInputAtom
                    id="zipCode"
                    name="location.zipCode"
                    label={ui.fieldLabels.zipCode}
                    value={formData.location?.zipCode ?? ''}
                    onChange={handleZipCodeInputChange}
                    error={errors['location.zipCode']}
                    required
                    placeholder="Enter ZIP/PIN code"
                  />
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    {ui.fieldLabels.dateOfBirth} (Optional)
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
                        {ui.checkboxLabels.termsAccepted}{' '}
                        <a
                          href={ui.checkboxLabels.termsItem.path}
                          className="hover:text-primary underline"
                        >
                          {ui.checkboxLabels.termsItem.terms}
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
                        {ui.checkboxLabels.privacyAccepted.prefix}{' '}
                        <a
                          href={ui.checkboxLabels.privacyItem.path}
                          className="hover:text-primary underline"
                        >
                          {ui.checkboxLabels.privacyItem.privacy}
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {ui.preferences.title}
                </h2>
                <p className="text-gray-600 mb-6">
                  {ui.preferences.description}
                </p>

                <CheckboxOutlineGroupAtom
                  label=""
                  options={participationOptions}
                  selectedValues={formData.participationPreferences ?? []}
                  onChange={handleParticipationChange}
                  columns={1}
                />
              </>
            )}

            {/* Submit Button */}
            <button
              className="bg-primary w-auto hover:bg-secondary transition-all duration-300 ease-in-out rounded px-6 py-2 flex items-center gap-4"
              disabled={isSubmitting}
            >
              <label className="text-white text-nowrap font-medium">
                {isSubmitting
                  ? ui.buttons.processing
                  : currentStep === 2
                    ? ui.buttons.register
                    : ui.buttons.next}
              </label>
              <ArrowRed className="fill-current text-white" />
            </button>
          </form>
          <div className="py-12">
            <FaqOrganism data={ui.faqData} />
          </div>
        </div>
      </div>
    </>
  );
};

export default RespondentSignUpPage;
