// contact-us.type.ts
export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  caseStudyRefNumber: string;
  subject: string;
  message: string;
  consentCommunication: boolean;
  consentMarketing: boolean;
  consentSubscribe: boolean;
}

// Store Interface
export interface ContactFormStore {
  formData: ContactFormData;
  isSubmitting: boolean;
  isSubmitted: boolean;
  errors: Partial<ContactFormData>;
  countryCode: string;

  // Actions
  updateField: (field: keyof ContactFormData, value: string | boolean) => void;
  updateCountryCode: (code: string) => void;
  resetForm: () => void;
  submitForm: () => Promise<void>;
  validateForm: () => boolean;
}
