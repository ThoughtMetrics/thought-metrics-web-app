// Form Data Interface
export interface LoginFormData {
  thoughtMetricsId: string;
  password: string;
  rememberMe: boolean;
}

// Store Interface
export interface LoginFormStore {
  formData: LoginFormData;
  isSubmitting: boolean;
  isSubmitted: boolean;
  errors: Partial<LoginFormData>;
  loginError: string;

  updateField: (field: keyof LoginFormData, value: string | boolean) => void;
  resetForm: () => void;
  submitForm: (onSubmit: (email: string, password: string) => Promise<void>) => Promise<void>;
  validateForm: () => boolean;
}
