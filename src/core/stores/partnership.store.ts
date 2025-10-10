import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { PartnershipFormData } from '@/core/types/partnership-form.type';

interface PartnershipFormStore {
  formData: PartnershipFormData;
  updateField: (field: keyof PartnershipFormData, value: any) => void;
  resetForm: () => void;
}

export const initialFormData: PartnershipFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  countryCode: '+91',
  instagramHandle: '',
  instagramFollowers: '',
  xHandle: '',
  xFollowers: '',
  linkedinUrl: '',
  linkedinConnections: '',
  youtubeChannel: '',
  youtubeFollowers: '',
  supportGroups: '',
  audienceDescription: '',
  partnershipReason: '',
};

const storeImplementation = (set: any) => ({
  formData: initialFormData,
  updateField: (field: keyof PartnershipFormData, value: any) =>
    set(
      (state: PartnershipFormStore) => ({ formData: { ...state.formData, [field]: value } }),
      false,
      `updateField_${field}`
    ),
  resetForm: () => set({ formData: initialFormData }, false, 'resetForm'),
});

export const usePartnershipFormStore = create<PartnershipFormStore>()(
  import.meta.env.DEV
    ? devtools(storeImplementation, { name: 'partnership-form' })
    : storeImplementation
);
