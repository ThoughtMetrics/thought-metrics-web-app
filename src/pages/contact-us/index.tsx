import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IllustrationSquares2 } from '@/assets';
import { ROUTES } from '@/routes/routeConfig';
import CustomButtonAtom from '@/shared/ui/atoms/custom-button';
import {
  CheckboxAtom,
  PhoneInputAtom,
  TextareaAtom,
  TextInputAtom,
} from '@/shared/ui/atoms/custom-input';
import { contactUsConstants } from './contact-us.constants';
import { useContactFormStore } from '@/core/stores/contact-us.store';
import { useContactFormValidation } from '@/core/hooks/validation/use-contact-us-form-validation';
import { useSubmitContactForm } from '@/core/hooks/queries/contact-us/index.queries';

const { countryCodes, defaultCountryCode, ui } = contactUsConstants;

const ContactUs: React.FC = () => {
  const { formData, updateField, resetForm } = useContactFormStore();
  const { errors, validate, clearError, clearAllErrors } =
    useContactFormValidation();
  const submitMutation = useSubmitContactForm();
  const [countryCode, setCountryCode] = React.useState(defaultCountryCode);

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
  ]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const finalValue =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    updateField(name as keyof typeof formData, finalValue);
    clearError(name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate(formData)) return;

    // Prepare data for submission
    const submitData = {
      ...formData,
      phone: countryCode + formData.phone,
    };

    submitMutation.mutate(submitData);
  };

  // Show success state
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {ui.successMessage.title}
          </h2>
          <p className="text-gray-600">{ui.successMessage.description}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="common-component bg-white text-black flex-col items-center">
      {/* Header Section */}
      <div className="form-1-component w-full min-h-[240px] md:min-h-[480px] z-1 flex items-center relative justify-center">
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

      {/* Form Section */}
      <div className="common-container px-6 py-8 md:px-24 md:py-12 !max-w-[var(--breakpoint-2xl)] flex-col">
        <h1 className="text-3xl font-semibold text-gray-900 mb-4">
          {ui.mainHeading}
        </h1>

        <div className="flex flex-wrap md:flex-nowrap gap-12 md:gap-28">
          <div className="lg:w-2/3">
            <p className="text-gray-600 mb-8">{ui.description}</p>

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
                  onCountryCodeChange={(e) => setCountryCode(e.target.value)}
                  countryCodes={countryCodes}
                />
              </div>

              {/* Reference Number */}
              <TextInputAtom
                id="caseStudyRefNumber"
                name="caseStudyRefNumber"
                label={ui.fieldLabels.caseStudyRefNumber}
                value={formData.caseStudyRefNumber}
                onChange={handleInputChange}
              />

              <p className="text-sm text-gray-600">{ui.referenceNumberNote}</p>

              {/* Subject */}
              <TextInputAtom
                id="subject"
                name="subject"
                label={ui.fieldLabels.subject}
                value={formData.subject}
                onChange={handleInputChange}
                error={errors.subject}
                required
              />

              {/* Message */}
              <TextareaAtom
                id="message"
                name="message"
                label={ui.fieldLabels.message}
                value={formData.message}
                onChange={handleInputChange}
                error={errors.message}
                required
                rows={6}
              />

              {/* Consent Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
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
                    required
                    error={errors.consentCommunication}
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
                  <Link to={ROUTES.UNSUBSCRIBE} className="underline">
                    {ui.buttons.unsubscribe}
                  </Link>{' '}
                  from these communications anytime. For information on how to
                  unsubscribe, as well as our privacy practices and commitment
                  to protecting your privacy, check out our{' '}
                  <Link to={ROUTES.PRIVACY_POLICY} className="underline">
                    {ui.buttons.privacyPolicy}
                  </Link>
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
              <h3 className="text-xl font-medium text-gray-900 mb-4">
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

export default ContactUs;
