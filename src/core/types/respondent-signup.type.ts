// Form Data Interface - Aligned with Backend SignUpData
export interface RespondentRegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string; // Frontend validation only, not sent to backend
  phone?: string;
  dateOfBirth?: {
    month: string;
    day: string;
    year: string;
  };
  gender?: string;
  location?: {
    doorNumberOrStreetName?: string;
    city?: string;
    zipCode?: string;
    district?: string;
    state?: string;
    countryOrRegion?: string;
  };
  participationPreferences?: string[];
  termsAccepted: boolean;
  privacyAccepted: boolean;

  paymentMethod?: 'upi' | 'bank' | 'skip';

  payment?: {
    upiId?: string;
    upiFullName?: string;
    upiMobileNumber?: string;

    bankAccountNumber?: string;
    bankIfscCode?: string;
    bankAccountHolderName?: string;
  };
}

// Store Interface
export interface RespondentRegistrationFormStore {
  formData: RespondentRegistrationFormData;
  currentStep: number;
  isSubmitting: boolean;
  isSubmitted: boolean;
  errors: Record<string, string | undefined>;
  countryCode: string;

  updateField: (
    field: string,
    value: string | boolean | string[] | Record<string, string>
  ) => void;
  updateCountryCode: (code: string) => void;
  nextStep: () => void;
  previousStep: () => void;
  resetForm: () => void;
  submitForm: (
    onSubmit: (formData: RespondentRegistrationFormData) => Promise<void>
  ) => Promise<void>;
  validateStep: (step: number) => boolean;
}
