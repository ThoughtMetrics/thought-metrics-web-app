import type {
  ResearchFormData,
  ResearchFormStore,
} from '@/core/types/start-research-item.type';
import { startYourResearchConstants } from './constant';
import { IllustrationSquares2 } from '@/assets';
import {
  CheckboxAtom,
  CheckboxGroupAtom,
  PhoneInputAtom,
  SelectAtom,
  TextareaAtom,
  TextInputAtom,
} from '@/shared/ui/atoms/custom-input';
import CustomButtonAtom from '@/shared/ui/atoms/custom-button';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes/routeConfig';
import { devtools } from 'zustand/middleware';
import React from 'react';
import { create } from 'zustand';

const {
  initialFormData,
  countries,
  countryCodes,
  helpOptions,
  researchTypes,
  defaultCountryCode,
  storeName,
  validationMessages,
  emailRegex,
  formResetDelay,
  apiSimulationDelay,
  ui,
} = startYourResearchConstants;

const emailRegexPattern = new RegExp(emailRegex);

// Zustand store
const useResearchFormStore = create<ResearchFormStore>()(
  devtools(
    (set, get) => ({
      formData: initialFormData as ResearchFormData,
      isSubmitting: false,
      isSubmitted: false,
      errors: {},
      countryCode: defaultCountryCode,

      updateField: (field, value) =>
        set(
          (state) => ({
            formData: { ...state.formData, [field]: value },
            errors: { ...state.errors, [field]: undefined },
          }),
          false,
          `updateField_${field}`
        ),

      updateCountryCode: (code) =>
        set({ countryCode: code }, false, 'updateCountryCode'),

      resetForm: () =>
        set(
          {
            formData: initialFormData as ResearchFormData,
            isSubmitting: false,
            isSubmitted: false,
            errors: {},
            countryCode: defaultCountryCode,
          },
          false,
          'resetForm'
        ),

      validateForm: () => {
        const { formData } = get();
        const errors: Partial<ResearchFormData> = {};

        if (!formData.firstName.trim())
          errors.firstName = validationMessages.firstName;
        if (!formData.lastName.trim())
          errors.lastName = validationMessages.lastName;
        if (!formData.businessEmail.trim())
          errors.businessEmail = validationMessages.businessEmail.required;
        else if (!emailRegexPattern.test(formData.businessEmail))
          errors.businessEmail = validationMessages.businessEmail.invalid;
        if (!formData.countryOrRegion.trim())
          errors.countryOrRegion = validationMessages.countryOrRegion;
        if (!formData.company.trim())
          errors.company = validationMessages.company;
        if (!formData.researchTopic.trim())
          errors.researchTopic = validationMessages.researchTopic;
        if (!formData.projectDetails.trim())
          errors.projectDetails = validationMessages.projectDetails;

        set({ errors }, false, 'validateForm');
        return Object.keys(errors).length === 0;
      },

      submitForm: async () => {
        const { formData, validateForm } = get();

        if (!validateForm()) return;

        set({ isSubmitting: true }, false, 'submitForm_start');

        try {
          await new Promise((resolve) =>
            setTimeout(resolve, apiSimulationDelay)
          );

          console.log('Research form submitted:', formData);

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
              errors: { businessEmail: validationMessages.submitError },
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

const ResearchForm: React.FC = () => {
  const {
    formData,
    isSubmitting,
    isSubmitted,
    errors,
    countryCode,
    updateField,
    updateCountryCode,
    submitForm,
  } = useResearchFormStore();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      updateField(name as keyof ResearchFormData, checked);
    } else {
      updateField(name as keyof ResearchFormData, value);
    }
  };

  const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateCountryCode(e.target.value);
  };

  const handleCheckboxGroupChange =
    (field: keyof ResearchFormData) => (selectedValues: string[]) => {
      updateField(field, selectedValues);
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
    <div className="common-component bg-white text-black flex-col items-center">
      <div className="form-1-component w-full min-h-[240px] md:min-h-[480px] xxl:p-0 z-1 flex items-center relative">
        <div className="flex absolute w-full h-[95%] justify-end top-1/2 transform -translate-y-1/2">
          <IllustrationSquares2 className="h-full w-auto stroke-1" />
        </div>
        <h2 className="pl-[15%] text-xl md:text-4xl font-semibold text-white">
          {ui.pageTitle}
        </h2>
        <div className="absolute top-0 w-full h-full bg-primary/65 -z-1" />
      </div>

      <div className="common-container px-6 py-8 md:px-24 md:py-12 !max-w-[var(--breakpoint-2xl)] flex-col">
        <h1 className="font-medium md:text-xl text-black mb-2 flex flex-col pb-4">
          <span>{ui.mainHeading}</span>
          <span>{ui.subHeading}</span>
        </h1>

        <div className="flex flex-wrap md:flex-nowrap gap-12 md:gap-28">
          {/* Form Section */}
          <div className="lg:w-2/3">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              {/* Email and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInputAtom
                  id="businessEmail"
                  name="businessEmail"
                  label={ui.fieldLabels.businessEmail}
                  type="email"
                  value={formData.businessEmail}
                  onChange={handleInputChange}
                  error={errors.businessEmail}
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
              </div>

              {/* Country and Company */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectAtom
                  id="countryOrRegion"
                  name="countryOrRegion"
                  label={ui.fieldLabels.countryOrRegion}
                  value={formData.countryOrRegion}
                  onChange={handleInputChange}
                  options={countries}
                  error={errors.countryOrRegion}
                  required
                />
                <TextInputAtom
                  id="company"
                  name="company"
                  label={ui.fieldLabels.company}
                  value={formData.company}
                  onChange={handleInputChange}
                  error={errors.company}
                  required
                />
              </div>

              {/* Job Title and Research Topic */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInputAtom
                  id="jobTitle"
                  name="jobTitle"
                  label={ui.fieldLabels.jobTitle}
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                />
                <TextInputAtom
                  id="researchTopic"
                  name="researchTopic"
                  label={ui.fieldLabels.researchTopic}
                  value={formData.researchTopic}
                  onChange={handleInputChange}
                  error={errors.researchTopic}
                  required
                />
              </div>

              {/* Project Details */}
              <TextareaAtom
                id="projectDetails"
                name="projectDetails"
                label={ui.fieldLabels.projectDetails}
                value={formData.projectDetails}
                onChange={handleInputChange}
                error={errors.projectDetails}
                required
                rows={4}
              />

              {/* How can we help you today */}
              <CheckboxGroupAtom
                label={ui.fieldLabels.helpOptions}
                options={helpOptions}
                selectedValues={formData.helpOptions}
                onChange={handleCheckboxGroupChange('helpOptions')}
                columns={2}
              />

              {/* Type of Research */}
              <CheckboxGroupAtom
                label={ui.fieldLabels.researchType}
                options={researchTypes}
                selectedValues={formData.researchType}
                onChange={handleCheckboxGroupChange('researchType')}
                columns={2}
              />

              {/* Consent Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-black">
                  {ui.consentSection.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {ui.consentSection.description}
                </p>

                <div className="space-y-3">
                  <CheckboxAtom
                    id="consentCommunication"
                    name="consentCommunication"
                    checked={formData.consentCommunication}
                    onChange={handleInputChange}
                    label={ui.checkboxLabels.consentCommunication}
                  />

                  <CheckboxAtom
                    id="consentMarketing"
                    name="consentMarketing"
                    checked={formData.consentMarketing}
                    onChange={handleInputChange}
                    label={ui.checkboxLabels.consentMarketing}
                  />

                  <CheckboxAtom
                    id="consentSubscribe"
                    name="consentSubscribe"
                    checked={formData.consentSubscribe}
                    onChange={handleInputChange}
                    label={ui.checkboxLabels.consentSubscribe}
                  />
                </div>

                <p className="text-xs">
                  You may{' '}
                  <Link
                    to={ROUTES.PRIVACY_POLICY}
                    viewTransition={true}
                    className="underline"
                  >
                    {ui.buttons.unsubscribe}
                  </Link>{' '}
                  from these communications anytime. For information on how to
                  unsubscribe, as well as our privacy practices and commitment
                  to protecting your privacy, check out our{' '}
                  <Link
                    to={ROUTES.PRIVACY_POLICY}
                    viewTransition={true}
                    className="underline"
                  >
                    {ui.buttons.privacyPolicy}
                  </Link>
                  .
                </p>
              </div>

              {/* Submit Button */}
              <CustomButtonAtom
                label={isSubmitting ? ui.buttons.submitting : ui.buttons.submit}
                className="py-2 px-14"
                disabled={!isSubmitting}
              />
            </form>
          </div>

          {/* Contact Info Section */}
          <div className="lg:w-1/3 text-end">
            <div className="p-4 sticky top-4 border-y-1 border-black w-full">
              <h3 className="text-xl font-medium text-black mb-4">
                {ui.contactInfo.title}
              </h3>
              <div className="space-y-3">
                <div className="text-2xl md:text-3xl">
                  {ui.contactInfo.phone}
                </div>
                <div className="text-xl md:text-2xl">
                  {ui.contactInfo.email}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchForm;
