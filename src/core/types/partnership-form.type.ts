export interface PartnershipFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  instagramHandle: string;
  instagramFollowers: string;
  xHandle: string;
  xFollowers: string;
  linkedinUrl: string;
  linkedinConnections: string;
  youtubeChannel: string;
  youtubeFollowers: string;
  supportGroups: string;
  audienceDescription: string;
  partnershipReason: string;
}

// Store Interface
export interface PartnershipFormStore {
  formData: PartnershipFormData;
  isSubmitting: boolean;
  isSubmitted: boolean;
  errors: Partial<PartnershipFormData>;
  countryCode: string;

  updateField: (field: keyof PartnershipFormData, value: string) => void;
  updateCountryCode: (code: string) => void;
  resetForm: () => void;
  submitForm: () => Promise<void>;
  validateForm: () => boolean;
}
