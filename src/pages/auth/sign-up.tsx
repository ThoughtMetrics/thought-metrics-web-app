import type React from 'react';
import { signUpFormConstant } from './constant';
import type {
  RegistrationFormData,
  RegistrationFormStore,
} from '@/core/types/signup.type';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  CheckboxAtom,
  CheckboxGroupAtom,
  PhoneInputAtom,
  SelectAtom,
  TextInputAtom,
} from '@/shared/ui/atoms/custom-input';
import { Link } from 'react-router-dom';
import { ArrowRed, FacebookOutlineIcon, GoogleOutlineIcon } from '@/assets';
import FaqOrganism from '@/shared/ui/organisms/faq-organism';

// Destructure constants
const {
  initialFormData,
  participationOptions,
  months,
  states,
  countryCodes,
  defaultCountryCode,
  storeName,
  validationMessages,
  emailRegex,
  formResetDelay,
  apiSimulationDelay,
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

// Zustand store
const useRegistrationFormStore = create<RegistrationFormStore>()(
  devtools(
    (set, get) => ({
      formData: initialFormData as RegistrationFormData,
      currentStep: 1,
      isSubmitting: false,
      isSubmitted: false,
      errors: {},
      countryCode: defaultCountryCode,

      updateField: (field, value) =>
        set(
          (state) => {
            const newFormData = { ...state.formData } as any;
            if (field.includes('.')) {
              const [parent, child] = field.split('.');
              newFormData[parent] = { ...newFormData[parent], [child]: value };
            } else {
              newFormData[field] = value;
            }

            const newErrors = { ...state.errors };
            delete newErrors[field];

            return {
              ...state,
              formData: newFormData as RegistrationFormData,
              errors: newErrors,
            };
          },
          false,
          `updateField_${field}`
        ),

      updateCountryCode: (code) =>
        set({ countryCode: code }, false, 'updateCountryCode'),

      nextStep: () => {
        const { currentStep, validateStep } = get();
        if (validateStep(currentStep)) {
          set({ currentStep: currentStep + 1 }, false, 'nextStep');
        }
      },

      previousStep: () =>
        set(
          (state) => ({ currentStep: Math.max(1, state.currentStep - 1) }),
          false,
          'previousStep'
        ),

      resetForm: () =>
        set(
          {
            formData: initialFormData as RegistrationFormData,
            currentStep: 1,
            isSubmitting: false,
            isSubmitted: false,
            errors: {},
            countryCode: defaultCountryCode,
          },
          false,
          'resetForm'
        ),

      validateStep: (step) => {
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
            errors.confirmPassword =
              validationMessages.confirmPassword.required;
          else if (formData.password !== formData.confirmPassword)
            errors.confirmPassword =
              validationMessages.confirmPassword.mismatch;
          if (!formData.address1.trim())
            errors.address1 = validationMessages.address1;
          if (!formData.city.trim()) errors.city = validationMessages.city;
          if (!formData.state.trim()) errors.state = validationMessages.state;
          if (!formData.zipCode.trim())
            errors.zipCode = validationMessages.zipCode;
          if (
            !formData.dateOfBirth.month ||
            !formData.dateOfBirth.day ||
            !formData.dateOfBirth.year
          ) {
            errors.dateOfBirth = validationMessages.dateOfBirth;
          }
          if (!formData.termsAccepted)
            errors.termsAccepted = validationMessages.termsAccepted;
          if (!formData.privacyAccepted)
            errors.privacyAccepted = validationMessages.privacyAccepted;
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

const SignUpPage: React.FC = () => {
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
  } = useRegistrationFormStore();

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 2) {
      void submitForm();
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
    <div className="common-component bg-white text-black">
      <div className="common-container px-6 py-8 md:px-24 md:py-12 justify-center flex-col !max-w-[var(--breakpoint-2xl)]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-medium tracking-tighter text-gray-900 mb-2">
            {ui.pageTitle}
          </h1>
          <Link
            to="#"
            className="text-black font-medium hover:font-semibold underline text-sm"
          >
            {ui.whyRegister}
          </Link>
          <p className="text-black mt-2 text-sm">{ui.registerDescription}</p>
        </div>

        {/* Social Login Buttons */}
        <div className="mb-8 space-y-3 grid grid-cols-1 w-full md:w-fit">
          <button className="relative col-span-1 flex items-center pl-4 pr-12 py-2 bg-[#1877F2] text-white rounded hover:bg-blue-700 transition-colors">
            <FacebookOutlineIcon className="w-5 h-5 mr-8" />
            <div className="left-13 absolute w-0.25 h-full bg-white"></div>
            {ui.socialButtons.facebook}
          </button>
          <button className="relative col-span-1 flex items-center pl-4 pr-12 py-2 bg-[#1877F2] text-white rounded hover:bg-red-700 transition-colors">
            <GoogleOutlineIcon className="w-5 h-5 mr-8" />
            <div className="left-13 absolute w-0.25 h-full bg-white"></div>
            {ui.socialButtons.google}
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
                {/* Address Fields */}
                <TextInputAtom
                  id="address1"
                  name="address1"
                  label={ui.fieldLabels.address1}
                  value={formData.address1}
                  onChange={handleInputChange}
                  error={errors.address1}
                  required
                />
                <TextInputAtom
                  id="address2"
                  name="address2"
                  label={ui.fieldLabels.address2}
                  value={formData.address2}
                  onChange={handleInputChange}
                />
                {/* Email and Phone */}
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
                <PhoneInputAtom
                  id="phone"
                  name="phone"
                  label={ui.fieldLabels.phone}
                  value={formData.phone}
                  onChange={handleInputChange}
                  countryCode={countryCode}
                  onCountryCodeChange={handleCountryCodeChange}
                  countryCodes={countryCodes}
                />
                {/* City, State, Zip */}
                <TextInputAtom
                  id="city"
                  name="city"
                  label={ui.fieldLabels.city}
                  value={formData.city}
                  onChange={handleInputChange}
                  error={errors.city}
                  required
                />
                <SelectAtom
                  id="state"
                  name="state"
                  label={ui.fieldLabels.state}
                  value={formData.state}
                  onChange={handleInputChange}
                  options={states}
                  error={errors.state}
                  required
                  placeholder="Select state"
                />
                <TextInputAtom
                  id="zipCode"
                  name="zipCode"
                  label={ui.fieldLabels.zipCode}
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  error={errors.zipCode}
                  required
                />
                {/* Password Fields */}
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
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  {ui.fieldLabels.dateOfBirth}*
                </label>
                <div className="grid grid-cols-3 gap-4 w-fit">
                  <SelectAtom
                    id="month"
                    name="dateOfBirth.month"
                    label=""
                    value={formData.dateOfBirth.month}
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
                    value={formData.dateOfBirth.day}
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
                    value={formData.dateOfBirth.year}
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
                  label={ui.checkboxLabels.termsAccepted}
                />
                {errors.termsAccepted && (
                  <p className="text-sm text-primary">{errors.termsAccepted}</p>
                )}

                <CheckboxAtom
                  id="privacyAccepted"
                  name="privacyAccepted"
                  checked={formData.privacyAccepted}
                  onChange={handleInputChange}
                  label={ui.checkboxLabels.privacyAccepted}
                />
                {errors.privacyAccepted && (
                  <p className="text-sm text-primary">
                    {errors.privacyAccepted}
                  </p>
                )}
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {ui.preferences.title}
              </h2>
              <p className="text-gray-600 mb-6">{ui.preferences.description}</p>

              <CheckboxGroupAtom
                label=""
                options={participationOptions}
                selectedValues={formData.participationPreferences}
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
  );
};

export default SignUpPage;
