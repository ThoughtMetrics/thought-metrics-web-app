import React from 'react';
import { Link } from 'react-router-dom';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ROUTES } from '@/routes/routeConfig';
import CustomButtonAtom from '@/shared/ui/atoms/custom-button';
import {
  TextInputAtom,
  TextareaAtom,
  PhoneInputAtom,
} from '@/shared/ui/atoms/custom-input';
import { landing } from '@/pages/landing/landing.constant';
import type {
  PartnershipFormData,
  PartnershipFormStore,
} from '@/core/types/partnership-form.type';

// Destructure constants
const {
  initialFormData,
  countryCodes,
  defaultCountryCode,
  storeName,
  validationMessages,
  emailRegex,
  formResetDelay,
  apiSimulationDelay,
  ui,
} = landing.advocate.formsSection.inputForm;

const emailRegexPattern = new RegExp(emailRegex);

const usePartnershipFormStore = create<PartnershipFormStore>()(
  devtools(
    (set, get) => ({
      formData: initialFormData as PartnershipFormData,
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
            formData: initialFormData as PartnershipFormData,
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
        const errors: Partial<PartnershipFormData> = {};

        if (!formData.firstName.trim())
          errors.firstName = validationMessages.firstName;
        if (!formData.lastName.trim())
          errors.lastName = validationMessages.lastName;
        if (!formData.email.trim())
          errors.email = validationMessages.email.required;
        else if (!emailRegexPattern.test(formData.email))
          errors.email = validationMessages.email.invalid;
        if (!formData.instagramHandle.trim())
          errors.instagramHandle = validationMessages.instagramHandle;
        if (!formData.supportGroups.trim())
          errors.supportGroups = validationMessages.supportGroups;
        if (!formData.audienceDescription.trim())
          errors.audienceDescription = validationMessages.audienceDescription;
        if (!formData.partnershipReason.trim())
          errors.partnershipReason = validationMessages.partnershipReason;

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

          console.log('Partnership form submitted:', formData);

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
              errors: { email: validationMessages.submitError },
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

const PartnershipForm: React.FC = () => {
  const {
    formData,
    isSubmitting,
    isSubmitted,
    errors,
    countryCode,
    updateField,
    updateCountryCode,
    submitForm,
  } = usePartnershipFormStore();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    updateField(name as keyof PartnershipFormData, value);
  };

  const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateCountryCode(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submitForm();
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-6">
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
          <h2 className="text-2xl font-bold text-black mb-2">
            {ui.successMessage.title}
          </h2>
          <p className="text-black">{ui.successMessage.description}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="common-component bg-custom-pink text-black flex-col items-center relative">
        
        <div className="absolute right-0 hidden lg:block h-full w-[45%] bg-[url('/images/landing_page_6.png')] bg-cover bg-no-repeat bg-center"></div>
        <div className="container px-6 lg:px-0 py-12 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-18">
            {/* Form Section */}
            <div>
              <h1 className=" text-3xl font-bold text-black mb-2">
                {ui.mainHeading}
              </h1>
              <p className="text-black mb-8 leading-relaxed">
                {ui.description}
              </p>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
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
                  <TextInputAtom
                    id="instagramHandle"
                    name="instagramHandle"
                    label={ui.fieldLabels.instagramHandle}
                    value={formData.instagramHandle}
                    onChange={handleInputChange}
                  />
                  <TextInputAtom
                    id="instagramFollowers"
                    name="instagramFollowers"
                    label={ui.fieldLabels.instagramFollowers}
                    value={formData.instagramFollowers}
                    onChange={handleInputChange}
                  />
                  <TextInputAtom
                    id="xHandle"
                    name="xHandle"
                    label={ui.fieldLabels.xHandle}
                    value={formData.xHandle}
                    onChange={handleInputChange}
                  />
                  <TextInputAtom
                    id="xFollowers"
                    name="xFollowers"
                    label={ui.fieldLabels.xFollowers}
                    value={formData.xFollowers}
                    onChange={handleInputChange}
                  />
                  <TextInputAtom
                    id="linkedinUrl"
                    name="linkedinUrl"
                    label={ui.fieldLabels.linkedinUrl}
                    value={formData.linkedinUrl}
                    onChange={handleInputChange}
                  />
                  <TextInputAtom
                    id="linkedinConnections"
                    name="linkedinConnections"
                    label={ui.fieldLabels.linkedinConnections}
                    value={formData.linkedinConnections}
                    onChange={handleInputChange}
                  />
                  <TextInputAtom
                    id="youtubeChannel"
                    name="youtubeChannel"
                    label={ui.fieldLabels.youtubeChannel}
                    value={formData.youtubeChannel}
                    onChange={handleInputChange}
                  />
                  <TextInputAtom
                    id="youtubeFollowers"
                    name="youtubeFollowers"
                    label={ui.fieldLabels.youtubeFollowers}
                    value={formData.youtubeFollowers}
                    onChange={handleInputChange}
                  />
                </div>
                {/* Partnership Details */}
                <p className="text-sm text-black font-medium pt-3">
                  {ui.fieldLabels.supportGroups}
                </p>
                <div className="space-y-4">
                  <div className=""></div>
                  <TextareaAtom
                    id="supportGroups"
                    name="supportGroups"
                    label={ui.placeholders.supportGroups}
                    value={formData.supportGroups}
                    onChange={handleInputChange}
                    rows={1}
                  />
                  <TextareaAtom
                    id="audienceDescription"
                    name="audienceDescription"
                    label={ui.fieldLabels.audienceDescription}
                    value={formData.audienceDescription}
                    onChange={handleInputChange}
                    rows={1}
                  />
                  <TextareaAtom
                    id="partnershipReason"
                    name="partnershipReason"
                    label={ui.fieldLabels.partnershipReason}
                    value={formData.partnershipReason}
                    onChange={handleInputChange}
                    rows={1}
                  />
                </div>
                {/* Privacy Notice */}
                <p className="text-sm text-black leading-relaxed">
                  {ui.privacyNote}
                </p>
                {/* Submit Button */}
                <CustomButtonAtom
                  label={
                    isSubmitting ? ui.buttons.submitting : ui.buttons.submit
                  }
                  className="py-2 px-12 font-semibold bg-secondary hover:bg-custom-blue"
                  disabled={isSubmitting}
                />
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-2.5 bg-gradient-to-r from-secondary to-primary"></div>
      {/* Footer Links */}
      <div className="bg-white w-full flex justify-center">
        <div className="common-container !max-w-[var(--breakpoint-2xl)] space-x-8 px-6 py-4 md:px-24 flex items-center">
          <Link
            to={ROUTES.PRIVACY_POLICY}
            className="text-sm md:text-lg text-black font-medium hover:font-regular underline"
          >
            {ui.footerLinks.privacyPolicy}
          </Link>
          <Link
            to={ROUTES.PRIVACY_POLICY}
            className="text-sm md:text-lg text-black font-medium hover:font-regular underline"
          >
            {ui.footerLinks.unsubscribe}
          </Link>
          <Link
            to={ROUTES.CONTACT_US}
            className="text-sm md:text-lg text-black font-medium hover:font-regular underline"
          >
            {ui.footerLinks.getHelp}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PartnershipForm;
