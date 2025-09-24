// Form Data Interface
export interface RegistrationFormData {
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  countryOrRegion: string;
  password: string;
  confirmPassword: string;
  zipCode: string;
  dateOfBirth: {
    month: string;
    day: string;
    year: string;
  };
  participationPreferences: string[];
  termsAccepted: boolean;
  privacyAccepted: boolean;
}

// Store Interface
export interface RegistrationFormStore {
  formData: RegistrationFormData;
  currentStep: number;
  isSubmitting: boolean;
  isSubmitted: boolean;
  errors: Record<string, string | undefined>;
  countryCode: string;

  updateField: (field: string, value: any) => void;
  updateCountryCode: (code: string) => void;
  nextStep: () => void;
  previousStep: () => void;
  resetForm: () => void;
  submitForm: () => Promise<void>;
  validateStep: (step: number) => boolean;
}
