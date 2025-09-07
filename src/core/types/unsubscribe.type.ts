// Form Data Interface
export interface UnsubscribeFormData {
  email: string;
  reasons: string[];
}

// Store Interface
export interface UnsubscribeFormStore {
  formData: UnsubscribeFormData;
  isSubmitting: boolean;
  isSubmitted: boolean;
  errors: Record<string, string | undefined>;

  updateField: (field: string, value: string | boolean | string[]) => void;
  resetForm: () => void;
  submitForm: () => Promise<void>;
  validateStep: (step: number) => boolean;
}
