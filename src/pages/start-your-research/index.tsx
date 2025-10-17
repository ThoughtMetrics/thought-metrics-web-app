import type { ResearchFormData } from '@/core/types/start-research-item.type';
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

import { ROUTES } from '@/routes/routeConfig';
import React, { useEffect, useState } from 'react';
import { useResearchFormStore } from '@/core/stores/research.store';
import { useResearchFormValidation } from '@/core/hooks/validation/use-research-form-validation';
import { useSubmitResearch } from '@/core/hooks/queries/research/index.queries';

const {
  countries,
  countryCodes,
  helpOptions,
  researchTypes,
  defaultCountryCode,
  ui,
} = startYourResearchConstants;

const ResearchForm: React.FC = () => {
  const { formData, updateField, resetForm } = useResearchFormStore();
  const { errors, validate, clearError, clearAllErrors } =
    useResearchFormValidation();
  const submitMutation = useSubmitResearch();
  const [countryCode, setCountryCode] = useState(defaultCountryCode);

  // Reset form on successful submission
  useEffect(() => {
    if (submitMutation.isSuccess) {
      const timer = setTimeout(() => {
        resetForm();
        clearAllErrors();
        submitMutation.reset();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [
    submitMutation.isSuccess,
    resetForm,
    clearAllErrors,
    submitMutation.reset,
    submitMutation,
  ]);

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
    clearError(name);
  };

  const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCountryCode(e.target.value);
  };

  const handleCheckboxGroupChange =
    (field: keyof ResearchFormData) => (selectedValues: string[]) => {
      updateField(field, selectedValues);
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate with original data (phone without country code)
    if (!validate(formData)) return;

    // Prepare data for submission - clean up empty strings
    const submitData: any = {
      ...formData,
      countryCode,
      phone: countryCode + formData.phone,
    };

    // Replace empty strings with null or remove them
    Object.keys(submitData).forEach((key) => {
      if (submitData[key] === '') {
        delete submitData[key];
      }
    });

    submitMutation.mutate(submitData);
  };

  if (submitMutation.isSuccess) {
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
      <div className="form-1-component w-full min-h-[240px] md:min-h-[480px] xxl:p-0 z-1 flex items-center relative justify-center">
        <div className="flex absolute w-full h-[95%] justify-end top-1/2 transform -translate-y-1/2">
          <IllustrationSquares2 className="h-full w-auto stroke-1" />
        </div>
        <div className="common-container px-6 py-8 md:px-24 md:py-24 !max-w-[1336px]">
          <h2 className="text-xl md:text-4xl font-semibold text-white">
              {ui.pageTitle}
          </h2>
        </div>
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
                  error={errors.phone}
                  required
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
                  error={errors.jobTitle}
                  required
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
                    error={errors.consentCommunication}
                    required
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
                  <a
                    href={ROUTES.UNSUBSCRIBE}
                    
                    className="underline"
                  >
                    {ui.buttons.unsubscribe}
                  </a>{' '}
                  from these communications anytime. For information on how to
                  unsubscribe, as well as our privacy practices and commitment
                  to protecting your privacy, check out our{' '}
                  <a
                    href={ROUTES.PRIVACY_POLICY}
                    
                    className="underline"
                  >
                    {ui.buttons.privacyPolicy}
                  </a>
                  .
                </p>
              </div>

              {/* Submit Button */}
              <CustomButtonAtom
                type="submit"
                label={
                  submitMutation.isPending
                    ? ui.buttons.submitting
                    : ui.buttons.submit
                }
                className="py-2 px-14"
                disabled={submitMutation.isPending}
                loading={submitMutation.isPending}
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
