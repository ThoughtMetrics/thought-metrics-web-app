import type React from 'react';
import { reportDownloadConstant } from './constant';
import type {
  DownloadReportFormData,
  DownloadReportFormStore,
} from '@/core/types/report-download-form.type';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes/routeConfig';
import {
  CheckboxAtom,
  PhoneInputAtom,
  SelectAtom,
  TextInputAtom,
} from '@/shared/ui/atoms/custom-input';
import CustomButtonAtom from '@/shared/ui/atoms/custom-button';
import { IllustrationLoginIcon, Logo } from '@/assets';

const {
  initialFormData,
  countries,
  countryCodes,
  defaultCountryCode,
  storeName,
  validationMessages,
  emailRegex,
  formResetDelay,
  apiSimulationDelay,
  ui,
} = reportDownloadConstant;

const emailRegexPattern = new RegExp(emailRegex);

// Zustand store
const useReportDownloadFormStore = create<DownloadReportFormStore>()(
  devtools(
    (set, get) => ({
      formData: initialFormData as DownloadReportFormData,
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
            formData: initialFormData as DownloadReportFormData,
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
        const errors: Partial<DownloadReportFormData> = {};

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

          console.log('Whitepaper form submitted:', formData);

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

const ReportDownloadPage: React.FC = () => {
  const {
    formData,
    isSubmitting,
    isSubmitted,
    errors,
    countryCode,
    updateField,
    updateCountryCode,
    submitForm,
  } = useReportDownloadFormStore();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      updateField(name as keyof DownloadReportFormData, checked);
    } else {
      updateField(name as keyof DownloadReportFormData, value);
    }
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
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
    <div className="common-component w-full relative bg-white text-black z-1 overflow-scroll flex-col items-center !justify-start hide-scrollbar">
      <header className="common-container bg-white !max-w-[var(--breakpoint-2xl)] h-[3.5rem]">
        <nav className="px-6 py-3 xxl:px-0 flex items-center justify-between w-full">
          <Link viewTransition={true} to={ROUTES.HOME}>
            <div className="w-45 pt-1">
              <Logo className="w-full h-full" />
            </div>
          </Link>
        </nav>
      </header>
      <div className="relative md:h-[calc(100vh-3.5rem)] w-full">
        <div className="lg:block md:absolute left-0 w-[full%] md:w-[50%] h-full bg-[url('/images/background_image_5.png')] bg-cover bg-center bg-no-repeat -z-1 text-black px-6 py-10 md:px-18 md:py-16">
          <p className="flex flex-col">
            <span className="text-xl font-medium">
              Use of AI in User Experience Research
            </span>
            <span>
              As user expectations evolve faster than ever, traditional research
              methods struggle to keep up. This eBook uncovers how AI is
              transforming the UX research process — automating data collection,
              analyzing sentiment in real-time, and uncovering patterns that
              were once invisible to human eyes. Whether you're a researcher,
              designer, or product strategist, this guide will help you
              understand the real-world power of AI in shaping better
              experiences.
            </span>
            In this report, you’ll learn:
            <ul className="list-disc list-inside">
              <li>
                How AI is streamlining qualitative and quantitative data
                analysis
              </li>
              <li>
                Ways to use sentiment and intent detection to improve product
                decisions
              </li>
              <li>What adaptive, AI-powered surveys look like in action</li>
              <li>
                How top teams are integrating AI into their UX research stack
              </li>
            </ul>
          </p>
        </div>
        <IllustrationLoginIcon className="hidden lg:block absolute bottom-0 left-0 w-[50%] h-fit z-1" />
        <div className="common-container h-full !grid grid-cols-1 md:grid-cols-[50%_50%] inset-ring-custom-grey-1 inset-ring-1">
          <div className=""></div>
          <div className="h-full md:overflow-y-auto px-6 py-10 md:px-18 md:py-16">
            <h1 className="text-2xl font-medium text-gray-900 mb-2">
              {ui.mainHeading}
            </h1>
            <p className="text-gray-600 mb-6">
              {ui.loginPrompt}{' '}
              <Link
                to={ROUTES.AUTH}
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                {ui.loginLink}
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              {/* Job Title */}
              <TextInputAtom
                id="jobTitle"
                name="jobTitle"
                label={ui.fieldLabels.jobTitle}
                value={formData.jobTitle}
                onChange={handleInputChange}
              />

              {/* Consent Checkboxes */}
              <div className="space-y-4 pt-4">
                <CheckboxAtom
                  id="subscribeNewsletter"
                  name="subscribeNewsletter"
                  checked={formData.subscribeNewsletter}
                  onChange={handleInputChange}
                  label={ui.checkboxLabels.subscribeNewsletter}
                />

                <CheckboxAtom
                  id="dataUsageConsent"
                  name="dataUsageConsent"
                  checked={formData.dataUsageConsent}
                  onChange={handleInputChange}
                  label={ui.checkboxLabels.dataUsageConsent}
                  // className={
                  //   errors.dataUsageConsent
                  //     ? 'border-l-2 border-primary pl-3'
                  //     : ''
                  // }
                />
                {/* {errors.dataUsageConsent && (
                <p className="text-sm text-primary ml-7">
                  {errors.dataUsageConsent}
                </p>
              )} */}
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <CustomButtonAtom
                  label={
                    isSubmitting ? ui.buttons.downloading : ui.buttons.download
                  }
                  className="w-full md:w-fit py-4 md:py-6 md:px-24 rounded-none text-white font-semibold"
                  disabled={isSubmitting}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDownloadPage;
