// Form Data Interface
export interface WhitepaperFormData {
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
export interface WhitepaperFormStore {
  formData: WhitepaperFormData;
  isSubmitting: boolean;
  isSubmitted: boolean;
  errors: Partial<WhitepaperFormData>;
  countryCode: string;

  updateField: (
    field: keyof WhitepaperFormData,
    value: string | boolean
  ) => void;
  updateCountryCode: (code: string) => void;
  resetForm: () => void;
  submitForm: () => Promise<void>;
  validateForm: () => boolean;
}
