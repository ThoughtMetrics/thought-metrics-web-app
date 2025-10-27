// Form Data Interface
export interface UnsubscribeFormData {
  reasons: string[];
}

// Store Interface
export interface UnsubscribeFormStore {
  formData: UnsubscribeFormData;
  isSubmitting: boolean;
  isSubmitted: boolean;

  updateReasons: (reasons: string[]) => void;
  resetForm: () => void;
  setSubmitting: (isSubmitting: boolean) => void;
  setSubmitted: (isSubmitted: boolean) => void;
}
