// Form Data Interface
export interface ResearchFormData {
  firstName: string;
  lastName: string;
  businessEmail: string;
  phone: string;
  countryOrRegion: string;
  company: string;
  jobTitle: string;
  researchTopic: string;
  projectDetails: string;
  helpOptions: string[];
  researchType: string[];
  consentCommunication: boolean;
  consentMarketing: boolean;
  consentSubscribe: boolean;
}

// Store Interface
export interface ResearchFormStore {
  formData: ResearchFormData;
  isSubmitting: boolean;
  isSubmitted: boolean;
  errors: Partial<ResearchFormData>;
  countryCode: string;

  updateField: (
    field: keyof ResearchFormData,
    value: string | boolean | string[]
  ) => void;
  updateCountryCode: (code: string) => void;
  resetForm: () => void;
  submitForm: () => Promise<void>;
  validateForm: () => boolean;
}
