// Form Data Interface
export interface DownloadReportFormData {
  firstName: string;
  lastName: string;
  businessEmail: string;
  phone: string;
  countryOrRegion: string;
  company: string;
  jobTitle: string;
  subscribeNewsletter: boolean;
  dataUsageConsent: boolean;
}

// Store Interface
export interface DownloadReportFormStore {
  formData: DownloadReportFormData;
  isSubmitting: boolean;
  isSubmitted: boolean;
  errors: Partial<DownloadReportFormData>;
  countryCode: string;

  updateField: (
    field: keyof DownloadReportFormData,
    value: string | boolean
  ) => void;
  updateCountryCode: (code: string) => void;
  resetForm: () => void;
  submitForm: () => Promise<void>;
  validateForm: () => boolean;
}
