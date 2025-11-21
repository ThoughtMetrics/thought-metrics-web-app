import React, { useEffect, useState } from 'react';
import CustomButtonAtom from '@/shared/ui/atoms/custom-button';
import {
  TextInputAtom,
  TextareaAtom,
  PhoneInputAtom,
} from '@/shared/ui/atoms/custom-input';
import { landing } from '@/core/constants/page-constants/landing-constant';
import { usePartnershipFormStore } from '@/core/stores/partnership.store';
import { usePartnershipFormValidation } from '@/core/hooks/validation/use-partnership-form-validation';
import { useSubmitPartnership } from '@/core/hooks/queries/partnership/index.queries';

// Destructure constants
const { countryCodes, defaultCountryCode, ui, advocateId } =
  landing.advocate.formsSection.inputForm;

const PartnershipForm: React.FC = () => {
  const { formData, updateField, resetForm } = usePartnershipFormStore();
  const { errors, validate, clearError, clearAllErrors } =
    usePartnershipFormValidation();
  const submitMutation = useSubmitPartnership();
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    updateField(name as keyof typeof formData, value);
    clearError(name);
  };

  const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCountryCode(e.target.value);
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
      <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-50 flex items-center justify-center p-6">
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
      <div className="common-component bg-custom-pink text-black flex-col items-center relative" id={advocateId}>
        <div className="absolute right-0 hidden lg:block h-full w-[45%] bg-[url('images/landing_page_6.png')] bg-cover bg-no-repeat bg-center"></div>
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
                    error={errors.phone}
                    required
                  />
                  <TextInputAtom
                    id="instagramHandle"
                    name="instagramHandle"
                    label={ui.fieldLabels.instagramHandle}
                    value={formData.instagramHandle}
                    onChange={handleInputChange}
                    error={errors.instagramHandle}
                  />
                  <TextInputAtom
                    id="instagramFollowers"
                    name="instagramFollowers"
                    label={ui.fieldLabels.instagramFollowers}
                    value={formData.instagramFollowers}
                    onChange={handleInputChange}
                    error={errors.instagramFollowers}
                  />
                  <TextInputAtom
                    id="xHandle"
                    name="xHandle"
                    label={ui.fieldLabels.xHandle}
                    value={formData.xHandle}
                    onChange={handleInputChange}
                    error={errors.xHandle}
                  />
                  <TextInputAtom
                    id="xFollowers"
                    name="xFollowers"
                    label={ui.fieldLabels.xFollowers}
                    value={formData.xFollowers}
                    onChange={handleInputChange}
                    error={errors.xFollowers}
                  />
                  <TextInputAtom
                    id="linkedinUrl"
                    name="linkedinUrl"
                    label={ui.fieldLabels.linkedinUrl}
                    value={formData.linkedinUrl}
                    onChange={handleInputChange}
                    error={errors.linkedinUrl}
                  />
                  <TextInputAtom
                    id="linkedinConnections"
                    name="linkedinConnections"
                    label={ui.fieldLabels.linkedinConnections}
                    value={formData.linkedinConnections}
                    onChange={handleInputChange}
                    error={errors.linkedinConnections}
                  />
                  <TextInputAtom
                    id="youtubeChannel"
                    name="youtubeChannel"
                    label={ui.fieldLabels.youtubeChannel}
                    value={formData.youtubeChannel}
                    onChange={handleInputChange}
                    error={errors.youtubeChannel}
                  />
                  <TextInputAtom
                    id="youtubeFollowers"
                    name="youtubeFollowers"
                    label={ui.fieldLabels.youtubeFollowers}
                    value={formData.youtubeFollowers}
                    onChange={handleInputChange}
                    error={errors.youtubeFollowers}
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
                    error={errors.supportGroups}
                    rows={1}
                  />
                  <TextareaAtom
                    id="audienceDescription"
                    name="audienceDescription"
                    label={ui.fieldLabels.audienceDescription}
                    value={formData.audienceDescription}
                    onChange={handleInputChange}
                    error={errors.audienceDescription}
                    rows={1}
                  />
                  <TextareaAtom
                    id="partnershipReason"
                    name="partnershipReason"
                    label={ui.fieldLabels.partnershipReason}
                    value={formData.partnershipReason}
                    onChange={handleInputChange}
                    error={errors.partnershipReason}
                    rows={1}
                  />
                </div>
                {/* Privacy Notice */}
                <p className="text-sm text-black leading-relaxed">
                  {ui.privacyNote}
                </p>
                {/* Submit Button */}
                <CustomButtonAtom
                  type="submit"
                  label={
                    submitMutation.isPending
                      ? ui.buttons.submitting
                      : ui.buttons.submit
                  }
                  className="py-2 px-12 font-semibold bg-secondary hover:bg-custom-blue"
                  disabled={submitMutation.isPending}
                  loading={submitMutation.isPending}
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnershipForm;
